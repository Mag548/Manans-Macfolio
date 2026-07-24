import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';
import useWindowStore from '#store/window.js';

const linkify = (text) => {
  const parts = String(text).split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="txtfile-link"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const Text = () => {
  const data = useWindowStore((s) => s.windows.txtfile?.data);

  if (!data) return null;

  const { name, image, subtitle, description = [] } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="txtfile-body">
        {image && <img src={image} alt={name} className="txtfile-image" />}
        {subtitle && <h3 className="txtfile-subtitle">{subtitle}</h3>}
        {description.map((paragraph, i) => (
          <p key={i}>{linkify(paragraph)}</p>
        ))}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, 'txtfile');

export default TextWindow;
