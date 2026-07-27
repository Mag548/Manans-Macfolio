import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

const fitVideoWindow = (video) => {
  if (!video?.videoWidth) return;

  const section = video.closest('section.window-frame, .videofile');
  if (!section || section.classList.contains('is-maximized')) return;

  // Let CSS keep the video centered + aspect-correct while the window resizes.
  video.style.width = '';
  video.style.height = '';

  const header = section.querySelector('#window-header');
  const description = section.querySelector('.video-description');
  const controls = section.querySelector('.video-controls');
  const headerH = header?.offsetHeight || 44;
  const descH = description?.offsetHeight || 0;
  const controlsH = controls?.offsetHeight || 48;
  const padX = 16;
  const padY = 16;

  const chromeH = headerH + descH + controlsH + padY;
  const maxW = Math.min(window.innerWidth - 24, 960);
  const maxH =
    Math.min(window.innerHeight * 0.72, window.innerHeight - 140) - chromeH + padY;

  const natW = video.videoWidth;
  const natH = video.videoHeight;
  const scale = Math.min(1, maxW / natW, Math.max(80, maxH) / natH);
  const drawW = Math.max(1, Math.round(natW * scale));
  const drawH = Math.max(1, Math.round(natH * scale));

  section.style.width = `${drawW + padX}px`;
  section.style.height = `${chromeH + drawH}px`;
  section.style.maxWidth = 'calc(100vw - 1.5rem)';
  section.style.maxHeight = 'min(85vh, calc(100dvh - 6rem))';
};

const Video = ({ windowKey }) => {
  const data = useWindowStore((s) => s.windows[windowKey]?.data);
  const isOpen = useWindowStore((s) => s.windows[windowKey]?.isOpen);
  const isMaximized = useWindowStore((s) => s.windows[windowKey]?.isMaximized);
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLoadedMetadata = useCallback((event) => {
    const video = event.currentTarget;
    setDuration(video.duration || 0);
    fitVideoWindow(video);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!isOpen || !video || isMaximized) return;
    if (video.readyState >= 1 && video.videoWidth) {
      fitVideoWindow(video);
    }
  }, [isOpen, isMaximized, data?.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    if (isOpen) return;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
  }, [isOpen]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const onEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const onSeek = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Number(event.target.value);
    video.currentTime = next;
    setCurrentTime(next);
  };

  const onVolumeChange = (event) => {
    const next = Number(event.target.value);
    setVolume(next);
    if (next > 0 && muted) setMuted(false);
  };

  const toggleMute = () => setMuted((m) => !m);

  if (!data) return null;

  const { name, videoUrl, description } = data;
  const showDescription = Boolean(description) && !isMaximized;

  return (
    <>
      <div id="window-header">
        <WindowControls target={windowKey} />
        <h2>{name}</h2>
      </div>

      <div className="video-body">
        <div className="preview">
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={togglePlay}
            />
          )}
        </div>

        {showDescription && (
          <p className="video-description">{description}</p>
        )}

        <div className="video-controls">
          <button
            type="button"
            className="video-control-btn"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <span className="video-time">{formatTime(currentTime)}</span>

          <input
            type="range"
            className="video-scrubber"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={onSeek}
            aria-label="Seek"
          />

          <span className="video-time">{formatTime(duration)}</span>

          <button
            type="button"
            className="video-control-btn"
            aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
            onClick={toggleMute}
          >
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            className="video-volume"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={onVolumeChange}
            aria-label="Volume"
          />
        </div>
      </div>
    </>
  );
};

const VideoFrame = WindowWrapper(Video);

const VideoWindows = () => {
  const windows = useWindowStore((s) => s.windows);
  const videoKeys = Object.keys(windows).filter((key) =>
    key.startsWith('videofile-')
  );

  return videoKeys.map((key) => (
    <VideoFrame key={key} windowKey={key} />
  ));
};

export default VideoWindows;
