/* ═══════════════════════════════════════════════════════════════════════════
   Game art as ASCII: one original motif per game, computed as a brightness field and printed with a
   character ramp. No logos, emblems or characters; each is a generic scene that hints at the game's world
   (waves, a ring in space, a crosshair, a searchlight over a skyline…). `t` (seconds) drifts the scene.
   ═══════════════════════════════════════════════════════════════════════════ */

const RAMP = ' .:-=+*#%@'
const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
const band = (d, w) => clamp(1 - Math.abs(d) / w) // 1 on the line, fading to 0 at distance w
const fill = (d, soft = 0.04) => clamp(0.5 - d / soft) // 1 inside (d < 0)

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15
const stars = (x, y, k = 0.985) => (hash(Math.floor(x * 40), Math.floor(y * 40)) > k ? 0.55 : 0)

/* Each scene: (x, y, t) → brightness 0..1, with x in [-1.6, 1.6] (aspect-corrected) and y in [-1, 1], y down. */
const SCENES = {
  'wuthering-waves': (x, y, t) => {
    let v = 0
    for (let k = 0; k < 6; k++) {
      const yy = -0.7 + k * 0.32
      const w = yy + 0.12 * Math.sin(x * (2.2 + k * 0.4) + t * (0.8 + k * 0.15) + k)
      v = Math.max(v, band(y - w, 0.07) * (0.45 + k * 0.1))
    }
    return v
  },
  halo: (x, y, t) => {
    const a = 0.35 * Math.sin(t * 0.2)
    const xr = x * Math.cos(a) - y * Math.sin(a), yr = x * Math.sin(a) + y * Math.cos(a)
    const r = Math.hypot(xr / 1.25, yr / 0.32)
    const ring = band(r - 1, 0.13) * (yr > 0 ? 1 : 0.6)
    const planet = fill(Math.hypot(x + 1.15, y - 0.62) - 0.26, 0.05) * (0.3 + 0.5 * clamp(0.5 - (x + 1.15) * 1.6))
    return Math.max(ring, planet, stars(x + 9, y + 3))
  },
  'god-of-war': (x, y, t) => {
    const handle = band(x + y * 0.55 - 0.05, 0.06) * (y > -0.55 && y < 0.95 ? 1 : 0)
    const c1 = Math.hypot(x - 0.45, y + 0.35) - 0.62, c2 = Math.hypot(x - 0.85, y + 0.35) - 0.55
    const blade = fill(Math.max(c1, -c2), 0.05) * (x > 0.05 ? 1 : 0)
    const edge = band(c1, 0.05) * (x > 0.3 ? 1 : 0)
    const snow = hash(Math.floor(x * 30), Math.floor((y - t * 0.15) * 22)) > 0.975 ? 0.4 : 0
    return Math.max(handle * 0.8, blade * 0.55, edge, snow)
  },
  'assassins-creed': (x, y, t) => {
    const col = Math.floor((x + 2) * 3.2), fx = ((x + 2) * 3.2) % 1
    const h = 0.25 + 0.35 * hash(col, 3)
    const roofTop = 1 - h - 0.18 * (1 - Math.abs(fx - 0.5) * 2)
    const house = y > roofTop ? (y > 1 - h ? 0.42 : 0.62) : 0
    const win = y > 1 - h + 0.1 && fx > 0.3 && fx < 0.45 && ((y * 6) % 1) > 0.5 ? 0.1 : -1
    const tx = Math.abs(x + 0.75)
    const tower = tx < 0.16 && y > -0.35 ? 0.55 : 0
    const spire = y <= -0.35 && y > -0.95 && tx < (y + 0.95) * 0.27 ? 0.75 : 0
    const sun = band(Math.hypot(x - 0.7, y + 0.2) - 0.55, 0.035) * 0.5 + fill(Math.hypot(x - 0.7, y + 0.2) - 0.5, 0.05) * 0.14
    const bx = ((x - t * 0.3) % 0.9 + 0.9) % 0.9 - 0.45, byy = y + 0.62 + 0.05 * Math.sin(x * 3)
    const bird = band(byy + Math.abs(bx) * 0.7, 0.035) * (Math.abs(bx) < 0.1 ? 1 : 0)
    const base = Math.max(house, tower, spire)
    return Math.max(win >= 0 && house ? win : base, sun, bird)
  },

  warframe: (x, y, t) => {
    const d = Math.hypot(x + 0.35, y + 0.05) - 0.7
    const shade = clamp(0.25 + (-(x + 0.35) - y * 0.6) * 0.6)
    const planet = fill(d, 0.05) * (0.25 + shade * 0.7)
    const orbit = band(Math.hypot((x + 0.35) / 1.45, (y + 0.05) / 0.42) - 1.15, 0.04) * (y > -0.05 || Math.hypot(x + 0.35, y + 0.05) > 0.72 ? 1 : 0)
    const sx = 1.0 + 0.08 * Math.sin(t), sy = -0.55
    const ship = fill(Math.abs(y - sy) * 2.4 + (x - sx) * 0.9 - 0.12, 0.05) * (x > sx - 0.3 ? 1 : 0)
    return Math.max(planet, orbit * 0.7, ship, stars(x + 2, y + 7))
  },
  'call-of-duty': (x, y, t) => {
    const r = Math.hypot(x, y)
    const ring = band(r - 0.72, 0.045)
    const gap = r > 0.18
    const cross = (band(x, 0.035) * (Math.abs(y) < 0.95 ? 1 : 0) + band(y, 0.05) * (Math.abs(x) < 1.0 ? 1 : 0)) * (gap ? 1 : 0)
    const dot = fill(r - 0.05, 0.03)
    const ticks = band(r - 0.45, 0.025) * (Math.abs(Math.atan2(y, x) % (Math.PI / 4)) < 0.05 ? 1 : 0)
    const terrain = y > 0.55 + 0.12 * Math.sin(x * 3 + 1) ? 0.18 + 0.12 * fbm(x * 3, y * 3) : 0
    return Math.max(ring, Math.min(1, cross), dot, ticks, terrain) * (0.85 + 0.15 * Math.sin(t * 2))
  },
  doom: (x, y, t) => {
    const n = fbm(x * 2.2, y * 2.4 + t * 1.4)
    const heat = clamp((y + 0.2) * 0.9 + 0.25)
    const fire = clamp(n * 1.35 * heat - 0.12 + heat * 0.35)
    const floor = y > 0.82 ? 0.7 : 0
    const pillars = (Math.abs(x + 1.15) < 0.1 || Math.abs(x - 1.15) < 0.1) && y > -0.6 ? 0.5 : 0
    return Math.max(fire, floor, pillars)
  },
  'ghost-of-tsushima': (x, y, t) => {
    let wind = 0
    for (let k = 0; k < 5; k++) {
      const yy = -0.8 + k * 0.38 + 0.08 * Math.sin(x * 1.5 + t * 0.7 + k)
      wind = Math.max(wind, band(y - yy, 0.035) * (0.2 + 0.45 * noise(x * 2 + t + k, k)))
    }
    const line = y - (-x * 0.42 + 0.15)
    const blade = band(line, 0.035) * (x > -1.25 && x < 0.85 ? 1 : 0)
    const hilt = band(line, 0.075) * (x > 0.95 && x < 1.35 ? 1 : 0)
    const guard = band(x - 0.9, 0.04) * (Math.abs(line) < 0.12 ? 1 : 0)
    const lx = x + t * 0.25, ly = y - t * 0.12
    const leaf = hash(Math.floor(lx * 28), Math.floor(ly * 11)) > 0.985 ? 0.75 : 0
    return Math.max(wind, blade, hilt * 0.7, guard, leaf)
  },

  'resident-evil': (x, y, t) => {
    const body = Math.abs(x) < 1.1 && y > -0.15 && y < 0.85
    const roof = y > -0.6 && y <= -0.15 && Math.abs(x) < 1.25 - (y + 0.6) * -0.0 - (-0.15 - y) * 1.6
    const wx = ((x + 1.1) * 5) % 1, wy = ((y + 0.15) * 4) % 1
    const win = body && wx > 0.35 && wx < 0.75 && wy > 0.25 && wy < 0.7
    const lit = win && hash(Math.floor((x + 1.1) * 5), Math.floor((y + 0.15) * 4)) > 0.7 + 0.2 * Math.sin(t)
    const moon = fill(Math.hypot(x - 1.25, y + 0.68) - 0.18, 0.05)
    let v = body || roof ? 0.42 : 0
    if (win) v = lit ? 0.95 : 0.08
    return Math.max(v, moon * 0.8, y > 0.85 ? 0.2 * fbm(x * 4, y * 4) : 0)
  },
  'silent-hill': (x, y, t) => {
    const fog = clamp(fbm(x * 1.4 + t * 0.12, y * 2.2) * 0.9 - 0.15 + (y + 1) * 0.12)
    const post = band(x - 0.6, 0.03) * (y > -0.55 ? 1 : 0)
    const lamp = fill(Math.hypot(x - 0.6, y + 0.6) - 0.07, 0.03)
    const glow = clamp(0.5 - Math.hypot(x - 0.6, y + 0.6) * 0.9) * 0.6
    const road = y > 0.7 ? 0.3 : 0
    return Math.max(fog * 0.7, post * 0.85, lamp, glow, road)
  },
  civilization: (x, y, t) => {
    const s = 0.26
    const hx = x / (s * 1.5)
    const cx = Math.round(hx)
    const hy = y / (s * 1.732) - (Math.abs(cx) % 2 ? 0.5 : 0)
    const cy = Math.round(hy)
    const dx = Math.abs(hx - cx), dy = Math.abs(hy - cy)
    const edge = Math.max(dx * 1.15 + dy * 0.55, dy) > 0.45
    const land = noise(cx * 0.55 + 3, cy * 0.7 + 1) > 0.45
    const city = hash(cx, cy) > 0.86 && land
    if (edge) return land ? 0.42 : 0.12
    if (city) return 0.92 + 0.08 * Math.sin(t + cx)
    return land ? (hash(cx * 3 + Math.floor(x * 20), Math.floor(y * 12)) > 0.7 ? 0.32 : 0.22) : 0
  },

  batman: (x, y, t) => {
    const col = Math.floor((x + 2) * 5)
    const h = 0.15 + 0.6 * hash(col, 7) ** 1.6
    const city = y > 1 - h ? 0.55 : 0
    const winLit = city && hash(col, Math.floor(y * 18)) > 0.82 && ((x + 2) * 5) % 1 > 0.4 ? 0.9 : 0
    const ang = -0.35 + 0.12 * Math.sin(t * 0.4)
    const bx = x + 0.4, by = y - 1
    const along = -(bx * Math.sin(ang) + by * Math.cos(ang))
    const across = bx * Math.cos(ang) - by * Math.sin(ang)
    const beam = along > 0 ? clamp(1 - Math.abs(across) / (0.06 + along * 0.14)) * (0.5 - along * 0.12) : 0
    const cloud = clamp(fbm(x * 1.5 + t * 0.05, y * 3) - 0.55) * (y < -0.2 ? 1.6 : 0)
    return Math.max(city, winLit, beam, cloud)
  },
  'spider-man': (x, y, t) => {
    const ox = x + 1.7, oy = y + 1.05
    const r = Math.hypot(ox, oy), a = Math.atan2(oy, ox)
    const sf = (a / (Math.PI / 2)) * 6
    const spoke = band(Math.abs(sf - Math.round(sf)) * r * (Math.PI / 2) / 6, 0.055)
    const rf = r * 1.7 - 0.12 * Math.abs(Math.sin(sf * Math.PI))
    const ring = band(Math.abs(rf - Math.round(rf)) / 1.7, 0.05)
    const web = Math.max(spoke, ring) * (r < 2.9 ? 0.85 : 0)
    const col = Math.floor((x + 2) * 4.5)
    const city = y > 0.25 + 0.5 * hash(col, 2) ? (hash(col, Math.floor(y * 16)) > 0.85 ? 0.7 : 0.28) : 0
    const sway = 0.06 * Math.sin(t * 0.9)
    const thread = band(x - 0.95 - sway * (y + 1), 0.025) * (y < 0.1 ? 0.8 : 0)
    const hang = fill(Math.hypot(x - 0.95 - sway * 1.1, y - 0.16) - 0.07, 0.03) * 0.9
    return Math.max(web, city, thread, hang)
  },

  'elden-ring': (x, y, t) => {
    const trunk = fill(Math.abs(x) - (0.06 + (y + 0.2) * 0.07), 0.04) * (y > -0.25 && y < 0.75 ? 1 : 0)
    const crown = Math.hypot(x / 1.35, (y + 0.45) / 0.6)
    const glow = clamp(1.1 - crown) * (0.55 + 0.25 * fbm(x * 3 + t * 0.2, y * 3))
    const branches = band(Math.sin(x * 9 + y * 4) * 0.5 - (y + 0.4) * 0.6, 0.06) * (crown < 1 ? 0.6 : 0)
    const ground = y > 0.75 ? 0.25 + 0.15 * noise(x * 6, 1) : 0
    const motes = hash(Math.floor(x * 25), Math.floor((y + t * 0.1) * 18)) > 0.993 ? 0.7 : 0
    return Math.max(trunk * 0.9, glow, branches, ground, motes)
  },
  'the-last-of-us': (x, y, t) => {
    const col = Math.floor((x + 2) * 3)
    const h = 0.35 + 0.45 * hash(col, 11)
    const top = 1 - h + 0.15 * (hash(col, 12) > 0.5 ? Math.max(0, (x + 2) * 3 % 1 - 0.5) : 0)
    const bldg = y > top ? 0.38 : 0
    const winHole = bldg && ((x + 2) * 9) % 1 > 0.55 && (y * 9) % 1 > 0.5 ? 0.08 : bldg
    const vine = y > top - 0.05 && fbm(x * 6, y * 5) > 0.62 ? 0.75 : 0
    const sun = fill(Math.hypot(x - 0.9, y + 0.55) - 0.25, 0.06) * 0.7
    const grass = y > 0.85 ? 0.35 + 0.3 * noise(x * 14 + Math.sin(t) * 0.3, y * 6) : 0
    return Math.max(winHole, vine, sun, grass)
  },
}

/** The scene for `slug` as `rows` lines of `cols` characters. */
export function asciiFor(slug, cols = 56, rows = 24, t = 0) {
  const f = SCENES[slug] || SCENES['wuthering-waves']
  const aspect = (cols * 0.6) / (rows * 1.15) // character cells are taller than wide
  let out = ''
  for (let j = 0; j < rows; j++) {
    const y = (j + 0.5) / rows * 2 - 1
    for (let i = 0; i < cols; i++) {
      const x = ((i + 0.5) / cols * 2 - 1) * aspect
      const v = clamp(f(x, y, t))
      out += RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))]
    }
    if (j < rows - 1) out += '\n'
  }
  return out
}

export const GAME_SLUGS = Object.keys(SCENES)
