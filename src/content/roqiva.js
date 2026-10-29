// ROQIVA: the system Anjor Tank is building, as a standalone page laid out like the tool itself. Built from one system
// definition: the parts, the six steps, the four gates and how it could be put in place. Status: in development.
// No customer, metric or date is claimed. The overview numbers are facts of the design (how many agents, gates and writes).
// The page is standalone on purpose: nothing on it links to an outside ROQIVA website.

export const roqiva = {
  name: 'ROQIVA',
  // What the name stands for. Shown under the name wherever ROQIVA is introduced.
  fullName: 'Revenue Operations, Quality, Intelligence & Value Architecture',
  status: 'In development',

  tool: {
    sub: 'Product preview · In development',
    search: 'Jump to a section',
    menuLabel: 'Main menu',
    pinnedLabel: 'Pinned',
    menu: [
      { id: 'overview', label: 'Overview', icon: 'grid' },
      { id: 'origin', label: 'Origin', icon: 'branch' },
      { id: 'workspace', label: 'Workspace', icon: 'frame' },
      { id: 'parts', label: 'Parts', icon: 'layers' },
      { id: 'flow', label: 'Work item', icon: 'branch' },
      { id: 'principle', label: 'Principle', icon: 'spark' },
      { id: 'stack', label: 'Your stack', icon: 'lock' },
      { id: 'ways', label: 'Ways in', icon: 'target' },
      { id: 'rules', label: 'Working rules', icon: 'shield' },
    ],
    pinned: [
      { label: 'WI-014 · Failed payments', to: 'flow', tone: 'v' },
      { label: 'Gate 1 · Brand PM', to: 'flow', tone: 'p' },
      { label: 'C1 · Governed build', to: 'ways', tone: 'o' },
    ],
    foot: { label: 'Founder-built', title: 'In development', d: 'Explore the architecture while the product is being built.', cta: { label: 'Talk to Anjor', to: '/contact?intent=roqiva#brief' } },
  },

  hero: {
    crumb: 'Overview',
    eyebrow: 'The system I am building · In development',
    title: 'One intelligence layer *across your revenue stack.*',
    lead: 'Your CRM, analytics, payments and operations tools already hold the signals. I am building ROQIVA to connect them to the decisions that need them, without replacing the stack: governed agent workflows, evidence and human approval, running inside infrastructure the brand controls. I am its founder, and the company comes next.',
    primary: { label: 'Talk to Anjor about ROQIVA', to: '/contact?intent=roqiva#brief' },
    secondary: { label: 'See where it came from', to: '/roqiva#origin' },
    facts: ['Designed for your architecture', 'Governed access and approvals', 'Founder-built · in development'],
  },
  // Facts of the design, not results.
  numbers: {
    label: 'Planned architecture · by design',
    items: [
      { icon: 'agent', n: '6', t: 'Agents', d: 'Each drafts one artifact' },
      { icon: 'gate', n: '4', t: 'Human gates', d: 'Plus one outcome review' },
      { icon: 'brain', n: '1', t: 'Brain per brand', d: 'Versioned, decides nothing' },
      { icon: 'lock', n: '0', t: 'Writes to your tools', d: 'Read-only by design' },
    ],
  },
  partsCard: { title: 'Parts', more: 'Open the parts' },
  gatesCard: { title: 'Gates on every work item', note: 'Gates 2 and 3 may merge for a small change. Gates 1 and 4 are never skipped.' },

  origin: {
    crumb: 'Origin',
    eyebrow: 'Where it comes from',
    title: 'Build the system *I wished I had.*',
    lead: 'At Truemeds I fixed checkout, coupons, substitution, search and support by hand. Every time I started from zero: find the gap, argue for it, write the spec, ship, measure. ROQIVA is that loop, made repeatable, with a person approving every step that changes the business.',
    cards: [
      { slug: 'price-lock-checkout', lane: 'Lane C · Shopping and conversion', t: 'Payment failures nobody retried', d: 'Checkout lost orders to failures treated alike. In ROQIVA’s design it becomes a detector that checks every failure reason reaches a retry rule.' },
      { slug: 'retention-reminders', lane: 'Lane F · Retention and lifecycle', t: 'Reminders nobody timed', d: 'Repeat orders leaked because timing and ownership were split. In ROQIVA’s design a detector checks that journeys fire on real order cadence and do not conflict.' },
      { slug: 'sku-substitution-engine', lane: 'Lane D and H · Fulfilment and supply', t: 'Stock the promise did not know about', d: 'Delivery promises made on a spreadsheet. In ROQIVA’s design a detector checks that stock, catalogue and promise agree before the order is promised.' },
      { slug: 'headless-cms-experimentation', lane: 'Lane A and F · Acquisition and lifecycle', t: 'Pages launched without the tag', d: 'Landing pages shipped with broken tracking and offers the cart did not honour. In ROQIVA’s design a detector checks the page carries what the campaign needs.' },
    ],
    founder: { who: 'Anjor Tank', role: 'Founder', d: 'Product architect, previously owning payments, growth and platform product. ROQIVA is where I am putting my time now, and a company will be formed around it.', cta: { label: 'Read the cases it comes from', to: '/work' } },
  },
  open: {
    crumb: 'Workspace',
    eyebrow: 'The workspace',
    title: 'Explore one workspace concept for *signals, decisions and approvals.*',
    lead: 'This clickable product concept shows how a detected gap could become a documented finding, an approved action and a decision history. It is not a live client deployment.',
  },
  parts: {
    crumb: 'Parts',
    eyebrow: 'Inside ROQIVA',
    title: 'Explore the parts *inside the proposed system.*',
    lead: 'The proposed Brain retains business context, detectors and the Analyst investigate gaps, drafting agents prepare work, and the Monitor checks results. The Orchestrator connects these steps; your people approve decisions and your existing tools remain the source of truth.',
  },
  flow: {
    crumb: 'Work item',
    eyebrow: 'One work item',
    title: 'Follow the designed workflow *from signal to result.*',
    titles: [
      'Catch the data *no decision reads.*',
      'Rank the gaps *by what they cost.*',
      'Draft three solutions, *then pick one.*',
      'Hand your engineers *a pack ready to build.*',
      'Sign one exact release *before it ships.*',
      'Judge the result *against a frozen baseline.*',
    ],
  },
  rule: ['Code computes.', 'Agents draft.', 'People decide.'],
  principle: { crumb: 'Principle', eyebrow: 'The principle', title: 'Split every decision *three ways.*', lead: 'Code counts. An agent drafts. A named person decides anything that changes the business.' },
  inside: {
    crumb: 'Your stack',
    eyebrow: 'Your accounts',
    title: 'Keep the whole system *inside your own stack.*',
    lead: 'The goal is to work alongside the tools you already use, inside infrastructure your team controls. Your data, model access and release approvals remain yours. Final connections and operating responsibilities depend on a future, approved deployment design.',
  },
  // The "Your accounts" map: who sits outside, what runs inside the brand's cloud, and what stays the brand's.
  accounts: {
    out: { label: 'Outside your cloud', name: 'Anjor Tank', does: ['Designs the system', 'Configures it', 'Governs releases'] },
    in: {
      label: 'Inside your cloud',
      parts: ['Brain', 'Analyst', 'Monitor', 'Six specialist agents', 'Work items and gates', 'Workspace'],
      reads: 'Proposed governed, read-only inputs',
      tools: ['CRM', 'Payments', 'Analytics', 'Operations'],
    },
    own: {
      label: 'Stays yours',
      items: [
        { icon: 'database', t: 'Your data', d: 'Never leaves your accounts' },
        { icon: 'lock', t: 'Your model access', d: 'Your provider, your account' },
        { icon: 'person', t: 'Your teams', d: 'Operate it day to day' },
      ],
    },
    // One card per difference (tracks.c.differs), in the same order.
    cards: [
      { t: 'Keep data and prompts in your accounts.' },
      { t: 'Pin every release yourself.' },
      { t: 'Run first-line support in-house.' },
      { t: 'Replace hosted terms with your own review.' },
    ],
  },
  ways: {
    crumb: 'Ways in',
    eyebrow: 'Two ways to get there',
    title: 'Explore prospective *deployment approaches.*',
  },
  promises: {
    crumb: 'Working rules',
    eyebrow: 'What holds, always',
    title: 'Hold ROQIVA to *five working rules.*',
  },
  cta: {
    title: 'Help shape what ROQIVA *becomes first.*',
    lead: 'ROQIVA is in development and not yet available for production use. If you run a commerce or D2C stack and want to talk about what it should do first, or follow along as the company takes shape, write to me.',
    primary: { label: 'Talk to Anjor', to: '/contact?intent=roqiva#brief' },
    secondary: { label: 'Read the proof behind it', to: '/work' },
  },
}
