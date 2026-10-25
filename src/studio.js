/* Decision Studio: focused public-facing pages.
   One canonical CASES source supplies case titles, metrics and diagrams. */
import { CASES, SITE } from './content.js';
import { wf } from './art.js';
import { keyboardShowcase, homepageExperience, consultingTeaser, experienceTimeline } from './studio-upgrades.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (href, label, secondary = false, external = false) =>
  `<a class="studio-link${secondary ? ' studio-link--secondary' : ''}" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${esc(label)}</span><span aria-hidden="true">↗</span></a>`;

const STORIES = {
  'price-lock-checkout': { short: 'Making checkout promises stick.', choice: 'Collect payment when the order is placed, and protect the agreed price through fulfilment.', theme: 'Checkout → warehouse → delivery', challenge: 'Payment happened hours after checkout.' },
  'coupons-cashback': { short: 'Making offers flexible, not fragile.', choice: 'Give marketing a rules-driven way to create and test offers without rebuilding checkout.', theme: 'Offer → rule → retention', challenge: 'Every new offer created platform friction.' },
  'sku-substitution-engine': { short: 'Helping orders survive inventory reality.', choice: 'Build a constrained substitution workflow around catalogue quality, stock and auditable operational checks.', theme: 'Stock → choice → fulfilment', challenge: 'Inventory changes interrupted fulfilment.' },
  'growth-loops': { short: 'Turning one-time orders into new demand.', choice: 'Connect referral incentives, guardrails and repeat-order reminders into measurable loops.', theme: 'Refer → return → repeat', challenge: 'Acquisition and repeat use were disconnected.' },
  'search-discovery': { short: 'Making intent easier to find.', choice: 'Use behavioural signals and a cleaner search experience instead of relying on keyword matching alone.', theme: 'Query → relevance → order', challenge: 'Search gaps became invisible lost orders.' },
  'ai-automation': { short: 'Automating the work that should not be manual.', choice: 'Start with high-volume, low-complexity support requests; escalate ambiguous cases to people.', theme: 'Intent → route → resolve', challenge: 'Simple support requests consumed specialist time.' },
  'internal-ops-cx': { short: 'Giving every customer problem an owner.', choice: 'Bring routing, returns and refunds into one accountable workflow with system-led SLAs.', theme: 'Request → owner → resolution', challenge: 'Queries bounced between teams.' }
};

const highlights = [
  ['77.2 → 89.7%', 'Prepaid orders reaching delivery', 'price-lock-checkout'],
  ['6 → 13%', 'Referral share of acquisition', 'growth-loops'],
  ['−30%', 'Support resolution time', 'internal-ops-cx']
];

function visual(c, large = false) {
  const meta = STORIES[c.slug];
  return `<div class="studio-viz${large ? ' studio-viz--large' : ''}" data-illustration>
    <div class="studio-viz__meta"><span class="studio-viz__index">${esc(c.n)}</span><span>${esc(meta.theme)}</span></div>
    <div class="studio-viz__svg" aria-hidden="true">${wf(c.wf)}</div>
    <div class="studio-viz__foot"><i></i><span>${esc(c.tag)} / decision diagram</span></div>
  </div>`;
}
function featureCard(c, compact = false) {
  const meta = STORIES[c.slug];
  return `<a class="studio-case${compact ? ' studio-case--compact' : ''}" href="/work/${c.slug}" data-studio-reveal>
    ${visual(c)}
    <div class="studio-case__text">
      <p class="studio-kicker">${esc(c.cat)} <span>·</span> ${esc(c.year)}</p>
      <h3>${esc(meta.short)}</h3>
      <p class="studio-case__decision">${esc(meta.choice)}</p>
      <div class="studio-case__bottom"><p><strong>${esc(c.metrics[0][0])}</strong><span>${esc(c.metrics[0][1])}</span></p><span class="studio-circle" aria-hidden="true">↗</span></div>
    </div>
  </a>`;
}
function sectionHead(eyebrow, heading, detail) {
  return `<div class="studio-section-head" data-studio-reveal><p class="studio-kicker">${esc(eyebrow)}</p><h2>${esc(heading)}</h2>${detail ? `<p>${esc(detail)}</p>` : ''}</div>`;
}

export function studioHome() {
  return `
  <section class="studio-hero"><div class="wrap studio-hero__grid">
    <div class="studio-hero__copy" data-studio-reveal>
      <p class="studio-kicker"><span class="studio-live"></span> Anjor Tank / Product Manager / Mumbai</p>
      <h1>I build the systems <em>behind the click.</em></h1>
      <p class="studio-lead">I’m Anjor, a Product Manager at GNC India working across ecommerce, consumer journeys, growth and internal platforms. I turn complex product problems into systems that ship. I also founded MESHHETU.</p>
      <div class="studio-actions">${link('/work', 'Explore my work')}${link('/contact', 'Get in touch', true)}</div>
      <p class="studio-under">Commerce / D2C / Consumer journeys / Internal platforms</p>
    </div>
    ${keyboardShowcase()}
  </div></section>
  <section class="studio-proof"><div class="wrap">
    <div class="studio-proof__heading"><p class="studio-kicker">Selected outcomes</p><p>Truemeds product work · 2023–2026</p></div>
    <div class="studio-proof__grid">${highlights.map(([number, label, slug], i) => `<a href="/work/${slug}" class="studio-proof__item" data-studio-reveal><span class="studio-kicker">0${i + 1} / Impact</span><strong>${number}</strong><span>${label}</span><small>Read context ↗</small></a>`).join('')}</div>
    <p class="studio-footnote">Selected reported outcomes. Definitions, attribution and validation context belong in the linked case studies.</p>
  </div></section>
  <section class="studio-section studio-selected" id="selected"><div class="wrap">
    ${sectionHead('01 / Selected work', 'Three decisions worth a closer look.', 'Product decisions, trade-offs and the systems that made them work.')}
    <div class="studio-features">${CASES.slice(0, 3).map(c => featureCard(c)).join('')}</div>
    <div class="studio-section-cta">${link('/work', 'All work & case studies', true)}</div>
  </div></section>
  <section class="studio-section studio-lenses"><div class="wrap">
    ${sectionHead('02 / The product lens', 'I work across the seam.', 'Customer experience and operational reality should be designed together.')}
    <div class="studio-lens-grid">
      <article data-studio-reveal><span>01 / CUSTOMER</span><h3>Journeys people feel.</h3><p>Payments, checkout, search and moments that create or erode trust.</p></article>
      <article data-studio-reveal><span>02 / GROWTH</span><h3>Loops that compound.</h3><p>Offers, referrals, retention and measurement that connects to behaviour.</p></article>
      <article data-studio-reveal><span>03 / OPERATIONS</span><h3>Systems teams rely on.</h3><p>Catalogue, fulfilment, CRMs and workflows built for actual operators.</p></article>
    </div>
  </div></section>
  ${homepageExperience()}
  ${founder()}
  ${consultingTeaser()}
  <section class="studio-section studio-human"><div class="wrap studio-human__grid">
    <img src="/img/adventure/kart-grid.webp" width="480" height="320" loading="lazy" alt="On a go-kart track">
    <div data-studio-reveal><p class="studio-kicker">Beyond the backlog</p><h2>Curious about systems. <em>And everything outside them.</em></h2><p>Racing weekends, live music, travel, good design and a slightly unreasonable interest in how products are made.</p><div class="studio-actions">${link('/about', 'A little more about me')}${link('/contact', 'Say hello', true)}</div></div>
  </div></section>`;
}

export function studioWork() {
  return `<section class="studio-page-head"><div class="wrap" data-studio-reveal><p class="studio-kicker">Selected work / Truemeds · 2023–2026</p>
      <h1>Different problems. <em>One product mindset.</em></h1>
      <p class="studio-lead">A closer look at the trade-offs behind payments, growth and fulfilment. Three deeper studies first, followed by smaller projects across discovery, AI and operations.</p></div>
    </section>
    <section class="studio-section studio-work"><div class="wrap">
      ${sectionHead('01 / Featured case studies','From ambiguity to shipped decisions.','Each story covers the problem, my role, the trade-offs and what changed.')}
      <div class="studio-features">${CASES.slice(0,3).map(c=>featureCard(c)).join('')}</div>
    </div></section>
    <section class="studio-section studio-archive"><div class="wrap">
      ${sectionHead('02 / More things shipped','Breadth, without the repetition.','Shorter studies across acquisition, discovery, automation and customer operations.')}
      <div class="studio-archive__grid">${CASES.slice(3).map(c=>featureCard(c,true)).join('')}</div>
      <p class="studio-footnote">Impact figures reflect the source case narratives; measurement windows and direct ownership should be clarified where not yet documented.</p>
    </div></section>
    <section class="studio-close"><div class="wrap"><p class="studio-kicker">Next / Conversation</p><h2>Have a product challenge in mind?</h2>${link('/contact','Start a conversation')}</div></section>`;
}

function founder() {
  return `<section class="studio-section studio-founder"><div class="wrap"><div class="studio-founder__panel" data-studio-reveal>
    <div class="studio-founder__mark"><img src="/img/meshhetu-mark-dark.svg" alt="" width="68" height="68"><span>हेतु</span><small>MESHHETU / FOUNDER</small></div>
    <div class="studio-founder__story"><p class="studio-kicker">Founder / MESHHETU</p><h2>Building MESHHETU.</h2>
    <p>I founded MESHHETU to help commerce teams connect the tools, signals and decisions that are too often left isolated. Its work spans GTM engineering, RevOps and product-led systems consulting.</p>
    <p class="studio-founder__note">ROQIVA is a developing product direction, not a claim of a fully shipped client platform.</p>
    ${link(SITE.meshhetu,'Explore MESHHETU',false,true)}</div>
  </div></div></section>`;
}

const HISTORY = [
 ['NOW / 2026','Product Manager','GNC India','Ecommerce, customer experience, growth and internal product platforms.'],
 ['FOUNDED / 2026','Founder','MESHHETU','Systems engineering, GTM engineering and RevOps consulting for commerce teams.'],
 ['2023 — 2026','Associate Product Manager','Truemeds','Payments, search, growth loops and operational tooling delivered with engineering and design partners.'],
 ['2021 — 2023','Marketing → client services','Earlier chapters','Learning demand generation, customer behaviour and the business context around product.']
];
export function studioAbout() {
  return `<section class="studio-page-head studio-about-hero"><div class="wrap studio-about-hero__grid">
    <div data-studio-reveal><p class="studio-kicker">About / The person behind the decisions</p><h1>I like the messy bit <em>between idea and impact.</em></h1>
    <p class="studio-lead">I’m Anjor, a Mumbai-based Product Manager working across consumer ecommerce, growth and the systems that make promises real. My path started in marketing, moved through operations-heavy product problems, and now includes building MESHHETU.</p>
    ${link('/work','See what I’ve shipped',true)}</div>
    <figure class="studio-about-photo"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank outdoors near a mountain lake"><figcaption>Somewhere away from a sprint board.</figcaption></figure>
  </div></section>
  <section class="studio-section studio-history"><div class="wrap">
    ${sectionHead('01 / The path','Marketing taught me demand. Product taught me delivery.','Four chapters; one evolving way of thinking.')}
    ${experienceTimeline(true)}
    <div class="studio-actions">${link("/experience","View the complete career timeline",true)}</div>
  </div></section>
  ${founder()}
  <section class="studio-section studio-personal"><div class="wrap">
    ${sectionHead('02 / Off the clock','Fast corners. Loud rooms. Long detours.','A few snapshots beyond the product work.')}
    <div class="studio-personal__grid">${[
      ['kart-pov','Karting and F1 weekends'],['festival','Live music and late sets'],['lake-overlook','Where the roads lead'],['f1-sim','A lot of curiosity']
    ].map(([file,title])=>`<figure data-studio-reveal><img src="/img/adventure/${file}.webp" loading="lazy" alt="${esc(title)}"><figcaption>${esc(title)}</figcaption></figure>`).join('')}</div>
  </div></section>
  <section class="studio-close"><div class="wrap"><p class="studio-kicker">End / Beginning</p><h2>Enough about me. What are you working on?</h2>${link('/contact','Start a conversation')}</div></section>`;
}

export function studioContact() {
  return `<section class="studio-page-head"><div class="wrap"><p class="studio-kicker">Contact / Open lines</p>
  <h1>Let's make <em>something useful.</em></h1><p class="studio-lead">A product role, a consulting brief through MESHHETU Track A, or simply a good conversation—reach out directly or leave a note.</p></div></section>
  <section class="studio-section studio-contact"><div class="wrap studio-contact__grid">
    <div class="studio-contact__direct"><h2>Reach me directly.</h2>
      <a href="mailto:${SITE.email}"><span>Email</span><strong>${SITE.email}</strong><b aria-hidden="true">↗</b></a>
      <a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>Connect on LinkedIn</strong><b aria-hidden="true">↗</b></a>
      <a href="${SITE.meshhetu}" target="_blank" rel="noopener noreferrer"><span>MESHHETU inquiries</span><strong>Visit the company website</strong><b aria-hidden="true">↗</b></a>
    </div>
    <form id="studio-form" class="studio-contact__form" novalidate>
      <input type="hidden" name="access_key" value="${esc(SITE.form.key)}"><input type="hidden" name="subject" value="Portfolio inquiry">
      <input name="botcheck" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <label>Name<input name="name" autocomplete="name" required placeholder="Your name"></label>
      <label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@company.com"></label>
      <label>What’s this about?<select name="intent"><option>Product opportunity</option><option>Collaboration / introduction</option><option>Something else</option></select></label>
      <label>Your note<textarea name="message" rows="5" required placeholder="A little context goes a long way"></textarea></label>
      <button class="studio-link" type="submit"><span>Send message</span><span aria-hidden="true">↗</span></button>
      <p class="studio-form-status" id="studio-form-status" role="status" aria-live="polite"></p>
    </form>
  </div></section>`;
}

export function studioCaseMap(c) {
  const note=STORIES[c.slug];
  return `<section class="studio-case-map"><div class="wrap">
    <header><p class="studio-kicker">The decision at a glance</p><h2>What changed—and why.</h2></header>
    <div class="studio-case-map__steps">
      <div data-studio-reveal><small>01 / Tension</small><h3>${esc(note.challenge)}</h3></div>
      <div data-studio-reveal><small>02 / Product call</small><h3>${esc(note.choice)}</h3></div>
      <div data-studio-reveal><small>03 / Reported outcome</small><h3>${esc(c.metrics[0][0])}</h3><p>${esc(c.metrics[0][1])}</p></div>
    </div>
    <p class="studio-footnote">A simplified overview. Read the case below for the constraints, implementation and context behind the reported result.</p>
  </div></section>`;
}
