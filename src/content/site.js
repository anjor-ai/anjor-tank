// Site-wide facts, the route table and the status vocabulary.
// Rules this content follows:
//   · One story, in order: the proof (Work) → the path (Journey) → the person (Beyond) → the hire (consulting and ROQIVA).
//   · No invented proof: every number on the site comes from a case study or the résumé. ROQIVA is described as in development.
//   · ROQIVA is standalone: it is never linked to an outside site.
//   · Every heading is verb-first.

import { CASES } from './folio.js'

export const site = {
  name: 'Anjor Tank',
  url: 'https://anjor-portfolio.vercel.app', // canonical website origin in production and preview metadata
  tagline: 'Product manager and founder of ROQIVA.',
  ogAlt: 'Anjor Tank — product manager and founder of ROQIVA. AT keycap mark on a dark background.',
  category: 'Product architect · GTM engineering · Revenue operations',
  // Public contact address. Keep mailto links and the privacy notice aligned with this address.
  email: 'anjort2000@gmail.com',
  supportEmail: 'anjort2000@gmail.com',
  linkedin: 'https://www.linkedin.com/in/anjor-tank',
  booking: 'https://calendly.com/anjort2000',
  location: 'Mumbai, India',
  // Web3Forms access keys determine the receiving inbox. This key is public by design and is restricted to this domain.
  web3formsKey: 'e8ed6edd-5136-41b2-87cc-c57df384c2b0',
}

// One vocabulary for what is real today. Anything not marked "Available today" is not available today.
export const status = {
  available: { label: 'Available today', tone: 'ok' },
  illustrative: { label: 'Illustrative walkthrough', tone: 'amber' },
  pilot: { label: 'Early access', tone: 'sky' },
  development: { label: 'In development', tone: 'violet' },
  planned: { label: 'Planned', tone: 'grey' },
}

// Order here = navigation order AND the order of the "next page" pager (story: true).
// `title`, `description`, `type` and `updated` (YYYY-MM-DD, sitemap lastmod) are read by scripts/site.mjs for each route's own HTML.
// `hidden` keeps a route out of the main navigation. `step` is the page's place in the story, shown on every page.
export const routes = [
  { path: '/', label: 'Home', type: 'WebPage', updated: '2026-10-26',
    title: `${site.name} — Product manager and founder of ROQIVA`,
    description: 'Hello, I am Anjor Tank. I fix revenue leaks between commerce systems, and I am building ROQIVA, a governed revenue system.' },
  { path: '/work', label: 'Work', type: 'CollectionPage', updated: '2026-10-26', story: true, step: 'Proof',
    title: `Work — ${site.name}`,
    description: 'Six commerce systems owned end to end, from Price Lock and checkout to SKU substitution, search, retention and AI automation.' },
  ...CASES.map((c) => ({ path: `/work/${c.slug}`, label: c.title, hidden: true, type: 'Article', updated: '2026-10-26', parent: '/work',
    title: `${c.title} — ${site.name}`, description: c.line })),
  { path: '/journey', label: 'Journey', type: 'AboutPage', updated: '2026-10-26', story: true, step: 'Path',
    title: `Journey — ${site.name}`,
    description: 'Three chapters: how demand is made, the systems underneath it, and ROQIVA.' },
  { path: '/beyond', label: 'Beyond work', type: 'WebPage', updated: '2026-10-26', story: true, step: 'Person',
    title: `Beyond work — ${site.name}`,
    description: 'Karts, techno, long drives and good food. The person behind the product work.' },
  { path: '/hire', label: 'Hire me', type: 'WebPage', updated: '2026-10-26', story: true, step: 'Hire',
    title: `Hire me — ${site.name}`,
    description: 'Hire Anjor Tank as a product manager, for GTM engineering and RevOps consulting, or follow ROQIVA, the system he is building.' },
  { path: '/roqiva', label: 'ROQIVA', hidden: true, parent: '/hire', type: 'WebPage', updated: '2026-10-26', badge: 'In development',
    title: `ROQIVA — the revenue system Anjor Tank is building`,
    description: 'ROQIVA is a governed revenue-operations system in development: it finds unread signals, drafts the fix, and waits for a person to approve it.' },
  { path: '/contact', label: 'Contact', type: 'ContactPage', updated: '2026-10-26',
    title: `Contact — ${site.name}`,
    description: 'Start a conversation about a role, a GTM or RevOps engagement, or ROQIVA. Send a brief or book a time.' },
  { path: '/privacy', label: 'Privacy', hidden: true, type: 'WebPage', updated: '2026-10-26',
    title: `Privacy notice — ${site.name}`,
    description: 'What this website collects when you send a brief or book a time, and what it does not do.' },
]

export const footer = {
  line: 'Find the leak. Fix the loop. Prove the lift.',
  note: 'Product screens on this site use sample data. ROQIVA is in development.',
  how: 'Based in Mumbai. Working with teams in India and remotely.',
}
