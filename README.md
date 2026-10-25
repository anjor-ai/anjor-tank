# Anjor Tank — Decision Studio portfolio

A focused product-management portfolio with **Home, Work, Experience, Hire Me, About and Contact** plus seven existing detailed project URLs.

## Content structure

- `src/content.js`: source of truth for case study evidence, roles, labels and contact links. Avoid copying metrics into other content files.
- `src/studio.js`: Home, Work, About, Contact and the decision-at-a-glance diagram for case pages.
- `src/render.js`: document shell, case-study details, metadata and the public route registry.
- `src/art.js`: accessible, responsive inline SVG illustrations used throughout the case studies.
- `src/studio.css`: editorial layout and responsive cards; `src/styles.css` retains the shared design system.
- `src/studio-motion.js`: restrained GSAP reveals and accessible contact form; reduced-motion preferences are honoured.

Legacy URLs redirect: `/journey`, `/architect`, `/beyond` to `/about`; `/hire` to `/contact`; `/meshhetu` and `/consulting` to `meshhetu.com`. The Vercel rules are in `vercel.json`.

## Development

```bash
npm ci
npm run dev
npm run build
```

Preview branches can be deployed by the connected Vercel Git integration. Production is not modified by the redesign branch until merged.

## Editorial guardrails

- Home shows exactly three distinct pieces of proof; case-specific detail belongs on the case page.
- Do not present parallel job titles as equal identities: product manager first; MESHHETU is separately a founder venture.
- Keep the 3 featured projects distinct from the 4 shorter archive entries.
- Do not publish invented baselines, experiments, technical ownership or safety/consent claims. See `CONTENT_QA.md`.
- Keep animations lightweight and optional; all content remains readable in reduced-motion mode.

## AI-native interaction refresh

- `src/studio-upgrades.js`: interactive 6-key page navigator, detailed career timeline, Hire Me page and MESHHETU Track A consulting feature.
- `src/studio-upgrades.css`: tactile keyboard in pure CSS, dark cobalt palette, timelines, responsive service cards.
- `src/studio-upgrades-motion.js`: pointer-aware keyboard previews, GSAP depth and scroll sequencing with a reduced-motion fallback.
- Content from LinkedIn and resume is role-scoped. Track A consulting deliverables mirror the `orchestration-intelligence` system source; ROQIVA remains in development.
- Release process: prepare Git blobs without changing a branch; update the `preview` branch once after checks to avoid many Vercel preview deployments. `main` is unaffected.
