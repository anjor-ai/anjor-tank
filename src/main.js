/* ==========================================================================
   Anjor Tank: portfolio. "A blueprint in space."

   File map
     index.html   static markup; src/site.js fills the marked lists at build time
     src/site.js  all copy and data + the HTML templates for it
     src/styles.css  tokens (copied from the MESHHETU site) and every component
     src/main.js  this file: theme, starfield, HUD, wordmark, interactions, motion

   Motion rules (from greensock/gsap-skills)
     · Plugins registered once, bundled from npm (the CSP stays script-src 'self').
     · All motion lives inside gsap.matchMedia(): reduced-motion users get the finished page, nothing hidden.
     · Only transforms, opacity and SVG stroke are animated. Mouse followers use gsap.quickTo().
     · ScrollTriggers are only on top-level tweens, created in page order, then ScrollTrigger.sort() + refresh().
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';

import './styles.css';
import { C, esc, fmt, fmtDp, ARROW, renderDecisionBody, renderCase } from './site.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, CustomEase);
CustomEase.create('eOut', '.22,.85,.3,1');
CustomEase.create('eSpring', '.34,1.4,.64,1');
gsap.defaults({ duration: 0.7, ease: 'eOut' });
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const RM = root.classList.contains('rm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ======================================================================
   THEME  (dark / light, remembered; circular reveal through the View Transitions API)
   ====================================================================== */
const themeListeners = [];
const onTheme = (fn) => themeListeners.push(fn);
function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
function rgbOf(c) {                                  // '#rrggbb' or '#rgb' or 'r, g, b' -> [r, g, b]
  c = c.trim();
  if (c[0] === '#') { if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); }
  return c.split(',').map((x) => +x);
}
function initTheme() {
  const btn = $('#theme');
  const label = () => btn.setAttribute('aria-label', 'Switch to ' + (root.dataset.theme === 'dark' ? 'light' : 'dark') + ' theme');
  label();
  btn.addEventListener('click', (e) => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('anjor-theme', next); } catch (err) { /* storage can be blocked */ }
      const m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', next === 'dark' ? '#141413' : '#ffffff');
      label(); themeListeners.forEach((fn) => fn(next));
    };
    if (!document.startViewTransition || RM) { apply(); return; }
    const x = e.clientX || innerWidth - 48, y = e.clientY || 32;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  });
}

/* ======================================================================
   STARFIELD  (dark: stars and constellations. light: a star chart drawn as registration crosses)
   ====================================================================== */
function initStars() {
  const cv = $('#stars'), ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1, stars = [], chain = [], rgb = [250, 249, 245], accent = [47, 149, 255], light = false;
  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, t = 0, shoot = null, nextShoot = 4, raf = 0, last = 0;

  const palette = () => { rgb = rgbOf(cssVar('--star')); accent = rgbOf(cssVar('--accent')); light = root.dataset.theme === 'light'; };
  function seed() {
    stars = [];
    const n = clamp(Math.round((w * h) / 9500), 70, 230);
    for (let i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, z: 0.25 + Math.random() * 0.75, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 });
    const bright = stars.filter((s) => s.z > 0.82).sort((a, b) => a.x - b.x).slice(0, 14);   // constellation chain
    chain = bright; bright.forEach((b) => { b.fixed = true; });
  }
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed(); draw();
  }
  function pos(s) {                                  // parallax: mouse and scroll, deeper stars move less
    if (s.fixed) return [s.x + tx * 18 * s.z, s.y + ty * 18 * s.z];
    let y = (s.y - sy * 0.06 * s.z) % h; if (y < 0) y += h;
    return [s.x + tx * 18 * s.z, y + ty * 18 * s.z];
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const [r, g, b] = rgb;
    // constellation lines
    ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${light ? 0.16 : 0.2})`; ctx.beginPath();
    let px = 0, py = 0;                              // chain ignores scroll wrap; skip hops that are too long to read as a constellation
    chain.forEach((s, i) => { const x = s.x + tx * 18 * s.z, y = s.y + ty * 18 * s.z; if (i && Math.hypot(x - px, y - py) < 280) ctx.lineTo(x, y); else ctx.moveTo(x, y); px = x; py = y; }); ctx.stroke();
    for (const s of stars) {
      const [x, y] = pos(s);
      const a = (light ? 0.22 : 0.18) + s.z * (light ? 0.4 : 0.7) * (0.65 + 0.35 * Math.sin(t * s.sp + s.ph));
      if (light) {                                   // registration cross
        const k = 1.5 + s.z * 2.5; ctx.strokeStyle = `rgba(${r},${g},${b},${a})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x - k, y); ctx.lineTo(x + k, y); ctx.moveTo(x, y - k); ctx.lineTo(x, y + k); ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`; ctx.beginPath(); ctx.arc(x, y, 0.5 + s.z * 1.1, 0, 6.2832); ctx.fill();
      }
    }
    if (shoot) {                                     // a signal crossing the sky
      const k = shoot.p, x = shoot.x0 + (shoot.x1 - shoot.x0) * k, y = shoot.y0 + (shoot.y1 - shoot.y0) * k;
      const x2 = x - (shoot.x1 - shoot.x0) * 0.12, y2 = y - (shoot.y1 - shoot.y0) * 0.12;
      const grad = ctx.createLinearGradient(x, y, x2, y2); grad.addColorStop(0, `rgba(${accent[0]},${accent[1]},${accent[2]},${0.9 * (1 - k)})`); grad.addColorStop(1, `rgba(${accent[0]},${accent[1]},${accent[2]},0)`);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000 || 0.016, 0.05); last = now; t += dt;
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    nextShoot -= dt;
    if (!shoot && nextShoot <= 0 && !light) { const y0 = Math.random() * h * 0.5; shoot = { p: 0, x0: Math.random() * w * 0.6, y0, x1: w * (0.5 + Math.random() * 0.5), y1: y0 + h * 0.25 }; nextShoot = 7 + Math.random() * 8; }
    if (shoot) { shoot.p += dt / 1.1; if (shoot.p >= 1) shoot = null; }
    draw();
  }
  palette(); resize();
  addEventListener('resize', resize);
  onTheme(() => { palette(); draw(); });
  if (RM) return;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  addEventListener('scroll', () => { sy = scrollY; }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else { last = performance.now(); raf = requestAnimationFrame(frame); } });
  raf = requestAnimationFrame(frame);
}

/* ======================================================================
   WORDMARK  (each letter fades out, a dot-matrix pixel tile flips in, holds, flips back)
   ====================================================================== */
const SCENES = [
  ['#########', '#########', '.#######.', '..#####..', '...###...', '...###...', '...###...', '...###...', '...###...', '...###...'],            // funnel
  ['.......##', '.......##', '....##.##', '....##.##', '.##.##.##', '.##.##.##', '.##.##.##', '.##.##.##', '.##.##.##', '#########'],            // bars
  ['....#....', '...###...', '....#....', '....#....', '....#....', '.###.###.', '.#.....#.', '.#.....#.', '###...###', '###...###'],            // decision branch
  ['.....###.', '....###..', '...###...', '..###....', '.#######.', '....###..', '...###...', '..###....', '..##.....', '.##......', '.#.......'],  // bolt
  ['##.......', '.##......', '..#######', '..#.....#', '..#.....#', '..#######', '..#.....#', '...#...#.', '...#####.', '..##...##', '..##...##'],         // cart
  ['..#####..', '.#######.', '##.###.##', '##.###.##', '#########', '#.......#', '#.......#', '#.......#', '#.......#', '#########'],             // parcel
  ['....#....', '...###...', '..#####..', '..#####..', '..#####..', '.#######.', '.#######.', '#########', '#########', '.........', '....#....', '...###...'], // bell
  ['....#....', '....#....', '...#.#...', '...#.#...', '##.#.#.##', '..#...#..', '..#...#..'],                                                         // pulse
  ['.#####...', '#.....#..', '#.....#..', '#.....#..', '#.....#..', '.#####...', '......##.', '.......##', '........#'],                                        // search
];
const WMS = [];
function drawScene(canvas, art) {
  const cols = 9, rows = 12, cs = 12;
  canvas.width = cols * cs; canvas.height = rows * cs;
  const ctx = canvas.getContext('2d'), top = Math.floor((rows - art.length) / 2);
  const accent = cssVar('--accent') || '#0083ff', [r, g, b] = rgbOf(cssVar('--text') || '#faf9f5');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const row = art[y - top], lit = !!row && row.charAt(x) === '#';
    ctx.fillStyle = lit ? accent : `rgba(${r},${g},${b},.14)`;
    ctx.beginPath(); ctx.arc(x * cs + cs / 2, y * cs + cs / 2, lit ? cs * 0.38 : cs * 0.15, 0, 6.2832); ctx.fill();
  }
}
function Wordmark(el) {
  const text = el.dataset.wm, slots = []; let n = 0;
  el.textContent = '';
  if (el.hasAttribute('data-decor')) el.setAttribute('aria-hidden', 'true');
  else { el.setAttribute('role', 'img'); el.setAttribute('aria-label', el.dataset.label || text); }
  for (const chr of text) {
    if (chr === ' ') { const g = document.createElement('span'); g.className = 'wm__gap'; g.setAttribute('aria-hidden', 'true'); el.appendChild(g); continue; }
    const slot = document.createElement('span'), ch = document.createElement('span'), tile = document.createElement('span'), cv = document.createElement('canvas');
    slot.className = 'wm__slot'; slot.setAttribute('aria-hidden', 'true');
    ch.className = 'wm__ch'; ch.textContent = chr; tile.className = 'wm__tile'; tile.appendChild(cv);
    slot.append(ch, tile); el.appendChild(slot);
    slots.push({ ch, tile, canvas: cv, art: SCENES[n++ % SCENES.length] });
  }
  const wm = { el, slots, busy: false, tl: null, draw: () => slots.forEach((s) => drawScene(s.canvas, s.art)) };
  wm.draw();
  if (!RM) slots.forEach((s) => gsap.set(s.tile, { opacity: 0, scale: 0.2, rotate: -8 }));
  WMS.push(wm);
  return wm;
}
function flipTimeline(wm, o) {
  const tl = gsap.timeline(o.vars || {});
  wm.slots.forEach((s, i) => {
    const t = i * o.step, tIn = t + 0.14, tOut = tIn + 0.42 + o.hold;
    tl.to(s.ch, { opacity: 0, scale: 0.6, duration: 0.22, ease: 'power2.in' }, t)
      .fromTo(s.tile, { opacity: 0, scale: 0.2, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(2.4)' }, tIn)
      .to(s.tile, { opacity: 0, scale: 0.2, rotate: 8, duration: 0.24, ease: 'power2.in' }, tOut)
      .to(s.ch, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, tOut + 0.12);
  });
  return tl;
}
function loopWordmark(wm, o) {                       // plays only while it is on screen
  wm.tl = flipTimeline(wm, { step: o.step, hold: o.hold, vars: { repeat: -1, repeatDelay: o.gap, delay: o.delay || 0, paused: true } });
  ScrollTrigger.create({ trigger: wm.el, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive && (!o.gate || o.gate()) ? wm.tl.play() : wm.tl.pause()) });
}
function hoverWordmark(wm, trigger) {                // nav: flips once on hover or focus
  const go = () => { if (wm.busy) return; wm.busy = true; flipTimeline(wm, { step: 0.035, hold: 0.5, vars: { onComplete: () => { wm.busy = false; } } }); };
  trigger.addEventListener('mouseenter', go); trigger.addEventListener('focus', go);
}

/* ======================================================================
   HUD  (crosshair guides with live coordinates, scroll ruler, current sheet)
   ====================================================================== */
function initHud() {
  const hud = $('.hud'), xy = $('#hud-xy'), mark = $('#hud-mark'), pct = $('#hud-pct'), rule = $('.hud__rule');
  if (FINE && !RM) {
    const gx = gsap.quickTo('#hud-x', 'y', { duration: 0.25, ease: 'power3' }), gy = gsap.quickTo('#hud-y', 'x', { duration: 0.25, ease: 'power3' });
    const lx = gsap.quickTo(xy, 'x', { duration: 0.35, ease: 'power3' }), ly = gsap.quickTo(xy, 'y', { duration: 0.35, ease: 'power3' });
    let pending = false, px = 0, py = 0;
    addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY; hud.classList.add('is-live');
      if (pending) return; pending = true;
      requestAnimationFrame(() => {
        pending = false; gx(py); gy(px); lx(px + 14); ly(py + 14);
        xy.textContent = 'X ' + String(Math.round(px)).padStart(4, '0') + ' · Y ' + String(Math.round(py + scrollY)).padStart(4, '0');
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => hud.classList.remove('is-live'));
  }
  let H = rule.offsetHeight;
  const setY = gsap.quickSetter(mark, 'y', 'px');
  ScrollTrigger.create({
    start: 0, end: 'max', onRefresh: () => { H = rule.offsetHeight; },
    onUpdate: (s) => { setY(s.progress * (H - 2)); pct.textContent = String(Math.round(s.progress * 100)).padStart(3, '0') + '%'; },
  });
}

/* ======================================================================
   NAV  (stuck state, mobile sheet, smooth anchors, section spy)
   ====================================================================== */
function initNav() {
  const nav = $('#nav'), burger = $('#burger'), sheet = $('#sheet'), links = $$('.nav__links a');
  const stuck = () => nav.classList.toggle('is-stuck', scrollY > 8 || sheet.dataset.open === '1');
  stuck(); addEventListener('scroll', stuck, { passive: true });
  const setSheet = (open) => { sheet.dataset.open = open ? '1' : '0'; burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); stuck(); };
  burger.addEventListener('click', () => setSheet(sheet.dataset.open !== '1'));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setSheet(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.dataset.open === '1') { setSheet(false); burger.focus(); } });
  matchMedia('(min-width: 1081px)').addEventListener('change', (m) => { if (m.matches) setSheet(false); });

  // smooth anchors with ScrollToPlugin (instant for reduced motion)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const target = $(id); if (!target) return;
    e.preventDefault();
    if (RM) target.scrollIntoView(); else gsap.to(window, { duration: 1.1, ease: 'power3.inOut', scrollTo: { y: target, offsetY: id === '#top' ? 0 : 56 }, overwrite: true });
    history.replaceState(null, '', id);
  });

  const hudSheet = $('#hud-sheet');
  $$('[data-sheet]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (s) => {
        links.forEach((a) => { if (a.getAttribute('href') === '#' + sec.id) { if (s.isActive) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); } });
        if (s.isActive) hudSheet.textContent = 'Sheet ' + sec.dataset.sheet + ' / 07 · ' + sec.dataset.name;
      },
    });
  });
}

/* ======================================================================
   SHEET 02 · decision log
   ====================================================================== */
function initDecisions() {
  const list = $('#dlog-list'), det = $('#dlog-det'); let cur = 0;
  function show(i, focus) {
    if (i === cur) { if (focus) $('#dtab-' + i).focus(); return; }
    cur = i;
    $$('.dlog__row', list).forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    det.setAttribute('aria-labelledby', 'dtab-' + i);
    if (focus) $('#dtab-' + i).focus();
    gsap.killTweensOf(det.children);
    det.innerHTML = renderDecisionBody(C.decisions[i]);
    if (!RM) {
      gsap.from(det.children, { y: 14, opacity: 0, duration: 0.5, stagger: 0.07, clearProps: 'transform,opacity' });
      const code = $('.code', det); if (code) gsap.from(code, { clipPath: 'inset(0 100% 0 0)', duration: 0.7, ease: 'power3.out', clearProps: 'clipPath' });
    }
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('.dlog__row'); if (b) show(+b.dataset.i); });
  list.addEventListener('keydown', (e) => {
    const n = C.decisions.length; let k = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') k = (cur + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') k = (cur - 1 + n) % n;
    else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = n - 1;
    if (k !== null) { e.preventDefault(); show(k, true); }
  });
}

/* ======================================================================
   SHEET 03 · work modules (spotlight, line drawing, case dialog)
   ====================================================================== */
function initWork() {
  const grid = $('#work-grid'), dlg = $('#case'), body = $('#case-body');
  $$('.pcard', grid).forEach((card) => {
    const ico = $('.pcard__ico', card);
    if (FINE) card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', e.clientX - r.left + 'px'); card.style.setProperty('--my', e.clientY - r.top + 'px'); });
    if (!RM) {
      let tw = null;
      card.addEventListener('pointerenter', () => { if (tw && tw.isActive()) return; tw = gsap.fromTo(ico.children, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.08, ease: 'power2.inOut' }); });
    }
  });
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-case]'); if (!b) return;
    const p = C.projects.find((x) => x.id === b.dataset.case); if (!p) return;
    body.innerHTML = renderCase(p); dlg.showModal(); body.scrollTop = 0;
    if (!RM) gsap.fromTo(body.children, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, clearProps: 'transform,opacity' });
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
}

/* ======================================================================
   SHEET 06 · funnel diagnostic (runs in the browser, nothing is sent)
   ====================================================================== */
const SIM = { preset: 'ecom', stages: null, close: 50 };
function simLoad(k) { SIM.preset = k; SIM.stages = C.funnel.presets[k].stages.map((x) => ({ k: x.k, n: x.n, i: x.i, v: x.v, b: x.b })); }
function simCalc() {
  const st = SIM.stages, steps = []; let broken = false;
  for (let i = 1; i < st.length; i++) {
    const prev = st[i - 1].v, cur = st[i].v, ok = prev > 0 && cur <= prev;
    if (!ok) broken = true;
    const cr = prev > 0 ? cur / prev : 0;
    steps.push({ i, n: st[i].n, cr, b: st[i].b, gap: st[i].b ? st[i].b - cr : 0, ok });
  }
  const base = st.map((x) => x.v), last = base.length - 1, ranked = [];
  if (!broken) {
    steps.forEach((s) => {
      if (!s.b || s.gap <= 0) return;
      const sim = base.slice();
      for (let j = s.i; j <= last; j++) {
        if (j === s.i) sim[j] = sim[j - 1] * s.b;
        else { const c0 = base[j - 1] > 0 ? base[j] / base[j - 1] : 0; sim[j] = sim[j - 1] * c0; }
      }
      s.recover = sim[last] - base[last]; ranked.push(s);
    });
    ranked.sort((a, b) => b.recover - a.recover);
  }
  const worst = ranked[0] || null, sim2 = base.slice(); let extra = 0, target = 0;
  if (worst) {
    target = worst.cr + worst.gap * (SIM.close / 100);
    for (let j = worst.i; j <= last; j++) {
      if (j === worst.i) sim2[j] = sim2[j - 1] * target;
      else { const c1 = base[j - 1] > 0 ? base[j] / base[j - 1] : 0; sim2[j] = sim2[j - 1] * c1; }
    }
    extra = sim2[last] - base[last];
  }
  return { steps, broken, worst, ranked, base, sim: sim2, extra, target, last };
}
const simRows = () => SIM.stages.map((s, i) =>
  '<div class="srow" data-srow="' + i + '"><label for="sf-' + s.k + '">' + esc(s.n) + '<i>' + esc(s.b ? s.i + ' · ref ' + Math.round(s.b * 100) + '%' : s.i) + '</i></label>' +
  '<input id="sf-' + s.k + '" type="text" inputmode="numeric" data-sv="' + i + '" value="' + fmt(s.v) + '"></div>').join('') +
  '<p class="sim-note">Recoverable volume carries the fix through every step below it.</p>';
const simSteps = (r) => r.steps.map((s) => {
  const w = Math.max(2, Math.min(s.cr * 100, 100)), weak = r.worst && r.worst.i === s.i;
  const gw = weak && r.target ? Math.max(2, Math.min(r.target * 100, 100)) : 0;
  return '<div class="sstep' + (weak ? ' weak' : '') + '"><div class="sstep-t"><span>' + esc(s.n) + '</span><span class="v">' + (s.cr * 100).toFixed(1) + '%</span></div>' +
    '<div class="strack">' + (weak ? '<span class="sghost" data-ghost style="width:' + gw + '%"></span>' : '') + '<div class="sfill" style="width:' + w + '%"></div>' +
    (s.b ? '<span class="sbench" style="left:' + Math.min(s.b * 100, 99) + '%" title="Reference ' + Math.round(s.b * 100) + '%"></span>' : '') + '</div></div>';
}).join('');
function simResult(r) {
  const unit = C.funnel.presets[SIM.preset].unit;
  if (r.broken) return '<div class="sverdict"><span class="label">Check the numbers</span><h4>Make each stage smaller than the one above it</h4><p>Fix the highlighted rows and the diagnosis re-runs.</p></div>';
  if (!r.worst) return '<div class="sverdict"><span class="label">Diagnosis</span><h4>None of these steps is a structural leak</h4><p>Every step sits at or above its reference. The gains here are in segmentation and retention rather than funnel repair, which is a different and usually more valuable conversation.</p><div class="btn-row"><a class="btn btn--primary btn--sm" href="#contact">Have that conversation ' + ARROW + '</a></div></div>';
  const w = r.worst; let play = null;
  C.funnel.play.forEach((p) => { if (!play && p.m.test(w.n)) play = p; });
  if (!play) play = C.funnel.play[0];
  return '<div class="sverdict"><span class="label">Diagnosis</span><h4>Fix “' + esc(w.n.toLowerCase()) + '” first. It is your biggest recoverable leak.</h4>' +
    '<p>It converts at ' + (w.cr * 100).toFixed(1) + '% against a reference of ' + Math.round(w.b * 100) + '%, a shortfall of ' + (w.gap * 100).toFixed(1) + ' points. Every step below it inherits the loss, which is why it outranks steeper drops higher up.</p>' +
    '<div class="sslider"><div class="sk"><label for="sslide">Close the gap by</label><b data-spct>' + SIM.close + '%</b></div><input id="sslide" type="range" min="0" max="100" step="5" value="' + SIM.close + '" data-sslider></div>' +
    '<div class="sproj"><div class="spc"><div class="k2">Today</div><div class="v2">' + fmt(r.base[r.last]) + '</div><div class="s2">' + esc(unit) + ' / month</div></div>' +
    '<div class="spc hi"><div class="k2">If closed</div><div class="v2" data-sif>' + fmt(r.sim[r.last]) + '</div><div class="s2" data-sextra>+' + fmt(r.extra) + ' recovered</div></div></div>' +
    '<div class="swarn" data-sthin' + (r.extra > 0 && r.extra < 12 ? '' : ' hidden') + '><b>Thin upside.</b> At this volume the fix may cost more than it returns. The step above it is probably the better target.</div></div>' +
    '<div class="snext"><span class="label">What I’d check first</span>' + play.inv.map((x, k) => '<div class="sinv"><b>0' + (k + 1) + '</b><span>' + esc(x) + '</span></div>').join('') +
    '<div class="btn-row"><a class="btn btn--primary btn--sm" href="#contact">Walk through this with me ' + ARROW + '</a></div></div>';
}
function simShell() {
  const P = C.funnel.presets, r = simCalc();
  return '<div class="frame__bar"><span class="win__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="label">funnel-diagnostic.sim</span></div>' +
    '<div class="sim-head"><span class="label">Start from</span>' + Object.keys(P).map((k) => '<button type="button" class="seg' + (k === SIM.preset ? ' on' : '') + '" aria-pressed="' + (k === SIM.preset) + '" data-spre="' + k + '">' + esc(P[k].n) + '</button>').join('') + '<button type="button" class="seg reset" data-sreset>Reset</button></div>' +
    '<div class="sim-body"><div class="sim-in" data-sin>' + simRows() + '</div><div class="sim-out" aria-live="polite"><div data-ssteps>' + simSteps(r) + '</div><div data-sres>' + simResult(r) + '</div></div></div>' +
    '<div class="tool-foot label">Runs in your browser. Nothing you type is sent anywhere.</div>';
}
function initFunnel() {
  const el = $('#funnel'); simLoad('ecom'); el.innerHTML = simShell();
  const refresh = () => {
    const r = simCalc();
    $$('[data-srow]', el).forEach((row, i) => { if (i > 0) row.classList.toggle('bad', !r.steps[i - 1].ok); });
    $('[data-ssteps]', el).innerHTML = simSteps(r); $('[data-sres]', el).innerHTML = simResult(r);
  };
  const projection = () => {
    const r = simCalc(); if (!r.worst) return;
    $('[data-spct]', el).textContent = SIM.close + '%'; $('[data-sif]', el).textContent = fmt(r.sim[r.last]); $('[data-sextra]', el).textContent = '+' + fmt(r.extra) + ' recovered';
    const g = $('[data-ghost]', el); if (g) g.style.width = Math.max(2, Math.min(r.target * 100, 100)) + '%';
    const t = $('[data-sthin]', el); if (t) t.hidden = !(r.extra > 0 && r.extra < 12);
  };
  el.addEventListener('input', (e) => {
    const t = e.target;
    if (t.hasAttribute('data-sv')) { SIM.stages[+t.dataset.sv].v = parseInt(String(t.value).replace(/[^0-9]/g, ''), 10) || 0; refresh(); }
    else if (t.hasAttribute('data-sslider')) { SIM.close = +t.value; projection(); }
  });
  el.addEventListener('change', (e) => { const t = e.target; if (t.hasAttribute('data-sv')) t.value = fmt(SIM.stages[+t.dataset.sv].v); });
  el.addEventListener('click', (e) => {
    const p = e.target.closest('[data-spre]'), r = e.target.closest('[data-sreset]');
    if (p) { simLoad(p.dataset.spre); SIM.close = 50; el.innerHTML = simShell(); }
    else if (r) { simLoad(SIM.preset); SIM.close = 50; el.innerHTML = simShell(); }
  });
}

/* ======================================================================
   SHEET 07 · contact form (Web3Forms, with an email fallback)
   ====================================================================== */
function initForm() {
  const f = $('#form'), done = $('#form-done'), errBox = $('[data-form-err]', f); let sending = false;
  const setSending = (on) => { const b = $('button[type=submit]', f); sending = on; b.disabled = on; b.textContent = on ? 'Sending…' : 'Send'; b.setAttribute('aria-busy', on); };
  const success = (d) => { setSending(false); f.hidden = true; $('[data-done-mail]', done).textContent = d.email; done.hidden = false; $('#form-done-h').focus(); if (!RM) gsap.from(done.children, { y: 16, opacity: 0, stagger: 0.08 }); };
  const fail = (d) => {
    setSending(false);
    const body = 'Name: ' + d.name + '\nCompany: ' + (d.company || '—') + '\nEmail: ' + d.email + '\nBusiness model: ' + (d.model || '—') + '\nPrimary bottleneck: ' + d.bottleneck + '\nMonthly orders: ' + (d.volume || '—') + '\n\n' + d.message;
    $('[data-err-mail]', f).setAttribute('href', 'mailto:' + C.person.email + '?subject=' + encodeURIComponent('Bottleneck: ' + d.bottleneck + (d.company ? ' — ' + d.company : '')) + '&body=' + encodeURIComponent(body));
    errBox.hidden = false; errBox.focus();
  };
  f.addEventListener('submit', (ev) => {
    ev.preventDefault(); if (sending) return;
    const d = {}; ['name', 'company', 'email', 'model', 'bottleneck', 'volume', 'message'].forEach((k) => { d[k] = (f.elements[k].value || '').trim(); });
    const errs = {
      name: d.name ? '' : 'Add your name.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ? '' : 'Add a valid email address.',
      bottleneck: d.bottleneck ? '' : 'Pick the closest bottleneck.',
      message: d.message ? '' : 'Describe the number, even roughly.',
    }; let first = null;
    Object.keys(errs).forEach((k) => { $('[data-err="' + k + '"]', f).textContent = errs[k]; f.elements[k].setAttribute('aria-invalid', !!errs[k]); if (errs[k] && !first) first = f.elements[k]; });
    if (first) { first.focus(); return; }
    errBox.hidden = true;
    if (f.elements.botcheck && f.elements.botcheck.checked) { success(d); return; }      // honeypot
    const payload = { access_key: C.form.key, subject: 'Bottleneck: ' + d.bottleneck + (d.company ? ' — ' + d.company : ''), from_name: 'Anjor Tank site', name: d.name, email: d.email, company: d.company || '—', business_model: d.model || '—', primary_bottleneck: d.bottleneck, monthly_orders: d.volume || '—', message: d.message, botcheck: '' };
    setSending(true);
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
    fetch(C.form.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal })
      .then((r) => r.json().catch(() => ({})).then((j) => ({ ok: r.ok, j })))
      .then((x) => { clearTimeout(timer); if (x.ok && x.j && x.j.success) success(d); else fail(d); })
      .catch(() => { clearTimeout(timer); fail(d); });
  });
}

/* ======================================================================
   BOOT SEQUENCE  (first visit of a session: the sheet is drawn, then lifts away)
   ====================================================================== */
function boot(done) {
  if (!root.classList.contains('boot')) { done(); return; }
  const op = $('#opener'), n = $('#opener-n'), lbl = $('#opener-lbl'), o = { v: 0 };
  gsap.set('.o-dr', { drawSVG: '0%' });
  const tl = gsap.timeline({ onComplete() { root.classList.remove('boot'); try { sessionStorage.setItem('anjor-boot', '1'); } catch (e) { /* ignore */ } done(); } });
  tl.to('.o-dr', { drawSVG: '100%', duration: 1.1, stagger: 0.08, ease: 'power2.inOut' }, 0)
    .to(o, { v: 100, duration: 1.3, ease: 'power1.inOut', onUpdate() { n.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
    .to('.opener__svg', { rotation: 90, transformOrigin: '50% 50%', duration: 1.7, ease: 'power2.inOut' }, 0)
    .to(lbl, { duration: 0.6, scrambleText: { text: 'Sheet 01 / 07 · ready', chars: '01·/', speed: 0.8 } }, 1.0)
    .to(op, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.15');
  const skip = () => tl.timeScale(5);
  op.addEventListener('click', skip); addEventListener('keydown', skip, { once: true });
}

/* ======================================================================
   SHEET 05 · gallery: pinned horizontal scrub on desktop, native swipe elsewhere
   ====================================================================== */
function initGallery() {
  const gal = $('#outside'), vp = $('#gal-viewport'), track = $('#gal-track'), bar = $('#gal-bar'), hint = $('#gal-hint');
  const setBar = (p) => { bar.style.transform = 'scaleX(' + (0.06 + 0.94 * clamp(p, 0, 1)) + ')'; };
  vp.addEventListener('scroll', () => { const m = vp.scrollWidth - vp.clientWidth; setBar(m > 0 ? vp.scrollLeft / m : 0); }, { passive: true });
  setBar(0); hint.textContent = 'Swipe to move through';
  const mmGal = gsap.matchMedia();
  mmGal.add('(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
    gal.classList.add('is-pin'); vp.classList.add('is-pinned'); vp.scrollLeft = 0; hint.textContent = 'Scroll to move through';
    const dist = () => Math.max(0, track.scrollWidth + parseFloat(getComputedStyle(vp).paddingLeft) - vp.clientWidth);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: gal, start: 'top top', end: () => '+=' + Math.round(dist() * 0.85), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (s) => setBar(s.progress) },
    });
    gsap.from('.gal__item', { y: 40, opacity: 0, duration: 0.9, stagger: 0.06, scrollTrigger: { trigger: gal, start: 'top 60%', once: true } });
    return () => { gal.classList.remove('is-pin'); vp.classList.remove('is-pinned'); hint.textContent = 'Swipe to move through'; setBar(0); ScrollTrigger.sort(); };
  });
}

/* ======================================================================
   MOTION  (created in page order so pinned sections measure correctly)
   ====================================================================== */
function motion(ctx) {
  const wmNav = ctx.wmNav, wmHero = ctx.wmHero, wmFoot = ctx.wmFoot;
  let introPlayed = false, heroLineTw = null;

  /* ---- hidden start states: set in JS only, so no-JS and reduced-motion users see everything ---- */
  const dr = $$('#bpx .dr'), fd = $$('#bpx .fd').map((el) => ({ el, o: parseFloat(getComputedStyle(el).opacity) || 1 }));
  gsap.set('[data-in]', { autoAlpha: 0, y: 18 });
  gsap.set('#bpx', { autoAlpha: 1 });
  gsap.set(dr, { drawSVG: '0%' });
  gsap.set(fd.map((x) => x.el), { autoAlpha: 0 });
  gsap.set('#bpx .node', { autoAlpha: 0, scale: 0, transformOrigin: '0px 0px' });
  gsap.set('#bpx .core, #bpx .pin', { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(wmHero.slots.map((s) => s.ch), { yPercent: 70, opacity: 0 });

  /* ---- hero headline: lines slide up out of a mask; the highlight underline sweeps in after ---- */
  SplitText.create('#hero-line', {
    type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
    onSplit(self) {
      gsap.set('#hero-line', { autoAlpha: 1 });
      const hl = $$('.hl', self.elements[0]);
      const tw = gsap.timeline({ paused: !introPlayed })
        .from(self.lines, { yPercent: 115, duration: 1.1, stagger: 0.12, ease: 'eOut' }, 0)
        .fromTo(hl, { '--u': '0%' }, { '--u': '100%', duration: 0.9, ease: 'power2.inOut' }, 0.9);
      if (introPlayed) tw.progress(1);
      heroLineTw = tw; return tw;
    },
  });

  /* ---- the orbital blueprint: strokes draw in, then three nodes start to orbit and link to the core ---- */
  const orbit = [
    { el: '#nSig', path: '#oSig', dur: 34, start: 0.08, link: '#lSig' },
    { el: '#nRule', path: '#oRule', dur: 24, start: 0.55, link: '#lRule' },
    { el: '#nAct', path: '#oAct', dur: 16, start: 0.3, link: '#lAct' },
  ];
  orbit.forEach((n) => {
    const link = $(n.link);
    gsap.to(n.el, {
      motionPath: { path: n.path, align: n.path, alignOrigin: [0.5, 0.5], start: n.start, end: n.start + 1 },
      duration: n.dur, ease: 'none', repeat: -1,
      onUpdate() { link.setAttribute('x1', gsap.getProperty(n.el, 'x')); link.setAttribute('y1', gsap.getProperty(n.el, 'y')); },
    });
  });
  gsap.to('#bpx .core-ping', { scale: 2.6, opacity: 0, svgOrigin: '320 320', duration: 2.4, repeat: -1, ease: 'power2.out' });
  gsap.fromTo('#bpx .pin-ping', { scale: 1, opacity: 0.9, svgOrigin: '352 292' }, { scale: 4.2, opacity: 0, svgOrigin: '352 292', duration: 2.2, repeat: -1, ease: 'power2.out' });
  gsap.to('#bpx .bpx__globe ellipse:nth-of-type(2)', { attr: { rx: 12 }, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true });   // the meridian turns

  /* ---- live readout ---- */
  const alt = $('[data-tick="alt"]'), vel = $('[data-tick="vel"]'); let acc = 0;
  gsap.ticker.add((time, dt) => {
    acc += dt; if (acc < 700) return; acc = 0;
    alt.textContent = (408 + Math.sin(time * 0.8) * 3.2).toFixed(0); vel.textContent = (7.66 + Math.sin(time * 1.3) * 0.02).toFixed(2);
  });

  /* ---- pointer parallax on the blueprint (quickTo: one reused tween) ---- */
  if (FINE) {
    const fig = $('#hero-fig'), qx = gsap.quickTo('#bpx', 'x', { duration: 0.8, ease: 'power3' }), qy = gsap.quickTo('#bpx', 'y', { duration: 0.8, ease: 'power3' });
    const gx = gsap.quickTo('#bp-grid', 'x', { duration: 1.2, ease: 'power3' });
    addEventListener('pointermove', (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; qx(nx * -22); qy(ny * -16); gx(nx * -26); }, { passive: true });
    fig.addEventListener('pointerleave', () => { qx(0); qy(0); });
  }

  /* ---- intro timeline: runs once the boot sequence has lifted ---- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'eOut' }, onStart() { introPlayed = true; } });
  intro
    .to('[data-in]', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, clearProps: 'transform' }, 0)
    .to(wmHero.slots.map((s) => s.ch), { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05 }, 0.1)
    .add(() => heroLineTw && heroLineTw.play(), 0.25)
    .to(dr, { drawSVG: '100%', duration: 1.8, stagger: { each: 0.05 }, ease: 'power2.inOut' }, 0.1)
    .to(fd.map((x) => x.el), { autoAlpha: (i) => fd[i].o, duration: 0.9, stagger: 0.04 }, 0.9)
    .to('#bpx .core, #bpx .pin', { scale: 1, duration: 0.8, ease: 'eSpring' }, 1.1)
    .to('#bpx .node', { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.18, ease: 'eSpring' }, 1.3)
    .add(() => { wmHero.tl && wmHero.tl.play(); }, 3.4)
    .to('#top [data-scramble]', { duration: 1.2, scrambleText: { text: 'GTM engineering for commerce', chars: '01·/+', speed: 0.7 } }, 0.15);
  ctx.playIntro = () => intro.play();

  /* ---- generic section choreography (header split, scramble, dimension line, reveals), page order ---- */
  function initSection(sec) {
    const head = $('.sh, .contact__copy', sec);
    if (head) {
      const dim = $('.dim', head), lab = $('[data-scramble]', head), h2 = $('[data-split]', head);
      const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', once: true } });
      gsap.set(dim, { scaleX: 0 });
      tl.to(dim, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, 0);
      if (lab) tl.to(lab, { duration: 0.9, scrambleText: { text: lab.textContent, chars: '01·/+', speed: 0.7 } }, 0.05);
      if (h2) {
        let entered = false;
        ScrollTrigger.create({ trigger: head, start: 'top 85%', once: true, onEnter: () => { entered = true; h2._tw && h2._tw.play(); } });
        SplitText.create(h2, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit(self) {
            const hl = $$('.hl', h2);
            const tw = gsap.timeline({ paused: !entered })
              .from(self.lines, { yPercent: 110, duration: 0.95, stagger: 0.1 }, 0)
              .fromTo(hl, { '--u': '0%' }, { '--u': '100%', duration: 0.8, ease: 'power2.inOut' }, 0.7);
            if (entered) tw.progress(1);
            h2._tw = tw; return tw;
          },
        });
      }
    }
    const items = $$('[data-rv]', sec).filter((el) => !head || !head.contains(el) || el === head);
    gsap.set(items, { y: 26, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: 'top 90%', once: true, interval: 0.1, batchMax: 4,
      onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, overwrite: true, clearProps: 'transform,opacity' }),
    });
  }
  const sec = (id) => $('#' + id);

  /* SHEET 01 · hero: proof count-ups, schematic drifts away as you leave */
  gsap.set($$('.reticle'), { y: 26, opacity: 0 });
  ScrollTrigger.batch($$('.reticle'), {
    start: 'top 92%', once: true, interval: 0.1, batchMax: 4,
    onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, overwrite: true, clearProps: 'transform,opacity' }),
  });
  $$('[data-count]').forEach((el) => {
    const to = +el.dataset.count, from = +el.dataset.from, dp = +el.dataset.dp, o = { v: from };
    el.textContent = fmtDp(from, dp);
    ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = fmtDp(o.v, dp); }, onComplete: () => { el.textContent = fmtDp(to, dp); } }) });
  });
  gsap.to('#hero-fig', { yPercent: -7, scale: 0.94, autoAlpha: 0.35, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.to('#bp-grid', { y: -220, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.8 } });
  loopWordmark(wmHero, { step: 0.07, hold: 1.7, gap: 3.4, delay: 0.2, gate: () => introPlayed });

  /* SHEET 02 */
  initSection(sec('think'));
  /* SHEET 03 */
  initSection(sec('work'));
  /* SHEET 04 · the path: a probe travels down the trajectory, waypoints light as it passes */
  initSection(sec('path'));
  const tlEl = $('#tl'), fill = $('.tl__fill', tlEl), probe = $('.tl__probe', tlEl), rail = $('.tl__rail', tlEl), nodes = $$('.tl__item', tlEl);
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: tlEl, start: 'top 62%', end: 'bottom 62%', scrub: 0.5 } })
    .to(fill, { scaleY: 1 }, 0)
    .fromTo(probe, { y: 0 }, { y: () => rail.offsetHeight, immediateRender: false }, 0);
  nodes.forEach((n) => ScrollTrigger.create({ trigger: n, start: 'top 64%', onEnter: () => n.classList.add('is-on'), onLeaveBack: () => n.classList.remove('is-on') }));
  gsap.from('.tl__card', { x: 28, opacity: 0, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: tlEl, start: 'top 75%', once: true } });

  /* SHEET 05 · header (the gallery itself is set up in initGallery) */
  initSection(sec('outside'));

  /* SHEET 06 / 07 */
  initSection(sec('try'));
  initSection(sec('contact'));

  /* footer: title block draws, wordmark loops */
  gsap.from('.tblock > div', { opacity: 0, y: 14, stagger: 0.06, duration: 0.7, scrollTrigger: { trigger: '.tblock', start: 'top 94%', once: true } });
  loopWordmark(wmFoot, { step: 0.07, hold: 1.7, gap: 3.4, delay: 0.4 });

  /* section dividers draw in as well: each sheet gets its registration marks */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

}

/* ======================================================================
   BOOT THE PAGE
   ====================================================================== */
const wmEls = $$('[data-wm]');
const ctx = { wmNav: Wordmark(wmEls[0]), wmHero: Wordmark(wmEls[1]), wmFoot: Wordmark(wmEls[2]) };
onTheme(() => WMS.forEach((w) => w.draw()));

initTheme();
initStars();
initDecisions();
initWork();
initFunnel();
initForm();
initGallery();

// Anything that touches layout or scroll is created once, in page order, inside matchMedia.
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHud(); initNav(); hoverWordmark(ctx.wmNav, $('.nav__brand'));
  const cleanup = motion(ctx);
  boot(() => ctx.playIntro());
  return cleanup;
});
mm.add('(prefers-reduced-motion: reduce)', () => {
  // The finished page: nothing hidden, nothing moving. The path line is simply full.
  initHud(); initNav();
  const fill = $('.tl__fill'); if (fill) fill.style.transform = 'scaleY(1)';
  const probe = $('.tl__probe'); if (probe) probe.style.display = 'none';
  $$('.tl__item').forEach((n) => n.classList.add('is-on'));
  $$('#bpx .node').forEach((n, i) => { n.setAttribute('transform', ['translate(480 232)', 'translate(190 330)', 'translate(380 190)'][i]); });
});
