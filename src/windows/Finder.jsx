import { SearchIcon } from 'lucide-react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useLocationStore from '#store/location.js';
import useWindowStore, { getImgWindowKey } from '#store/window.js';
import { locations } from '#constants';

const Finder = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const { activeLocation, setActiveLocation } = useLocationStore();

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

    if (item.fileType === 'img') {
      openWindow(getImgWindowKey(item), item);
    }
  };

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
          {renderList('Work', locations.work.children)}
        </div>

        <ul className="content">
          {(activeLocation?.children ?? []).map((item) => (
            <li
              key={item.id}
              className={item.position}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} />
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
