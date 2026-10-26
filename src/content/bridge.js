// The through-line between the cases and ROQIVA. Each case I fixed by hand is a failure shape that ROQIVA is designed to watch for.
// Lanes and detectors are from the ROQIVA design (system.js `detectors.lanes`). Nothing here claims ROQIVA has run on a real brand:
// the cases are real, the mapping is design intent, and ROQIVA is in development.

export const bridge = {
  'price-lock-checkout': {
    lane: 'C · Shopping and conversion',
    became: 'A price-integrity and payment-failure detector',
    d: 'Every payment failure reason is captured and a retry rule reads it. The price promised at checkout matches the price billed. A gap in either is flagged and ranked by what it costs.',
    agent: 'Detectors, then the Analyst',
  },
  'coupons-cashback': {
    lane: 'C and F · Conversion and lifecycle',
    became: 'A promise-versus-cart check',
    d: 'Coupon and cashback rules are compared with the cart logic that applies them, and with the lifecycle journeys that reward the next order, so offers never disagree with checkout.',
    agent: 'Detectors, then the Analyst',
  },
  'sku-substitution-engine': {
    lane: 'D and H · Fulfilment and supply',
    became: 'A stock, catalogue and promise agreement check',
    d: 'The delivery promise a customer sees is checked against live stock and the catalogue before the order exists, and the cheapest safe substitute is drafted as an option.',
    agent: 'Detectors, Research and Architect',
  },
  'growth-loops': {
    lane: 'F · Retention and lifecycle',
    became: 'A journey-conflict and abuse check',
    d: 'Journeys are checked so they do not conflict or double-send, and repeated rewards from one device or return pattern are flagged before they leak budget.',
    agent: 'Detectors, then the Monitor',
  },
  'search-discovery': {
    lane: 'A · Acquisition and discovery',
    became: 'An unread-signal detector for search',
    d: 'Zero-result and abandoned queries are signals most stacks capture and no decision reads. The detector finds them, sizes them and hands the Analyst a ranked gap.',
    agent: 'Detectors, then the Analyst',
  },
  'ai-automation': {
    lane: 'The principle · Code, agents, people',
    became: 'The rule: automate the cheapest high-volume intent first',
    d: 'The voice bot taught me where automation pays and where a person must stay in the loop. ROQIVA keeps that line: code computes, agents draft, a named person decides.',
    agent: 'The Orchestrator and the gates',
  },
  'internal-ops-cx': {
    lane: 'E · Post-purchase service',
    became: 'A support-status-to-CRM check',
    d: 'Ticket and refund status must reach the system that acts on it, with one owner and a clock. A break in that chain is a finding, not an anecdote.',
    agent: 'Detectors, then the Monitor',
  },
}
