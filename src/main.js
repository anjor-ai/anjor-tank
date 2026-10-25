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
import { SCENES } from './art.js';

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
  if (m) m.setAttribute('content', t === 'dark' ? '#141413' : '#ffffff');
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

/* ───────────── nav: hides on the way down, returns on the way up; mobile sheet ───────────── */
const nav = $('#nav'), sheet = $('#sheet'), burger = $('#burger');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  if (y > 140 && y > lastY + 6 && sheet.hidden) nav.classList.add('is-hidden');
  else if (y < lastY - 6 || y < 140) nav.classList.remove('is-hidden');
  lastY = y;
}, { passive: true });
function sheetOpen(o) {
  sheet.hidden = !o; burger.setAttribute('aria-expanded', String(o));
  if (o) { nav.classList.remove('is-hidden'); if (!rm) gsap.from('#sheet a', { y: 18, opacity: 0, stagger: 0.05, duration: 0.5, ease }); }
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
  document.addEventListener('pointerover', (e) => { cur.classList.toggle('big', !!e.target.closest('a, button, .ccard, .layer, .door, .fchip, .ph')); });
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
  gsap.fromTo(lines, { drawSVG: '0%' }, {
    drawSVG: '100%', duration: 1.1, delay, ease: 'power2.inOut', stagger: { amount: 0.7, from: 'start' },
    onComplete: () => lines.forEach((l) => { l.style.strokeDasharray = ''; l.style.strokeDashoffset = ''; }),
  });
  gsap.from(solids, { opacity: 0, duration: 0.6, delay: delay + 0.5, stagger: { amount: 0.4 }, ease: 'none', clearProps: 'opacity' });
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

/* ───────────── intro: HELLO in many languages over a world that zooms into Mumbai ───────────── */
function runIntro(done) {
  const intro = $('#intro'), cv = $('#globe');
  if (!intro || !cv || !root.classList.contains('boot')) return done();
  const ctx = cv.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  let W = 0, H = 0, finished = false, tl;
  const word = $('#intro-w'), lab = $('#intro-l'), hud = $('#intro-h');
  const MUM = { lat: 19.076 * Math.PI / 180, lon: 72.8777 * Math.PI / 180 };
  const cam = { lon: -1.9, lat: 0.34, R: 0, zoom: 0 }; // radians; R is set on resize
  const lit = { n: 0 };
  let land = null, LW = 0, LH = 0;

  const finish = () => {
    if (finished) return; finished = true;
    store.sset('anjor-boot', '1');
    tl && tl.kill(); gsap.ticker.remove(draw); removeEventListener('resize', resize);
    root.classList.remove('boot-lock');
    gsap.to(intro, { opacity: 0, duration: 0.35, onComplete: () => { root.classList.remove('boot'); intro.remove(); ScrollTrigger.refresh(); } });
    done();
  };
  const resize = () => {
    W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  root.classList.add('boot-lock');
  resize(); addEventListener('resize', resize);
  const base = () => Math.min(W, H) * 0.34;

  // land bitmap → single-channel array
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); LW = c.width = img.width; LH = c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, LW, LH).data; land = new Float32Array(LW * LH);
    for (let i = 0; i < land.length; i++) land[i] = d[i * 4] / 255;
    start();
  };
  img.onerror = finish;
  img.src = '/img/land.png';
  const sample = (lat, lon) => { // bilinear, wraps in longitude
    let fx = ((lon + Math.PI) / (2 * Math.PI)) * LW - 0.5, fy = ((Math.PI / 2 - lat) / Math.PI) * LH - 0.5;
    fy = Math.max(0, Math.min(LH - 1.001, fy)); fx = ((fx % LW) + LW) % LW;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0, x1 = (x0 + 1) % LW, y1 = y0 + 1;
    return (land[y0 * LW + x0] * (1 - tx) + land[y0 * LW + x1] * tx) * (1 - ty) + (land[y1 * LW + x0] * (1 - tx) + land[y1 * LW + x1] * tx) * ty;
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, R = cam.R;
    const sp = 7 + cam.zoom * 7; // dot pitch in css px, grows as we zoom so the coast stays crisp
    const sinP = Math.sin(cam.lat), cosP = Math.cos(cam.lat);
    // disc
    const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, '#10192d'); g.addColorStop(1, '#070a14');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    // dots on a screen grid, looked up on the globe (an LED-matrix world)
    const x0 = Math.max(0, Math.floor((cx - R) / sp) * sp), x1 = Math.min(W, cx + R), y0 = Math.max(0, Math.floor((cy - R) / sp) * sp), y1 = Math.min(H, cy + R);
    const off = (cx % sp), offy = (cy % sp);
    for (let y = y0 + offy; y < y1; y += sp) {
      for (let x = x0 + off; x < x1; x += sp) {
        const u = (x - cx) / R, v = (cy - y) / R, r2 = u * u + v * v;
        if (r2 >= 1) continue;
        const z = Math.sqrt(1 - r2);
        const lat = Math.asin(z * sinP + v * cosP), lon = cam.lon + Math.atan2(u, z * cosP - v * sinP);
        const L = sample(lat, lon);
        const shade = 0.25 + 0.75 * z;
        if (L > 0.5) {
          ctx.fillStyle = `rgba(${90 + 120 * z | 0},${170 + 70 * z | 0},255,${0.35 + 0.65 * shade})`;
          ctx.beginPath(); ctx.arc(x, y, sp * 0.27, 0, 7); ctx.fill();
        } else {
          ctx.fillStyle = `rgba(80,120,200,${0.1 * shade})`;
          ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
        }
      }
    }
    // rim light and HUD ring
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(74,163,255,.55)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(74,163,255,.18)'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.07, 0, 7); ctx.stroke();
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2 + cam.lon * 0.5, l = i % 6 === 0 ? 10 : 4;
      ctx.strokeStyle = i % 6 === 0 ? 'rgba(250,249,245,.45)' : 'rgba(250,249,245,.18)';
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 1.07, cy + Math.sin(a) * R * 1.07); ctx.lineTo(cx + Math.cos(a) * (R * 1.07 + l), cy + Math.sin(a) * (R * 1.07 + l)); ctx.stroke();
    }
    // Mumbai pin
    const dl = MUM.lon - cam.lon, cL = Math.cos(MUM.lat);
    const pz = sinP * Math.sin(MUM.lat) + cosP * cL * Math.cos(dl);
    if (pz > 0) {
      const px = cx + R * cL * Math.sin(dl), py = cy - R * (cosP * Math.sin(MUM.lat) - sinP * cL * Math.cos(dl));
      const t = (performance.now() / 900) % 1;
      ctx.strokeStyle = `rgba(74,163,255,${0.9 * (1 - t)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 6 + t * (14 + cam.zoom * 60), 0, 7); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 3 + cam.zoom * 3, 0, 7); ctx.fill();
    }
  }

  function start() {
    cam.R = base();
    gsap.ticker.add(draw);
    // greetings: English then Hindi first, then the rest
    word.textContent = HELLOS[0][0]; lab.textContent = HELLOS[0][1];
    tl = gsap.timeline({ defaults: { ease: 'none' } });
    const per = 0.36;
    HELLOS.forEach(([w, l], i) => { if (i) tl.call(() => { flickerTo(word, w); lab.textContent = l; }, null, i * per + 0.35); });
    const t0 = HELLOS.length * per + 0.45; // end of greetings
    tl.fromTo(cam, { lon: -1.9 }, { lon: MUM.lon - 0.06, lat: MUM.lat, duration: t0, ease: 'power2.inOut' }, 0);
    tl.to('.intro__c', { opacity: 0, y: -14, duration: 0.45, ease: 'power2.in' }, t0 - 0.1);
    tl.call(() => { hud.textContent = `Locked · ${SITE.lat} ${SITE.lon}`; }, null, t0);
    tl.to(cam, { R: () => base() * 15, zoom: 1, lon: MUM.lon, duration: 1.9, ease: 'expo.inOut' }, t0);
    tl.fromTo(intro, { '--r': '0px' }, { '--r': () => Math.hypot(W, H) * 0.75 + 'px', duration: 1.0, ease: 'power2.in' }, t0 + 1.35);
    tl.call(done, null, t0 + 1.4); // page motion starts as the hole opens
    tl.call(finish, null, t0 + 2.4);
  }
  $('#intro-s')?.addEventListener('click', () => { if (!finished) { done(); finish(); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !finished) { done(); finish(); } });
  setTimeout(() => { if (!finished) { done(); finish(); } }, 12000);
}

/* ───────────── greeting in the hero keeps cycling ───────────── */
function heroHello() {
  const w = $('#hello'), l = $('#hello-l');
  if (!w || rm) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    i = (i + 1) % HELLOS.length; flickerTo(w, HELLOS[i][0]); l.textContent = HELLOS[i][1];
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
        c.fillStyle = k > 8 ? '#fff3dd' : k > 5 ? '#ffc98a' : '#e8763c';
        c.fillText(RAMP[k], i * s.cw, j * s.ch);
      }
    }
  }
  if (rm) { state.forEach((s) => frame(s, 1.2)); return; }
  gsap.ticker.add((time) => { state.forEach((s) => s.on && frame(s, time)); });
}

/* ───────────── MESHHETU dot-matrix reel ───────────── */
function reels() {
  $$('[data-reel]').forEach((reel) => {
    const N = 6, cvs = [];
    for (let k = 0; k < N; k++) { const c = document.createElement('canvas'); c.width = 52; c.height = 68; reel.append(c); cvs.push(c); }
    const paint = (c, scene, noise = 0) => {
      const x = c.getContext('2d'); x.clearRect(0, 0, 52, 68);
      const rows = scene.length, cw = 52 / 10, ch = 68 / 13;
      for (let j = 0; j < 13; j++) for (let i = 0; i < 9; i++) {
        const on = noise ? Math.random() < noise : (scene[j]?.[i] === '#');
        x.fillStyle = on ? '#faf9f5' : '#2a2a2e'; x.beginPath(); x.arc(cw * (i + 1), ch * (j + 0.9), on ? 1.7 : 1.1, 0, 7); x.fill();
      }
      return rows;
    };
    let off = 0;
    const set = (k) => { const c = cvs[k], sc = SCENES[(off + k * 2) % SCENES.length]; if (rm) return paint(c, sc); let n = 0; const t = setInterval(() => { n++; if (n < 4) paint(c, sc, 0.4); else { paint(c, sc); clearInterval(t); } }, 45); };
    cvs.forEach((_, k) => set(k));
    if (rm) return;
    let vis = false; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(reel);
    setInterval(() => { if (!vis || document.hidden) return; off += 1; cvs.forEach((_, k) => setTimeout(() => set(k), k * 110)); }, 2200);
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
    body.scrollTop = 0;
    if (!rm) { gsap.from(body.children[0], { x: dir * 40, opacity: dir ? 0 : 1, duration: 0.45, ease }); drawIn($('.wf', body), 0.1); gsap.from($$('.qv__m div', body), { y: 14, opacity: 0, stagger: 0.08, duration: 0.5, delay: 0.2, ease }); }
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
    $('#hero-art .me')?.removeAttribute('data-in'); // the hero portrait has its own entrance
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
          els.forEach((el) => { const art = $(':scope > .ccard__art svg, .chead__art svg', el) || (el.matches('.chead__art') && $('svg', el)); if (art) drawIn(art, 0.15); });
        },
      });
    }
    counters(); asciiCards(); reels();
    filters('#filters', '#cgrid .ccard', (c, f) => f === 'All' || c.dataset.tag === f);
    filters('#pfilters', '#mas .ph', (c, f) => f === 'All' || c.dataset.g === f);
    heroHello();
    if (!rm) { homeMotion(); architectMotion(); journeyMotion(); mockMotion(); fanMotion(); }
    arcStory(); caseMotion(); layersLink(); releaseLog();
    ScrollTrigger.refresh();
  };
  (document.fonts?.ready || Promise.resolve()).then(run);
}

function homeMotion() {
  const art = $('#hero-art'); if (!art) return;
  const iso = $('.iso', art), pls = $$('.pl', iso), cos = $$('.co', iso);
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.hello', { opacity: 0, x: -20, duration: 0.7, ease }, 0);
  tl.from($$('.guides path', iso), { drawSVG: 0, duration: 1.1, ease: 'power2.inOut' }, 0.1);
  pls.forEach((p, i) => tl.from(p, { y: -i * 100, opacity: 0, duration: 1.1, ease: 'expo.out', clearProps: 'opacity' }, 0.25 + (3 - i) * 0.12));
  tl.from(cos, { opacity: 0, x: (i) => (i % 2 ? 24 : -24), duration: 0.7, stagger: 0.12, ease, clearProps: 'opacity' }, 1.0);
  tl.from('.me', { y: 40, opacity: 0, rotate: -6, duration: 0.9, ease: 'back.out(1.6)' }, 1.2);
  tl.call(() => pls.forEach((p, i) => gsap.to(p, { y: '+=6', duration: 2.4 + i * 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.3 })), null, 2);
  if (fine) {
    const qs = pls.map((p, i) => gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3' }));
    art.addEventListener('pointermove', (e) => { const r = art.getBoundingClientRect(), n = (e.clientX - r.left) / r.width - 0.5; qs.forEach((q, i) => q(n * (10 + i * 8))); });
    art.addEventListener('pointerleave', () => qs.forEach((q) => q(0)));
  }
  hotLink(iso, '.pl, .co');
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

/** pinned three-act story on Home */
function arcStory() {
  const arc = $('#arc'); if (!arc) return;
  const steps = $$('.arc__s', arc), acts = $$('.act', arc);
  let cur = 0;
  const setAct = (i) => {
    if (i === cur) return; cur = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i)); acts.forEach((a, k) => a.classList.toggle('is-on', k === i));
    if (rm) return;
    const a = acts[i];
    if (i === 0) drawIn($('svg', a)); else if (i === 1) gsap.from($$('.mini > div', a), { y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease });
    else gsap.from($('.lock', a), { scale: 0.8, opacity: 0, duration: 0.9, ease: 'back.out(1.6)' });
    if (i === 1) $$('.mini svg', a).forEach((s, k) => drawIn(s, 0.1 + k * 0.1));
  };
  if (!rm) gsap.matchMedia().add('(min-width: 901px)', () => {
    ScrollTrigger.create({
      trigger: '.arc__g', start: 'center center', end: '+=220%', pin: true, anticipatePin: 1,
      onUpdate: (self) => setAct(Math.min(2, Math.floor(self.progress * 3))),
    });
  }); // on small screens all three steps are listed and the first act stays on show
  if (rm) { steps.forEach((s, k) => s.addEventListener('mouseenter', () => setAct(k))); }
  if (!rm) drawIn($('svg', acts[0]), 0.4);
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
