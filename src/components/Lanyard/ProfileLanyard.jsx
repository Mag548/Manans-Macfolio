import { useEffect, useMemo, useState } from 'react';
import Lanyard from './Lanyard.jsx';
import { createProfileBadge } from './createProfileBadge.js';

const CAM_Z = 20;
const FOV = 20;

const worldXFromScreen = (screenX, top, width, height) => {
  const usableH = Math.max(height - top, 1);
  const aspect = width / usableH;
  const ndcX = (screenX / width) * 2 - 1;
  const halfH = Math.tan((FOV * Math.PI) / 360) * CAM_Z;
  return ndcX * halfH * aspect;
};

const ProfileLanyard = ({ open, anchorRef, onClose }) => {
  const [badgeUrl, setBadgeUrl] = useState(null);
  const [layout, setLayout] = useState({
    top: 44,
    hangX: 0,
  });

  useEffect(() => {
    let cancelled = false;

    createProfileBadge({
      photoUrl: '/images/manan.jpg',
      qrUrl: '/images/lanyard-qr.png',
      name: 'Manan Goswami',
      subtitle: 'CS & Business @WLU',
    })
      .then((url) => {
        if (!cancelled) setBadgeUrl(url);
      })
      .catch(() => {
        if (!cancelled) setBadgeUrl('/images/manan.jpg');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const el = anchorRef?.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (!el) {
        setLayout({ top: 44, hangX: 0 });
        return;
      }
      const rect = el.getBoundingClientRect();
      const top = Math.max(rect.bottom - 2, 40);
      const centerX = rect.left + rect.width / 2;
      setLayout({
        top,
        hangX: worldXFromScreen(centerX, top, width, height),
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const hangOffset = useMemo(() => [layout.hangX, 4, 0], [layout.hangX]);

  if (!open) return null;

  return (
    <div className="lanyard-overlay" role="dialog" aria-label="Profile lanyard">
      <button
        type="button"
        className="lanyard-backdrop"
        aria-label="Close profile lanyard"
        onClick={onClose}
        style={{ top: layout.top }}
      />
      <div
        className="lanyard-panel lanyard-panel-fullscreen"
        style={{ top: layout.top }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {badgeUrl ? (
          <Lanyard
            position={[0, 0, CAM_Z]}
            fov={FOV}
            gravity={[0, -40, 0]}
            frontImage={badgeUrl}
            backImage={badgeUrl}
            imageFit="cover"
            lanyardWidth={0.9}
            hangOffset={hangOffset}
          />
        ) : (
          <p className="lanyard-loading">Loading…</p>
        )}
      </div>
    </div>
  );
};

export default ProfileLanyard;
