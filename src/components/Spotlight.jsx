import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { dockApps } from '#constants';
import useWindowStore from '#store/window.js';

const SPOTLIGHT_APPS = [
  ...dockApps
    .filter((app) => app.canOpen)
    .map((app) => ({
      id: app.id,
      name: app.name,
      icon: `/images/${app.icon}`,
      keywords: [app.name, app.id],
    })),
  {
    id: 'resume',
    name: 'Resume',
    icon: '/images/pdf.png',
    keywords: ['Resume', 'CV', 'resume'],
  },
].map((app) => {
  const aliases = {
    finder: ['Finder', 'Experiences', 'Macfolio', 'Portfolio', 'Projects'],
    safari: ['Safari', 'Articles', 'Blog'],
    photos: ['Photos', 'Gallery'],
    contact: ['Contact', 'Mail', 'Email'],
    terminal: ['Terminal', 'Skills'],
    resume: ['Resume', 'CV'],
  };
  return {
    ...app,
    keywords: [...new Set([...(aliases[app.id] ?? []), ...app.keywords])],
  };
});

const Spotlight = ({ open, onClose }) => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = !q
      ? SPOTLIGHT_APPS
      : SPOTLIGHT_APPS.filter((app) =>
          app.keywords.some((keyword) => keyword.toLowerCase().includes(q))
        );
    return matches.slice(0, 3);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }

    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const app = results[activeIndex];
        if (app) {
          openWindow(app.id);
          onClose();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, results, activeIndex, openWindow, onClose]);

  if (!open) return null;

  const launch = (appId) => {
    openWindow(appId);
    onClose();
  };

  return (
    <div
      className="spotlight-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="spotlight"
        role="dialog"
        aria-label="Spotlight Search"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="spotlight-search">
          <Search size={22} strokeWidth={1.75} className="spotlight-search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {results.length > 0 ? (
          <ul className="spotlight-results" role="listbox">
            {results.map((app, index) => (
              <li key={app.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`spotlight-result${index === activeIndex ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => launch(app.id)}
                >
                  <img src={app.icon} alt="" />
                  <span>{app.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="spotlight-empty">No Results</div>
        )}
      </div>
    </div>
  );
};

export default Spotlight;
