import { useState } from 'react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';
import { blogPosts } from '#constants';
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  ShieldHalf,
  Search,
  Share,
  Plus,
  Copy,
  ArrowRight,
} from 'lucide-react';

const Safari = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [activePost, setActivePost] = useState(null);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => activePost?.link ?? window.location.href;
  const getShareTitle = () => activePost?.title ?? "Manan's Macfolio";

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
        /* user cancelled share sheet */
        return;
      }
    }

    await handleCopy();
  };

  const handlePlus = () => {
    openWindow('safari');
    setActivePost(null);
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
            value={activePost?.title ?? ''}
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
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className={`blog-post cursor-pointer rounded-md p-1 -m-1 transition-colors ${
                activePost?.id === post.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActivePost(post)}
            >
              <div className="col-span-2">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="content">
                <p>{post.date}</p>
                <h3>{post.title}</h3>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read More <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;
