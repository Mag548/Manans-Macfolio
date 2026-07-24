import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import ModelViewer from '#components/ModelViewer.jsx';
import useWindowStore from '#store/window.js';

const Model3D = () => {
  const data = useWindowStore((s) => s.windows.model3d?.data);
  const isOpen = useWindowStore((s) => s.windows.model3d?.isOpen);
  const isMinimized = useWindowStore((s) => s.windows.model3d?.isMinimized);

  if (!data) return null;

  const { name, modelUrl, placeholderSrc } = data;
  const showCanvas = Boolean(isOpen && !isMinimized && modelUrl);

  return (
    <>
      <div id="window-header">
        <WindowControls target="model3d" />
        <h2>{name}</h2>
      </div>

      <div className="model3d-body">
        {showCanvas ? (
          <ModelViewer key={modelUrl} url={modelUrl} placeholderSrc={placeholderSrc} />
        ) : modelUrl ? null : (
          <p className="model3d-empty">
            Drop your GLB at <code>public/models/ja-canada.glb</code>
          </p>
        )}
      </div>
    </>
  );
};

const Model3DWindow = WindowWrapper(Model3D, 'model3d');

export default Model3DWindow;
