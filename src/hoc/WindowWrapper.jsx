import {
  createContext,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useWindowStore from '#store/window.js';

gsap.registerPlugin(Draggable);

const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

const SIZE_PROPS = [
  'width',
  'height',
  'left',
  'top',
  'right',
  'bottom',
  'marginLeft',
  'marginRight',
  'maxWidth',
];

const MAXIMIZED_STYLE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 'auto',
  maxWidth: 'none',
  height: 'auto',
  transform: 'none',
  marginLeft: 0,
  marginTop: 0,
};

const RESIZE_HANDLES = [
  { dir: 'n', cursor: 'ns-resize' },
  { dir: 's', cursor: 'ns-resize' },
  { dir: 'e', cursor: 'ew-resize' },
  { dir: 'w', cursor: 'ew-resize' },
  { dir: 'ne', cursor: 'nesw-resize' },
  { dir: 'nw', cursor: 'nwse-resize' },
  { dir: 'se', cursor: 'nwse-resize' },
  { dir: 'sw', cursor: 'nesw-resize' },
];

export const WindowFrameContext = createContext(null);

export const useWindowFrame = () => useContext(WindowFrameContext);

const clearInlineSize = (el) => {
  SIZE_PROPS.forEach((prop) => {
    el.style[prop] = '';
  });
};

const VIEWPORT_PAD = { top: 52, right: 12, bottom: 100, left: 12 };

const clampWindowToViewport = (el) => {
  if (!el || el.classList.contains('is-maximized')) return;

  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { top, right, bottom, left } = VIEWPORT_PAD;

  let dx = 0;
  let dy = 0;

  if (rect.right > vw - right) dx -= rect.right - (vw - right);
  if (rect.left + dx < left) dx = left - rect.left;

  if (rect.bottom > vh - bottom) dy -= rect.bottom - (vh - bottom);
  if (rect.top + dy < top) dy = top - rect.top;

  if (!dx && !dy) return;

  const x = Number(gsap.getProperty(el, 'x')) || 0;
  const y = Number(gsap.getProperty(el, 'y')) || 0;
  gsap.set(el, { x: x + dx, y: y + dy, xPercent: 0, yPercent: 0 });
};

const WindowWrapper = (Component, fixedWindowKey) => {
  const Wrapped = (props) => {
    const windowKey = props.windowKey ?? fixedWindowKey;
    const { windows, focusWindow, maximizeWindow } = useWindowStore();
    const {
      isOpen = false,
      isMinimized = false,
      isMaximized = false,
      zIndex = 0,
      offsetX = 0,
      offsetY = 0,
    } = windows[windowKey] ?? {};
    const ref = useRef(null);
    const draggableRef = useRef(null);
    const preMaximizePos = useRef({ x: 0, y: 0 });
    const isMaximizedRef = useRef(isMaximized);
    const visible = isOpen && !isMinimized;

    isMaximizedRef.current = isMaximized;

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = visible ? 'flex' : 'none';

      if (visible && !isMaximized) {
        clampWindowToViewport(el);
        draggableRef.current?.enable();
        draggableRef.current?.update(true);
      }
    }, [visible, isMaximized, offsetX, offsetY]);

    useLayoutEffect(() => {
      const el = ref.current;
      const instance = draggableRef.current;
      if (!el) return;

      if (isMaximized) {
        preMaximizePos.current = {
          x: Number(gsap.getProperty(el, 'x')) || 0,
          y: Number(gsap.getProperty(el, 'y')) || 0,
        };
        gsap.set(el, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        instance?.disable();
      } else {
        gsap.set(el, {
          x: preMaximizePos.current.x,
          y: preMaximizePos.current.y,
          xPercent: 0,
          yPercent: 0,
        });
        if (visible) {
          clampWindowToViewport(el);
          instance?.enable();
          instance?.update(true);
        }
      }
    }, [isMaximized, visible]);

    useGSAP(
      () => {
        const el = ref.current;
        if (!el || !visible) return;

        // Only animate scale/opacity — never y/x, or we fight Draggable
        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'power3.out',
            transformOrigin: '50% 50%',
            onComplete: () => {
              clampWindowToViewport(el);
              draggableRef.current?.update(true);
            },
          }
        );
      },
      { dependencies: [visible] }
    );

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      let instance = null;
      let cancelled = false;
      let rafId = 0;

      const setup = () => {
        if (cancelled) return;

        const header = el.querySelector('#window-header');
        // Wait until the window chrome exists — never use the whole panel as trigger
        if (!header) {
          rafId = requestAnimationFrame(setup);
          return;
        }

        instance?.kill();
        [instance] = Draggable.create(el, {
          trigger: header,
          allowEventDefault: true,
          ignore:
            'a, button, input, textarea, select, canvas, .model3d-body, .model3d-body *, .terminal-body, .terminal-body *, .txtfile-body, .preview, .content, .finder-item, .finder-item *, #window-controls, #window-controls *, .zoom-controls, .zoom-controls *, .reset-size-btn',
          onPress: () => focusWindow(windowKey),
        });
        draggableRef.current = instance;

        if (!visible || isMaximized) {
          instance.disable();
        }
      };

      setup();

      return () => {
        cancelled = true;
        if (rafId) cancelAnimationFrame(rafId);
        instance?.kill();
        if (draggableRef.current === instance) {
          draggableRef.current = null;
        }
      };
    }, [visible, windowKey, isMaximized]);

    const animateToOriginalSize = useCallback(() => {
      const el = ref.current;
      if (!el) return;

      const from = el.getBoundingClientRect();

      gsap.set(el, { x: 0, y: 0 });
      clearInlineSize(el);
      preMaximizePos.current = { x: 0, y: 0 };

      // Measure CSS-driven original layout
      void el.offsetWidth;
      const to = el.getBoundingClientRect();

      el.style.width = `${from.width}px`;
      el.style.height = `${from.height}px`;
      el.style.left = `${from.left}px`;
      el.style.top = `${from.top}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.marginLeft = '0';
      el.style.marginRight = '0';
      el.style.maxWidth = 'none';

      gsap.to(el, {
        width: to.width,
        height: to.height,
        left: to.left,
        top: to.top,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => draggableRef.current?.update(true),
        onComplete: () => {
          clearInlineSize(el);
          gsap.set(el, { x: 0, y: 0 });
          draggableRef.current?.update(true);
        },
      });
    }, []);

    const resetToOriginalSize = useCallback(() => {
      focusWindow(windowKey);

      if (isMaximizedRef.current) {
        maximizeWindow(windowKey);
        requestAnimationFrame(() => {
          requestAnimationFrame(animateToOriginalSize);
        });
        return;
      }

      animateToOriginalSize();
    }, [animateToOriginalSize, focusWindow, maximizeWindow, windowKey]);

    const handleResizeStart = useCallback(
      (event, dir) => {
        if (isMaximized) return;

        event.preventDefault();
        event.stopPropagation();

        const el = ref.current;
        if (!el) return;

        focusWindow(windowKey);
        gsap.killTweensOf(el);

        const rect = el.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const startW = rect.width;
        const startH = rect.height;
        const startL = rect.left;
        const startT = rect.top;

        gsap.set(el, { x: 0, y: 0 });
        el.style.left = `${startL}px`;
        el.style.top = `${startT}px`;
        el.style.width = `${startW}px`;
        el.style.height = `${startH}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.marginLeft = '0';
        el.style.marginRight = '0';
        el.style.maxWidth = 'none';

        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;

          let nextW = startW;
          let nextH = startH;
          let nextL = startL;
          let nextT = startT;

          if (dir.includes('e')) {
            nextW = Math.max(MIN_WIDTH, startW + dx);
          }
          if (dir.includes('s')) {
            nextH = Math.max(MIN_HEIGHT, startH + dy);
          }
          if (dir.includes('w')) {
            nextW = Math.max(MIN_WIDTH, startW - dx);
            nextL = startL + (startW - nextW);
          }
          if (dir.includes('n')) {
            nextH = Math.max(MIN_HEIGHT, startH - dy);
            nextT = startT + (startH - nextH);
          }

          el.style.width = `${nextW}px`;
          el.style.height = `${nextH}px`;
          el.style.left = `${nextL}px`;
          el.style.top = `${nextT}px`;
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          draggableRef.current?.update(true);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      },
      [focusWindow, isMaximized, windowKey]
    );

    const frameApi = useMemo(
      () => ({ resetToOriginalSize }),
      [resetToOriginalSize]
    );

    return (
      <WindowFrameContext.Provider value={frameApi}>
        <section
          id={windowKey}
          ref={ref}
          style={{
            zIndex,
            display: visible ? 'flex' : 'none',
            flexDirection: 'column',
            marginLeft: offsetX || undefined,
            marginTop: offsetY || undefined,
            ...(isMaximized ? MAXIMIZED_STYLE : {}),
          }}
          className={`absolute window-frame${isMaximized ? ' is-maximized' : ''}${
            String(windowKey).startsWith('imgfile') ? ' imgfile' : ''
          }`}
        >
          <Component {...props} />

          {!isMaximized &&
            RESIZE_HANDLES.map(({ dir, cursor }) => (
              <div
                key={dir}
                className={`window-resize-handle ${dir}`}
                style={{ cursor }}
                onPointerDown={(e) => handleResizeStart(e, dir)}
              />
            ))}
        </section>
      </WindowFrameContext.Provider>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

  return Wrapped;
};

export default WindowWrapper;
