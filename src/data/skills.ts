/** "Tools I use" (docs/brief.md, section 6.7). Plain grouped lists, not chips. */
export interface ToolGroup {
  title: string;
  items: string[];
}

export const toolGroups: ToolGroup[] = [
  {
    title: 'Languages and frameworks',
    items: [
      'C#',
      '.NET (through .NET 10)',
      'ASP.NET Core',
      'Entity Framework Core',
      'ABP Framework and ASP.NET Zero',
      'TypeScript',
      'Angular',
      'React',
      'Python',
      'Node.js',
    ],
  },
  {
    title: 'Architecture',
    items: [
      'microservices',
      'event-driven patterns (saga, outbox)',
      'clean architecture',
      'domain-driven design',
      'REST and OpenAPI design with generated TypeScript clients',
    ],
  },
  {
    title: 'Data and jobs',
    items: ['SQL Server', 'PostgreSQL', 'ClickHouse', 'Hangfire', 'QuestPDF', 'ClosedXML'],
  },
  {
    title: 'Security and platform',
    items: ['OAuth 2.0 and OpenID Connect (OpenIddict)', 'Azure', 'CI/CD'],
  },
  {
    title: 'Domains',
    items: ['payments (NACHA/ACH)', 'IFRS 9 and IFRS 16', 'government budgeting', 'tax integration'],
  },
  {
    title: 'Leadership',
    items: ['leading a team of eight', 'code review', 'mentoring', 'delivery planning'],
  },
];
