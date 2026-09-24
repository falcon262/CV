# Screenshot review log

Every visual review of the rebuild: what was checked, what was wrong, and what changed.
Screenshots come from `npm run screens` (routes at 1440, 768 and 390, light and dark,
reduced motion on, plus hero keyframes at 1440 light with motion). They are saved to
`.screens/`, which is not committed.

Checklist (docs/brief.md, section 14): hero distinctiveness, uneven work layout,
left alignment and measure, forbidden patterns (section 5.4), tokens only and navy dark
mode, no horizontal overflow at 390, complete final states under reduced motion, and copy
matching the brief word for word.

## M2: home page, static (2026-09-24)

**Shot:** `/` at 1440, 768 and 390 in light and dark, reduced motion on. Also checked
programmatically that nothing overflows horizontally at 390, 768 or 1440
(document width equals the viewport minus the scrollbar gutter; the record block's own
scroll container is the only element allowed to overflow, inside itself).

### Pass 1: what was wrong

1. **Hero, 1440.** The record block rendered at about 9px and floated at mid-height beside
   the headline, reading as a small widget rather than a deliberate element.
2. **Selected work.** The feature tile title used the h2 size, so "APL Commissions Platform"
   competed with the section heading "Selected work".
3. **Spacing.** Too much empty space between the hero and "Selected work" at 1440.
4. **Rules.** Section separators ran the full viewport width while every inner rule is
   container width.
5. **About.** The portrait's off-white studio background dissolved into the paper colour,
   so the circle lost its edge in light mode.
6. **Before enterprise software.** Rows were taller than a "compact list" should be.
7. **Contact, 390.** The address broke mid-word ("gmail.co / m").
8. **Lists.** The lab and credentials lists ended with a rule that sat right above the next
   section's separator, giving a double line.

### Changes

1. Record block top-aligned with the headline and allowed to extend into the right page
   margin (still keeping at least 32px), which lifts it from about 8px to 9px at 1440 and
   to 11px at 1680 and 13px at 1920. Added hairline ledger rules between the four records.
   It now reads as a ledger slip, not a code sample. At 768 it spans the full width above
   the headline at about 11.5px; at 390 it shows records 1 and 9, scrolls inside its own
   container and fades at the right edge.
   *Known constraint:* 94 fixed-width characters in 5 of 12 columns of a 1200px grid cannot
   be larger than about 9px at 1440 without cropping "BALANCED", so the block is fine print
   at that width by design; the headline carries the meaning.
2. All tile titles use the h3 size; the feature tile stands out through its full-width layout,
   larger outcome text and larger diagram.
3. The first section after the hero uses a smaller top padding.
4. Section separators moved onto the container, so every rule on the page shares one width.
5. Hairline ring (`--color-rule`) around the portrait.
6. Lab thumbnails 128 by 80 (96 by 60 on mobile) and tighter row padding.
7. The address breaks after the "@" (`<wbr>`), keeping `--step-h2`.
8. Removed the list-end rules; the section separator does that job.

### Pass 2: checklist

- Hero: headline dominant, record block reads as deliberate, nothing animates yet (motion is M4).
- Layout: selected work is visibly uneven: a full-width feature tile, a two-up pair, then
  two text-led rows with small thumbnails.
- Alignment and measure: everything left aligned; prose capped with `--measure` (68ch),
  the About text with 64ch, the hero subline with 60ch.
- Section 5.4: no eyebrows, numbered markers, arrows in link text, middle dots, shadows,
  identical card grids, skill bars, logo walls or stock imagery.
- Tokens: `npm run check` finds no hex colour outside tokens.css; dark mode is navy.
- 390: no horizontal overflow; the record block scrolls inside its own container.
- Reduced motion: every screenshot shows complete final states.
- Copy: hero, experience, about, principles, tools, lab entries, credentials and contact
  match the brief word for word.

Tooling note: Astro 7 runs `astro preview` in the background when it detects an AI agent.
The scripts now pass `--ignore-lock`, which keeps the server in the foreground so it stops
with the script; the behaviour is the same for people and CI.

## M3: case studies (2026-09-24)

**Shot:** the five `/work/<slug>/` pages and the 404 at 1440, 768 and 390 in light and dark,
reduced motion on. Checked every case page for horizontal overflow at 390, 768 and 1440
(none; the code block scrolls inside its own frame). Rendered prose word counts, excluding
code and the decision labels: APL 407, ECOBUD 377, AI reporting engine 367 (target 350 to 600);
E-VAT 211, IFRS engines 214 (target 200 to 350).

### Pass 1: what was wrong

1. **Code block, 1440.** The block grew to fit its longest line (about 850px), breaking out
   of the 68ch measure, because its grid track sized to the content.
2. **Key decisions.** Three boxed panels stacked in a row looked heavier than the
   editorial page around them, close to the identical-card pattern the brief rules out.
3. **Serif prose, 390.** `text-wrap: pretty` produced runs of very short trailing lines
   ("on middleware that makes / that connection.").
4. **Apostrophes.** MDX body copy renders typographic apostrophes, while component copy used
   straight ones, so the two page types disagreed.
5. **Syntax colours.** Shiki's css-variables theme put some identifiers in the settled
   green and others in ink, which read as random.
6. **Copy.** A few sentences went beyond the fact sheets ("hard to keep honest", "the finance
   team", "two habits from this project", "I built the middleware"). Rewritten to stay
   inside the fact sheets; E-VAT now says "The middleware is built on" rather than claiming
   the design.

### Changes

1. The code block's grid is `minmax(0, 1fr)`, so it keeps the prose width and scrolls
   inside itself. The snippet was tightened to 65 characters a line so it fits at desktop
   without scrolling; it still scrolls at 390.
2. Decisions are a ruled list: a 2px brand rule on the left of each decision and hairlines
   between them, with no panels.
3. Removed `text-wrap: pretty`; headings keep `text-wrap: balance`.
4. Component copy now uses typographic apostrophes too (same words, consistent typography).
5. Constants map to ink; only keywords (brand), strings (settled) and comments (muted)
   carry colour.
6. Copy edits as listed above.

### Pass 2: checklist

- Layout: header with h1, outcome and a Client, My role, Team and When (only where known),
  Stack `<dl>`; the architecture diagram at full content width in a `<figure>` with a
  caption; serif body at 68ch; previous and next with titles, in the brief's order.
- Diagrams: wide layouts at 1024 and up, medium at 768, narrow vertical layouts at 390,
  all left aligned at natural size and never scaled up; token colours switch with the theme.
- Key decisions come only from the fact sheets; the IFRS page has none. ECOBUD's first
  decision and both AI decisions have no alternative in the fact sheets, so that part is
  left out rather than invented.
- The APL code block is captioned "Illustrative, simplified from the production library".
- Section 5.4: nothing forbidden; "Previous" and "Next" carry no arrows.
- Tokens only; dark mode navy; no overflow at 390; reduced-motion shots show final states.
- The 404 is the only centred page.
