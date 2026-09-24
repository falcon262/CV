/**
 * Education and certifications (docs/brief.md, section 6.10).
 * Adding a certification later (AZ-104, AZ-305, CKAD, PMP) is one new entry here.
 */
export interface Credential {
  title: string;
  /** Institution and mode, when there is one. */
  detail?: string;
  /** A year, or a status such as "In progress" or "Currently studying". */
  when: string;
  /** Status entries use the settled colour. */
  status?: boolean;
}

export const credentials: Credential[] = [
  { title: 'BSc Computer Engineering', detail: 'University of Ghana, Legon', when: '2021' },
  { title: 'LLB (Hons) Law', detail: 'University of Suffolk, online', when: 'In progress', status: true },
  { title: 'Microsoft Certified: Azure AI Fundamentals (AI-900)', when: '2024' },
  {
    title: 'Azure Administrator (AZ-104), then Azure Solutions Architect (AZ-305)',
    when: 'Currently studying',
    status: true,
  },
];
