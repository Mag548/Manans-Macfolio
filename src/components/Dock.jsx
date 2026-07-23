import gsap from 'gsap';
import useWindowStore from '#store/window.js';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { dockApps } from '#constants';
import { Tooltip } from 'react-tooltip';

const Dock = () => {
  const {openWindow, closeWindow, windows} = useWindowStore();
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = Array.from(dock.querySelectorAll('.dock-icon'));

    gsap.set(icons, { transformOrigin: '50% 100%' });

    const setters = icons.map((icon) => ({
      scale: gsap.quickTo(icon, 'scale', {
        duration: 0.15,
        ease: 'power2.out',
      }),
      y: gsap.quickTo(icon, 'y', {
        duration: 0.15,
        ease: 'power2.out',
      }),
    }));

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      const mouseX = e.clientX - left;

      icons.forEach((icon, i) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 15000);

        setters[i].scale(1 + 0.25 * intensity);
        setters[i].y(-15 * intensity);
      });
    };

    const resetIcons = () => {
      setters.forEach(({ scale, y }) => {
        scale(1);
        y(0);
      });
    };

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', resetIcons);

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', resetIcons);
    };
  }, []);

  const toggleApp = (app) => {
    if(!app.canOpen) return;

    const window = windows[app.id];

    if(window.isOpen) {
        closeWindow(app.id);
    } else {
        openWindow(app.id);
    }
  };


  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? '' : 'opacity-60'}
              />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
