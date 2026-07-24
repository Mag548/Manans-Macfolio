import { useLayoutEffect, useRef, useState } from 'react';
import { locations } from '#constants';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import useWindowStore from '#store/window.js';
import useLocationStore from '#store/location.js';

gsap.registerPlugin(Draggable);

const projects = locations.experiences?.children ?? [];

const CELL_W = 200;
const CELL_H = 128;
const GAP = 24;
const NAV_H = 56;

const overlaps = (a, b, gap = GAP) =>
  !(
    a.left + a.width + gap <= b.left ||
    b.left + b.width + gap <= a.left ||
    a.top + a.height + gap <= b.top ||
    b.top + b.height + gap <= a.top
  );

const inflate = (rect, padX, padY = padX) => ({
  left: rect.left - padX,
  top: rect.top - padY,
  width: rect.width + padX * 2,
  height: rect.height + padY * 2,
});

const toLocalRect = (el, homeRect) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    left: r.left - homeRect.left,
    top: r.top - homeRect.top,
    width: r.width,
    height: r.height,
  };
};

const collidesAny = (candidate, rects) =>
  rects.some((rect) => overlaps(candidate, rect));

/** Deterministic grid — never random — so experience folders cannot overlap. */
const placeFolders = (count, homeRect, obstacles) => {
  const minLeft = GAP;
  const minTop = NAV_H + GAP;
  const maxLeft = Math.max(minLeft, homeRect.width - CELL_W - GAP);
  const maxTop = Math.max(minTop, homeRect.height - CELL_H - GAP);

  const stepX = CELL_W + GAP;
  const stepY = CELL_H + GAP;
  const cols = Math.max(1, Math.floor((maxLeft - minLeft) / stepX) + 1);
  const rows = Math.max(1, Math.floor((maxTop - minTop) / stepY) + 1);

  // Prefer a right-side column (classic desktop), then fill leftward.
  const slots = [];
  for (let col = cols - 1; col >= 0; col -= 1) {
    for (let row = 0; row < rows; row += 1) {
      slots.push({
        left: Math.min(maxLeft, minLeft + col * stepX),
        top: Math.min(maxTop, minTop + row * stepY),
        width: CELL_W,
        height: CELL_H,
      });
    }
  }

  const placed = [];
  for (let i = 0; i < count; i += 1) {
    let found = null;
    for (const slot of slots) {
      if (!collidesAny(slot, obstacles) && !collidesAny(slot, placed)) {
        found = slot;
        break;
      }
    }

    placed.push(
      found ?? {
        left: minLeft,
        top: minTop + i * stepY,
        width: CELL_W,
        height: CELL_H,
      }
    );
  }

  return placed.map(({ top, left }) => ({
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
  }));
};

const getFolderLocalRect = (el, homeRect) => {
  const r = el.getBoundingClientRect();
  return {
    left: r.left - homeRect.left,
    top: r.top - homeRect.top,
    width: Math.max(r.width, CELL_W),
    height: Math.max(r.height, CELL_H),
  };
};

const separateFolders = (folders, home) => {
  const homeRect = home.getBoundingClientRect();
  const maxLeft = homeRect.width - CELL_W - GAP;
  const maxTop = homeRect.height - CELL_H - GAP;

  for (let pass = 0; pass < 6; pass += 1) {
    for (let i = 0; i < folders.length; i += 1) {
      for (let j = i + 1; j < folders.length; j += 1) {
        const a = getFolderLocalRect(folders[i], homeRect);
        const b = getFolderLocalRect(folders[j], homeRect);
        if (!overlaps(a, b, GAP)) continue;

        const xA = Number(gsap.getProperty(folders[i], 'x')) || 0;
        const yA = Number(gsap.getProperty(folders[i], 'y')) || 0;
        const push = CELL_H + GAP - (b.top - a.top);
        if (push > 0) {
          const nextY = Math.min(maxTop - a.top + yA, yA + push);
          gsap.set(folders[j], {
            x: Number(gsap.getProperty(folders[j], 'x')) || 0,
            y: nextY,
          });
        } else {
          gsap.set(folders[j], {
            x: Math.min(maxLeft - b.left + (Number(gsap.getProperty(folders[j], 'x')) || 0), xA + CELL_W + GAP),
            y: Number(gsap.getProperty(folders[j], 'y')) || 0,
          });
        }
      }
    }
  }
};

const Home = () => {
  const homeRef = useRef(null);
  const setActiveLocation = useLocationStore((s) => s.setActiveLocation);
  const openWindow = useWindowStore((s) => s.openWindow);
  const [positions, setPositions] = useState([]);

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow('finder');
  };

  useLayoutEffect(() => {
    const home = homeRef.current;
    if (!home) return;

    let cancelled = false;

    const layout = () => {
      if (cancelled) return;
      const homeRect = home.getBoundingClientRect();
      const welcome = toLocalRect(document.getElementById('welcome'), homeRect);
      const dock = toLocalRect(document.getElementById('dock'), homeRect);

      const obstacles = [
        { left: 0, top: 0, width: homeRect.width, height: NAV_H },
      ];

      if (welcome) {
        obstacles.push(inflate(welcome, 28, 20));
      }

      if (dock) {
        obstacles.push(inflate(dock, 20, 24));
      } else {
        obstacles.push({
          left: 0,
          top: homeRect.height - 120,
          width: homeRect.width,
          height: 120,
        });
      }

      setPositions(placeFolders(projects.length, homeRect, obstacles));
    };

    const run = () => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(layout);
      } else {
        layout();
      }
    };

    run();
    window.addEventListener('resize', layout);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', layout);
    };
  }, []);

  useGSAP(
    () => {
      const root = homeRef.current;
      if (!root || positions.length !== projects.length) return;

      const folders = root.querySelectorAll('.folder');
      if (!folders.length) return;

      const instances = Draggable.create(folders, {
        bounds: root,
        zIndexBoost: false,
        onDragEnd() {
          separateFolders(folders, root);
        },
      });

      return () => {
        instances.forEach((instance) => instance.kill());
      };
    },
    { dependencies: [positions] }
  );

  return (
    <section id="home" ref={homeRef}>
      <ul>
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="group folder"
            style={positions[index]}
            onClick={() => handleOpenProjectFinder(project)}
          >
            <img src="/images/folder.png" alt={project.name} />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
