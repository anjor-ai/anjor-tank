import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   ASCII motion: small scenes drawn as characters on a canvas, the way a terminal would draw a 3D object.
   Each scene is a function (t, cols, rows) → it writes brightness (0..1) and an accent flag into a grid.
   The canvas runs only while it is on screen; under reduced motion it draws one still frame.
   Colours come from CSS (--ascii-ink, --ascii-accent on the element), so both themes work.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAMP = ' .,:-=+*#%@'

function rot(x, y, z, ax, ay) {
  const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax)
  const x1 = x * cy + z * sy, z1 = -x * sy + z * cy
  const y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx
  return [x1, y1, z2]
}

/** 01 · Find: three stacked planes turn slowly; a scan line passes through them; the leak in the middle plane flares. */
function find(t, C, R, put, M) {
  const ay = t * 0.45, ax = 0.5
  const scan = ((t * 0.32) % 1) * 2.2 - 1.1
  for (let p = 0; p < 3; p++) {
    const py = (p - 1) * 0.62
    for (let i = -14; i <= 14; i += 0.5) for (let j = -14; j <= 14; j += 0.5) {
      const x = i / 14, z = j / 14
      const [X, Y, Z] = rot(x, py, z, ax, ay)
      const d = 3.4 + Z
      const [sx, sy] = M(X / d * 2.3, Y / d * 2.3)
      const edge = Math.abs(i) >= 14 || Math.abs(j) >= 14
      const leak = p === 1 && Math.hypot(i - 4, j + 3) < 4.2
      const grid = i % 7 === 0 || j % 7 === 0
      if (!edge && !grid && !(p === 1 && Math.hypot(i - 4, j + 3) < 4.2)) continue
      let b = edge ? 0.95 : 0.42 + 0.12 * Math.sin(i * 0.9 + j * 0.7 + t * 2)
      const near = Math.max(0, 1 - Math.abs(Y - scan) * 4)
      b = Math.min(1, b + near * 0.6)
      if (leak) b = 0.55 + 0.45 * Math.abs(Math.sin(t * 3 + i))
      put(sx, sy, b, 1 / d, leak)
    }
  }
  // the scan line itself
  for (let x = 2; x < C - 2; x++) {
    const sy = M(0, scan / 3.4 * 2.3)[1]
    if ((x + Math.floor(t * 20)) % 3 === 0) put(x, sy, 0.35, 0.1, false)
  }
}

/** 02 · Decide: evidence flows down from a root, splits at a node; one branch is chosen and brightens, the other fades. */
function decide(t, C, R, put) {
  const root = [C / 2, R * 0.16], a = [C * 0.22, R * 0.82], b = [C * 0.78, R * 0.82], mid = [C / 2, R * 0.48]
  const cycle = Math.floor(t / 4) % 2, k = (t % 4) / 4
  const chosen = cycle ? b : a, other = cycle ? a : b
  const bez = (p0, p1, p2, s) => [(1 - s) ** 2 * p0[0] + 2 * (1 - s) * s * p1[0] + s * s * p2[0], (1 - s) ** 2 * p0[1] + 2 * (1 - s) * s * p1[1] + s * s * p2[1]]
  const trunk = (s) => [root[0], root[1] + (mid[1] - root[1]) * s]
  for (let s = 0; s <= 1; s += 0.02) { const [x, y] = trunk(s); put(Math.round(x), Math.round(y), 0.4, 1, false) }
  for (const [end, on] of [[chosen, true], [other, false]]) {
    for (let s = 0; s <= 1; s += 0.012) {
      const [x, y] = bez(mid, [end[0], mid[1]], end, s)
      put(Math.round(x), Math.round(y), on ? 0.55 + 0.3 * k : Math.max(0.08, 0.4 - k * 0.32), 1, on && k > 0.35)
    }
  }
  // particles
  for (let n = 0; n < 14; n++) {
    const s = ((t * 0.55 + n / 14) % 1)
    let p
    if (s < 0.4) p = trunk(s / 0.4)
    else { const u = (s - 0.4) / 0.6; p = bez(mid, [chosen[0], mid[1]], chosen, u) }
    put(Math.round(p[0]), Math.round(p[1]), 1, 2, s > 0.4)
  }
  // nodes as boxes
  const box = (c, w, h, br, acc) => { for (let x = -w; x <= w; x++) for (let y = -h; y <= h; y++) if (Math.abs(x) === w || Math.abs(y) === h) put(Math.round(c[0] + x), Math.round(c[1] + y), br, 3, acc) }
  box(root, 3, 1, 0.9, false); box(mid, 2, 1, 1, true); box(chosen, 4, 2, 0.6 + 0.4 * k, k > 0.35); box(other, 4, 2, Math.max(0.15, 0.6 - k * 0.5), false)
}

/** 03 · Close the loop: a torus turns; a bright band runs around it, the measured result feeding the next cycle. */
function loop(t, C, R, put, M) {
  const A = t * 0.7, B = t * 0.35
  const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B)
  const band = (t * 1.6) % (Math.PI * 2)
  for (let th = 0; th < Math.PI * 2; th += 0.09) {
    const ct = Math.cos(th), st = Math.sin(th)
    for (let ph = 0; ph < Math.PI * 2; ph += 0.025) {
      const cp = Math.cos(ph), sp = Math.sin(ph)
      const cx = 2 + ct, cy = st
      const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB
      const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB
      const z = 6 + cA * cx * sp + cy * sA
      const ooz = 1 / z
      const [xp, yp] = M(ooz * x * 1.95, -ooz * y * 1.95)
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp)
      const hot = Math.abs(((ph - band + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.32
      put(xp, yp, Math.max(0.05, (L + 1.2) / 2.6), ooz, hot)
    }
  }
}

const SCENES = { find, decide, loop }

export function AsciiCanvas({ scene = 'find', className, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return undefined
    const ctx = cv.getContext('2d')
    const fn = SCENES[scene]
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, C = 0, R = 0, cw = 7, ch = 12, dpr = 1, raf = 0, visible = false, t0 = performance.now()
    let ink = '#f2efe8', accent = '#9baeff'
    let bright, zbuf, acc
    const size = () => {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width; H = r.height
      cw = W < 360 ? 6 : 7; ch = cw * 1.75
      C = Math.max(10, Math.floor(W / cw)); R = Math.max(6, Math.floor(H / ch))
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `500 ${Math.round(ch * 0.82)}px "IBM Plex Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'
      const cs = getComputedStyle(cv)
      ink = cs.getPropertyValue('--ascii-ink').trim() || ink
      accent = cs.getPropertyValue('--ascii-accent').trim() || accent
      bright = new Float32Array(C * R); zbuf = new Float32Array(C * R); acc = new Uint8Array(C * R)
    }
    // Normalised coordinates (-1..1 across the shorter side, square in pixels) to a character cell.
    const M = (nx, ny) => { const s = Math.min(W, H) * 0.46; return [Math.round((W / 2 + nx * s - (W - C * cw) / 2) / cw), Math.round((H / 2 + ny * s - (H - R * ch) / 2) / ch)] }
    const put = (x, y, b, z, a) => {
      if (x < 0 || y < 0 || x >= C || y >= R) return
      const i = y * C + x
      if (z >= zbuf[i]) { zbuf[i] = z; bright[i] = b; acc[i] = a ? 1 : 0 }
    }
    const draw = (t) => {
      bright.fill(0); zbuf.fill(-1e9); acc.fill(0)
      fn(t, C, R, put, M)
      ctx.clearRect(0, 0, W, H)
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
        const i = y * C + x, b = bright[i]
        if (b <= 0.02) continue
        const chr = RAMP[Math.min(RAMP.length - 1, Math.max(1, Math.round(b * (RAMP.length - 1))))]
        ctx.globalAlpha = Math.min(1, 0.25 + b * 0.85)
        ctx.fillStyle = acc[i] ? accent : ink
        ctx.fillText(chr, x * cw + (W - C * cw) / 2, y * ch + (H - R * ch) / 2)
      }
      ctx.globalAlpha = 1
    }
    const tick = (now) => { draw((now - t0) / 1000); if (visible) raf = requestAnimationFrame(tick) }
    size()
    if (still) { draw(2.4); }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !still) raf = requestAnimationFrame(tick)
    }, { threshold: 0.05 })
    io.observe(cv)
    const ro = new ResizeObserver(() => { size(); if (still || !visible) draw(2.4) })
    ro.observe(cv)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [scene])
  return <canvas ref={ref} className={className} role="img" aria-label={label} />
}
