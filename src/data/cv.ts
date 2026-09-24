/**
 * Wording for the printable CV only (src/pages/cv-print.astro), which
 * `npm run cv` prints to public/cv/Joseph-Kofi-Asante-CV.pdf. Titles, dates,
 * locations, contact details, tools and credentials come from the other data
 * files, so the CV and the site never disagree.
 *
 * Every line restates docs/brief.md (sections 6, 8 and 10); change a fact
 * there first. The brief does not say where or when APL was delivered, so it
 * stands on its own as a selected project rather than under an employer.
 */
export interface CvRole {
  /** Matches `company` in experience.ts. */
  company: string;
  points: string[];
  stack?: string[];
}

export const cv = {
  headline: 'Senior .NET engineer and technical lead',
  /** The site's availability line, one sentence per line. */
  availability: ['Based in Accra, Ghana.', 'Open to senior roles, remote or with relocation.'],
  profile:
    'For seven years I’ve built payment, budgeting, tax and regulatory systems for banks, insurers and governments across West Africa and the US. Most of that work sits where software meets money or regulation: commission payments for a US insurer, a budget system for the ECOWAS Parliament, VAT certification for Ghana’s revenue authority, and impairment and lease engines for two Ghanaian banks. The part of the job I enjoy most is turning a specification, a regulation or a messy dataset into something a finance team trusts. I lead a team of eight at TechHalo Labs and stay hands-on, from design to live release.',
  roles: [
    {
      company: 'TechHalo Labs',
      points: [
        'Lead a team of eight engineers on an enterprise AI platform of eight microservices.',
        'Delivered an AI reporting engine for a healthcare client, letting staff query operational data in plain English and run a catalogue of live reports on how member enquiries are handled.',
        'Redesigned the way two internal systems share data so reports could run safely in production without exposing sensitive credentials, resolving a blocker that had kept a key report from launching, and saw it through from design to live release.',
        'Used analysis of live data to settle contested design decisions, and produced a prioritised set of security and reliability risks for the team.',
      ],
      stack: ['.NET', 'Angular', 'TypeScript', 'SQL Server'],
    },
    {
      company: 'PwC Ghana, Consulting and Risk Services',
      points: [
        'Architected and led ECOBUD, an automated budget management system for the ECOWAS Parliament, completed in August 2025. It cut budget processing time by half across member states and gave a multi-currency (UA and USD), multi-country budget a single auditable approval trail.',
        'ECOBUD brings together a four-level approval workflow, SAP integration for expenditure tracking with variance analysis, sign-in through Active Directory (LDAP) and Excel reporting with EPPlus.',
        'Built the E-VAT middleware connecting ERP systems to the Ghana Revenue Authority for invoice certification: a saga orchestrating the multi-step workflow, a transactional outbox keeping records and published events consistent, retries with exponential backoff and scheduled status polling.',
        'Built IFRS 9 and IFRS 16 engines for Consolidated Bank Ghana and Fidelity Bank Ghana, replacing manual regulatory calculations with automated, repeatable engines: expected credit loss impairment, supported by probability-of-default calibration validation reporting, and lease amortisation schedules.',
        'Mentored junior developers on clean architecture.',
      ],
      stack: ['C#', '.NET', 'ABP Framework', 'Angular', 'TypeScript', 'SQL Server', 'Hangfire', 'EPPlus'],
    },
    {
      company: 'PARC Robotics',
      points: [
        'Led a distributed team building the Pan-African Robotics Competition virtual sandbox, shipped as a Unity WebGL build with a block-based visual scripting engine and profiled for build size, load time and memory so it ran well in students’ browsers.',
      ],
    },
    {
      company: 'Mills Media Ghana',
      points: ['Led designers and developers shipping Unity and C# games to Google Play, passing 10,000 downloads.'],
    },
  ] satisfies CvRole[],
  project: {
    title: 'APL Commissions Platform',
    role: 'Technical lead',
    summary:
      'A greenfield commissions platform for a US insurance carrier, covering the whole cycle from onboarding brokers to paying them by ACH.',
    points: [
      'Built a custom NACHA/ACH payment file library directly from the NACHA specification, so every record, field and control total can be checked line by line against the specification the bank validates against.',
      'Built a general ledger accounting subsystem.',
      'Introduced a modular OpenAPI specification strategy with automated TypeScript client generation, giving type-safe integration between the .NET API and the React front end.',
      'Designed a reusable three-layer report architecture (controller, rendering service, data service) using QuestPDF and ClosedXML, later reused successfully on a second platform.',
      'Integrated ClickHouse for commission calculations, with background processing on Hangfire.',
    ],
    stack: ['.NET 9', 'React 18', 'TypeScript', 'SQL Server', 'Hangfire', 'QuestPDF', 'ClosedXML', 'ClickHouse'],
  },
  earlierWork:
    'I built games and VR in Unity, including Heroes of the Past, which tells African history through interactive storytelling; Gold Coast, an educational game about Ghana’s colonial history and the road to independence; and a virtual reality property walkthrough for Sucasa Ghana.',
  talk: 'Talk: “AI in Gaming and Real-World Simulations”, AI in Tech Stakeholders Summit, Ghana Tech Lab, 2019.',
};
