/* ==========================================================================
   ARTCV — the MESHHETU art engine's canvas runners and the name reel, in plain JS.
   Ported from orchestration-intelligence (ArtCanvas.jsx, Reel.jsx, layout.jsx).
   Every canvas is decorative (aria-hidden), runs only while on screen and while the tab is visible,
   caps its frame rate, and draws a single still frame under reduced motion.
   ========================================================================== */
import gsap from 'gsap';
import { blit, makeAscii, makeDots, RAMP, SCENES, STILL, asciiLaunch, warp, COL, dot } from './dots.js';
import { TILES } from './wm.js';

const root = document.documentElement;
const reduced = () => root.classList.contains('rm');

function runner(cv, o) {
  const ctx = cv.getContext('2d');
  let raf = 0, vis = false, last = 0, ready = false, seen = false, t0 = performance.now();
  const now = () => (performance.now() - t0) / 1000;
  const draw = () => { if (ready) o.render(ctx, reduced() ? o.still : now()); };
  const size = () => {
    const b = cv.getBoundingClientRect();
    const w = Math.max(b.width, cv.offsetWidth), h = Math.max(b.height, cv.offsetHeight);
    if (w < 2 || h < 2) return;
    ready = o.setup(cv, ctx, { width: w, height: h }) !== false;
    draw();
  };
  const loop = (ts) => { raf = requestAnimationFrame(loop); if (ts - last < 1000 / o.fps) return; last = ts; draw(); };
  const start = () => { if (!raf && !reduced()) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const ro = new ResizeObserver(size); ro.observe(cv);
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis && o.fromView && !seen) { seen = true; t0 = performance.now(); }
    if (vis && !document.hidden) start(); else stop();
  }, { rootMargin: o.fromView ? '0px' : '120px' });
  io.observe(cv);
  document.addEventListener('visibilitychange', () => { if (document.hidden || !vis) stop(); else start(); });
  size();
  return { redraw: size, stop, start };
}

/** Dot-matrix canvas: draw(D, t) fills the cell grid. */
export function dotCanvas(cv, o) {
  const cell = o.cell ?? 5, k = o.k ?? 3, gap = o.gap ?? 1, st = {};
  return runner(cv, {
    fps: o.fps ?? 24, still: o.still ?? 3, fromView: o.fromView,
    setup: (c, ctx, r) => {
      const cols = Math.max(8, Math.round(r.width / cell)), rows = Math.max(8, Math.round(r.height / cell));
      if (st.D && st.D.cols === cols && st.D.rows === rows) return true;
      st.D = makeDots(cols, rows); c.width = cols * k; c.height = rows * k; st.img = ctx.createImageData(c.width, c.height);
      return true;
    },
    render: (ctx, t) => { st.D.buf.fill(0); st.D.m = null; o.draw(st.D, t); blit(ctx, st.img, st.D, k, gap); },
  });
}

/** ASCII canvas: draw(A, t) fills brightness and kind per glyph; colors() returns the ink for each kind. */
export function asciiCanvas(cv, o) {
  const st = {}; const font = o.font ?? 12;
  const r = runner(cv, {
    fps: o.fps ?? 24, still: o.still ?? 3.2, fromView: o.fromView,
    setup: (c, ctx, box) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(font * 0.62 * dpr), ch = Math.round(font * 1.12 * dpr);
      const cols = Math.max(4, Math.floor((box.width * dpr) / cw)), rows = Math.max(4, Math.floor((box.height * dpr) / ch));
      c.width = cols * cw; c.height = rows * ch;
      st.A = makeAscii(cols, rows); st.cw = cw; st.ch = ch;
      st.atlas = o.colors().map((ink) => {
        if (!ink) return null;
        const a = document.createElement('canvas'); a.width = cw * RAMP.length; a.height = ch;
        const x = a.getContext('2d'); x.fillStyle = ink; x.textBaseline = 'middle'; x.textAlign = 'center';
        x.font = `500 ${Math.round(font * dpr)}px "IBM Plex Mono", ui-monospace, monospace`;
        for (let g = 1; g < RAMP.length; g++) x.fillText(RAMP[g], g * cw + cw / 2, ch / 2 + dpr * 0.5);
        return a;
      });
      return true;
    },
    render: (ctx, t) => {
      const { A, cw, ch, atlas } = st;
      o.draw(A, t);
      ctx.clearRect(0, 0, A.cols * cw, A.rows * ch);
      const n = RAMP.length - 1;
      for (let j = 0; j < A.rows; j++) for (let i = 0; i < A.cols; i++) {
        const p = j * A.cols + i, v = A.v[p];
        if (v <= 0) continue;
        const g = Math.max(1, Math.min(n, Math.round(v * n))), a = atlas[A.k[p]];
        if (a) ctx.drawImage(a, g * cw, 0, cw, ch, i * cw, j * ch, cw, ch);
      }
    },
  });
  new MutationObserver(() => r.redraw()).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  return r;
}

const INK = { light: [null, '#1b1a18', '#d9541f', '#8a847a', '#55534e'], dark: [null, '#faf9f5', '#ffb07a', '#b0aea5', '#6f6a62'] };
const inkNow = () => INK[root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'];

/** The footer launch, in ASCII, on the hills. */
export function footLaunch(cv) {
  return asciiCanvas(cv, { draw: (A, t) => asciiLaunch(A, t % 15, { x: 0.5, scale: 0.62, ground: 0.985 }), colors: inkNow, font: 8, fps: 24, still: 3.4, fromView: true });
}

/** A small named scene on a canvas (the MESHHETU card and the hero chips use these). */
export function sceneCanvas(cv, name, o = {}) {
  return dotCanvas(cv, { draw: (D, t) => SCENES[name](D, t), still: STILL[name] ?? 3, ...o });
}

/* The word reel: the name sits on its own; one letter at a time turns into a small screen with a scene in it, until the whole
   name is screens; then, one at a time, the screens turn back into letters. It loops while on screen. */
const SIZE = {
  nav: { hold: 3.2, step: 0.16, full: 1.4, dot: { cell: 1, k: 2, gap: 0, fps: 12 } },
  foot: { hold: 1.4, step: 0.3, full: 1.6, dot: { cell: 4, k: 3, gap: 1, fps: 14 } },
};
const ORDER = [5, 2, 7, 0, 3, 6, 1, 4, 8];
export function wordReel(el) {
  const size = el.dataset.rl, S = SIZE[size]; if (!S || reduced()) return;
  const slots = [...el.querySelectorAll('.rl__slot')];
  const tiles = slots.map((s) => s.querySelector('.rl__tile')), letters = slots.map((s) => s.querySelector('.rl__ch'));
  slots.forEach((s, k) => {
    const cv = tiles[k].querySelector('canvas'), name = TILES[k], fn = SCENES[name];
    dotCanvas(cv, { ...S.dot, still: STILL[name] ?? 3, draw: (D, t) => { if (tiles[k].classList.contains('is-on')) fn(D, t); } });
  });
  const tl = gsap.timeline({ repeat: -1, paused: true });
  ORDER.forEach((k, n) => {
    const at = S.hold + n * S.step;
    tl.to(letters[k], { autoAlpha: 0, scale: 0.4, duration: 0.22, ease: 'power2.in' }, at)
      .call(() => tiles[k].classList.add('is-on'), null, at + 0.08)
      .fromTo(tiles[k], { opacity: 0, scale: 0.2, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(2.4)' }, at + 0.08);
  });
  const back = S.hold + ORDER.length * S.step + 0.3 + S.full;
  slots.forEach((_, k) => {
    const at = back + k * S.step;
    tl.to(tiles[k], { opacity: 0, scale: 0.2, rotate: 8, duration: 0.24, ease: 'power2.in' }, at)
      .call(() => tiles[k].classList.remove('is-on'), null, at + 0.26)
      .to(letters[k], { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, at + 0.1);
  });
  tl.to({}, { duration: 0.2 });
  new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause())).observe(el);
}

export { warp, COL, dot, makeDots, blit };
