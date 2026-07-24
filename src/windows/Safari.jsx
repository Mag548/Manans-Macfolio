import { useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  ShieldHalf,
  Search,
  Share,
  Plus,
  Copy,
} from 'lucide-react';

const Safari = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => window.location.href;
  const getShareTitle = () => "Manan's Macfolio";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const handleShare = async () => {
    const url = getShareUrl();
    const title = getShareTitle();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }

    await handleCopy();
  };

  const handlePlus = () => {
    openWindow('safari');
  };

  return (
    <>
      <div id="window-header">
        <div className="flex items-center gap-3 shrink-0">
          <WindowControls target="safari" />
          <PanelLeft className="icon" size={22} strokeWidth={1.75} />
          <div className="flex items-center gap-0.5">
            <ChevronLeft className="icon" size={22} strokeWidth={1.75} />
            <ChevronRight className="icon" size={22} strokeWidth={1.75} />
          </div>
          <ShieldHalf className="icon" size={20} strokeWidth={1.75} />
        </div>

        <div className="search">
          <Search size={15} strokeWidth={2} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search or enter website name"
            value=""
            readOnly
          />
        </div>

        <div className="header-actions">
          {copied && <span className="copied-feedback">Copied to clipboard!</span>}
          <button
            type="button"
            className="icon-btn"
            aria-label="Share"
            onClick={handleShare}
          >
            <Share className="icon" size={22} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="New window"
            onClick={handlePlus}
          >
            <Plus className="icon" size={22} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Copy link"
            onClick={handleCopy}
          >
            <Copy className="icon" size={22} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="blog">
        <h2>My Developer Blog</h2>
        <div className="blog-placeholder">
          <p>
            Blog&apos;s on pause while I build something worth reading. In the
            meantime, check out my{' '}
            <button
              type="button"
              className="blog-placeholder-link"
              onClick={() => openWindow('finder')}
            >
              experiences
            </button>
            !
          </p>
        </div>
      </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;
