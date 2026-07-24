import { useLayoutEffect, useRef, useState } from 'react';
import { locations } from '#constants';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import useWindowStore from '#store/window.js';
import useLocationStore from '#store/location.js';

gsap.registerPlugin(Draggable);

const projects = locations.work?.children ?? [];

const FOLDER_W = 176;
const FOLDER_H = 118;
const GAP = 20;
const NAV_H = 56;
const MAX_ATTEMPTS = 250;

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

const placeFolders = (count, homeRect, obstacles) => {
  const placed = [];
  const minLeft = GAP;
  const minTop = NAV_H + GAP;
  const maxLeft = Math.max(minLeft, homeRect.width - FOLDER_W - GAP);
  const maxTop = Math.max(minTop, homeRect.height - FOLDER_H - GAP);

  for (let i = 0; i < count; i += 1) {
    let found = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const left = minLeft + Math.random() * (maxLeft - minLeft);
      const top = minTop + Math.random() * (maxTop - minTop);
      const candidate = {
        left,
        top,
        width: FOLDER_W,
        height: FOLDER_H,
      };

      if (!collidesAny(candidate, obstacles) && !collidesAny(candidate, placed)) {
        found = candidate;
        break;
      }
    }

    if (!found) {
      // Fallback: walk a loose grid from the edges inward
      const cols = Math.max(2, Math.floor((maxLeft - minLeft) / (FOLDER_W + GAP)));
      const rows = Math.max(2, Math.floor((maxTop - minTop) / (FOLDER_H + GAP)));
      outer: for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const candidate = {
            left: minLeft + col * (FOLDER_W + GAP),
            top: minTop + row * (FOLDER_H + GAP),
            width: FOLDER_W,
            height: FOLDER_H,
          };
          if (
            candidate.left <= maxLeft &&
            candidate.top <= maxTop &&
            !collidesAny(candidate, obstacles) &&
            !collidesAny(candidate, placed)
          ) {
            found = candidate;
            break outer;
          }
        }
      }
    }

    placed.push(
      found ?? {
        left: minLeft + (i % 3) * (FOLDER_W + GAP),
        top: minTop + Math.floor(i / 3) * (FOLDER_H + GAP),
        width: FOLDER_W,
        height: FOLDER_H,
      }
    );
  }

  return placed.map(({ top, left }) => ({
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
  }));
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
