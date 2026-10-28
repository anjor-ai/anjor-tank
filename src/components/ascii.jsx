import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   ASCII motion. Each scene is a small diagram of one idea, drawn in characters on a canvas,
   with real words in it: the funnel that leaks at payment, the call made on evidence, the loop that learns.
   A scene is a function (g, t): g is a character grid it writes into, t is seconds since start.
   Runs only while on screen; reduced motion draws one settled frame. Colours come from CSS
   (--ascii-ink, --ascii-accent, --ascii-dim, --ascii-warn on the canvas) so both themes work.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAMP = ' .:-=+*#%@'
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
const cyc = (t, len) => (t % len)
const type = (s, k) => s.slice(0, Math.max(0, Math.floor(k)))

/* ─────────── 01 Find: a funnel. Customers fall through five stages; at payment some spill out. The scan locks on it. ─────────── */
function find(g, t) {
  const { C, R } = g
  const T = cyc(t, 7)
  const stages = ['SEARCH', 'CART', 'CHECKOUT', 'PAYMENT', 'DELIVERED']
  const top = 3, gap = Math.max(2, Math.floor((R - 7) / stages.length)), lx = 2, fx0 = 13, fw = C - fx0 - 4
  const leakRow = 3
  stages.forEach((s, k) => {
    const y = top + k * gap
    const w = Math.round(fw * (1 - k * 0.13))
    const x0 = fx0 + Math.round((fw - w) / 2)
    const scanned = T > 0.6 + k * 0.55
    g.text(lx, y, s, scanned ? 0.9 : 0.45, k === leakRow && T > 3.3 ? 1 : 0)
    for (let x = 0; x < w; x++) g.cell(x0 + x, y, x === 0 ? '[' : x === w - 1 ? ']' : '-', 0.35, 2)
  })
  // particles: each falls through the funnel; at the payment row a share leave sideways
  for (let n = 0; n < 26; n++) {
    const ph = (t * 0.32 + n / 26) % 1
    const y = top + ph * (stages.length - 1) * gap
    const k = Math.floor((y - top) / gap)
    const spread = fw * (1 - Math.min(k, 4) * 0.13) * 0.42
    let x = fx0 + fw / 2 + Math.sin(n * 12.9) * spread
    const leaks = n % 4 === 0
    if (leaks && y > top + leakRow * gap) {
      const out = (y - (top + leakRow * gap)) * 2.4
      g.cell(Math.round(x + out + spread * 0.3), Math.round(top + leakRow * gap + 0.5 + out * 0.15), '~', 0.95, 1)
      continue
    }
    g.cell(Math.round(x), Math.round(y), 'o', 0.9, 0)
  }
  // the scan bracket moves down, then locks on payment
  const sk = Math.min(leakRow, Math.floor(Math.max(0, T - 0.6) / 0.55))
  const sy = top + sk * gap
  const lock = T > 3.3
  g.cell(fx0 - 2, sy, '>', 1, lock ? 1 : 0)
  g.cell(C - 2, sy, '<', 1, lock ? 1 : 0)
  if (lock) {
    const msg = 'LEAK FOUND: payment failures never retried'
    g.text(2, R - 2, type(msg, (T - 3.3) * 28), 1, 1)
  } else g.text(2, R - 2, type('scanning the journey...', T * 20), 0.6, 2)
}

/* ─────────── 02 Decide: evidence on the left, one call in the middle, two outcomes; guardrails decide which one ships. ─────────── */
function decide(g, t) {
  const { C, R } = g
  const T = cyc(t, 8)
  const ev = ['gateway codes', 'cohort drop', 'support tickets']
  const ex = 2, ey = 4, mid = Math.round(C * 0.5), my = Math.round(R / 2)
  ev.forEach((e, k) => {
    const on = T > 0.4 + k * 0.6
    g.text(ex, ey + k * 3, (on ? '[x] ' : '[ ] ') + e, on ? 0.95 : 0.4, 0)
    // a dotted lead from each piece of evidence to the decision
    const y0 = ey + k * 3, x0 = ex + 4 + e.length + 2
    for (let x = x0; x < mid - 4; x++) {
      const y = Math.round(y0 + (my - y0) * ((x - x0) / Math.max(1, mid - 4 - x0)))
      const flow = on && ((x + Math.floor(t * 14)) % 6 === 0)
      g.cell(x, y, flow ? '*' : '.', flow ? 1 : 0.3, flow ? 1 : 2)
    }
  })
  // the decision node
  const dn = ['  /\\  ', ' /  \\ ', '< ?? >', ' \\  / ', '  \\/  ']
  const decided = T > 3
  dn.forEach((row, k) => g.text(mid - 3, my - 2 + k, decided ? row.replace('??', 'OK') : row, 1, decided ? 1 : 0))
  // two outcomes
  const ox = mid + 6, ship = ['SHIP', 'retry rule + holdout'], hold = ['HOLD', 'wait for more data']
  for (let x = mid + 3; x < ox; x++) { g.cell(x, my - 3, '-', 0.4, 2); g.cell(x, my + 3, '-', 0.4, 2) }
  g.cell(mid + 3, my - 1, '/', 0.5, 2); g.cell(mid + 3, my + 1, '\\', 0.5, 2)
  g.text(ox, my - 3, ship[0], decided ? 1 : 0.5, decided ? 1 : 0)
  g.text(ox, my - 2, ship[1], decided ? 0.85 : 0.35, 0)
  g.text(ox, my + 3, hold[0], decided ? 0.25 : 0.5, 2)
  g.text(ox, my + 4, hold[1], decided ? 0.2 : 0.35, 2)
  // guardrails, ticked one by one before the call is made
  const gr = ['owner', 'guardrail', 'holdout']
  let gx = 2
  g.text(gx, R - 2, 'CHECKS ', 0.5, 2); gx += 7
  gr.forEach((x, k) => { const on = T > 2 + k * 0.3; g.text(gx, R - 2, `${on ? '+' : '.'} ${x}  `, on ? 1 : 0.35, on ? 1 : 2); gx += x.length + 4 })
}

/* ─────────── 03 Close the loop: ship, measure, learn, decide around a ring; every lap the baseline moves. ─────────── */
function loop(g, t) {
  const { C, R } = g
  const cx = C / 2, cy = R / 2 + 0.5, rx = Math.min(C * 0.27, R * 1.05), ry = Math.min(R * 0.36, rx / 2)
  const head = (t * 0.9) % (Math.PI * 2)
  for (let a = 0; a < Math.PI * 2; a += 0.04) {
    const x = Math.round(cx + Math.cos(a) * rx), y = Math.round(cy + Math.sin(a) * ry)
    const d = ((head - a) + Math.PI * 4) % (Math.PI * 2)
    const trail = d < 1.4
    g.cell(x, y, trail ? (d < 0.12 ? '@' : d < 0.5 ? '#' : '+') : '.', trail ? 1 - d * 0.5 : 0.3, trail ? 1 : 2)
  }
  const labels = [['SHIP', -Math.PI / 2], ['MEASURE', 0], ['LEARN', Math.PI / 2], ['DECIDE', Math.PI]]
  labels.forEach(([s, a]) => {
    const x = Math.round(cx + Math.cos(a) * (rx + (a === 0 ? 3 : a === Math.PI ? -3 - s.length : -s.length / 2)))
    const y = Math.round(cy + Math.sin(a) * (ry + 1.6))
    const near = Math.abs(((head - a) + Math.PI * 3) % (Math.PI * 2) - Math.PI) > Math.PI - 0.5
    g.text(a === 0 ? Math.round(cx + rx + 2) : a === Math.PI ? Math.round(cx - rx - 2 - s.length) : x, y, s, near ? 1 : 0.55, near ? 1 : 0)
  })
  const lap = Math.floor((t * 0.9 + Math.PI / 2) / (Math.PI * 2)) % 9 + 1
  g.text(Math.round(cx - 4), Math.round(cy) - 1, `cycle 0${lap}`, 0.9, 0)
  const bars = Math.min(lap, 5)
  for (let b = 0; b < bars; b++) for (let h = 0; h <= b; h++) g.cell(Math.round(cx - 3 + b * 2), Math.round(cy) + 2 - h, '#', 0.5 + b * 0.1, b === bars - 1 ? 1 : 0)
}

/* ─────────── GTM: scattered signals; the ones that carry intent line up and reach an order. ─────────── */
function signals(g, t) {
  const { C, R } = g
  const words = ['search', 'scroll', 'cart', 'hover', 'pay', 'idle', 'refill', 'bounce']
  const sieve = Math.round(C * 0.5)
  g.text(2, 1, 'SIGNALS', 0.5, 2); g.text(sieve - 3, 1, 'INTENT', 0.5, 2); g.text(C - 9, 1, 'ORDERS', 0.5, 2)
  for (let y = 3; y < R - 2; y++) g.cell(sieve, y, y % 2 ? '|' : ':', 0.4, 2)
  words.forEach((w, k) => {
    const ph = (t * 0.18 + k / words.length) % 1
    const y0 = 3 + ((k * 5) % (R - 6))
    const intent = k % 2 === 0
    let x = 2 + ph * (C - 18)
    let y = y0
    if (x > sieve) {
      if (!intent) { g.text(Math.round(sieve - w.length - 1), y0, w, 0.25, 2); return }
      const k2 = (x - sieve) / (C - 18 - sieve)
      y = Math.round(y0 + (Math.round(R / 2) - y0) * ease(k2 * 1.6))
    }
    g.text(Math.round(x), y, w, intent && x > sieve ? 1 : 0.7, intent && x > sieve ? 1 : 0)
  })
  const o = Math.floor(t * 1.4) % 4
  g.text(C - 9, Math.round(R / 2), ['[ ]', '[.]', '[o]', '[#]'][o] + ' +1', 1, 1)
}

/* ─────────── RevOps: one task handed from data to rule to action; every handoff has an owner and is stamped. ─────────── */
function handoff(g, t) {
  const { C, R } = g
  const lanes = [['DATA', 'event lands'], ['RULE', 'owner checks'], ['ACTION', 'fires, logged']]
  const T = cyc(t, 6)
  const lh = Math.floor((R - 4) / 3)
  lanes.forEach(([n, d], k) => {
    const y = 2 + k * lh
    g.text(2, y, n, 0.9, 0)
    g.text(2, y + 1, d, 0.45, 2)
    for (let x = 17; x < C - 3; x++) g.cell(x, y + 1, x % 2 ? '-' : ' ', 0.3, 2)
    const done = T > 1.2 + k * 1.4
    if (done) g.text(C - 10, y, '[ok]', 1, 1)
    else g.text(C - 10, y, '[  ]', 0.4, 2)
  })
  // the token moves along a lane, then drops to the next
  const k = Math.min(2, Math.floor(T / 1.4)), p = (T - k * 1.4) / 1.4
  const y = 2 + k * lh + 1
  const x = 17 + Math.min(1, p) * (C - 30)
  g.text(Math.round(x), y, '[#]', 1, 1)
  if (p > 0.9 && k < 2) for (let d = 1; d < lh; d++) g.cell(Math.round(x) + 1, y + d, '|', 0.6, 1)
  g.text(2, R - 1, `handoffs ${Math.min(3, Math.floor(T / 1.4) + (T > 1.2 ? 0 : 0))}/3  dropped 0`, 0.7, 0)
}

/* ─────────── ROQIVA: detect, draft, then a gate that only a person opens. ─────────── */
function gate(g, t) {
  const { C, R } = g
  const T = cyc(t, 8)
  const y = Math.round(R / 2)
  const gx = Math.round(C * 0.66)
  g.text(2, 1, 'DETECT', 0.5, 2); g.text(Math.round(C * 0.3), 1, 'DRAFT', 0.5, 2); g.text(gx - 2, 1, 'GATE', 0.5, 2); g.text(C - 6, 1, 'SHIP', 0.5, 2)
  // detector pulse
  const p = Math.floor(t * 3) % 3
  g.text(2, y, ['(.)', '(o)', '(O)'][p], 1, 1)
  // the draft being written
  const lines = ['spec: retry rule', 'test: holdout 10%', 'owner: payments']
  lines.forEach((l, k) => g.text(Math.round(C * 0.22), y - 2 + k * 2, type(l, (T - 0.4 - k * 0.6) * 22), 0.85, 0))
  // the gate: closed bars until approved
  const open = T > 4.2
  for (let d = -3; d <= 3; d++) {
    g.cell(gx, y + d, open && Math.abs(d) < 2 ? ' ' : '#', open ? 0.6 : 1, open ? 1 : 3)
  }
  g.text(gx - 4, y + 5, open ? 'APPROVED' : 'WAITING ', 1, open ? 1 : 3)
  g.text(gx - 4, y + 6, open ? 'by a person' : 'for a person', 0.5, 2)
  if (open) {
    const k = ease((T - 4.2) / 1.6)
    const x = Math.round(gx + 2 + k * (C - gx - 9))
    g.text(x, y, '[pack]', 1, 1)
  }
}

/* ─────────── Below the UI: the screen is the top layer; the system breaks lower down. ─────────── */
function layers(g, t) {
  const { C, R } = g
  const names = ['UI', 'LOGIC', 'DATA', 'OPS']
  const T = cyc(t, 7)
  const lh = Math.floor((R - 3) / names.length)
  const crack = 3
  names.forEach((n, k) => {
    const y = 1 + k * lh
    const peel = k === 0 ? ease((T - 1) / 1.2) : 0
    const b = k === 0 ? 1 - peel * 0.75 : 0.75
    g.text(2, y + 1, n, k === crack && T > 2.6 ? 1 : b, k === crack && T > 2.6 ? 1 : 0)
    for (let x = 10; x < C - 2; x++) {
      const ch = k === 0 ? '=' : k === 1 ? '-' : k === 2 ? ':' : '.'
      const broken = k === crack && T > 2.6 && Math.abs(x - C * 0.62) < 3 + Math.sin(t * 6) * 1
      g.cell(x, y + 1, broken ? (x % 2 ? '/' : '\\') : ch, broken ? 1 : b * 0.7, broken ? 1 : k === 0 ? 0 : 2)
    }
  })
  g.text(2, R - 1, T > 2.6 ? type('root cause: in the workflow, not the screen', (T - 2.6) * 26) : 'the screen looks fine', T > 2.6 ? 1 : 0.5, T > 2.6 ? 1 : 2)
}

/* ─────────── Compounding: each lap of the loop adds to the last; the curve bends upward. ─────────── */
function compound(g, t) {
  const { C, R } = g
  const T = cyc(t, 8)
  const x0 = 4, y0 = R - 3, w = C - 8, h = R - 6
  for (let x = x0; x < x0 + w; x++) g.cell(x, y0 + 1, '-', 0.35, 2)
  for (let y = y0 - h; y <= y0; y++) g.cell(x0 - 1, y, '|', 0.35, 2)
  const upto = Math.min(1, T / 5)
  for (let i = 0; i <= w * upto; i++) {
    const u = i / w
    const y = Math.round(y0 - (Math.pow(1.9, u * 4) - 1) / (Math.pow(1.9, 4) - 1) * h)
    g.cell(x0 + i, y, i >= w * upto - 1 ? '@' : '*', 0.9, i >= w * upto - 1 ? 1 : 0)
  }
  const laps = Math.floor(upto * 4)
  for (let l = 1; l <= laps; l++) { const x = x0 + Math.round(w * l / 4) - 1; g.text(x - 2, y0 + 2 > R - 1 ? R - 1 : y0 + 2, `L${l}`, 0.7, 2) }
  g.text(x0, 1, 'linear wins stop. loops compound.', 0.6, 2)
}

/* ─────────── Internal tools: an ops queue being worked, each row with an owner and an SLA. ─────────── */
function tools(g, t) {
  const { C, R } = g
  const rows = [['#1042', 'refund', 'ops'], ['#1043', 'substitute', 'wh'], ['#1044', 'reroute', 'cx'], ['#1045', 'cashback', 'fin'], ['#1046', 'return', 'ops']]
  g.text(2, 1, 'QUEUE        TASK         OWNER  SLA', 0.6, 2)
  for (let x = 2; x < C - 2; x++) g.cell(x, 2, '-', 0.3, 2)
  const sel = Math.floor(t * 0.8) % rows.length
  rows.forEach(([id, task, own], k) => {
    const y = 3 + k * 2
    if (y >= R - 1) return
    const done = k < sel
    const on = k === sel
    g.text(2, y, `${on ? '>' : ' '} ${id}  ${task.padEnd(12)} ${own.padEnd(6)} ${done ? 'met ' : on ? 'live' : '4h  '}`, on ? 1 : done ? 0.45 : 0.75, on ? 1 : done ? 2 : 0)
  })
}

/* ─────────── Orbit: a space colony turning, two beams trading fire across the dark. Abstract, no machines drawn. ─────────── */
function orbit(g, t) {
  const { C, R } = g
  for (let k = 0; k < 90; k++) { const x = (k * 37) % C, y = (k * 53) % R; g.cell(x, y, (k + Math.floor(t * 2)) % 9 ? '.' : '+', 0.3 + ((k * 7) % 5) / 10, 2) }
  // the colony: a long cylinder seen at an angle, rings turning
  const cx = Math.round(C * 0.3), cy = Math.round(R * 0.55)
  for (let i = -10; i <= 10; i++) for (let a = 0; a < Math.PI * 2; a += 0.35) {
    const x = cx + i * 1.4 + Math.cos(a + t * 0.8) * 1.2, y = cy - i * 0.35 + Math.sin(a + t * 0.8) * 2.4
    const front = Math.sin(a + t * 0.8) > 0
    g.cell(Math.round(x), Math.round(y), front ? '#' : ':', front ? 0.75 : 0.35, 0)
  }
  // two beams crossing the frame
  const T = t % 4
  const shots = [[C * 0.95, R * 0.15, C * 0.45, R * 0.7, 0], [C * 0.1, R * 0.2, C * 0.85, R * 0.8, 1.6]]
  shots.forEach(([x0, y0, x1, y1, at]) => {
    const p = (T - at) / 0.9
    if (p < 0 || p > 1.4) return
    for (let k = 0; k < 14; k++) {
      const q = Math.min(1, p) - k * 0.025
      if (q < 0 || q > 1) continue
      g.cell(Math.round(x0 + (x1 - x0) * q), Math.round(y0 + (y1 - y0) * q), k === 0 ? '*' : '-', 1 - k * 0.06, 1)
    }
    if (p >= 1 && p < 1.4) { const r = (p - 1) * 10; for (let a = 0; a < 6.28; a += 0.5) g.cell(Math.round(x1 + Math.cos(a) * r), Math.round(y1 + Math.sin(a) * r * 0.5), '+', 1 - (p - 1) * 2, 3) }
  })
  g.text(2, R - 2, `UC  ${String(Math.floor(t * 3) % 100).padStart(2, '0')}:${String(Math.floor(t * 41) % 60).padStart(2, '0')}  SIGNAL LOCK`, 0.6, 2)
}

/* ─────────── Chess: an endgame plays out; the last move is a checkmate. ─────────── */
function chess(g, t) {
  const { C, R } = g
  const T = t % 9
  const sq = Math.max(2, Math.min(Math.floor((C - 4) / 16), Math.floor((R - 3) / 8)))
  const cw = sq * 2, ox = Math.round((C - 8 * cw) / 2), oy = 1
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const dark = (r + c) % 2
    for (let dy = 0; dy < sq; dy++) for (let dx = 0; dx < cw; dx++) if (dark) g.cell(ox + c * cw + dx, oy + r * sq + dy, '.', 0.28, 2)
  }
  const at = (c, r, ch, b, tn) => g.cell(ox + c * cw + Math.floor(cw / 2), oy + r * sq + Math.floor(sq / 2), ch, b, tn)
  // pieces: white rook, white king, black king; the rook slides to give mate
  const moves = [[0, 6], [0, 1], [7, 1], [7, 0]]
  const step = Math.min(moves.length - 1, Math.floor(T / 1.6))
  const [rc, rr] = moves[step]
  at(5, 2, 'K', 0.95, 0) // white king
  at(rc, rr, 'R', 1, 1)
  at(5, 0, 'k', 0.9, 3) // black king
  if (T > 5.2) {
    for (let c = 0; c < 8; c++) at(c, 0, c === 5 ? 'k' : '=', c === 5 ? 1 : 0.5, 3)
    g.text(Math.round(C / 2) - 5, R - 1, type('CHECKMATE.', (T - 5.2) * 14), 1, 1)
  } else g.text(Math.round(C / 2) - 9, R - 1, `move ${step + 1}: rook to ${'abcdefgh'[rc]}${8 - rr}`, 0.6, 2)
}

const SCENES = { orbit, chess, find, decide, loop, signals, handoff, gate, layers, compound, tools }

export function AsciiCanvas({ scene = 'find', className, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return undefined
    const ctx = cv.getContext('2d')
    const fn = SCENES[scene]
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, C = 0, R = 0, cw = 7, ch = 12, dpr = 1, raf = 0, visible = false
    const t0 = performance.now()
    let col = ['#f2efe8', '#9baeff', '#7d7a70', '#f0b45a']
    let chars, bright, tone
    const size = () => {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width; H = r.height
      cw = W < 330 ? 6 : W > 520 ? 8 : 7; ch = Math.round(cw * 1.7)
      C = Math.max(20, Math.floor((W - 8) / cw)); R = Math.max(8, Math.floor((H - 6) / ch))
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `500 ${Math.round(ch * 0.78)}px "IBM Plex Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'
      const cs = getComputedStyle(cv)
      col = ['--ascii-ink', '--ascii-accent', '--ascii-dim', '--ascii-warn'].map((v, i) => cs.getPropertyValue(v).trim() || col[i])
      chars = new Array(C * R); bright = new Float32Array(C * R); tone = new Uint8Array(C * R)
    }
    const g = {
      get C() { return C }, get R() { return R },
      cell(x, y, c, b = 1, tn = 0) { if (x < 0 || y < 0 || x >= C || y >= R) return; const i = y * C + x; chars[i] = c; bright[i] = b; tone[i] = tn },
      text(x, y, s, b = 1, tn = 0) { for (let k = 0; k < s.length; k++) if (s[k] !== ' ') g.cell(x + k, y, s[k], b, tn) },
      dot(x, y, b, tn = 0) { g.cell(x, y, RAMP[Math.max(1, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))))], b, tn) },
    }
    const draw = (t) => {
      chars.fill(undefined); bright.fill(0); tone.fill(0)
      fn(g, t)
      ctx.clearRect(0, 0, W, H)
      const ox = (W - C * cw) / 2, oy = (H - R * ch) / 2
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
        const i = y * C + x
        if (!chars[i]) continue
        ctx.globalAlpha = Math.min(1, 0.2 + bright[i] * 0.85)
        ctx.fillStyle = col[tone[i]]
        ctx.fillText(chars[i], ox + x * cw, oy + y * ch)
      }
      ctx.globalAlpha = 1
    }
    const tick = (now) => { draw((now - t0) / 1000); if (visible) raf = requestAnimationFrame(tick) }
    size()
    draw(5.5)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !still) raf = requestAnimationFrame(tick)
    }, { threshold: 0.05 })
    io.observe(cv)
    const ro = new ResizeObserver(() => { size(); if (still || !visible) draw(5.5) })
    ro.observe(cv)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [scene])
  return <canvas ref={ref} className={className} role="img" aria-label={label} />
}
