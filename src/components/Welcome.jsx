import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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

    useGSAP(() => {
        const cleanups = [
            setupTextHover(titleref.current, 'title'),
            setupTextHover(subtitleref.current, 'subtitle'),
        ];

        return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

    return (
        <section id="welcome">
            <p ref={subtitleref}>
                {renderText(
                    "Hey, I'm Manan! Welcome to my",
                    'text-3xl font-georama',
                    100
                )}
            </p>
            <h1 ref={titleref} className="mt-7">
                {renderText('portfolio', 'text-9xl italic font-georama')}
            </h1>

            <div className="small-screen">
                <p>This Portfolio is designed for desktop/tablet screens only.</p>
            </div>
        </section>
    );
};

export default Welcome;
