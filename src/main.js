/* ==========================================================================
   MAIN — everything that moves or responds.
   Order: theme · nav · page transitions · cursor · intro (world zoom) · page motion · widgets.
   Reduced motion (html.rm) keeps every feature but skips the choreography.
   ========================================================================== */
import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CASES, HELLOS, SITE, DOORS } from './content.js';
import { quick } from './render.js';
import { wordReel, footLaunch, sceneCanvas, warp, makeDots, blit } from './artcv.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, DrawSVGPlugin);

const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rm = root.classList.contains('rm');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const desktop = () => matchMedia('(min-width: 901px)').matches;
const ease = 'power3.out';
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};

/* ───────────── theme: circular reveal from the key that was pressed ───────────── */
function setTheme(t) {
  root.setAttribute('data-theme', t);
  store.set('anjor-theme', t);
  const m = $('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#08090c' : '#ffffff');
}
$('#theme')?.addEventListener('click', (e) => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (rm || !document.startViewTransition) return setTheme(next);
  const r = e.currentTarget.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(() => setTheme(next));
  vt.ready.then(() => root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
    { duration: 750, easing: 'cubic-bezier(.22,.85,.3,1)', pseudoElement: '::view-transition-new(root)' },
  )).catch(() => {});
});

/* ───────────── nav: always on screen; it tightens and fills in once you scroll, and a line fills along its edge ───────────── */
const nav = $('#nav'), sheet = $('#sheet'), burger = $('#burger'), navP = $('#nav-p');
const stick = () => nav.classList.toggle('is-stuck', scrollY > 24);
stick(); addEventListener('scroll', stick, { passive: true });
function sheetOpen(o) {
  sheet.hidden = !o; burger.setAttribute('aria-expanded', String(o));
  if (o) { if (!rm) gsap.from('#sheet a', { y: 18, opacity: 0, stagger: 0.05, duration: 0.5, ease }); }
}
burger?.addEventListener('click', () => sheetOpen(sheet.hidden));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) sheetOpen(false); });

/* ───────────── page transitions: seven shutters ───────────── */
const bars = $$('#pt i');
let leaving = false;
function go(href) {
  if (leaving) return; leaving = true;
  store.sset('anjor-pt', '1');
  const pt = $('#pt'); pt.classList.add('on');
  gsap.set(bars, { transformOrigin: '50% 100%' });
  gsap.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.inOut', stagger: { each: 0.045, from: 'center' }, onComplete: () => { location.href = href; } });
  setTimeout(() => { location.href = href; }, 1600);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  if (u.pathname === location.pathname && u.hash) return; // in-page anchor
  if (u.pathname === location.pathname && !u.search) { e.preventDefault(); scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); return; }
  if (rm) return;
  e.preventDefault();
  if ($('#qv')?.open) $('#qv').close();
  sheetOpen(false);
  go(u.href);
});
addEventListener('pageshow', (e) => {
  if (e.persisted) { leaving = false; $('#pt').classList.remove('on'); gsap.set(bars, { scaleY: 0 }); }
});
function revealPage() {
  if (!root.classList.contains('pt-in')) return;
  gsap.set(bars, { scaleY: 1, transformOrigin: '50% 0' });
  gsap.to(bars, {
    scaleY: 0, duration: 0.65, ease: 'power3.inOut', stagger: { each: 0.045, from: 'edges' }, delay: 0.05,
    onComplete: () => root.classList.remove('pt-in'),
  });
}

/* ───────────── cursor ring (fine pointers only) ───────────── */
if (fine && !rm) {
  const cur = $('#cur');
  const qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('pointermove', (e) => { cur.classList.add('on'); qx(e.clientX); qy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => { cur.classList.toggle('big', !!e.target.closest('a, button, .ccard, .layer, .door, .fchip, .ph, summary, .win2, .kc')); });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  // magnetic buttons
  $$('.btn, .kbtn, .nav__cta').forEach((b) => {
    const mx = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.22); my((e.clientY - r.top - r.height / 2) * 0.3); });
    b.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}

/* ───────────── helpers ───────────── */
const pad = (n) => String(n).padStart(2, '0');
const rand = (a) => a[Math.floor(Math.random() * a.length)];

/** Draw an SVG illustration in, stroke by stroke. */
function drawIn(svg, delay = 0) {
  if (!svg || rm) return;
  const lines = $$('.ln, .ac, .dm', svg), solids = $$('.af, .tx, .fl:not(.side):not(.side2)', svg);
  if (lines.length) gsap.fromTo(lines, { drawSVG: '0%' }, {
    drawSVG: '100%', duration: 1.1, delay, ease: 'power2.inOut', stagger: { amount: 0.7, from: 'start' },
    onComplete: () => lines.forEach((l) => { l.style.strokeDasharray = ''; l.style.strokeDashoffset = ''; }),
  });
  if (solids.length) gsap.from(solids, { opacity: 0, duration: 0.6, delay: delay + 0.5, stagger: { amount: 0.4 }, ease: 'none', clearProps: 'opacity' });
}

/** Flicker a greeting into another language: a few frames of noise built from its own glyphs, then the word. */
function flickerTo(el, text) {
  const chars = [...text];
  let n = 0;
  const step = () => {
    n += 1;
    if (n < 4) {
      el.textContent = chars.map((c) => (Math.random() < 0.55 ? rand(chars) : c)).join('');
      setTimeout(step, 38);
    } else el.textContent = text;
  };
  el.classList.remove('flick'); void el.offsetWidth; el.classList.add('flick');
  step();
}

/* ───────────── intro: a keycap lands in a dot-matrix starfield, says hello, the stars warp, the page opens out of the middle ───────────── */
function runIntro(done) {
  const intro = $('#intro'), cv = $('#warp');
  if (!intro || !cv || !root.classList.contains('boot')) return done();
  const ctx = cv.getContext('2d'), word = $('#intro-w'), key = $('#intro-k');
  const CELL = 6, S = { k: 0, a: 1 };
  let D, img, cols, rows, finished = false, tl;
  const t0 = performance.now();
  const size = () => { cols = Math.ceil(innerWidth / CELL); rows = Math.ceil(innerHeight / CELL); D = makeDots(cols, rows); cv.width = cols * CELL; cv.height = rows * CELL; img = ctx.createImageData(cv.width, cv.height); };
  const draw = () => { D.buf.fill(0); warp(D, ((performance.now() - t0) / 1000) * 7, { x0: 0, y0: 0, w: cols, h: rows }, S.k, S.a); blit(ctx, img, D, CELL, 1); };
  const finish = () => {
    if (finished) return; finished = true;
    store.sset('anjor-boot', '1');
    tl && tl.kill(); gsap.ticker.remove(draw); removeEventListener('resize', size);
    root.classList.remove('boot-lock');
    gsap.to(intro, { opacity: 0, duration: 0.3, onComplete: () => { root.classList.remove('boot'); intro.remove(); ScrollTrigger.refresh(); } });
    done();
  };
  root.classList.add('boot-lock');
  size(); addEventListener('resize', size); gsap.ticker.add(draw);
  const list = HELLOS.slice(0, 7), per = 0.3, t1 = 0.65 + list.length * per + 0.25;
  word.textContent = list[0];
  tl = gsap.timeline();
  tl.fromTo(key, { y: -60, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, 0.05)
    .to(key, { y: 6, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.7)
    .fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.55);
  list.forEach((w, i) => { if (i) tl.call(() => flickerTo(word, w), null, 0.65 + i * per); });
  tl.to('.intro__c', { opacity: 0, scale: 0.88, duration: 0.4, ease: 'power2.in' }, t1)
    .to(S, { k: 1, duration: 0.95, ease: 'power2.in' }, t1 - 0.1)
    .fromTo(intro, { '--r': '0px' }, { '--r': () => Math.hypot(innerWidth, innerHeight) * 0.75 + 'px', duration: 0.9, ease: 'power2.in' }, t1 + 0.55)
    .call(done, null, t1 + 0.8)
    .call(finish, null, t1 + 1.55);
  $('#intro-s')?.addEventListener('click', () => { if (!finished) { done(); finish(); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !finished) { done(); finish(); } });
  setTimeout(() => { if (!finished) { done(); finish(); } }, 12000);
}

/* ───────────── greeting in the hero keeps cycling ───────────── */
function heroHello() {
  const w = $('#hello');
  if (!w || rm) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    i = (i + 1) % HELLOS.length; flickerTo(w, HELLOS[i]);
  }, 2600);
}

/* ───────────── ASCII canvases ("how I think") ───────────── */
const RAMP = ' .,:;-=+*#%@';
function asciiCards() {
  const cards = $$('canvas[data-ascii]');
  if (!cards.length) return;
  const field = {
    galaxy(x, y, t, s) { // two-arm spiral, bright core, drifts with the pointer
      const dx = x - (0.5 + (s.mx - 0.5) * 0.25), dy = (y - (0.5 + (s.my - 0.5) * 0.25)) * 1.05;
      const r = Math.hypot(dx, dy) + 1e-4, a = Math.atan2(dy, dx);
      const arm = 0.5 + 0.5 * Math.cos(2 * (a - t * 0.35) - 9 * Math.log(r + 0.05));
      const core = Math.exp(-r * r * 40);
      return Math.min(1, Math.pow(arm, 2.2) * Math.exp(-r * 3.2) * 1.5 + core * 1.2 + (Math.sin(x * 83 + y * 57) > 0.985 ? 0.5 : 0));
    },
    lens(x, y, t, s) { // a glass sphere magnifying a wave field
      const cx = 0.5 + Math.cos(t * 0.5) * 0.12 + (s.mx - 0.5) * 0.5, cy = 0.5 + Math.sin(t * 0.7) * 0.1 + (s.my - 0.5) * 0.5, R = 0.26;
      const dx = x - cx, dy = (y - cy) * 1.05, d = Math.hypot(dx, dy);
      const wave = (px, py) => 0.5 + 0.5 * Math.sin(px * 26 + t * 1.2) * Math.sin(py * 22 - t * 0.8);
      if (d < R) { const k = 0.45 + 0.55 * (d / R) ** 2; return Math.min(1, wave(cx + dx * k, cy + dy * k) * 0.95 + 0.12 + (d > R * 0.92 ? 0.4 : 0)); }
      if (d < R * 1.05) return 1;
      return wave(x, y) * 0.32;
    },
    terrain(x, y, t, s) { // scrolling ridge lines
      const sh = (s.mx - 0.5) * 0.4;
      const h = (px, py) => Math.sin(px * 9 + t * 0.4) * 0.5 + Math.sin(px * 17 - py * 5 + t * 0.2) * 0.25 + Math.sin(py * 12 + px * 3) * 0.25;
      const hv = h(x + sh, y + t * 0.05);
      const band = Math.abs(((hv * 5 + 10) % 1) - 0.5);
      return Math.max(0, Math.min(1, 0.25 + hv * 0.35 + (band < 0.07 ? 0.5 : 0) + y * 0.25));
    },
  };
  const state = cards.map((cv) => {
    const s = { cv, ctx: cv.getContext('2d'), kind: cv.dataset.ascii, on: false, mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, cols: 0, rows: 0, cw: 0, ch: 0 };
    const size = () => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * dpr; cv.height = r.height * dpr; s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.w = r.width; s.h = r.height; s.fs = r.width < 320 ? 9 : 11; s.cw = s.fs * 0.62; s.ch = s.fs * 1.12; s.cols = Math.floor(r.width / s.cw); s.rows = Math.floor(r.height / s.ch);
      frame(s, 0);
    };
    new ResizeObserver(size).observe(cv); size();
    new IntersectionObserver(([e]) => { s.on = e.isIntersecting; }, { rootMargin: '80px' }).observe(cv);
    cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); s.tx = (e.clientX - r.left) / r.width; s.ty = (e.clientY - r.top) / r.height; });
    cv.addEventListener('pointerleave', () => { s.tx = 0.5; s.ty = 0.5; });
    return s;
  });
  function frame(s, t) {
    if (!s.cols) return;
    s.mx += (s.tx - s.mx) * 0.08; s.my += (s.ty - s.my) * 0.08;
    const c = s.ctx; c.clearRect(0, 0, s.w, s.h);
    c.font = `500 ${s.fs}px "IBM Plex Mono", ui-monospace, monospace`; c.textBaseline = 'top';
    const f = field[s.kind] || field.galaxy;
    for (let j = 0; j < s.rows; j++) {
      for (let i = 0; i < s.cols; i++) {
        const v = f(i / s.cols, j / s.rows, t, s); if (v < 0.06) continue;
        const k = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
        c.fillStyle = k > 8 ? '#f2f8ff' : k > 5 ? '#8fc6ff' : '#2f95ff';
        c.fillText(RAMP[k], i * s.cw, j * s.ch);
      }
    }
  }
  if (rm) { state.forEach((s) => frame(s, 1.2)); return; }
  gsap.ticker.add((time) => { state.forEach((s) => s.on && frame(s, time)); });
}

/* ───────────── MESHHETU dot-matrix screens: every canvas with data-scene runs one of the MESHHETU art scenes ───────────── */
function scenes(scope = document) {
  $$('canvas[data-scene]', scope).forEach((c) => {
    if (c.dataset.on) return; c.dataset.on = '1';
    sceneCanvas(c, c.dataset.scene, { cell: 4, k: 4, gap: 1, fps: 18 });
  });
}

/* ───────────── counters ───────────── */
function counters() {
  $$('[data-count]').forEach((el) => {
    const from = +el.dataset.from, to = +el.dataset.to, dp = +el.dataset.dp, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const fmt = (v) => pre + v.toFixed(dp) + suf;
    if (rm) return;
    el.textContent = fmt(from);
    const o = { p: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { p: 1, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(from + (to - from) * o.p); } }) });
  });
}

/* ───────────── filters (work + photos) ───────────── */
function filters(box, items, match) {
  const el = $(box); if (!el) return;
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.fchip'); if (!b || b.classList.contains('is-on')) return;
    $$('.fchip', el).forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    const list = $$(items); const f = b.dataset.f; if (box === '#filters') $('#cgrid')?.setAttribute('data-f', f);
    const apply = () => { list.forEach((c) => { c.hidden = !match(c, f); }); const vis = list.filter((c) => !c.hidden); vis.forEach((c) => c.classList.add('in')); if (!rm) gsap.fromTo(vis, { opacity: 0, y: 22, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.06, ease, overwrite: true, clearProps: 'opacity,transform' }); ScrollTrigger.refresh(); };
    if (rm) apply(); else gsap.to(list.filter((c) => !c.hidden), { opacity: 0, y: 10, duration: 0.18, onComplete: apply });
  });
}

/* ───────────── quick-view dialog ───────────── */
function quickView() {
  const dlg = $('#qv'); if (!dlg || !dlg.showModal) return;
  const body = $('#qv-b'), cap = $('#qv-c');
  let idx = 0;
  const show = (i, dir = 0) => {
    idx = (i + CASES.length) % CASES.length; const c = CASES[idx];
    body.innerHTML = quick(c, idx, CASES.length);
    cap.textContent = `Case ${c.n} of ${pad(CASES.length)}`;
    body.scrollTop = 0; scenes(body);
    if (!rm) { gsap.from(body.children[0], { x: dir * 40, opacity: dir ? 0 : 1, duration: 0.45, ease }); gsap.from($$('.qv__m div', body), { y: 14, opacity: 0, stagger: 0.08, duration: 0.5, delay: 0.2, ease }); }
  };
  const open = (slug) => {
    const i = CASES.findIndex((c) => c.slug === slug); if (i < 0) return;
    show(i); if (!dlg.open) { dlg.showModal(); root.classList.add('qv-open'); if (!rm) gsap.fromTo(dlg, { opacity: 0, y: 36, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'expo.out' }); }
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-case]'); if (t) { e.preventDefault(); open(t.dataset.case); } });
  $('#qv-x').addEventListener('click', () => dlg.close());
  $('#qv-n').addEventListener('click', () => show(idx + 1, 1));
  $('#qv-p').addEventListener('click', () => show(idx - 1, -1));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => root.classList.remove('qv-open'));
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(idx + 1, 1); if (e.key === 'ArrowLeft') show(idx - 1, -1); });
}

/* ───────────── contact form ───────────── */
function contactForm() {
  const form = $('#form'); if (!form) return;
  const copy = {
    job: { a: 'Company', ap: 'Where you work', s: 'Role you have in mind', m: 'Tell me about the role and the team.', go: DOORS[0].cta },
    consult: { a: 'Business', ap: 'Brand or website', s: 'Type of business', m: 'Which metric won’t move?', go: DOORS[1].cta },
  };
  const sel = $('#f-s'), inp = $('#f-a'), st = $('#f-st');
  const set = (k, push = true) => {
    const c = copy[k], d = DOORS.find((x) => x.id === k);
    $('#f-intent').value = k; $('#l-a').textContent = c.a; inp.placeholder = c.ap; $('#l-s').textContent = c.s; $('#l-m').textContent = c.m; $('#f-go').textContent = c.go;
    sel.innerHTML = d.opts.map((o) => `<option>${o}</option>`).join('');
    $$('.pick__o').forEach((b) => { const on = b.dataset.intent === k; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); });
    if (push) { try { history.replaceState(null, '', `?intent=${k}`); } catch (e) { /* ignore */ } }
    if (!rm && push) gsap.from('.form .fld', { y: 12, opacity: 0, stagger: 0.04, duration: 0.45, ease, clearProps: 'all' });
  };
  const q = new URLSearchParams(location.search).get('intent');
  set(q === 'consult' ? 'consult' : 'job', false);
  $$('.pick__o').forEach((b) => b.addEventListener('click', () => set(b.dataset.intent)));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form); let ok = true;
    ['name', 'email', 'message'].forEach((n) => {
      const f = form.elements[n]; const v = String(fd.get(n) || '').trim(); const bad = !v || (n === 'email' && !/^\S+@\S+\.\S+$/.test(v));
      f.closest('.fld').classList.toggle('is-bad', bad); if (bad) ok = false;
    });
    if (!ok) { st.textContent = 'Please check the highlighted fields.'; return; }
    if (fd.get('botcheck')) { st.textContent = 'Thanks. I’ll be in touch.'; return; }
    const go = $('button[type=submit]', form); go.disabled = true; st.textContent = 'Sending…';
    try {
      const r = await fetch(SITE.form.url, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      const j = await r.json();
      if (!j.success) throw new Error('rejected');
      st.textContent = 'Sent. I reply within a couple of working days.'; form.reset(); set(fd.get('intent'), false);
    } catch (err) {
      const body = encodeURIComponent(`${fd.get('message')}\n\n${fd.get('name')} · ${fd.get('company') || ''}`);
      st.innerHTML = `Could not send from here. <a class="hl" href="mailto:${SITE.email}?subject=${encodeURIComponent('Enquiry: ' + fd.get('intent'))}&body=${body}">Email me instead</a>.`;
    } finally { go.disabled = false; }
  });
  form.addEventListener('input', (e) => e.target.closest('.fld')?.classList.remove('is-bad'));
}

/* ───────────── page motion (starts once the intro opens, or straight away) ───────────── */
let started = false;
function startPage() {
  if (started) return; started = true;
  root.classList.add('ready');
  const run = () => {
    // 1. headings: lines rise out of a mask
    $$('[data-split]').forEach((el) => {
      if (rm) { gsap.set(el, { visibility: 'visible' }); return; }
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.lines, { yPercent: 115, duration: 1.1, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        },
      });
    });
    // 2. everything else eases up as it enters
    if (!rm) {
      ScrollTrigger.batch('[data-in]', {
        start: 'top 90%', once: true, interval: 0.1, batchMax: 6,
        onEnter: (els) => {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease, overwrite: 'auto', onComplete: () => els.forEach((e) => { e.classList.add('in'); gsap.set(e, { clearProps: 'opacity,transform' }); }) });
          els.forEach((el) => { const cv = $('.ccard__art canvas', el); if (cv) gsap.from(cv, { scale: 1.28, duration: 1.5, ease: 'expo.out', clearProps: 'transform' }); const art = $('.chead__art svg', el); if (art) drawIn(art, 0.15); });
        },
      });
    }
    counters(); asciiCards(); scenes(); spotlight();
    $$('[data-rl]').forEach(wordReel);
    const fl = $('#foot-launch'); if (fl) footLaunch(fl);
    filters('#filters', '#cgrid .ccard', (c, f) => f === 'All' || c.dataset.tag === f);
    filters('#pfilters', '#mas .ph', (c, f) => f === 'All' || c.dataset.g === f);
    heroHello();
    keyboardLive();
    if (!rm) { keyboardMotion(); pageMotion(); hetuMotion(); architectMotion(); journeyMotion(); mockMotion(); fanMotion(); }
    caseMotion(); layersLink(); releaseLog();
    ScrollTrigger.refresh();
  };
  (document.fonts?.ready || Promise.resolve()).then(run);
}

/* ───────────── spotlight: cards light up where the pointer is ───────────── */
function spotlight() {
  $$('.card, .layer, .move, .win2, .offer, .track, .love, .door, .role, .item, .asc__c, .qa').forEach((el) => el.classList.add('sp'));
  if (!fine) return;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest('.sp'); if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });
}

/* ───────────── the hero keyboard: works without motion (clock, real keys, lamps) ───────────── */
const keyById = (kb, id) => $(`.kc[data-k="${CSS.escape(id)}"]`, kb);
function keyboardLive() {
  const kb = $('#kb'); if (!kb) return;
  const scrT = $('#scr-t'), scrD = $('#scr-d');
  const clock = () => {
    if (!scrT || kb.dataset.busy) return;
    const d = new Date();
    scrT.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).replace(/\s?[AP]M/i, '');
    scrD.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
  };
  clock(); setInterval(clock, 20000); document.addEventListener('kb-clock', clock);
  // the keys you press on your own keyboard press down here too (nothing is intercepted)
  const map = { arrowup: 'enter', arrowdown: 'shift2', arrowleft: 'control', arrowright: 'alt2' };
  const hit = (e, on) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, select')) return;
    const k = (map[e.key.toLowerCase()] || e.key.toLowerCase()), el = keyById(kb, k === 'shift' && e.location === 2 ? 'shift2' : k);
    if (el) el.classList.toggle('is-down', on);
  };
  addEventListener('keydown', (e) => hit(e, true)); addEventListener('keyup', (e) => hit(e, false));
  // pointer press on any key
  kb.addEventListener('pointerdown', (e) => { const el = e.target.closest('.kc[data-k]'); if (!el) return; el.classList.add('is-down'); const up = () => { el.classList.remove('is-down'); removeEventListener('pointerup', up); }; addEventListener('pointerup', up); });
  // lamps: hold, test, ship
  const say = (t, d) => { kb.dataset.busy = '1'; scrT.textContent = t; scrD.textContent = d; clearTimeout(say.t); say.t = setTimeout(() => { delete kb.dataset.busy; clock(); $$('.kc--lamp', kb).forEach((x) => x.classList.remove('is-lit')); }, 2400); };
  const msg = { red: ['HOLD', 'Not yet proven'], amber: ['TEST', 'A/B in flight'], green: ['SHIP', 'Measured, then shipped'] };
  $$('[data-lamp]', kb).forEach((b) => b.addEventListener('click', () => {
    $$('.kc--lamp', kb).forEach((x) => x.classList.toggle('is-lit', x === b)); say(...msg[b.dataset.lamp]);
    if (!rm) gsap.fromTo(b, { y: 0 }, { y: 2, duration: 0.08, yoyo: true, repeat: 1 });
  }));
}

/* ───────────── the hero keyboard: it drops in, types the name, then follows the scroll ───────────── */
function keyboardMotion() {
  const kb = $('#kb'); if (!kb) return;
  const full = kb.dataset.mode === 'full';
  const keys = $$('.kc', kb), side = $$('.knob, .scr', kb);
  const scrT = $('#scr-t'), scrD = $('#scr-d');
  gsap.set(keys, { opacity: 0, y: -46, scale: 0.86, transformOrigin: '50% 100%' });
  if (side.length) gsap.set(side, { opacity: 0, y: -24 });
  gsap.set(kb, { opacity: 0, y: 40 });
  const tl = gsap.timeline({ delay: root.classList.contains('ready') ? 0.15 : 0.3 });
  tl.to(kb, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0)
    .to(keys, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.7)', stagger: { amount: full ? 1.0 : 0.5, from: 'start' }, clearProps: 'transform,opacity' }, 0.1)
    ;
  if (side.length) tl.to(side, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12 }, 0.5);
  // the cable draws itself
  const cb = $('.kb__cable .cb', kb);
  if (cb) tl.fromTo(cb, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut' }, 0.4).from('.kb__cable .cb2, .kb__cable .plug', { opacity: 0, duration: 0.5 }, 1.2);
  // it types the name
  if (full && scrT) {
    const word = 'ANJOR TANK', ids = [...word.toLowerCase()];
    const at = 1.7; kb.dataset.busy = '1';
    ids.forEach((id, i) => {
      tl.call(() => {
        const el = keyById(kb, id); if (!el) return;
        el.classList.add('is-down', 'is-lit'); setTimeout(() => el.classList.remove('is-down'), 110);
        scrT.textContent = id === ' ' ? '_' : id.toUpperCase(); scrD.textContent = word.slice(0, i + 1) + (i < ids.length - 1 ? '_' : '');
      }, null, at + i * 0.16);
    });
    tl.call(() => { scrT.textContent = 'AT'; scrD.textContent = 'Anjor Tank'; }, null, at + ids.length * 0.16 + 0.1)
      .call(() => { $$('.kc.is-lit', kb).forEach((el, i) => setTimeout(() => el.classList.remove('is-lit'), i * 70)); }, null, at + ids.length * 0.16 + 1.1)
      .call(() => { delete kb.dataset.busy; scrT.textContent = '…'; document.dispatchEvent(new Event('kb-clock')); }, null, at + ids.length * 0.16 + 2.0);
  }
  if (!full) return;
  // the knob turns as the page scrolls
  const knob = $('#knob');
  if (knob) gsap.to(knob, { rotation: 1080, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
  // the board tips back and settles as it leaves the screen
  gsap.set('#kbstage', { transformPerspective: 1600 });
  gsap.to(kb, { rotationX: 16, scale: 0.94, y: -20, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: { trigger: '#kbstage', start: 'center 38%', end: 'bottom top', scrub: 0.5 } });
}

/* ───────────── motion shared by every page ───────────── */
function pageMotion() {
  // the nav's progress line
  if (navP) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { navP.style.transform = `scaleX(${self.progress})`; } });
  // the blue lights behind the page drift as you scroll
  const gA = $('.space__glow:not(.space__glow--b)'), gB = $('.space__glow--b');
  const drive = { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 1.2 };
  if (gA) gsap.to(gA, { y: () => innerHeight * 0.7, x: () => -innerWidth * 0.18, scale: 1.2, ease: 'none', scrollTrigger: drive });
  if (gB) gsap.to(gB, { y: () => -innerHeight * 0.6, x: () => innerWidth * 0.22, ease: 'none', scrollTrigger: drive });
  // the hero text lifts away
  if ($('.hero__t')) gsap.to('.hero__t', { y: -50, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  // the ticker runs, and speeds up with your scroll
  const tk = $('#ticker');
  if (tk) {
    const run = gsap.to(tk, { x: () => -tk.scrollWidth / 2, duration: 90, ease: 'none', repeat: -1 });
    ScrollTrigger.create({ onUpdate: (self) => { const v = gsap.utils.clamp(-6, 8, self.getVelocity() / 240); gsap.timeline({ overwrite: true }).to(run, { timeScale: 1 + v, duration: 0.2 }).to(run, { timeScale: 1, duration: 1.2, ease: 'power2.out' }); } });
  }
  // the work grid: pictures settle as their cards arrive; the footer rises
  gsap.from('.foot__top > *', { y: 34, opacity: 0, stagger: 0.08, duration: 0.9, ease, scrollTrigger: { trigger: '.foot', start: 'top 88%', once: true } });
  $$('.strip__i i').forEach((d, i) => gsap.from(d, { scale: 0, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: d, start: 'top 92%', once: true }, delay: i * 0.05 }));
  // case pages: the big dot-matrix screen drifts a little
  const ca = $('.chead__art canvas'); if (ca) gsap.to(ca, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.chead', start: 'top top', end: 'bottom top', scrub: true } });
  // page heads: the lead and buttons drift up as the page goes
  $$('.phead .wrap > *').forEach((el, i) => gsap.to(el, { y: -14 * (i % 3), ease: 'none', scrollTrigger: { trigger: '.phead', start: 'top top', end: 'bottom top', scrub: true } }));
}

/* ───────────── the HETU card: tilts toward the pointer, the Hindi name wipes in, and the light moves ───────────── */
function hetuMotion() {
  const h = $('.hetu'), card = $('#hetu-card'); if (!h || !card) return;
  const hi = $('.hetu__hi', h), mark = $('.hetu__m', h);
  gsap.set(card, { transformPerspective: 1100 });
  if (hi) gsap.from(hi, { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: card, start: 'top 78%', once: true } });
  if (mark) gsap.from(mark, { rotate: -90, scale: 0.4, opacity: 0, duration: 1.1, ease: 'back.out(1.8)', scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
  gsap.fromTo(h, { '--bx': '-140px', '--by': '40px' }, { '--bx': '160px', '--by': '-60px', ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  if (fine) {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    h.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(-((e.clientY - r.top) / r.height - 0.5) * 7); });
    h.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }
}

/** hovering a plate or a callout lights its partner */
function hotLink(svg, sel) {
  if (!svg) return;
  const set = (i) => { $$('.pl, .co', svg).forEach((n) => n.classList.toggle('is-hot', i != null && +n.dataset.i === i)); svg.classList.toggle('has-hot', i != null); };
  $$(sel, svg).forEach((n) => { n.addEventListener('pointerenter', () => set(+n.dataset.i)); n.addEventListener('pointerleave', () => set(null)); });
  return set;
}

function layersLink() {
  const wrap = $('#layers'), art = $('#arch-art .iso'); if (!wrap || !art) return;
  const set = hotLink(art, '.pl, .co');
  $$('.layer', wrap).forEach((l) => {
    const on = () => { set(+l.dataset.i); l.classList.add('is-hot'); }, off = () => { set(null); l.classList.remove('is-hot'); };
    l.addEventListener('pointerenter', on); l.addEventListener('pointerleave', off); l.addEventListener('focus', on); l.addEventListener('blur', off);
  });
}

function architectMotion() {
  const art = $('#arch-art .iso'); if (!art) return;
  const pls = $$('.pl', art);
  gsap.from($$('.guides path', art), { drawSVG: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.2 });
  pls.forEach((p, i) => gsap.from(p, { y: -i * 100, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.3 + (3 - i) * 0.12, clearProps: 'opacity' }));
  gsap.from($$('.co', art), { opacity: 0, duration: 0.7, stagger: 0.12, delay: 1.1, clearProps: 'opacity' });
}

function mockMotion() {
  $$('.mock').forEach((m) => {
    ScrollTrigger.create({ trigger: m, start: 'top 80%', once: true, onEnter: () => {
      drawIn(m);
      gsap.from($$('.fc', m), { y: 30, opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.9, stagger: 0.18, delay: 1.0, ease: 'back.out(1.6)' });
      $$('.fc', m).forEach((c, i) => gsap.to(c, { y: '+=7', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 + i * 0.3 }));
    } });
  });
}

function fanMotion() {
  const fan = $('#fan'); if (!fan) return;
  gsap.set(fan, { '--s': 0 });
  ScrollTrigger.create({ trigger: fan, start: 'top 80%', once: true, onEnter: () => gsap.to(fan, { '--s': 1, duration: 1.4, ease: 'expo.out' }) });
  if (fine) {
    fan.addEventListener('pointerenter', () => gsap.to(fan, { '--s': 1.9, duration: 0.7, ease: 'power3.out', overwrite: true }));
    fan.addEventListener('pointerleave', () => gsap.to(fan, { '--s': 1, duration: 0.7, ease: 'power3.out', overwrite: true }));
  }
  $$('.fan__c img', fan).forEach((im, i) => { gsap.set(im, { scale: 1.14 }); gsap.to(im, { yPercent: i % 2 ? -4 : 4, duration: 2.6 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }); });
}

function journeyMotion() {
  const t = $('#tline'); if (!t) return;
  const fill = $('#tline-fill'), dot = $('#tline-dot');
  gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } });
  gsap.to(dot, { y: () => t.offsetHeight - 10, ease: 'none', scrollTrigger: { trigger: t, start: 'top 60%', end: 'bottom 60%', scrub: 0.4, invalidateOnRefresh: true } });
  $$('.chap__k', t).forEach((k) => gsap.from(k, { scale: 0.4, opacity: 0, rotate: -40, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: k, start: 'top 85%', once: true } }));
}

/** case page: contents list, progress and smooth anchor jumps */
function caseMotion() {
  const toc = $('.toc'); if (!toc) return;
  const links = $$('a', toc), prog = $('#prog');
  links.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const id = a.getAttribute('href'); gsap.to(window, { scrollTo: { y: id, offsetY: 96 }, duration: rm ? 0 : 0.9, ease: 'power3.inOut' }); }));
  $$('[data-sec]').forEach((s) => ScrollTrigger.create({
    trigger: s, start: 'top 45%', end: 'bottom 45%',
    onToggle: (self) => { if (self.isActive) links.forEach((a) => { if (a.getAttribute('href') === '#' + s.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); },
  }));
  ScrollTrigger.create({ trigger: '.cmain', start: 'top 35%', end: 'bottom 65%', onUpdate: (self) => { if (prog) prog.style.transform = `scaleX(${self.progress})`; } });
}

/** the architect page's release log runs like a build */
function releaseLog() {
  const rel = $('#rel'); if (!rel) return;
  const steps = $$('.step', rel);
  if (rm) { steps.forEach((s) => s.classList.add('is-done')); return; }
  ScrollTrigger.create({ trigger: rel, start: 'top 75%', once: true, onEnter: () => {
    const tl = gsap.timeline();
    steps.forEach((s) => { tl.call(() => s.classList.add('is-run')).to({}, { duration: 0.6 }).call(() => { s.classList.remove('is-run'); s.classList.add('is-done'); }); });
  } });
}

/* ───────────── boot ───────────── */
contactForm(); quickView(); revealPage();
if (root.classList.contains('boot') && !rm) runIntro(startPage); else startPage();
