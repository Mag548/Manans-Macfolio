import { useCallback, useEffect, useRef } from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';

const fitImageWindow = (img) => {
  if (!img?.naturalWidth) return;

  const section = img.closest('section.window-frame, .imgfile');
  if (!section || section.classList.contains('is-maximized')) return;

  const header = section.querySelector('#window-header');
  const preview = img.parentElement;
  const headerH = header?.offsetHeight || 44;
  const styles = preview ? getComputedStyle(preview) : null;
  const padX =
    (parseFloat(styles?.paddingLeft) || 8) +
    (parseFloat(styles?.paddingRight) || 8);
  const padY =
    (parseFloat(styles?.paddingTop) || 8) +
    (parseFloat(styles?.paddingBottom) || 8);

  const maxW = Math.min(window.innerWidth - 24, 960);
  const maxH = Math.min(window.innerHeight * 0.72, window.innerHeight - 140);

  const natW = img.naturalWidth;
  const natH = img.naturalHeight;
  const scale = Math.min(1, maxW / natW, maxH / natH);
  const drawW = Math.max(1, Math.round(natW * scale));
  const drawH = Math.max(1, Math.round(natH * scale));

  img.style.width = `${drawW}px`;
  img.style.height = `${drawH}px`;

  section.style.width = `${drawW + padX}px`;
  section.style.height = `${headerH + drawH + padY}px`;
  section.style.maxWidth = 'calc(100vw - 1.5rem)';
  section.style.maxHeight = 'min(85vh, calc(100dvh - 6rem))';
};

const Image = ({ windowKey }) => {
  const data = useWindowStore((s) => s.windows[windowKey]?.data);
  const isOpen = useWindowStore((s) => s.windows[windowKey]?.isOpen);
  const imgRef = useRef(null);

  const handleLoad = useCallback((event) => {
    fitImageWindow(event.currentTarget);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!isOpen || !img) return;
    if (img.complete && img.naturalWidth) {
      fitImageWindow(img);
    }
  }, [isOpen, data?.imageUrl]);

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target={windowKey} />
        <h2>{name}</h2>
      </div>

      <div className="preview">
        {imageUrl && (
          <img
            ref={imgRef}
            src={imageUrl}
            alt={name}
            onLoad={handleLoad}
          />
        )}
      </div>
    </>
  );
};

const ImageFrame = WindowWrapper(Image);

const ImageWindows = () => {
  const windows = useWindowStore((s) => s.windows);
  const imageKeys = Object.keys(windows).filter((key) =>
    key.startsWith('imgfile-')
  );

  return imageKeys.map((key) => (
    <ImageFrame key={key} windowKey={key} />
  ));
};

export default ImageWindows;
