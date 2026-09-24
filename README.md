# Joseph Kofi Asante, portfolio

The portfolio of Joseph Kofi Asante, senior .NET engineer and technical lead, served at
**https://falcon262.github.io/CV/**. It is a static [Astro](https://astro.build) 7 site with
plain CSS, no UI framework and about 2 KB of client JavaScript, deployed to GitHub Pages by
GitHub Actions.

- The full specification, including every content rule, is [`docs/brief.md`](docs/brief.md).
- Standing rules for anyone (or any agent) editing the site are in [`CLAUDE.md`](CLAUDE.md).
- Every screenshot review is logged in [`docs/review-log.md`](docs/review-log.md).
- The previous hand-written site is preserved on the `legacy-v1` branch.

## Getting started

You need Node.js 22.12 or later.

```sh
npm ci
npm run dev        # http://localhost:4321/CV/
```

The site lives under `/CV/` because it is a GitHub Pages project site. Build every internal
link with `url()` from `src/lib/url.ts`; never hard-code a leading `/`.

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Local development server. |
| `npm run build` | Builds the static site into `dist/`. |
| `npm run preview` | Serves `dist/` locally. |
| `npm run check` | `astro check` plus the content guard (`scripts/check-content.mjs`): no em dashes, arrows or middle dots, no blocked terms, no hex colours outside `tokens.css`, and a report of `TODO(Joseph)` markers, draft case studies and case study word counts. In CI (strict mode) it also fails when the CV PDF is missing. |
| `npm run check:links` | Checks every internal link, asset, anchor and redirect in `dist/`. Run after a build. |
| `npm run size` | Client JavaScript budget: under 10 KB gzipped in total. Run after a build. |
| `npm run screens` | Screenshots every route at 1440, 768 and 390 in light and dark (reduced motion on) plus the hero keyframes, into `.screens/`. Run after a build. |
| `npm run test:a11y` | Playwright tests: axe on every route in both themes, the keyboard pass and the motion behaviour. Run after a build. |
| `npm run lhci` | Lighthouse CI (mobile) on `/` and `/work/apl/`; fails below 95 in any category. Run after a build. |
| `npm run og` | Regenerates `public/og.png` from the hidden `/og` page, and the PNG favicons from `public/favicon.svg`. Run after a build, then build again. |

Playwright and Lighthouse need a Chromium. Either run `npx playwright install chromium` once,
or point them at one you already have with `CHROMIUM_PATH` (Playwright) and `CHROME_PATH`
(Lighthouse).

## Editing content

Everything on the site must be traceable to `docs/brief.md`. Change a fact there first, then
here. `npm run check` enforces the blocked terms and punctuation rules.

### Add a case study

1. Create `src/content/work/<slug>.mdx` with this frontmatter (the schema is in
   `src/content.config.ts`):

   ```yaml
   ---
   title: Project title
   slug: project-slug          # becomes /work/project-slug/
   order: 6                    # position on the home page and in previous/next
   outcome: One line on what it achieved.
   client: Client name
   role: Your role
   team: Eight engineers       # optional, only if known
   when: 2024 to 2025          # optional, only if known
   stack: [".NET", "SQL Server"]
   chips: [".NET", "SQL Server"] # up to four, shown on the home page tile
   tile: row                   # feature, pair or row
   draft: true                 # until reviewed
   ---
   ```

2. Write the body with the sections `## Context`, `## The problem`, `## What I did`,
   `## Key decisions` and `## Outcome`. For key decisions, import
   `src/components/KeyDecisions.astro` and pass `items` with `decision`, `why` and, only when
   there was one, `alternative`. For code, use `src/components/CodeBlock.astro`.
3. Add its architecture diagram: copy one of `src/components/diagrams/Diagram*.astro`, describe
   the boxes and arrows for the wide, medium, narrow and compact (four boxes at most) layouts,
   and register it with a caption in `src/lib/diagrams.ts`.
4. Run `npm run check` (word counts are reported), `npm run build` and `npm run screens`,
   look at the screenshots, and log the review in `docs/review-log.md`.

### Add a certification

Add one entry to `src/data/credentials.ts`, for example:

```ts
{ title: 'Microsoft Certified: Azure Administrator Associate (AZ-104)', when: '2027' },
```

Use `status: true` for entries such as "In progress" so they show in the status colour, and
update or remove the "Currently studying" entry as things change. No layout work is needed.

### Add a post

Create `src/content/posts/<name>.md` with:

```yaml
---
title: Post title
date: 2026-10-01
platform: Where it was published
url: https://example.com/the-post
readingMinutes: 6
---
```

The Writing section appears on the home page automatically once there is at least one post,
and links out to `url`. With no posts there is no section at all.

### Turn on "Now building"

1. Tidy the [cross-border-settlement](https://github.com/falcon262/cross-border-settlement)
   README.
2. In `src/components/NowBuilding.astro`, fill `whatWorksToday` (the `TODO(Joseph)`), only
   from what the repository's README and code demonstrably do.
3. In `src/data/site.ts`, set `flags.nowBuilding` to `true`.

## The CV PDF

Put the current CV at **`public/cv/Joseph-Kofi-Asante-CV.pdf`**. Every "Download CV" button
links there. Until it exists, `npm run check` and the link check warn locally and fail in CI.

## Deployment

- `.github/workflows/ci.yml` runs on pull requests: install, check, build, link check,
  JavaScript budget, Playwright tests and Lighthouse.
- `.github/workflows/deploy.yml` runs on every push to `master` (and on demand): it builds with
  `withastro/action` and publishes with `actions/deploy-pages`.

### Cutover from the old site

1. Put the latest CV PDF at `public/cv/Joseph-Kofi-Asante-CV.pdf` on the `redesign` branch and
   push.
2. On GitHub, go to Settings, then Pages, and change "Source" from "Deploy from a branch" to
   "GitHub Actions". Do this immediately before merging; otherwise Pages would briefly serve
   the raw Astro source from `master`.
3. Merge the pull request and watch the deploy workflow finish.
4. Check that https://falcon262.github.io/CV/, `/CV/index.html` and a case study page load,
   and that the CV downloads.
5. If anything is wrong, revert the merge. The old site is preserved on `legacy-v1` (and on
   the `v1-legacy` tag once it is pushed).
