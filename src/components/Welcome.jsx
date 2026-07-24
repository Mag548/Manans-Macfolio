import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SpecularButton from '#components/SpecularButton.jsx';
import { siteStack } from '#constants/terminal.js';

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{
        '--wght': baseWeight,
        fontVariationSettings: `'wght' var(--wght)`,
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = Array.from(container.querySelectorAll('span'));
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const setters = letters.map((letter) => {
    gsap.set(letter, { '--wght': base });
    return gsap.quickTo(letter, '--wght', {
      duration: 0.15,
      ease: 'power2.out',
    });
  });

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter, i) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 15000);
      const weight = min + (max - min) * intensity;

      setters[i](weight);
    });
  };

  const handleMouseLeave = () => {
    setters.forEach((setWeight) => setWeight(base));
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseleave', handleMouseLeave);
  };
};

const Welcome = () => {
  const titleref = useRef(null);
  const subtitleref = useRef(null);
  const panelRef = useRef(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useGSAP(() => {
    const cleanups = [
      setupTextHover(titleref.current, 'title'),
      setupTextHover(subtitleref.current, 'subtitle'),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    if (!aboutOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setAboutOpen(false);
    };
    const onPointer = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (e.target.closest?.('.welcome-about-btn')) return;
      setAboutOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [aboutOpen]);

  return (
    <section id="welcome">
      <div className="welcome-hero">
        <div className="welcome-about">
          <SpecularButton
            className="welcome-about-btn"
            size="md"
            radius={18}
            tint="#ffffff"
            tintOpacity={0.08}
            blur={10}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={() => setAboutOpen((open) => !open)}
          >
            What am I looking at?
          </SpecularButton>

          {aboutOpen && (
            <div
              ref={panelRef}
              className="welcome-about-panel"
              role="dialog"
              aria-label="About Macfolio"
            >
              <h3>This is Manan’s Macfolio</h3>
              <p>
                Think of this less as a static resume and more as a living desktop —
                an interactive space built to introduce Manan as a person. Open
                folders to explore his experiences, pull on the lanyard profile,
                spin a 3D product model, dig through files, and poke around the
                apps the way you would on a real Mac. Every window is a piece of
                who he is: builder, collaborator, and someone who likes turning
                ideas into things you can actually touch.
              </p>
              <p>
                Click around. Drag things. Break the ice before you ever send an
                email — that’s the point.
              </p>

              <h4>Built with</h4>
              <ul className="welcome-stack">
                {siteStack.map(({ category, items }) => (
                  <li key={category}>
                    <span>{category}</span>
                    <span>{items.join(' · ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p ref={subtitleref} className="welcome-subtitle">
          {renderText(
            "Hey, I'm Manan! Welcome to my",
            'text-3xl font-georama',
            100
          )}
        </p>
        <h1 ref={titleref} className="welcome-title">
          {renderText('macfolio', 'text-9xl italic font-georama')}
        </h1>
      </div>

      <div className="small-screen">
        <p>This Macfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
