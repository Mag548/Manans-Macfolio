import { Moon, Search, Sun } from 'lucide-react';
import BorderGlow from '#components/BorderGlow.jsx';

const ControlCentreMenu = ({ darkMode, onToggleDarkMode, onOpenSpotlight }) => {
  return (
    <BorderGlow
      className="wifi-menu"
      borderRadius={16}
      backgroundColor="rgba(255, 255, 255, 0.12)"
      glowColor="270 80 75"
      glowRadius={28}
      glowIntensity={0.55}
      colors={['#c084fc', '#a855f7', '#38bdf8']}
      fillOpacity={0.18}
      animated={false}
    >
      <div className="wifi-menu-inner">
        <header className="wifi-menu-header">
          <div className="cc-menu-label">
            {darkMode ? (
              <Moon size={16} strokeWidth={1.75} />
            ) : (
              <Sun size={16} strokeWidth={1.75} />
            )}
            <h3>{darkMode ? 'Dark Mode' : 'Light Mode'}</h3>
          </div>
          <button
            type="button"
            className={`wifi-toggle${darkMode ? ' is-on' : ''}`}
            aria-pressed={darkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleDarkMode}
          >
            <span className="wifi-toggle-thumb" />
          </button>
        </header>

        <section className="wifi-section">
          <button
            type="button"
            className="wifi-row"
            onClick={onOpenSpotlight}
          >
            <span className="wifi-row-icon">
              <Search size={14} strokeWidth={2} />
            </span>
            <span className="wifi-row-name">Spotlight Search</span>
          </button>
        </section>
      </div>
    </BorderGlow>
  );
};

export default ControlCentreMenu;
