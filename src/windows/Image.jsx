import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';

const Image = ({ windowKey }) => {
  const data = useWindowStore((s) => s.windows[windowKey]?.data);

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target={windowKey} />
        <h2>{name}</h2>
      </div>

      <div className="preview">
        {imageUrl && <img src={imageUrl} alt={name} />}
      </div>
    </>
  );
};

const ImageFrame = WindowWrapper(Image);

const ImageWindows = () => {
  const windows = useWindowStore((s) => s.windows);
  const imageKeys = Object.keys(windows).filter((key) =>
    key.startsWith('imgfile-')
  );

  return imageKeys.map((key) => (
    <ImageFrame key={key} windowKey={key} />
  ));
};

export default ImageWindows;
