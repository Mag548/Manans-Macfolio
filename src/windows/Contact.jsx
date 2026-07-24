import { socials } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper.jsx';
import WindowControls from '#components/WindowControls.jsx';

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="contact" />
        <h2>Contact Me</h2>
      </div>

      <div className="p-5 space-y-2">
        <img
          src="/images/manan.jpg"
          alt="Manan"
          className="w-30 rounded"
        />

        <h3>Get in Touch!</h3>
        <p>Got an idea, a project to build, or just want to talk tech? Let's connect.</p>
        <p>Email: manangoswami5@gmail.com</p>
        <p>Phone: +1 289 993-9991</p>
        <ul>
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
              >
                <img src={icon} alt={text} className="size-5" />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow;
