import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore, { getImgWindowKey } from '#store/window.js';
import { photosLinks } from '#constants';

const Photos = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [activeAlbumId, setActiveAlbumId] = useState(photosLinks[0]?.id);
  const activeAlbum =
    photosLinks.find((album) => album.id === activeAlbumId) ?? photosLinks[0];
  const photos = activeAlbum?.photos ?? [];

  const openPhoto = (photo) => {
    openWindow(getImgWindowKey(photo), photo);
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="photos" />
        <div className="header-actions">
          <Mail className="icon" />
          <Search className="icon" />
        </div>
      </div>

      <div className="photos-body">
        <div className="sidebar">
          <h2>Photos</h2>
          <ul>
            {photosLinks.map((link) => (
              <li
                key={link.id}
                className={
                  activeAlbumId === link.id ? 'active' : 'not-active'
                }
                onClick={() => setActiveAlbumId(link.id)}
              >
                <img src={link.icon} alt="" />
                <p>{link.title}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="gallery">
          {photos.length === 0 ? (
            <div className="gallery-empty">
              <p>No Photos</p>
            </div>
          ) : (
            <ul>
              {photos.map((photo) => (
                <li
                  key={photo.id}
                  onClick={() => openPhoto(photo)}
                >
                  <img src={photo.imageUrl} alt={photo.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

const PhotosWindow = WindowWrapper(Photos, 'photos');

export default PhotosWindow;
