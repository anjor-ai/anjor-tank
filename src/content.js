/* ==========================================================================
   CONTENT — every fact on the site lives here; render.js turns it into pages.
   Sources: Product-Portfolio (case studies, résumé, cover letter), Portfolio-website
   (proof points, photos), orchestration-intelligence (MESHHETU).
   Figures follow the live portfolio: checkout 77.2% → 89.7%, RTO −1.9pp, cancellations −3.3pp.
   ========================================================================== */

export const SITE = {
  name: 'Anjor Tank',
  origin: 'https://anjor-portfolio.vercel.app',
  email: 'anjort2000@gmail.com',
  linkedin: 'https://www.linkedin.com/in/anjor-tank',
  calendly: 'https://calendly.com/anjort2000',
  meshhetu: 'https://meshhetu.com',
  form: { url: 'https://api.web3forms.com/submit', key: 'e8ed6edd-5136-41b2-87cc-c57df384c2b0' },
  lat: '19.08°N', lon: '72.88°E',
};

/* Greetings that flicker in the intro and the hero. English first, then Hindi. No language labels. */
export const HELLOS = ['HELLO', 'नमस्ते', 'HOLA', 'BONJOUR', 'નમસ્તે', 'CIAO', 'OLÁ', 'नमस्कार', 'こんにちは'];

export const NAV = [
  ['/work', 'Work'], ['/systems', 'Systems'], ['/journey', 'Journey'], ['/meshhetu', 'MESHHETU'], ['/consulting', 'Consulting'], ['/beyond', 'Beyond work'],
];

/* ───────────── proof strip ───────────── */
export const PROOF = [
  { pre: '77.2 → ', to: 89.7, dp: 1, suf: '%', from: 77.2, label: 'Prepaid order-to-delivery conversion', tag: 'Payments' },
  { pre: '~', to: 1100, dp: 0, suf: '/day', from: 0, label: 'Repeat orders from the reminder platform', tag: 'Growth' },
  { text: '468K → 1.6M', label: 'Organic clicks in six months', tag: 'Search' },
  { pre: '−', to: 20, dp: 0, suf: '%', from: 0, label: 'Cost per order from voice automation and prioritisation', tag: 'Operations' },
];

/* ───────────── how I think (ASCII cards) ───────────── */
export const BELIEFS = [
  { art: 'galaxy', t: 'Look below the UI layer.', d: 'When scale breaks a product it rarely breaks at the visual layer. It breaks in the systems and workflows underneath.', chips: ['Backend first', 'Ops workflows', 'Root cause'] },
  { art: 'lens', t: 'Build for compounding returns.', d: 'Growth loops only work when the infrastructure behind them closes. I study the end-to-end result, not the release.', chips: ['Close the loop', 'Measure end to end', 'Play long'] },
  { art: 'terrain', t: 'Internal tools are products.', d: 'CRMs, portals and supply workflows get the same rigour as a consumer app. Operations teams are users too.', chips: ['Ops are users', 'SLA by design', 'Leverage'] },
];

/* ───────────── the arc (pinned story on Home) ───────────── */
export const ARC = [
  { k: 'I', when: '2021 – 2023', t: 'Learn how demand is made.', d: 'Campaigns, dealer networks and client accounts. I learned what a customer actually does between an ad and an order.' },
  { k: 'II', when: '2023 – 2026', t: 'Ship the systems underneath.', d: 'Moved into product. Checkout, coupons, search, fulfilment and internal tools, owned from problem to release with two pods of engineers.' },
  { k: 'III', when: '2026 – now', t: 'Architect it, and found it.', d: 'Own the product end to end across web and app, and founded MESHHETU to do the same for other commerce teams.' },
];

/* ───────────── architect ───────────── */
export const LAYERS = [
  { id: 'exp', n: '04', t: 'Experience', s: 'Web and app', d: 'Landing pages, checkout, search, coupon and cashback surfaces. Wireframed, specified and released by me.' },
  { id: 'logic', n: '03', t: 'Logic', s: 'Rules and pricing', d: 'Price lock, coupon stacking, substitution and routing rules, written as states and exceptions engineers can build.' },
  { id: 'data', n: '02', t: 'Data', s: 'Events and catalogue', d: 'Tracking plans, GA4 and attribution, a 70,000-SKU catalogue indexed by composition, a clean event trail.' },
  { id: 'ops', n: '01', t: 'Operations', s: 'Portals and CRM', d: 'Warehouse portals, CRM routing, returns and refunds. Internal tools designed like consumer ones.' },
];

export const OWN = [
  { t: 'Web', d: 'Landing pages on a Strapi headless CMS, checkout, SEO and analytics stack. Growth ships pages without an engineering ticket.', tags: ['Headless CMS', 'SEO', 'GA4', 'A/B tests'] },
  { t: 'App', d: 'Checkout, search, coupons and cashback on iOS and Android, plus a web-to-app banner that drove 127K+ installs.', tags: ['Checkout', 'Search', 'Cashback', 'Firebase'] },
  { t: 'Platform', d: 'The engines behind them: price lock, 45+ rule stacking, SKU substitution, order routing, cashback ledger.', tags: ['APIs', 'Schemas', 'Rule engines', 'Payments'] },
  { t: 'Internal tools', d: 'Order-processing portals, CRM routing with SLAs, returns and refunds in one workflow, Metabase alerts.', tags: ['Portals', 'CRM', 'SLAs', 'Metabase'] },
];

export const RELEASE = [
  ['Wireframed', 'checkout · payment states and retries'],
  ['Specified', 'payload, schema and edge cases with the eng lead'],
  ['Sequenced', 'two pods · sprint plan · on-call rota'],
  ['Tested', 'floor test with ops · parity check against standard checkout'],
  ['Shipped', 'phased A/B over one month'],
  ['Measured', 'prepaid delivery, RTO, cancellations, tickets'],
];

export const TOOLS = ['Strapi', 'Postman', 'Firebase', 'Jira', 'Confluence', 'Mixpanel', 'GA4', 'Looker Studio', 'Meta CAPI', 'Microsoft Clarity', 'Metabase', 'SQL', 'Figma wireframes', 'Claude API', 'MCP'];

/* ───────────── cases ───────────── */
export const CASES = [
  {
    slug: 'price-lock-checkout', n: '01', tag: 'Payments', wf: 'checkout', cat: 'Payments · 0-to-1', year: '2024',
    title: 'Price Lock and the checkout rebuild',
    line: 'Moved payment to the moment of order, and locked the price so the customer never pays more than they agreed to.',
    metrics: [['77.2 → 89.7%', 'Prepaid order-to-delivery'], ['−3.3pp', 'Cancellations'], ['−1.9pp', 'RTO']],
    hook: 'Customers placed an order, chose online payment, and then waited hours for a payment link that might never come, or were cancelled without warning.',
    quick: {
      problem: 'There was no standard checkout. Payment was collected only after the box was packed, three to four hours later. Miss the window and the order sat for a day. If the courier could not take cash on delivery, it auto-cancelled. Warehouse price changes made collecting at checkout unreliable.',
      call: 'Lock the price at order placement. Any increase at the warehouse is absorbed as a discount on the bill. Any decrease is refunded. The payable amount never changes.',
      result: 'Prepaid order-to-delivery rose from 77.2% to 89.7%, RTO fell 1.9pp and cancellations 3.3pp, and it became the base of the company’s first standard payments stack.',
    },
    table: [['Prepaid order-to-delivery', '77.2%', '89.7%', '+12.5pp'], ['RTO rate', 'Baseline', '—', '−1.9pp'], ['Order cancellations', 'Baseline', '—', '−3.3pp'], ['Daily orders delivered', '—', '~26,000', '—']],
    body: [
      { id: 'context', h: 'Context', p: [
        'The company had no standard e-commerce checkout. Payment was not collected when the order was placed. The system held the order until the box was packed at the warehouse, roughly three to four hours later, and only then sent a payment link.',
        'If the customer missed that window, the order was held for a full day before shipping. If the courier partner could not handle cash on delivery, the order was cancelled automatically. The team knew about it. I was the first to take ownership of solving it, with designers, engineers and a data analyst involved from day one.'] },
      { id: 'problem', h: 'The problem', p: ['The root cause had three layers: a broken payment flow, auto-cancellations from courier constraints, and price mismatches at the warehouse that made collecting at checkout technically unreliable. The mismatches alone had five distinct causes.'],
        table: { head: ['Cause', 'What happened'], rows: [
          ['JIT procurement', 'Out-of-stock items procured just in time at a different price than shown at placement'],
          ['Batch change', 'A medicine batch changed between order and fulfilment, changing the applied price'],
          ['Pricing error', 'Incorrect prices in the system, corrected only when the box was packed'],
          ['Pack-size substitution', 'A pack of 10 replaced with 2 × 5: same quantity, different unit pricing'],
          ['SKU substitution', 'One variant swapped for its nearest equivalent, with a different SKU and price']] } },
      { id: 'hard', h: 'What made it hard', p: [
        'Everyone agreed on the direction. The hard part was building the operational systems to make it work without creating a cost problem for the business.',
        'Every one of the five causes needed its own fix: a portal-level change that tracked each substitution or correction and kept the customer-facing price from moving. The core challenge was to enumerate every scenario that could change a price at the warehouse, and build a mitigation for each.',
        'One of the core changes was a suggestion engine inside the order-processing portals that surfaced the next-best item with the smallest price delta, reducing the cost absorbed on substitutions.'] },
      { id: 'decision', h: 'The decision', call: 'Lock the price at order placement.',
        bullets: ['Any price increase at the warehouse is absorbed as a discount on the bill.', 'Any price decrease is refunded to the customer.', 'The payable amount never changes from what they agreed at checkout.'],
        skipped: 'Fix every upstream pricing and inventory system first. That would have taken months and delayed a fix customers needed immediately.',
        validation: 'Two tracks: floor testing with warehouse ops for the portal changes, and a parity benchmark against standard e-commerce checkout for the consumer redesign.' },
      { id: 'built', h: 'What was built', items: [
        { t: 'Price Lock', d: 'Freezes the price at placement. Every warehouse-side change (JIT procurement, batch change, pack substitution, SKU swap) is tracked through updated order-processing portals, with a discount added for increases and a refund for decreases.', wf: 'lock' },
        { t: 'Checkout redesign', d: 'Moved payment collection to order placement, matching standard e-commerce, and redesigned the payment UI and UX end to end: clear payment options, failures that do not cancel the order, no three-to-four-hour window, retries and partial failures handled.', wf: 'checkout' }] },
      { id: 'outcome', h: 'Outcomes', p: ['Validated through a phased A/B rollout released in milestones over one month.'],
        bullets: ['Prepaid delivery rose from 77.2% to 89.7% across app and web.', 'RTO fell by 1.9pp: fewer orders returning because of missed payments and courier-ineligible COD.', 'Cancellations fell by 3.3pp: auto-cancellations from missed payment windows were eliminated.', 'Support tickets such as “When will my payment activate?” and “Where is my order?” dropped significantly.', 'It unlocked the foundation: the first standard e-commerce payments stack, enabling the full engineering revamp of payments infrastructure.'] },
      { id: 'diff', h: 'What I’d do differently', p: ['I went straight to building the ideal checkout without first evaluating the payments stack at a technical level. A better approach would have been to audit it first:'],
        bullets: ['Payment partners and orchestrators available', 'Discount structures to encourage online payment', 'Existing UX issues worth fixing independently of the redesign'],
        after: 'That audit would have made the build more targeted, potentially faster, and set up the payments engineering revamp more cleanly.' },
    ],
  },
  {
    slug: 'coupons-cashback', n: '02', tag: 'Growth', wf: 'coupon', cat: 'Retention and growth · 0-to-1', year: '2024',
    title: 'The coupon platform and native cashback',
    line: 'Rebuilt the promotions engine from scratch, so growth could target cohorts, stack offers and reward repeat orders without an engineer.',
    metrics: [['+5.0pp', 'Coupon applicability'], ['+1.9pp', 'User retention'], ['+2.6%', 'Order conversion']],
    hook: 'The growth team was fighting a retention battle without ammunition. Simple promo setups pulled engineers in, and customers flew blind on potential savings.',
    quick: {
      problem: 'The legacy coupon portal was rigid: no app- or web-specific coupons, no cohort targeting, no cashback. Engineers hard-coded campaigns on the backend, and top coupons expired unnoticed for three to four days. Customers could not see which coupon applied to what, or what they would save.',
      call: 'Rebuild the coupon platform entirely from scratch instead of patching a broken backend, so the core infrastructure is built cleanly once and supports every future use case.',
      result: 'Coupon applicability rose 5.0pp, retention 1.9pp and order conversion 2.6%, support tickets dropped within a week, and marketing stopped depending on engineering.',
    },
    table: [['Coupon applicability', 'Baseline', '—', '+5.0pp'], ['User retention rate', 'Baseline', '—', '+1.9pp'], ['Order conversion', 'Baseline', '—', '+2.6%'], ['Customer support tickets', 'Baseline', '—', '↓']],
    body: [
      { id: 'context', h: 'Context', p: [
        'The legacy coupon portal was rudimentary and rigid. It could not create app- or web-specific coupons to move customer cohorts, and it had no provision for cashback. Marketing was severely limited in what it could configure, and the system could not scale for high-velocity growth.',
        'The user-facing UI on app and web had not evolved either. Customers could not see which coupon applied to which products, or how much they would save. I took direct ownership, partnering with marketing to define the promotion constructs and with the design pod to overhaul both the admin portals and the consumer funnels.'] },
      { id: 'problem', h: 'The problem', p: [
        'The platform could not isolate customer cohorts, so growth could not run targeted experiments. Every customer-specific campaign pulled engineers off core tracks to hard-code configuration in the database. With no internal alerts, top-performing coupons quietly expired on busy days, costing three to four days of orders before anyone extended them.',
        'On the consumer side, applicability was choked for four reasons:'],
        table: { head: ['Cause', 'What happened'], rows: [
          ['No transparency', 'Customers never knew which coupons applied to which line items'],
          ['No savings estimate', 'The interface did not show the discount value before checkout'],
          ['Choked platform logic', 'The rule validator could not process custom product-type rules or cashback'],
          ['No gamification', 'No prompt showed how close a customer was to unlocking a better tier']] } },
      { id: 'hard', h: 'What made it hard', p: [
        'Everyone agreed the revamp was needed. Executing it meant separating legacy workflows from a scalable architecture without adding calculation drag. The rule validator had to handle 45+ stacking and exclusion combinations without spiking checkout latency or blocking real-time cart updates.',
        'Rules had to apply on specific product attributes: generic versus branded, OTC versus non-OTC, prescription versus wellness, and SKU-specific whitelists that marketing could bulk-upload. To protect unit economics, marketing watched promotional burn rates day by day, which kept engineering and growth aligned on margin.'] },
      { id: 'decision', h: 'The decision', call: 'Rebuild the coupon platform from scratch.',
        bullets: ['Build the core infrastructure cleanly once, to support all future scale and use cases.', 'Schedule micro-optimisations for later instead of patching the legacy backend.', 'When timelines stretched, work backward from the business goal and cut the build into milestones.'],
        skipped: 'Be limited by legacy constraints, or trim the feature set to hit an early delivery date.',
        validation: 'A phased A/B rollout across test and control cohorts.' },
      { id: 'built', h: 'What was built', items: [
        { t: '45+ combination rule-stacking engine', d: 'Multi-tier coupons across web and mobile, with a clone function for marketing velocity, SKU whitelists, Rx / OTC / generic / branded restrictions, and automatic alerts before campaigns expire.', wf: 'coupon' },
        { t: 'Multi-touchpoint cashback', d: 'A cashback credit ledger shown on the cart, order summary and order status screens. It re-computes if a partial cancellation drops an order below minimum value, pays out only after delivery and the return window, expires in 60 days (matching a 45–50 day repurchase cycle) and caps use at ₹100 or 10% of the order.', wf: 'ledger' },
        { t: 'Visibility and progress bars', d: 'Exact savings shown upfront, and a quick-commerce style unlock bar: “Add items worth XX to unlock this coupon and save YY”.', wf: 'progress' },
        { t: 'High-margin substitution anchors', d: 'Targeted coupons paired with coachmarks that nudge customers toward generic alternatives over costly branded ones.', wf: 'swap' }] },
      { id: 'outcome', h: 'Outcomes', p: ['Validated through a phased A/B rollout across test and control cohorts.'],
        bullets: ['Coupon applicability rose 5.0pp: customers could understand and use rewards.', 'Retention improved 1.9pp, driven by the 60-day native cashback loop.', 'Order conversion grew 2.6% from upfront savings and progress bars.', 'Support tickets dropped sharply in the first week, with fewer questions about unapplied coupons and cashback timing.', 'Marketing velocity surged with clone tools and automated controls, removing engineering from the loop.'] },
      { id: 'diff', h: 'What I’d do differently', p: ['No one on the product or business side had run an in-house coupon platform of this scale, so we planned the whole system for perfection and built milestones linearly inside one pod. Two changes:'],
        bullets: ['Parallel engineering: ship app releases, admin tools and ledger updates concurrently across separate engineers, not one after another.', 'Feedback-backward iteration: ship the low-hanging fruit first, learn from internal users, and build iteratively instead of waiting for full scope.'],
        after: 'Dedicating all engineering bandwidth to the build also created a backlog of requests from other teams, so later micro-optimisations of the platform were deprioritised.' },
    ],
  },
  {
    slug: 'sku-substitution-engine', n: '03', tag: 'Operations', wf: 'swap', cat: 'Logistics automation · Platform', year: '2024',
    title: 'The algorithmic SKU substitution engine',
    line: 'Replaced a spreadsheet and a delete-and-add workaround with a live-inventory engine that swaps one item for another without the customer noticing.',
    metrics: [['+3.0%', 'Delivery fulfilment'], ['−2.6pp', 'Cancellations'], ['70,000+', 'SKUs re-indexed']],
    hook: 'Warehouse leads were running high-volume fulfilment from a static Excel sheet. A stockout meant deleting and re-adding medicines, which spiked prices and left customers so blindsided they cancelled.',
    quick: {
      problem: 'A stockout threatened retention. Operators cross-referenced a spreadsheet that ignored live inventory, then deleted the item and added another as a new line. The pricing system saw a fresh purchase, so the bill rose. Orders also reached the lead only after picker and checker, missing courier cut-offs by up to a day.',
      call: 'Intercept the order at the warehouse portal with a live-inventory suggestion engine, and shield the customer: no front-end toggles, no price shocks. The company absorbs the delta.',
      result: 'Fulfilment rate rose 3.0% and cancellations fell 2.6pp after two months of careful scaling, with fewer support tickets and cleaner data for procurement.',
    },
    table: [['Delivery fulfilment rate', 'Baseline', '—', '+3.0%'], ['User order cancellations', 'Baseline', '—', '−2.6pp'], ['Operational turnaround', 'High lag', 'Optimised', 'Adherence ↑'], ['Customer support tickets', 'Baseline', '—', '↓']],
    body: [
      { id: 'context', h: 'Context', p: [
        'Stockouts are standard in e-commerce, but at this company an out-of-stock event at the fulfilment centre threatened core retention. To meet delivery timelines, operations relied on pack-size substitutions (a missing pack of 10 swapped for two packs of 5) or variant swaps (one flavour for another).',
        'There was no software to compute or suggest the next-best equivalent. Floor leads cross-referenced an Excel spreadsheet. Worse, legacy limits in the portals meant they could not do a true one-to-one replacement. They had to delete the original medicine and add a new one as a separate line. I stepped in to architect an automated, system-defined logic layer.'] },
      { id: 'problem', h: 'The problem', p: ['Fulfilment broke down at three architectural bottlenecks:'],
        table: { head: ['Bottleneck', 'What happened'], rows: [
          ['Decoupled ledger', 'Delete-and-add looked like a new purchase, so the system could not see our own stockout caused it and failed to absorb the cost delta. The customer’s bill rose.'],
          ['Blind inventory', 'The spreadsheet ignored live stock. Leads assigned substitutes that the pickers then found out of stock too.'],
          ['Lag and missed trucks', 'No upfront visibility. Picker, then checker, then lead with a spreadsheet pushed orders past courier cut-offs, sometimes by 24 hours, spiking TAT and RTO.']] },
        after: 'If an order held a single SKU and it stocked out, there was no automated alternative: the platform triggered an immediate hard cancellation.' },
      { id: 'hard', h: 'What made it hard', p: [
        'The challenge was bringing fragmented systems together while repairing a compromised database. Before automating anything in the Catalogue Management System, we found a master catalogue full of errors and mistagged items. We paused to run a data-cleaning initiative, re-indexing more than 70,000 SKUs by exact salt composition, brand, variant and dosage form.',
        'On the finance side, the price locked at order placement had to remain the most a customer would pay. If our own inefficiency forced a substitution, the company absorbed the delta as a discount or an automatic refund. The logic had to separate a customer-initiated change (update the bill) from a company-driven substitution (absorb the delta), update invoices in real time and avoid latency in the checkout API. That demanded precise state-machine routing.'] },
      { id: 'decision', h: 'The decision', call: 'Intercept the order lifecycle at the warehouse portal with a live-inventory suggestion engine.',
        bullets: ['Shield the customer from stockout friction instead of pushing the choice to the front end.', 'Absorb the price variance internally to preserve trust and protect conversion.', 'Keep the footprint inside internal logistics tools and catalogue engines.'],
        skipped: 'Consumer-facing configuration paths or dynamic cart validation in the first rollout. Stakeholders argued warning users would protect margin, but it would have forced manual toggles and drop-offs.',
        validation: 'A live rollout, scaled warehouse by warehouse after an early misstep (see the reflections below).' },
      { id: 'built', h: 'What was built', items: [
        { t: 'CMS variant mapping and suggestion engine', d: 'An automated tagging interface in the catalogue system reads a parameters table (salt, product line, dosage form, mother brand) and suggests verified substitute SKUs when a manager edits a medicine. Accepted suggestions lock a one-to-one link. Custom mappings write back to train future suggestions.', wf: 'swap' },
        { t: 'Live-inventory order-routing tables', d: 'Before an order reaches a picker, a live-inventory script checks it. A flagged shortage routes to a warehouse-lead portal, with the highest-matching available substitute pre-filled.', wf: 'ops' },
        { t: 'One-to-one replacement', d: 'The legacy delete-and-add was retired for a native “Replace SKU” command that binds the incoming variant to the original, with a mandatory reason code for a clean audit trail for finance and procurement.', wf: 'lock' },
        { t: 'Metabase dashboards and alerts', d: 'Custom tracking plus automated email intervals that tell warehouse leads exactly how many actions are pending, so nothing misses a courier cut-off.', wf: 'progress' }] },
      { id: 'outcome', h: 'Outcomes', p: ['Cross-system edge cases and bug-fixing meant two full months of careful scaling to reach stability. After that:'],
        bullets: ['Fulfilment rate rose 3.0%: orders that used to auto-cancel on a single-item stockout were saved by matching.', 'User cancellations fell 2.6pp: no more post-purchase price surprises.', 'Warehouse picking velocity rose: leads resolved anomalies in the system and sent pre-verified invoices to pickers.', 'Procurement planning was unlocked: live inventory in the substitution flow gave supply teams clean data for forecasting.', 'Support ticket volume dropped on missing items, surprise charges and unannounced cancellations.'] },
      { id: 'diff', h: 'What I’d do differently', items: [
        { t: 'Avoid a big-bang release', d: 'I launched across all national fulfilment centres at once. The multi-warehouse scale exposed gaps and broke active order paths, so I rolled back and redeployed to the lowest-volume warehouse first. Incremental testing let us fix P0 issues safely before scaling.' },
        { t: 'Run an MVP shadow operation', d: 'Instead of locking ops out for two months, a data analyst could have synced a live-inventory query to a Google Sheet for a one- or two-week manual pilot. It would have given on-ground feedback much sooner.' },
        { t: 'Test an upsell at checkout', d: 'I would run a parallel A/B test offering a larger pack at a small discount on the order summary, which could avoid fulfilment delays while lifting average order value.' }] },
    ],
  },
  {
    slug: 'growth-loops', n: '04', tag: 'Growth', wf: 'loop', cat: 'Referral · CMS · Lifecycle', year: '2024 – 2026',
    title: 'Growth loops that close',
    line: 'Rebuilt referral, shipped a headless CMS and built a reminder platform, so growth stopped waiting on engineering and repeat orders ran by themselves.',
    metrics: [['6 → 13%', 'Referral acquisition share'], ['~1,100/day', 'Repeat orders'], ['+1.7pp', 'Landing-page conversion']],
    hook: 'A referral programme leaking to fraud does not scale, and a CMS that needs a ticket for every experiment kills velocity.',
    quick: {
      problem: 'Referral was leaking to fraud: the same device IDs claiming repeat rewards, plus return-order abuse. Every landing page needed an engineering ticket. Repeat-order drop-off had no automated re-engagement behind it.',
      call: 'Close each loop at the infrastructure level: fix the fraud vectors, give growth a CMS it can run itself, and automate the reminder journey end to end.',
      result: 'Referral contribution doubled from 6% to 13%, landing-page conversion rose 1.7pp (7.0% to 8.7%), and the reminder platform drives about 1,100 repeat orders a day.',
    },
    body: [
      { id: 'problem', h: 'The problem', p: ['Three growth mechanisms leaked in different ways. Referral rewards were being claimed repeatedly from the same device IDs and through return-order abuse. Landing pages needed an engineering ticket each, which capped how many experiments growth could run. And a customer who stopped reordering had no automated reason to come back, a revenue leak with no owner.'] },
      { id: 'decision', h: 'The call', call: 'Fix the infrastructure behind each loop, not the surface.',
        bullets: ['Rebuild referral end to end and close both fraud vectors.', 'Put pages in the hands of growth with a headless CMS and real-time builds.', 'Build the reminder journey as a full-stack platform: customer journeys, agent order management and retention messaging together.'] },
      { id: 'built', h: 'What was built', items: [
        { t: 'Referral, rebuilt', d: 'Rebuilt end to end with the fraud vectors closed, doubling acquisition from referral.', wf: 'loop' },
        { t: 'Strapi headless CMS', d: 'Real-time page builds without engineering, tested continuously with A/B tests.', wf: 'checkout' },
        { t: 'Order reminder platform', d: 'Customer reminder journeys, internal agent order-management workflows and retention communication in one system.', wf: 'progress' }] },
      { id: 'outcome', h: 'Outcomes', bullets: ['Referral contribution doubled from 6% to 13%.', 'Landing-page conversion rose 1.7pp (7.0% to 8.7%) through continuous A/B testing.', 'The reminder platform drives about 1,100 repeat orders every day.'] },
    ],
  },
  {
    slug: 'search-discovery', n: '05', tag: 'Search', wf: 'search', cat: 'Search · SEO · Analytics', year: '2024 – 2026',
    title: 'Search and discovery',
    line: 'Rebuilt predictive search around behaviour and took organic clicks from 468K to 1.6M in six months.',
    metrics: [['+9.0%', 'Search-to-order conversion'], ['468K → 1.6M', 'Organic clicks, six months'], ['127K+', 'App installs']],
    hook: 'Funnel analysis showed customers typing queries the engine could not resolve, and it was costing orders.',
    quick: {
      problem: 'Low search relevance was a silent discovery bottleneck, and organic acquisition was structurally underweight against paid.',
      call: 'Treat search as behavioural intent, not a string to match, and back the ranking with 230,000+ manually tagged and QC’d search terms.',
      result: 'Search-to-order conversion rose 9.0%, organic clicks grew from 468K to 1.6M in six months, and a web-to-app banner drove 127K+ installs.',
    },
    body: [
      { id: 'problem', h: 'The problem', p: ['Customers typed queries the engine could not resolve. Because the gap sat inside the funnel, it never showed up as an error, only as orders that did not happen. Organic acquisition lagged behind paid, so growth cost more than it should.'] },
      { id: 'decision', h: 'The call', call: 'Treat search as behavioural intent, not a string to match.', bullets: ['Rank on behaviour, not just keywords.', 'Back it with 230,000+ manually tagged and quality-checked search terms.', 'Own the SEO and analytics stack so the effect is measurable.'] },
      { id: 'built', h: 'What was built', items: [
        { t: 'Predictive search', d: 'Core predictive search rebuilt with behavioural suggestions and a redesigned search UX.', wf: 'search' },
        { t: 'SEO and analytics stack', d: 'GA4, Looker Studio, Meta CAPI, blog and disease pages, so organic growth could be attributed.', wf: 'loop' },
        { t: 'Web-to-app banner', d: 'A banner that moved web visitors into the app.', wf: 'checkout' }] },
      { id: 'outcome', h: 'Outcomes', bullets: ['Search-to-order conversion rose 9.0%.', 'Organic clicks grew from 468K to 1.6M in six months.', 'The web-to-app banner drove over 127,000 installs.'] },
    ],
  },
  {
    slug: 'ai-automation', n: '06', tag: 'AI', wf: 'voice', cat: 'Voice · Recommendation · Risk', year: '2025 – 2026',
    title: 'AI and automation in operations',
    line: 'A voice agent, a substitution recommender and a risk-scoring engine, pointed at the work that cost the most to do by hand.',
    metrics: [['−20%', 'Cost per order'], ['+11%', 'Substitution acceptance'], ['−18%', 'Support decision time']],
    hook: 'A large share of contact volume was low-complexity, high-volume queries that cost money and needed no person.',
    quick: {
      problem: 'Delivery-status and order-tracking queries drove support cost. Substitution suggestions ignored how customers buy, and agents had no fast way to judge loyalty or fraud risk.',
      call: 'Quantify which queries are low-complexity, and automate those first.',
      result: 'Voice automation and prioritisation cut cost per order by 20%, the recommender lifted substitution acceptance 11%, and the intelligence engine cut support decision time by 18%.',
    },
    body: [
      { id: 'problem', h: 'The problem', p: ['Support cost followed volume, not complexity. The queries that cost the most to answer, delivery status and order tracking, were the ones a system could answer. Elsewhere, substitution suggestions ignored purchase history and agents judged risk by feel.'] },
      { id: 'decision', h: 'The call', call: 'Quantify which queries are low-complexity, and automate those first.', bullets: ['Measure before building: which queries, how many, how simple.', 'Ship an MVP on the cheapest, highest-volume intent.', 'Keep people for anything with an unresolved order.'] },
      { id: 'built', h: 'What was built', items: [
        { t: 'Voice bot MVP', d: 'An NLP voice bot on delivery-status and order-tracking queries, deflecting baseline ticket volume.', wf: 'voice' },
        { t: 'Behavioural substitution recommender', d: 'Learns from purchase history to suggest the substitute a customer will accept.', wf: 'swap' },
        { t: 'Customer intelligence engine', d: 'Scores loyalty and fraud risk so agents decide faster, alongside order-prioritisation logic for consultation calls and auto-filtering of non-substitutable orders.', wf: 'ops' }] },
      { id: 'outcome', h: 'Outcomes', bullets: ['Cost per order fell 20% from voice automation and prioritisation together.', 'Substitution acceptance rose 11%.', 'Support decision time fell 18%.'] },
    ],
  },
  {
    slug: 'internal-ops-cx', n: '07', tag: 'Operations', wf: 'ops', cat: 'CRM · Returns · SLAs', year: '2024 – 2026',
    title: 'Internal ops and customer experience',
    line: 'Unified CRM routing and returns into one system and cut resolution time by 30%.',
    metrics: [['−30%', 'Resolution time'], ['1 system', 'Returns and refunds'], ['Auto', 'SLA enforcement']],
    hook: 'Customer queries bounced between warehouse, finance and engineering with no SLA and no clear owner.',
    quick: {
      problem: 'Queries moved between three functions with no systematic SLA. Returns and refunds had no single workflow, so agents worked across disconnected tools.',
      call: 'Route every query to one owner with an automated SLA, instead of chasing it across teams.',
      result: 'Resolution time dropped 30% once routing and the unified returns workflow went live, enforced by the system rather than by chasing.',
    },
    body: [
      { id: 'problem', h: 'The problem', p: ['A refund question could touch the warehouse, finance and engineering, and nobody owned the clock. Agents raised tickets in one tool, tracked reverse logistics in another and processed refunds in a third.'] },
      { id: 'decision', h: 'The call', call: 'One owner per query, with the SLA enforced by the system.', bullets: ['Integrate a CRM that routes by function.', 'Collapse returns, refunds and reverse logistics into one workflow.', 'Add maker-checker controls where errors were expensive.'] },
      { id: 'built', h: 'What was built', items: [
        { t: 'CRM routing with automated SLAs', d: 'Kapture CRM integration routing queries across warehouse, finance and engineering, with automated SLAs.', wf: 'ops' },
        { t: 'Unified returns and refunds', d: 'Agents raise tickets, process refunds and track reverse logistics inside a single system.', wf: 'ledger' },
        { t: 'Maker-checker and catalogue tooling', d: 'A maker-checker workflow and catalogue tools that cut errors.', wf: 'lock' }] },
      { id: 'outcome', h: 'Outcomes', bullets: ['Support resolution time fell 30%.', 'Returns and refunds run in one system.', 'Cross-functional routing is enforced by the system, not chased by hand.'] },
    ],
  },
];

export const CASE_STEPS = ['The hook', 'Context', 'The problem', 'What made it hard', 'The decision', 'What was built', 'What changed', 'What I’d do differently'];
export const TAGS = ['All', 'Payments', 'Growth', 'Operations', 'Search', 'AI'];

/* ───────────── journey ───────────── */
export const CHAPTERS = [
  { k: 'I', t: 'Learn how demand is made', span: '2021 – 2023', d: 'Dealer networks, landing pages and campaign targeting. Three roles that taught me what a customer does between an ad and an order.',
    roles: [
      { when: 'May – Jun 2021', role: 'Digital Marketing and Web Development Intern', org: '9LedgePro · Microsoft Partner Network', text: 'Ran an SEO audit, shipped 30+ posts and 10 blogs, and set a 40/40/20 low-medium-high competition keyword mix.' },
      { when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst Advertising and Design · Goregaon', text: 'Primary contact for 15 Tata Motors dealers across Maharashtra. Wireframed 48 landing pages and a lead-management system, and planned about 100 campaigns.' },
      { when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India · Mumbai', text: 'Managed 6 clients across sectors, supported pitches that won new business and refined campaign targeting from consumer-behaviour data.' },
    ] },
  { k: 'II', t: 'Ship the systems underneath', span: 'Dec 2023 – Jul 2026', d: 'Two years and eight months at one company, owning five systems from first problem to measured result.',
    roles: [
      { when: 'Dec 2023 – Jul 2026', role: 'Associate Product Manager', org: 'Truemeds · Mumbai', text: 'Co-managed two product pods of 12 engineers across payments and portals, with the engineering lead and a senior PM. Built five systems 0-to-1 and owned sprint planning, prioritisation, on-call rotation and delivery.',
        tags: ['Payments', 'Growth', 'Search', 'Internal tools', 'Operations'] },
    ] },
  { k: 'III', t: 'Own the product, then the company', span: '2026 – now', d: 'A product role at GNC India and a company of my own, working on the same question from two sides.',
    roles: [
      { when: 'Oct 2026 – now', role: 'Product Manager', org: 'GNC India · OneGuardian Brands · Mumbai', text: 'Product manager at GNC India, the consumer wellness brand, across ecommerce, growth and the internal platforms behind them.', tags: ['Ecommerce', 'D2C', 'Growth', 'Platform'] },
      { when: '2026 – now', role: 'Founder and Product Architect', org: 'MESHHETU', text: 'Founded a systems engineering company for ecommerce and D2C: strategic consulting, modular intelligence, and ROQIVA in development.', tags: ['Consulting', 'GTM engineering', 'RevOps'] },
    ] },
];

export const EDU = [['MBA · Marketing, Operations and SCM', 'NMIMS, Mumbai · 2021 – 2023'], ['BTech · Electronics and Telecommunications', 'NMIMS, Mumbai · 2018 – 2022']];
export const CERTS = ['Model Context Protocol: Advanced Topics (Anthropic)', 'Building with the Claude API (Anthropic)', 'Building Agentic AI Systems', 'Create Generative AI Apps on Google Cloud', 'Aha! Product Management Professional', 'Executive Program in Product Management', 'Eye Tracking in Neuromarketing: a study on visual attention patterns (publication)'];
export const SKILLS = ['Payment systems and architecture', 'Product discovery and roadmapping', 'Product analytics and SQL', 'Wireframing and product design', 'A/B testing', 'Workflow automation', 'API and platform integrations', 'Agile and Scrum', 'Market research'];

/* ───────────── MESHHETU ───────────── */
export const MESH = {
  hindi: 'हेतु', meaning: 'Hindi for reason, cause and purpose.',
  tagline: 'The systems engineering company.',
  category: 'Commercial systems engineering for ecommerce and D2C',
  why: 'We founded MESHHETU to connect the work that falls between commercial tools, teams and decisions, not to add technology for its own sake.',
  principle: 'Every system should have a reason to exist, every recommendation should have evidence, and every improvement should have a clear owner.',
  tracks: [
    { k: 'A', t: 'Strategic consulting', s: 'Available today', tone: 'ok', d: 'Founder-led investigation, options and a decision-ready handoff: PRD, tracking spec, tickets and acceptance criteria.' },
    { k: 'B', t: 'Modular intelligence', s: 'Available today', tone: 'ok', d: 'Focused analysis and finding cards at an agreed cadence, with limited system intervention.' },
    { k: 'C', t: 'ROQIVA', s: 'In development', tone: 'vi', d: 'An integrated revenue orchestration product, designed to work inside a brand’s existing stack and read-only by design.' },
  ],
  steps: [['01', 'Detect', 'Code', 'Match every captured signal to the decision that reads it.'], ['02', 'Audit', 'Agent', 'Write ranked, evidence-labelled finding cards.'], ['03', 'Decide', 'Agent', 'Compare solutions, including the cheapest one.'], ['04', 'Build', 'Agent', 'Draft the PRD, wireframe, tickets and checks.'], ['05', 'Release', 'Person', 'The brand signs one exact release candidate.'], ['06', 'Measure', 'Code', 'Check the result against the baseline.']],
  gates: ['Problem', 'Direction', 'Design and PRD', 'Release'],
  rules: [['Code computes', 'Every count, join and ranking comes from code you can reproduce.'], ['Agents draft', 'Agents write drafts. They never write to a live system or approve their own work.'], ['People decide', 'Four gates, each with a named approver.']],
};

/* ───────────── beyond work ───────────── */
export const PHOTOS = [
  { src: 'boat', g: 'Wander', cap: 'Slow water, no agenda.', w: 749 }, { src: 'kart-grid', g: 'Speed', cap: 'On the grid.', w: 749 },
  { src: 'lights-red', g: 'Live', cap: 'Lights before the drop.', w: 749 }, { src: 'lake-overlook', g: 'Wander', cap: 'The long way round.', w: 749 },
  { src: 'kart-pov', g: 'Speed', cap: 'Eyes on the apex.', w: 749 }, { src: 'stage-unreal', g: 'Live', cap: 'Phones up, everyone in.', w: 561 },
  { src: 'jeep', g: 'Wander', cap: 'Back roads, old jeep.', w: 749 }, { src: 'f1-sim', g: 'Speed', cap: 'Practice laps, indoors.', w: 570 },
  { src: 'festival', g: 'Live', cap: 'Festival night.', w: 561 }, { src: 'paddle', g: 'Wander', cap: 'Golden hour, flat water.', w: 749 },
  { src: 'kart-night', g: 'Speed', cap: 'Night session.', w: 567 }, { src: 'rainier', g: 'Wander', cap: 'A mountain worth the drive.', w: 561 },
  { src: 'laser', g: 'Live', cap: 'Lasers over the crowd.', w: 561 }, { src: 'city-detour', g: 'Wander', cap: 'City detour.', w: 749 },
  { src: 'waterfall', g: 'Wander', cap: 'Chasing the sound.', w: 561 },
];
export const ALT = {
  boat: 'Smiling in an orange life jacket on a boat, rocky shore behind', 'kart-grid': 'Seated in a blue and yellow go-kart in a covered pit lane', 'lights-red': 'A dark arena with red beams above the stage',
  'lake-overlook': 'Turquoise lake from a rocky overlook with forested mountains', 'kart-pov': 'Point of view from a yellow go-kart on a track lined with tyres', 'stage-unreal': 'A crowd with phones raised in front of a stage screen',
  jeep: 'Sitting on the front of a vintage jeep under big trees', 'f1-sim': 'A racing wheel in front of a screen showing a Formula 1 game', festival: 'A hand raised in a festival crowd before a large lit screen',
  paddle: 'Silhouette kneeling on a paddleboard on a lake at golden hour', 'kart-night': 'A go-kart cornering under floodlights at night', rainier: 'A snow-capped mountain above a dark pine forest and a lake',
  laser: 'Teal laser beams across a dark arena above a packed crowd', 'city-detour': 'Standing outside a wood-fronted building on a city street', waterfall: 'Looking toward a waterfall over rocks and green hills',
};
export const LOVES = [
  ['F1', 'Karts on weekends, a racing sim in between, and a strong opinion about tyre strategy.'],
  ['EDM and techno', 'Loud rooms, good sound, and lasers over a crowd.'],
  ['Food', 'I will travel for a good meal.'],
  ['Fashion', 'Clothes as design, and why a jacket works.'],
  ['Consumer brands', 'What makes people choose one over another, and stay.'],
  ['Watches', 'Small, precise, honest machines.'],
];

/* ───────────── contact ───────────── */
export const DOORS = [
  { id: 'job', t: 'Hire me', s: 'Roles', d: 'Product Manager or Product Architect roles in consumer tech, AI-enabled products, growth systems and platform infrastructure.', cta: 'Start a conversation',
    asks: [['Role or team', 'text'], ['Company', 'text']], opts: ['Product Manager', 'Senior Product Manager', 'Product Architect', 'Something else'] },
  { id: 'consult', t: 'Consult with me', s: 'MESHHETU', d: 'Diagnose a stuck metric, design the system behind it and hand over a build-ready plan, through MESHHETU’s consulting and modular intelligence tracks.', cta: 'Bring me the number',
    asks: [['Business', 'text'], ['The metric that won’t move', 'text']], opts: ['E-commerce or D2C', 'Subscription or refill', 'Marketplace', 'Something else'] },
];

/* ───────────── achievements (beyond one employer) ───────────── */
export const WINS = [
  { k: 'Payments', v: '+12.5pp', d: 'Prepaid order-to-delivery, from a checkout rebuild and Price Lock.' },
  { k: 'Payments', v: '+6.0%', d: 'Online prepaid adoption, from redesigning payment visibility. Amazon Pay integrated.' },
  { k: 'Search', v: '+9.0%', d: 'Search-to-order conversion from predictive search and behavioural suggestions.' },
  { k: 'Growth', v: '~1,100/day', d: 'Repeat orders from an automated reminder platform.' },
  { k: 'Growth', v: '6 → 13%', d: 'Referral share of acquisition after closing two fraud vectors.' },
  { k: 'Retention', v: '+1.9pp', d: 'User retention from a coupon platform with 45+ stacking combinations and cashback.' },
  { k: 'AI', v: '−20%', d: 'Cost per order from a voice agent and order prioritisation.' },
  { k: 'AI', v: '+11%', d: 'Medicine substitution acceptance from a behaviour-driven recommender.' },
  { k: 'Operations', v: '−30%', d: 'Support resolution time after unifying CRM routing, returns and refunds.' },
  { k: 'Platform', v: '70,000+', d: 'SKUs re-indexed by salt, brand, variant and dosage form for the substitution engine.' },
  { k: 'Analytics', v: 'GA4 + BigQuery', d: 'End-to-end analytics infrastructure, with Mixpanel, CleverTap and AppsFlyer centralised.' },
  { k: 'Growth', v: '127K+', d: 'App installs from a web-to-app banner.' },
];

/* ───────────── hire me ───────────── */
export const HIRE = {
  pitch: 'I build the systems that turn customer signals into revenue. I find where revenue leaks, design the decision logic, wire it into the systems that act on it, and measure the lift with proper experiments.',
  roles: ['Product Manager (growth, payments, platform, AI)', 'Product Architect or Technical Product Manager', 'GTM Engineer or revenue-systems roles'],
  where: 'India, or remote with US and global teams.',
  strengths: ['Consumer product', 'Ecommerce and D2C', 'Growth product', 'RevOps', 'GTM engineering', 'Search and discovery', 'Checkout and payments', 'Retention and lifecycle', 'Fulfilment and logistics', 'CX', 'AI and automation', 'Product analytics', 'Experimentation', 'Revenue systems'],
  pattern: [
    ['Find the leak', 'Funnel analysis, SQL and time with the warehouse and support teams, to see where revenue actually escapes.'],
    ['Design the rule', 'The decision logic written as states and exceptions an engineer can build, with the options I rejected on the page.'],
    ['Wire it in', 'The web, app, API and internal tool that act on the rule, owned end to end with the engineering lead.'],
    ['Prove the lift', 'Phased A/B releases against a baseline, then a write-up of what worked and what I would change.'],
  ],
  fit: [['Growth PM', 'Referral, lifecycle, CMS and experimentation that growth can run without a ticket.'], ['Payments PM', 'Checkout, price integrity, payment adoption and failure handling.'], ['Platform PM', 'Rule engines, catalogues, portals and the internal tools behind them.'], ['AI PM', 'Automation and recommendation that start with the cheapest high-volume intent.']],
};

/* ───────────── consulting ───────────── */
export const CONSULT = {
  lead: 'Bring me a metric that will not move. I will find the leak between your tools, design the system behind the fix and hand your team a build-ready plan.',
  offers: [
    { k: '01', t: 'Revenue leak audit', time: '1 to 2 weeks', d: 'Trace the funnel and the systems under it. You get ranked, evidence-labelled findings and the first fix worth making.', gets: ['Funnel and event audit', 'Ranked findings with evidence', 'The cheapest fix first'] },
    { k: '02', t: 'Decision-ready build plan', time: '2 to 4 weeks', d: 'Turn the chosen fix into a PRD, wireframes, tracking spec, tickets and acceptance criteria your engineers can pick up.', gets: ['PRD and wireframes', 'Tracking plan', 'Tickets with acceptance criteria'] },
    { k: '03', t: 'Embedded product architect', time: 'Monthly', d: 'I sit with your team, own a track end to end across web, app and platform, and report against a baseline.', gets: ['Roadmap and sprint ownership', 'Release and measurement', 'A named owner for every change'] },
  ],
  fit: ['Ecommerce and D2C brands with a stuck conversion, retention or fulfilment number', 'Teams whose tools capture the signals but nobody owns the decision', 'Founders who need a product architect before they hire one'],
  notfit: ['A redesign with no measurable goal', 'Work that needs a large delivery team from day one'],
  faq: [
    ['Who do I work with?', 'Me, directly. Consulting runs through MESHHETU. No hand-off to a junior team.'],
    ['What do you need from us?', 'Read access to the funnel and event data, an hour with the people who run the operation, and one named person to decide.'],
    ['Do you build or only advise?', 'Both. The plan is written to be built by your team, and I can own the build as an embedded product architect.'],
    ['How do we start?', 'Send the metric and a line on the business. I reply with where I would look first, usually within two working days.'],
  ],
};

/* ───────────── case-page sidebar: at a glance ───────────── */
export const GLANCE = {
  'price-lock-checkout': { role: 'Owner, 0-to-1', team: 'Designers, engineers and a data analyst', stack: ['Payments stack', 'Order-processing portals', 'Firebase A/B', 'Mixpanel'], read: '8 min' },
  'coupons-cashback': { role: 'Owner, with marketing and design', team: 'Marketing, design pod, engineering', stack: ['Rule validator', 'Cashback ledger', 'Admin portals'], read: '8 min' },
  'sku-substitution-engine': { role: 'Architect of the logic layer', team: 'Warehouse ops, catalogue, engineering', stack: ['Catalogue CMS', 'Order-routing tables', 'Metabase'], read: '9 min' },
  'growth-loops': { role: 'Product owner', team: 'Growth, engineering', stack: ['Strapi CMS', 'Referral service', 'Reminder journeys'], read: '3 min' },
  'search-discovery': { role: 'Product owner', team: 'Growth, SEO, engineering', stack: ['Predictive search', 'GA4', 'Looker Studio', 'Meta CAPI'], read: '3 min' },
  'ai-automation': { role: 'Product owner', team: 'Support, operations, engineering', stack: ['NLP voice bot', 'Recommendation model', 'Risk scoring'], read: '3 min' },
  'internal-ops-cx': { role: 'Product owner', team: 'Warehouse, finance, engineering', stack: ['Kapture CRM', 'Returns workflow', 'Maker-checker'], read: '3 min' },
};
