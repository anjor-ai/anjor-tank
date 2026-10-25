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
import { CASES, HELLOS, SITE, DOORS, NAV } from './content.js';
import { quick } from './render.js';
import { wordReel, footLaunch, sceneCanvas } from './artcv.js';

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

/* ───────────── links: pages simply open (no page loader); a link to the page you are on scrolls to the top ───────────── */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin) return;
  if (u.pathname === location.pathname && !u.search && !u.hash) { e.preventDefault(); scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); }
});

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

/* ───────────── the opening film, after the ROQIVA film (first visit of a session, skippable) ─────────────
   0.0 the name rises; each letter turns into a small screen and back · 1.6 a checkerboard closes · 2.2 three hard colour cuts
   4.7 the seven systems run past as cards; the last zooms until its screen fills the frame · 7.6 the line, then the name · 9.8 hand-over */
function runFilm(done) {
  const film = $('#film');
  if (!film || !root.classList.contains('boot')) return done();
  const stage = $('#film-stage'), q = (sel) => $$(sel, film);
  let finished = false, tl;
  const fit = () => {
    const w = innerWidth, h = innerHeight, tall = w < h;
    stage.style.setProperty('--s', tall ? w / 1000 : Math.min(w / 1600, h / 900));
    film.classList.toggle('film--tall', tall);
  };
  fit(); addEventListener('resize', fit);
  q('canvas[data-fs]').forEach((cv) => sceneCanvas(cv, cv.dataset.fs, { cell: 4, k: 4, gap: 1, fps: 16 }));
  root.classList.add('boot-lock');
  let handed = false;
  const hand = () => { if (!handed) { handed = true; done(); } };
  const skip = () => {
    if (finished) return; finished = true;
    store.sset('anjor-boot', '1');
    tl && tl.pause(); hand();
    removeEventListener('resize', fit); removeEventListener('keydown', onKey);
    root.classList.remove('boot-lock');
    gsap.to(film, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => { root.classList.remove('boot'); film.remove(); ScrollTrigger.refresh(); } });
  };
  const onKey = (e) => { if (e.key === 'Escape') skip(); };
  addEventListener('keydown', onKey);
  film.addEventListener('click', skip); $('#film-skip').addEventListener('click', (e) => { e.stopPropagation(); skip(); });
  setTimeout(skip, 15000);

  const bg = $('.film__bg', film), lis = q('.fl__i'), scr = q('.film__s0 .fl__scr');
  const CUTS = [{ bg: '#0083ff', ink: '#f4f6f1' }, { bg: '#f4f6f1', ink: '#08090c' }, { bg: '#08090c', ink: '#2f95ff' }];
  gsap.set(q('.film__s'), { autoAlpha: 0 });
  tl = gsap.timeline();
  tl.set(q('.film__s0'), { autoAlpha: 1 }, 0)
    .fromTo(lis, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 }, 0.1);
  lis.forEach((li, k) => {
    const at = 0.8 + k * 0.07;
    tl.to(li, { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: 'power2.in' }, at)
      .fromTo(scr[k], { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, at + 0.05)
      .to(scr[k], { autoAlpha: 0, scale: 0.3, duration: 0.14, ease: 'power2.in' }, at + 0.45)
      .to(li, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, at + 0.52);
  });
  tl.fromTo(q('.film__ck i'), { scale: 0 }, { scale: 1.02, duration: 0.32, ease: 'power3.in', stagger: { grid: [9, 16], from: 'center', amount: 0.3 } }, 1.55)
    .set(q('.film__s0'), { autoAlpha: 0 }, 2.2).set(bg, { backgroundColor: CUTS[0].bg }, 2.2).set(q('.film__ck i'), { scale: 0 }, 2.2);
  CUTS.forEach((c, k) => {
    const at = 2.2 + k * 0.82, sc = q(`.film__c${k}`);
    tl.set(bg, { backgroundColor: c.bg }, at).set(sc, { autoAlpha: 1, color: c.ink }, at)
      .fromTo(sc, { scale: 1.14 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, at)
      .fromTo(q(`.film__c${k} .wi`), { yPercent: 105, skewY: 6 }, { yPercent: 0, skewY: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 }, at)
      .fromTo(q(`.film__c${k} .film__scr`), { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.2)' }, at + 0.12)
      .set(sc, { autoAlpha: 0 }, at + 0.82);
  });
  const A = 2.2 + 3 * 0.82, cards = q('.film__card'), W = 340, G = 30, X = (k) => (k - 3) * (W + G);
  gsap.set(cards, { x: (k) => X(k) + 340 });
  tl.set(bg, { backgroundColor: '#f4f6f1' }, A).set(q('.film__s3'), { autoAlpha: 1 }, A)
    .from(cards, { autoAlpha: 0, y: 70, scale: 0.8, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.07 }, A)
    .fromTo(q('.film__lead'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, A + 0.15)
    .to(cards, { x: (k) => X(k) - 340, duration: 1.3, ease: 'power1.inOut' }, A + 0.85)
    .to(q('.film__lead'), { autoAlpha: 0, duration: 0.2 }, A + 1.9)
    .to(cards.slice(0, 6), { autoAlpha: 0, duration: 0.25 }, A + 2.15)
    .to(cards[6], { x: 0, y: 0, scale: 8, duration: 0.8, ease: 'expo.in' }, A + 2.1)
    .set(bg, { backgroundColor: '#08090c' }, A + 2.9).set(q('.film__s3'), { autoAlpha: 0 }, A + 2.92);
  const B = A + 2.9;
  tl.set(q('.film__s4'), { autoAlpha: 1 }, B)
    .fromTo(q('.film__s4 .hw'), { autoAlpha: 0, y: 30, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', stagger: 0.06 }, B)
    .to(q('.film__hero'), { autoAlpha: 0, scale: 0.96, duration: 0.3 }, B + 1.3)
    .fromTo(q('.film__name'), { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.04em', duration: 0.7, ease: 'expo.out' }, B + 1.45)
    .fromTo(q('.film__status'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, B + 1.7)
    .call(skip, null, B + 2.4);
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
    heroField(); sysConsole(); palette(); tilt();
    if (!rm) { pageMotion(); hetuMotion(); architectMotion(); journeyMotion(); mockMotion(); fanMotion(); }
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

/* ───────────── the hero: a dot grid that follows the pointer and ripples when you click ───────────── */
function heroField() {
  const cv = $('#field'); if (!cv) return;
  const ctx = cv.getContext('2d'), hero = cv.parentElement, S = 26;
  let w = 0, h = 0, dpr = 1, cols = 0, rows = 0, live = true, ink = '246,248,251', acc = '47,149,255', n = 0;
  const P = { x: -999, y: -999, tx: -999, ty: -999 }, rip = [];
  const colors = () => { const l = root.getAttribute('data-theme') === 'light'; ink = l ? '6,7,10' : '246,248,251'; acc = l ? '0,131,255' : '47,149,255'; };
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = hero.clientWidth; h = hero.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cols = Math.ceil(w / S) + 1; rows = Math.ceil(h / S) + 1; };
  const draw = (t) => {
    if (!(n++ % 40)) colors();
    P.x += (P.tx - P.x) * 0.2; P.y += (P.ty - P.y) * 0.2;
    ctx.clearRect(0, 0, w, h);
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
      const x = c * S, y = r * S;
      let a = 0.075 + 0.04 * Math.sin(t / 900 + c * 0.33 + r * 0.27), near = 0;
      const dx = x - P.x, dy = y - P.y, d = Math.hypot(dx, dy);
      if (d < 200) near = (1 - d / 200) ** 2;
      for (const q of rip) { const e = Math.abs(Math.hypot(x - q.x, y - q.y) - q.r); if (e < 34) near += (1 - e / 34) * q.a; }
      a += near * 0.8;
      const s = 2 + near * 5;
      ctx.globalAlpha = Math.min(a, 0.95); ctx.fillStyle = `rgb(${near > 0.04 ? acc : ink})`;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    for (let i = rip.length - 1; i >= 0; i -= 1) { rip[i].r += 10; rip[i].a *= 0.985; if (rip[i].r > 1500 || rip[i].a < 0.03) rip.splice(i, 1); }
  };
  size(); colors(); addEventListener('resize', size);
  if (rm) { draw(0); return; }
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); P.tx = e.clientX - r.left; P.ty = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { P.tx = P.ty = -999; });
  hero.addEventListener('pointerdown', (e) => { if (e.target.closest('a, button, .sysc')) return; const r = hero.getBoundingClientRect(); rip.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, a: 1 }); });
  // the grid wakes up as the page opens
  rip.push({ x: w * 0.7, y: h * 0.4, r: 0, a: 1 });
  new IntersectionObserver(([e]) => { live = e.isIntersecting; }).observe(hero);
  gsap.ticker.add((time) => { if (live && !document.hidden) draw(time * 1000); });
}

/* ───────────── the hero console: six moves, each tied to a real case; click through or let it run ───────────── */
function sysConsole() {
  const c = $('#sysc'); if (!c) return;
  const tabs = $$('.sysc__t', c), panels = $$('.sysc__p', c), num = $('#sysc-n'), bar = $('#sysc-bar'), pp = $('#sysc-pp');
  const DUR = 4800, started = new Set();
  let cur = 0, timer = null, paused = false, inside = false;
  const stop = () => { clearTimeout(timer); gsap.killTweensOf(bar); gsap.set(bar, { scaleX: 0 }); };
  const run = () => { stop(); if (paused || inside || rm) return; gsap.to(bar, { scaleX: 1, duration: DUR / 1000, ease: 'none' }); timer = setTimeout(() => show(cur + 1), DUR); };
  function show(i, animate = true) {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === cur); t.tabIndex = k === cur ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== cur; });
    const cv = $('canvas', panels[cur]);
    if (!started.has(cur)) { started.add(cur); sceneCanvas(cv, cv.dataset.sc, { cell: 4, k: 4, gap: 1, fps: 16 }); }
    num.textContent = `${pad(cur + 1)} / ${pad(tabs.length)}`;
    if (animate && !rm) gsap.fromTo($$('.sysc__art, .sysc__c > *', panels[cur]), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', overwrite: true, clearProps: 'opacity,transform' });
    run();
  }
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => show(k));
    t.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); show(cur + d); tabs[cur].focus(); } });
  });
  c.addEventListener('pointerenter', () => { inside = true; stop(); });
  c.addEventListener('pointerleave', () => { inside = false; run(); });
  c.addEventListener('focusin', () => { inside = true; stop(); });
  c.addEventListener('focusout', () => { inside = false; run(); });
  pp.addEventListener('click', () => { paused = !paused; pp.setAttribute('aria-pressed', paused); pp.setAttribute('aria-label', paused ? 'Play the tour' : 'Pause the tour'); c.classList.toggle('is-paused', paused); run(); });
  show(0, false);
  new IntersectionObserver(([e]) => { if (e.isIntersecting) run(); else stop(); }).observe(c);
  if (!rm) gsap.from(c, { opacity: 0, y: 50, duration: 1.1, ease: 'expo.out', delay: root.classList.contains('ready') ? 0.25 : 0.45, clearProps: 'opacity,transform' });
}

/* ───────────── a command palette: Ctrl K (or /) from anywhere ───────────── */
function palette() {
  const dlg = $('#cmd'); if (!dlg || !dlg.showModal) return;
  const inp = $('#cmd-i'), list = $('#cmd-l');
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const hk = $('#hint-k'); if (hk) hk.textContent = mac ? '⌘ K' : 'Ctrl K';
  const esc = (v) => String(v).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const ITEMS = [
    ...NAV.map(([h, t]) => ({ g: 'Pages', t, h })), { g: 'Pages', t: 'Hire me', h: '/hire' }, { g: 'Pages', t: 'Contact', h: '/contact' },
    ...CASES.map((c) => ({ g: 'Case studies', t: c.title, h: `/work/${c.slug}`, s: c.cat })),
    { g: 'Actions', t: 'Switch theme', f: () => $('#theme')?.click() },
    { g: 'Actions', t: 'Copy my email', s: SITE.email, f: () => navigator.clipboard?.writeText(SITE.email).catch(() => {}) },
    { g: 'Actions', t: 'Book a call', h: SITE.calendly, ext: 1 }, { g: 'Actions', t: 'Open LinkedIn', h: SITE.linkedin, ext: 1 }, { g: 'Actions', t: 'Visit meshhetu.com', h: SITE.meshhetu, ext: 1 },
  ];
  let sel = 0, shown = [];
  const paint = () => $$('[role="option"]', list).forEach((o) => o.setAttribute('aria-selected', +o.dataset.k === sel));
  const render = () => {
    const q = inp.value.trim().toLowerCase();
    shown = ITEMS.filter((i) => !q || `${i.t} ${i.s || ''} ${i.g}`.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    let g = '';
    list.innerHTML = shown.map((i, k) => { const head = i.g !== g ? ((g = i.g), `<li class="cmd__g" role="presentation">${i.g}</li>`) : ''; return `${head}<li role="option" data-k="${k}" aria-selected="${k === sel}"><span>${esc(i.t)}</span>${i.s ? `<em>${esc(i.s)}</em>` : ''}</li>`; }).join('') || '<li class="cmd__g" role="presentation">Nothing matches</li>';
    $('[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' });
  };
  const go = (i) => { if (!i) return; dlg.close(); if (i.f) i.f(); else if (i.ext) window.open(i.h, '_blank', 'noopener'); else location.href = i.h; };
  const openIt = () => { inp.value = ''; sel = 0; render(); dlg.showModal(); inp.focus(); if (!rm) gsap.fromTo('.cmd__in', { y: -14, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'expo.out' }); };
  $('#cmd-b')?.addEventListener('click', openIt);
  addEventListener('keydown', (e) => {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (dlg.open) dlg.close(); else openIt(); }
    else if (e.key === '/' && !dlg.open && !e.target.closest?.('input, textarea, select, [contenteditable]')) { e.preventDefault(); openIt(); }
  });
  inp.addEventListener('input', () => { sel = 0; render(); });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); paint(); $('[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); $('[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); go(shown[sel]); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('[data-k]'); if (li) go(shown[+li.dataset.k]); });
  list.addEventListener('pointermove', (e) => { const li = e.target.closest('[data-k]'); if (li && +li.dataset.k !== sel) { sel = +li.dataset.k; paint(); } });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

/* ───────────── work cards lean toward the pointer ───────────── */
function tilt() {
  if (!fine || rm) return;
  $$('.ccard, .door').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 7); rx(-((e.clientY - r.top) / r.height - 0.5) * 6); });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
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
contactForm(); quickView();
if (root.classList.contains('boot') && !rm) runFilm(startPage); else startPage();
