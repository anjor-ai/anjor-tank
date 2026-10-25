/* ==========================================================================
   KB — the hero keyboard, seen straight on like a product shot.
   Pure markup (strings), used at build time. Every key is HTML and CSS: a darker skirt, a lighter dished top, a soft shadow.
   The six artisan keycaps on the right carry small moulded props: a rocket, a funnel, growth bars, a cart, a lock and OK.
   The shared look and the motion live in styles.css and main.js.
   ========================================================================== */
const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* one key: [legend, width in key units, options] */
const k = (t, w = 1, o = {}) => ({ t, w, ...o });
const alpha = (s) => [...s].map((c) => k(c.toUpperCase(), 1, { id: c }));
const num = [['§', '±'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+']];
const sym = (a, b, id) => k(a, 1, { s: b, id });

const ROWS = [
  { h: 0.8, keys: [k('esc', 1.5, { c: 'acc', id: 'escape' }), ...Array.from({ length: 12 }, (_, i) => k('F' + (i + 1), 1, { id: 'f' + (i + 1) })), k('AT', 1.5, { c: 'dark', brand: 1, id: 'home' })] },
  { keys: [...num.map(([a, b]) => sym(a, b, a)), k('backspace', 2, { c: 'mod', id: 'backspace', al: 'r' })] },
  { keys: [k('tab', 1.5, { c: 'mod', id: 'tab' }), ...alpha('qwertyuiop'), sym('[', '{', '['), sym(']', '}', ']'), k('\\', 1.5, { s: '|', id: '\\' })] },
  { keys: [k('caps', 1.75, { c: 'mod', id: 'capslock' }), ...alpha('asdfghjkl'), sym(';', ':', ';'), sym('\'', '"', '\''), k('enter', 2.25, { c: 'acc', id: 'enter', al: 'r' })] },
  { keys: [k('shift', 2.25, { c: 'mod', id: 'shift' }), ...alpha('zxcvbnm'), sym(',', '<', ','), sym('.', '>', '.'), sym('/', '?', '/'), k('shift', 2.75, { c: 'mod', id: 'shift2', al: 'r' })] },
  { keys: [k('ctrl', 1.25, { c: 'mod', id: 'control' }), k('fn', 1.25, { c: 'mod', id: 'fn' }), k('alt', 1.25, { c: 'mod', id: 'alt' }), k('cmd', 1.25, { c: 'mod', id: 'meta' }), k('', 5, { plate: 1, id: ' ' }), k('alt', 1, { c: 'mod', id: 'alt2' }), k('fn', 1, { c: 'mod', id: 'fn2' }), k('R', 1, { lamp: 'red' }), k('Y', 1, { lamp: 'amber' }), k('G', 1, { lamp: 'green' })] },
];

/* artisan caps: icon, face colour, link, label */
const ARTS = {
  rocket: { c: 'art-w', href: '/work', tip: 'Shipped work' },
  funnel: { c: 'art-b', href: '/systems', tip: 'How I build systems' },
  bars: { c: 'art-y', href: '/hire', tip: 'Results' },
  cart: { c: 'art-o', href: '/work/price-lock-checkout', tip: 'Checkout case' },
  lock: { c: 'dark', href: '/work/price-lock-checkout', tip: 'Price Lock' },
  ok: { c: 'acc', href: '/hire', tip: 'Hire me', text: 'OK' },
  pm: { c: 'acc', href: '/consulting', tip: 'Consulting', text: 'PM' },
};

/* The moulded props on the artisan caps */
const SPRITE = `<svg class="kb__sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<linearGradient id="g-white" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ced8"/></linearGradient>
<linearGradient id="g-red" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ff7a6b"/><stop offset="1" stop-color="#d81f12"/></linearGradient>
<linearGradient id="g-blue" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#6bb8ff"/><stop offset="1" stop-color="#0a63d6"/></linearGradient>
<linearGradient id="g-navy" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3b6fc2"/><stop offset="1" stop-color="#0c2a66"/></linearGradient>
<linearGradient id="g-flame" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#ff7a1f"/></linearGradient>
<linearGradient id="g-gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset="1" stop-color="#e0a21a"/></linearGradient>
<linearGradient id="g-cream" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff6e6"/><stop offset="1" stop-color="#e9c99a"/></linearGradient>
<symbol id="ic-rocket" viewBox="0 0 64 64"><g transform="rotate(38 32 34)"><path d="M28 44Q32 64 36 44Z" fill="url(#g-flame)"/><path d="M32 6C43 17 45 33 40 46H24C19 33 21 17 32 6Z" fill="url(#g-white)"/><path d="M32 6C37 10 39 15 40 21H24C25 15 27 10 32 6Z" fill="url(#g-red)"/><path d="M24 36 14 50l10-4ZM40 36l10 14-10-4Z" fill="url(#g-red)"/><circle cx="32" cy="30" r="6" fill="#fff"/><circle cx="32" cy="30" r="4.2" fill="url(#g-blue)"/></g></symbol>
<symbol id="ic-funnel" viewBox="0 0 64 64"><path d="M8 11h48l-7 11H15z" fill="url(#g-blue)"/><path d="M16 26h32l-5 11H21z" fill="url(#g-blue)" opacity=".86"/><path d="M23 41h18l-3 10H26z" fill="url(#g-navy)"/><circle cx="32" cy="57" r="3.6" fill="url(#g-gold)"/><path d="M12 14h30" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/></symbol>
<symbol id="ic-bars" viewBox="0 0 64 64"><rect x="10" y="38" width="11" height="14" rx="2.4" fill="url(#g-navy)"/><rect x="26.5" y="27" width="11" height="25" rx="2.4" fill="url(#g-navy)"/><rect x="43" y="13" width="11" height="39" rx="2.4" fill="url(#g-navy)"/><path d="M10 26 28 15l9 5 17-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="ic-cart" viewBox="0 0 64 64"><path d="M8 14h8l5 26h27l5-18H19" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="24" y="22" width="12" height="11" rx="1.6" fill="url(#g-cream)"/><circle cx="26" cy="50" r="4.6" fill="#fff"/><circle cx="43" cy="50" r="4.6" fill="#fff"/></symbol>
<symbol id="ic-lock" viewBox="0 0 64 64"><path d="M22 29v-7a10 10 0 0 1 20 0v7" fill="none" stroke="url(#g-gold)" stroke-width="6" stroke-linecap="round"/><rect x="14" y="28" width="36" height="26" rx="6" fill="url(#g-gold)"/><circle cx="32" cy="38.5" r="3.6" fill="#7a5200"/><rect x="30.4" y="40" width="3.2" height="7.5" rx="1.4" fill="#7a5200"/></symbol>
</defs></svg>`;

const legend = (o) => {
  if (o.brand) return `<b class="kc__brand">${esc(o.t)}</b>`;
  if (o.s) return `<s>${esc(o.s)}</s><b>${esc(o.t)}</b>`;
  return `<b>${esc(o.t)}</b>`;
};

function key(o) {
  const cls = ['kc', o.c ? `kc--${o.c}` : '', o.al ? `kc--${o.al}` : '', o.big ? 'kc--big' : ''].filter(Boolean).join(' ');
  const st = `style="--w:${o.w}"`;
  if (o.plate) return `<span class="${cls} kc--space" ${st} data-k="${esc(o.id)}"><i class="kc__t"><span class="plate"><b>MUMBAI</b><em>PM · 26</em></span></i></span>`;
  if (o.lamp) return `<button class="kc kc--dark kc--lamp" ${st} type="button" data-lamp="${o.lamp}" aria-label="${o.lamp === 'red' ? 'Hold' : o.lamp === 'amber' ? 'Test' : 'Ship'}"><i class="kc__t"><span class="lamp lamp--${o.lamp}"></span></i></button>`;
  return `<span class="${cls}" ${st}${o.id ? ` data-k="${esc(o.id)}"` : ''}><i class="kc__t">${legend(o)}</i></span>`;
}

function art(name) {
  const a = ARTS[name];
  const face = a.text ? `<b class="kc__big">${a.text}</b>` : `<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#ic-${name}"/></svg>`;
  return `<a class="kc kc--${a.c} kc--art" style="--w:1" href="${a.href}" data-tip="${esc(a.tip)}" aria-label="${esc(a.tip)}"><i class="kc__t">${face}</i></a>`;
}

const row = (r) => `<div class="kr"${r.h ? ` style="--h:${r.h}"` : ''}>${r.keys.map(key).join('')}</div>`;

const CABLE = `<svg class="kb__cable" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="xMaxYMax meet"><path class="cb" d="M178 196 C178 150 176 120 150 92 C120 60 66 80 80 40 C90 12 150 6 168 34"/><path class="cb2" d="M178 196 C178 150 176 120 150 92 C120 60 66 80 80 40 C90 12 150 6 168 34"/><rect class="plug" x="168" y="188" width="22" height="12" rx="3"/></svg>`;

const TABS = [
  ['/work', 'Work', '<path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z"/>'],
  ['/systems', 'Systems', '<path d="M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" transform="scale(.9) translate(1.3 -1)"/>'],
  ['/journey', 'Journey', '<path d="M5 19c0-6 4-4 6-8s6-1 8-6M5 19h.01M19 5h.01"/>'],
  ['/meshhetu', 'MESHHETU', '<path d="M7 5v14M17 5v14M7 12h10"/>'],
  ['/beyond', 'Beyond', '<path d="M5 19c7 0 13-5 14-14-9 1-14 6-14 14zM5 19c3-5 6-8 10-10"/>'],
];
const ICO = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const KNOB = (id, label) => `<button class="knob" type="button" data-knob="${id}" aria-label="${label}"><span class="knob__b"><i class="knob__r"></i><i class="knob__t"><b></b></i></span><em>${label}</em></button>`;

/** The full board for the home hero: a screen carries the headline, a strip of section keys sits under it, then the keys.
    `screen` is the markup that goes on the screen; `ctas` are the two buttons in the side panel. */
export function keyboard({ screen = '', ctas = '' } = {}) {
  return `<div class="kbw" id="kbw">${SPRITE}
  <div class="kb" id="kb" data-mode="full" role="group" aria-label="A keyboard whose screen carries my introduction">
    <div class="kb__in">
      <div class="kb__main">
        <div class="deck">${KNOB('theme', 'Theme')}${KNOB('type', 'Type')}<div class="dscr" id="scr">${screen}</div>${KNOB('scroll', 'Scroll')}</div>
        <nav class="fstrip" aria-label="Sections">${TABS.map(([h, t, d], i) => `<a href="${h}" class="fstrip__t">${ICO(d)}<span>${t}</span></a>`).join('')}<span class="fstrip__c" id="clock" aria-hidden="true">Mumbai</span><span class="fstrip__s" aria-hidden="true"><i id="prog"></i></span></nav>
        <div class="kb__rows">${ROWS.slice(1, 5).map((r) => row(r).replace('<div class="kr"', '<div class="kr" aria-hidden="true"')).join('')}${row(ROWS[5])}</div>
      </div>
      <aside class="kb__panel">
        <div class="pcta">${ctas}</div>
        <figure class="pimg"><img src="/img/valley.webp" alt="" width="900" height="1100" loading="eager" decoding="async"><figcaption class="label">Systems that grow</figcaption></figure>
        <p class="pq">Decisions, wired into systems, then measured.</p>
        <div class="kr">${art('rocket')}${art('funnel')}${art('bars')}</div>
        <div class="kr">${art('cart')}${art('lock')}${art('ok')}</div>
      </aside>
    </div>
  </div>
  <div class="kb__floor" aria-hidden="true"></div></div>`;
}

/** A short board for the Hire and Consulting pages: the word as accent keys, and four artisan caps. */
export function keystrip(word = 'OK') {
  const letters = [...word].map((c) => key(k(c, 2, { c: 'acc', id: c.toLowerCase(), big: 1 }))).join('');
  const second = word === 'PM' ? ['funnel', 'bars', 'cart', 'rocket'] : ['rocket', 'bars', 'cart', 'lock'];
  return `<div class="kbw kbw--strip" id="kbw">${SPRITE}
  <div class="kb kb--strip" id="kb" data-mode="strip" role="group" aria-label="Keycaps spelling ${esc(word)}">
    <div class="kb__in">
      <div class="kr" style="--h:2" aria-hidden="true">${letters}${key(k('AT', 1, { c: 'dark', brand: 1, id: 'home' }))}</div>
      <div class="kr">${second.map(art).join('')}${key(k('', 1, { lamp: 'green' }))}</div>
    </div>
  </div><div class="kb__floor" aria-hidden="true"></div></div>`;
}
