/** Which architecture diagram belongs to which case study, and its page caption. */
import DiagramApl from '../components/diagrams/DiagramApl.astro';
import DiagramEcobud from '../components/diagrams/DiagramEcobud.astro';
import DiagramAiReporting from '../components/diagrams/DiagramAiReporting.astro';
import DiagramEvat from '../components/diagrams/DiagramEvat.astro';
import DiagramIfrs from '../components/diagrams/DiagramIfrs.astro';

export const diagrams = {
  apl: {
    component: DiagramApl,
    caption: 'The commission cycle, from broker onboarding to payment at the bank, with reports from the general ledger.',
  },
  ecobud: {
    component: DiagramEcobud,
    caption: 'Budget approval and expenditure tracking, side by side.',
  },
  'ai-reporting-engine': {
    component: DiagramAiReporting,
    caption: 'From a plain-English question to a live report, with no credentials in the reporting path.',
  },
  'e-vat': {
    component: DiagramEvat,
    caption: 'Invoice certification between a business ERP and the Ghana Revenue Authority.',
  },
  'ifrs-engines': {
    component: DiagramIfrs,
    caption: 'One source of banking data, two engines and one set of regulatory reports.',
  },
} as const;

export type DiagramSlug = keyof typeof diagrams;

export function diagramFor(slug: string) {
  const entry = diagrams[slug as DiagramSlug];
  if (!entry) throw new Error(`No diagram registered for case study "${slug}".`);
  return entry;
}
