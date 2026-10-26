// Page copy for the portfolio. Voice: first person, plain, verb-first headings, `*asterisks*` mark the highlighted words.
// The story, in order: Proof (Work) → Practice (GTM & RevOps) → System (ROQIVA) → Path (Journey) → Person (Beyond) → Fit (Hire).
// Every page ends by handing over to the next one (see `pager`).

import { site } from './site.js'

// ═══════════ The story pager ═══════════
// `from` is the page the visitor is on; the card names the page that comes next and why it follows.
export const pager = {
  '/work': { to: '/gtm', kicker: 'Next · Practice', title: 'Turn the pattern into *an offer.*', d: 'Seven fixes, one pattern: find the leak, fix the loop, prove the lift. GTM engineering and RevOps is that pattern, written down for other teams.' },
  '/gtm': { to: '/roqiva', kicker: 'Next · System', title: 'Build the system that *does it for you.*', d: 'Doing this by hand is slow and it lives in one head. ROQIVA is the system I am building so the loop runs with evidence, gates and a person who decides.' },
  '/roqiva': { to: '/journey', kicker: 'Next · Path', title: 'Follow the path that *led here.*', d: 'A system like this comes from somewhere. From dealer networks and campaigns, through payments and growth, to building ROQIVA.' },
  '/journey': { to: '/beyond', kicker: 'Next · Person', title: 'Meet the person *behind the work.*', d: 'A path is also a person. Karts, techno, long drives and good food, and why they matter to how I build.' },
  '/beyond': { to: '/hire', kicker: 'Next · Fit', title: 'See where I *fit on your team.*', d: 'That is the work, the system and the person. Here is the seat I would take, and how to start a conversation.' },
  '/hire': { to: '/contact', kicker: 'Next · Talk', title: 'Start *a conversation.*', d: 'A role, a GTM or RevOps engagement, or ROQIVA. Send a short brief or book a time.' },
}

// ═══════════ Home ═══════════
export const home = {
  hero: {
    eyebrow: 'Anjor Tank · Product architect · Mumbai',
    title: 'I find the revenue *leaking between your systems.* Now I am building ROQIVA to fix it.',
    lead: 'From campaigns and dealer networks to payments, growth and platform product. I have owned checkout, coupons, search and internal tools from problem to measured result. ROQIVA is the governed system I am building from that work, and I am its founder.',
    primary: { label: 'See the system I am building', to: '/roqiva' },
    secondary: { label: 'Read the proof', to: '/work' },
    facts: ['Product Manager · GNC India', 'Founder · ROQIVA, in development', 'Mumbai · remote'],
  },
  proof: {
    eyebrow: 'The numbers',
    title: 'Start with *four numbers I can explain.*',
    lead: 'Each one has a case study behind it: what was broken, what I decided, what shipped and what I would change.',
    link: ['Read all seven cases', '/work'],
  },
  fit: {
    eyebrow: 'Where I fit',
    title: 'Pick *the seat you need.*',
    lead: 'Six seats I can sit in, and what I would bring to each. I am at my best where they overlap.',
    link: ['See results and experience', '/hire'],
  },
  thread: {
    eyebrow: 'One story',
    title: 'Fix it by hand. Write the method down. *Build the system.*',
    lead: 'This site is one argument in three steps. Scroll through it, then open whichever step you care about.',
    steps: [
      { id: 'th-work', n: '01', eyebrow: 'Proof', title: 'Fix it *by hand.*', lead: 'At Truemeds I owned seven systems from the first problem to a measured result: a checkout that locks the price, a coupon engine, a substitution engine, growth loops, search, voice automation and internal ops.', link: ['Read the cases', '/work'] },
      { id: 'th-gtm', n: '02', eyebrow: 'Practice', title: 'Write the method *down.*', lead: 'Every fix followed the same four moves. I turned them into GTM engineering and RevOps work for other consumer teams: five leaks, six offers, one process, and a holdout for every claim.', link: ['See GTM and RevOps', '/gtm'] },
      { id: 'th-roq', n: '03', eyebrow: 'System', title: 'Build the system *that does it.*', lead: 'Doing this by hand lives in one head. ROQIVA is the system I am building so the loop runs with evidence, four human gates and no writes to your live tools.', link: ['Explore ROQIVA', '/roqiva'] },
    ],
  },
  roqiva: {
    eyebrow: 'The system I am building · In development',
    title: 'ROQIVA turns the signals your tools capture *into decisions a person approves.*',
    lead: 'Detectors find the data no decision reads. Agents draft the fix. People decide at four gates. It runs inside the brand’s own stack and writes nothing to a live tool. I am building it as a founder, and a company comes next.',
    primary: { label: 'Open the ROQIVA page', to: '/roqiva' },
    explore: 'Open a section',
  },
  gtm: {
    eyebrow: 'GTM engineering and RevOps',
    title: 'Five ways revenue leaks. *One method to close each.*',
    lead: 'Most leaks sit between systems that nobody owns. These are the five I look for first, and the offer that closes each.',
    link: ['See the full practice', '/gtm'],
  },
  work: {
    eyebrow: 'Work',
    title: 'Seven systems, *each with the numbers.*',
    lead: 'Every case starts with the hook and ends with what I would do differently.',
    link: ['See all cases', '/work'],
  },
  journey: {
    eyebrow: 'Journey',
    title: 'Three chapters, *one direction.*',
    lead: 'Learn how demand is made. Ship the systems underneath it. Build the system that runs them.',
    link: ['Follow the journey', '/journey'],
  },
  cta: {
    title: 'Bring me a number *that will not move.*',
    lead: 'For a role, a GTM or RevOps engagement, or to follow ROQIVA. A short brief is enough.',
    primary: { label: 'Send a brief', to: '/contact#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
  },
}

// Where I fit: six seats, the proof behind each and where to start. Used on Home and on Hire.
export const fit = [
  { id: 'growth', seat: 'Growth PM', d: 'Referral, lifecycle, CMS and experimentation that growth can run without an engineering ticket.', proof: '6 → 13% referral share · ~1,100 repeat orders a day', start: 'Where growth waits on engineering.', case: 'growth-loops' },
  { id: 'payments', seat: 'Payments PM', d: 'Checkout, price integrity, payment adoption and what happens when a payment fails.', proof: '77.2 → 89.7% prepaid order-to-delivery', start: 'Where failures are treated alike.', case: 'price-lock-checkout' },
  { id: 'platform', seat: 'Platform PM', d: 'Rule engines, catalogues, portals and the internal tools behind a consumer product.', proof: '45+ coupon combinations · 70,000+ SKUs re-indexed', start: 'Where operators work from spreadsheets.', case: 'sku-substitution-engine' },
  { id: 'ai', seat: 'AI PM', d: 'Automation and recommendation that start with the cheapest high-volume intent, and keep a person where it matters.', proof: '−20% cost per order · +11% substitution acceptance', start: 'Where cost follows volume, not complexity.', case: 'ai-automation' },
  { id: 'gtm', seat: 'GTM engineer · RevOps', d: 'Signals, rules and suppression engineered once and reused, with every claim measured against a holdout.', proof: 'Five leaks, six offers, one process', start: 'Where the numbers differ in every tool.', to: '/gtm' },
  { id: 'founding', seat: 'Founding product', d: 'Zero to one in a small team: the problem, the architecture, the build and the measurement, owned end to end.', proof: 'ROQIVA, a system in development', start: 'Where the product does not exist yet.', to: '/roqiva' },
]

// ═══════════ Work ═══════════
export const work = {
  hero: {
    eyebrow: 'Proof · The cases',
    title: 'Read seven systems *I owned end to end.*',
    lead: 'Payments, growth, search, AI and operations at a Series C online pharmacy. Each case follows the same shape, and each failure shape is one that ROQIVA is designed to watch for.',
    facts: ['Truemeds · Dec 2023 – Jul 2026', 'Two pods · 12 engineers', 'Five systems built 0-to-1'],
  },
  list: { eyebrow: 'The cases', title: 'Choose *a system to open.*', lead: 'Filter by area. Each card shows the three numbers that moved.' },
  bridge: {
    eyebrow: 'The through-line',
    title: 'Every case became *a check inside ROQIVA.*',
    lead: 'The cases are real. The checks are the design intent of the system I am building: the failure shape from each case, written as something a detector can look for.',
    cols: ['Case', 'The failure shape', 'In ROQIVA'],
    link: ['See ROQIVA’s design', '/roqiva'],
  },
  how: {
    eyebrow: 'How a case reads',
    title: 'Every case follows *the same eight steps.*',
    lead: 'The hook, the context, the problem, what made it hard, the decision, what was built, what changed, and what I would do differently.',
  },
}

// ═══════════ GTM engineering and RevOps ═══════════
export const gtmPage = {
  hero: {
    eyebrow: 'Practice · GTM engineering and RevOps',
    title: 'Find the leak. *Fix the loop.* Prove the lift.',
    lead: 'Revenue operations and GTM engineering for consumer commerce, taken from systems I ran in production. I look for the revenue that leaks between your tools, build the fix, and measure the lift against a holdout.',
    primary: { label: 'Bring me a number', to: '/contact?intent=consult#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
    facts: ['Ecommerce and D2C', 'Healthtech', 'Marketplaces', 'Subscriptions'],
  },
  nav: [
    { id: 'leaks', label: 'Five leaks' },
    { id: 'journey', label: 'The journey' },
    { id: 'offers', label: 'Six offers' },
    { id: 'process', label: 'The process' },
    { id: 'rules', label: 'The rules' },
    { id: 'stack', label: 'The stack' },
    { id: 'faq', label: 'Questions' },
  ],
  why: {
    eyebrow: 'Why it works',
    title: 'Five principles *the work follows.*',
    lead: 'They are the same rules ROQIVA is built on, because they came from the same place.',
  },
  leaks: { eyebrow: 'What I solve', title: 'Name *the leak first.*', lead: 'Five ways consumer revenue slips away. Pick the sentence you recognise.' },
  journey: { eyebrow: 'Where it breaks', title: 'Walk *eight stages of the journey.*', lead: 'From search to fulfilment. For each stage: what breaks, what I look at, and what the fix does.' },
  offers: { eyebrow: 'What I offer', title: 'Six offers, *one ladder.*', lead: 'Start with the audit. Each step after it is a fixed-scope piece of work with a defined output, a timeline and a model.' },
  process: { eyebrow: 'How it runs', title: 'Four phases, *from diagnosis to a running system.*', lead: 'What happens, what I need from you, and what you get at the end of each phase.' },
  shapes: { eyebrow: 'Engagement shapes', title: 'Choose *how to work together.*' },
  rules: { eyebrow: 'The guardrails', title: 'Hold the work to *four rules.*', lead: 'Least privilege, provenance, a way back, and a holdout. And a clear line on where AI is allowed to act.' },
  stack: { eyebrow: 'The stack', title: 'Build on *the tools you already run.*', lead: 'No rip and replace. These are the commerce, payments, engagement, analytics, data, support and AI tools I engineer on.' },
  versus: { eyebrow: 'How it differs', title: 'Compare *with the usual options.*', lead: 'Pick what you use today. What it does, what I do, and how they work together.' },
  proof: {
    eyebrow: 'Proof',
    title: 'It comes from *systems that ran in production.*',
    lead: 'Not a framework from a deck. The offers above are the shape of the work I did at Truemeds.',
    link: ['Read the cases behind it', '/work'],
  },
  faq: { eyebrow: 'Questions', title: 'Ask *before you ask me.*' },
  cta: {
    title: 'Size your leak *in a 30-minute call.*',
    lead: 'On your numbers, not a pitch. Tell me the metric that will not move and the tools that hold the data.',
    primary: { label: 'Bring me a number', to: '/contact?intent=consult#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
  },
}

// ═══════════ ROQIVA page: the Origin section is in roqiva.js ═══════════

// ═══════════ Journey ═══════════
export const journeyPage = {
  hero: {
    eyebrow: 'Path · Journey',
    title: 'Follow the path *that led to ROQIVA.*',
    lead: 'Three chapters: learn how demand is made, ship the systems underneath it, then build the system that runs them. Every role, with what I actually did.',
  },
  chapters: [
    { k: 'I', t: 'Learn how demand is made', span: '2021 – 2023', d: 'Dealer networks, landing pages and campaign targeting. Three roles that taught me what a customer does between an ad and an order.',
      lesson: 'Demand is made in the gap between an ad and an order, and that gap is full of systems nobody owns.',
      roles: [
        { when: 'May – Jun 2021', role: 'Digital Marketing and Web Development Intern', org: '9LedgePro · Microsoft Partner Network', text: 'Ran an SEO audit, shipped 30+ posts and 10 blogs, and set a 40/40/20 low-medium-high competition keyword mix.' },
        { when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst Advertising and Design · Goregaon', text: 'Primary contact for 15 Tata Motors dealers across Maharashtra. Wireframed 48 landing pages and a lead-management system, and planned about 100 campaigns.' },
        { when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India · Mumbai', text: 'Managed 6 clients across sectors, supported pitches that won new business and refined campaign targeting from consumer-behaviour data.' },
      ] },
    { k: 'II', t: 'Ship the systems underneath', span: 'Dec 2023 – Jul 2026', d: 'Two years and eight months at one company, owning five systems from first problem to measured result.',
      lesson: 'When scale breaks a product it rarely breaks at the interface. It breaks in the systems and workflows underneath.',
      roles: [
        { when: 'Dec 2023 – Jul 2026', role: 'Associate Product Manager', org: 'Truemeds · Mumbai', text: 'Co-managed two product pods of 12 engineers across payments and portals, with the engineering lead and a senior PM. Built five systems 0-to-1 and owned sprint planning, prioritisation, on-call rotation and delivery.',
          tags: ['Payments', 'Growth', 'Search', 'Internal tools', 'Operations'], to: '/work' },
      ] },
    { k: 'III', t: 'Build the system that runs them', span: '2026 – now', d: 'A product role at a consumer wellness brand, and ROQIVA, the system I am building and will found a company around.',
      lesson: 'The loop I ran by hand can be made repeatable, as long as a person still decides what changes the business.',
      roles: [
        { when: 'Oct 2026 – now', role: 'Product Manager', org: 'GNC India · OneGuardian Brands · Mumbai', text: 'Product manager at GNC India, the consumer wellness brand, across ecommerce, growth and the internal platforms behind them.', tags: ['Ecommerce', 'D2C', 'Growth', 'Platform'] },
        { when: '2026 – now', role: 'Founder', org: 'ROQIVA · in development', text: 'Designing and building ROQIVA, a governed revenue-operations system for commerce and D2C: detectors, agents, four human gates and a Brain per brand. A company will be formed around it.', tags: ['Product architecture', 'Agents', 'RevOps', 'GTM engineering'], to: '/roqiva' },
      ] },
  ],
  edu: { eyebrow: 'Education', title: 'Study *what I use.*' },
  certs: { eyebrow: 'Certifications', title: 'Keep *learning in public.*' },
  skills: { eyebrow: 'Skills', title: 'Name *what I am strongest at.*' },
  beliefs: { eyebrow: 'How I think', title: 'Hold *three beliefs about product.*', lead: 'They show up in every case, and in how ROQIVA is designed.' },
}

// ═══════════ Beyond work ═══════════
export const beyond = {
  hero: {
    eyebrow: 'Person · Beyond work',
    title: 'Meet the person *behind the work.*',
    lead: 'I build for people who buy things they care about, so I pay attention to what I care about. Karts, loud rooms, back roads and a good meal.',
  },
  groups: ['All', 'Wander', 'Speed', 'Live'],
  loves: { eyebrow: 'What I love', title: 'Notice *the things I notice.*', lead: 'Small, precise, well made. It is the same taste I bring to product.' },
}

// ═══════════ Hire ═══════════
export const hire = {
  hero: {
    eyebrow: 'Fit · Hire',
    title: 'Hire a product architect *who has run the whole loop.*',
    lead: 'I build the systems that turn customer signals into revenue. I find where revenue leaks, design the decision logic, wire it into the systems that act on it, and measure the lift with proper experiments.',
    primary: { label: 'Start a conversation', to: '/contact?intent=job#brief' },
    secondary: { label: 'LinkedIn', href: site.linkedin },
    open: { label: 'Open to', roles: ['Product Manager (growth, payments, platform, AI)', 'Product Architect or Technical Product Manager', 'GTM Engineer or revenue-systems roles'], where: 'India, or remote with US and global teams.' },
  },
  moves: {
    eyebrow: 'How I work',
    title: 'The same four moves, *every time.*',
    lead: 'Different problems, one pattern. It is why the results below look so different and read so alike.',
    items: [
      ['Find the leak', 'Funnel analysis, SQL and time with the warehouse and support teams, to see where revenue actually escapes.'],
      ['Design the rule', 'The decision logic written as states and exceptions an engineer can build, with the options I rejected on the page.'],
      ['Wire it in', 'The web, app, API and internal tool that act on the rule, owned end to end with the engineering lead.'],
      ['Prove the lift', 'Phased A/B releases against a baseline, then a write-up of what worked and what I would change.'],
    ],
  },
  wins: { eyebrow: 'Results', title: 'Twelve numbers *I can explain.*', lead: 'Across payments, search, growth, AI and operations. Each has a case study or a clear owner behind it, and none depends on a single project.' },
  fit: { eyebrow: 'Where I fit', title: 'Six seats, *and what I bring to each.*', lead: 'Choose one to see the proof behind it and where I would start.' },
  xp: { eyebrow: 'Experience', title: 'Where I have *done the work.*', lead: 'Newest first. The full story is on the journey page.' },
  strengths: ['Consumer product', 'Ecommerce and D2C', 'Growth product', 'RevOps', 'GTM engineering', 'Search and discovery', 'Checkout and payments', 'Retention and lifecycle', 'Fulfilment and logistics', 'CX', 'AI and automation', 'Product analytics', 'Experimentation', 'Revenue systems'],
  cta: {
    title: 'Let’s talk *about the role.*',
    lead: 'Tell me about the team and the problem. I will reply with where I would look first.',
    primary: { label: 'Start a conversation', to: '/contact?intent=job#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
  },
}

// ═══════════ Contact ═══════════
export const contactPage = {
  hero: {
    eyebrow: 'Talk',
    title: 'Bring one problem. *Leave with a clearer next step.*',
    lead: 'A role, a GTM or RevOps engagement, or a conversation about ROQIVA. Send a short brief or book a time. I reply myself, usually within two working days.',
  },
  trust: 'No production access is needed to talk. Anything later is scoped to the exports you approve.',
  book: {
    label: 'A first call',
    h: 'Leave with *a clearer next step.*',
    p: 'Bring one problem and the tools involved. We will clarify what to look at first and agree a practical next step. Choose a day here, then select an available time in Calendly to confirm.',
    plan: [
      ['Walk me through it', 'From first visit to repeat order, or the role and the team, in your words.'],
      ['I map where it likely breaks', 'Which tools hold the data, and which decisions never read it.'],
      ['Agree a next step', 'A role conversation, a scoped GTM or RevOps piece, or a ROQIVA conversation.'],
    ],
    bring: 'One problem and the tools involved. No deck, and no production access.',
  },
  asks: {
    eyebrow: 'What you can ask about',
    title: 'Ask about the one that fits, *or let me suggest one.*',
    items: [
      { id: 'job', t: 'A role', d: 'Product Manager, Product Architect or revenue-systems roles in consumer tech, growth, payments, platform and AI.', cta: 'Ask about a role', intent: 'A role on your team' },
      { id: 'consult', t: 'GTM engineering and RevOps', d: 'Size a leak, recover high-intent customers, bring customers back, or build the foundation underneath.', cta: 'Ask about GTM and RevOps', intent: 'A GTM or RevOps engagement' },
      { id: 'roqiva', t: 'ROQIVA', d: 'The system I am building. Follow along, or help shape what it does first.', cta: 'Ask about ROQIVA', intent: 'ROQIVA: follow along or help shape it' },
    ],
  },
  brief: {
    h: 'Send a short brief *instead.*',
    eyebrow: 'Prefer to write first?',
    intents: ['A role on your team', 'A GTM or RevOps engagement', 'ROQIVA: follow along or help shape it', 'Just saying hello'],
    topics: ['A number that will not move', 'Checkout and payments', 'Search and discovery', 'Delivery and returns', 'Retention and CRM', 'Tracking I do not trust', 'Something else'],
    tools: ['CRM', 'Analytics', 'Payments', 'Order management', 'Support desk', 'Catalogue', 'Data warehouse'],
  },
  who: {
    label: 'Who you will talk to',
    h: 'Talk to *me,* not a sales team.',
    p: 'I read every message. If something is not worth doing, I will tell you why.',
  },
}

// ═══════════ Privacy ═══════════
export const legal = {
  hero: { eyebrow: 'Privacy', title: 'Know what this website collects, and what it does not.', lead: 'I use the information you choose to share to reply to you and arrange a call. Hosting and booking providers also process the technical information needed to run their services. There are no advertising trackers or analytics cookies on this site.' },
  updated: '26 October 2026',
  sections: [
    { h: 'Who is responsible', p: [`This website is run by ${site.name}. For privacy or data requests, or for anything else, write to ${site.email}.`] },
    { h: 'What you send me', p: [
      'If you send a brief, I receive the answers you chose, your name, your email address and any note you add. I use them to reply to you and to prepare for a call.',
      'Briefs are delivered through Web3Forms, a form-processing service, to my inbox. This website has no database and keeps no copy of what you send.',
      'If you write to me by email, I receive what you send and the contact details that come with it.',
    ] },
    { h: 'Booking a time', p: ['Nothing is sent anywhere until you choose to see times. At that point Calendly loads inside the page, and Calendly’s own privacy policy applies to what you enter there.'] },
    { h: 'What stays on your device', p: ['This site stores your choice of light or dark theme, and whether you have seen the opening animation this session, in your browser. It sets no cookies.'] },
    { h: 'Hosting and logs', p: ['The site is hosted by Vercel. Like any web host, it processes technical data such as your IP address and browser type to deliver the pages and keep them secure.'] },
    { h: 'What I do not do', p: ['I do not run advertising trackers, sell personal data or build profiles of visitors. If I add privacy-respecting analytics later, I will say so on this page first.'] },
    { h: 'Your choices', p: [`Ask me at ${site.email} what I hold from your brief, or to delete it. I will reply in plain terms.`] },
  ],
}
