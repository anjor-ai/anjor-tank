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
