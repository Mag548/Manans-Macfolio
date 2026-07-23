import { useRef, useLayoutEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useWindowStore from '#store/window.js';

gsap.registerPlugin(Draggable);

const MAXIMIZED_STYLE = {
  top: 40,
  left: 12,
  right: 12,
  bottom: 80,
  width: 'auto',
  maxWidth: 'none',
  transform: 'none',
};

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { windows, focusWindow } = useWindowStore();
    const {
      isOpen = false,
      isMinimized = false,
      isMaximized = false,
      zIndex = 0,
    } = windows[windowKey] ?? {};
    const ref = useRef(null);
    const draggableRef = useRef(null);
    const preMaximizePos = useRef({ x: 0, y: 0 });
    const visible = isOpen && !isMinimized;

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = visible ? 'block' : 'none';
    }, [visible]);

    // Snap into viewport on maximize; restore drag offset when un-maximizing
    useLayoutEffect(() => {
      const el = ref.current;
      const instance = draggableRef.current;
      if (!el) return;

      if (isMaximized) {
        preMaximizePos.current = {
          x: gsap.getProperty(el, 'x') || 0,
          y: gsap.getProperty(el, 'y') || 0,
        };
        gsap.set(el, { x: 0, y: 0 });
        instance?.disable();
      } else {
        gsap.set(el, {
          x: preMaximizePos.current.x,
          y: preMaximizePos.current.y,
        });
        instance?.enable();
        instance?.update(true);
      }
    }, [isMaximized]);

    useGSAP(
      () => {
        const el = ref.current;
        if (!el || !visible) return;

        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
            transformOrigin: '50% 50%',
          }
        );
      },
      { dependencies: [visible] }
    );

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });
      draggableRef.current = instance;

      return () => {
        instance?.kill();
        draggableRef.current = null;
      };
    }, []);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{
          zIndex,
          display: visible ? 'block' : 'none',
          ...(isMaximized ? MAXIMIZED_STYLE : {}),
        }}
        className="absolute"
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

  return Wrapped;
};

export default WindowWrapper;
