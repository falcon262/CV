# Portfolio: standing rules

- The full specification is docs/brief.md. Read it before any task in this repo.
- Honesty: never add a technology, skill, client, metric or claim that is not in docs/brief.md. `npm run check` enforces the blocked terms.
- No em dashes in site copy. No arrows in link or button text. No middle-dot separators. Sentence case. No all-caps labels.
- Colours, type, spacing, radius and motion come only from src/styles/tokens.css.
- Client JavaScript stays under 10 KB gzipped, with no UI framework.
- Every visual change is verified with `npm run screens` at 1440, 768 and 390 in both themes, and logged in docs/review-log.md, before it is called done.
- Final states are the default CSS; motion is layered on top and disabled under reduced motion.
- Never push to master, force-push, or delete branches or tags.
