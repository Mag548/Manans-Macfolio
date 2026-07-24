import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import gsap from 'gsap';
import WindowWrapper, { useWindowFrame } from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import ZoomControls from '#components/ZoomControls.jsx';
import { pdfjs, Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.1;

const Resume = () => {
  const bodyRef = useRef(null);
  const shellRef = useRef(null);
  const layerRef = useRef(null);
  const zoomTween = useRef({ value: 1 });
  const fittedRef = useRef({ width: 0, height: 0 });

  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [pageSize, setPageSize] = useState(null);
  const [zoom, setZoom] = useState(1);
  const { resetToOriginalSize } = useWindowFrame() ?? {};

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const update = () => {
      setContainer({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => gsap.killTweensOf(zoomTween.current);
  }, []);

  const handleLoadSuccess = async (pdf) => {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    setPageSize({ width: viewport.width, height: viewport.height });
  };

  const fitted = useMemo(() => {
    if (!pageSize || container.width <= 0 || container.height <= 0) {
      return { width: 0, height: 0 };
    }

    const scale = Math.min(
      container.width / pageSize.width,
      container.height / pageSize.height
    );
    const width = Math.max(1, Math.floor(pageSize.width * scale));
    const height = Math.max(1, Math.floor(pageSize.height * scale));
    return { width, height };
  }, [container, pageSize]);

  fittedRef.current = fitted;

  const applyZoomVisual = useCallback((z) => {
    const { width, height } = fittedRef.current;
    if (layerRef.current) {
      layerRef.current.style.transform = `scale(${z})`;
    }
    if (shellRef.current && width > 0) {
      shellRef.current.style.width = `${width * z}px`;
      shellRef.current.style.height = `${height * z}px`;
    }
  }, []);

  // Keep shell size in sync when the window (base fit) changes
  useEffect(() => {
    applyZoomVisual(zoomTween.current.value);
  }, [fitted, applyZoomVisual]);

  const animateZoomTo = useCallback(
    (target) => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, target));

      gsap.killTweensOf(zoomTween.current);
      gsap.to(zoomTween.current, {
        value: next,
        duration: 0.35,
        ease: 'power2.out',
        onUpdate: () => {
          const z = zoomTween.current.value;
          applyZoomVisual(z);
          setZoom(z);
        },
        onComplete: () => {
          zoomTween.current.value = next;
          applyZoomVisual(next);
          setZoom(next);
        },
      });
    },
    [applyZoomVisual]
  );

  const zoomIn = () => animateZoomTo(zoomTween.current.value + ZOOM_STEP);
  const zoomOut = () => animateZoomTo(zoomTween.current.value - ZOOM_STEP);
  const resetZoom = () => animateZoomTo(1);

  const isZoomed = Math.abs(zoom - 1) > 0.01;

  return (
    <>
      <div id="window-header">
        <div className="header-side header-side-left">
          <WindowControls target="resume" />
        </div>

        <h2>Resume.pdf</h2>

        <div className="header-side header-side-right">
          <ZoomControls
            zoom={zoom}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetZoom={resetZoom}
          />
          <button
            type="button"
            className="reset-size-btn"
            title="Reset to original size"
            onClick={resetToOriginalSize}
          >
            Reset size
          </button>
          <a
            href="/files/resume.pdf"
            download
            className="cursor-pointer"
            title="Download Resume"
          >
            <Download className="icon" />
          </a>
        </div>
      </div>

      <div
        ref={bodyRef}
        className={`resume-body${isZoomed ? ' is-zoomed' : ''}`}
      >
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={handleLoadSuccess}
          loading={<div className="resume-loading">Loading…</div>}
        >
          {fitted.width > 0 && (
            <div
              ref={shellRef}
              className="pdf-zoom-shell"
              style={{
                width: fitted.width * zoomTween.current.value,
                height: fitted.height * zoomTween.current.value,
              }}
            >
              <div
                ref={layerRef}
                className="pdf-zoom-layer"
                style={{
                  width: fitted.width,
                  height: fitted.height,
                  transform: `scale(${zoomTween.current.value})`,
                }}
              >
                <Page
                  pageNumber={1}
                  width={fitted.width}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </div>
            </div>
          )}
        </Document>
      </div>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;
