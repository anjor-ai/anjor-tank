// GTM engineering and RevOps: the practice behind the portfolio. Ported from the GTM site and put in the first person.
// Namespaced as `gtm` in src/content/index.js so names never clash with the rest of the content.

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'diagnose', label: 'Diagnose' },
  { id: 'recover', label: 'Recover' },
  { id: 'grow', label: 'Grow' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'operate', label: 'Operate' },
]

export const services = [
  {
    id: 'revenue-audit',
    principle: 'You can’t fix a leak you haven’t sized.',
    catch: 'Most teams measure activity inside each stage, so the biggest leaks sit between systems nobody owns.',
    cat: 'diagnose',
    code: '01',
    name: 'Find your revenue leakage',
    official: 'Consumer Revenue Health Audit',
    line: 'Find where your customer journey loses revenue — and what to fix first.',
    flow: ['Journey + data mapped', 'Leakage diagnosed', 'Findings ranked by value', '90-day roadmap'],
    gets: ['Customer journey and funnel map', 'Evidence-backed finding cards', 'Prioritised revenue opportunity queue', '90-day roadmap and measurement plan'],
    needs: ['A signed data-sharing agreement', 'Read access to analytics, order and event data'],
    first: '2–3 weeks',
    model: 'Fixed-fee diagnostic',
    metric: 'Recoverable revenue, ranked',
    proof: null,
  },
  {
    id: 'intent-sprint',
    principle: 'Intent decays in minutes, so recovery has to fire while it’s still warm.',
    catch: 'Not every failure deserves a nudge: a transient error needs a retry, a hard decline needs a human.',
    cat: 'recover',
    code: '02',
    name: 'Recover high-intent customers',
    official: 'Intent-to-Conversion Sprint',
    line: 'Win back customers who showed intent but didn’t buy — and prove it with a holdout.',
    flow: ['High-intent signal', 'Friction detected', 'Intervention fires', 'Holdout measures lift'],
    gets: ['One live journey, from signal to measured action', 'Search, cart or payment recovery logic (as scoped)', 'Suppression rules and human hand-off', 'A holdout-based result readout'],
    needs: ['Event, checkout and payment data', 'One owner for the intervention surface'],
    first: '4–8 weeks',
    model: 'Fixed-fee project',
    metric: 'Incremental conversion',
    proof: 'Checkout success 77.2% → 89.7% at a Series C online pharmacy',
  },
  {
    id: 'lifecycle-sprint',
    principle: 'Customers have a rhythm. Reach them as it closes, not on your campaign calendar.',
    catch: 'The reminder that lifts repeat buyers can erode margin on new ones, so customer state decides the action.',
    cat: 'grow',
    code: '03',
    name: 'Bring customers back before they disappear',
    official: 'Lifecycle Revenue Sprint',
    line: 'Systems for repeat purchase, retention and reactivation — timed to real behaviour.',
    flow: ['Lifecycle state', 'Trigger logic', 'Next-best action', 'Measured outcome'],
    gets: ['Lifecycle states and trigger rules', 'Next-best-action workflows', 'Suppression and frequency guardrails', 'A measurement plan with holdout'],
    needs: ['Customer and order history', 'Access to your CRM or lifecycle tools'],
    first: '4–8 weeks',
    model: 'Fixed-fee project',
    metric: 'Repeat purchase rate',
    proof: '~1,100 repeat orders a day at a Series C online pharmacy',
  },
  {
    id: 'data-foundation',
    principle: 'A decision is only as good as the identity behind it.',
    catch: 'Most “missing data” is really duplicate identity: one customer split across sessions, devices and orders.',
    cat: 'foundation',
    code: '04',
    name: 'Turn customer signals into opportunities',
    official: 'Customer Data & Intelligence Foundation',
    line: 'Connect fragmented data into one trusted view of the customer — ready to act on.',
    flow: ['Sources unified', 'Identity stitched', 'State + signals modelled', 'Opportunities scored'],
    gets: ['Identity resolution across sessions, devices and orders', 'Event schema and quality monitoring', 'Customer state and signal models', 'Source-of-truth governance'],
    needs: ['Access to event, order and CRM sources', 'A named data owner'],
    first: '6–10 weeks',
    model: 'Milestone-based',
    metric: 'Identity accuracy, signal precision',
    proof: null,
  },
  {
    id: 'ops-systems',
    principle: 'Operational events are revenue events nobody labelled.',
    catch: 'A delayed order is a support ticket in waiting. Routing it early costs less than resolving it later.',
    cat: 'recover',
    code: '05',
    name: 'Turn missed opportunities into action',
    official: 'Commercial Operations Systems',
    line: 'Connect payments, fulfilment, support and returns to revenue workflows.',
    flow: ['Operational event', 'Customer impact checked', 'Routed to an owner', 'Recovery action'],
    gets: ['Exception queues for payments, fulfilment and support', 'Event-driven integrations and alerts', 'Human-in-the-loop hand-offs', 'Operational leakage tracking'],
    needs: ['Access to ops and support systems', 'An owner for each workflow'],
    first: '6–12 weeks',
    model: 'Transformation project',
    metric: 'Operational leakage',
    proof: 'Support resolution time −30% at a Series C online pharmacy',
  },
  {
    id: 'partnership',
    principle: 'Systems drift. Learning has to be scheduled.',
    catch: 'Attribution flatters activity. Only a holdout shows what you actually created.',
    cat: 'operate',
    code: '06',
    name: 'Know what actually creates incremental revenue',
    official: 'Continuous Systems Partnership',
    line: 'I keep your systems measured, monitored and improving — month after month.',
    flow: ['Monitor health', 'Run experiments', 'Read holdouts', 'Tune and expand'],
    gets: ['Workflow health monitoring', 'Holdout and cohort analysis', 'New signal engineering', 'A monthly decision review'],
    needs: ['A named business owner', 'Ongoing data access'],
    first: 'Monthly, ongoing',
    model: 'Monthly retainer',
    metric: 'Incremental revenue',
    proof: null,
  },
]

// ═══════════ HOME ═══════════
// Home-page content: benefit strip, symptom router, run demo, stack grid.

export const demos = [
  {
    id: 'audit', tab: 'Audit',
    ask: '“Where is our customer journey losing revenue?”',
    systems: ['Analytics', 'Orders', 'Payments'],
    log: ['Mapping the journey: 8 stages, 5 systems', 'Testing data trust at each stage', 'Sizing leakage and ranking by value'],
    done: 'Opportunity queue ready',
    stats: [{ k: 'Findings', v: '14' }, { k: 'Ranked', v: '5' }, { k: 'Roadmap', v: '90 days' }],
    insight: 'The biggest leak sits between payment and fulfilment, in a step no one owns.',
  },
  {
    id: 'recover', tab: 'Recover',
    ask: '“Recover customers whose payment failed.”',
    systems: ['Checkout events', 'Gateway', 'Support'],
    log: ['Classifying failures: transient or hard', 'Rule set: retry once, assist if cart > ₹5,000', 'Holding out 10% as a control'],
    done: 'Live on one surface',
    stats: [{ k: 'Rule set', v: 'v1' }, { k: 'Holdout', v: '10%' }, { k: 'Guardrail', v: 'Refunds' }],
    insight: 'Retries fire only on transient errors. Hard declines go to a person.',
  },
  {
    id: 'retain', tab: 'Retain',
    ask: '“Bring customers back before they lapse.”',
    systems: ['Orders', 'CRM', 'Channels'],
    log: ['Deriving each customer’s reorder cycle', 'Checking consent, frequency and quiet hours', 'Timing the nudge to the cycle close'],
    done: 'Reminder queue ready',
    stats: [{ k: 'States', v: '3' }, { k: 'Suppressed', v: 'By rule' }, { k: 'Holdout', v: '10%' }],
    insight: 'Timing follows each customer’s cycle, not the campaign calendar.',
  },
  {
    id: 'measure', tab: 'Measure',
    ask: '“Prove what actually created revenue.”',
    systems: ['Holdout', 'Cohorts', 'Experiments'],
    log: ['Comparing treated against never-contacted', 'Separating attributed from incremental', 'Checking guardrail metrics'],
    done: 'Scorecard published',
    stats: [{ k: 'Attributed', v: '+4.1pp' }, { k: 'Incremental', v: '+1.5pp' }, { k: 'Confidence', v: '95%' }],
    insight: 'Attribution counts every conversion after a message. The holdout counts only what the message caused.',
  },
]

// Examples only — we are tech-agnostic and design around what you already run.

export const problems = [
  {
    id: 'conversion', name: 'Conversion leakage',
    title: '“Plenty of intent, too few orders.”',
    line: 'Demand is lost between search and payment.',
    looks: 'Zero-result searches, out-of-stock products, abandoned carts, failed payments.',
    costs: 'Revenue lost at the moment of highest intent.',
    offer: 'intent-sprint',
  },
  {
    id: 'lifecycle', name: 'Lifecycle leakage',
    title: '“Customers buy once, then go quiet.”',
    line: 'Retention is generic, mistimed or missing.',
    looks: 'One-size campaigns, missed reorder windows, no reactivation logic.',
    costs: 'Repeat revenue and customer lifetime value.',
    offer: 'lifecycle-sprint',
  },
  {
    id: 'signals', name: 'Signal fragmentation',
    title: '“Our numbers differ in every tool.”',
    line: 'Behaviour, orders and support never meet.',
    looks: 'Behaviour in analytics, orders in commerce, tickets in support — nothing connected.',
    costs: 'Slow, partial decisions on every journey.',
    offer: 'data-foundation',
  },
  {
    id: 'execution', name: 'Execution inefficiency',
    title: '“We hear about problems from customers first.”',
    line: 'Monitoring is manual, owners are unclear.',
    looks: 'Manual checks, slow detection, no owner for the exception.',
    costs: 'Operational leakage and avoidable support load.',
    offer: 'ops-systems',
  },
  {
    id: 'measurement', name: 'Measurement failure',
    title: '“We can’t tell what actually moved revenue.”',
    line: 'Activity gets reported. Impact doesn’t.',
    looks: 'Open rates and attribution disputes instead of incremental impact.',
    costs: 'Budget spent on things that don’t move revenue.',
    offer: 'partnership',
  },
]

// Failure-mode taxonomy matches the Finding Card standard: Data, Identity, Friction, Timing, Routing, Decision.

export const journey = [
  { id: 'search', label: 'Search', mode: 'Friction', breaks: 'Zero-result or broken queries send high-intent users away.', sees: 'Zero-result and exit rates by query.', does: 'Offers an in-stock alternative in the same session.' },
  { id: 'discovery', label: 'Discovery', mode: 'Decision', breaks: 'Results load, but nothing relevant is surfaced.', sees: 'Refinement loops and exits after result views.', does: 'Re-ranks and surfaces closer matches.' },
  { id: 'availability', label: 'Availability', mode: 'Data', breaks: 'Demand meets stock that is missing or out of sync.', sees: 'Live catalogue availability compared with demand.', does: 'Suggests a substitute, or notifies when it’s back.' },
  { id: 'product', label: 'Product', mode: 'Friction', breaks: 'Price, information or trust doubts stall the decision.', sees: 'Repeat views with no add to cart.', does: 'Answers the doubt, or hands off to assisted help.' },
  { id: 'cart', label: 'Cart', mode: 'Timing', breaks: 'Carts are left behind and recovery is generic or late.', sees: 'Cart age, value and history by cohort.', does: 'Times one relevant nudge — unless suppression says stay quiet.' },
  { id: 'checkout', label: 'Checkout', mode: 'Friction', breaks: 'Form, address or coupon errors cause drop-offs.', sees: 'Step-level drop-off by cohort and device.', does: 'Fixes the step and targets help to affected users.' },
  { id: 'payment', label: 'Payment', mode: 'Routing', breaks: 'Every failure is treated alike, transient or hard.', sees: 'Gateway responses classified as they arrive.', does: 'Retries or reroutes; escalates high-value users to support.' },
  { id: 'fulfilment', label: 'Fulfilment', mode: 'Routing', breaks: 'Delays and cancellations surface after the customer has gone.', sees: 'Operational events matched to customer state.', does: 'Opens a recovery action and a queue for ops.' },
]

export const whyUs = [
  { n: '01', t: 'Truth before automation', d: 'I don’t automate assumptions. I engineer from commercial truth.' },
  { n: '02', t: 'Evidence-first', d: 'Every opportunity carries evidence, confidence, an owner and an expected value.' },
  { n: '03', t: 'Systems over campaigns', d: 'I build operating infrastructure, not one-off blasts.' },
  { n: '04', t: 'Outcome ownership', d: 'I measure incremental impact with holdouts, not activity.' },
  { n: '05', t: 'Human in the loop', d: 'Governed, not unchecked. Inaction is a valid decision.' },
  { n: '06', t: 'Architecture-led, tech-agnostic', d: 'I design around your business, not around a tool.' },
]

export const phases = [
  {
    id: 'diagnose', label: 'Diagnose', weeks: 'Weeks 1–3', start: 0, span: 3,
    does: 'Map the journey, test data trust, find and size the leaks.',
    you: 'Share data access under a signed agreement. One working session.',
    out: 'Finding cards and a prioritised opportunity queue',
  },
  {
    id: 'design', label: 'Design', weeks: 'Week 4', start: 3, span: 1,
    does: 'Specify the intervention, suppression rules, owner and holdout.',
    you: 'Choose the first opportunity and name its owner.',
    out: 'A signed-off pilot proposal',
  },
  {
    id: 'build', label: 'Build', weeks: 'Weeks 5–8', start: 4, span: 4,
    does: 'Implement schemas, workflow logic and the decision engine.',
    you: 'Keep access unblocked. Approve rules and messages.',
    out: 'A working system with a decision trace',
  },
  {
    id: 'prove', label: 'Activate + prove', weeks: 'Weeks 9–12', start: 8, span: 4,
    does: 'Go live with guardrails, run the holdout, read the result.',
    you: 'A short weekly review.',
    out: 'A measured incremental result',
  },
]

export const shapes = [
  {
    id: 'audit', label: 'Audit', length: '2–3 weeks', model: 'Fixed-fee diagnostic',
    bar: { start: 0, span: 3 },
    best: 'You suspect leakage but can’t size it or rank the fixes.',
    gets: ['Leak map', 'Finding cards', '90-day roadmap'],
  },
  {
    id: 'sprint', label: 'Systems sprint', length: '4–8 weeks', model: 'Fixed-fee project',
    bar: { start: 3, span: 6 },
    best: 'You know the problem and want one system live and measured.',
    gets: ['One live system', 'Holdout result', 'Handover docs'],
  },
  {
    id: 'build', label: 'Foundation / ops build', length: '6–12 weeks', model: 'Milestone-based',
    bar: { start: 2, span: 9 },
    best: 'Your data, identity or operational workflows need fixing first.',
    gets: ['Identity + event layer', 'Exception workflows', 'Quality controls'],
  },
  {
    id: 'partnership', label: 'Partnership', length: 'Monthly, ongoing', model: 'Monthly retainer',
    bar: { start: 8, span: 4 },
    best: 'You want systems monitored, tuned and extended.',
    gets: ['Health monitoring', 'Experiments', 'Monthly decision review'],
  },
]

export const guardrails = [
  { t: 'Least-privilege access', d: 'A signed data-sharing agreement first. Minimum permissions, always.' },
  { t: 'Provenance on everything', d: 'Every finding and decision records its source, date and confidence.' },
  { t: 'No writes without a way back', d: 'Nothing reaches production without an owner and a rollback path.' },
  { t: 'Incrementality or it didn’t happen', d: 'No revenue claim without a holdout that was never contacted.' },
]

export const aiBoundary = {
  fixed: ['Data ingestion and sanitising', 'Identity resolution', 'Lifecycle state and eligibility', 'Consent and suppression', 'Holdouts and attribution', 'Every production write'],
  llm: ['Parsing support text', 'Intent and tone extraction', 'Taxonomy suggestions', 'Explaining friction', 'Summarising ambiguous cases'],
}

export const faqs = [
  { q: 'Do we need to replace our tools?', a: 'No. I’m architecture-led and tech-agnostic. I design around your business and connect what you already run.' },
  { q: 'Will AI act on our customers without approval?', a: 'No. Commercial truth stays deterministic. AI handles bounded, explainable tasks only, and nothing is written to production without an owner and a rollback path.' },
  { q: 'How do you prove it worked?', a: 'Every claim is tested against a holdout: a group I deliberately don’t contact. No holdout, no claim of lift.' },
  { q: 'What do we share before the audit?', a: 'A signed data-sharing agreement, then minimum-necessary access to analytics, order and event data.' },
  { q: 'Does this replace our growth or CRM team?', a: 'No. I build the layer between your systems and your team’s decisions, so they act faster and with evidence.' },
]

// Answers for the decision page — modelled on the eligibility-style FAQ pattern.

export const versus = {
  rivals: [
    { id: 'agency', label: 'Performance agencies', eg: 'The agency running your Meta and Google ads', head: 'They buy the click.', accent: 'I fix what happens after it.',
      rows: [['Where they focus', 'Media spend, creatives and ROAS', 'Everything after the click: search, cart, payment, reorder'], ['How success is proven', 'Platform-attributed conversions', 'Incremental lift against a holdout that never saw the change'], ['What compounds', 'Results stop when the spend stops', 'Systems keep running on your stack after I hand over']],
      together: 'Keep your agency for acquisition. I make every customer they bring in worth more.' },
    { id: 'engage', label: 'Engagement platforms', eg: 'CleverTap, MoEngage, WebEngage, Braze', head: 'They send the message.', accent: 'I decide if it should be sent.',
      rows: [['What you get', 'Journeys, templates and channels', 'Decision logic: who, when, which channel — and who to leave alone'], ['Who builds it', 'Your CRM team, one campaign at a time', 'Signals, rules and suppression engineered once, reused everywhere'], ['How success is proven', 'Opens, clicks and attributed conversions', 'Revenue against a holdout']],
      together: 'I build on the platform you already pay for. No migration.' },
    { id: 'analytics', label: 'Analytics tools', eg: 'Mixpanel, Amplitude, GA4', head: 'They show where users drop.', accent: 'I make the system act on it.',
      rows: [['What you get', 'Funnels, cohorts and dashboards', 'A ranked list of leaks in ₹, each with an owner and an action'], ['Who acts on it', 'Whoever has time after the weekly review', 'An automated, governed intervention'], ['How success is proven', 'The next dashboard', 'A holdout readout']],
      together: 'Your analytics becomes the sensor. I build what responds to it.' },
    { id: 'consult', label: 'Strategy consultancies', eg: 'Big-4 and strategy firms', head: 'They hand over a deck.', accent: 'I hand over a running system.',
      rows: [['What you get', 'Recommendations and a roadmap', 'The roadmap, and the first system live on your stack'], ['Who does the work', 'Analysts, then your team', 'The person who diagnoses it builds it'], ['How long it takes', 'Months of discovery', '2–3 weeks to a ranked plan, weeks to a live system']],
      together: 'If you already have a strategy, I turn it into running systems.' },
    { id: 'outbound', label: 'GTM / Clay agencies', eg: 'Outbound and lead-generation GTM engineers', head: 'They fill B2B pipelines.', accent: 'I grow consumer revenue.',
      rows: [['Who they target', 'Accounts and buying committees', 'Shoppers, subscribers and repeat buyers'], ['What they build', 'Lead lists, enrichment and sequences', 'Recovery, lifecycle and decision systems inside your product'], ['What they measure', 'Meetings booked', 'Incremental revenue per customer']],
      together: 'Same GTM-engineering discipline, applied to consumer journeys.' },
    { id: 'inhouse', label: 'Hiring in-house', eg: 'A growth engineer or a data team', head: 'Months to hire.', accent: 'Weeks to a working system.',
      rows: [['Time to value', 'Hiring, onboarding, then discovery', 'A ranked plan in 2–3 weeks'], ['Breadth', 'One person, one specialism', 'Data, decisions, activation and measurement together'], ['What stays', 'Knowledge leaves when people do', 'Documented, versioned systems your team can run']],
      together: 'I can build it, then hand it to the team you hire.' },
  ],
}

// "Who it's for" — industry tabs.

export const verticals = [
  { id: 'ecom', label: 'Ecommerce & D2C', line: 'High traffic and thin margins — every failed checkout and one-time buyer costs twice.',
    leaks: [['Checkout drop-off', 'Address, coupon and form errors between cart and payment.'], ['Payment failures', 'UPI and card failures treated alike, with no retry or reroute.'], ['Cash-on-delivery returns', 'COD orders never confirmed, coming back as RTO.'], ['One-and-done buyers', 'First orders that never get a well-timed second nudge.']],
    offer: 'intent-sprint', measure: ['Checkout success', 'RTO rate', 'Repeat rate'] },
  { id: 'health', label: 'Healthtech & e-pharmacy', line: 'Repeat need is built in — the leak is timing, availability and trust.',
    leaks: [['Missed refills', 'Reorder windows that pass without a timely reminder.'], ['Out of stock, no substitute', 'Demand that meets missing stock and no alternative.'], ['Verification drop-offs', 'Prescription or document steps that stall the order.'], ['Support-driven churn', 'Order issues that reach customers before they reach a queue.']],
    offer: 'lifecycle-sprint', measure: ['Refill rate', 'Fill rate', 'Repeat purchase'] },
  { id: 'market', label: 'Marketplaces', line: 'Two sides of supply and demand — twice the places for intent to slip.',
    leaks: [['Zero-result searches', 'Queries that return nothing relevant, or nothing at all.'], ['Listings that never convert', 'Views without orders because of price, trust or stock gaps.'], ['Fulfilment exceptions', 'Delays and cancellations that nobody owns.'], ['Browsers who never return', 'High-intent visitors with no follow-up at all.']],
    offer: 'intent-sprint', measure: ['Search-to-order', 'Cancellation rate', 'Return visits'] },
  { id: 'subs', label: 'Subscriptions', line: 'Revenue is recurring — until a renewal silently fails.',
    leaks: [['Failed renewals', 'Payment failures on renewal with no smart retry.'], ['Silent churn', 'Engagement drops weeks before anyone presses cancel.'], ['Exits with no save', 'Pause or cancel flows that never offer the right alternative.'], ['Missed upgrade moments', 'Usage signals that never turn into an offer.']],
    offer: 'lifecycle-sprint', measure: ['Renewal rate', 'Involuntary churn', 'Net revenue retention'] },
  { id: 'apps', label: 'Consumer apps & fintech', line: 'Most value is lost between sign-up and the first real action.',
    leaks: [['Onboarding and KYC drop-off', 'Steps that ask for too much, too early.'], ['Activation stalls', 'Users who sign up but never reach the first value moment.'], ['Dormant users', 'Accounts that go quiet with no reactivation logic.'], ['Signals in silos', 'Product, CRM and support data that never meet.']],
    offer: 'data-foundation', measure: ['Activation rate', 'Day-30 retention', 'Reactivation'] },
]

export const fitCheck = {
  good: ['You sell to consumers online, at real transaction volume', 'You can share read-only data under a signed agreement', 'Someone owns growth, CRM or product and can act on findings', 'You’re willing to hold back a small group to prove what worked'],
  not: ['Ads bought or campaigns run', 'Cold email, lead lists or AI SDRs', 'Only a CRM or tool set up', 'A dashboard instead of a decision', 'Results you never measure'],
}

// Final "next steps" band.

export const toolCats = [
  { id: 'commerce', label: 'Commerce & orders', tone: '#7fb8a6' },
  { id: 'payments', label: 'Payments', tone: '#9d92f5' },
  { id: 'engage', label: 'Engagement & CRM', tone: '#ea957d' },
  { id: 'messaging', label: 'Messaging & voice', tone: '#6fb1e0' },
  { id: 'analytics', label: 'Analytics', tone: '#e0b45f' },
  { id: 'data', label: 'Data & warehouse', tone: '#a3a6b1' },
  { id: 'support', label: 'Support', tone: '#d38fb8' },
  { id: 'ai', label: 'AI & automation', tone: '#8fcf7a' },
]

export const tools = [
  ['Shopify', 'commerce', 'Order, cart and checkout events'], ['WooCommerce', 'commerce', 'Store and order webhooks'], ['Unicommerce', 'commerce', 'Order and fulfilment status'], ['Shiprocket', 'commerce', 'Delivery, NDR and RTO signals'],
  ['Razorpay', 'payments', 'Payment failure codes and retries'], ['Cashfree', 'payments', 'Payment and refund events'], ['PayU', 'payments', 'Gateway outcomes by method'], ['Juspay', 'payments', 'Payment routing and fallbacks'], ['Stripe', 'payments', 'Subscriptions and failed renewals'],
  ['CleverTap', 'engage', 'Segments, journeys and suppression'], ['MoEngage', 'engage', 'Lifecycle triggers and campaigns'], ['WebEngage', 'engage', 'Journeys driven by my decisions'], ['Braze', 'engage', 'Canvas steps and frequency caps'], ['Klaviyo', 'engage', 'Flows for repeat purchase'], ['HubSpot', 'engage', 'Contact and lifecycle records'],
  ['WhatsApp', 'messaging', 'WhatsApp Business messages and replies'], ['Gmail', 'messaging', 'Email triggers, replies and follow-ups'], ['Gupshup', 'messaging', 'WhatsApp and SMS delivery'], ['Interakt', 'messaging', 'WhatsApp templates and replies'], ['WATI', 'messaging', 'WhatsApp journeys'], ['Twilio', 'messaging', 'SMS and programmable voice'], ['Exotel', 'messaging', 'Voice calls and IVR'],
  ['Mixpanel', 'analytics', 'Funnels, cohorts and events'], ['Amplitude', 'analytics', 'Behavioural cohorts'], ['Google Analytics 4', 'analytics', 'Web and app journeys'], ['PostHog', 'analytics', 'Product events and flags'],
  ['Clay', 'data', 'Enrichment and GTM workflows'], ['Segment', 'data', 'Event collection and routing'], ['RudderStack', 'data', 'Warehouse-first event pipelines'], ['BigQuery', 'data', 'The source of truth for signals'], ['Snowflake', 'data', 'Customer and order models'], ['PostgreSQL', 'data', 'Operational state and queues'], ['dbt', 'data', 'Tested, versioned data models'], ['Metabase', 'data', 'Holdout readouts and queues'],
  ['Zendesk', 'support', 'Tickets as signals and suppression'], ['Freshdesk', 'support', 'Ticket categories and SLAs'], ['Gorgias', 'support', 'Order-linked support context'],
  ['Claude', 'ai', 'Bounded text understanding'], ['OpenAI', 'ai', 'Classification and summaries'], ['n8n', 'ai', 'Workflow orchestration'], ['Zapier', 'ai', 'Light glue between tools'], ['Make', 'ai', 'Multi-step automations'], ['Python', 'ai', 'Models, scoring and jobs'],
].map(([name, cat, does]) => ({ name, cat, does }))

// The core stack — shown first in the catalogue and in the tile arc, in this order.

export const coreStack = ['n8n', 'Shopify', 'Cashfree', 'CleverTap', 'Mixpanel', 'Amplitude', 'Clay', 'WhatsApp', 'Gmail', 'OpenAI', 'Claude', 'Metabase']

// Official logos for tools that the open-source icon set doesn't include. Paste the brand's
// official SVG markup (from its press kit) between the backticks; leave empty to show a monogram.

export const track = [
  ['Series C online pharmacy', 'Built in-house, 2023 – 2026'],
  ['Two product pods', '12 engineers across payments and portals'],
  ['10 connected systems', 'From acquisition to retention'],
]

// "Pick the sentence that sounds like your week." Each symptom points at the leak behind it and the offer to start with.
export const symptoms = [
  { q: '“Cart abandonment keeps creeping up.”', leak: 'Conversion leakage', check: ['Cart-to-checkout drop by cohort', 'Payment and gateway failure codes', 'Time to recovery, by channel'], offer: 'intent-sprint' },
  { q: '“Repeat purchase is flat, even though we send more.”', leak: 'Lifecycle leakage', check: ['Reorder cycle by cohort', 'Message frequency against response', 'Gaps in suppression rules'], offer: 'lifecycle-sprint' },
  { q: '“Our numbers differ in every tool.”', leak: 'Signal fragmentation', check: ['Identity match across sessions and orders', 'Event schema drift', 'Who owns the source of truth'], offer: 'data-foundation' },
  { q: '“We hear about problems from customers first.”', leak: 'Execution inefficiency', check: ['Payment, fulfilment and support event flow', 'Detection lag per exception', 'An owner for each exception'], offer: 'ops-systems' },
  { q: '“We can’t prove the campaigns worked.”', leak: 'Measurement failure', check: ['Whether a holdout exists', 'Attributed against incremental lift', 'Guardrail metrics'], offer: 'partnership' },
  { q: '“We don’t know where to start.”', leak: 'Unsized leakage', check: ['Journey and funnel map', 'Data trust at each stage', 'Value of every leak'], offer: 'revenue-audit' },
]
