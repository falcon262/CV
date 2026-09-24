/**
 * Site-wide facts, links and feature flags. Everything here comes from
 * docs/brief.md; change a fact there first.
 */
export const site = {
  name: 'Joseph Kofi Asante',
  jobTitle: 'Senior Software Engineer',
  locality: 'Accra',
  countryCode: 'GH',
  email: 'thommpson19@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/joseph-asante-864892185',
    github: 'https://github.com/falcon262',
  },
  /** Supplied by Joseph before launch. See README.md. */
  cvPath: 'cv/Joseph-Kofi-Asante-CV.pdf',
  home: {
    title: 'Joseph Kofi Asante, Senior .NET Engineer',
    description:
      'Senior .NET engineer and technical lead in Accra building payment, budgeting, tax and regulatory systems. Open to remote and relocation roles.',
  },
} as const;

/**
 * Feature flags.
 * - nowBuilding: shows the "Now building" tile. Keep it off until the
 *   cross-border-settlement README is tidy (see README.md).
 * - The Writing section needs no flag: it renders only when
 *   src/content/posts has at least one entry.
 */
export const flags = {
  nowBuilding: false,
} as const;

/** In-page sections that the header links to. */
export const navItems = [
  { label: 'Work', hash: 'work' },
  { label: 'Experience', hash: 'experience' },
  { label: 'About', hash: 'about' },
  { label: 'Contact', hash: 'contact' },
] as const;
