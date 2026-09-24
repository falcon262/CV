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
