/* ==========================================================================
   RENDER — turns content.js into the HTML for every page.
   Used at build time by vite.config.js (full pages) and at run time by
   main.js (the case quick-view). No framework: strings in, strings out.
   ========================================================================== */
import { SITE, NAV, PROOF, BELIEFS, ARC, LAYERS, OWN, RELEASE, TOOLS, CASES, CASE_STEPS, TAGS, CHAPTERS, EDU, CERTS, SKILLS, MESH, PHOTOS, ALT, LOVES, DOORS, WINS, HIRE, CONSULT, GLANCE } from './content.js';
import { isoStack, wf, mockup } from './art.js';
import { WM } from './wm.js';

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
  const cur = (p) => (path === p || path.startsWith(p + '/') ? ' aria-current="page"' : '');
  return `<header class="nav" id="nav"><div class="nav__in">
    <a class="brand" href="/" aria-label="Anjor Tank, home">${key()}${reel('nav')}</a>
    <nav class="nav__links" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}</nav>
    <div class="nav__r">
      <button class="kbtn" id="cmd-b" type="button" aria-label="Search and jump" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg></button>
      <button class="kbtn" id="theme" type="button" aria-label="Switch colour theme">${I.sun}${I.moon}</button>
      <a class="btn btn--primary btn--sm nav__cta" href="/hire"><span>Hire me</span></a>
      <button class="kbtn burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sheet">${I.menu}</button>
    </div><span class="nav__p" aria-hidden="true"><i id="nav-p"></i></span></div>
    <div class="sheet" id="sheet" hidden>${[...NAV, ['/hire', 'Hire me'], ['/contact', 'Contact']].map(([h, t], i) => `<a href="${h}"><i>${pad(i + 1)}</i>${t}</a>`).join('')}</div>
  </header>`;
}

function foot() {
  const links = [['/', 'Home'], ...NAV, ['/hire', 'Hire me'], ['/contact', 'Contact']];
  const half = Math.ceil(links.length / 2);
  return `<footer class="foot" id="foot">
    <div class="wrap foot__top">
      <div class="foot__id"><a href="/" aria-label="Anjor Tank, home">${key()}</a><p class="foot__line">Product manager. Product architect. Founder, MESHHETU.</p><p class="label">Mumbai · ${SITE.lat} ${SITE.lon}</p></div>
      <nav class="foot__col" aria-label="Pages"><p class="label">Pages</p>${links.slice(0, half).map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
      <nav class="foot__col" aria-label="More pages"><p class="label">&nbsp;</p>${links.slice(half).map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
      <div class="foot__col"><p class="label">Elsewhere</p><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="mailto:${SITE.email}">Email</a><a href="${SITE.calendly}" target="_blank" rel="noopener">Book a call</a><a href="${SITE.meshhetu}" target="_blank" rel="noopener">meshhetu.com</a></div>
    </div>
    <div class="wrap foot__bar"><p class="label">© 2026 Anjor Tank</p><p class="label">Hello from Mumbai</p></div>
    <div class="foot__horizon"><div class="wrap foot__stage">
      <div class="foot__reel">${reel('foot')}</div>
      <div class="foot__launch" aria-hidden="true"><canvas id="foot-launch"></canvas></div>
    </div></div>
  </footer>`;
}

function cta(title = 'Two ways to work with me.') {
  return `<section class="sec cta" id="cta"><div class="wrap">
    ${sh('Next', title, 'Reach out for a role, or for a consulting problem. Either way, you will hear from me directly.')}
    <div class="doors">${DOORS.map((d, i) => `<a class="door ${i ? 'door--ink' : ''}" href="${i ? '/consulting' : '/hire'}" data-in>
      <p class="label">${esc(d.s)}</p><h3 class="h-3">${esc(d.t)}</h3><p>${esc(d.d)}</p><span class="door__go">${i ? 'See how consulting works' : 'See why hire me'}${I.arrow}</span></a>`).join('')}</div>
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
<meta name="theme-color" content="#08090c">
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
<div class="space" aria-hidden="true"><i class="space__glow"></i><i class="space__glow space__glow--b"></i><i class="space__grain"></i></div>
${path === '/' ? intro() : ''}
${nav(path)}
<main id="main">${body.replace(/\*([^*<>\n]+)\*/g, '<span class="hl">$1</span>')}</main>
${foot()}
<dialog class="qv" id="qv" aria-labelledby="qv-h"><div class="qv__bar"><p class="label" id="qv-c"></p><div class="qv__nav"><button class="kbtn" type="button" id="qv-p" aria-label="Previous case">${I.arrow}</button><button class="kbtn" type="button" id="qv-n" aria-label="Next case">${I.arrow}</button><button class="kbtn" type="button" id="qv-x" aria-label="Close">${I.close}</button></div></div><div class="qv__body" id="qv-b"></div></dialog>
<dialog class="cmd" id="cmd" aria-label="Jump to"><div class="cmd__in"><input id="cmd-i" type="text" autocomplete="off" spellcheck="false" placeholder="Jump to a page, a case study or an action" aria-label="Jump to"><ul id="cmd-l" role="listbox" aria-label="Results"></ul><p class="label cmd__f">Up and down to move · Enter to open · Esc to close</p></div></dialog>
<div class="cur" id="cur" aria-hidden="true"></div>
<script type="module" src="/src/main.js"></script>
</body></html>`;
}

/* The opening, after the ROQIVA film: the name rises and each letter turns into a small screen and back, a checkerboard closes,
   three hard colour cuts, the seven systems run past as cards, the line, the name. About nine seconds, and it can be skipped. */
const FILM_SCENES = ['cart', 'trend', 'blocks', 'funnel', 'find', 'agents', 'revops', 'brain', 'launch'];
const FILM_CUTS = [['Find', 'the leak.', 'find'], ['Design', 'the rule.', 'blocks'], ['Ship', 'the system.', 'launch']];
function intro() {
  const letters = [...'ANJOR TANK'];
  let n = -1;
  return `<div class="film" id="film" aria-hidden="true"><div class="film__bg"></div><div class="film__stage" id="film-stage">
    <div class="film__s film__s0"><p class="film__word">${letters.map((c) => (c === ' ' ? '<span class="fl fl--sp"></span>' : `<span class="fl"><span class="fl__i">${c}</span><canvas class="fl__scr" data-fs="${FILM_SCENES[++n % 9]}"></canvas></span>`)).join('')}</p></div>
    ${FILM_CUTS.map(([a, b, sc], k) => `<div class="film__s film__cut film__c${k}"><p class="film__line"><span class="wm"><span class="wi">${a}</span></span><canvas class="film__scr" data-fs="${sc}"></canvas><span class="wm"><span class="wi">${b}</span></span></p></div>`).join('')}
    <div class="film__s film__s3"><div class="film__track">${CASES.map((c, k) => `<div class="film__card"><canvas data-fs="${SCENE_OF[c.slug] || 'blocks'}"></canvas><p><span>${c.n}</span><b>${esc(c.title)}</b></p></div>`).join('')}</div><p class="film__lead">Seven systems, each with a decision.</p></div>
    <div class="film__s film__s4"><p class="film__hero">${'A product manager who architects and ships the whole system.'.split(' ').map((w) => `<span class="hw">${w} </span>`).join('')}</p><p class="film__name">ANJOR TANK</p><p class="film__status"><i></i>Open to roles and consulting</p></div>
  </div><div class="film__ck">${'<i></i>'.repeat(144)}</div><button class="film__skip label" id="film-skip" type="button">Skip intro</button></div>`;
}

/* ───────────── case card ───────────── */
/** Each case has a MESHHETU dot-matrix scene as its picture. */
export const SCENE_OF = { 'price-lock-checkout': 'cart', 'coupons-cashback': 'trend', 'sku-substitution-engine': 'blocks', 'growth-loops': 'funnel', 'search-discovery': 'find', 'ai-automation': 'agents', 'internal-ops-cx': 'revops' };
function caseCard(c, i, cls = '') {
  return `<article class="ccard sp ${cls}" data-tag="${c.tag}" data-slug="${c.slug}" data-in>
    <button class="ccard__hit" type="button" data-case="${c.slug}" aria-label="Quick view: ${esc(c.title)}"></button>
    <div class="ccard__art"><canvas data-scene="${SCENE_OF[c.slug] || 'blocks'}" aria-hidden="true"></canvas><span class="chip">${c.tag}</span><span class="label">${c.n}</span></div>
    <div class="ccard__b"><h3 class="h-3">${esc(c.title)}</h3>
    <p class="ccard__p">${esc(c.line)}</p>
    <dl class="ccard__m">${c.metrics.slice(0, 2).map(([v, l]) => `<div><dd>${esc(v)}</dd><dt>${esc(l)}</dt></div>`).join('')}</dl></div>
    <span class="ccard__go" aria-hidden="true">${I.plus}</span>
  </article>`;
}

/* The pop-up: a quick read of a case, with a way in to the full page */
export function quick(c, i, total) {
  return `<div class="qv__g"><div class="qv__l"><div class="qv__art"><canvas data-scene="${SCENE_OF[c.slug] || 'blocks'}" aria-hidden="true"></canvas></div>
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

/* The HETU card: the MESHHETU brand card on a field of blue light, after the MESHHETU site. */
const HETU_VB = '0 -896 1201 1164', HETU_D = 'M346 -51Q368 -65 380.0 -81.5Q392 -98 392 -115Q392 -139 371.5 -154.5Q351 -170 305 -170Q251 -170 222.5 -149.5Q194 -129 194 -93Q194 -63 217.0 -39.0Q240 -15 289.0 7.0Q338 29 414 54L355 163Q253 133 186.5 96.0Q120 59 87.5 12.5Q55 -34 55 -91Q55 -157 90 -198Q99 -209 110 -219Q88 -238 75 -258Q54 -291 54 -327Q54 -388 99.0 -420.0Q144 -452 228 -452H351V-510H0V-622H581V-510H489V-345H249Q219 -345 205.0 -335.0Q191 -325 191 -306Q191 -290 203 -276Q207 -271 212 -267Q258 -278 312 -278Q389 -278 437.0 -256.0Q485 -234 507.5 -198.5Q530 -163 530 -121Q530 -82 513.5 -49.0Q497 -16 460 15ZM356 -615Q339 -667 325.5 -700.0Q312 -733 298.5 -751.0Q285 -769 269.0 -775.5Q253 -782 232 -782Q214 -782 194.5 -778.0Q175 -774 158 -767L123 -876Q150 -886 179.5 -891.0Q209 -896 238 -896Q284 -896 317.5 -883.0Q351 -870 377.0 -838.5Q403 -807 426.5 -752.5Q450 -698 476 -615ZM1109 -510V0H969V-291H842Q793 -291 767.0 -272.0Q741 -253 741 -215Q741 -177 767.5 -140.5Q794 -104 845 -57L742 23Q676 -42 638.5 -101.5Q601 -161 601 -231Q601 -318 658.5 -360.5Q716 -403 823 -403H969V-510H566V-622H1201V-510ZM1001 268Q935 268 881.0 248.5Q827 229 781.5 193.5Q736 158 695 112L780 36Q822 83 856.0 111.5Q890 140 923.5 152.0Q957 164 995 164Q1035 164 1054.0 151.0Q1073 138 1073 115Q1073 95 1060.5 83.5Q1048 72 1023 72Q1000 72 978.0 81.0Q956 90 935 105L883 17Q912 -5 948.0 -17.0Q984 -29 1033 -29Q1110 -29 1153.5 13.0Q1197 55 1197 122Q1197 187 1148.5 227.5Q1100 268 1001 268Z';
function hetu({ solo = false, tail = '' } = {}) {
  return `<section class="hetu${solo ? ' hetu--solo' : ''}" id="mesh"><div class="wrap hetu__g">
    <div class="hetu__card" id="hetu-card" data-in>
      <img class="hetu__m" src="/img/meshhetu-mark-dark.svg" width="76" height="76" alt="">
      <p class="hetu__w">MESHHETU</p>
      <p class="label hetu__tag">${esc(MESH.tagline.toUpperCase())}</p>
      <svg class="hetu__hi" viewBox="${HETU_VB}" role="img" aria-label="${MESH.hindi}"><path d="${HETU_D}" fill="currentColor"/></svg>
      <p class="hetu__s">${MESH.hindi} (hetu) · ${esc(MESH.meaning)}</p>
    </div>
    <div class="hetu__r">
      <p class="label eyebrow" data-in>Why we started MESHHETU</p>
      <h2 class="h-2" data-split>Built with a *purpose.* Engineered with a reason.</h2>
      <p class="lead" data-in>${esc(MESH.why)}</p>
      <hr class="hetu__hr" data-in>
      <p class="hetu__p" data-in>The name is our reminder: ${esc(MESH.principle.charAt(0).toLowerCase() + MESH.principle.slice(1))}</p>
      ${tail}
    </div></div></section>`;
}

/* The hero's console: the six moves I make on every system, each tied to a real case. Click through, or let it run. */
const SYS = [['Detect', 'Find where the number leaks.', 'search-discovery'], ['Audit', 'Trace it to the workflow underneath.', 'internal-ops-cx'], ['Decide', 'Write the rule and price the trade-off.', 'price-lock-checkout'], ['Build', 'Own the web, app and API that carry it.', 'sku-substitution-engine'], ['Release', 'Ship behind a measured launch.', 'coupons-cashback'], ['Measure', 'Prove the lift, then close the loop.', 'growth-loops']];
function sysc() {
  const item = SYS.map(([n, d, slug]) => ({ n, d, c: CASES.find((x) => x.slug === slug) }));
  return `<section class="sysc glass" id="sysc" aria-label="How I work, as a system you can click through">
  <header class="sysc__h"><span class="label"><i></i>The system, live</span><span class="label" id="sysc-n" aria-hidden="true">01 / 06</span><button class="kbtn" id="sysc-pp" type="button" aria-label="Pause the tour" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="pp-a" d="M8 5v14M16 5v14"/><path class="pp-b" d="M8 5l11 7-11 7z"/></svg></button></header>
  <div class="sysc__tabs" role="tablist" aria-label="The six moves">${item.map((x, i) => `<button class="sysc__t" role="tab" type="button" id="st${i}" aria-controls="sp${i}" aria-selected="${i === 0}" ${i ? 'tabindex="-1"' : ''}><i>0${i + 1}</i><b>${x.n}</b></button>`).join('')}</div>
  ${item.map((x, i) => `<div class="sysc__p" role="tabpanel" id="sp${i}" aria-labelledby="st${i}" ${i ? 'hidden' : ''}>
    <div class="sysc__art"><canvas data-sc="${SCENE_OF[x.c.slug]}" aria-hidden="true"></canvas><span class="chip">${esc(x.c.tag)}</span></div>
    <div class="sysc__c"><p class="sysc__d">${esc(x.d)}</p><p class="sysc__m"><strong>${esc(x.c.metrics[0][0])}</strong><span>${esc(x.c.metrics[0][1])}</span></p><a class="sysc__l" href="/work/${x.c.slug}">${esc(x.c.title)} ${I.arrow}</a></div></div>`).join('')}
  <span class="sysc__bar" aria-hidden="true"><i id="sysc-bar"></i></span></section>`;
}

/* ───────────── HOME ───────────── */
const TICK = ['Price Lock at checkout', '45+ coupon combinations', '70,000 SKUs re-indexed', 'Strapi headless CMS', 'Amazon Pay integrated', 'Search-to-order +9.0%', 'Referral 6 → 13%', 'GA4 + BigQuery', 'Voice agent, −20% cost per order', 'CRM routing, −30% resolution time'];
function home() {
  return `
<section class="hero" id="top"><canvas class="hero__field" id="field" aria-hidden="true"></canvas>
<div class="wrap hero__g">
  <div class="hero__t">
    <p class="hello" aria-label="Hello"><span class="hello__w" id="hello">HELLO</span><span class="hello__s label"><i></i>Open to roles and consulting</span></p>
    <h1 class="h-hero" id="hero-h" data-split>I’m Anjor Tank, a product manager who architects and ships *the whole system.*</h1>
    <p class="lead" data-in>From the decision rule to the web and app that carry it. Five systems taken from problem to shipped across payments, growth, search and operations, now at GNC India and founding MESHHETU.</p>
    <div class="btn-row" data-in>${btn('/work', 'See the work')}${btn('/hire', 'Hire me', 'ghost')}</div>
    <p class="hint label" data-in>Move your mouse over the grid. Press <kbd id="hint-k">Ctrl K</kbd> to jump anywhere.</p>
  </div>
  ${sysc()}
</div></section>

<div class="ticker" aria-hidden="true"><div class="ticker__t" id="ticker">${[...TICK, ...TICK].map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>

<section class="proof" id="proof"><div class="wrap"><ul class="mets">${PROOF.map((m, i) => `<li class="met" data-in><span class="label">T-0${i + 1} · ${m.tag}</span><strong ${m.to != null ? `data-count data-from="${m.from}" data-to="${m.to}" data-dp="${m.dp}" data-pre="${esc(m.pre || '')}" data-suf="${esc(m.suf || '')}"` : ''}>${m.to != null ? esc(m.pre + m.to.toFixed(m.dp) + m.suf) : esc(m.text)}</strong><span>${esc(m.label)}</span></li>`).join('')}</ul>
  <p class="foot-note label">Results are from product work at Truemeds, 2023 – 2026.</p></div></section>

<section class="sec work" id="work"><div class="wrap">
  ${sh('Selected work', 'Seven systems, *each with a decision.*', 'Open any card for the quick version. Each one leads to a full case study: context, trade-offs, what shipped and what I would change.')}
  <div class="wgrid">${CASES.map((c, i) => caseCard(c, i, i > 2 ? 'ccard--s' : '')).join('')}</div>
  <div class="btn-row">${btn('/work', 'All case studies', 'ghost')}</div>
</div></section>

${hetu({ tail: `<div class="btn-row" data-in>${btn('/meshhetu', 'The MESHHETU story', 'light')}${btn('/consulting', 'Consulting', 'ghost-d')}</div>` })}

<section class="sec think" id="think"><div class="wrap">
  ${sh('How I think', 'Three beliefs *behind every system.*', 'They come from the case studies above, and they decide what I build first.')}
  <div class="asc">${BELIEFS.map((b, i) => `<article class="asc__c sp" data-in><canvas class="asc__cv" data-ascii="${b.art}" width="10" height="10" aria-hidden="true"></canvas>
    <div class="asc__t"><h3>${esc(b.t)}</h3><p>${esc(b.d)}</p><ul>${b.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></article>`).join('')}</div>
</div></section>



<section class="sec arch" id="arch"><div class="wrap arch__g">
  <div class="arch__l">${sh('Product architect', 'I don’t stop at the spec. *I build the thing.*', 'I own web and app development end to end, from the wireframe and the API payload to the release and the number that moves.')}
    <ul class="ticks">${OWN.slice(0, 3).map((o) => `<li data-in><b>${esc(o.t)}</b><span>${esc(o.d)}</span></li>`).join('')}</ul>
    <div class="btn-row">${btn('/systems', 'See how I build systems')}</div></div>
  <div class="arch__r">${mockup()}</div>
</div></section>

<section class="sec path" id="path"><div class="wrap">
  ${sh('Journey', 'Marketing, then product, *then a company of my own.*', 'Marketing taught me demand. Product taught me systems. MESHHETU is where both meet.')}
  <ol class="strip" id="strip">${[['2021', 'Digital marketing intern', '9LedgePro'], ['2022', 'Client services associate', 'Eggfirst'], ['2023', 'Management trainee', 'Neil Patel Digital'], ['2023 – 26', 'Associate Product Manager', 'Truemeds'], ['2026 –', 'Product Manager', 'GNC India'], ['2026 –', 'Founder, MESHHETU', 'Product Architect']].map(([w, r, o], i, a) => `<li class="strip__i${i >= a.length - 2 ? ' strip__i--now' : ''}" data-in><span class="label">${w}</span><i></i><b>${esc(r)}</b><span>${esc(o)}</span></li>`).join('')}</ol>
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
    <div class="chead__art" data-in><canvas data-scene="${SCENE_OF[c.slug] || 'blocks'}" aria-hidden="true"></canvas></div></div>
  <ul class="mets mets--3">${c.metrics.map(([v, l]) => `<li class="met" data-in><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('')}</ul>
</div></section>
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
    <a class="btn btn--primary btn--sm" href="/hire"><span>Hire me</span>${I.arrow}</a>
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

/* ───────────── SYSTEMS ───────────── */
function systems() {
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
${hetu({ solo: true, tail: `<div class="btn-row" data-in>${btn(SITE.meshhetu, 'Visit meshhetu.com', 'light', true)}${btn('/contact?intent=consult', 'Consult with me', 'ghost-d')}</div>` })}

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

${hetu({ tail: `<div class="btn-row" data-in>${btn('/meshhetu', 'The MESHHETU story', 'light')}${btn(SITE.meshhetu, 'meshhetu.com', 'ghost-d', true)}</div>` })}

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
  <div class="phead__art"><div class="sart"><canvas data-scene="launch" aria-hidden="true"></canvas></div></div>
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
  <div class="phead__art"><div class="sart"><canvas data-scene="revops" aria-hidden="true"></canvas></div></div>
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
const D = 'Anjor Tank is a product manager and product architect in Mumbai who owns web and app development end to end, is Product Manager at GNC India and founded MESHHETU.';
export function routes() {
  const R = [
    { path: '/', file: 'index.html', title: 'Anjor Tank | Product manager and product architect', desc: D, body: home, boot: true },
    { path: '/work', file: 'work/index.html', title: 'Work | Anjor Tank', desc: 'Seven product systems across payments, growth, search, AI and operations, each with the decision behind it and the number that moved.', body: work },
    ...CASES.map((c) => ({ path: '/work/' + c.slug, file: `work/${c.slug}/index.html`, title: `${c.title} | Anjor Tank`, desc: c.line, body: () => casePage(c) })),
    { path: '/systems', file: 'systems/index.html', title: 'Systems | Anjor Tank', desc: 'How Anjor Tank owns web, app, platform and internal tools end to end, from wireframe and schema to release and result.', body: systems },
    { path: '/meshhetu', file: 'meshhetu/index.html', title: 'MESHHETU | Anjor Tank', desc: 'MESHHETU is the systems engineering company Anjor Tank founded: strategic consulting, modular intelligence and ROQIVA in development.', body: meshhetu },
    { path: '/journey', file: 'journey/index.html', title: 'Journey | Anjor Tank', desc: 'From campaigns to commerce systems: Anjor Tank’s path through marketing, product and founding MESHHETU.', body: journey },
    { path: '/beyond', file: 'beyond/index.html', title: 'Beyond work | Anjor Tank', desc: 'Karts, live music, mountains and good food: what Anjor Tank does away from the keyboard.', body: beyond },
    { path: '/hire', file: 'hire/index.html', title: 'Hire me | Anjor Tank', desc: 'Anjor Tank is open to product manager, product architect and GTM engineering roles in India or remote with US and global teams.', body: hire },
    { path: '/consulting', file: 'consulting/index.html', title: 'Consulting | Anjor Tank', desc: 'Revenue-leak audits, build-ready plans and an embedded product architect, through MESHHETU.', body: consulting },
    { path: '/contact', file: 'contact/index.html', title: 'Contact | Anjor Tank', desc: 'Reach Anjor Tank for a product role or for consulting through MESHHETU.', body: contact },
    { path: '/404', file: '404.html', title: 'Page not found | Anjor Tank', desc: 'Page not found.', body: notfound },
  ];
  return R;
}

export function renderRoute(r) {
  const ld = r.path === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Anjor Tank', jobTitle: 'Product Manager and Product Architect', url: SITE.origin, sameAs: [SITE.linkedin, SITE.meshhetu], address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' } })}</script>` : '';
  return shell({ path: r.path, title: r.title, desc: r.desc, body: r.body(), extra: ld });
}
