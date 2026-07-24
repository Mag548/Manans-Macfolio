import { techStack, socials, locations } from './index.js';

export const BOOT_MESSAGE =
  "Manan's CLI — type help to get started";

export const terminalProfile = {
  name: 'Manan Goswami',
  handle: '@manan',
  role: 'Web developer',
  blurb:
    'I build sleek, interactive websites with React, Next.js, and a little motion magic. Clean UI, solid UX, code that stays readable.',
  email: 'manangoswami5@gmail.com',
  phone: '+1 289 993-9991',
};

const findSocial = (...names) => {
  const lowered = names.map((n) => n.toLowerCase());
  return socials.find((s) => lowered.includes(s.text.toLowerCase()));
};

const line = (text, type = 'output', href = null) => ({ type, text, href });

const formatSkills = () => {
  const lines = [line('Loaded tech stack:')];
  techStack.forEach(({ category, items }) => {
    lines.push(line(`  ${category.padEnd(12)} ${items.join(', ')}`));
  });
  lines.push(line('All stacks loaded successfully (100%)'));
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
  line('  skills, stack, tech  Tech stack'),
  line('  projects             Portfolio projects'),
  line('  github, gh           GitHub profile'),
  line('  linkedin, li         LinkedIn profile'),
  line('  twitter, x           Twitter / X'),
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
          line(terminalProfile.blurb),
        ],
      };

    case 'skills':
    case 'stack':
    case 'tech':
      return { lines: formatSkills() };

    case 'github':
    case 'gh':
      return { lines: formatSocial('github', ['Github', 'GitHub']) };

    case 'linkedin':
    case 'li':
      return { lines: formatSocial('linkedin', ['LinkedIn', 'Linkedin']) };

    case 'twitter':
    case 'x':
      return { lines: formatSocial('twitter', ['Twitter/X', 'Twitter', 'X']) };

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

    case 'projects': {
      const projects = locations.work?.children ?? [];
      const lines = [line('Projects in Work/:')];
      projects.forEach((p) => lines.push(line(`  - ${p.name}`)));
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
