// Portfolio data carried over from the earlier site: case studies, journey, results, photos. Pure data, no markup.
// The through-line to ROQIVA lives in bridge.js; copy about the person and the pages lives in portfolio.js.

export const PROOF = [
  { pre: '77.2 → ', to: 89.7, dp: 1, suf: '%', from: 77.2, label: 'Prepaid order-to-delivery conversion', tag: 'Payments', case: 'price-lock-checkout' },
  { pre: '~', to: 1100, dp: 0, suf: '/day', from: 0, label: 'Repeat orders from the reminder platform', tag: 'Growth', case: 'retention-reminders' },
  { text: '468K → 1.6M', label: 'Organic clicks in six months', tag: 'Search', case: 'search-discovery' },
  { pre: '−', to: 20, dp: 0, suf: '%', from: 0, label: 'Cost per order from voice automation and prioritisation', tag: 'AI', case: 'ai-automation' },
];

/* ───────────── the arc (home) ───────────── */
export const ARC = [
  { k: 'I', when: '2021 – 2023', t: 'Learn how demand is made.', d: 'Campaigns, dealer networks and client accounts. I learned what a customer actually does between an ad and an order.' },
  { k: 'II', when: '2023 – 2026', t: 'Ship the systems underneath.', d: 'Moved into product. Checkout, coupons, search, fulfilment and internal tools, owned from problem to release with two pods of engineers.' },
  { k: 'III', when: '2026 – now', t: 'Build the system that runs them.', d: 'Own the product at a consumer wellness brand, and design ROQIVA, the revenue system I am building and will found a company around.' },
];

/* ───────────── how I think (ASCII cards) ───────────── */
export const BELIEFS = [
  { art: 'galaxy', t: 'Look below the UI layer.', d: 'When scale breaks a product it rarely breaks at the visual layer. It breaks in the systems and workflows underneath.', chips: ['Backend first', 'Ops workflows', 'Root cause'] },
  { art: 'lens', t: 'Build for compounding returns.', d: 'Growth loops only work when the infrastructure behind them closes. I study the end-to-end result, not the release.', chips: ['Close the loop', 'Measure end to end', 'Play long'] },
  { art: 'terrain', t: 'Internal tools are products.', d: 'CRMs, portals and supply workflows get the same rigour as a consumer app. Operations teams are users too.', chips: ['Ops are users', 'SLA by design', 'Leverage'] },
];

/* ───────────── the arc (pinned story on Home) ───────────── */
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

export { CASES, GLANCE } from './cases.js';

export const CASE_STEPS = ['The hook', 'Context', 'The problem', 'What made it hard', 'The decision', 'What was built', 'What changed', 'What I’d do differently'];
export const TAGS = ['All', 'Payments', 'Growth', 'Operations', 'Search', 'AI'];

export const EDU = [['MBA · Marketing, Operations and SCM', 'NMIMS, Mumbai · 2021 – 2023'], ['BTech · Electronics and Telecommunications', 'NMIMS, Mumbai · 2018 – 2022']];
export const CERTS = ['Model Context Protocol: Advanced Topics (Anthropic)', 'Building with the Claude API (Anthropic)', 'Building Agentic AI Systems', 'Create Generative AI Apps on Google Cloud', 'Aha! Product Management Professional', 'Executive Program in Product Management', 'Eye Tracking in Neuromarketing: a study on visual attention patterns (publication)'];
export const SKILLS = ['Payment systems and architecture', 'Product discovery and roadmapping', 'Product analytics and SQL', 'Wireframing and product design', 'A/B testing', 'Workflow automation', 'API and platform integrations', 'Agile and Scrum', 'Market research'];

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
/* Beyond work: what I read and watch. Only titles Anjor has named; add more here and the page grows with them. */
// The shelf: O'Reilly titles across AI engineering, data science and data systems. Covers on the page are drawn, in one style.
export const SHELF = [
  { t: 'AI Engineering', sp: 'AI Engineering', s: 'Building Applications with Foundation Models', a: 'Chip Huyen', p: 'O’Reilly', k: 'AI engineering', c: '#22344a' },
  { t: 'Designing Machine Learning Systems', sp: 'Designing ML Systems', s: 'An Iterative Process for Production-Ready Applications', a: 'Chip Huyen', p: 'O’Reilly', k: 'AI engineering', c: '#3a2a4f' },
  { t: 'Hands-On Large Language Models', sp: 'Hands-On LLMs', s: 'Language Understanding and Generation', a: 'Jay Alammar, Maarten Grootendorst', p: 'O’Reilly', k: 'AI engineering', c: '#1f3d3a' },
  { t: 'Prompt Engineering for LLMs', sp: 'Prompt Engineering', s: 'The Art and Science of Building Large Language Model–Based Applications', a: 'John Berryman, Albert Ziegler', p: 'O’Reilly', k: 'AI engineering', c: '#4a2d22' },
  { t: 'Natural Language Processing with Transformers', sp: 'NLP with Transformers', s: 'Building Language Applications with Hugging Face', a: 'Lewis Tunstall, Leandro von Werra, Thomas Wolf', p: 'O’Reilly', k: 'AI engineering', c: '#2d3350' },
  { t: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', sp: 'Hands-On ML', s: 'Concepts, Tools, and Techniques to Build Intelligent Systems', a: 'Aurélien Géron', p: 'O’Reilly', k: 'Data science', c: '#3d3a1f' },
  { t: 'Practical Statistics for Data Scientists', sp: 'Practical Statistics', s: '50+ Essential Concepts Using R and Python', a: 'Peter Bruce, Andrew Bruce, Peter Gedeck', p: 'O’Reilly', k: 'Data science', c: '#2a4030' },
  { t: 'Data Science from Scratch', sp: 'DS from Scratch', s: 'First Principles with Python', a: 'Joel Grus', p: 'O’Reilly', k: 'Data science', c: '#4a2238' },
  { t: 'Designing Data-Intensive Applications', sp: 'Data-Intensive Apps', s: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', a: 'Martin Kleppmann', p: 'O’Reilly', k: 'Data systems', c: '#1e2f45' },
  { t: 'Fundamentals of Data Engineering', sp: 'Data Engineering', s: 'Plan and Build Robust Data Systems', a: 'Joe Reis, Matt Housley', p: 'O’Reilly', k: 'Data systems', c: '#40301c' },
];
export const WATCHLIST = [
  { t: 'Mobile Suit Gundam', k: 'Mecha', n: 'Franchise since 1979', st: 'Sunrise', y: '1979', tags: ['Mecha', 'Space opera', 'War drama'], art: 'orbit' },
  { t: 'Code Geass', s: 'Lelouch of the Rebellion', k: 'Mecha', n: 'First aired 2006', st: 'Sunrise', y: '2006', tags: ['Mecha', 'Strategy', 'Psychological'], art: 'chess' },
];
/* Beyond work: what I play. Titles and genres only; the cover art on the page is original and abstract, made for this site. */
export const GAMES = [
  { slug: 'wuthering-waves', st: 'Kuro Games', y: '2024', c: 'RPG', t: 'Wuthering Waves', g: 'Open-world action RPG' },
  { slug: 'halo', st: 'Bungie', y: '2001', c: 'Shooter', t: 'Halo', g: 'First-person shooter' },
  { slug: 'god-of-war', st: 'Santa Monica Studio', y: '2005', c: 'Action', t: 'God of War', g: 'Action adventure' },
  { slug: 'assassins-creed', st: 'Ubisoft', y: '2007', c: 'Action', t: 'Assassin’s Creed', g: 'Open-world action' },
  { slug: 'warframe', st: 'Digital Extremes', y: '2013', c: 'Shooter', t: 'Warframe', g: 'Online action' },
  { slug: 'call-of-duty', st: 'Infinity Ward', y: '2003', c: 'Shooter', t: 'Call of Duty', g: 'First-person shooter' },
  { slug: 'doom', st: 'id Software', y: '1993', c: 'Shooter', t: 'DOOM', g: 'First-person shooter' },
  { slug: 'ghost-of-tsushima', st: 'Sucker Punch', y: '2020', c: 'Action', t: 'Ghost of Tsushima', g: 'Open-world action' },
  { slug: 'resident-evil', st: 'Capcom', y: '1996', c: 'Horror', t: 'Resident Evil', g: 'Survival horror' },
  { slug: 'silent-hill', st: 'Konami', y: '1999', c: 'Horror', t: 'Silent Hill', g: 'Psychological horror' },
  { slug: 'civilization', st: 'MicroProse', y: '1991', c: 'Strategy', t: 'Civilization', g: 'Turn-based strategy' },
  { slug: 'batman', st: 'Rocksteady', y: '2009', c: 'Action', t: 'Batman', g: 'Action adventure' },
  { slug: 'spider-man', st: 'Insomniac Games', y: '2018', c: 'Action', t: 'Spider-Man', g: 'Action adventure' },
  { slug: 'elden-ring', st: 'FromSoftware', y: '2022', c: 'RPG', t: 'Elden Ring', g: 'Action RPG' },
  { slug: 'the-last-of-us', st: 'Naughty Dog', y: '2013', c: 'Action', t: 'The Last of Us', g: 'Action adventure' },
];
export const LOVES = [
  ['F1', 'Karts on weekends, a racing sim in between, and a strong opinion about tyre strategy.'],
  ['EDM and techno', 'Loud rooms, good sound, and lasers over a crowd.'],
  ['Food', 'I will travel for a good meal.'],
  ['Fashion', 'Clothes as design, and why a jacket works.'],
  ['Consumer brands', 'What makes people choose one over another, and stay.'],
  ['Watches', 'Small, precise, honest machines.'],
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

/* ───────────── case-page sidebar: at a glance ───────────── */
