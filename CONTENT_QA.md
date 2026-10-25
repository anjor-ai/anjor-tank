# Content QA before publication

This is an editorial verification checklist, not a claim that the source data is incorrect.

## Metrics and attribution

- [ ] Price Lock: define the *77.2% → 89.7%* numerator, denominator, window and control; distinguish absolute percentage points from relative lift.
- [ ] Referral: define what *6% → 13%* means (acquired customers, orders or visits), time period and methodology.
- [ ] Customer operations: define the *−30% resolution time* calculation and period.
- [ ] Coupon retention, substitution fulfilment and search-to-order: verify their populations, observation windows and causal inference.
- [ ] Avoid suggesting that organic SEO clicks resulted from the in-product search intervention unless a source proves this.

## Role clarity

- [ ] Verify personal scope for each initiative: roadmap/decision ownership vs. engineering delivery, design and operational approvals.
- [ ] MESHHETU: founder role should be shown separately from full-time employment; product ROQIVA remains in development.
- [ ] GNC India: do not invent outcomes from the current role.

## Regulated-product language

The SKU-substitution story involves a pharmacy product. Existing project notes document operational SKU mapping, state changes and price handling, but do not fully explain product eligibility controls, patient consent, pharmacist approval or notification. Do **not** imply that medicine was substituted invisibly or outside required safeguards. Verify the regulatory, clinical and communication workflow with the project owner before publishing details or claiming end-user outcomes.

## UX and release checklist

- [ ] Inspect every route on desktop and touch devices.
- [ ] Verify mobile menu, skip link, focus order, reduced motion and contact form delivery.
- [ ] Verify all old routes redirect and sitemap canonical URLs match the configured domain.
- [ ] Run build, automated smoke tests and a Lighthouse / Core Web Vitals check before merging into production.
- [ ] Compare the supplied video references against desktop motion; preserve readability and performance over elaborate 3D.

## Resume and LinkedIn source pass · 2026-10-25
- Timeline uses role details sourced from the uploaded résumé and LinkedIn PDF: 9LedgePro, Eggfirst, Neil Patel Digital, Truemeds, GNC India and the separate MESHHETU founder role.
- GNC India is current Product Manager (October 2026 onward); no GNC outcomes were fabricated.
- Truemeds proof metrics still need validation against internal measurement definitions.
- Public phone number is intentionally not added to the UI; email and LinkedIn are already available.

## Creative direction / Interaction QA
- [ ] Check desktop keyboard navigation at 1440, 1280, 1024 and 901 px: hover, focus, Enter and leave reset.
- [ ] Check touch-target spacing and reduced-motion behaviour on phones.
- [ ] Scrub and pointer effects are progressive enhancement, not a content prerequisite.
- [ ] Check case illustrations and typography in both colour themes.
- [ ] Run npm run test to check generated pages, internal links, and the keyboard / Hire / timeline sections.
- [ ] Run npm run build before merging to production.

## MESHHETU Track A parity
Source: anjor-ai/orchestration-intelligence, src/content/system.js and src/content/pages.js (2026-10-25).
- Agreed consulting deliverables: decision audit, research brief, strategy / PRDs and governed delivery.
- Track A is available, while ROQIVA is in development; do not imply the platform is shipped.
- Client implementation, QA and release responsibilities stay with the client unless separately agreed.
- No guaranteed ROI, fictional price or engagement timeline is promised.
