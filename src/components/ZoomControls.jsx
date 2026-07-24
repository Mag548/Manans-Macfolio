import { ZoomIn, ZoomOut } from 'lucide-react';

const ZoomControls = ({ zoom, zoomIn, zoomOut, resetZoom }) => {
  return (
    <div className="zoom-controls">
      <button
        type="button"
        className="zoom-btn"
        aria-label="Zoom out"
        onClick={zoomOut}
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        className="zoom-btn zoom-label"
        aria-label="Reset zoom"
        title="Reset zoom"
        onClick={resetZoom}
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        type="button"
        className="zoom-btn"
        aria-label="Zoom in"
        onClick={zoomIn}
      >
        <ZoomIn size={16} />
      </button>
    </div>
  );
};

export default ZoomControls;
