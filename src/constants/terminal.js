import { socials, locations } from './index.js';

export const BOOT_MESSAGE =
  "Manan's CLI — type help to get started";

export const terminalProfile = {
  name: 'Manan Goswami',
  handle: '@manan',
  role: 'Computer Science and Business student at Wilfrid Laurier University',
  about: [
    "Hi, I'm Manan.",
    "I'm a Computer Science and Business student at Wilfrid Laurier University who loves turning ideas into real products. Whether it's developing web applications, exploring AI, or designing intuitive user experiences, I'm always looking for opportunities to learn and build.",
    "Outside of coding, you'll probably find me behind a camera capturing cars and landscapes, on the badminton court, or planning my next project. I enjoy solving problems, collaborating with others, and creating things that make a meaningful impact.",
    "I'm always excited to connect with people who are passionate about technology, entrepreneurship, and building something great together.",
  ],
  email: 'manangoswami5@gmail.com',
  phone: '+1 289 993-9991',
};

/** Stack used to build this portfolio site */
const siteStack = [
  {
    category: 'Core',
    items: ['React 19', 'Vite'],
  },
  {
    category: 'Styling',
    items: ['Tailwind CSS v4', 'CSS'],
  },
  {
    category: 'Motion',
    items: ['GSAP', 'OGL (LineWaves)'],
  },
  {
    category: 'State',
    items: ['Zustand', 'Immer'],
  },
  {
    category: 'UI',
    items: ['Lucide React', 'react-tooltip'],
  },
  {
    category: 'Docs',
    items: ['react-pdf'],
  },
  {
    category: 'Utils',
    items: ['dayjs', 'clsx'],
  },
];

const findSocial = (...names) => {
  const lowered = names.map((n) => n.toLowerCase());
  return socials.find((s) => lowered.includes(s.text.toLowerCase()));
};

const line = (text, type = 'output', href = null) => ({ type, text, href });

const formatSiteStack = () => {
  const lines = [
    line("This portfolio (Manan's Macfolio) is built with:"),
    line(''),
    line('Loading site stack...'),
  ];
  siteStack.forEach(({ category, items }) => {
    lines.push(line(`  ${category.padEnd(12)} ${items.join(', ')}`));
  });
  lines.push(line(''));
  lines.push(line('Site stack loaded successfully (100%)'));
  return lines;
};

const formatSocial = (key, labels) => {
  const social = findSocial(...labels);
  if (!social) {
    return [line(`${key}: link not configured.`, 'error')];
  }
  return [
    line(`${social.text}`),
    line(social.link, 'link', social.link),
  ];
};

const HELP_LINES = [
  line('Available commands:'),
  line('  help, ?              Show this list'),
  line('  clear, cls           Clear the terminal'),
  line('  whoami               About Manan'),
  line('  skills, stack, tech  What this site is built with'),
  line('  projects, experience  List experiences'),
  line('  github, gh           GitHub profile'),
  line('  linkedin, li         LinkedIn profile'),
  line('  instagram, ig        Instagram profile'),
  line('  contact, email       Contact info'),
  line('  date                 Current date/time'),
];

/**
 * @returns {{ clear?: boolean, lines: Array<{ type: string, text: string, href?: string | null }> }}
 */
export const runCommand = (raw) => {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [] };

  const cmd = trimmed.split(/\s+/)[0].toLowerCase();

  switch (cmd) {
    case 'help':
    case '?':
      return { lines: HELP_LINES };

    case 'clear':
    case 'cls':
      return { clear: true, lines: [] };

    case 'whoami':
      return {
        lines: [
          line(`${terminalProfile.name} (${terminalProfile.handle})`),
          line(terminalProfile.role),
          line(''),
          ...terminalProfile.about.map((paragraph) => line(paragraph)),
        ],
      };

    case 'skills':
    case 'stack':
    case 'tech':
      return { lines: formatSiteStack() };

    case 'github':
    case 'gh':
      return { lines: formatSocial('github', ['Github', 'GitHub']) };

    case 'linkedin':
    case 'li':
      return { lines: formatSocial('linkedin', ['LinkedIn', 'Linkedin']) };

    case 'instagram':
    case 'ig':
      return { lines: formatSocial('instagram', ['Instagram', 'Insta']) };

    case 'contact':
    case 'email':
      return {
        lines: [
          line("Got an idea? A bug to squash? Or just want to talk tech? I'm in."),
          line(`Email: ${terminalProfile.email}`),
          line(`Phone: ${terminalProfile.phone}`),
          line('Or open the Contact app from the dock.'),
        ],
      };

    case 'projects':
    case 'experience':
    case 'experiences': {
      const experiences = locations.experiences?.children ?? [];
      const lines = [line('Experiences/:')];
      experiences.forEach((p) => lines.push(line(`  - ${p.name}`)));
      lines.push(line('Tip: open Finder from the dock or desktop folders.'));
      return { lines };
    }

    case 'date':
      return { lines: [line(new Date().toLocaleString())] };

    default:
      return {
        lines: [
          line(`command not found: ${cmd}`, 'error'),
          line('Type help to see available commands.', 'error'),
        ],
      };
  }
};
