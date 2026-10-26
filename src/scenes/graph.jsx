import { gsap } from '../lib/motion'

/* The node canvas: one coordinate space shared by HTML nodes (placed by percent) and one SVG (edges, arrowheads, packets).
   The two share a viewBox, so they always line up and the SVG never stretches.
   · Every part renders in its final state. Packets, rings and tallies are script-only and exist while the scene is live.
   · The same markup is the accessible list: `List` is read by screen readers always, and shown instead of the canvas on a narrow window. */

const FADE = new Set(['gap', 'spoke'])
export const pct = (v, of) => `${(v / of) * 100}%`

/** Anchor points on a node box {x, y, w, h}. */
export const at = (n, side, o = 0) => ({
  r: [n.x + n.w, n.y + n.h / 2 + o], l: [n.x, n.y + n.h / 2 + o], t: [n.x + n.w / 2 + o, n.y], b: [n.x + n.w / 2 + o, n.y + n.h],
}[side])

/** A polyline with rounded corners. Returns the path, the end point and the end angle (for the arrowhead). */
export function route(pts, r = 10) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [p0, p1, p2] = [pts[i - 1], pts[i], pts[i + 1]]
    const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    const rr = Math.min(r, l1 / 2, l2 / 2)
    const a = [p1[0] + ((p0[0] - p1[0]) / l1) * rr, p1[1] + ((p0[1] - p1[1]) / l1) * rr]
    const b = [p1[0] + ((p2[0] - p1[0]) / l2) * rr, p1[1] + ((p2[1] - p1[1]) / l2) * rr]
    d += `L${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${p1[0]} ${p1[1]} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`
  }
  const e = pts[pts.length - 1], p = pts[pts.length - 2]
  d += `L${e[0]} ${e[1]}`
  return { d, end: e, ang: Math.atan2(e[1] - p[1], e[0] - p[0]) }
}
/** A horizontal S-curve from a to b. */
export function bez(a, b) {
  const m = (a[0] + b[0]) / 2
  return { d: `M${a[0]} ${a[1]}C${m} ${a[1]} ${m} ${b[1]} ${b[0]} ${b[1]}`, end: b, ang: 0 }
}
const head = ({ end: [x, y], ang }, s = 7) => {
  const c = Math.cos(ang), n = Math.sin(ang)
  const p = (u, v) => `${(x + u * c - v * n).toFixed(1)} ${(y + u * n + v * c).toFixed(1)}`
  return `M${p(-s, -s * 0.6)}L${p(0, 0)}L${p(-s, s * 0.6)}`
}

/** `nodes`: {id, x, y, w, h, tone, children}. `edges`: {id, geo, state}. `packets`: ids. `svg`: extra SVG drawn under the nodes. */
export function Canvas({ w, h, nodes = [], edges = [], packets = [], svg, over, fit = 'default', fs = 1.15, className = '' }) {
  return (
    <div className={`gx ${className}`.trim()} style={{ aspectRatio: `${w} / ${h}`, '--fs': `${fs}cqi`, '--ar': (w / h).toFixed(4) }} data-k="gx" data-fit={fit} aria-hidden="true">
      <svg className="gx__svg" viewBox={`0 0 ${w} ${h}`}>
        {svg}
        {edges.map((e) => (
          <g key={e.id} className={`gx__eg gx__eg--${e.state || 'flow'}`}>
            <path className="gx__e" data-k={`e-${e.id}`} d={e.geo.d} pathLength={FADE.has(e.state) ? undefined : 1} />
            {!FADE.has(e.state) && <path className="gx__ah" data-k={`ah-${e.id}`} d={head(e.geo)} />}
          </g>
        ))}
        {packets.map((p) => (
          <g key={p.id} className={`gx__pk gx__pk--${p.tone || 'agent'}`} data-k={`pk-${p.id}`}>
            <g className="gx__pk-in"><circle r="9" className="gx__pk-halo" /><circle r="4.6" />{p.label && <text x="12" y="3.6">{p.label}</text>}</g>
          </g>
        ))}
      </svg>
      {nodes.map((n) => (
        <div key={n.id} className={`gx__n${n.tone ? ` gx__n--${n.tone}` : ''}${n.cls ? ` ${n.cls}` : ''}`} data-k={`n-${n.id}`}
          style={{ left: pct(n.x, w), top: pct(n.y, h), width: pct(n.w, w), height: pct(n.h, h) }}>
          {n.children}
          <i className="gx__hl" />
        </div>
      ))}
      {over}
    </div>
  )
}

/** A node's text: a small label, a title and an optional line. */
export const NodeText = ({ k, t, d, icon }) => (
  <>
    {k && <span className="gx__k">{icon}{k}</span>}
    <b className="gx__t">{t}</b>
    {d && <span className="gx__d">{d}</span>}
  </>
)

/** The strip under the canvas: a tally that steps through states, and a key. The last state shows without script. */
export function Readout({ k, items, legend, col = false, dup = false }) {
  return (
    <div className={`gx__bar${dup ? ' gx__bar--dup' : ''}`}>
      <span className="gx__tally">{items.map((t, i) => <span key={i} data-k={`${k}-${i}`} aria-hidden={i < items.length - 1 ? 'true' : undefined}>{t}</span>)}</span>
      {legend && <span className={`gx__key${col ? ' gx__key--col' : ''}`}>{legend}</span>}
    </div>
  )
}

/** The canvas as a list: always in the DOM for assistive tech, and shown instead of the canvas on a narrow window. */
export const List = ({ items, label }) => (
  <ol className="gx__list" aria-label={label}>
    {items.map((it) => <li key={it.t}><b>{it.t}</b>{it.k && <span className="label">{it.k}</span>}{it.d && <span>{it.d}</span>}</li>)}
  </ol>
)

/* ───────── Script moves ───────── */

/** Hide the parts a script reveals. Edges are drawn with their dash offset, so they also need a dash. */
export function prep(d, { nodes = [], edges = [], packets = [] }) {
  d.hide(nodes.map((n) => d.$(`n-${n}`)), { y: 10, scale: 0.97 })
  d.hide(Array.from(d.root.querySelectorAll('.gx__hl')))
  edges.forEach(([id, state]) => {
    const e = d.$(`e-${id}`), a = d.$(`ah-${id}`)
    if (FADE.has(state)) d.hide(e)
    else { d.hide(e); d.init(e, { strokeDasharray: 1, strokeDashoffset: 1 }); a && d.hide(a, { scale: 0.6, transformOrigin: '50% 50%' }) }
  })
  d.hide(packets.map((p) => d.$(`pk-${p}`)))
}

export const nodeIn = (d, id, t, o = {}) => d.show(d.$(`n-${id}`), t, { dur: 0.45, ease: 'eSpring', ...o })

/** Draw an edge from its start to its end, then land the arrowhead. */
export function edgeIn(d, id, t, dur = 0.55) {
  const e = d.$(`e-${id}`), a = d.$(`ah-${id}`)
  d.tl.set(e, { autoAlpha: 1 }, t)
  d.tl.fromTo(e, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', immediateRender: false }, t)
  if (a) d.tl.to(a, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'eSpring' }, t + dur - 0.08)
  return d.at(() => {}, t + dur)
}
/** A dashed edge cannot be drawn with an offset, so it is revealed while a packet travels along it. */
export const edgeFade = (d, id, t, dur = 0.4) => d.show(d.$(`e-${id}`), t, { dur, ease: 'none' })

/** Send a packet along an edge. It fades at the end unless `keep`. */
export function packet(d, pk, edge, t, dur, { from = 0, to = 1, keep = false, ease = 'power1.inOut' } = {}) {
  const g = d.$(`pk-${pk}`), path = d.$(`e-${edge}`)
  if (!g || !path) return t
  const inner = g.querySelector('.gx__pk-in')
  const o = { p: from }
  const place = () => { const L = path.getTotalLength(); const pt = path.getPointAtLength(o.p * L); inner.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`) }
  place()
  d.tl.call(place, null, t)
  d.tl.to(g, { autoAlpha: 1, duration: 0.12 }, t)
  d.tl.to(o, { p: to, duration: dur, ease, onUpdate: place }, t)
  if (!keep) d.tl.to(g, { autoAlpha: 0, duration: 0.2 }, t + dur)
  return d.at(() => {}, t + dur + (keep ? 0 : 0.2))
}

/** A ring that flashes round a node: "this is being looked at". */
export function ping(d, id, t, { dur = 0.7 } = {}) {
  const h = d.$(`n-${id}`)?.querySelector('.gx__hl')
  if (!h) return t
  d.tl.fromTo(h, { autoAlpha: 0.95, scale: 0.985 }, { autoAlpha: 0, scale: 1.06, duration: dur, ease: 'power2.out', immediateRender: false }, t)
  return d.at(() => {}, t + dur)
}
/** A node that stays marked: a steady ring. */
export function mark(d, id, t, on = true) {
  const h = d.$(`n-${id}`)?.querySelector('.gx__hl')
  if (!h) return t
  d.tl.to(h, { autoAlpha: on ? 1 : 0, scale: 1, duration: 0.3 }, t)
  return d.at(() => {}, t + 0.3)
}

/** Step a tally through its states at the given times. `times[i]` is when state i+1 replaces state i. */
export function tally(d, k, n, times) {
  // A narrow window shows the list instead of the canvas: leave the tally on its final state.
  const gx = d.$('gx')
  if (gx && !gx.offsetWidth) return 0
  const items = Array.from({ length: n }, (_, i) => d.$(`${k}-${i}`))
  d.hide(items.slice(1)); d.init(items[0], { autoAlpha: 1 })
  times.forEach((t, i) => { d.tl.to(items[i], { autoAlpha: 0, duration: 0.18 }, t).to(items[i + 1], { autoAlpha: 1, duration: 0.18 }, t) })
  return times.length ? times[times.length - 1] + 0.2 : 0
}

export { gsap }
