import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';

const Image = () => {
  const data = useWindowStore((s) => s.windows.imgfile?.data);

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div className="preview">
        {imageUrl && <img src={imageUrl} alt={name} />}
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, 'imgfile');

export default ImageWindow;
