# Portfolio rebuild: build brief for Claude Code

This file is the complete specification for rebuilding Joseph Kofi Asante's portfolio in this repository (github.com/falcon262/CV, served at https://falcon262.github.io/CV/). Read all of it before doing anything. Every design, content and stack decision has already been made. Do not reopen a decision unless it is technically impossible, and if so, say why and propose the closest alternative.

---

## 0. How to work through this brief

1. Start in plan mode. Complete milestone M0 (section 13), then **stop** and report your findings and plan.
2. When Joseph replies "go", work through M1 to M6 in order **without stopping**, unless you are genuinely blocked (missing credentials, a failing tool you cannot fix, or a contradiction in this brief).
3. **Stop** again at the end of M6 with the handoff report.
4. Commit at the end of each milestone on the `redesign` branch with a clear message.
5. Keep `docs/review-log.md` as a running log of every screenshot review: what you checked, what was wrong, what you changed.

---

## 1. Goal and audience

Joseph Kofi Asante is a senior software engineer and technical lead based in Accra, Ghana, with about seven years of experience. He is targeting senior .NET engineering and technical lead roles in the UK and Europe, remote or with relocation.

**The site's one job:** within 90 seconds, convince a hiring manager or recruiter that Joseph is a senior engineer who builds financial, government and regulatory systems that have to be correct. Then make it effortless to email him or download his CV.

**Audience, in order:**
- engineering managers and heads of engineering at UK and EU fintechs, banks and product companies
- technical recruiters
- senior engineers doing a pre-interview look

**Tone:** calm, precise, confident. Engineered, not flashy. The modern feel comes from restraint, typography and a few well-judged motion moments, not effects.

---

## 2. What is in the repository today (verify in M0)

The current site is hand-written static HTML with inline CSS and JS, served from `main` by GitHub Pages ("Deploy from a branch").

| Path | What it is | Decision |
|---|---|---|
| `index.html` | The whole current site, emoji-heavy, one page | Replace. Keep the URL working: `/CV/index.html` must still resolve, because it is printed on Joseph's CVs. |
| `Hobbies.html`, `ContactMe.html` | Placeholder stubs with template junk ("Fictional address", "myemail@gmail.com") | Delete. Add redirect stubs: `/CV/Hobbies.html` goes to `/CV/`, and `/CV/ContactMe.html` goes to `/CV/#contact`. |
| `joseph.png` | Portrait, 793 x 793 | Reuse in About, optimised. |
| `game_images/*.png` | Screenshots of earlier Unity, XR and game work | Reuse in the "Before enterprise software" section (mapping in section 10), optimised. `Dwello.png` is 10.7 MB and is not used (see section 10). |
| `game_images/Joseph Kofi Asante Resume-1.pdf` | An outdated CV | **Do not reuse.** It contains claims being retired. |
| `README.md` | One line | Rewrite (M6). |

**Known problems on the live site, all fixed by this rebuild:**
- The LinkedIn link points to `https://linkedin.com` rather than Joseph's profile.
- The public phone number is shown.
- It claims technologies Joseph does not use in production: Kubernetes, Docker, Azure Service Bus, AWS, Azure API Management, Cognitive Services. None of these may appear on the new site (see section 3).

---

## 3. Non-negotiable content rules

These are enforced by `npm run check` (section 11) where possible.

1. **Honesty.** Every claim must be traceable to the fact sheets in this brief. Never add a technology, skill, client, metric, title or outcome that is not written here. If a section would need a fact that is not here, make the section shorter rather than inventing one.

2. **Blocked terms.** These must not appear anywhere in site copy (case-insensitive, whole word): Kubernetes, AKS, Docker, Service Bus, RabbitMQ, Kafka, AWS, NoSQL, MongoDB, Cosmos DB, Cognitive Services, API Management, Java, Spring Boot, lorem. Terms are removed from the blocklist only by Joseph, when he has shipped work that proves them.

3. **Metrics.** The only metrics allowed are these two:
   - ECOBUD cut budget processing time by half.
   - Mills Media games passed 10,000 downloads on Google Play.
   Scale facts in the fact sheets (for example cost-centre counts) may appear once in a case study's Context section, never as headline stats.

4. **Punctuation and style.** No em dashes (U+2014) anywhere in copy; use commas, colons, full stops or parentheses. No arrows (U+2192) in link or button text. No middle-dot separators (U+00B7) in metadata. Sentence case everywhere. No all-caps labels.

5. **Clients.**
   - Name these exactly as written: ECOWAS Parliament, Ghana Revenue Authority, Consolidated Bank Ghana, Fidelity Bank Ghana.
   - The APL client is "a US insurance carrier". Do not name the carrier.
   - The AI reporting engine client is "a healthcare client" or "a healthcare customer service platform". Do not name it or any internal product name.

6. **Left out on purpose.** Do not include any of these:
   - phone number
   - the consultancy Falcon Solutions
   - any role or employer not listed in section 7
   - the old AI-102 or Angular certification "in progress" claims

7. **Titles and locations.** TechHalo Labs title is "Senior Software Engineer". Its location is "Remote, Edmond, Oklahoma, USA".

8. **Voice.** Case study and About copy is first person, plain and specific. Mark every case study `draft: true` in frontmatter; Joseph reviews them before launch.

---

## 4. Stack and architecture (decided)

**Framework:** Astro, latest stable 7.x, TypeScript strict, Node 22.12 or later. Static output only. Read the current Astro docs for anything version-specific (content collections config, images, redirects) rather than relying on memory.

**Styling:** plain CSS with custom properties, using Astro scoped styles plus one global `tokens.css` and `global.css`. No Tailwind and no CSS framework. The design is token-driven and small, so utility classes would add weight without adding control.

**Client JavaScript:**
- No UI framework.
- Use small vanilla TypeScript modules in Astro `<script>` tags, for these jobs only: theme toggle, hero sequence control, header hide-on-scroll, copy email, reading progress, mobile menu.
- Budget: under 10 KB gzipped in total.

**Fonts:** self-hosted from npm, latin subset, `font-display: swap`. Preload only the Schibsted Grotesk file used by the hero headline.
- `@fontsource-variable/schibsted-grotesk`
- `@fontsource-variable/source-serif-4`
- `@fontsource-variable/jetbrains-mono`

**Images:** Astro's built-in image pipeline, outputting AVIF and WebP with responsive widths and explicit dimensions. Every image gets meaningful alt text.

**Integrations and tests:**
- `@astrojs/sitemap`
- `@astrojs/check`
- `@playwright/test` and `@axe-core/playwright` for tests
- `@lhci/cli` for Lighthouse

**GitHub Pages project site config:**
- `site: 'https://falcon262.github.io'` and `base: '/CV'`
- Build every internal link and asset path through one helper that prefixes `import.meta.env.BASE_URL`. Never hard-code `/`.
- Directory-style output (`/work/apl/index.html`).

**Deploy:** GitHub Actions using `withastro/action@v6` and `actions/deploy-pages@v5`, on push to `main` (section 12).

**No analytics, trackers or third-party scripts.**

**Suggested structure** (adjust names if Astro 7 conventions differ):

```
src/
  assets/            portrait and lab images (moved from repo root and game_images/)
  components/        Header, Footer, ThemeToggle, Hero, RecordBlock, CaseTile, Timeline,
                     NowBuilding, LabList, CertRow, ContactBlock, CodeBlock, Diagram*, ProgressBar
  content/
    work/            apl.md, ecobud.md, ai-reporting-engine.md, e-vat.md, ifrs-engines.md
    posts/           empty for now (Writing section renders only when this has entries)
  data/              experience.ts, skills.ts, lab.ts, credentials.ts, site.ts (links, feature flags)
  layouts/           Base.astro, CaseStudy.astro
  pages/             index.astro, work/[slug].astro, 404.astro, og.astro (noindex, excluded from sitemap)
  styles/            tokens.css, global.css
  lib/               url.ts (base-aware links)
public/
  cv/Joseph-Kofi-Asante-CV.pdf   supplied by Joseph (see M6)
  favicon.svg, og.png, robots.txt
scripts/
  check-content.mjs, screens.ts, og.ts
tests/
  a11y.spec.ts
docs/
  brief.md (this file), review-log.md
CLAUDE.md
```

**Feature flags in `src/data/site.ts`:**
- `nowBuilding: false`. The Now building tile stays hidden until Joseph turns it on after tidying the cross-border-settlement README.
- `writing` is automatic: the Writing section shows only when `content/posts` has an entry.

---

## 5. Design system

### 5.1 Tokens (`src/styles/tokens.css`)

Light is the default. Dark applies when `data-theme="dark"`, or when the OS prefers dark and the user has not chosen light.

```css
:root {
  --color-paper: #F6F8FB;      /* page background, cool ledger white */
  --color-surface: #FFFFFF;    /* record block, media frames, code */
  --color-ink: #14213D;        /* primary text */
  --color-ink-muted: #56627A;  /* secondary text, metadata */
  --color-rule: #D8DEE8;       /* hairlines, borders */
  --color-brand: #2E5090;      /* ledger blue: links, focus, parsed underlines, progress */
  --color-settled: #1E7A5A;    /* status only: balanced, settled, in progress */

  --font-display: "Schibsted Grotesk Variable", "Helvetica Neue", Arial, sans-serif;
  --font-serif: "Source Serif 4 Variable", Georgia, serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, "SFMono-Regular", Menlo, monospace;

  /* fluid type: 390px to 1440px viewport */
  --step-display: clamp(3rem, 2.071rem + 3.81vw, 5.5rem);      /* 48 to 88, lh 1.0, tracking -0.02em */
  --step-h1: clamp(2.375rem, 1.957rem + 1.714vw, 3.5rem);      /* 38 to 56, lh 1.07 */
  --step-h2: clamp(1.75rem, 1.611rem + 0.571vw, 2.125rem);     /* 28 to 34, lh 1.18 */
  --step-h3: clamp(1.25rem, 1.204rem + 0.19vw, 1.375rem);      /* 20 to 22, lh 1.36 */
  --step-body: clamp(1rem, 0.977rem + 0.095vw, 1.0625rem);     /* 16 to 17, lh 1.65 */
  --step-body-lg: clamp(1.125rem, 1.08rem + 0.19vw, 1.25rem);  /* hero subline */
  --step-serif: 1.125rem;                                       /* case study body, lh 1.67 */
  --step-small: 0.875rem;                                       /* lh 1.57 */
  --step-caption: 0.8125rem;                                    /* lh 1.54 */

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;  --space-5: 24px;
  --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;  --space-10: 128px;

  --radius-sm: 2px;    /* chips, inputs */
  --radius-md: 8px;    /* media frames, record block, code */
  --radius-full: 999px;/* theme toggle, portrait */

  --measure: 68ch;
  --content-max: 1200px;
  --gutter: 24px;

  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.3, 0, 1, 1);
}

:root[data-theme="dark"] {
  --color-paper: #0D1524;  --color-surface: #131D30;
  --color-ink: #E7EBF3;    --color-ink-muted: #9AA6BD;
  --color-rule: #26324A;   --color-brand: #86A3E6;  --color-settled: #5CC49A;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* same dark values as above */ }
}
```

**Colour rules:**
- All colours come from these tokens. No other hex values in components.
- Every text and interactive pair must pass WCAG 2.2 AA in both themes (axe verifies this).
- Dark mode is deep navy, never neutral black.

### 5.2 Typography rules

- **Schibsted Grotesk** for everything except case study body text and code. Use weights 500 and 700 only.
- **Source Serif 4** only for case study long-form body.
- **JetBrains Mono** only for the hero record block and code snippets. Never for labels, dates or metadata.
- Keep line length at 68ch or less for prose.
- Do not accent one word of a headline with a colour, italic or weight change.

### 5.3 Layout rules

- **Grid:** 12 columns with 24px gutters at desktop (fluid side margins of at least 32px), 8 columns at 768, and 4 columns with 20px margins at 390.
- **Alignment:** everything is left aligned. Only the 404 page is centred.
- **Separation:** use space and hairline rules (`--color-rule`), not shadows. No box-shadows anywhere.
- **Radius:** varies by hierarchy on purpose. Never apply one radius to everything.

### 5.4 Things that must not appear

- stock photos, 3D blobs, gradient meshes, glassmorphism, neon glows
- all-caps eyebrow labels above headings
- numbered section markers (01, 02, 03); the experience timeline is the only dated sequence
- arrows appended to link or button text; middle-dot metadata
- identical rounded cards with the same shadow; skill percentage bars; logo walls; star ratings
- invented testimonials; lorem ipsum

---

## 6. Home page (`/`)

**Section order:** Header, Hero, Selected work, Experience, Now building (flagged), About, Tools I use, Before enterprise software, Writing (auto), Education and certifications, Contact, Footer.

Every section gets an `id` for in-page links: `work`, `experience`, `about`, `contact`.

### 6.1 Header

- Sticky, 64px tall. A skip link ("Skip to content") is the first focusable element.
- **Left:** the wordmark "Joseph Kofi Asante", linking home.
- **Right:** Work, Experience, About, Contact, the theme toggle, and a "Download CV" button (secondary style).
- **Below 768px:** wordmark, theme toggle, and a menu button that opens a full-screen sheet. The sheet traps focus, closes on Escape, and returns focus to the button.

### 6.2 Hero

Minimum height is 88svh on desktop. On desktop the headline, subline, actions and availability line take the left 7 columns, and the record block takes the right 5 columns.

**Record block.** A `--color-surface` panel with `--radius-md` and the mono font. It shows exactly these four lines. Each is 94 characters, NACHA-style, and whitespace must be preserved:

```
101 ASANTE JOSEPH KOFI     SENIOR SOFTWARE ENGINEER   TECHNICAL LEAD                  ACCRA GH
520 CSHARP DOTNET          PAYMENTS BUDGETING TAX REGULATORY                      US GH ECOWAS
622 AVAILABILITY           REMOTE OR RELOCATION                                          UK EU
900 ENTRIES 0000004        DEBITS 000000000000  CREDITS 000000000000                  BALANCED
```

Final (resting) state of the record block:
- The fields "ASANTE JOSEPH KOFI", "SENIOR SOFTWARE ENGINEER", "ACCRA GH" and "BALANCED" carry a 1px `--color-brand` underline.
- The rest of the block sits at reduced contrast (`--color-ink-muted`).
- "BALANCED" is set in `--color-settled` with a small inline SVG check after it.
- On narrow screens the block scrolls horizontally inside its own container and is cropped with a right-edge fade mask. The page body never scrolls sideways.

Accessibility of the record block:
- The block is a `<button>` with `aria-label="Replay the record animation"`.
- Its text content is `aria-hidden="true"`, because the headline carries the meaning.

**Hero copy:**
- **Headline** (`--step-display`, h1): "I build software that has to balance."
  - Split into word spans at build time for the animation.
  - Put `aria-label` with the full sentence on the h1, and `aria-hidden` on the spans.
- **Subline** (`--step-body-lg`, max 60ch): "Senior .NET engineer and technical lead. For seven years I've built payment, budgeting, tax and regulatory systems for banks, insurers and governments across West Africa and the US."
- **Actions:**
  - Primary "See my work": scrolls to `#work`.
  - Secondary "Download CV": links to `cv/Joseph-Kofi-Asante-CV.pdf` with the `download` attribute.
- **Availability** (`--step-small`, ink-muted): "Based in Accra, Ghana. Open to senior roles, remote or with relocation."

**Below 768px:** the record block sits above the headline and shows lines 1 and 9 only.

### 6.3 Selected work (`#work`, h2 "Selected work")

Five projects in a deliberately uneven layout. Do not build a grid of identical cards.
- **APL:** one full-width feature tile, with media on the right at desktop and below the text on mobile.
- **ECOBUD and the AI reporting engine:** a two-up pair.
- **E-VAT and the IFRS engines:** compact, text-led rows separated by hairlines, with a small media thumbnail.

Each tile shows:
- the title (h3)
- the one-line outcome
- a meta row of labelled pairs (`Client` and `Role`) marked up as a `<dl>`
- up to four stack chips (`--radius-sm`, hairline border, no fill)
- a media area showing that project's architecture diagram (section 9)

The whole tile is one link to `/work/<slug>/`, with a single accessible name (the title).

| Slug | Title | Client | Role | Outcome | Chips |
|---|---|---|---|---|---|
| `apl` | APL Commissions Platform | US insurance carrier | Technical lead | A greenfield commissions platform covering the whole cycle from onboarding brokers to paying them, including a NACHA/ACH payment library built directly from the specification and a general ledger accounting subsystem. | .NET 9, React, SQL Server, Hangfire |
| `ecobud` | ECOBUD, ECOWAS Parliament | ECOWAS Parliament | Architect and technical lead | An automated budget management system that cut budget processing time by half across ECOWAS member states and gave a multi-currency, multi-country budget a single auditable approval trail. | .NET, Angular, ABP Framework, SQL Server |
| `ai-reporting-engine` | AI reporting engine | Healthcare customer service platform | Senior engineer, leading a team of eight | Staff ask questions of operational data in plain English and run a catalogue of live reports on how member enquiries are handled. | .NET, Angular, TypeScript, SQL Server |
| `e-vat` | E-VAT middleware, Ghana Revenue Authority | Ghana Revenue Authority integration | Engineer | Connects business ERP systems to the Ghana Revenue Authority so invoices are certified automatically and reliably. | .NET, Hangfire, SQL Server |
| `ifrs-engines` | IFRS 9 and IFRS 16 engines | Consolidated Bank Ghana, Fidelity Bank Ghana | Engineer | Replaced manual regulatory calculations with automated engines for expected credit loss impairment and lease accounting. | .NET, Angular, SQL Server |

### 6.4 Experience (`#experience`, h2 "Experience")

A vertical timeline, newest first. A 1px rail runs down the left, with a dot per item. Each item shows dates, title, company, location and the text below.

1. **2024 to now.** Senior Software Engineer, TechHalo Labs. Remote, Edmond, Oklahoma, USA.
   "Lead a team of eight engineers on an enterprise AI platform of eight microservices. Delivered an AI reporting engine for a healthcare client and redesigned how two internal systems share data, so reports run in production without exposing sensitive credentials."
2. **Sep 2022 to Jul 2026.** Senior Associate, Software Engineer and Technical Lead, PwC Ghana, Consulting and Risk Services. Accra, Ghana.
   "Built regulatory and financial systems for banks, government and regional institutions, including ECOBUD, the E-VAT middleware and IFRS 9 and 16 engines. Mentored junior developers on clean architecture."
3. **Sep 2020 to Aug 2021.** Software Engineer, Team Lead, PARC Robotics. Remote, Senegal.
   "Led a distributed team building the Pan-African Robotics Competition virtual sandbox, shipped as a Unity WebGL build, including a block-based visual scripting engine."
4. **Jan 2020 to Jan 2021.** Game Developer, Technical Lead, Mills Media Ghana. Accra, Ghana.
   "Led designers and developers shipping Unity and C# games to Google Play, passing 10,000 downloads."

### 6.5 Now building (hidden while `nowBuilding` is false)

One tile:
- **Title:** "Cross-border settlement"
- **Status badge** (`--color-settled` text and border): "In progress"
- **Link:** "View on GitHub", pointing to https://github.com/falcon262/cross-border-settlement
- **Description:** "An open-source payments settlement service in .NET 10 and PostgreSQL, built in public with architecture decision records."
- A second line, "What works today:", is left as `TODO(Joseph)`. When the flag is turned on, fill it only from what the repository's README and code demonstrably do.

### 6.6 About (`#about`, h2 "About")

Portrait on the left: `joseph.png`, rendered at 320px, `--radius-full`, alt "Joseph Kofi Asante". Text on the right, max 64ch:

> I'm Joseph, a senior software engineer in Accra, Ghana. Most of what I've built sits where software meets money or regulation: commission payments for a US insurer, a budget system for the ECOWAS Parliament, VAT certification for Ghana's revenue authority, and impairment and lease engines for two Ghanaian banks. The part of the job I enjoy most is turning a specification, a regulation or a messy dataset into something a finance team trusts.
>
> I lead a team of eight at TechHalo Labs and stay hands-on, from design through to live release. Before enterprise software I built games and VR in Unity, which is where I learned to care about performance and about what a person actually sees on screen.

Below the bio, three principles. Show them as three columns on desktop and stacked on mobile, with no icons. Each has a bold-weight title and one sentence:
- **Settle arguments with data.** When a design decision is contested, I look at the live data before choosing.
- **Build from the spec.** Payment files, tax integrations and accounting rules get implemented against the source document, not someone's summary of it.
- **Keep secrets out of the data path.** Reports and integrations should run in production without anyone handling credentials they don't need.

### 6.7 Tools I use (h2 "Tools I use")

Grouped plain lists. Each group has an h3 and a comma-separated line (not chips).
- **Languages and frameworks:** C#, .NET (through .NET 10), ASP.NET Core, Entity Framework Core, ABP Framework and ASP.NET Zero, TypeScript, Angular, React, Python, Node.js
- **Architecture:** microservices, event-driven patterns (saga, outbox), clean architecture, domain-driven design, REST and OpenAPI design with generated TypeScript clients
- **Data and jobs:** SQL Server, PostgreSQL, ClickHouse, Hangfire, QuestPDF, ClosedXML
- **Security and platform:** OAuth 2.0 and OpenID Connect (OpenIddict), Azure, CI/CD
- **Domains:** payments (NACHA/ACH), IFRS 9 and IFRS 16, government budgeting, tax integration
- **Leadership:** leading a team of eight, code review, mentoring, delivery planning

### 6.8 Before enterprise software (h2 "Before enterprise software")

A compact list. Each row has a small thumbnail (or none), a title and one sentence. Content and image mapping are in section 10.

### 6.9 Writing (renders only when `content/posts` has entries)

h2 "Writing". Each row shows title, date, platform and reading time, and links out. Do not build a public empty state.

### 6.10 Education and certifications (h2 "Education and certifications")

- BSc Computer Engineering, University of Ghana, Legon, 2021
- LLB (Hons) Law, University of Suffolk, online, in progress
- Microsoft Certified: Azure AI Fundamentals (AI-900), 2024
- Currently studying: Azure Administrator (AZ-104), then Azure Solutions Architect (AZ-305)

Drive this from `credentials.ts`, so adding AZ-104, AZ-305, CKAD or PMP later is a one-line data change with no layout work.

### 6.11 Contact (`#contact`, h2 "Get in touch")

- One line: "Email is the quickest way to reach me."
- The address `thommpson19@gmail.com` set large (`--step-h2`) as a `mailto:` link.
- A "Copy email" button beside it.
- Text links to LinkedIn (https://www.linkedin.com/in/joseph-asante-864892185) and GitHub (https://github.com/falcon262), plus "Download CV".
- No form. No phone number.

### 6.12 Footer

One quiet line: "© {current year} Joseph Kofi Asante", plus the email, LinkedIn and GitHub links.

---

## 7. Case study pages (`/work/<slug>/`)

Layout `CaseStudy.astro`:

1. **Reading progress bar:** 2px, `--color-brand`, fixed at the top.
2. **Header:**
   - title (h1, Schibsted)
   - the one-line outcome
   - a `<dl>` with Client, My role, Team (only if known), When (only if known) and Stack
3. **Hero media:** the project's architecture diagram (section 9), full content width, inside a `<figure>` with a caption.
4. **Body** in Source Serif 4, max 68ch. Sections: Context, The problem, What I did, Key decisions, Outcome. Shorter projects may merge Context and The problem.
5. **Key decisions:** each decision is a block with three labelled parts (Decision, Alternative considered, Why), marked up as a `<dl>`. Use only the decisions listed in the fact sheet. Do not invent more.
6. **Code snippet component** (`CodeBlock`): mono, `--color-surface`, `--radius-md`, horizontal scroll, a "Copy code" button, and syntax highlighting using token colours only. Use it on the APL page for a short, illustrative C# `record` type representing a NACHA entry detail record. Mark it in a caption as "Illustrative, simplified from the production library".
7. **Previous and next** case study links with titles. The order is apl, ecobud, ai-reporting-engine, e-vat, ifrs-engines.

**Word counts:** APL, ECOBUD and the AI reporting engine run 350 to 600 words each. E-VAT and the IFRS engines run 200 to 350 words each.

**Frontmatter schema** (content collection): `title`, `slug`, `order`, `outcome`, `client`, `role`, `team?`, `when?`, `stack[]`, `tile` (feature | pair | row), `draft` (boolean).

---

## 8. Case study fact sheets (write only from these)

### APL Commissions Platform (`apl`)
- **What it is:** a greenfield commissions management platform for a US insurance carrier. It covers the commission lifecycle from broker onboarding through to ACH payment disbursement.
- **What Joseph built:**
  - He built a custom NACHA/ACH payment file library directly from the NACHA specification.
  - He built a general ledger accounting subsystem.
  - He introduced a modular OpenAPI specification strategy with automated TypeScript client generation, giving type-safe integration between the .NET API and the React frontend.
  - He designed a reusable three-layer report architecture (controller, rendering service, data service) using QuestPDF and ClosedXML. It was later reused successfully on a second platform.
  - Background processing uses Hangfire. ClickHouse was integrated for commission calculations.
- **Scale context** (may appear once, in Context): 44 business domains, 75+ REST APIs.
- **Key decisions:**
  1. Decision: build the NACHA/ACH file library from the specification. Alternative considered: a third-party library. Why: every record, field and control total could be checked line by line against the specification the bank validates against.
  2. Decision: a modular OpenAPI specification with generated TypeScript clients. Alternative considered: hand-written API clients. Why: the React frontend stays type-safe as the API grows.
  3. Decision: a reusable three-layer report architecture. Alternative considered: report logic inside controllers. Why: rendering and data access could change independently, and the pattern was reused on a second platform.
- **Stack:** .NET 9, React 18, TypeScript, SQL Server, Hangfire, QuestPDF, ClosedXML, ClickHouse.
- **Role:** technical lead. When and Team: leave out.

### ECOBUD, ECOWAS Parliament (`ecobud`)
- **What it is:** an automated budget management system for the ECOWAS Parliament. Joseph architected it at PwC Ghana, and it was completed in August 2025.
- **Outcome:** it cut budget processing time by half across member states, and gave a multi-currency, multi-country budget a single auditable approval trail.
- **Features:**
  - multi-currency budgeting (UA and USD)
  - a four-level approval workflow
  - SAP integration for expenditure tracking, with variance analysis
  - sign-in through Active Directory (LDAP)
  - Excel reporting with EPPlus
- **Scale context** (may appear once): 443 commitment items across 32 cost centres.
- **Key decisions:** use only these two.
  1. Decision: a single four-level approval workflow engine. Why: one auditable approval trail across all member states.
  2. Decision: integrate with SAP for expenditure data. Alternative considered: manual re-entry. Why: variance analysis stays current without duplicate data entry.
- **Stack:** C#, .NET, ABP Framework, Angular, TypeScript, SQL Server, EPPlus, Active Directory (LDAP).
- **Role:** architect and technical lead. **When:** 2024 to 2025.

### AI reporting engine (`ai-reporting-engine`)
- **Base the copy on this statement from Joseph** (you may restructure it, but add no facts): "Delivered an AI-powered reporting engine for a healthcare client's customer service platform, letting staff query operational data in plain English and run a catalogue of live reports on how member enquiries are handled. Redesigned the way two internal systems share data so reports could run safely in production without exposing sensitive credentials, resolving a blocker that had kept a key report from launching, and saw it through from design to live release. Used analysis of live data to settle contested design decisions, and produced a prioritised set of security and reliability risks for the team."
- **Context:** delivered at TechHalo Labs, where Joseph leads a team of eight engineers on an enterprise AI platform of eight microservices.
- **Key decisions:**
  1. Decision: redesign how the two systems share data so reporting never handles sensitive credentials. Why: it unblocked a key report for production.
  2. Decision: settle contested design questions with analysis of live data. Why: the choice rested on evidence rather than opinion.
- **Also delivered:** a prioritised security and reliability risk list for the team.
- **Stack:** .NET, Angular, TypeScript, SQL Server.
- **Role:** senior engineer, leading a team of eight. **Team:** eight engineers.

### E-VAT middleware (`e-vat`)
- **What it is:** middleware connecting private-sector ERP systems to the Ghana Revenue Authority's E-VAT system for invoice certification. Built at PwC Ghana.
- **Patterns:**
  - a saga orchestrating the multi-step certification workflow
  - a transactional outbox, so records and published events stay consistent
  - retries with exponential backoff
  - scheduled polling for certification status
- **Key decisions:**
  1. Decision: orchestrate certification as a saga. Why: each step can fail and be retried or compensated without losing the invoice's state.
  2. Decision: use a transactional outbox. Alternative considered: writing to the database and publishing separately. Why: the two can never disagree.
- **Stack:** .NET, Hangfire, SQL Server.
- **Role:** engineer.

### IFRS 9 and IFRS 16 engines (`ifrs-engines`)
- **What it is:** regulatory compliance automation for Consolidated Bank Ghana and Fidelity Bank Ghana, built at PwC Ghana. It covers two engines:
  - an IFRS 9 impairment engine computing expected credit loss, supported by probability-of-default calibration validation reporting
  - an IFRS 16 lease accounting engine producing lease amortisation schedules
- **Outcome:** it replaced manual regulatory calculations with automated, repeatable engines.
- **Key decisions:** none listed; omit that section on this page.
- **Stack:** .NET, ABP Framework, Angular, SQL Server.
- **Role:** engineer.

---

## 9. Architecture diagrams

Build each diagram as an inline SVG Astro component in the site's own style:
- hairline boxes in `--color-rule`, with `--radius-sm`
- labels in Schibsted Grotesk at `--step-small`
- arrows in `--color-brand`
- all colours from tokens, so the diagrams switch with the theme
- each wrapped in a `<figure>`, with `role="img"`, a `<title>` and a `<desc>`

Keep them abstract and truthful:

- **APL:** Broker onboarding, then Commission calculation, then General ledger, then NACHA file generation, then Bank. A branch from General ledger goes to Reports (PDF and Excel).
- **ECOBUD:**
  - Budget planning (UA and USD) goes to Four-level approval, then Approved budget.
  - SAP expenditure data goes to Variance analysis, then Reports.
  - A side note reads "Sign-in via Active Directory".
- **AI reporting engine:** Staff question in plain English, then Reporting engine, then Operational data, then Live report catalogue. A note on the engine-to-data link reads "No credentials in the reporting path".
- **E-VAT:** Business ERP, then Middleware (saga, outbox, retries), then GRA E-VAT service. Then Certified invoice, returned to the ERP.
- **IFRS engines:** Core banking data goes to both the IFRS 9 expected credit loss engine and the IFRS 16 lease engine. Both go to Regulatory reports.

On tiles, the diagrams render as scaled-down versions. On small tiles, simplify them to at most 4 boxes.

---

## 10. "Before enterprise software" entries and image mapping

Move the images to `src/assets/lab/` with kebab-case names.

| Title | Sentence | Image (from `game_images/`) |
|---|---|---|
| PARC Robotics virtual sandbox | The Pan-African Robotics Competition sandbox, shipped as a Unity WebGL build with a block-based visual scripting engine, profiled for build size, load time and memory so it ran well in students' browsers. | `3D Visual Scripting.png` |
| Katapult Mauritius | The same visual scripting platform, used for PARC Robotics' programme in Mauritius. | `3D Visual Scripting Katapult Mautitius.png` |
| 3D geospatial visualisation | A 3D GPS visualisation built from photogrammetry. | `3D GPS.png` |
| Ghana Tech Lab 3D office tour | An interactive 3D tour of the Ghana Tech Lab office. | `Ghana Tech Lab.png` |
| Heroes of the Past | A Unity game that tells African history through interactive storytelling. | `Heroes of the Past.png` |
| Gold Coast | An educational Unity game about Ghana's colonial history and the road to independence. | `Gold Coast.png` |
| Sucasa Ghana VR walkthrough | A virtual reality property walkthrough for a real estate developer. | none (text-only row) |
| Talk: AI in Gaming and Real-World Simulations | AI in Tech Stakeholders Summit, Ghana Tech Lab, 2019. | none |
| Degraded Redundancy | An animated board-level cyber-crisis simulation film, made with a zero-budget AI pipeline (Revideo, Kokoro TTS, LTX-Video, DaVinci Resolve). | none |

**Excluded by default (Joseph may override at M0):**
- Dwello, which is unreleased.
- The YouTube link on the old site (`youtu.be/yi41dsn64So`), because its content is not documented here.

---

## 11. Motion

**Principles:**
- There is one orchestrated moment on load: the hero.
- Everything else answers a user action or shows reading progress.
- No fade-and-slide-up on sections, no parallax, no cursor effects.
- **Final states are the default CSS.** Animation is layered on top, so no-JS, reduced motion and failed scripts all show the finished page.
- Under `prefers-reduced-motion: reduce`, every animation and view transition is disabled and final states show immediately.

**Hero parse sequence** (about 1.6s, plays once per browser session):
- A script adds `.is-parsing` to the hero, unless `sessionStorage.heroPlayed` is set or reduced motion is on, and then sets the flag.
- **K1, 0 to 500ms:** record lines reveal one by one, with a 90ms stagger, via a left-to-right `clip-path` inset.
- **K2, 500 to 900ms:**
  - The parsed-field underlines draw left to right, using `transform: scaleX` on a pseudo-element.
  - "BALANCED" transitions from ink-muted to `--color-settled`.
  - The check's stroke draws in with `stroke-dashoffset`.
- **K3, 900 to 1600ms:**
  - Headline words rise 8px and fade in, with a 40ms stagger, using `--i` on each span.
  - The subline, actions and availability line then fade in together.
  - The record block settles to its resting contrast.
- **Replay:** activating the record block button removes and re-adds `.is-parsing`.
- Animate `transform`, `opacity` and `clip-path` only.

**Interactions:**
- **Header:** hides (translateY) when scrolling down past 120px and reappears on scroll up. Uses `--dur-base` and rAF-throttled scroll. It never hides while the mobile sheet is open or while it contains focus.
- **Case tiles:**
  - On hover and focus-visible, the title underline draws left to right (`--dur-base`) and the media frame shifts 4px up.
  - Nothing else moves.
  - The hover effect is scoped to `@media (hover: hover)`.
- **Page transitions:** native cross-document View Transitions.
  - Set `@view-transition { navigation: auto; }`.
  - Give each tile's media and title unique `view-transition-name`s (for example `work-apl-media` and `work-apl-title`) matching the case study header, so they morph over `--dur-slow` with `--ease-standard`.
  - This is progressive enhancement: unsupported browsers navigate normally.
  - Do not add a client-side router.
- **Timeline:**
  - Inside `@supports (animation-timeline: view())`, the rail fills with `--color-brand` as the section scrolls, and each dot fills as it passes the viewport middle.
  - Without support, the rail shows fully filled.
- **Theme toggle:**
  - A 200ms crossfade of colours.
  - The icon rotates between sun and moon.
  - The label switches between "Switch to dark theme" and "Switch to light theme".
  - The choice is stored in `localStorage` and applied by an inline script in `<head>` before first paint, so there is no flash.
- **Copy email:**
  - The label changes to "Copied" with a check for 1.6s, then back.
  - A polite `aria-live` region announces "Email copied".
  - If the Clipboard API is unavailable, select the address text instead.
- **Buttons:** a `--dur-fast` colour change on hover and a 1px translate on press.
- **Focus:** a 2px `--color-brand` outline with a 2px offset on every interactive element, using `:focus-visible`.
- **Reading progress (case studies):** use a scroll-driven animation where supported, with a tiny script fallback.

---

## 12. SEO, metadata and deployment

**Metadata:**
- **Titles:**
  - Home: "Joseph Kofi Asante, Senior .NET Engineer"
  - Case studies: "{Project title}, Joseph Kofi Asante"
- **Home meta description:** "Senior .NET engineer and technical lead in Accra building payment, budgeting, tax and regulatory systems. Open to remote and relocation roles."
- **Case study descriptions:** the one-line outcome.
- **JSON-LD `Person`** on the home page:
  - name, jobTitle "Senior Software Engineer"
  - url
  - `sameAs` LinkedIn and GitHub
  - `address.addressLocality` "Accra", `addressCountry` "GH"
- **Open Graph image (`public/og.png`, 1200 x 630):**
  - Build a hidden `/og` route (noindex, excluded from the sitemap).
  - It shows the name, the headline and a cropped slice of record lines 1 and 9 on `--color-paper`.
  - `scripts/og.ts` screenshots it with Playwright.
- **Favicon:** `favicon.svg`, a "JA" monogram in `--color-brand` on a transparent background, with a PNG fallback.
- **Sitemap and robots:** `@astrojs/sitemap`, plus a `robots.txt` pointing to the sitemap.
- **404:** centred, with the copy "This page doesn't exist." and a "Go to the home page" link.

**GitHub Actions:**
- **`.github/workflows/ci.yml`**, on pull requests: install, `npm run check`, `npm run build`, `npm run test:a11y`, `npm run lhci`.
- **`.github/workflows/deploy.yml`**, on push to `main` and manual dispatch:
  - `withastro/action@v6` then `actions/deploy-pages@v5`
  - with `pages: write` and `id-token: write` permissions and the `github-pages` environment
- `npm run check` runs in strict mode in CI, which fails if `public/cv/Joseph-Kofi-Asante-CV.pdf` is missing. Locally it only warns.

---

## 13. Milestones

### M0: Recon and plan (STOP after this)
- Confirm section 2 against the actual repo and list any differences.
- Confirm the Node version is 22.12 or later.
- Create tag `v1-legacy` and branch `legacy-v1` from the current `main`, and push both. Then create and switch to `redesign`.
- Present:
  - the file tree you will create
  - the dependency list with versions
  - any part of this brief that conflicts with Astro 7's current APIs, and how you will resolve it
- Ask Joseph for overrides on the defaults: Dwello excluded, YouTube link excluded, `nowBuilding` off.

### M1: Scaffold
- Astro with TS strict, `site` and `base`, the base-aware URL helper, fonts, `tokens.css`, `global.css`, the Base layout, Header (including mobile sheet), Footer, ThemeToggle with the no-flash head script, the 404 page and redirect stubs.
- `scripts/check-content.mjs` enforcing section 3. It scans `src/` only, so `docs/` and `CLAUDE.md` never trip it. It checks:
  - em dash, arrow and middle dot in copy
  - blocked terms, whole-word and case-insensitive
  - the CV PDF presence (strict mode only)
  - a report of remaining `TODO(Joseph)` markers
- `CLAUDE.md` (section 15). Commit this brief as `docs/brief.md` if it is not already there.
- Delete the old HTML files on this branch.

### M2: Home, static
- Every home section with real copy and optimised images, correct at 1440, 768 and 390 in both themes.
- Run the screenshot review loop (section 14) and log it.

### M3: Case studies
- The content collection, the five pages from the fact sheets, the five diagram components, CodeBlock, the progress bar and previous/next links.
- Run the screenshot review loop.

### M4: Motion
- Everything in section 11. Capture the hero keyframe screenshots and check each against K1 to K3.
- Verify reduced motion shows final states.

### M5: Quality
- Axe, Lighthouse, a keyboard pass, a link check over `dist/`, the OG image, favicon, JSON-LD, sitemap and robots.
- Fix until every bar in section 14 passes.

### M6: Ship prep (STOP after this)
- Rewrite `README.md`:
  - what the site is
  - `npm` scripts
  - how to add a case study, a certification or a post
  - how to turn on `nowBuilding`
  - where the CV PDF goes
- Add both workflows.
- Open a PR from `redesign` to `main` (use `gh` if available; otherwise print the compare URL).
- Write the handoff report:
  - bar results (Lighthouse scores, axe result, JS size)
  - every `draft: true` page and every `TODO(Joseph)` item
  - anything in the brief you could not do and why
  - the cutover steps in section 12, listed for Joseph

---

## 14. Verification loop and quality bars

**Scripts to create:**
- `npm run screens`: Playwright captures every route (`/`, the five `/work/<slug>/` pages and `/404`).
  - It shoots at widths 1440, 768 and 390, in light and dark, with reduced motion on, as full-page PNGs saved to `.screens/` (gitignored).
  - It also captures hero frames at 0, 300, 700, 1100 and 1700ms with motion enabled, at 1440 light.
- `npm run test:a11y`: axe on every route in both themes.
- `npm run lhci`: Lighthouse CI against `astro preview` for `/` and `/work/apl/` using the mobile preset.
- `npm run check`: `astro check` plus the content guard.

**Review loop (after M2, M3 and M4 at minimum):**
1. Run `npm run screens`.
2. Open and look at the screenshots yourself.
3. Critique them against the checklist below.
4. Fix, re-shoot, and log the pass in `docs/review-log.md`.

Do not report a milestone done without a logged pass.

**Checklist:**
- **Hero:** the hero is the most distinctive thing on the page, and the record block reads as deliberate, not as a code-sample cliché. Nothing else animates on load.
- **Layout:** the selected work layout is visibly uneven (feature, pair, rows), not a card grid.
- **Alignment and measure:** everything is left aligned, and no prose line exceeds about 68ch.
- **Section 5.4:** none of the forbidden patterns appear.
- **Tokens:** colours, type, spacing and radius come only from tokens, and dark mode is navy, not black.
- **Narrow screens:** nothing overflows horizontally at 390px. The record block scrolls inside its own container.
- **Motion:** reduced-motion screenshots show complete final states.
- **Copy:** copy matches this brief word for word where it is given here.

**Hard bars:**
- Lighthouse 95 or more for Performance, Accessibility, Best Practices and SEO on both audited routes.
- Zero serious or critical axe violations, in both themes.
- Client JS under 10 KB gzipped in total.
- No broken internal links in `dist/`. `/CV/index.html` resolves.
- Keyboard: every interactive element is reachable with a visible focus ring. The mobile sheet traps focus and closes on Escape. The skip link works.

---

## 15. `CLAUDE.md` (create with exactly this content)

```markdown
# Portfolio: standing rules

- The full specification is docs/brief.md. Read it before any task in this repo.
- Honesty: never add a technology, skill, client, metric or claim that is not in docs/brief.md. `npm run check` enforces the blocked terms.
- No em dashes in site copy. No arrows in link or button text. No middle-dot separators. Sentence case. No all-caps labels.
- Colours, type, spacing, radius and motion come only from src/styles/tokens.css.
- Client JavaScript stays under 10 KB gzipped, with no UI framework.
- Every visual change is verified with `npm run screens` at 1440, 768 and 390 in both themes, and logged in docs/review-log.md, before it is called done.
- Final states are the default CSS; motion is layered on top and disabled under reduced motion.
- Never push to main, force-push, or delete branches or tags.
```

---

## 16. Cutover (Joseph does this after approving the PR)

1. Put the latest CV PDF at `public/cv/Joseph-Kofi-Asante-CV.pdf` on the `redesign` branch and push.
2. In the repo on GitHub, go to Settings, then Pages, and change "Source" from "Deploy from a branch" to "GitHub Actions". Do this immediately before merging. Otherwise Pages would briefly serve the raw Astro source from `main`.
3. Merge the PR. Watch the deploy workflow finish.
4. Check that `https://falcon262.github.io/CV/`, `/CV/index.html` and a case study page load, and that the CV downloads.
5. If anything is wrong, revert the merge. The old site is preserved on `legacy-v1` and tag `v1-legacy`.
