/** Experience timeline, newest first (docs/brief.md, section 6.4). */
export interface Role {
  /** Shown as written, for example "Sep 2022 to Jul 2026". */
  dates: string;
  /** Machine-readable start and end for <time>; end is omitted while current. */
  start: string;
  end?: string;
  title: string;
  company: string;
  location: string;
  summary: string;
}

export const experience: Role[] = [
  {
    dates: '2024 to now',
    start: '2024',
    title: 'Senior Software Engineer',
    company: 'TechHalo Labs',
    location: 'Remote, Edmond, Oklahoma, USA',
    summary:
      'Lead a team of eight engineers on an enterprise AI platform of eight microservices. Delivered an AI reporting engine for a healthcare client and redesigned how two internal systems share data, so reports run in production without exposing sensitive credentials.',
  },
  {
    dates: 'Sep 2022 to Jul 2026',
    start: '2022-09',
    end: '2026-07',
    title: 'Senior Associate, Software Engineer and Technical Lead',
    company: 'PwC Ghana, Consulting and Risk Services',
    location: 'Accra, Ghana',
    summary:
      'Built regulatory and financial systems for banks, government and regional institutions, including ECOBUD, the E-VAT middleware and IFRS 9 and 16 engines. Mentored junior developers on clean architecture.',
  },
  {
    dates: 'Sep 2020 to Aug 2021',
    start: '2020-09',
    end: '2021-08',
    title: 'Software Engineer, Team Lead',
    company: 'PARC Robotics',
    location: 'Remote, Senegal',
    summary:
      'Led a distributed team building the Pan-African Robotics Competition virtual sandbox, shipped as a Unity WebGL build, including a block-based visual scripting engine.',
  },
  {
    dates: 'Jan 2020 to Jan 2021',
    start: '2020-01',
    end: '2021-01',
    title: 'Game Developer, Technical Lead',
    company: 'Mills Media Ghana',
    location: 'Accra, Ghana',
    summary: 'Led designers and developers shipping Unity and C# games to Google Play, passing 10,000 downloads.',
  },
];
