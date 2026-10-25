/* ==========================================================================
   RENDER — turns content.js into the HTML for every page.
   Used at build time by vite.config.js (full pages) and at run time by
   main.js (the case quick-view). No framework: strings in, strings out.
   ========================================================================== */
import { SITE, NAV, PROOF, BELIEFS, ARC, LAYERS, OWN, RELEASE, TOOLS, CASES, CASE_STEPS, TAGS, CHAPTERS, EDU, CERTS, SKILLS, MESH, PHOTOS, ALT, LOVES, DOORS, HELLOS } from './content.js';
import { isoStack, wf, mockup } from './art.js';

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
function nav(path) {
  const cur = (p) => (path === p || path.startsWith(p + '/') ? ' aria-current="page"' : '');
  return `<header class="nav" id="nav"><div class="nav__in">
    <a class="brand" href="/" aria-label="Anjor Tank, home">${key()}<span class="brand__t">ANJOR TANK</span></a>
    <nav class="nav__links" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}</nav>
    <div class="nav__r">
      <button class="kbtn" id="theme" type="button" aria-label="Switch colour theme">${I.sun}${I.moon}</button>
      <a class="btn btn--primary btn--sm nav__cta" href="/contact"><span>Let’s talk</span></a>
      <button class="kbtn burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sheet">${I.menu}</button>
    </div></div>
    <div class="sheet" id="sheet" hidden>${NAV.map(([h, t], i) => `<a href="${h}"><i>${pad(i + 1)}</i>${t}</a>`).join('')}<a href="/contact"><i>06</i>Contact</a></div>
  </header>`;
}

function foot() {
  const links = [...NAV, ['/contact', 'Contact']];
  return `<footer class="foot" id="foot"><div class="wrap">
    <div class="foot__top">
      <div class="foot__id">${key()}<p class="foot__name">Anjor Tank</p><p class="foot__line">Product manager. Product architect. Founder, MESHHETU.</p></div>
      <div class="foot__col"><p class="label">Pages</p>${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      <div class="foot__col"><p class="label">Elsewhere</p><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:${SITE.email}">Email</a><a href="${SITE.calendly}" target="_blank" rel="noopener">Book a call</a><a href="${SITE.meshhetu}" target="_blank" rel="noopener">meshhetu.com</a></div>
    </div>
    <div class="foot__bar"><p class="label">Mumbai · ${SITE.lat} ${SITE.lon}</p><p class="label">© 2026 Anjor Tank</p></div>
  </div></footer>`;
}

function cta(title = 'Two ways to work with me.') {
  return `<section class="sec cta" id="cta"><div class="wrap">
    ${sh('Next', title, 'Reach out for a role, or for a consulting problem. Either way, you will hear from me directly.')}
    <div class="doors">${DOORS.map((d, i) => `<a class="door ${i ? 'door--ink' : ''}" href="/contact?intent=${d.id}" data-in>
      <p class="label">${esc(d.s)}</p><h3 class="h-3">${esc(d.t)}</h3><p>${esc(d.d)}</p><span class="door__go">${esc(d.cta)}${I.arrow}</span></a>`).join('')}</div>
  </div></section>`;
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
<div class="space" aria-hidden="true"><div class="space__dots"></div><div class="space__glow"></div></div>
${path === '/' ? intro() : ''}
${nav(path)}
<main id="main">${body.replace(/\*([^*<>\n]+)\*/g, '<span class="hl">$1</span>')}</main>
${foot()}
<dialog class="qv" id="qv" aria-labelledby="qv-h"><div class="qv__bar"><p class="label" id="qv-c"></p><div class="qv__nav"><button class="kbtn" type="button" id="qv-p" aria-label="Previous case">${I.arrow}</button><button class="kbtn" type="button" id="qv-n" aria-label="Next case">${I.arrow}</button><button class="kbtn" type="button" id="qv-x" aria-label="Close">${I.close}</button></div></div><div class="qv__body" id="qv-b"></div></dialog>
<div class="pt" id="pt" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
<div class="cur" id="cur" aria-hidden="true"></div>
<script type="module" src="/src/main.js"></script>
</body></html>`;
}

function intro() {
  return `<div class="intro" id="intro" aria-hidden="true"><canvas id="globe"></canvas>
    <div class="intro__c"><p class="intro__w" id="intro-w">HELLO</p><p class="label" id="intro-l">English</p></div>
    <p class="intro__hud label" id="intro-h">Locating · ${SITE.lat} ${SITE.lon}</p>
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
    <dl class="ccard__m">${c.metrics.slice(0, 2).map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <span class="ccard__go" aria-hidden="true">Quick view ${I.plus}</span>
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

/* ───────────── HOME ───────────── */
function home() {
  const feat = CASES.slice(0, 3), rest = CASES.slice(3);
  return `
<section class="hero" id="top"><div class="wrap hero__g">
  <div class="hero__l">
    <p class="hello" aria-label="Hello"><span class="hello__w" id="hello">HELLO</span><span class="hello__l label" id="hello-l">English</span></p>
    <h1 class="h-hero" id="hero-h">I’m Anjor Tank, a product manager who architects and ships *the whole system.*</h1>
    <p class="lead" data-in>From the decision rule to the web and app that carry it. Five systems taken from problem to shipped across payments, growth, search and operations, and now founding MESHHETU.</p>
    <div class="btn-row" data-in>${btn('/work', 'See the work')}${btn('/contact', 'Work with me', 'ghost')}</div>
    <ul class="chips" data-in><li>Mumbai</li><li>Product Manager</li><li>Product Architect</li><li>Founder, MESHHETU</li></ul>
  </div>
  <div class="hero__r" id="hero-art">${isoStack()}
    <figure class="me" data-in><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank standing at a turquoise mountain lake in a blue jacket" loading="eager"><figcaption><b>Anjor Tank</b><span class="label">Mumbai · ${SITE.lat}</span></figcaption></figure>
  </div>
</div></section>

<section class="proof" id="proof"><div class="wrap"><ul class="mets">${PROOF.map((m, i) => `<li class="met" data-in><span class="label">T-0${i + 1} · ${m.tag}</span><strong ${m.to != null ? `data-count data-from="${m.from}" data-to="${m.to}" data-dp="${m.dp}" data-pre="${esc(m.pre || '')}" data-suf="${esc(m.suf || '')}"` : ''}>${m.to != null ? esc(m.pre + m.to.toFixed(m.dp) + m.suf) : esc(m.text)}</strong><span>${esc(m.label)}</span></li>`).join('')}</ul>
  <p class="foot-note label">Results are from product work at a Series C online pharmacy, 2023 – 2026.</p></div></section>

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
  ${sh('How I think', 'Three beliefs *behind every system.*', 'They come from the case studies below, and they decide what I build first.')}
  <div class="asc">${BELIEFS.map((b, i) => `<article class="asc__c" data-in><canvas class="asc__cv" data-ascii="${b.art}" width="10" height="10" aria-hidden="true"></canvas>
    <div class="asc__t"><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p><ul>${b.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></article>`).join('')}</div>
</div></section>

<section class="sec work" id="work"><div class="wrap">
  ${sh('Selected work', 'Seven systems, *each with a decision.*', 'Open any card for the quick version. Each one leads to the full case study: context, trade-offs, what shipped and what I would change.')}
  <div class="bento">${feat.map((c, i) => caseCard(c, i, i === 0 ? 'ccard--feat' : 'ccard--b')).join('')}${rest.map((c, i) => caseCard(c, i + 3, 'ccard--s')).join('')}</div>
  <div class="btn-row">${btn('/work', 'All case studies', 'ghost')}</div>
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
      <div class="btn-row">${btn('/meshhetu', 'The MESHHETU story', 'light')}${btn(SITE.meshhetu, 'meshhetu.com', 'ghost-d', true)}</div></div>
  </div></div></section>

<section class="sec path" id="path"><div class="wrap">
  ${sh('Journey', 'Four roles, then *a company of my own.*', 'Marketing taught me demand. Product taught me systems. MESHHETU is where both meet.')}
  <ol class="strip">${[['2021', 'Digital marketing intern', '9LedgePro'], ['2022', 'Client services associate', 'Eggfirst'], ['2023', 'Management trainee', 'Neil Patel Digital'], ['2023 – 26', 'Associate Product Manager', 'Series C online pharmacy'], ['2026 –', 'Founder, MESHHETU', 'Product Architect']].map(([w, r, o], i, a) => `<li class="strip__i${i === a.length - 1 ? ' strip__i--now' : ''}" data-in><span class="label">${w}</span><i></i><b>${esc(r)}</b><span>${esc(o)}</span></li>`).join('')}</ol>
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
function caseBody(sec) {
  let h = `<section class="cs" id="${sec.id}" data-sec><h2 class="h-2" data-in>${esc(sec.h)}</h2>`;
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
  const i = CASES.indexOf(c), nx = CASES[(i + 1) % CASES.length];
  return `
<article>
<section class="chead"><div class="wrap"><a class="back" href="/work">${I.arrow} All case studies</a>
  <div class="chead__g"><div><p class="label eyebrow" data-in>Case ${c.n} · ${esc(c.cat)}</p><h1 class="h-hero" data-split>${esc(c.title)}</h1><p class="lead" data-in>${esc(c.line)}</p>
    <dl class="meta" data-in><div><dt>Role</dt><dd>Associate Product Manager</dd></div><div><dt>Context</dt><dd>Series C online pharmacy</dd></div><div><dt>Timeline</dt><dd>${esc(c.year)}</dd></div><div><dt>Domain</dt><dd>${c.tag}</dd></div></dl></div>
    <div class="chead__art" data-in>${wf(c.wf)}</div></div>
  <ul class="mets mets--3">${c.metrics.map(([v, l]) => `<li class="met" data-in><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('')}</ul>
</div></section>
<div class="wrap cbody">
  <aside class="toc" aria-label="On this page"><p class="label">On this page</p><ol>${[['hook', 'The hook'], ...c.body.map((s) => [s.id, s.h])].map(([id, t], k) => `<li><a href="#${id}"${k ? '' : ' aria-current="true"'}><i>${pad(k + 1)}</i>${esc(t)}</a></li>`).join('')}</ol><div class="toc__bar"><i id="prog"></i></div></aside>
  <div class="cmain">
    <section class="cs" id="hook" data-sec><blockquote class="hookq" data-in>${esc(c.hook)}</blockquote>
      ${c.table ? `<div class="tbl" data-in><table><thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Change</th></tr></thead><tbody>${c.table.map((r) => `<tr>${r.map((x, j) => (j ? `<td${j === 3 ? ' class="chg"' : ''}>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</section>
    ${c.body.map(caseBody).join('')}
  </div>
</div>
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

function notfound() {
  return `<section class="phead nf"><div class="wrap"><p class="label eyebrow">404 · Off the drawing</p><h1 class="h-hero">Head back to *a page that exists.*</h1><p class="lead">That address doesn’t match anything on this site.</p><div class="btn-row">${btn('/', 'Go home')}${btn('/work', 'See the work', 'ghost')}</div></div></section>`;
}

/* ───────────── route table ───────────── */
const D = 'Anjor Tank is a product manager and product architect in Mumbai who owns web and app development end to end, and founder of MESHHETU.';
export function routes() {
  const R = [
    { path: '/', file: 'index.html', title: 'Anjor Tank | Product manager and product architect', desc: D, body: home, boot: true },
    { path: '/work', file: 'work/index.html', title: 'Work | Anjor Tank', desc: 'Seven product systems across payments, growth, search, AI and operations, each with the decision behind it and the number that moved.', body: work },
    ...CASES.map((c) => ({ path: '/work/' + c.slug, file: `work/${c.slug}/index.html`, title: `${c.title} | Anjor Tank`, desc: c.line, body: () => casePage(c) })),
    { path: '/architect', file: 'architect/index.html', title: 'Product architect | Anjor Tank', desc: 'How Anjor Tank owns web, app, platform and internal tools end to end, from wireframe and schema to release and result.', body: architect },
    { path: '/meshhetu', file: 'meshhetu/index.html', title: 'MESHHETU | Anjor Tank', desc: 'MESHHETU is the systems engineering company Anjor Tank founded: strategic consulting, modular intelligence and ROQIVA in development.', body: meshhetu },
    { path: '/journey', file: 'journey/index.html', title: 'Journey | Anjor Tank', desc: 'From campaigns to commerce systems: Anjor Tank’s path through marketing, product and founding MESHHETU.', body: journey },
    { path: '/beyond', file: 'beyond/index.html', title: 'Beyond work | Anjor Tank', desc: 'Karts, live music, mountains and good food: what Anjor Tank does away from the keyboard.', body: beyond },
    { path: '/contact', file: 'contact/index.html', title: 'Contact | Anjor Tank', desc: 'Reach Anjor Tank for a product role or for consulting through MESHHETU.', body: contact },
    { path: '/404', file: '404.html', title: 'Page not found | Anjor Tank', desc: 'Page not found.', body: notfound },
  ];
  return R;
}

export function renderRoute(r) {
  const ld = r.path === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Anjor Tank', jobTitle: 'Product Manager and Product Architect', url: SITE.origin, sameAs: [SITE.linkedin, SITE.meshhetu], address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' } })}</script>` : '';
  return shell({ path: r.path, title: r.title, desc: r.desc, body: r.body(), extra: ld });
}
