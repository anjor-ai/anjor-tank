/* Dot-matrix scenes for small screens: the ROQIVA cards, the founder cards, and the tiles of the word reels (the name in the
   footer, ROQIVA in its intro). Thin dotted outlines that draw themselves, one accent, on a dark screen. No text.
   Every scene loops; at t = its STILL value it shows the finished picture (used under reduced motion).
   The reel tiles are drawn bold (v = 1, few large shapes) so they still read at 20 × 20 cells in the logo. */
import { astronaut, clamp, COL, dot, each, line, rectF, rectO, rocket, signals, stars } from './space'

const P = (T, a, b) => clamp((T - a) / (b - a))
const E = (x) => 1 - (1 - x) ** 3 // ease out
const box = (D) => ({ X: (f) => f * D.cols, Y: (f) => f * D.rows, M: Math.min(D.cols, D.rows), R: { x0: 0, y0: 0, w: D.cols, h: D.rows } })
const circle = (D, cx, cy, r, v, c, p = 1) => { const n = Math.max(12, Math.round(r * 7)); for (let k = 0; k <= n * p; k++) { const a = (k / n) * Math.PI * 2 - Math.PI / 2; dot(D, Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), v, c) } }
const disc = (D, cx, cy, r, v, c) => each(D, { x0: cx - r - 1, y0: cy - r - 1, w: r * 2 + 3, h: r * 2 + 3 }, (i, j) => { if (Math.hypot(i + 0.5 - cx, j + 0.5 - cy) <= r) dot(D, i, j, v, c) })
const grid = (D, g = 6) => each(D, { x0: 0, y0: 0, w: D.cols, h: D.rows }, (i, j) => { if (i % g === 0 && j % g === 0) dot(D, i, j, 0.45, COL.dim) })
const tick = (D, x, y, s, v, c, p = 1) => { line(D, x, y, x + s * 0.4, y + s * 0.4, v, c, Math.min(1, p * 2)); if (p > 0.5) line(D, x + s * 0.4, y + s * 0.4, x + s, y - s * 0.5, v, c, (p - 0.5) * 2) }
const diamond = (D, cx, cy, r, v, c) => { for (let d = -r; d <= r; d++) { const w = r - Math.abs(d); dot(D, Math.round(cx - w), Math.round(cy + d), v, c); dot(D, Math.round(cx + w), Math.round(cy + d), v, c) } }

export const SCENES = {
  // ── ROQIVA: the work item's steps ──
  /** Find: a scan passes over rows of signals; one row has no reader and lights up. */
  find(D, t) {
    const T = t % 6, { X, Y } = box(D); grid(D)
    for (let r = 0; r < 5; r++) {
      const y = Y(0.18 + r * 0.15), gap = r === 2
      line(D, X(0.1), y, X(0.45), y, 0.85, COL.lilac, P(T, r * 0.15, 0.6 + r * 0.15))
      line(D, X(0.55), y, X(0.9), y, gap ? 0 : 0.6, COL.violet, P(T, 0.8 + r * 0.15, 1.3 + r * 0.15))
      if (gap && T > 2.6) { const b = 0.6 + 0.4 * Math.sin(T * 6); rectO(D, X(0.07), y - 3, X(0.86), 6, b, COL.ember) }
    }
    const sx = X(0.08 + 0.84 * P(T, 1.4, 2.6)); if (T > 1.4 && T < 2.6) line(D, sx, Y(0.1), sx, Y(0.84), 0.9, COL.white)
  },
  /** Decide: one question branches into three options; one is taken. */
  decide(D, t) {
    const T = t % 6, { X, Y } = box(D); grid(D)
    const ox = X(0.14), oy = Y(0.5); circle(D, ox, oy, 4, 0.95, COL.white, P(T, 0, 0.5))
    ;[0.2, 0.5, 0.8].forEach((fy, k) => {
      const pick = k === 1, ex = X(0.8), ey = Y(fy)
      line(D, ox + 5, oy, ex - 6, ey, pick && T > 3 ? 1 : 0.55, pick && T > 3 ? COL.ember : COL.violet, P(T, 0.5 + k * 0.3, 1.4 + k * 0.3))
      rectO(D, ex - 5, ey - 4, 12, 8, 0.85, pick && T > 3 ? COL.ember : COL.lilac, P(T, 1.3 + k * 0.3, 1.9 + k * 0.3))
    })
    if (T > 3.2) tick(D, X(0.8) - 2, Y(0.5) + 1, 6, 1, COL.mint, P(T, 3.2, 3.8))
  },
  /** Prove: a frozen baseline, a release marker, and a line that moves up after it. */
  prove(D, t) {
    const T = t % 7, { X, Y } = box(D); grid(D)
    line(D, X(0.08), Y(0.82), X(0.92), Y(0.82), 0.5, COL.dim)
    for (let x = X(0.08); x < X(0.92); x += 3) dot(D, Math.round(x), Math.round(Y(0.6)), 0.6, COL.lilac)
    const pts = 40, before = P(T, 0.3, 2), after = P(T, 2.6, 4.6)
    for (let k = 0; k <= pts; k++) {
      const f = k / pts, x = X(0.08 + f * 0.84)
      const y = f < 0.5 ? Y(0.6 + Math.sin(f * 25) * 0.025) : Y(0.6 - (f - 0.5) * 0.85 + Math.sin(f * 20) * 0.02)
      if ((f < 0.5 && f / 0.5 <= before) || (f >= 0.5 && (f - 0.5) / 0.5 <= after)) dot(D, Math.round(x), Math.round(y), 1, f < 0.5 ? COL.violet : COL.mint)
    }
    if (T > 2.2) for (let y = Y(0.14); y < Y(0.86); y += 2) dot(D, Math.round(X(0.5)), Math.round(y), 0.8, COL.ember)
  },
  /** Ship: a small launch, for a fix that goes out. */
  ship(D, t) { const { R } = box(D); stars(D, t, R, { density: 0.02 }); rocket(D, t, R, { period: 7 }) },
  /** Brain: a constellation of decisions, joined one by one; each new one links to what came before. */
  brain(D, t) {
    const T = t % 8, { X, Y } = box(D)
    const N = [[0.2, 0.3], [0.42, 0.18], [0.66, 0.3], [0.8, 0.58], [0.56, 0.62], [0.32, 0.7], [0.5, 0.42]]
    const L = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 0], [6, 2], [6, 4]]
    L.forEach(([a, b], k) => line(D, X(N[a][0]), Y(N[a][1]), X(N[b][0]), Y(N[b][1]), 0.55, COL.violet, P(T, 0.4 + k * 0.4, 0.9 + k * 0.4)))
    N.forEach(([x, y], k) => { if (T > k * 0.45) circle(D, X(x), Y(y), k === 6 ? 4 : 2.5, 1, k === 6 ? COL.ember : COL.white) })
  },
  /** Agent: a draft writes itself on a page, then waits at a gate (the diamond) for a person. */
  agent(D, t) {
    const T = t % 7, { X, Y } = box(D); grid(D)
    rectO(D, X(0.12), Y(0.1), X(0.48), Y(0.8), 0.8, COL.lilac, P(T, 0, 0.8))
    for (let k = 0; k < 6; k++) line(D, X(0.18), Y(0.24 + k * 0.1), X(0.18 + (k % 2 ? 0.28 : 0.36)), Y(0.24 + k * 0.1), 0.8, k === 0 ? COL.white : COL.violet, P(T, 0.8 + k * 0.35, 1.1 + k * 0.35))
    const gx = X(0.78), gy = Y(0.5), r = Math.min(X(0.12), Y(0.2))
    diamond(D, gx, gy, r, 0.9, T > 4.4 ? COL.mint : COL.ember)
    line(D, X(0.6), gy, gx - r - 2, gy, 0.7, COL.violet, P(T, 3, 3.6))
  },
  /** Check: a list ticks through, one stays a question. */
  check(D, t) {
    const T = t % 6, { X, Y } = box(D); grid(D)
    for (let k = 0; k < 4; k++) {
      const y = Y(0.2 + k * 0.19)
      rectO(D, X(0.12), y - 3, 7, 7, 0.8, COL.lilac)
      line(D, X(0.26), y, X(0.26 + (k % 2 ? 0.42 : 0.56)), y, 0.7, COL.violet)
      if (k < 3) tick(D, X(0.12) + 1, y, 5, 1, COL.mint, P(T, 0.6 + k * 0.6, 1.1 + k * 0.6))
      else if (T > 2.6) dot(D, Math.round(X(0.12) + 3), Math.round(y), 1, COL.ember)
    }
  },
  /** Shield: no production writes; arrows bounce off a boundary. */
  shield(D, t) {
    const T = t % 4, { X, Y } = box(D); grid(D)
    for (let y = Y(0.12); y < Y(0.88); y += 2) dot(D, Math.round(X(0.62)), Math.round(y), 0.9, COL.ember)
    for (let k = 0; k < 3; k++) {
      const f = ((T / 2 + k / 3) % 1), y = Y(0.28 + k * 0.22)
      const x = f < 0.5 ? X(0.1 + f * 1.0) : X(0.6 - (f - 0.5) * 1.0)
      line(D, x - 6, y, x, y, 0.9, COL.lilac)
    }
    rectO(D, X(0.7), Y(0.3), X(0.2), Y(0.4), 0.7, COL.violet)
  },
  /** Signals: streams flowing into one node (Track B's hosted modules). */
  signals(D, t) { signals(D, t, box(D).R) },

  // ── Founders ──
  /** A desktop computer: the case draws itself, then code types on the screen and a chart builds beside it. */
  mac(D, t) {
    // drawn in a box about as wide as it is tall, centred, so the computer keeps its shape on a wide card; a desk line runs across.
    // X() places (box-relative), L() measures (a length in the box)
    const T = t % 8, { Y } = box(D), w = Math.min(D.cols, D.rows * 1.25), x0 = (D.cols - w) / 2
    const X = (f) => x0 + f * w, L = (f) => f * w
    grid(D, 8)
    line(D, 0, Y(0.97), D.cols, Y(0.97), 0.5, COL.dim, P(T, 0, 1))
    const bx = X(0.22), by = Y(0.06), bw = L(0.56), bh = Y(0.66)
    const sx0 = bx + L(0.05), sy0 = by + Y(0.06), sw = bw - L(0.1), shh = Y(0.4)
    rectO(D, bx, by, bw, bh, 1, COL.white, E(P(T, 0, 0.9)))
    rectO(D, sx0, sy0, sw, shh, 0.9, COL.lilac, P(T, 0.6, 1.2))
    line(D, bx + bw * 0.58, by + Y(0.55), bx + bw * 0.86, by + Y(0.55), 1, COL.lilac, P(T, 1, 1.3)) // drive slot
    line(D, X(0.42), Y(0.74), X(0.58), Y(0.74), 1, COL.white, P(T, 1, 1.4)) // foot
    rectO(D, X(0.16), Y(0.82), L(0.68), Y(0.1), 0.9, COL.white, P(T, 1.2, 1.8)) // keyboard
    for (let k = 0; k < 7; k++) dot(D, Math.round(X(0.22 + k * 0.093)), Math.round(Y(0.87)), T > 1.8 ? 1 : 0, COL.lilac)
    // code on the left half of the screen, a small chart on the right
    const cx = sx0 + 2, cy = sy0 + Y(0.07), cw = sw * 0.55
    const rows = [0.9, 0.6, 0.75, 0.45]
    rows.forEach((f, k) => line(D, cx + (k % 2) * 2, cy + k * Y(0.08), cx + (k % 2) * 2 + cw * f, cy + k * Y(0.08), 1, k === 0 ? COL.ember : COL.violet, P(T, 1.8 + k * 0.5, 2.2 + k * 0.5)))
    const cur = Math.min(3, Math.floor(P(T, 1.8, 3.8) * 4))
    if (T < 6.6 && Math.floor(T * 3) % 2 === 0) rectF(D, cx + (cur % 2) * 2 + cw * rows[cur] + 2, cy + cur * Y(0.08) - 1, 2, 3, 1, COL.white)
    const gx = sx0 + sw * 0.68, gw = sw * 0.08, base = sy0 + shh - 2
    for (let k = 0; k < 3; k++) { const h = (shh - 5) * (0.3 + k * 0.25) * E(P(T, 4 + k * 0.4, 4.6 + k * 0.4)); rectF(D, gx + k * gw * 1.5, base - h, Math.max(1, gw), h, 1, k === 2 ? COL.mint : COL.violet) }
  },
  /** Building blocks of a system: blocks drop into place, then the links between them light up and a pulse runs through. */
  blocks(D, t) {
    const T = t % 9, { X, Y } = box(D); grid(D, 8)
    const w = X(0.18), h = Y(0.16)
    const B = [[0.14, 0.72], [0.41, 0.72], [0.68, 0.72], [0.27, 0.5], [0.55, 0.5], [0.41, 0.28]]
    B.forEach(([fx, fy], k) => {
      const p = E(P(T, 0.3 + k * 0.45, 0.8 + k * 0.45)), y = Y(fy) - (1 - p) * Y(0.7)
      if (p <= 0) return
      const lit = T > 4 && Math.floor((T - 4) * 2.2) % 6 === k
      rectF(D, X(fx), y, w, h, lit ? 0.8 : 0.32, lit ? COL.ember : COL.violet)
      rectO(D, X(fx), y, w, h, 1, k === 5 ? COL.ember : COL.white)
    })
    const L = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]]
    L.forEach(([a, b], k) => line(D, X(B[a][0]) + w / 2, Y(B[a][1]), X(B[b][0]) + w / 2, Y(B[b][1]) + h, 1, COL.mint, P(T, 3.2 + k * 0.12, 3.6 + k * 0.12)))
  },

  // ── Reel tiles: what the work covers ──
  astro(D, t) { const { R } = box(D); stars(D, t, R, { density: 0.03 }); astronaut(D, t, R, { s: 0.2 }) },
  launch(D, t) { const { R } = box(D); stars(D, t, R, { density: 0.02 }); rocket(D, t, R, { period: 6 }) },
  /** GTM engineering: three sources feed one engine (a turning gear); actions leave it. Packets travel the lines. */
  gtm(D, t) {
    const { X, Y, M } = box(D), cx = X(0.5), cy = Y(0.5), r = M * 0.16
    ;[0.22, 0.5, 0.78].forEach((fy, k) => {
      rectF(D, X(0.06), Y(fy) - M * 0.05, M * 0.1, M * 0.1, 1, COL.lilac)
      line(D, X(0.06) + M * 0.1, Y(fy), cx - r, cy, 1, COL.dim)
      line(D, cx + r, cy, X(0.86), Y(fy), 1, COL.dim)
      const f = (t * 0.7 + k / 3) % 1
      dot(D, Math.round(X(0.06) + M * 0.1 + (cx - r - X(0.06) - M * 0.1) * f), Math.round(Y(fy) + (cy - Y(fy)) * f), 1, COL.white)
      const g = (t * 0.7 + k / 3 + 0.5) % 1
      dot(D, Math.round(cx + r + (X(0.86) - cx - r) * g), Math.round(cy + (Y(fy) - cy) * g), 1, COL.mint)
      line(D, X(0.86), Y(fy), X(0.94), Y(fy), 1, COL.mint); dot(D, Math.round(X(0.92)), Math.round(Y(fy) - 1), 1, COL.mint); dot(D, Math.round(X(0.92)), Math.round(Y(fy) + 1), 1, COL.mint)
    })
    disc(D, cx, cy, r * 0.75, 1, COL.ember)
    for (let k = 0; k < 8; k++) { const a = t * 1.2 + (k / 8) * Math.PI * 2; disc(D, cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.max(0.6, M * 0.035), 1, COL.ember) }
    disc(D, cx, cy, r * 0.3, 1, COL.dim)
  },
  /** RevOps: one loop through the revenue teams; a point keeps travelling it, each stage lights as it passes. */
  revops(D, t) {
    const { X, Y, M } = box(D), cx = X(0.5), cy = Y(0.5), r = M * 0.34
    circle(D, cx, cy, r, 0.55, COL.violet)
    const a = t * 1.3
    for (let k = 0; k < 4; k++) {
      const b = (k / 4) * Math.PI * 2 - Math.PI / 2
      const d = ((a - b) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
      disc(D, cx + Math.cos(b) * r, cy + Math.sin(b) * r, M * 0.07, 1, d < 1 ? COL.ember : COL.lilac)
    }
    for (let k = 0; k < 6; k++) { const b = a - Math.PI / 2 - k * 0.12; dot(D, Math.round(cx + Math.cos(b) * r), Math.round(cy + Math.sin(b) * r), 1 - k * 0.15, COL.white) }
    disc(D, cx, cy, M * 0.1 * (0.85 + 0.15 * Math.sin(t * 3)), 1, COL.mint)
  },
  /** Funnel: many points fall in at the top; fewer make it out of the spout, and those are lit. */
  funnel(D, t) {
    const { X, Y } = box(D)
    const top = Y(0.14), neck = Y(0.62), bot = Y(0.86)
    line(D, X(0.1), top, X(0.42), neck, 1, COL.white); line(D, X(0.9), top, X(0.58), neck, 1, COL.white)
    line(D, X(0.42), neck, X(0.42), bot, 1, COL.white); line(D, X(0.58), neck, X(0.58), bot, 1, COL.white)
    line(D, X(0.1), top, X(0.9), top, 0.5, COL.lilac)
    for (let k = 0; k < 14; k++) {
      const s = (k * 0.618) % 1, f = (t * 0.45 + s) % 1, out = k % 4 === 0
      const lim = out ? 1 : 0.72, fy = f / lim
      if (fy > 1) continue
      const y = top - Y(0.1) + fy * (bot + Y(0.12) - top)
      const half = y < top ? 0.4 : y < neck ? 0.4 - 0.32 * ((y - top) / (neck - top)) : 0.08
      const x = X(0.5 + (s - 0.5) * 2 * (half - 0.03))
      dot(D, Math.round(x), Math.round(y), 1, out && y > neck ? COL.ember : COL.lilac)
    }
  },
  /** Upward trend: bars grow one after another and a line climbs over them to an arrowhead. */
  trend(D, t) {
    const T = t % 6, { X, Y } = box(D)
    line(D, X(0.08), Y(0.86), X(0.92), Y(0.86), 1, COL.dim)
    const H = [0.18, 0.28, 0.24, 0.42, 0.56]
    H.forEach((h, k) => { const p = E(P(T, 0.2 + k * 0.3, 0.7 + k * 0.3)); rectF(D, X(0.12 + k * 0.16), Y(0.86) - Y(h) * p, X(0.1), Y(h) * p, 1, k === 4 ? COL.ember : COL.violet) })
    const pts = H.map((h, k) => [X(0.17 + k * 0.16), Y(0.86) - Y(h) - Y(0.08)])
    const p = P(T, 1.8, 3.2) * (pts.length - 1)
    for (let k = 0; k < pts.length - 1; k++) line(D, pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], 1, COL.mint, clamp(p - k))
    if (T > 3.2) { const [ax, ay] = pts[4]; line(D, ax, ay, ax - 3, ay, 1, COL.mint); line(D, ax, ay, ax, ay + 3, 1, COL.mint) }
  },
  /** Monitoring: a live line scrolls across a screen; when it crosses the threshold an alert lights. */
  pulse(D, t) {
    const { X, Y } = box(D)
    rectO(D, X(0.06), Y(0.12), X(0.88), Y(0.72), 1, COL.lilac)
    const thr = Y(0.36)
    for (let x = X(0.1); x < X(0.9); x += 3) dot(D, Math.round(x), Math.round(thr), 1, COL.dim)
    let alert = false
    for (let x = Math.round(X(0.1)); x < X(0.9); x++) {
      const u = x / D.cols * 6 + t * 2.2, ph = u % 3
      const spike = ph > 1.9 && ph < 2.3 ? Math.sin(((ph - 1.9) / 0.4) * Math.PI) : 0
      const y = Y(0.6) - Math.sin(u * 2.1) * Y(0.04) - spike * Y(0.3)
      if (y < thr) alert = alert || x > X(0.7)
      dot(D, x, Math.round(y), 1, y < thr ? COL.ember : COL.mint)
    }
    disc(D, X(0.82), Y(0.22), Math.max(1, X(0.035)), 1, alert || Math.floor(t * 2) % 2 ? COL.ember : COL.dim)
  },
  /** AI agents: three agents, each with its eyes blinking, send drafts down to one gate that opens. */
  agents(D, t) {
    const T = t % 6, { X, Y, M } = box(D), s = M * 0.18
    const gx = X(0.5), gy = Y(0.8)
    ;[0.2, 0.5, 0.8].forEach((fx, k) => {
      const cx = X(fx), cy = Y(0.3)
      rectO(D, cx - s / 2, cy - s / 2, s, s * 0.85, 1, COL.white)
      line(D, cx, cy - s / 2, cx, cy - s * 0.8, 1, COL.lilac); dot(D, Math.round(cx), Math.round(cy - s * 0.85), 1, COL.ember)
      const blink = Math.floor(t * 1.5 + k) % 5 === 0
      if (!blink) { dot(D, Math.round(cx - s * 0.2), Math.round(cy), 1, COL.mint); dot(D, Math.round(cx + s * 0.2), Math.round(cy), 1, COL.mint) }
      line(D, cx, cy + s * 0.4, gx, gy - M * 0.1, 0.6, COL.violet)
      const f = (T * 0.5 + k * 0.33) % 1
      dot(D, Math.round(cx + (gx - cx) * f), Math.round(cy + s * 0.4 + (gy - M * 0.1 - cy - s * 0.4) * f), 1, COL.white)
    })
    diamond(D, gx, gy, Math.round(M * 0.09), 1, T > 3 ? COL.mint : COL.ember)
  },
}
/** The picture each scene finishes on, for reduced motion. */
export const STILL = { find: 5.5, decide: 5.5, prove: 6.5, ship: 4, brain: 7.5, agent: 6, check: 5.5, shield: 1, signals: 3, mac: 5, blocks: 4.6, astro: 2, launch: 2.4, gtm: 1, revops: 0.3, funnel: 1, trend: 4, pulse: 0.6, agents: 4 }

/** The tiles of the two word reels, one scene per letter. */
export const ANJOR_TILES = ['astro', 'launch', 'gtm', 'revops', 'funnel', 'trend', 'pulse', 'agents', 'signals']
export const ROQ_TILES = ['signals', 'find', 'decide', 'agent', 'check', 'prove']
