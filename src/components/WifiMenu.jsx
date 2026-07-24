import { BatteryFull, BatteryLow, BatteryMedium, Link2, Lock, Signal, Wifi, WifiOff } from 'lucide-react';
import BorderGlow from '#components/BorderGlow.jsx';
import { wifiNetworks } from '#constants';

const BatteryIcon = ({ level }) => {
  if (level >= 0.75) return <BatteryFull size={14} strokeWidth={1.75} />;
  if (level >= 0.4) return <BatteryMedium size={14} strokeWidth={1.75} />;
  return <BatteryLow size={14} strokeWidth={1.75} />;
};

const SignalBars = ({ strength = 3 }) => (
  <span className="wifi-signal" aria-hidden>
    {[1, 2, 3].map((bar) => (
      <span
        key={bar}
        className={`wifi-signal-bar${bar <= strength ? ' is-on' : ''}`}
      />
    ))}
  </span>
);

const WifiMenu = ({
  wifiEnabled,
  connectedId,
  onToggleWifi,
  onSelectNetwork,
}) => {
  const { personalHotspots, knownNetworks } = wifiNetworks;

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
          <h3>Wi-Fi</h3>
          <button
            type="button"
            className={`wifi-toggle${wifiEnabled ? ' is-on' : ''}`}
            aria-pressed={wifiEnabled}
            aria-label={wifiEnabled ? 'Turn Wi-Fi off' : 'Turn Wi-Fi on'}
            onClick={onToggleWifi}
          >
            <span className="wifi-toggle-thumb" />
          </button>
        </header>

        {!wifiEnabled ? (
          <div className="wifi-off">
            <WifiOff size={22} strokeWidth={1.75} />
            <p>Wi-Fi Off</p>
          </div>
        ) : (
          <>
            <section className="wifi-section">
              <h4>Personal Hotspots</h4>
              <ul>
                {personalHotspots.map((network) => {
                  const active = connectedId === network.id;
                  return (
                    <li key={network.id}>
                      <button
                        type="button"
                        className={`wifi-row${active ? ' is-active' : ''}`}
                        onClick={() => onSelectNetwork(network.id)}
                      >
                        <span className={`wifi-row-icon${active ? ' is-active' : ''}`}>
                          <Link2 size={14} strokeWidth={2} />
                        </span>
                        <span className="wifi-row-name">{network.name}</span>
                        <span className="wifi-row-meta">
                          <SignalBars strength={network.signal} />
                          <span className="wifi-cellular">{network.cellular}</span>
                          <BatteryIcon level={network.battery} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="wifi-section">
              <h4>Known Networks</h4>
              <ul>
                {knownNetworks.map((network) => {
                  const active = connectedId === network.id;
                  return (
                    <li key={network.id}>
                      <button
                        type="button"
                        className={`wifi-row${active ? ' is-active' : ''}`}
                        onClick={() => onSelectNetwork(network.id)}
                      >
                        <span className={`wifi-row-icon${active ? ' is-active' : ''}`}>
                          <Wifi size={14} strokeWidth={2} />
                        </span>
                        <span className="wifi-row-name">{network.name}</span>
                        <span className="wifi-row-meta">
                          {network.locked && (
                            <Lock size={13} strokeWidth={1.75} className="wifi-lock" />
                          )}
                          <Signal size={14} strokeWidth={1.75} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </div>
    </BorderGlow>
  );
};

export default WifiMenu;
