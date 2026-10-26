// Page copy for the portfolio. First person, plain, verb-first headings; `*asterisks*` mark the highlighted words.
// The story, in order: Proof (Work) → Path (Journey) → Person (Beyond) → Hire (consulting and ROQIVA).
// Every story page ends by handing over to the next one (see `pager`).

import { site } from './site.js'

export const pager = {
  '/work': { to: '/journey', kicker: 'Next · Path', title: 'See how I *got here.*', d: 'Dealer networks and campaigns, then payments and growth, now ROQIVA.' },
  '/journey': { to: '/beyond', kicker: 'Next · Person', title: 'Meet the person *behind the work.*', d: 'Karts, techno, long drives and good food.' },
  '/beyond': { to: '/hire', kicker: 'Next · Hire', title: 'Work *with me.*', d: 'A role, a GTM and RevOps engagement, or ROQIVA.' },
  '/hire': { to: '/contact', kicker: 'Next · Talk', title: 'Start *a conversation.*', d: 'Send a short brief or book a time.' },
  '/roqiva': { to: '/contact', kicker: 'Next · Talk', title: 'Help shape *what ROQIVA does first.*', d: 'Follow along, or tell me the problem you would point it at.' },
}

// ═══════════ Home ═══════════
export const home = {
  hello: {
    greeting: ['Hello', 'नमस्ते', 'હેલો'],
    title: 'I’m Anjor. I fix *revenue leaks* between systems.',
    lead: 'Product manager at GNC India. Founder of ROQIVA, the system I am building to do it for everyone.',
    primary: { label: 'See my work', to: '#work' },
    secondary: { label: 'Say hello', to: '/contact' },
    facts: [['Now', 'Product Manager, GNC India'], ['Building', 'ROQIVA, in development'], ['Before', 'Product Manager, Truemeds']],
    proof: [['+12.5pp', 'Prepaid conversion'], ['~1,100', 'Repeat orders a day'], ['3.4×', 'Organic clicks in six months'], ['−20%', 'Cost per order']],
    badges: ['77.2 → 89.7% prepaid', 'ROQIVA · in development', '70,000+ SKUs indexed'],
    tags: ['AI Product Manager', 'Payments', 'Search', 'MarTech', 'Operations & Logistics', 'Platform Products', 'GTM Engineering', 'RevOps'],
  },
  work: { eyebrow: 'Selected work', title: 'Six systems. *Drag the ring, open a case.*', link: ['All cases', '/work'] },
  band: ['Find the leak', 'Fix the loop', 'Prove the lift'],
  layers: { eyebrow: 'How I build', title: 'Every number sits on *four layers.*', lead: 'When scale breaks a product it rarely breaks on the screen. It breaks in the layers underneath, so that is where I work.' },
  system: {
    eyebrow: 'One system',
    title: 'From a client leak to *a product that finds it.*',
    lead: 'GTM engineering and RevOps is how I work today. ROQIVA is the same loop, written as software.',
    steps: [
      { n: '01', t: 'Find the leak', d: 'Map the journey, test the data, size each leak in rupees.' },
      { n: '02', t: 'Fix the loop', d: 'Signals, rules and suppression built once, running without a ticket.' },
      { n: '03', t: 'Prove the lift', d: 'Every claim measured against a holdout that was never contacted.' },
      { n: '04', t: 'Run it in ROQIVA', d: 'Detectors find it, agents draft the fix, a person approves.' },
    ],
    link: ['See the whole system', '/hire#system'],
  },
  fit: { eyebrow: 'Where I fit', title: 'Pick *the seat you need.*', link: ['Hire me', '/hire'] },
  roqiva: {
    eyebrow: 'Founder · In development',
    title: 'The system I am building. *A company comes next.*',
    lead: 'It finds the signals your tools capture and no decision reads, drafts the fix, and waits for a person to approve it. It writes nothing to your live tools.',
    stats: [['6', 'steps per work item'], ['4', 'human gates'], ['0', 'writes to live tools']],
    primary: { label: 'Open the walkthrough', to: '/roqiva' },
    secondary: { label: 'Help shape it', to: '/contact?intent=roqiva#brief' },
  },
  cta: {
    title: 'Bring me a number *that will not move.*',
    lead: 'A role, a GTM or RevOps engagement, or ROQIVA. A short brief is enough.',
    primary: { label: 'Send a brief', to: '/contact#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
  },
}

// Where I fit: six seats, the proof behind each and where to start. Used on Home and on Hire.
export const fit = [
  { id: 'growth', seat: 'Growth PM', d: 'Referral, lifecycle, CMS and experimentation that growth can run without an engineering ticket.', proof: '6 → 13% referral share · ~1,100 repeat orders a day', start: 'Where growth waits on engineering.', case: 'retention-reminders' },
  { id: 'payments', seat: 'Payments PM', d: 'Checkout, price integrity, payment adoption and what happens when a payment fails.', proof: '77.2 → 89.7% prepaid order-to-delivery', start: 'Where failures are treated alike.', case: 'price-lock-checkout' },
  { id: 'platform', seat: 'Platform PM', d: 'Rule engines, catalogues, portals and the internal tools behind a consumer product.', proof: '45+ coupon combinations · 70,000+ SKUs re-indexed', start: 'Where operators work from spreadsheets.', case: 'sku-substitution-engine' },
  { id: 'ai', seat: 'AI PM', d: 'Automation and recommendation that start with the cheapest high-volume intent, and keep a person where it matters.', proof: '−20% cost per order · +11% substitution acceptance', start: 'Where cost follows volume, not complexity.', case: 'ai-automation' },
  { id: 'gtm', seat: 'GTM engineer · RevOps', d: 'Signals, rules and suppression engineered once and reused, with every claim measured against a holdout.', proof: 'Five leaks, six offers, one process', start: 'Where the numbers differ in every tool.', to: '/hire#consulting' },
  { id: 'founding', seat: 'Founding product', d: 'Zero to one in a small team: the problem, the architecture, the build and the measurement, owned end to end.', proof: 'ROQIVA, a system in development', start: 'Where the product does not exist yet.', to: '/roqiva' },
]

// ═══════════ Work ═══════════
export const work = {
  hero: {
    eyebrow: 'Proof · Work',
    title: 'Six systems *I owned end to end.*',
    lead: 'Payments, growth, search, AI and operations at a Series C online pharmacy.',
    facts: ['Truemeds · Dec 2023 – Jul 2026', 'Two pods · 12 engineers', 'Five systems built 0-to-1'],
  },
}

// ═══════════ Consulting (on the Hire page) ═══════════
export const consulting = {
  eyebrow: 'Consulting · GTM engineering and RevOps',
  title: 'Find the leak. *Fix the loop.* Prove the lift.',
  lead: 'For consumer commerce teams. I find where revenue leaks between your tools, build the fix, and measure the lift against a holdout.',
  leaks: { title: 'Which leak *do you recognise?*' },
  offers: { title: 'Six offers, *one ladder.*' },
  process: { title: 'Four phases, *twelve weeks.*' },
  story: [
    { id: 'sys-leak', eyebrow: '01 · Find the leak', title: 'Revenue leaks *between your tools.*', lead: 'Search, stock, checkout, support and CRM each report their own number. I map the journey end to end, test which data to trust, and size every leak.', chips: ['Journey map', 'Data trust test', 'Finding cards'] },
    { id: 'sys-loop', eyebrow: '02 · Fix the loop', title: 'Build the fix *once, as a system.*', lead: 'Signals, rules and suppression, engineered into a loop that runs without a ticket. Six offers, from a fixed-fee audit to a monthly partnership.', chips: ['Fixed fee', 'Owner named', 'Rollback path'] },
    { id: 'sys-lift', eyebrow: '03 · Prove the lift', title: 'No claim *without a holdout.*', lead: 'A group that is never contacted shows what would have happened anyway. Twelve weeks from first call to a measured result.', chips: ['Holdout', 'Guardrails', 'Decision trace'] },
    { id: 'sys-roqiva', eyebrow: '04 · Run it in ROQIVA', title: 'ROQIVA is *the same loop, as software.*', lead: 'What I do by hand for a client, ROQIVA is being built to do continuously: detectors find the leak, agents draft the fix, a named person approves, and the lift is measured.', chips: ['In development', 'Human gates', 'No live writes'] },
  ],
  cta: { label: 'Bring me a number', to: '/contact?intent=consult#brief' },
}

// ═══════════ ROQIVA page: the Origin section is in roqiva.js ═══════════

// ═══════════ Journey ═══════════
export const journeyPage = {
  hero: {
    eyebrow: 'Path · Journey',
    title: 'Three chapters, *one direction.*',
    lead: 'Learn how demand is made. Ship the systems underneath it. Build the system that runs them.',
  },
  chapters: [
    { k: 'I', t: 'How demand is made', span: '2022 – 2023', d: 'Dealer networks, landing pages and campaigns.',
      lesson: 'Demand is made in the gap between an ad and an order.',
      roles: [
        { when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst Advertising and Design', mono: 'EF', text: 'Primary contact for Tata Motors dealers across Maharashtra. Wireframed landing pages and a lead system.', stats: [['15', 'dealers'], ['48', 'landing pages'], ['~100', 'campaigns']] },
        { when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India', mono: 'NP', text: 'Ran client accounts and sharpened campaign targeting from consumer-behaviour data.', stats: [['6', 'clients']] },
      ] },
    { k: 'II', t: 'The systems underneath', span: 'Dec 2023 – now', d: 'Product roles where scale broke the workflows, not the interface.',
      lesson: 'When scale breaks a product, it breaks in the systems underneath.',
      roles: [
        { when: 'Dec 2023 – Jul 2026', role: 'Associate Product Manager', org: 'Truemeds · Mumbai', mono: 'TM', text: 'Co-managed two pods across payments and portals. Owned sprint planning, prioritisation, on-call and delivery.', stats: [['2', 'pods'], ['12', 'engineers'], ['5', 'systems 0-to-1']], tags: ['Payments', 'Growth', 'Search', 'Internal tools'], to: '/work' },
        { when: 'Oct 2026 – now', role: 'Product Manager', org: 'GNC India · Mumbai', mono: 'GN', now: true, text: 'Product manager at the consumer wellness brand, across ecommerce, growth and the platforms behind them.', stats: [['Oct', 'joined 2026']], tags: ['Ecommerce', 'D2C', 'Growth'] },
      ] },
    { k: 'III', t: 'The system that runs them', span: '2026 – now', d: 'The loop I ran by hand, made repeatable.',
      lesson: 'A system can run the loop, as long as a person decides what changes the business.',
      roles: [
        { when: '2026 – now', role: 'Founder', org: 'ROQIVA · in development', mono: 'RQ', now: true, text: 'Designing and building a governed revenue system for commerce and D2C. A company will form around it.', stats: [['6', 'agents'], ['6', 'steps'], ['4', 'gates']], tags: ['Product architecture', 'Agents', 'RevOps'], to: '/roqiva' },
      ] },
  ],
  beliefs: { eyebrow: 'How I think', title: 'Three *beliefs about product.*' },
}

// ═══════════ Beyond work ═══════════
export const beyond = {
  hero: {
    eyebrow: 'Person · Beyond work',
    title: 'Meet the person *behind the work.*',
    lead: 'Karts, loud rooms, back roads and a good meal.',
  },
  groups: ['All', 'Wander', 'Speed', 'Live'],
}

// ═══════════ Hire me ═══════════
export const hire = {
  hero: {
    eyebrow: 'Hire me',
    title: 'Three ways *to work with me.*',
    lead: 'As a product manager on your team. As a consultant on your revenue leaks. Or alongside ROQIVA, the system I am building.',
    primary: { label: 'Start a conversation', to: '/contact?intent=job#brief' },
    secondary: { label: 'LinkedIn', href: site.linkedin },
    ways: [
      { n: '01', t: 'Join your team', d: 'Growth, payments, platform or AI product.', to: '#fit' },
      { n: '02', t: 'Consult', d: 'GTM engineering and RevOps, from audit to running system.', to: '#system' },
      { n: '03', t: 'Build with ROQIVA', d: 'Follow it, or help shape what it does first.', to: '#roqiva' },
    ],
    where: 'India, or remote with global teams.',
  },
  fit: { eyebrow: 'Join your team', title: 'Pick *the seat you need.*' },
  strengths: ['Consumer product', 'Ecommerce and D2C', 'Growth', 'RevOps', 'GTM engineering', 'Search', 'Checkout and payments', 'Lifecycle', 'AI and automation', 'Experimentation'],
  cta: {
    title: 'Tell me *about the team.*',
    lead: 'I reply myself, usually within two working days.',
    primary: { label: 'Start a conversation', to: '/contact?intent=job#brief' },
    secondary: { label: 'Book a time', to: '/contact#book' },
  },
}

// ═══════════ Contact ═══════════
export const contactPage = {
  hero: {
    eyebrow: 'Talk',
    title: 'Bring one problem. *Leave with a clearer next step.*',
    lead: 'A role, a GTM or RevOps engagement, or ROQIVA. I reply myself, usually within two working days.',
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
  brief: {
    h: 'Send a short brief *instead.*',
    eyebrow: 'Prefer to write first?',
    intents: ['A role on your team', 'A GTM or RevOps engagement', 'ROQIVA: follow along or help shape it', 'Just saying hello'],
    topics: ['A number that will not move', 'Checkout and payments', 'Search and discovery', 'Delivery and returns', 'Retention and CRM', 'Tracking I do not trust', 'Something else'],
    tools: ['CRM', 'Analytics', 'Payments', 'Order management', 'Support desk', 'Catalogue', 'Data warehouse'],
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
