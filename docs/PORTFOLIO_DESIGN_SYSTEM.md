# Portfolio design system — October 2026

## Goal
This site is a product manager's portfolio, not a SaaS landing page. It should tell a continuous story: Anjor's point of view → grounded case-study proof → product decision-making → professional journey → consulting → ROQIVA (founder-led, in development) → personality → contact. Consulting is the primary conversion path; product-role conversations are secondary.

## Visual references translated into design rules
- **Meshhetu / orchestration-intelligence**: Space Grotesk headings, IBM Plex Sans body, IBM Plex Mono technical labels, neutral canvas, blue accent, product windows, graphs, animation conventions. Shared variables in `src/styles/tokens.css`; the final overrides are in `src/styles/studio.css`.
- **Lendro / Hypfury-style split hero**: compact left editorial copy, substantial product illustration right, with an actionable path below.
- **Monopol / dashboard bento**: evidence in different card sizes and weights; do not duplicate one oversized card rhythm.
- **Micro UI illustrations**: product states, decision paths, and samples inside responsive windows; annotate sample data.
- **Alternating cards and portfolio masonry**: use asymmetry in the journey cards and photo grid; do not arbitrarily center every header.

## Layout and density
- Base section padding: `--section-y: clamp(38px,4.9vw,70px)` on desktop, `clamp(31px,8.5vw,48px)` on mobile. Do not return to 120px section gutters without a specific visual reason.
- Home hero: left content, right interactive case workspace; short factual proof strip below.
- Selected Work: **centered header** because the rotating card interaction is centered. Preserve the ring and quick-view modal.
- Method: left explanation, right selectable illustrated decision diagram with actual case-study outcomes.
- Journey: offset 2×2 cards using distinct treatment, not a long unbroken text column.
- Consulting: rich, tangible workflow window, strong consulting CTA, soft job CTA.
- ROQIVA: Anjor's founder-led product in development; no Meshhetu outbound hyperlink or references to relatives.

## Engineering and integrity
- New interactive components live in `src/components/Studio.jsx`; styles in `src/styles/studio.css` (last in CSS import order).
- Keep sample UI distinctly illustrative. Do not invent revenue values, customer counts, actual usage charts, or promises about ROQIVA's status.
- Buttons and tabs must change real state; visible UI works without hover. Respect `prefers-reduced-motion`.
- Reuse case data and illustrations from `src/components/mocks.jsx` and source case pages.
- Preserve existing route navigation, semantic HTML and SSR.
- Build with `npm run verify` when local CI is available. No hidden links to private repositories or external ROQIVA/Meshhetu sites.
