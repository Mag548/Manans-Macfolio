import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { navIcons, navLinks } from '#constants';
import useWindowStore from '#store/window.js';
import WifiMenu from '#components/WifiMenu.jsx';
import ControlCentreMenu from '#components/ControlCentreMenu.jsx';
import Spotlight from '#components/Spotlight.jsx';
import ProfileLanyard from '#components/Lanyard/ProfileLanyard.jsx';

const Navbar = () => {
  const { openWindow } = useWindowStore();
  const wifiWrapRef = useRef(null);
  const modeWrapRef = useRef(null);
  const profileWrapRef = useRef(null);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [connectedId, setConnectedId] = useState('manan-hotspot');
  const [darkMode, setDarkMode] = useState(false);

  const openSpotlight = () => {
    setWifiOpen(false);
    setModeOpen(false);
    setProfileOpen(false);
    setSpotlightOpen(true);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    if (!wifiOpen && !modeOpen) return;

    const onPointerDown = (event) => {
      if (wifiOpen && wifiEnabled && !wifiWrapRef.current?.contains(event.target)) {
        setWifiOpen(false);
      }
      if (modeOpen && !modeWrapRef.current?.contains(event.target)) {
        setModeOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (wifiOpen && wifiEnabled) setWifiOpen(false);
      if (modeOpen) setModeOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [wifiOpen, wifiEnabled, modeOpen]);

  const handleToggleWifi = () => {
    setWifiEnabled((on) => {
      if (on) {
        setConnectedId(null);
        setWifiOpen(true);
        return false;
      }
      setConnectedId('manan-hotspot');
      return true;
    });
  };

  return (
    <>
      {!wifiEnabled && (
        <div className="wifi-sleep-overlay" aria-hidden />
      )}

      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <ProfileLanyard
        open={profileOpen}
        anchorRef={profileWrapRef}
        onClose={() => setProfileOpen(false)}
      />

      <nav className={!wifiEnabled ? 'nav-sleeping' : undefined}>
        <div>
          <img src="/images/logo.svg" alt="logo" />
          <p className="font-bold">Manan's Portfolio</p>
          <ul>
            {navLinks.map(({ id, name, type }) => (
              <li key={id} onClick={() => openWindow(type)}>
                <p>{name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul>
            {navIcons.map(({ id, img, type }) => {
              if (type === 'wifi') {
                return (
                  <li key={id} className="nav-wifi" ref={wifiWrapRef}>
                    <button
                      type="button"
                      className={`nav-wifi-btn${wifiEnabled ? '' : ' is-off'}${wifiOpen ? ' is-open' : ''}`}
                      aria-expanded={wifiOpen}
                      aria-label="Wi-Fi"
                      onClick={() => {
                        setModeOpen(false);
                        setSpotlightOpen(false);
                        setProfileOpen(false);
                        setWifiOpen((open) => !open);
                      }}
                    >
                      <img src={img} className="icon-hover" alt="" />
                    </button>
                    {wifiOpen && (
                      <div
                        className="wifi-menu-popover"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WifiMenu
                          wifiEnabled={wifiEnabled}
                          connectedId={connectedId}
                          onToggleWifi={handleToggleWifi}
                          onSelectNetwork={(networkId) => {
                            setWifiEnabled(true);
                            setConnectedId(networkId);
                          }}
                        />
                      </div>
                    )}
                  </li>
                );
              }

              if (type === 'spotlight') {
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`nav-wifi-btn${spotlightOpen ? ' is-open' : ''}`}
                      aria-expanded={spotlightOpen}
                      aria-label="Spotlight Search"
                      onClick={() => {
                        if (spotlightOpen) setSpotlightOpen(false);
                        else openSpotlight();
                      }}
                    >
                      <img src={img} className="icon-hover" alt="" />
                    </button>
                  </li>
                );
              }

              if (type === 'profile') {
                return (
                  <li key={id} className="nav-wifi" ref={profileWrapRef}>
                    <button
                      type="button"
                      className={`nav-wifi-btn${profileOpen ? ' is-open' : ''}`}
                      aria-expanded={profileOpen}
                      aria-label="Profile"
                      onClick={() => {
                        setWifiOpen(false);
                        setModeOpen(false);
                        setSpotlightOpen(false);
                        setProfileOpen((open) => !open);
                      }}
                    >
                      <img src={img} className="icon-hover" alt="" />
                    </button>
                  </li>
                );
              }

              if (type === 'mode') {
                return (
                  <li key={id} className="nav-wifi" ref={modeWrapRef}>
                    <button
                      type="button"
                      className={`nav-wifi-btn${modeOpen ? ' is-open' : ''}`}
                      aria-expanded={modeOpen}
                      aria-label="Control Centre"
                      onClick={() => {
                        setWifiOpen(false);
                        setSpotlightOpen(false);
                        setProfileOpen(false);
                        setModeOpen((open) => !open);
                      }}
                    >
                      <img src={img} className="icon-hover" alt="" />
                    </button>
                    {modeOpen && (
                      <div
                        className="wifi-menu-popover control-menu-popover"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ControlCentreMenu
                          darkMode={darkMode}
                          onToggleDarkMode={() => setDarkMode((on) => !on)}
                          onOpenSpotlight={() => {
                            setModeOpen(false);
                            openSpotlight();
                          }}
                        />
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={id}>
                  <img src={img} className="icon-hover" alt={`icon-${id}`} />
                </li>
              );
            })}
          </ul>

          <time>{dayjs().format('ddd MMM D h:mm A')}</time>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
