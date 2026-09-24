import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Case studies (docs/brief.md, section 7). The glob loader uses the `slug`
 * frontmatter field as the entry id, so pages live at /work/<slug>/.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number().int(),
    outcome: z.string(),
    client: z.string(),
    role: z.string(),
    team: z.string().optional(),
    when: z.string().optional(),
    stack: z.array(z.string()).min(1),
    /** Up to four stack chips for the home page tile. */
    chips: z.array(z.string()).min(1).max(4),
    tile: z.enum(['feature', 'pair', 'row']),
    /** Joseph reviews every case study before launch. */
    draft: z.boolean(),
  }),
});

/**
 * Writing. Each entry links out to where the post was published.
 * The Writing section on the home page renders only when this has entries.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    platform: z.string(),
    url: z.url(),
    readingMinutes: z.number().int().positive(),
  }),
});

export const collections = { work, posts };
