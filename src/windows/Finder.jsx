import { useRef } from 'react';
import { SearchIcon } from 'lucide-react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useLocationStore from '#store/location.js';
import useWindowStore, { getImgWindowKey } from '#store/window.js';
import { locations } from '#constants';

gsap.registerPlugin(Draggable);

const Finder = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const { activeLocation, setActiveLocation } = useLocationStore();
  const contentRef = useRef(null);

  const openItem = (item) => {
    if (item.fileType === 'pdf' || item.type === 'pdf' || item.type === 'resume') {
      openWindow('resume');
      return;
    }

    if (['fig', 'url'].includes(item.fileType) && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.kind === 'folder' || item.children) {
      setActiveLocation(item);
      return;
    }

    if (item.fileType === 'txt') {
      openWindow('txtfile', item);
      return;
    }

    if (item.fileType === 'glb' || item.fileType === 'gltf') {
      openWindow('model3d', item);
      return;
    }

    if (item.fileType === 'img') {
      openWindow(getImgWindowKey(item), item);
    }
  };

  const children = activeLocation?.children ?? [];

  useGSAP(
    () => {
      const content = contentRef.current;
      if (!content || !children.length) return;

      const items = content.querySelectorAll('.finder-item');
      if (!items.length) return;

      // Reset transforms when switching folders
      gsap.set(items, { x: 0, y: 0 });

      const instances = Draggable.create(items, {
        bounds: content,
        edgeResistance: 0.85,
        zIndexBoost: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onClick() {
          const id = Number(this.target.dataset.itemId);
          const item = children.find((child) => child.id === id);
          if (item) openItem(item);
        },
      });

      return () => {
        instances.forEach((instance) => instance.kill());
      };
    },
    { dependencies: [activeLocation?.id, children.length] }
  );

  const renderList = (name, items) => (
    <div key={name}>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={
              activeLocation?.id === item.id ? 'active' : 'not-active'
            }
            onClick={() => setActiveLocation(item)}
          >
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <SearchIcon className="icon" />
      </div>

      <div className="window-body flex h-full min-h-0">
        <div className="sidebar">
          {renderList('Favourites', Object.values(locations))}
          {renderList('Experiences', locations.experiences.children)}
        </div>

        <ul className="content" ref={contentRef}>
          {children.map((item) => (
            <li
              key={`${activeLocation?.id ?? 'root'}-${item.id}`}
              className="finder-item"
              data-item-id={item.id}
            >
              <img src={item.icon} alt={item.name} draggable={false} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, 'finder');

export default FinderWindow;
