/* ==========================================================================
   RENDER — turns content.js into the HTML for every page.
   Used at build time by vite.config.js (full pages) and at run time by
   main.js (the case quick-view). No framework: strings in, strings out.
   ========================================================================== */
import { SITE, NAV, PROOF, BELIEFS, ARC, LAYERS, OWN, RELEASE, TOOLS, CASES, CASE_STEPS, TAGS, CHAPTERS, EDU, CERTS, SKILLS, MESH, PHOTOS, ALT, LOVES, DOORS, WINS, HIRE, CONSULT, GLANCE } from './content.js';
import { isoStack, wf, mockup } from './art.js';
import { isoScene, SCHEMES } from './iso.js';
import { WM } from './wm.js';
import { studioHome, studioWork, studioAbout, studioContact, studioCaseMap } from './studio.js';

export const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hl = (t) => esc(t).replace(/\*([^*]+)\*/g, '<span class="hl">$1</span>');
const pad = (n) => String(n).padStart(2, '0');

const I = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  sun: '<svg class="ico ico--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="ico ico--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
};

const btn = (href, label, kind = 'primary', ext = false) =>
  `<a class="btn btn--${kind}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span>${label}</span>${ext ? I.up : I.arrow}</a>`;

const sh = (label, title, lead = '', cls = '') =>
  `<header class="sh ${cls}"><p class="label eyebrow" data-in>${esc(label)}</p><h2 class="h-2" data-split>${hl(title)}</h2>${lead ? `<p class="lead" data-in>${esc(lead)}</p>` : ''}</header>`;

const key = (t = 'AT') => `<span class="key" aria-hidden="true"><b>${t}</b></span>`;

/* ───────────── shell ───────────── */
/** The ANJOR TANK logotype as a reel: letters that turn into small dot-matrix screens and back (see artcv.js). */
function reel(size) {
  const { w, boxes } = WM;
  return `<span class="rl rl--${size}" data-rl="${size}" role="img" aria-label="Anjor Tank">${boxes.map(([a, b]) => {
    const bw = b - a, p = (a / (w - bw) * 100).toFixed(3);
    const m = `-webkit-mask-size:${(w / bw * 100).toFixed(2)}% 100%;mask-size:${(w / bw * 100).toFixed(2)}% 100%;-webkit-mask-position:${p}% 0;mask-position:${p}% 0`;
    return `<span class="rl__slot" style="left:${(a / w * 100).toFixed(3)}%;width:${(bw / w * 100).toFixed(3)}%"><span class="rl__ch" style="${m}"></span><span class="rl__tile" aria-hidden="true"><canvas></canvas></span></span>`;
  }).join('')}</span>`;
}

function nav(path) {
  const cur = p => (path === p || path.startsWith(p + '/') ? ' aria-current="page"' : '');
  const item = ([h, t], i) => `<a href="${h}"${cur(h)}${h.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${i != null ? `<i>${pad(i + 1)}</i>` : ''}${esc(t)}</a>`;
  return `<header class="nav" id="nav"><div class="nav__in">
    <a class="brand" href="/" aria-label="Anjor Tank, home">${key()}${reel('nav')}</a>
    <nav class="nav__links" aria-label="Main">${NAV.map(x => item(x)).join('')}</nav>
    <div class="nav__r">
      <button class="kbtn" id="theme" type="button" aria-label="Switch colour theme">${I.sun}${I.moon}</button>
      <a class="btn btn--primary btn--sm nav__cta" href="/contact"><span>Get in touch</span></a>
      <button class="kbtn burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sheet">${I.menu}</button>
    </div></div>
    <div class="sheet" id="sheet" hidden>${NAV.map((x, i) => item(x, i)).join('')}</div>
  </header>`;
}

function foot() {
  return `<footer class="foot" id="foot">
    <div class="wrap foot__top studio-footer">
      <div class="foot__id"><a href="/" aria-label="Anjor Tank, home">${key()}</a><p class="foot__line">Product Manager at GNC India. Founder, MESHHETU.</p><p class="label">Mumbai · India</p></div>
      <nav class="foot__col" aria-label="Site links"><p class="label">Explore</p><a href="/work">Work</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
      <div class="foot__col"><p class="label">Elsewhere</p><a href="${SITE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="mailto:${SITE.email}">Email</a><a href="${SITE.meshhetu}" target="_blank" rel="noopener noreferrer">MESHHETU ↗</a></div>
    </div>
    <div class="wrap foot__bar"><p class="label">© 2026 Anjor Tank</p><p class="label">Designed to make the work clearer.</p></div>
  </footer>`;
}

function cta(title = 'Have a product problem to solve?') {
  return `<section class="studio-close"><div class="wrap"><p class="studio-kicker">Next / Conversation</p><h2>${esc(title)}</h2><a class="studio-link" href="/contact"><span>Get in touch</span><span aria-hidden="true">↗</span></a></div></section>`;
}

export function shell({ path, title, desc, body, boot = false, extra = '' }) {
  const url = SITE.origin + (path === '/' ? '' : path);
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#141413">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website"><meta property="og:site_name" content="Anjor Tank"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE.origin}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
${path === '/404' ? '<meta name="robots" content="noindex">' : ''}
<script src="/theme-init.js"></script>
${extra}
</head>
<body data-page="${esc(path)}">
<a class="skip-link" href="#main">Skip to content</a>
<div class="space" aria-hidden="true"><div class="space__hills"></div><div class="space__word"></div><div class="space__shade"></div></div>

${nav(path)}
<main id="main">${body.replace(/\*([^*<>\n]+)\*/g, '<span class="hl">$1</span>')}</main>
${foot()}
<dialog class="qv" id="qv" aria-labelledby="qv-h"><div class="qv__bar"><p class="label" id="qv-c"></p><div class="qv__nav"><button class="kbtn" type="button" id="qv-p" aria-label="Previous case">${I.arrow}</button><button class="kbtn" type="button" id="qv-n" aria-label="Next case">${I.arrow}</button><button class="kbtn" type="button" id="qv-x" aria-label="Close">${I.close}</button></div></div><div class="qv__body" id="qv-b"></div></dialog>
<div class="pt" id="pt" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
<div class="cur" id="cur" aria-hidden="true"></div>
<script type="module" src="/src/main.js"></script>
</body></html>`;
}

/* The opening: a keycap lands in a dot-matrix starfield, it says hello, then the stars stretch into warp and the page opens out of the middle. */
function intro() {
  return `<div class="intro" id="intro" aria-hidden="true"><canvas id="warp"></canvas>
    <div class="intro__c"><span class="intro__key" id="intro-k"><b>AT</b></span><p class="intro__w" id="intro-w">HELLO</p></div>
    <button class="intro__skip label" id="intro-s" type="button">Skip</button></div>`;
}

/* ───────────── case card ───────────── */
function caseCard(c, i, cls = '') {
  return `<article class="ccard ${cls}" data-tag="${c.tag}" data-slug="${c.slug}" data-in>
    <button class="ccard__hit" type="button" data-case="${c.slug}" aria-label="Quick view: ${esc(c.title)}"></button>
    <div class="ccard__top"><span class="label">${c.n}</span><span class="chip">${c.tag}</span></div>
    <div class="ccard__art">${wf(c.wf)}</div>
    <h3 class="h-3">${esc(c.title)}</h3>
    <p class="ccard__p">${esc(c.line)}</p>
    <dl class="ccard__m">${c.metrics.slice(0, 2).map(([v, l]) => `<div><dd>${esc(v)}</dd><dt>${esc(l)}</dt></div>`).join('')}</dl>
    <span class="ccard__go" aria-hidden="true">${I.plus}</span>
  </article>`;
}

/* The pop-up: a quick read of a case, with a way in to the full page */
export function quick(c, i, total) {
  return `<div class="qv__g"><div class="qv__l"><div class="qv__art">${wf(c.wf)}</div>
      <dl class="qv__m">${c.metrics.map(([v, l]) => `<div><dd>${esc(v)}</dd><dt>${esc(l)}</dt></div>`).join('')}</dl></div>
    <div class="qv__r">
      <p class="label"><span class="chip">${c.tag}</span> ${esc(c.cat.toLowerCase().startsWith(c.tag.toLowerCase()) ? c.cat.slice(c.tag.length).replace(/^\s*·\s*/, '') || c.cat : c.cat)} · ${esc(c.year)}</p>
      <h2 class="h-2" id="qv-h">${esc(c.title)}</h2>
      <blockquote class="qv__q">${esc(c.hook)}</blockquote>
      <div class="qv__s"><h3 class="label">The problem</h3><p>${esc(c.quick.problem)}</p></div>
      <div class="qv__s qv__s--call"><h3 class="label">The call</h3><p>${esc(c.quick.call)}</p></div>
      <div class="qv__s"><h3 class="label">The result</h3><p>${esc(c.quick.result)}</p></div>
      <div class="btn-row">${btn('/work/' + c.slug, 'Read the full case study')}</div>
    </div></div>`;
}

const picker = () => `<div class="hs__pick glass" role="group" aria-label="Scene colour"><span class="label">Colour</span>${SCHEMES.map(([k, l], i) => `<button type="button" class="sw sw--${k}${i ? '' : ' is-on'}" data-scheme="${k}" aria-label="${l}" aria-pressed="${!i}"></button>`).join('')}</div>`;

/* ───────────── HOME ───────────── */
const TICK = ['Price Lock at checkout', '45+ coupon combinations', '70,000 SKUs re-indexed', 'Strapi headless CMS', 'Amazon Pay integrated', 'Search-to-order +9.0%', 'Referral 6 → 13%', 'GA4 + BigQuery', 'Voice agent, −20% cost per order', 'CRM routing, −30% resolution time'];
function home() {
  const feat = CASES.slice(0, 3), rest = CASES.slice(3);
  return `
<section class="hero" id="top"><div class="wrap hero__g">
  <div class="hero__l">
    <p class="hello" aria-label="Hello"><span class="hello__w" id="hello">HELLO</span><span class="hello__s label"><i></i>Open to roles and consulting</span></p>
    <h1 class="h-hero" id="hero-h">I’m Anjor Tank, a product manager who architects and ships *the whole system.*</h1>
    <p class="lead" data-in>From the decision rule to the web and app that carry it. Five systems taken from problem to shipped across payments, growth, search and operations, now at GNC India and founding MESHHETU.</p>
    <div class="btn-row" data-in>${btn('/work', 'See the work')}${btn('/hire', 'Hire me', 'ghost')}</div>
    <ul class="chips" data-in><li>Mumbai</li><li>Product Manager</li><li>Product Architect</li><li>Founder, MESHHETU</li></ul>
  </div>
  <div class="hero__r hs" id="hero-art">
    <div class="hs__scene">${isoScene({ word: 'AT' })}</div>
    <div class="hs__card hs__card--a glass" data-fl><span class="label">Prepaid delivery</span><b>77.2 → 89.7%</b><svg viewBox="0 0 120 34" aria-hidden="true"><path class="sp" d="M2 28 C20 27 28 24 44 22 S70 16 82 12 106 5 118 3"/></svg><span class="hs__up">+12.5pp</span></div>
    <div class="hs__card hs__card--b glass" data-fl><p class="bub bub--q">Why did prepaid delivery jump?</p><p class="bub bub--a">We took payment at the order and locked the price, so it never changes.</p></div>
    <div class="hs__card hs__card--c glass" data-fl><img src="/img/anjor.webp" width="44" height="44" alt="Anjor Tank"><span><b>Anjor Tank</b><i class="label">Product architect · Mumbai</i></span></div>
    ${picker()}
  </div>
</div></section>

<div class="ticker" aria-hidden="true"><div class="ticker__t">${[...TICK, ...TICK].map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>

<section class="proof" id="proof"><div class="wrap"><ul class="mets">${PROOF.map((m, i) => `<li class="met" data-in><span class="label">T-0${i + 1} · ${m.tag}</span><strong ${m.to != null ? `data-count data-from="${m.from}" data-to="${m.to}" data-dp="${m.dp}" data-pre="${esc(m.pre || '')}" data-suf="${esc(m.suf || '')}"` : ''}>${m.to != null ? esc(m.pre + m.to.toFixed(m.dp) + m.suf) : esc(m.text)}</strong><span>${esc(m.label)}</span></li>`).join('')}</ul>
  <p class="foot-note label">Results are from product work at Truemeds, 2023 – 2026.</p></div></section>

<section class="sec work" id="work"><div class="wrap">
  ${sh('Selected work', 'Seven systems, *each with a decision.*', 'Open any card for the quick version. Each one leads to a full case study: context, trade-offs, what shipped and what I would change.')}
  <div class="bento">${feat.map((c, i) => caseCard(c, i, 'ccard--m')).join('')}${rest.map((c, i) => caseCard(c, i + 3, 'ccard--s')).join('')}</div>
  <div class="btn-row">${btn('/work', 'All case studies', 'ghost')}</div>
</div></section>

<section class="arc" id="arc"><div class="wrap arc__g">
  <div class="arc__l"><header class="sh"><p class="label eyebrow">The story so far</p><h2 class="h-2" data-split>From making demand to *building the system under it.*</h2></header>
    <ol class="arc__steps">${ARC.map((a, i) => `<li class="arc__s${i ? '' : ' is-on'}" data-act="${i}"><span class="arc__k">${a.k}</span><div><p class="label">${a.when}</p><h3 class="h-3">${esc(a.t)}</h3><p>${esc(a.d)}</p></div></li>`).join('')}</ol>
    <div class="btn-row">${btn('/journey', 'Read the full journey', 'ghost')}</div></div>
  <div class="arc__r" aria-hidden="true"><div class="stage">
    <div class="act act-0 is-on"><svg viewBox="0 0 320 240" class="wf"><path class="ln" d="M20 24H300L250 84H70Z"/><path class="ln" d="M70 96H250L222 148H98Z"/><path class="ac" d="M98 160H222L202 206H118Z"/><text class="tx mono" x="160" y="58" text-anchor="middle">IMPRESSIONS</text><text class="tx mono" x="160" y="126" text-anchor="middle">CLICKS</text><text class="tx mono inv" x="160" y="188" text-anchor="middle">ORDERS</text><path class="dm" d="M160 206v22"/><circle class="af" cx="160" cy="230" r="5"/></svg><p class="label">Act I · the funnel, seen from marketing</p></div>
    <div class="act act-1"><div class="mini">${['checkout', 'coupon', 'swap', 'ops'].map((n) => `<div>${wf(n)}</div>`).join('')}</div><p class="label">Act II · checkout, coupons, substitution, routing</p></div>
    <div class="act act-2"><div class="lock"><img src="/img/meshhetu-mark-dark.svg" width="72" height="72" alt=""><p class="lock__w">MESHHETU</p><p class="lock__h">हेतु</p></div><p class="label">Act III · architect, and founder</p></div>
  </div></div>
</div></section>

<section class="sec think" id="think"><div class="wrap">
  ${sh('How I think', 'Three beliefs *behind every system.*', 'They come from the case studies above, and they decide what I build first.')}
  <div class="asc">${BELIEFS.map((b, i) => `<article class="asc__c" data-in><canvas class="asc__cv" data-ascii="${b.art}" width="10" height="10" aria-hidden="true"></canvas>
    <div class="asc__t"><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p><ul>${b.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></article>`).join('')}</div>
</div></section>

<section class="sec arch" id="arch"><div class="wrap arch__g">
  <div class="arch__l">${sh('Product architect', 'I don’t stop at the spec. *I build the thing.*', 'I own web and app development end to end, from the wireframe and the API payload to the release and the number that moves.')}
    <ul class="ticks">${OWN.slice(0, 3).map((o) => `<li data-in><b>${esc(o.t)}</b><span>${esc(o.d)}</span></li>`).join('')}</ul>
    <div class="btn-row">${btn('/architect', 'See how I architect')}</div></div>
  <div class="arch__r">${mockup()}</div>
</div></section>

<section class="mesh" id="mesh"><div class="wrap">
  <div class="meshcard" data-in>
    <div class="meshcard__l"><div class="reel" data-reel aria-hidden="true"></div>
      <img class="meshcard__m" src="/img/meshhetu-mark-dark.svg" width="64" height="64" alt="">
      <p class="meshcard__w">MESHHETU</p><p class="label">${esc(MESH.tagline)}</p><p class="meshcard__h">${MESH.hindi}</p><p class="meshcard__s">${MESH.hindi} (hetu) · ${esc(MESH.meaning)}</p></div>
    <div class="meshcard__r"><p class="label eyebrow">Founder</p><h2 class="h-2">Built with a *purpose.* Engineered with a reason.</h2>
      <p class="lead">${esc(MESH.why)}</p>
      <ul class="trk">${MESH.tracks.map((t) => `<li><span class="trk__k">${t.k}</span><div><b>${esc(t.t)}</b><span class="chip chip--${t.tone}">${esc(t.s)}</span></div></li>`).join('')}</ul>
      <div class="btn-row">${btn('/meshhetu', 'The MESHHETU story', 'light')}${btn('/consulting', 'Consulting', 'ghost-d')}</div></div>
  </div></div></section>

<section class="sec path" id="path"><div class="wrap">
  ${sh('Journey', 'Marketing, then product, *then a company of my own.*', 'Marketing taught me demand. Product taught me systems. MESHHETU is where both meet.')}
  <ol class="strip">${[['2021', 'Digital marketing intern', '9LedgePro'], ['2022', 'Client services associate', 'Eggfirst'], ['2023', 'Management trainee', 'Neil Patel Digital'], ['2023 – 26', 'Associate Product Manager', 'Truemeds'], ['2026 –', 'Product Manager', 'GNC India'], ['2026 –', 'Founder, MESHHETU', 'Product Architect']].map(([w, r, o], i, a) => `<li class="strip__i${i >= a.length - 2 ? ' strip__i--now' : ''}" data-in><span class="label">${w}</span><i></i><b>${esc(r)}</b><span>${esc(o)}</span></li>`).join('')}</ol>
  <div class="btn-row">${btn('/journey', 'The full timeline', 'ghost')}</div>
</div></section>

<section class="sec beyond" id="beyond"><div class="wrap beyond__g">
  <div class="beyond__l">${sh('Beyond work', 'Fast karts, loud rooms, *slow water.*', 'Away from the keyboard I’m on a kart track, in a crowd with the lights down, or somewhere with a view. I’ll also travel for a good meal.')}
    <div class="btn-row">${btn('/beyond', 'See the other side', 'ghost')}</div></div>
  <div class="fan" id="fan" aria-hidden="true">${['kart-grid', 'lights-red', 'lake-overlook', 'f1-sim', 'paddle'].map((s, i) => `<figure class="fan__c" data-i="${i}" style="--i:${i}"><img src="/img/adventure/${s}.webp" alt="" width="300" height="400" loading="lazy"></figure>`).join('')}</div>
</div></section>
${cta()}`;
}

/* ───────────── WORK ───────────── */
function work() {
  return `
<section class="phead"><div class="wrap">
  <p class="label eyebrow" data-in>Work</p><h1 class="h-hero" data-split>Seven systems. *Each one a decision, a build and a number.*</h1>
  <p class="lead" data-in>Three of them are written up in full. The rest are shorter reads. Every case follows the same eight steps, so you can compare how I think across very different problems.</p>
  <div class="filters" id="filters" role="group" aria-label="Filter by domain" data-in>${TAGS.map((t, i) => `<button type="button" class="fchip${i ? '' : ' is-on'}" data-f="${t}" aria-pressed="${!i}">${t}</button>`).join('')}</div>
</div></section>
<section class="sec sec--tight"><div class="wrap"><div class="cgrid" id="cgrid">${CASES.map((c, i) => caseCard(c, i, i < 3 ? 'ccard--w' : 'ccard--s2')).join('')}</div></div></section>
<section class="sec steps"><div class="wrap">
  ${sh('How each case is written', 'Eight steps, *always in the same order.*', 'The structure matters as much as the result. It shows the discovery, the trade-offs and what I would do differently.')}
  <ol class="eight">${CASE_STEPS.map((s, i) => `<li data-in><span class="label">${pad(i + 1)}</span><b>${s}</b></li>`).join('')}</ol>
</div></section>
${cta()}`;
}

/* ───────────── CASE ───────────── */
function caseBody(sec, n = 0) {
  let h = `<section class="cs" id="${sec.id}" data-sec><p class="label cs__n" data-in><b>${pad(n)}</b>${esc(sec.h)}</p><h2 class="h-2" data-in>${esc(sec.h)}</h2>`;
  (sec.p || []).forEach((p) => { h += `<p class="cs__p" data-in>${esc(p)}</p>`; });
  if (sec.table) h += `<div class="tbl" data-in><table><thead><tr>${sec.table.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${sec.table.rows.map((r) => `<tr>${r.map((x, j) => (j ? `<td>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (sec.after && sec.table) h += `<p class="cs__p" data-in>${esc(sec.after)}</p>`;
  if (sec.call) h += `<div class="call" data-in><p class="label">The key call</p><p class="call__t">${esc(sec.call)}</p>${sec.bullets ? `<ul class="bl">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${sec.skipped ? `<div class="call__n"><p class="label">What we chose not to do</p><p>${esc(sec.skipped)}</p></div>` : ''}${sec.validation ? `<div class="call__n"><p class="label">How it was validated</p><p>${esc(sec.validation)}</p></div>` : ''}</div>`;
  else if (sec.bullets) h += `<ul class="bl" data-in>${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
  if (sec.after && !sec.table) h += `<p class="cs__p" data-in>${esc(sec.after)}</p>`;
  if (sec.items) h += `<div class="items">${sec.items.map((it, i) => `<article class="item" data-in><span class="label">${pad(i + 1)}</span>${it.wf ? `<div class="item__art">${wf(it.wf)}</div>` : ''}<h3 class="h-3">${esc(it.t)}</h3><p>${esc(it.d)}</p></article>`).join('')}</div>`;
  return h + `</section>`;
}

function casePage(c) {
  const i = CASES.indexOf(c), nx = CASES[(i + 1) % CASES.length], g = GLANCE[c.slug];
  const related = [...CASES.filter((x) => x !== c && x.tag === c.tag), ...CASES.filter((x) => x !== c && x.tag !== c.tag)].slice(0, 3);
  const secs = [['hook', 'The hook'], ...c.body.map((s) => [s.id, s.h])];
  return `
<article>
<section class="chead"><div class="wrap">
  <nav class="crumbs label" aria-label="Breadcrumb"><a href="/work">Work</a><i>/</i><span>${esc(c.tag)}</span><i>/</i><span>Case ${c.n}</span></nav>
  <div class="chead__g"><div><p class="label eyebrow" data-in>${esc(c.cat)} · ${esc(c.year)}</p><h1 class="h-hero" data-split>${esc(c.title)}</h1><p class="lead" data-in>${esc(c.line)}</p>
    <ul class="chips" data-in><li>${c.tag}</li><li>${esc(g.read)} read</li><li>Truemeds</li></ul></div>
    <div class="chead__art" data-in>${wf(c.wf)}</div></div>
  <ul class="mets mets--3">${c.metrics.map(([v, l]) => `<li class="met" data-in><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('')}</ul>
</div></section>
${studioCaseMap(c)}
<div class="wrap cbody">
  <aside class="toc" aria-label="On this page"><p class="label">On this page</p><ol>${secs.map(([id, t], k) => `<li><a href="#${id}"${k ? '' : ' aria-current="true"'}><i>${pad(k + 1)}</i>${esc(t)}</a></li>`).join('')}</ol><div class="toc__bar"><i id="prog"></i></div></aside>
  <div class="cmain">
    <section class="cs" id="hook" data-sec><blockquote class="hookq" data-in>${esc(c.hook)}</blockquote>
      ${c.table ? `<div class="tbl" data-in><table><thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Change</th></tr></thead><tbody>${c.table.map((r) => `<tr>${r.map((x, j) => (j ? `<td${j === 3 ? ' class="chg"' : ''}>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</section>
    ${c.body.map((s, k) => caseBody(s, k + 2)).join('')}
  </div>
  <aside class="glance glass" aria-label="At a glance"><p class="label">At a glance</p>
    <dl><div><dt>Role</dt><dd>${esc(g.role)}</dd></div><div><dt>Company</dt><dd>Truemeds</dd></div><div><dt>Team</dt><dd>${esc(g.team)}</dd></div><div><dt>Timeline</dt><dd>${esc(c.year)}</dd></div><div><dt>Domain</dt><dd>${esc(c.tag)}</dd></div></dl>
    <p class="label">Built with</p><ul class="chips chips--sm">${g.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    <div class="glance__r"><p class="label">Result</p>${c.metrics.slice(0, 2).map(([v, l]) => `<p><b>${esc(v)}</b><span>${esc(l)}</span></p>`).join('')}</div>
    <a class="btn btn--primary btn--sm" href="/contact"><span>Hire me</span>${I.arrow}</a>
  </aside>
</div>
<section class="sec rel"><div class="wrap">
  ${sh('Keep reading', 'More *systems, more decisions.*', '')}
  <div class="relg">${related.map((x, k) => caseCard(x, k, 'ccard--s')).join('')}</div>
</div></section>
<section class="sec nextc"><div class="wrap"><a class="nextc__a" href="/work/${nx.slug}"><span class="label">Next case · ${nx.n}</span><b class="h-2">${esc(nx.title)}</b><span class="nextc__go">${I.arrow}</span></a></div></section>
</article>
${cta('Like how I think? Let’s talk.')}`;
}

/* ───────────── ARCHITECT ───────────── */
function architect() {
  return `
<section class="phead"><div class="wrap phead__g">
  <div><p class="label eyebrow" data-in>Product architect</p><h1 class="h-hero" data-split>I own the web, the app and *the system between them.*</h1>
  <p class="lead" data-in>A product manager decides what to build. An architect also decides how it fits together, and stays until it ships. I work on both sides: the wireframe and the schema, the experience and the rule engine behind it.</p>
  <div class="btn-row" data-in>${btn('/work', 'See what I built')}${btn('/contact?intent=job', 'Hire me', 'ghost')}</div></div>
  <div class="phead__art" id="arch-art">${isoStack()}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('The stack', 'Four layers, *one owner.*', 'Hover a layer to find it in the drawing. Each one is a place where a product breaks or compounds.')}
  <div class="layers" id="layers">${LAYERS.map((l, i) => `<article class="layer" data-i="${i}" tabindex="0" data-in><span class="label">Layer ${l.n}</span><h3 class="h-3">${esc(l.t)}</h3><p class="layer__s">${esc(l.s)}</p><p>${esc(l.d)}</p></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('What I own', 'Web, app, platform, *and the tools behind them.*', 'The systems are real and shipped. This is the surface area I own day to day.')}
  <div class="own">${OWN.map((o) => `<article class="card" data-in><h3 class="h-3">${esc(o.t)}</h3><p>${esc(o.d)}</p><ul class="chips chips--sm">${o.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article>`).join('')}</div>
</div></section>

<section class="sec ship"><div class="wrap ship__g">
  <div>${sh('How it ships', 'From wireframe to *a number that moved.*', 'I work with the engineering lead on schemas and payloads, and with ops on the floor before anything goes live. The log below is the checkout rebuild.')}
  <div class="mock-wrap">${mockup()}</div></div>
  <div class="win" id="rel"><div class="win__h"><i></i><i></i><i></i><span class="label">release.log · checkout rebuild</span></div>
    <ol class="win__b">${RELEASE.map(([v, w]) => `<li class="step"><span class="step__s"><b class="spin"></b>${I.check}</span><span class="step__v">${v}</span><code>${esc(w)}</code></li>`).join('')}</ol></div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Toolbox', 'What I reach for.', '')}
  <ul class="chips chips--lg" data-in>${TOOLS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
</div></section>
${cta('Need someone who can own it end to end?')}`;
}

/* ───────────── MESHHETU ───────────── */
function meshhetu() {
  return `
<section class="mhero"><div class="wrap mhero__g">
  <div class="meshcard meshcard--solo" data-in><div class="meshcard__l"><div class="reel" data-reel aria-hidden="true"></div>
    <img class="meshcard__m" src="/img/meshhetu-mark-dark.svg" width="64" height="64" alt="">
    <p class="meshcard__w">MESHHETU</p><p class="label">${esc(MESH.tagline)}</p><p class="meshcard__h">${MESH.hindi}</p><p class="meshcard__s">${MESH.hindi} (hetu) · ${esc(MESH.meaning)}</p></div></div>
  <div class="mhero__r"><p class="label eyebrow" data-in>Founder · 2026 – now</p><h1 class="h-hero" data-split>Built with a *purpose.* Engineered with a reason.</h1>
    <p class="lead" data-in>${esc(MESH.why)}</p><p class="cs__p" data-in>${esc(MESH.principle)}</p>
    <div class="btn-row" data-in>${btn(SITE.meshhetu, 'Visit meshhetu.com', 'primary', true)}${btn('/contact?intent=consult', 'Consult with me', 'ghost')}</div></div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('What it is', 'Find the revenue leaks *hiding between your tools.*', MESH.category + '. Your tools capture the signals. Your teams make the decisions. Too often the two do not connect, and we close that gap.')}
  <div class="tracks">${MESH.tracks.map((t) => `<article class="track" data-in><div class="track__h"><span class="trk__k">${t.k}</span><span class="chip chip--${t.tone}">${esc(t.s)}</span></div><h3 class="h-3">Track ${t.k} · ${esc(t.t)}</h3><p>${esc(t.d)}</p></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('How it works', 'A signal becomes *a decision worth acting on.*', 'Six steps and four human gates. Any gate can send the work back with a reason.')}
  <div class="flow" id="flow"><ol class="flow__s">${MESH.steps.map(([n, t, a, d], i) => `<li class="flow__i" data-in><span class="label">${n}</span><b>${t}</b><span class="chip chip--${a === 'Code' ? 'ok' : a === 'Agent' ? 'vi' : 'sky'}">${a}</span><p>${esc(d)}</p></li>`).join('')}</ol>
    <ol class="flow__g">${MESH.gates.map((g, i) => `<li><i>${i + 1}</i>${g}</li>`).join('')}</ol></div>
  <div class="rules">${MESH.rules.map(([t, d], i) => `<article class="rule" data-in><span class="label">Rule ${pad(i + 1)}</span><h3 class="h-3">${esc(t)}.</h3><p>${esc(d)}</p></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('The founders', 'Put a *product architect* and an *AI engineer* on your revenue system.', 'The two of us run every engagement. No hand-offs to a junior team.')}
  <div class="fnd">${MESH.founders.map((f, i) => `<article class="card" data-in><p class="label">${esc(f.p)} · owns ${esc(f.o)}</p><h3 class="h-3">${esc(f.n)} <span>${esc(f.r)}</span></h3><p>${esc(f.d)}</p></article>`).join('')}</div>
</div></section>
${cta('Have a metric that won’t move?')}`;
}

/* ───────────── JOURNEY ───────────── */
function role(r) {
  return `<article class="role" data-in><div class="role__w label">${esc(r.when)}</div><div class="role__c"><h3 class="h-3">${esc(r.role)}</h3><p class="role__o">${esc(r.org)}</p><p>${esc(r.text)}</p>${r.tags ? `<ul class="chips chips--sm">${r.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</div></article>`;
}
function journey() {
  return `
<section class="phead"><div class="wrap">
  <p class="label eyebrow" data-in>Journey</p><h1 class="h-hero" data-split>From campaigns to *commerce systems.*</h1>
  <p class="lead" data-in>I started in marketing and client services, moved into product, and now build commerce systems and a company around them. Read it top to bottom.</p>
</div></section>
<section class="sec sec--tight"><div class="wrap"><div class="tline" id="tline"><div class="tline__rail"><i id="tline-fill"></i><b id="tline-dot"></b></div>
  ${CHAPTERS.map((c) => `<section class="chap"><header class="chap__h" data-in><span class="chap__k">${c.k}</span><div><p class="label">${esc(c.span)}</p><h2 class="h-2">${esc(c.t)}</h2><p class="lead">${esc(c.d)}</p></div></header>${c.roles.map(role).join('')}</section>`).join('')}
</div></div></section>

<section class="mesh" id="mesh"><div class="wrap">
  <div class="meshcard" data-in>
    <div class="meshcard__l"><div class="reel" data-reel aria-hidden="true"></div><img class="meshcard__m" src="/img/meshhetu-mark-dark.svg" width="64" height="64" alt=""><p class="meshcard__w">MESHHETU</p><p class="label">${esc(MESH.tagline)}</p><p class="meshcard__h">${MESH.hindi}</p></div>
    <div class="meshcard__r"><p class="label eyebrow">Now · Founder and Product Architect</p><h2 class="h-2">The role I built *for myself.*</h2>
      <p class="lead">Founder-led GTM engineering for ecommerce and D2C: strategic consulting, modular systems intelligence, and ROQIVA in development. Product architect for every engagement.</p>
      <div class="btn-row">${btn('/meshhetu', 'The MESHHETU story', 'light')}${btn(SITE.meshhetu, 'meshhetu.com', 'ghost-d', true)}</div></div></div></div></section>

<section class="sec"><div class="wrap trio">
  <div data-in><h3 class="label">Education</h3><ul class="plain">${EDU.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul></div>
  <div data-in><h3 class="label">Certifications</h3><ul class="plain">${CERTS.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
  <div data-in><h3 class="label">Skills</h3><ul class="chips chips--sm">${SKILLS.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
</div></section>
${cta()}`;
}

/* ───────────── BEYOND ───────────── */
function beyond() {
  return `
<section class="phead"><div class="wrap phead__g">
  <div><p class="label eyebrow" data-in>Beyond work</p><h1 class="h-hero" data-split>Fast karts, loud rooms, *slow water.*</h1>
  <p class="lead" data-in>The person behind the product decisions. Away from the keyboard I’m on a kart track, in a crowd with the lights down, or somewhere with a view. I’ll also travel for a good meal.</p></div>
  <figure class="me me--big" data-in><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank standing at a turquoise mountain lake in a blue jacket" loading="eager"></figure>
</div></section>
<section class="sec sec--tight"><div class="wrap">
  ${sh('What I care about', 'Six obsessions, *no particular order.*', '')}
  <div class="loves">${LOVES.map(([t, d], i) => `<article class="love" data-in><span class="label">${pad(i + 1)}</span><h3 class="h-3">${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div>
</div></section>
<section class="sec"><div class="wrap">
  ${sh('The reel', 'Three modes: *speed, live and wander.*', '')}
  <div class="filters" id="pfilters" role="group" aria-label="Filter photos">${['All', 'Speed', 'Live', 'Wander'].map((t, i) => `<button type="button" class="fchip${i ? '' : ' is-on'}" data-f="${t}" aria-pressed="${!i}">${t}</button>`).join('')}</div>
  <div class="mas" id="mas">${PHOTOS.map((p, i) => `<figure class="ph" data-g="${p.g}" data-in><img src="/img/adventure/${p.src}.webp" width="${p.w}" height="998" alt="${esc(ALT[p.src])}" loading="lazy"><figcaption><span class="label">${p.g}</span>${esc(p.cap)}</figcaption></figure>`).join('')}</div>
</div></section>
${cta('Let’s talk, in a room with good sound.')}`;
}

/* ───────────── CONTACT ───────────── */
function contact() {
  return `
<section class="phead"><div class="wrap">
  <p class="label eyebrow" data-in>Contact</p><h1 class="h-hero" data-split>Two ways to reach me. *Pick the one that fits.*</h1>
  <p class="lead" data-in>A role, or a problem that needs consulting. I read everything myself and reply with where I would look first.</p>
</div></section>
<section class="sec sec--tight"><div class="wrap cgd">
  <div class="cform" data-in>
    <div class="pick" role="radiogroup" aria-label="What is this about?">${DOORS.map((d, i) => `<button type="button" class="pick__o${i ? '' : ' is-on'}" role="radio" aria-checked="${!i}" data-intent="${d.id}"><span class="label">${esc(d.s)}</span><b>${esc(d.t)}</b></button>`).join('')}</div>
    <form class="form" id="form" novalidate>
      <input type="hidden" name="access_key" value="${SITE.form.key}"><input type="hidden" name="subject" value="New enquiry from the portfolio"><input type="hidden" name="intent" id="f-intent" value="job">
      <input class="hp" type="text" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form__g">
        <label class="fld"><span class="label">Name</span><input name="name" required autocomplete="name"></label>
        <label class="fld"><span class="label">Work email</span><input name="email" type="email" required autocomplete="email"></label>
        <label class="fld"><span class="label" id="l-a">Company</span><input name="company" id="f-a" autocomplete="organization"></label>
        <label class="fld"><span class="label" id="l-s">Role</span><select name="kind" id="f-s"></select></label>
      </div>
      <label class="fld"><span class="label" id="l-m">What would you like to talk about?</span><textarea name="message" rows="5" required></textarea></label>
      <div class="form__f"><button class="btn btn--primary" type="submit"><span id="f-go">Start a conversation</span>${I.arrow}</button><p class="label" id="f-st" role="status" aria-live="polite"></p></div>
    </form>
  </div>
  <aside class="direct" data-in><h2 class="h-3">Or go direct</h2>
    <a class="direct__r" href="mailto:${SITE.email}"><span class="label">Email</span><b>${SITE.email}</b>${I.up}</a>
    <a class="direct__r" href="${SITE.linkedin}" target="_blank" rel="noopener"><span class="label">LinkedIn</span><b>/in/anjor-tank</b>${I.up}</a>
    <a class="direct__r" href="${SITE.calendly}" target="_blank" rel="noopener"><span class="label">Calendar</span><b>Book a call</b>${I.up}</a>
    <p class="direct__n">Based in Mumbai (IST). Replies within a couple of working days.</p></aside>
</div></section>`;
}

/* ───────────── HIRE ───────────── */
function hire() {
  const xp = CHAPTERS.slice().reverse().flatMap((c) => (c.k === 'III' ? c.roles : c.roles.slice().reverse()));
  return `
<section class="phead phead--scene"><div class="wrap phead__g">
  <div><p class="label eyebrow" data-in>Hire me</p><h1 class="h-hero" data-split>A product manager who *architects and ships* the whole system.</h1>
    <p class="lead" data-in>${esc(HIRE.pitch)}</p>
    <div class="btn-row" data-in>${btn('/contact?intent=job', 'Start a conversation')}${btn(SITE.linkedin, 'LinkedIn', 'ghost', true)}</div>
    <div class="open glass" data-in><p class="label"><i></i>Open to</p><ul>${HIRE.roles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul><p class="open__w">${esc(HIRE.where)}</p></div></div>
  <div class="hs hs--page" id="page-art"><div class="hs__scene">${isoScene({ word: 'OK', scene: 'hire' })}</div>${picker()}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('How I work', 'The same four moves, *every time.*', 'Different problems, one pattern. It is why the results in the next section look so different and read so alike.')}
  <ol class="moves">${HIRE.pattern.map(([t, d], i) => `<li class="move" data-in><span class="move__n">${pad(i + 1)}</span><h3 class="h-3">${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Results', 'Twelve numbers *I can explain.*', 'Across payments, search, growth, AI and operations. Each has a case study or a clear owner behind it, and none depends on a single project.')}
  <ul class="wins">${WINS.map((w) => `<li class="win2" data-in><span class="label">${esc(w.k)}</span><strong>${esc(w.v)}</strong><p>${esc(w.d)}</p></li>`).join('')}</ul>
  <div class="btn-row">${btn('/work', 'Read the case studies', 'ghost')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Where I fit', 'Four kinds of *PM seat.*', 'I can sit in any of these, and I am at my best where they overlap.')}
  <div class="fit">${HIRE.fit.map(([t, d], i) => `<article class="card" data-in><span class="label">${pad(i + 1)}</span><h3 class="h-3">${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Experience', 'Where I have *done the work.*', 'Newest first. The full story is on the journey page.')}
  <div class="xp">${xp.map((r) => `<article class="role" data-in><div class="role__w label">${esc(r.when)}</div><div class="role__c"><h3 class="h-3">${esc(r.role)}</h3><p class="role__o">${esc(r.org)}</p><p>${esc(r.text)}</p>${r.tags ? `<ul class="chips chips--sm">${r.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</div></article>`).join('')}</div>
  <div class="btn-row">${btn('/journey', 'The full journey', 'ghost')}</div>
</div></section>

<section class="sec"><div class="wrap trio">
  <div data-in><h3 class="label">Strongest areas</h3><ul class="chips chips--sm">${HIRE.strengths.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
  <div data-in><h3 class="label">Toolbox</h3><ul class="chips chips--sm">${TOOLS.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
  <div data-in><h3 class="label">Education and certifications</h3><ul class="plain">${EDU.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}${CERTS.slice(0, 4).map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
</div></section>
${cta('Let’s talk about the role.')}`;
}

/* ───────────── CONSULTING ───────────── */
function consulting() {
  return `
<section class="phead phead--scene"><div class="wrap phead__g">
  <div><p class="label eyebrow" data-in>Consulting · MESHHETU</p><h1 class="h-hero" data-split>Find the revenue leak *between your tools.*</h1>
    <p class="lead" data-in>${esc(CONSULT.lead)}</p>
    <div class="btn-row" data-in>${btn('/contact?intent=consult', 'Bring me the number')}${btn(SITE.calendly, 'Book a call', 'ghost', true)}</div>
    <ul class="chips" data-in><li>Ecommerce</li><li>D2C</li><li>GTM engineering</li><li>RevOps</li></ul></div>
  <div class="hs hs--page" id="page-art"><div class="hs__scene">${isoScene({ word: 'PM', scene: 'consult' })}</div>${picker()}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Three ways in', 'Start small, *or embed.*', 'Each one ends in something your team can build or run. None of them ends in a deck.')}
  <div class="offers">${CONSULT.offers.map((o) => `<article class="offer" data-in><div class="offer__h"><span class="trk__k">${o.k}</span><span class="chip">${esc(o.time)}</span></div><h3 class="h-3">${esc(o.t)}</h3><p>${esc(o.d)}</p><ul class="bl">${o.gets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('How an engagement runs', 'A signal becomes *a decision worth acting on.*', 'Six steps and four human gates. Any gate can send the work back with a reason.')}
  <div class="flow" id="flow"><ol class="flow__s">${MESH.steps.map(([n, t, a, d]) => `<li class="flow__i" data-in><span class="label">${n}</span><b>${t}</b><span class="chip chip--${a === 'Code' ? 'ok' : a === 'Agent' ? 'vi' : 'sky'}">${a}</span><p>${esc(d)}</p></li>`).join('')}</ol>
    <ol class="flow__g">${MESH.gates.map((g, i) => `<li><i>${i + 1}</i>${g}</li>`).join('')}</ol></div>
</div></section>

<section class="sec"><div class="wrap fitg">
  <div class="card card--yes" data-in><p class="label">A good fit</p><ul class="bl">${CONSULT.fit.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  <div class="card" data-in><p class="label">Probably not</p><ul class="bl bl--no">${CONSULT.notfit.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('Proof', 'The work *behind the offer.*', 'Three systems I took from a stuck number to a shipped fix.')}
  <div class="relg">${CASES.slice(0, 3).map((c, i) => caseCard(c, i, 'ccard--s')).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${sh('The team', 'A *product architect* and an *AI engineer.*', 'The two of us run every engagement. No hand-offs to a junior team.')}
  <div class="fnd">${MESH.founders.map((f) => `<article class="card" data-in><p class="label">${esc(f.p)} · owns ${esc(f.o)}</p><h3 class="h-3">${esc(f.n)} <span>${esc(f.r)}</span></h3><p>${esc(f.d)}</p></article>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap faqw">
  ${sh('Questions', 'Before you *write in.*', '')}
  <div class="faq">${CONSULT.faq.map(([q, a]) => `<details class="qa" data-in><summary>${esc(q)}<span aria-hidden="true">${I.plus}</span></summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>
${cta('Have a metric that won’t move?')}`;
}

function notfound() {
  return `<section class="phead nf"><div class="wrap"><p class="label eyebrow">404 · Off the drawing</p><h1 class="h-hero">Head back to *a page that exists.*</h1><p class="lead">That address doesn’t match anything on this site.</p><div class="btn-row">${btn('/', 'Go home')}${btn('/work', 'See the work', 'ghost')}</div></div></section>`;
}

/* ───────────── route table ───────────── */
const D = 'Anjor Tank is a Product Manager at GNC India, working across ecommerce, growth, customer experience and internal platforms, and founder of MESHHETU.';
export function routes() {
  return [
    { path: '/', file: 'index.html', title: 'Anjor Tank | Product Manager, Ecommerce & Growth', desc: D, body: studioHome, boot: false },
    { path: '/work', file: 'work/index.html', title: 'Work & Case Studies | Anjor Tank', desc: 'Product decisions across checkout, growth, search, fulfilment and customer operations.', body: studioWork },
    ...CASES.map(c => ({ path: '/work/' + c.slug, file: `work/${c.slug}/index.html`, title: `${c.title} | Anjor Tank`, desc: c.line, body: () => casePage(c) })),
    { path: '/about', file: 'about/index.html', title: 'About | Anjor Tank', desc: 'From marketing to product management at Truemeds and GNC India, and founding MESHHETU.', body: studioAbout },
    { path: '/contact', file: 'contact/index.html', title: 'Contact | Anjor Tank', desc: 'Reach Anjor Tank for product roles, collaborations and introductions.', body: studioContact },
    { path: '/404', file: '404.html', title: 'Page not found | Anjor Tank', desc: 'Page not found.', body: notfound },
  ];
}

export function renderRoute(r) {
  const ld = r.path === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Anjor Tank', jobTitle: 'Product Manager', url: SITE.origin, sameAs: [SITE.linkedin, SITE.meshhetu], address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' } })}</script>` : '';
  return shell({ path: r.path, title: r.title, desc: r.desc, body: r.body(), extra: ld });
}
