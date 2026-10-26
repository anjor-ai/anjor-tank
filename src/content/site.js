// Site-wide facts, the route table and the status vocabulary.
// Rules this content follows:
//   · One story, told in order: the proof (Work) → the practice (GTM & RevOps) → the system (ROQIVA) → the path (Journey)
//     → the person (Beyond) → the fit (Hire). Every page says where it sits in that order and hands over to the next.
//   · No invented proof: every number on the site comes from a case study or the résumé. ROQIVA is described as in development.
//   · ROQIVA is standalone: it is never linked to an outside site.
//   · Every heading is verb-first.

import { CASES } from './folio.js'

export const site = {
  name: 'Anjor Tank',
  url: 'https://anjor-portfolio.vercel.app', // canonical website origin in production and preview metadata
  tagline: 'Product architect and founder of ROQIVA.',
  ogAlt: 'Anjor Tank — product architect and founder of ROQIVA. AT keycap mark on a dark background.',
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
    title: `${site.name} — Product architect building ROQIVA`,
    description: 'Anjor Tank has fixed revenue leaks between commerce systems by hand, at scale. Now he is building ROQIVA, a governed system that does it.' },
  { path: '/work', label: 'Work', type: 'CollectionPage', updated: '2026-10-26', story: true, step: 'Proof',
    title: `Work — ${site.name}`,
    description: 'Seven commerce systems owned from problem to measured result, from Price Lock and checkout to SKU substitution, search and AI automation.' },
  ...CASES.map((c) => ({ path: `/work/${c.slug}`, label: c.title, hidden: true, type: 'Article', updated: '2026-10-26', parent: '/work',
    title: `${c.title} — ${site.name}`, description: c.line })),
  { path: '/gtm', label: 'GTM & RevOps', type: 'WebPage', updated: '2026-10-26', story: true, step: 'Practice',
    title: `GTM engineering and RevOps — ${site.name}`,
    description: 'Find the leak, fix the loop, prove the lift. Five ways revenue leaks between tools, six offers from audit to partnership, a four-phase process and the stack it runs on.' },
  { path: '/roqiva', label: 'ROQIVA', type: 'WebPage', updated: '2026-10-26', badge: 'In development', story: true, step: 'System',
    title: `ROQIVA — the revenue system Anjor Tank is building`,
    description: 'ROQIVA is a governed revenue-operations system in development: it finds unread signals, drafts the fix, and waits for a person to approve it.' },
  { path: '/journey', label: 'Journey', type: 'AboutPage', updated: '2026-10-26', story: true, step: 'Path',
    title: `Journey — ${site.name}`,
    description: 'From dealer networks and campaigns to payments, growth and platform product, to building ROQIVA. Three chapters, every role, education and certifications.' },
  { path: '/beyond', label: 'Beyond work', type: 'WebPage', updated: '2026-10-26', story: true, step: 'Person',
    title: `Beyond work — ${site.name}`,
    description: 'Karts, techno, long drives and good food. The person behind the product work.' },
  { path: '/hire', label: 'Hire', type: 'WebPage', updated: '2026-10-26', story: true, step: 'Fit',
    title: `Hire — ${site.name}`,
    description: 'Where Anjor Tank fits: growth, payments, platform and AI product seats, plus GTM engineering and revenue systems. Results, experience and how to start a conversation.' },
  { path: '/contact', label: 'Contact', type: 'ContactPage', updated: '2026-10-26',
    title: `Contact — ${site.name}`,
    description: 'Start a conversation about a role, a GTM or RevOps engagement, or ROQIVA. Send a brief or book a time.' },
  { path: '/privacy', label: 'Privacy', hidden: true, type: 'WebPage', updated: '2026-10-26',
    title: `Privacy notice — ${site.name}`,
    description: 'What this website collects when you send a brief or book a time, who processes it, and what it does not do: no advertising trackers and no analytics cookies.' },
]

export const footer = {
  line: 'Find the leak. Fix the loop. Prove the lift.',
  note: 'Product screens on this site use sample data. ROQIVA is in development.',
  how: 'Based in Mumbai. Working with teams in India and remotely.',
}
