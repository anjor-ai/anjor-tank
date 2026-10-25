/* ==========================================================================
   CONTENT: every list, figure and caption on the page that is not plain
   section copy. Edit here; app.js renders it once at load.

   Rules this file follows
   - Figures come from the previous site / résumé. Nothing new is invented.
   - Checkout figure is 77.2% -> 89.7% (+12.5pp), RTO -1.9pp, cancellations -3.3pp.
     (The résumé PDF still says 81.4%; that is superseded.)
   - Photo captions are deliberately generic. Edit them if you want places or dates.
   ========================================================================== */
export const C = {

  person: {
    name: 'Anjor Tank',
    email: 'anjort2000@gmail.com',
    linkedin: 'https://www.linkedin.com/in/anjor-tank',
    calendly: 'https://calendly.com/anjort2000',
    business: { name: 'MESHHETU', url: 'https://meshhetu.com' }
  },

  /* ---------- hero: proof strip. `count` animates the number in the span ---------- */
  proof: [
    { pre: '77.2 → ', to: 89.7, dp: 1, suf: '%', from: 77.2, label: 'Prepaid order-to-delivery conversion', note: '+12.5pp' },
    { pre: '~', to: 1100, dp: 0, suf: '/day', from: 0, label: 'Repeat orders from the reminder platform', note: '' },
    { text: '468K → 1.6M', label: 'Organic clicks in six months', note: '' },
    { pre: '−', to: 20, dp: 0, suf: '%', from: 0, label: 'Cost per order, voice automation and prioritisation', note: '' }
  ],

  /* ---------- how I think: the decision log ---------- */
  decisions: [
    {
      id: 'R-06', sig: 'Cart abandoned', cx: 'High intent · no history of responding to discounts',
      st: ['ok', 'Fired · offer held'],
      dec: 'Remove the friction first. Hold the discount, because there is no evidence she needs one.',
      code: 'IF intent = high AND abandoned = true\n  THEN recover(friction_first)\n  IF customer.price_sensitive = false\n    THEN suppress(discount)',
      without: 'Sends a blanket discount at hour four to every abandoner.',
      with: 'Fixes the friction and releases an offer only where there is evidence for it.'
    },
    {
      id: 'R-01', sig: 'Cart abandoned', cx: 'Already ordered today',
      st: ['warn', 'Suppressed'],
      dec: 'Hold every message. Record the signal for later.',
      code: 'IF customer.ordered_today = true\n  THEN suppress(ALL activation)\n  AND log(signal FOR future_decisioning)',
      without: 'Fires the scheduled campaign anyway, selling her what she just bought.',
      with: 'Recognises the order, holds every message and keeps the signal.'
    },
    {
      id: 'R-08', sig: 'Support contact', cx: 'Low-complexity query · order in normal state',
      st: ['vi', 'Routed'],
      dec: 'Deflect the informational query to the voice agent. Anything with an unresolved order goes to a person.',
      code: 'IF query.complexity = low AND order.state = normal\n  THEN deflect(voice_agent)\nELSE route(human, priority = order_value)\n  AND suppress(all_marketing) UNTIL resolved',
      without: 'Queues everything to a human in arrival order.',
      with: 'Deflects what it safely can and prioritises the rest by order value.'
    },
    {
      id: 'R-10', sig: 'Inactive after purchase', cx: 'Last order had a service failure',
      st: ['vi', 'Routed'],
      dec: 'Resolve the failure before any win-back. A lapse after a bad experience is not a discount problem.',
      code: 'IF days_since > expected_gap * 1.5\n  THEN classify(lapse_reason)\n  IF reason = service_failure\n    THEN route(resolution) AND suppress(promotion)\n  ELSE activate(reactivation)',
      without: 'Sends a win-back coupon to everyone who went quiet.',
      with: 'Classifies the reason first and discounts only where it fits.'
    }
  ],

  /* ---------- work: five systems, all built at Truemeds ---------- */
  projects: [
    {
      id: 'checkout', code: 'PRJ / 01', title: 'Checkout & payments',
      summary: 'Redesigned checkout end to end and launched Price Lock, lifting prepaid conversion while cutting cancellations and RTO.',
      metrics: [['77.2 → 89.7%', 'Prepaid order-to-delivery'], ['−3.3pp', 'Cancellations'], ['−1.9pp', 'RTO']],
      problem: 'Payment was not collected at order placement. The order waited until the box was packed, three to four hours later, and only then did the customer get a payment link. Miss the window and the order sat a day, or auto-cancelled if the courier could not take cash on delivery. Warehouse price mismatches, from five distinct causes, made collecting at checkout unreliable.',
      call: 'Lock the price at order placement and absorb every warehouse-side change (any increase as a discount, any decrease refunded) instead of fixing five upstream pricing systems first. For stockouts, shield the customer: substitute inside the system rather than asking mid-checkout.',
      shipped: 'Price Lock, a checkout that collects payment at placement, and an algorithmic SKU substitution engine that reads salt composition, product line, dosage format and mother brand.',
      result: 'Prepaid order-to-delivery conversion moved from 77.2% to 89.7% (+12.5pp). RTO fell 1.9pp and cancellations 3.3pp. Payment adoption rose 6.0pp and delivery fulfilment 3.0%. It became the base of the company’s first standard e-commerce payments stack.',
      stack: ['Checkout UX', 'Payments', 'Catalogue & inventory', 'A/B testing']
    },
    {
      id: 'growth', code: 'PRJ / 02', title: 'Growth & retention',
      summary: 'Rebuilt referral, coupons and lifecycle systems to close revenue leaks, doubling referral acquisition and driving ~1,100 repeat orders a day.',
      metrics: [['6 → 13%', 'Referral acquisition share'], ['~1,100/day', 'Repeat orders'], ['+1.7pp', 'Landing-page conversion']],
      problem: 'Referral was leaking to fraud (the same device IDs claiming repeat rewards, plus return-order abuse). The coupon platform could not target cohorts or stack promotions, so every campaign needed an engineer. Every landing page needed a ticket, and repeat-order drop-off had no automated re-engagement behind it.',
      call: 'Rebuild the coupon platform from scratch rather than patch the legacy backend, and ship the architecture clean once instead of trimming scope for an earlier date.',
      shipped: 'Referral rebuilt end to end, closing both fraud vectors; a Strapi headless CMS so growth ships pages without engineering; a coupon engine supporting 45+ stacking combinations with live cashback; and a full-stack order reminder platform.',
      result: 'Referral contribution doubled from 6% to 13%. Landing-page conversion rose 1.7pp through continuous A/B tests. The reminder platform drives about 1,100 repeat orders a day. The coupon rebuild lifted retention 1.9pp and coupon applicability 5.0pp.',
      stack: ['Referral systems', 'Headless CMS', 'Coupon engine', 'Lifecycle automation']
    },
    {
      id: 'ai', code: 'PRJ / 03', title: 'AI & automation',
      summary: 'Shipped a voice agent, a substitution recommender and a risk-scoring engine to cut cost and support load.',
      metrics: [['−20%', 'Cost per order'], ['+11%', 'Substitution acceptance'], ['−18%', 'Support decision time']],
      problem: 'A large share of contact volume was high-volume, low-complexity queries (delivery status, order tracking) driving support cost without needing a person. Substitution suggestions ignored how a customer actually bought, and agents had no fast way to assess loyalty or fraud risk.',
      call: 'Quantify which queries are low-complexity, and automate those first.',
      shipped: 'An NLP voice bot MVP for delivery-status and order-tracking queries; a behaviour-driven substitution recommender that learns from purchase history; and a customer intelligence engine that scores loyalty and fraud risk, alongside order-prioritisation logic.',
      result: 'Voice automation and prioritisation together cut cost per order by 20%. The recommender improved substitution acceptance by 11%. The intelligence engine cut support decision time by 18%.',
      stack: ['Voice AI / NLP', 'Recommendation', 'Risk scoring', 'Workflow automation']
    },
    {
      id: 'search', code: 'PRJ / 04', title: 'Search & discovery',
      summary: 'Overhauled search and owned the SEO and analytics stack, taking organic clicks from 468K to 1.6M in six months.',
      metrics: [['+9.0%', 'Search-to-order conversion'], ['468K → 1.6M', 'Organic clicks, six months'], ['127K+', 'App installs']],
      problem: 'Funnel analysis showed low search relevance was a silent discovery bottleneck: customers typed queries the engine could not resolve, and it cost orders. Organic acquisition was also structurally underweight against paid.',
      call: 'Treat search as behavioural intent, not a string to match, and back the ranking with 230,000+ manually tagged and QC’d search terms.',
      shipped: 'A rebuilt predictive search with behavioural suggestions and redesigned UX; the SEO and analytics stack (GA4, Looker Studio, Meta CAPI, blog and disease pages); and a web-to-app growth banner.',
      result: 'Search-to-order conversion rose 9.0%. Organic clicks grew from 468K to 1.6M over six months. The web-to-app banner drove over 127,000 installs.',
      stack: ['Search ranking', 'SEO', 'GA4 & analytics', 'Attribution']
    },
    {
      id: 'ops', code: 'PRJ / 05', title: 'Internal ops & CX',
      summary: 'Unified CRM routing and returns workflows into one system, cutting support resolution time by 30%.',
      metrics: [['−30%', 'Resolution time'], ['1 system', 'Returns and refunds'], ['Auto', 'SLA enforcement']],
      problem: 'Customer queries bounced between warehouse, finance and engineering with no systematic SLA and no clear owner. Returns and refunds had no single workflow, so agents worked across disconnected tools.',
      call: 'Route every query to one owner with an automated SLA, instead of chasing it across teams.',
      shipped: 'Kapture CRM integration for query routing across three functions with automated SLAs; an end-to-end returns and refunds workflow; and a maker-checker workflow plus catalogue tooling that cut errors.',
      result: 'Support resolution time dropped 30% once the CRM integration and unified returns workflow went live, with cross-functional routing enforced by the system rather than chased by hand.',
      stack: ['CRM integration', 'Workflow design', 'Ops automation', 'Catalogue tooling']
    }
  ],

  /* ---------- path: work history, oldest first. `now:true` marks the current node ---------- */
  timeline: [
    { when: 'May – Jun 2021', role: 'Digital Marketing & Web Development Intern', org: '9LedgePro · Microsoft Partner Network',
      text: 'Ran an SEO audit and set a 40/40/20 low-medium-high competition keyword mix.' },
    { when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst Advertising and Design · Goregaon',
      text: 'Primary contact for 15 Tata Motors dealers across Maharashtra. Wireframed 48 landing pages and a lead management system, and planned about 100 campaigns.' },
    { when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India · Mumbai',
      text: 'Managed 6 clients across sectors and refined campaign targeting from consumer-behaviour data.' },
    { when: 'Dec 2023 – Jul 2026', dur: '2 yrs 8 mos', role: 'Associate Product Manager', org: 'Truemeds · Series C online pharmacy · Mumbai', key: true,
      text: 'Co-managed two product pods of 12 engineers across payments and portals. Built the five systems above, 0-to-1.',
      tags: ['Payments', 'Growth', 'Search', 'Internal platforms', 'Operations'] },
    { when: 'Now', role: 'Product Architect', org: 'MESHHETU · Mumbai', now: true,
      text: 'Founder-led GTM engineering for ecommerce and D2C: consulting and modular systems intelligence, with ROQIVA in development.',
      link: ['Visit meshhetu.com', 'https://meshhetu.com'] }
  ],

  education: [
    ['MBA · Marketing, Operations & SCM', 'NMIMS, Mumbai · 2021 – 2023'],
    ['BTech · Electronics & Telecommunications', 'NMIMS, Mumbai · 2018 – 2022']
  ],
  certs: [
    'Model Context Protocol: Advanced Topics (Anthropic)',
    'Building with the Claude API (Anthropic)',
    'Building Agentic AI Systems',
    'Aha! Product Management Professional',
    'Executive Program in Product Management'
  ],

  /* ---------- outside work. `g` is the group tag shown on the card ---------- */
  adventure: [
    { src: 'boat',         g: 'Wander', cap: 'Slow water, no agenda.',     alt: 'Smiling in an orange life jacket on a boat, looking back over the shoulder, rocky shore behind' },
    { src: 'kart-grid',    g: 'Speed',  cap: 'On the grid.',               alt: 'Seated in a blue and yellow go-kart in a covered pit lane, helmet on' },
    { src: 'lights-red',   g: 'Live',   cap: 'Lights before the drop.',    alt: 'A dark arena with red beams and a lighting rig above the stage' },
    { src: 'lake-overlook',g: 'Wander', cap: 'The long way round.',        alt: 'Turquoise lake seen from a rocky overlook with forested mountains and clouds' },
    { src: 'kart-pov',     g: 'Speed',  cap: 'Eyes on the apex.',          alt: 'Point-of-view from a yellow go-kart on a track lined with tyres under a clear sky' },
    { src: 'stage-unreal', g: 'Live',   cap: 'Phones up, everyone in.',    alt: 'A crowd with phones raised in front of a stage screen under steel trusses' },
    { src: 'jeep',         g: 'Wander', cap: 'Back roads, old jeep.',      alt: 'Sitting on the front of a vintage jeep under big trees, sunlight through the leaves' },
    { src: 'f1-sim',       g: 'Speed',  cap: 'Practice laps, indoors.',    alt: 'A racing wheel in front of a screen showing a Formula 1 game mid-race' },
    { src: 'festival',     g: 'Live',   cap: 'Festival night.',            alt: 'A hand raised in a festival crowd in front of a large lit screen and speaker tower' },
    { src: 'paddle',       g: 'Wander', cap: 'Golden hour, flat water.',   alt: 'Silhouette kneeling on a paddleboard on a lake with sun glittering on the water' },
    { src: 'kart-night',   g: 'Speed',  cap: 'Night session.',             alt: 'A go-kart cornering under floodlights at night, motion blur on the track' },
    { src: 'rainier',      g: 'Wander', cap: 'A mountain worth the drive.',alt: 'A snow-capped mountain above a dark pine forest and a lake under dramatic clouds' },
    { src: 'laser',        g: 'Live',   cap: 'Lasers over the crowd.',     alt: 'Teal laser beams cutting across a dark arena above a packed crowd' },
    { src: 'city-detour',  g: 'Wander', cap: 'City detour.',               alt: 'Standing outside a wood-fronted building on a city street, holding a shopping bag' },
    { src: 'waterfall',    g: 'Wander', cap: 'Chasing the sound.',         alt: 'Looking toward a waterfall over rocks and green hills under a blue sky' }
  ],

  /* ---------- funnel diagnostic ---------- */
  funnel: {
    presets: {
      ecom: { n: 'E-commerce', unit: 'delivered orders', stages: [
        { k: 's0', n: 'Sessions',         i: 'monthly traffic',   v: 100000 },
        { k: 's1', n: 'Product viewed',   i: 'session → PDP',     v: 42000, b: 0.40 },
        { k: 's2', n: 'Added to cart',    i: 'PDP → cart',        v: 13000, b: 0.28 },
        { k: 's3', n: 'Checkout started', i: 'cart → checkout',   v: 8600,  b: 0.65 },
        { k: 's4', n: 'Payment completed',i: 'checkout → paid',   v: 5700,  b: 0.78 },
        { k: 's5', n: 'Delivered',        i: 'paid → delivered',  v: 4900,  b: 0.88 }] },
      subs: { n: 'Subscription / refill', unit: 'reorders', stages: [
        { k: 's0', n: 'Active customers', i: 'with a repeat cycle', v: 40000 },
        { k: 's1', n: 'Refill window hit',i: 'due for reorder',   v: 12000, b: 0.34 },
        { k: 's2', n: 'Reminder delivered',i: 'window → reached', v: 8400,  b: 0.82 },
        { k: 's3', n: 'Reminder engaged', i: 'reached → opened',  v: 2900,  b: 0.40 },
        { k: 's4', n: 'Reorder placed',   i: 'engaged → order',   v: 900,   b: 0.38 },
        { k: 's5', n: 'Delivered',        i: 'order → delivered', v: 790,   b: 0.90 }] },
      mkt: { n: 'Marketplace', unit: 'bookings', stages: [
        { k: 's0', n: 'Sessions',         i: 'monthly traffic',   v: 80000 },
        { k: 's1', n: 'Listing viewed',   i: 'browse → listing',  v: 34000, b: 0.45 },
        { k: 's2', n: 'Enquiry sent',     i: 'listing → enquiry', v: 3900,  b: 0.12 },
        { k: 's3', n: 'Seller responded', i: 'enquiry → reply',   v: 2100,  b: 0.60 },
        { k: 's4', n: 'Booking placed',   i: 'reply → booking',   v: 640,   b: 0.35 },
        { k: 's5', n: 'Fulfilled',        i: 'booking → done',    v: 570,   b: 0.92 }] }
    },
    play: [
      { m: /deliver|fulfil/i, inv: ['Address quality and RTO exposure by pincode', 'Serviceability promised vs actually met', 'Price movement between placement and fulfilment'] },
      { m: /payment|paid/i,   inv: ['Payment method visibility at the point of choice', 'OTP and bank-side failure rates', 'Retry path after a first failure'] },
      { m: /checkout/i,       inv: ['Forced login before checkout', 'Shipping or fees revealed late', 'Coupons failing silently'] },
      { m: /cart/i,           inv: ['Price legibility against the alternative', 'Out-of-stock discovered on the product page', 'Delivery date missing at decision time'] },
      { m: /product|listing/i,inv: ['Zero-result and low-relevance queries', 'Catalogue completeness and attribute quality', 'Ranking against real buying signals'] },
      { m: /reminder|engaged/i,inv: ['Whether the refill window is computed at all', 'Channel chosen by evidence or by convenience', 'Timing against depletion rather than a calendar'] },
      { m: /reorder/i,        inv: ['Whether a refill window is computed per customer', 'Whether reminder timing tracks depletion or a calendar', 'Whether the channel is chosen from response history'] },
      { m: /enquiry|respond|booking/i, inv: ['Response SLA and who owns it', 'Prioritisation by value', 'Escalation when the SLA slips'] }
    ]
  },

  /* ---------- contact form ---------- */
  form: { url: 'https://api.web3forms.com/submit', key: 'e8ed6edd-5136-41b2-87cc-c57df384c2b0' }
};

/* ==========================================================================
   TEMPLATES
   Pure string functions. vite.config.js runs them at build time so the page ships
   as real HTML (readable without JavaScript, by crawlers and by screen readers).
   main.js imports the same functions for the parts that change at run time.
   ========================================================================== */
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const fmt = (n) => Math.round(n).toLocaleString('en-IN');
export const fmtDp = (n, dp) => n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp });
export const pad2 = (n) => (n < 10 ? '0' : '') + n;
export const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* Photo sizes, so the gallery never shifts while images load */
const DIM = { boat: [749, 998], 'city-detour': [749, 998], 'f1-sim': [570, 998], festival: [561, 998], jeep: [749, 998], 'kart-grid': [749, 998], 'kart-night': [567, 998], 'kart-pov': [749, 998], 'lake-overlook': [749, 998], laser: [561, 998], 'lights-red': [749, 998], paddle: [749, 998], rainier: [561, 998], 'stage-unreal': [561, 998], waterfall: [561, 998] };

/* One line drawing per module. Drawn on hover with DrawSVG. */
const ICONS = {
  checkout: '<rect x="8" y="16" width="48" height="32" rx="4"/><path d="M8 26h48M16 38h12"/><circle cx="46" cy="40" r="4"/>',
  growth: '<path d="M10 50 24 36 34 42 54 16M46 16h8v8"/><circle cx="10" cy="50" r="3"/><circle cx="24" cy="36" r="3"/><circle cx="34" cy="42" r="3"/>',
  ai: '<rect x="18" y="18" width="28" height="28" rx="3"/><rect x="26" y="26" width="12" height="12"/><path d="M26 10v8M38 10v8M26 46v8M38 46v8M10 26h8M10 38h8M46 26h8M46 38h8"/>',
  search: '<circle cx="28" cy="28" r="14"/><path d="M38 38 54 54M22 28h12M28 22v12"/>',
  ops: '<rect x="8" y="10" width="18" height="12" rx="2"/><rect x="38" y="10" width="18" height="12" rx="2"/><rect x="23" y="42" width="18" height="12" rx="2"/><path d="M26 16h12M17 22v8h30v-8M32 30v12"/>'
};

export function renderProof() {
  return C.proof.map((p, i) => {
    const big = p.text ? esc(p.text)
      : esc(p.pre || '') + '<span data-count="' + p.to + '" data-dp="' + p.dp + '" data-from="' + p.from + '">' + fmtDp(p.to, p.dp) + '</span>' + esc(p.suf || '');
    return '<div class="reticle" role="listitem" data-rv><span class="reticle__id label" aria-hidden="true">T-0' + (i + 1) + '</span>' +
      '<div class="proof__n">' + big + '</div><div class="proof__l">' + esc(p.label) + '</div>' +
      (p.note ? '<div class="proof__note label">' + esc(p.note) + '</div>' : '') + '</div>';
  }).join('');
}

export function hl(code) {
  return esc(code).replace(/\b(IF|THEN|ELSE|AND|UNTIL|FOR)\b/g, '<span class="kw">$1</span>');
}

export function renderDecisionList() {
  return C.decisions.map((d, i) =>
    '<button type="button" role="tab" class="dlog__row" id="dtab-' + i + '" data-i="' + i + '" aria-selected="' + (i === 0) + '" aria-controls="dlog-det" tabindex="' + (i === 0 ? 0 : -1) + '">' +
    '<span class="dot dot--' + d.st[0] + '" aria-hidden="true"></span>' +
    '<span><span class="dlog__sg">' + esc(d.sig) + '</span><span class="dlog__cx">' + esc(d.cx) + '</span></span>' +
    '<span class="chip chip--' + d.st[0] + '">' + esc(d.st[1]) + '</span></button>').join('');
}

export function renderDecisionBody(d) {
  return '<div><span class="label">' + esc(d.id) + ' · Decision rule</span><p class="dlog__dec">' + esc(d.dec) + '</p></div>' +
    '<pre class="code">' + hl(d.code) + '</pre>' +
    '<div class="cmp"><div><span class="label">Without a decision layer</span>' + esc(d.without) + '</div>' +
    '<div><span class="label">With one</span>' + esc(d.with) + '</div></div>';
}

const metrics = (p) => '<div class="mets">' + p.metrics.map((m) => '<div class="met"><b>' + esc(m[0]) + '</b><span>' + esc(m[1]) + '</span></div>').join('') + '</div>';

export function renderWork() {
  return C.projects.map((p) =>
    '<article class="pcard" data-rv><svg class="pcard__ico" viewBox="0 0 64 64" aria-hidden="true">' + ICONS[p.id] + '</svg>' +
    '<div class="pcard__top"><span class="label">' + esc(p.code) + '</span>' +
    '<button type="button" class="pcard__btn" data-case="' + p.id + '">' + esc(p.title) + '</button>' +
    '<p class="pcard__sum">' + esc(p.summary) + '</p></div>' +
    '<div class="pcard__bot">' + metrics(p) + '<span class="pcard__go" aria-hidden="true">Read the case ' + ARROW + '</span></div></article>').join('');
}

export function renderCase(p) {
  return '<div class="case__head"><div><span class="label">' + esc(p.code) + ' · Truemeds</span><h2 class="h-2" id="case-h">' + esc(p.title) + '</h2></div>' +
    '<button type="button" class="icon-btn" data-close aria-label="Close case study"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    metrics(p) +
    '<div class="case__blocks">' + [['The problem', p.problem], ['The call', p.call], ['What I shipped', p.shipped], ['The result', p.result]]
      .map((b) => '<div><span class="label">' + b[0] + '</span><p>' + esc(b[1]) + '</p></div>').join('') + '</div>' +
    '<div class="tags">' + p.stack.map((s) => '<span class="tag">' + esc(s) + '</span>').join('') + '</div>';
}

/* Oldest first: the path reads as a trajectory from launch to now. */
export function renderTimeline() {
  const n = C.timeline.length;
  return C.timeline.map((t, i) => {
    const cls = 'tl__item' + (t.key ? ' tl__item--key' : '') + (t.now ? ' tl__item--now' : '');
    const stage = t.now ? 'NOW' : 'T-0' + (n - 1 - i);
    return '<li class="' + cls + '"><div class="tl__when"><span class="tl__stage label" aria-hidden="true">' + stage + '</span><span class="label">' + esc(t.when) + '</span>' + (t.dur ? '<i>' + esc(t.dur) + '</i>' : '') + '</div>' +
      '<span class="tl__dot" aria-hidden="true"></span>' +
      '<div class="tl__card">' + (t.now ? '<span class="chip chip--ok tl__now">Now</span>' : '') +
      '<div><div class="tl__role">' + esc(t.role) + '</div><div class="tl__org">' + esc(t.org) + '</div></div>' +
      '<p class="tl__text">' + esc(t.text) + '</p>' +
      (t.tags ? '<div class="tags">' + t.tags.map((g) => '<span class="tag">' + esc(g) + '</span>').join('') + '</div>' : '') +
      (t.link ? '<a class="tl__link" href="' + esc(t.link[1]) + '" target="_blank" rel="noopener">' + esc(t.link[0]) + ' ' + ARROW + '</a>' : '') +
      '</div></li>';
  }).join('');
}

export const renderEdu = () => C.education.map((e) => '<div><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>').join('');
export const renderCerts = () => '<span class="label">Certifications</span><div class="tags">' + C.certs.map((c) => '<span class="chip">' + esc(c) + '</span>').join('') + '</div>';

export function renderGallery() {
  const n = C.adventure.length;
  return C.adventure.map((a, i) => {
    const d = DIM[a.src];
    return '<figure class="gal__item"><div class="gal__ph"><img src="/img/adventure/' + a.src + '.webp" width="' + d[0] + '" height="' + d[1] + '" alt="' + esc(a.alt) + '" loading="lazy" decoding="async"></div>' +
      '<figcaption class="gal__cap"><span class="label"><span>' + esc(a.g) + '</span><span>' + pad2(i + 1) + ' / ' + pad2(n) + '</span></span><strong>' + esc(a.cap) + '</strong></figcaption></figure>';
  }).join('');
}
