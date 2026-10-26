/* The ROQIVA art engine: dot-matrix (ordered-dither) and ASCII scenes, drawn on canvas, in the brand palette.
   Space is the theme (the moon, orbits, a launch); the content is ours (signals flowing, a metric rising). No scene draws text.
   Scenes write into a cell grid; renderers turn the grid into square dots or into glyphs. Everything is deterministic in `t`
   (seconds), so a scene can be scrubbed, paused or drawn once for reduced motion. */

// ─── Colours (little-endian RGBA packed for ImageData) ───
export const rgba = (r, g, b, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0
const hx = (h, a = 255) => rgba(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), a)
export const COL = {
  white: hx('#faf9f5'),
  lilac: hx('#f0d9cc'),
  violet: hx('#e39577'),
  deep: hx('#b5532f'),
  dim: hx('#3a2a22'),
  ember: hx('#ff8a3d'),
  pink: hx('#ff3d9a'),
  cream: hx('#ffe6c9'),
  mint: hx('#3ed598'),
  sky: hx('#49b6ff'),
}

// ─── Noise ───
function hash(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
export const hash2 = hash
/** Value noise. `p` > 0 makes it tile with that period. */
export function noise(x, y, p = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const w = (a) => (p ? ((a % p) + p) % p : a)
  const a = hash(w(xi), w(yi)), b = hash(w(xi + 1), w(yi)), c = hash(w(xi), w(yi + 1)), d = hash(w(xi + 1), w(yi + 1))
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
export function fbm(x, y, o = 4) {
  let s = 0, a = 0.5, f = 1, n = 0
  for (let i = 0; i < o; i++) { s += a * noise(x * f, y * f); n += a; a *= 0.5; f *= 2.03 }
  return s / n
}
/** A tileable fbm texture, sampled with wrap-around: cheap moving clouds. */
const TEX = 128
let tex = null
function cloudTex() {
  if (tex) return tex
  tex = new Float32Array(TEX * TEX)
  for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) {
    let s = 0, a = 0.5, n = 0, f = 1
    for (let o = 0; o < 4; o++) { const P = 8 * f; s += a * noise((x / TEX) * P, (y / TEX) * P, P); n += a; a *= 0.5; f *= 2 }
    tex[y * TEX + x] = s / n
  }
  return tex
}
export function cloud(x, y) {
  const t = cloudTex()
  const xi = ((Math.floor(x) % TEX) + TEX) % TEX, yi = ((Math.floor(y) % TEX) + TEX) % TEX
  return t[yi * TEX + xi]
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))

// Ordered dithering (8 × 8 Bayer)
const B8 = (() => {
  const m = [[0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26], [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22], [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25], [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]]
  return Float32Array.from(m.flat(), (v) => (v + 0.5) / 64)
})()

// ─── The dot grid ───
export function makeDots(cols, rows) { return { cols, rows, buf: new Uint32Array(cols * rows), m: null } }
/** Plot brightness `v` (0–1) at cell (i, j) in colour `c`, dithered. */
export function dot(D, i, j, v, c) {
  if (i < 0 || j < 0 || i >= D.cols || j >= D.rows) return
  if (D.m && !D.m(i, j)) return
  if (v > B8[(j & 7) * 8 + (i & 7)]) D.buf[j * D.cols + i] = c
}
/** Turn the grid into square dots: each cell is `k` pixels, the dot `k - gap`. */
export function blit(ctx, img, D, k, gap = 1) {
  const W = D.cols * k, out = new Uint32Array(img.data.buffer), s = k - gap
  out.fill(0)
  const b = D.buf
  for (let j = 0; j < D.rows; j++) for (let i = 0; i < D.cols; i++) {
    const c = b[j * D.cols + i]
    if (!c) continue
    const o = j * k * W + i * k
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) out[o + y * W + x] = c
  }
  ctx.putImageData(img, 0, 0)
}

// ─── Scenes. R = { x0, y0, w, h } is the region, in cells ───
export const each = (D, R, fn) => {
  const x1 = Math.min(D.cols, Math.ceil(R.x0 + R.w)), y1 = Math.min(D.rows, Math.ceil(R.y0 + R.h))
  for (let j = Math.max(0, Math.floor(R.y0)); j < y1; j++) for (let i = Math.max(0, Math.floor(R.x0)); i < x1; i++) fn(i, j, (i - R.x0) / R.w, (j - R.y0) / R.h)
}

/** Twinkling stars, drifting slowly. */
export function stars(D, t, R, o = {}) {
  const dens = o.density ?? 0.012, drift = o.drift ?? 0.6, c = o.c ?? COL.lilac
  const off = Math.floor(t * drift)
  each(D, R, (i, j) => {
    const h = hash(i + off + (o.seed || 0) * 977, j)
    if (h > 1 - dens) {
      const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + h * 3) + h * 40)
      dot(D, i, j, tw, h > 1 - dens * 0.15 ? COL.white : c)
    }
  })
}

/** Dithered cosmic dust, like clouds seen through a screen. */
export function dust(D, t, R, o = {}) {
  const amt = o.amt ?? 0.5, sc = o.scale ?? 0.9, c = o.c ?? COL.deep
  each(D, R, (i, j) => {
    const v = cloud(i * sc + t * (o.vx ?? 1.2), j * sc + t * (o.vy ?? 0.25))
    const d = smooth(o.lo ?? 0.48, o.hi ?? 0.78, v) * amt
    if (d > 0.02) dot(D, i, j, d, c)
  })
}

// Craters on the moon, in longitude / latitude
const CRATERS = (() => {
  const out = []
  for (let k = 0; k < 30; k++) out.push([hash(k, 1) * Math.PI * 2 - Math.PI, (hash(k, 2) - 0.5) * 2.4, 0.06 + hash(k, 3) ** 2 * 0.26])
  return out
})()
// The moon's surface (maria and craters), computed once as a longitude × latitude texture
const MW = 256, MH = 128
let mtex = null
function moonAlbedo(lon, lat) {
  if (!mtex) {
    mtex = new Float32Array(MW * MH)
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const lo = (x / MW) * 2 * Math.PI - Math.PI, la = (y / MH) * Math.PI - Math.PI / 2
      let alb = 0.92 - smooth(0.5, 0.66, fbm(lo * 1.3 + 7, la * 1.5 + 2, 3)) * 0.42
      for (let k = 0; k < CRATERS.length; k++) {
        const [cl, ca, rad] = CRATERS[k]
        let dl = lo - cl; if (dl > Math.PI) dl -= 2 * Math.PI; if (dl < -Math.PI) dl += 2 * Math.PI
        const dd = Math.hypot(dl * Math.cos(la), la - ca) / rad
        if (dd < 1.15) alb *= dd < 0.8 ? 0.72 : dd < 1 ? 1.18 : 1
      }
      mtex[y * MW + x] = alb
    }
  }
  const x = Math.min(MW - 1, Math.max(0, Math.floor(((lon + Math.PI) / (2 * Math.PI)) * MW)))
  const y = Math.min(MH - 1, Math.max(0, Math.floor(((lat + Math.PI / 2) / Math.PI) * MH)))
  return mtex[y * MW + x]
}
/** A lit, rotating moon with maria and craters. cx, cy, r are fractions of the region. */
export function moon(D, t, R, o = {}) {
  const cx = R.x0 + (o.cx ?? 0.5) * R.w, cy = R.y0 + (o.cy ?? 0.5) * R.h, r = (o.r ?? 0.42) * Math.min(R.w, R.h)
  const rot = o.rot ?? t * 0.06, cr = Math.cos(rot), sr = Math.sin(rot)
  const L = o.light || [-0.55, -0.42, 0.72]
  const c1 = o.c ?? COL.white, c2 = o.c2 ?? COL.lilac
  const box = { x0: cx - r - 1, y0: cy - r - 1, w: 2 * r + 2, h: 2 * r + 2 }
  each(D, box, (i, j) => {
    const px = (i + 0.5 - cx) / r, py = (j + 0.5 - cy) / r, d2 = px * px + py * py
    if (d2 > 1) return
    const z = Math.sqrt(1 - d2)
    const X = px * cr + z * sr, Z = -px * sr + z * cr
    const alb = moonAlbedo(Math.atan2(X, Z), Math.asin(py))
    const lam = Math.max(0, px * L[0] + py * L[1] + z * L[2])
    const v = clamp((0.08 + 0.92 * lam) * alb * (o.gain ?? 1.05))
    dot(D, i, j, v, v > 0.62 ? c1 : c2)
  })
}

/** The curve of a planet's horizon, lit along the rim, rising from the bottom of the region. */
export function horizon(D, t, R, o = {}) {
  const cx = R.x0 + (o.cx ?? 0.5) * R.w, rr = (o.r ?? 1.6) * R.w, top = R.y0 + (o.top ?? 0.7) * R.h
  const cy = top + rr, g0 = o.glow ?? 10
  // only the band from just above the rim down: everything higher is empty sky
  const y0 = Math.max(R.y0, top - g0 - 1)
  each(D, { x0: R.x0, y0, w: R.w, h: R.y0 + R.h - y0 }, (i, j) => {
    const d = Math.hypot(i + 0.5 - cx, j + 0.5 - cy)
    if (d > rr + 2) {
      // atmosphere glow just above the rim
      const g = 1 - (d - rr) / (o.glow ?? 10)
      if (g > 0) dot(D, i, j, g * 0.5, COL.deep)
      return
    }
    const depth = (rr - d) / (R.h * 0.4)
    const rim = Math.exp(-(((rr - d) / 2.2) ** 2))
    const surf = cloud(i * 1.4 + t * 0.4, j * 2.6) * 0.5 + 0.25
    const v = clamp(rim * 0.95 + surf * (1 - smooth(0, 1, depth)) * 0.7)
    dot(D, i, j, v, rim > 0.5 ? COL.lilac : COL.violet)
  })
}

/** A floating astronaut, tumbling slowly. Built from simple shapes; generic, not a character. */
export function astronaut(D, t, R, o = {}) {
  const cx = R.x0 + (o.cx ?? 0.5) * R.w, cy = R.y0 + (o.cy ?? 0.52) * R.h + Math.sin(t * 0.9) * R.h * 0.03
  const s = (o.s ?? 0.17) * Math.min(R.w, R.h), a = o.rot ?? Math.sin(t * 0.35) * 0.6 + t * 0.12
  const ca = Math.cos(a), sa = Math.sin(a)
  const cap = (x, y, ax, ay, bx, by, r) => { const dx = bx - ax, dy = by - ay, h = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)); return Math.hypot(x - ax - dx * h, y - ay - dy * h) < r }
  const box = { x0: cx - s * 3, y0: cy - s * 3, w: s * 6, h: s * 6 }
  each(D, box, (i, j) => {
    const X0 = (i + 0.5 - cx) / s, Y0 = (j + 0.5 - cy) / s
    const x = X0 * ca + Y0 * sa, y = -X0 * sa + Y0 * ca
    let v = 0, c = COL.white
    const helmet = Math.hypot(x, y + 1.25) < 0.62
    const visor = Math.hypot((x - 0.12) / 1.25, y + 1.25) < 0.36
    const torso = Math.abs(x) < 0.55 && y > -0.75 && y < 0.55
    const pack = x < -0.4 && x > -0.85 && y > -0.7 && y < 0.35
    const arms = cap(x, y, -0.55, -0.45, -1.05, 0.15, 0.2) || cap(x, y, 0.55, -0.45, 1.0, -0.95, 0.2)
    const legs = cap(x, y, -0.28, 0.55, -0.35, 1.45, 0.22) || cap(x, y, 0.28, 0.55, 0.55, 1.35, 0.22)
    if (visor) { v = 0.3; c = COL.deep }
    else if (helmet || torso || arms || legs) v = 0.95 - (x + 0.6) * 0.18
    else if (pack) { v = 0.6; c = COL.lilac }
    if (torso && Math.abs(x - 0.15) < 0.12 && Math.abs(y + 0.25) < 0.08) { v = 1; c = COL.ember }
    if (v) dot(D, i, j, clamp(v), c)
  })
}

/** A ringed planet with a moonlet in orbit. */
export function orbit(D, t, R, o = {}) {
  const cx = R.x0 + 0.5 * R.w, cy = R.y0 + 0.5 * R.h, r = 0.26 * Math.min(R.w, R.h)
  const tilt = -0.32, ct = Math.cos(tilt), st = Math.sin(tilt)
  each(D, R, (i, j) => {
    const x = i + 0.5 - cx, y = j + 0.5 - cy
    const rx = x * ct + y * st, ry = -x * st + y * ct
    const e = Math.hypot(rx / (r * 1.9), ry / (r * 0.5))
    const inRing = e > 0.82 && e < 1.0
    const d = Math.hypot(x, y)
    const front = ry > 0
    if (d < r && !(inRing && front)) {
      const lam = clamp(0.25 + 0.75 * (-(x / r) * 0.6 - (y / r) * 0.4 + Math.sqrt(Math.max(0, 1 - (d / r) ** 2)) * 0.7))
      const band = 0.85 + 0.15 * Math.sin(ry * 0.9)
      dot(D, i, j, lam * band, COL.violet)
    } else if (inRing) dot(D, i, j, 0.75 - (e - 0.82) * 2, COL.lilac)
  })
  const a = t * 0.9, mx = cx + Math.cos(a) * r * 1.9 * ct - Math.sin(a) * r * 0.5 * st, my = cy + Math.cos(a) * r * 1.9 * st + Math.sin(a) * r * 0.5 * ct
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) dot(D, Math.round(mx + dx), Math.round(my + dy), 1, COL.white)
}

/** GTM signals: streams of data flowing into one node and leaving as a metric that rises. */
export function signals(D, t, R) {
  const nx = R.x0 + R.w * 0.5, ny = R.y0 + R.h * 0.5
  const lanes = 7
  for (let l = 0; l < lanes; l++) {
    const ly = R.y0 + R.h * (0.15 + 0.7 * (l / (lanes - 1)))
    for (let k = 0; k < 4; k++) {
      const p = ((t * (0.35 + hash(l, k) * 0.2) + hash(l, k + 9)) % 1)
      const x = R.x0 + p * R.w * 0.5
      const y = ly + (ny - ly) * smooth(0.2, 1, p)
      dot(D, Math.round(x), Math.round(y), 1, l % 3 ? COL.lilac : COL.ember)
      dot(D, Math.round(x) - 1, Math.round(y), 0.6, COL.deep)
    }
  }
  const pulse = 0.6 + 0.4 * Math.sin(t * 5)
  each(D, { x0: nx - 3, y0: ny - 3, w: 6, h: 6 }, (i, j) => { if (Math.hypot(i + 0.5 - nx, j + 0.5 - ny) < 2.6) dot(D, i, j, pulse, COL.white) })
  // the metric on the right
  const bars = 4
  for (let b = 0; b < bars; b++) {
    const bx = Math.round(nx + R.w * (0.1 + b * 0.09)), hgt = R.h * (0.18 + 0.12 * b) * (0.75 + 0.25 * Math.sin(t * 0.8 + b))
    for (let y = 0; y < hgt; y++) for (let x = 0; x < Math.max(2, R.w * 0.05); x++) dot(D, bx + x, Math.round(R.y0 + R.h * 0.82 - y), 0.9 - y / hgt * 0.4, b === bars - 1 ? COL.mint : COL.violet)
  }
}

/** A launch, as a field: realistic proportions, turbulent exhaust, a ground cloud that rolls out and drifts.
    (x, y) in rocket heights, x from the pad, y up from the ground. T = seconds since ignition. Returns [v, kind]:
    kind 1 body, 2 exhaust, 3 smoke, 4 tower. */
export function launchAlt(T) { return T < 1.3 ? 0 : 0.11 * (T - 1.3) ** 2.1 }
export function launchField(x, y, T) {
  const alt = launchAlt(T)
  const base = alt + 0.04, top = base + 1, w = 0.072
  const shake = T < 1.6 ? Math.sin(T * 90) * 0.0025 : 0
  const xs = x - shake
  // body: centre core with an ogive fairing, two side boosters with nose cones, an interstage band
  const s = (y - base) / (top - base)
  if (s >= 0 && s <= 1) {
    let hw = w
    if (s > 0.8) hw = w * 1.15 * Math.sqrt(Math.max(0, 1 - ((s - 0.8) / 0.2) ** 2))
    if (Math.abs(xs) < hw) {
      const shade = 1 - ((xs / hw) + 0.35) ** 2 * 0.55
      const band = (s > 0.56 && s < 0.6) ? 0.45 : 1
      return [clamp(shade * band), 1]
    }
    const bs = s / 0.66
    if (bs <= 1) {
      for (const side of [-1, 1]) {
        const bx = xs - side * w * 1.85
        let bw = w * 0.62
        if (bs > 0.86) bw *= Math.sqrt(Math.max(0, 1 - ((bs - 0.86) / 0.14) ** 2))
        if (Math.abs(bx) < bw) return [clamp((1 - ((bx / bw) + 0.4) ** 2 * 0.6) * 0.92), 1]
      }
    }
  }
  // exhaust: grows at ignition, flickers, widens with distance from the nozzles
  if (T > 0.2 && y < base) {
    const d = base - y
    const L = Math.min(1.5, (T - 0.2) * 1.6) * (alt > 0.1 ? 1.25 : 1)
    if (d < L) {
      const width = 0.07 + d * 0.22 + 0.015 * Math.sin(y * 40 + T * 30)
      const q = Math.abs(xs) / width
      if (q < 1) {
        const fl = 0.75 + 0.25 * noise(x * 30, y * 22 - T * 40)
        const v = (1 - d / L) ** 1.1 * (1 - q * q) * fl * 1.4
        if (v > 0.05) return [clamp(v), 2]
      }
    }
  }
  // ground cloud: rolls out from the pad after ignition, rises a little, thins out
  if (T > 0.5 && y < 0.75) {
    const sp = clamp((T - 0.5) / 5), fade = 1 - smooth(7, 12, T)
    const rx = 0.2 + 1.15 * Math.sqrt(sp), ry = 0.14 + 0.5 * Math.sqrt(sp)
    const n = cloud(x * 16 + T * 1.2 + 40, y * 18 - T * 1.8)
    const r = Math.hypot(x / rx, (y - 0.04 - sp * 0.1) / ry) - (n - 0.5) * 0.7
    if (r < 1) {
      const v = (1 - r) * 1.7 * (0.3 + n) * fade
      if (v > 0.06) return [clamp(v), 3]
    }
  }
  // the launch tower, left of the pad
  if (x < -0.16 && x > -0.2 && y > 0 && y < 1.08) return [((Math.round(y * 60) % 3) ? 0.55 : 0.85), 4]
  if (x < -0.07 && x > -0.2 && Math.abs(y - 0.82) < 0.012) return [0.6, 4]
  return [0, 0]
}

/** The launch on the dot grid (used inside the letters). */
export function rocket(D, t, R, o = {}) {
  const P = o.period ?? 9, T = t % P
  const gy = R.y0 + R.h * 0.93, scale = R.h * 0.42, px = R.x0 + R.w * (o.x ?? 0.5)
  const C = [0, COL.white, COL.cream, COL.lilac, COL.violet]
  each(D, R, (i, j) => {
    const [v, k] = launchField((i + 0.5 - px) / scale, (gy - j - 0.5) / scale, T)
    if (v > 0) dot(D, i, j, v, k === 2 && v > 0.7 ? COL.ember : C[k])
  })
  each(D, { x0: R.x0, y0: gy, w: R.w, h: 1 }, (i, j) => dot(D, i, j, 0.5, COL.dim))
}

/** Accent tiles, after the dithered-clouds reference: a few squares of the grid fill with an ember-to-pink gradient. */
export function tiles(D, t, R, o = {}) {
  const step = o.step ?? 18, P = o.period ?? 6
  const nx = Math.ceil(R.w / step), ny = Math.ceil(R.h / step)
  for (let a = 0; a < (o.count ?? 2); a++) {
    const e = Math.floor(t / P + a * 0.5)
    const life = (t / P + a * 0.5) % 1
    const k = Math.floor(hash(e, a + 3) * nx * ny)
    const tx = R.x0 + (k % nx) * step, ty = R.y0 + Math.floor(k / nx) * step
    const g = Math.sin(life * Math.PI) * (o.amt ?? 0.9)
    each(D, { x0: tx, y0: ty, w: step, h: step }, (i, j, u, v) => {
      const lu = (i - tx) / step, lv = (j - ty) / step
      dot(D, i, j, g * (0.45 + 0.55 * (1 - lv)), lu + (1 - lv) * 0.6 > 0.9 ? COL.pink : COL.ember)
    })
  }
}

// ─── ASCII ───
// Symbols only: the art never spells anything.
export const RAMP = ' .:-=+*#%@'
export function makeAscii(cols, rows) { return { cols, rows, v: new Float32Array(cols * rows), k: new Uint8Array(cols * rows) } }
export function asciiLaunch(A, T, o = {}) {
  A.v.fill(0); A.k.fill(0)
  const gy = A.rows * (o.ground ?? 0.97), scale = A.rows * (o.scale ?? 0.36), px = A.cols * (o.x ?? 0.5)
  const ax = o.aspect ?? 0.55 // a glyph cell is taller than it is wide
  for (let j = 0; j < A.rows; j++) for (let i = 0; i < A.cols; i++) {
    const [v, k] = launchField(((i + 0.5 - px) * ax) / scale, (gy - j - 0.5) / scale, T)
    if (v > 0.04) { A.v[j * A.cols + i] = v; A.k[j * A.cols + i] = k }
  }
}

/** A starfield seen from inside it: stars stream outward from the centre; `k` (0–1) stretches them into warp streaks. */
const WARP = Array.from({ length: 320 }, (_, n) => [hash(n, 11) * Math.PI * 2, hash(n, 12), 0.4 + hash(n, 13) * 0.6])
export function warp(D, t, R, k = 0, a = 1) {
  const cx = R.x0 + R.w / 2, cy = R.y0 + R.h / 2, maxR = Math.hypot(R.w, R.h) / 2
  for (const [ang, ph, sp] of WARP) {
    const s = (ph + t * 0.05 * sp * (1 + k * 10)) % 1
    const r = s * s * maxR, len = 1 + k * 26 * s
    const ca = Math.cos(ang), sa = Math.sin(ang)
    for (let d = 0; d < len; d++) {
      const rr = r - d
      if (rr < 0) break
      dot(D, Math.round(cx + ca * rr), Math.round(cy + sa * rr), a * (0.35 + 0.65 * s) * (1 - d / (len + 1)), s > 0.7 ? COL.white : COL.lilac)
    }
  }
}

// ─── Track C illustrations ───
export const line = (D, x0, y0, x1, y1, v, c, p = 1) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0
  for (let s = 0; s <= n * p; s++) dot(D, Math.round(x0 + ((x1 - x0) * s) / (n || 1)), Math.round(y0 + ((y1 - y0) * s) / (n || 1)), v, c)
}
export const rectO = (D, x, y, w, h, v, c, p = 1) => {
  const per = 2 * (w + h), L = per * p
  const seg = [[x, y, x + w, y, w], [x + w, y, x + w, y + h, h], [x + w, y + h, x, y + h, w], [x, y + h, x, y, h]]
  let used = 0
  for (const [a, b, c2, d, len] of seg) { if (used >= L) break; line(D, a, b, c2, d, v, c, Math.min(1, (L - used) / len)); used += len }
}
export const rectF = (D, x, y, w, h, v, c) => { for (let j = Math.round(y); j < y + h; j++) for (let i = Math.round(x); i < x + w; i++) dot(D, i, j, v, c) }

/** C1, a blueprint and a governed build: a schematic is drawn on a blueprint grid (architecture, PRD, specs), then the brand's
    engineers build it, block by block, on their own stack. Loops every 8 s. */
export function blueprint(D, t, R) {
  const T = t % 8, u = (R.w + R.h) / 2
  // the blueprint grid
  const g = Math.max(4, Math.round(u / 14))
  each(D, R, (i, j) => { if ((i - Math.round(R.x0)) % g === 0 && (j - Math.round(R.y0)) % g === 0) dot(D, i, j, 0.5, COL.dim) })
  const X = (f) => R.x0 + f * R.w, Y = (f) => R.y0 + f * R.h
  const p = (a, b) => clamp((T - a) / (b - a))
  // three components and the links between them, drawn in order
  const boxes = [[0.08, 0.16, 0.2, 0.2], [0.4, 0.1, 0.2, 0.2], [0.4, 0.5, 0.2, 0.2]]
  boxes.forEach(([x, y, w, h], k) => rectO(D, X(x), Y(y), w * R.w, h * R.h, 0.95, COL.lilac, p(0.2 + k * 0.6, 0.9 + k * 0.6)))
  line(D, X(0.28), Y(0.26), X(0.4), Y(0.2), 0.8, COL.violet, p(1.9, 2.3))
  line(D, X(0.28), Y(0.26), X(0.4), Y(0.6), 0.8, COL.violet, p(2.1, 2.5))
  // a spec document beside it: lines appear one by one
  const dx = X(0.08), dy = Y(0.48)
  rectO(D, dx, dy, R.w * 0.2, R.h * 0.38, 0.8, COL.lilac, p(2.4, 2.9))
  for (let k = 0; k < 5; k++) line(D, dx + 3, dy + 4 + k * (R.h * 0.065), dx + 3 + R.w * (0.14 - (k % 3) * 0.025), dy + 4 + k * (R.h * 0.065), 0.7, k ? COL.violet : COL.white, p(2.9 + k * 0.15, 3.2 + k * 0.15))
  // the pen
  const pen = p(0.2, 3.6)
  if (pen > 0 && pen < 1) dot(D, Math.round(X(0.08 + pen * 0.5)), Math.round(Y(0.16 + Math.sin(pen * 9) * 0.04 + pen * 0.4)), 1, COL.ember)
  // the build: blocks rise on the right, one per component, on the brand's own stack (a baseline)
  const bx = X(0.7), base = Y(0.86)
  line(D, X(0.66), base + 2, X(0.96), base + 2, 0.7, COL.dim)
  for (let k = 0; k < 6; k++) {
    const q = p(3.8 + k * 0.45, 4.2 + k * 0.45), col = k % 3, row = Math.floor(k / 3)
    if (q <= 0) continue
    const w = R.w * 0.075, h = R.h * 0.14, y = base - (row + 1) * (h + 2) - (1 - q) * R.h * 0.3
    rectF(D, bx + col * (w + 2), y, w, h, 0.9 * q, k === 5 ? COL.ember : COL.white)
  }
  // the governed check: a tick of light passes over the finished build
  const s = p(7, 7.6)
  if (s > 0 && s < 1) for (let j = Math.round(Y(0.4)); j < base; j++) dot(D, Math.round(X(0.68 + s * 0.28)), j, 0.9, COL.mint)
}

/** C2, a packaged deployment: one package drops into the brand's cloud (a dashed, locked boundary), unpacks into the system's
    modules, and the modules start running. Loops every 7 s. */
export function deploy(D, t, R) {
  const T = t % 7
  const X = (f) => R.x0 + f * R.w, Y = (f) => R.y0 + f * R.h
  const p = (a, b) => clamp((T - a) / (b - a))
  // the brand's cloud: a dashed boundary with a lock on it
  const bx = X(0.1), by = Y(0.42), bw = R.w * 0.8, bh = R.h * 0.5
  each(D, { x0: bx, y0: by, w: bw + 1, h: bh + 1 }, (i, j) => {
    const onX = Math.abs(j - Math.round(by)) < 1 || Math.abs(j - Math.round(by + bh)) < 1, onY = Math.abs(i - Math.round(bx)) < 1 || Math.abs(i - Math.round(bx + bw)) < 1
    if ((onX && (i >> 1) % 2 === 0) || (onY && (j >> 1) % 2 === 0)) dot(D, i, j, 0.85, COL.lilac)
  })
  rectF(D, X(0.5) - 3, by - 3, 7, 6, 0.95, COL.ember)
  for (let i = -2; i <= 2; i++) dot(D, Math.round(X(0.5)) + i, Math.round(by) - 5, 0.9, COL.ember)
  // the package: an isometric cube that falls in and lands
  const fall = p(0.3, 1.6), land = by + bh * 0.55
  const cy = Y(0.02) + (land - Y(0.02)) * (1 - (1 - fall) ** 3), s = Math.min(R.w, R.h) * 0.13, cx = X(0.5)
  const open = p(2, 2.7)
  if (open < 1) {
    const a = 1 - open
    each(D, { x0: cx - s * 1.1, y0: cy - s * 1.2, w: s * 2.2, h: s * 2.4 }, (i, j) => {
      const x = (i - cx) / s, y = (j - cy) / s
      const top = Math.abs(x) + Math.abs(y + 0.5) * 2 < 1 // rhombus
      const left = x < 0 && x > -1 && y > -0.5 + x * -0.5 * 0 && y < 0.5 - x * 0.5 && y > -0.5 - x * 0.5 * -1 - 0.0
      const right = x >= 0 && x < 1 && y < 0.5 + x * 0.5 && y > -0.5 + x * 0.5
      if (top) dot(D, i, j, 0.95 * a, COL.white)
      else if (left && y > -0.5 - x * 0.5) dot(D, i, j, 0.7 * a, COL.lilac)
      else if (right) dot(D, i, j, 0.5 * a, COL.violet)
    })
  }
  // the modules: they unpack from the landing point into a row, then run (a pulse moves through them)
  const names = 5
  for (let k = 0; k < names; k++) {
    const q = p(2.2 + k * 0.12, 2.9 + k * 0.12)
    if (q <= 0) continue
    const tx = bx + bw * (0.12 + k * 0.17), ty = by + bh * 0.3
    const x = cx + (tx - cx) * q, y = land + (ty - land) * q
    const w = bw * 0.12, h = bh * 0.36
    const run = T > 3.4 ? 0.55 + 0.45 * Math.max(0, Math.sin((T - 3.4) * 4 - k * 0.9)) : 0.75
    rectF(D, x - w / 2, y, w, h, run * q, k === 0 ? COL.violet : COL.white)
  }
  // data stays inside: a few dots circle within the boundary
  if (T > 3.4) for (let k = 0; k < 8; k++) {
    const a = (T - 3.4) * 0.9 + k * 0.785
    dot(D, Math.round(X(0.5) + Math.cos(a) * bw * 0.42), Math.round(by + bh * 0.82 + Math.sin(a) * bh * 0.1), 0.9, COL.mint)
  }
}
