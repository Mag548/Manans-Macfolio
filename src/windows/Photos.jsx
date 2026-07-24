import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import { photosLinks } from '#constants';

const Photos = () => {
  const [activeAlbumId, setActiveAlbumId] = useState(photosLinks[0]?.id);

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
          <div className="gallery-empty gallery-placeholder">
            <p>Photography portfolio on the way!</p>
          </div>
        </div>
      </div>
    </>
  );
};

const PhotosWindow = WindowWrapper(Photos, 'photos');

export default PhotosWindow;
