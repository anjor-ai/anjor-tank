import { home, parts, signalLog } from '../content'
import { Icon } from '../components/icons'
import { Actor } from '../components/ui'
import { Cur, Scene } from './engine'
import { Canvas, List, NodeText, Readout, at, bez, edgeFade, edgeIn, mark, nodeIn, packet, ping, prep, route, tally } from './graph'

/* Live diagrams: signal map, system map, Track A lanes, Track B stack, Track C boundary and the Home gap.
   Same window system as the other scenes. Every count and label comes from the content, never typed here. */

const Dot = ({ tone }) => <i className={`gx__sw gx__sw--${tone}`} aria-hidden="true" />
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/* ═══════════ Signal map: each captured signal → the decision that reads it ═══════════ */
const DEC = [...new Set(signalLog.lines.map((l) => l.to))]
const LINES = [...signalLog.lines].sort((a, b) => DEC.indexOf(a.to) - DEC.indexOf(b.to))
const SW = 1000, SH = 440
const srcBox = (i) => ({ x: 20, y: 20 + i * 70, w: 310, h: 50 })
const decBox = (i) => ({ x: 690, y: 20 + i * 86, w: 290, h: 56 })
const decOk = DEC.map((d) => LINES.some((l) => l.to === d && l.state === 'ok'))
const sigEdges = LINES.map((l, i) => {
  const a = at(srcBox(i), 'r'), b = at(decBox(DEC.indexOf(l.to)), 'l')
  if (l.state === 'ok') return { id: `e${i}`, state: 'ok', geo: bez(a, b) }
  const brk = [a[0] + (b[0] - a[0]) * 0.52, a[1] + (b[1] - a[1]) * 0.4]
  return { id: `e${i}`, state: 'gap', geo: bez(a, brk), brk }
})
const counts = (n) => {
  const r = LINES.slice(0, n).filter((l) => l.state === 'ok').length
  return { read: r, gap: n - r }
}

function buildSignals(d) {
  const cur = d.cur('det')
  const N = LINES.length
  prep(d, {
    nodes: [...LINES.map((_, i) => `s${i}`), ...DEC.map((_, i) => `d${i}`)],
    edges: sigEdges.map((e) => [e.id, e.state]), packets: ['p'],
  })
  d.hide(Array.from(d.root.querySelectorAll('.gx__brk-in')), { scale: 0.3, transformOrigin: '50% 50%' })
  LINES.forEach((_, i) => nodeIn(d, `s${i}`, 0.2 + i * 0.09))
  DEC.forEach((_, i) => nodeIn(d, `d${i}`, 0.35 + i * 0.1))
  let t = 1.3
  const times = []
  LINES.forEach((l, i) => {
    const src = d.$(`n-s${i}`)
    t = i === 0 ? cur.at(src, t, { fx: 0.9, fy: 0.5, dx: 30, dy: 12 }) : cur.to(src, t, { fx: 0.9, fy: 0.5, dx: 30, dy: 12, dur: 0.4 })
    ping(d, `s${i}`, t, { dur: 0.55 })
    if (l.state === 'ok') {
      edgeIn(d, `e${i}`, t, 0.5)
      packet(d, 'p', `e${i}`, t, 0.5)
      ping(d, `d${DEC.indexOf(l.to)}`, t + 0.5, { dur: 0.6 })
    } else {
      edgeFade(d, `e${i}`, t, 0.5)
      packet(d, 'p', `e${i}`, t, 0.5, { ease: 'power1.out' })
      d.tl.to(d.$(`brk-${i}`), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'eSpring' }, t + 0.5)
    }
    times.push(t + 0.55)
    t += 0.85
  })
  cur.hide(t)
  tally(d, 'sig', N + 1, times)
  d.at(() => {}, t + 0.3)
}

export function SignalMapScene(props) {
  const N = LINES.length
  const items = Array.from({ length: N + 1 }, (_, n) => { const c = counts(n); return `${n} of ${N} matched · ${c.read} read · ${plural(c.gap, 'gap', 'gaps')}` })
  const nodes = [
    ...LINES.map((l, i) => ({ id: `s${i}`, ...srcBox(i), cls: `gx__n--src is-${l.state}`, children: <><span className="gx__k">{l.from}</span><code className="gx__t gx__t--mono">{l.sig}</code></> })),
    ...DEC.map((x, i) => ({ id: `d${i}`, ...decBox(i), cls: `gx__n--dec${decOk[i] ? '' : ' is-blind'}`, children: <><span className="gx__k">{decOk[i] ? 'Decision' : 'Decision · reads none of these'}</span><b className="gx__t">{x}</b></> })),
  ]
  const svg = sigEdges.filter((e) => e.brk).map((e) => (
    <g key={e.id} transform={`translate(${e.brk[0]} ${e.brk[1]})`}><g className="gx__brk-in" data-k={`brk-${e.id.slice(1)}`}><circle r="9" /><path d="M-3.4 -3.4L3.4 3.4M3.4 -3.4L-3.4 3.4" /></g></g>
  ))
  return (
    <Scene id="signal-map" title="Signal map" crumbs={['WI-014', 'Detectors', 'Signal map']} className="app--gx" build={buildSignals} speed={1.2} {...props}>
      <Canvas w={SW} h={SH} nodes={nodes} edges={sigEdges} packets={[{ id: 'p', tone: 'code' }]} svg={svg} />
      <List label="Signals and the decisions that read them" items={LINES.map((l) => ({ t: l.sig, k: l.from, d: l.state === 'ok' ? `Read by ${l.to}.` : `Captured, never read by ${l.to}.` }))} />
      <Readout k="sig" items={items} legend={<><span><Dot tone="ok" />Read by a decision</span><span><Dot tone="gap" />Captured, never read</span></>} />
      <Cur id="det" name="Detectors" tone="code" />
    </Scene>
  )
}

/* ═══════════ System map: the Brain at the centre of the ring that carries one work item ═══════════ */
const MW = 1100, MH = 600
const POS = {
  brain: { x: 550, y: 300, w: 330, h: 150 },
  detectors: { x: 165, y: 112 }, orchestrator: { x: 550, y: 66 }, drafting: { x: 935, y: 112 },
  people: { x: 935, y: 488 }, tools: { x: 550, y: 534 }, monitor: { x: 165, y: 488 },
}
// What each part does, in a few words taken from its description in the content.
const SUB = {
  detectors: ['Match', 'Judge', 'Rank'], orchestrator: ['Work items', 'Parallel runs', 'Gates', 'Conflict lock'],
  drafting: ['Research', 'Architect', 'Product', 'Design', 'QA'], people: ['4 gates', '1 outcome review'],
  tools: ['Source of truth', 'Never written to'], monitor: ['Spec check', 'Unplanned changes', 'Baseline'],
}
const RING = ['detectors', 'orchestrator', 'drafting', 'people', 'tools', 'monitor']
const PART = Object.fromEntries(parts.items.map((p) => [p.id, p]))
const brainHolds = PART.brain.d.split(': ')[1].replace(/\..*$/, '').split(', ')
const ICON = { brain: 'brain', detectors: 'radar', orchestrator: 'branch', drafting: 'agent', monitor: 'chart', people: 'person', tools: 'layers' }
const ACTOR = { detectors: 'code', orchestrator: 'code', drafting: 'agent', monitor: 'code', people: 'person' }
const TONE = { brain: 'brain', detectors: 'code', orchestrator: 'code', drafting: 'agent', monitor: 'code', people: 'person', tools: 'ext' }
const box = (id) => { const p = POS[id], w = p.w || 262, h = p.h || 98; return { x: p.x - w / 2, y: p.y - h / 2, w, h } }
/** Where a line from node a to node b leaves a's box, pushed out by `gap`. */
function leave(a, b, gap = 9) {
  const A = POS[a], B = POS[b], { w, h } = box(a)
  const dx = B.x - A.x, dy = B.y - A.y
  const t = Math.min(dx ? (w / 2 + gap) / Math.abs(dx) : Infinity, dy ? (h / 2 + gap) / Math.abs(dy) : Infinity)
  return [A.x + dx * t, A.y + dy * t]
}
const seg = (a, b) => ({ d: `M${leave(a, b).map((v) => v.toFixed(1)).join(' ')}L${leave(b, a).map((v) => v.toFixed(1)).join(' ')}`, end: leave(b, a), ang: Math.atan2(POS[b].y - POS[a].y, POS[b].x - POS[a].x) })
const ringEdges = RING.map((id, i) => ({ id: `r${i}`, state: 'flow', geo: seg(id, RING[(i + 1) % RING.length]) }))
const spokes = RING.map((id, i) => ({ id: `k${i}`, state: 'spoke', geo: seg(id, 'brain') }))

function buildSystem(d) {
  const cur = d.cur('pm')
  const ids = ['brain', ...RING]
  prep(d, { nodes: ids, edges: [...ringEdges, ...spokes].map((e) => [e.id, e.state]), packets: ['wi', 'sp'] })
  nodeIn(d, 'brain', 0.3)
  RING.forEach((id, i) => nodeIn(d, id, 0.8 + i * 0.14))
  spokes.forEach((e, i) => edgeFade(d, e.id, 1.5 + i * 0.08, 0.5))
  ringEdges.forEach((e, i) => edgeIn(d, e.id, 1.9 + i * 0.1, 0.5))
  let t = 2.8
  const times = []
  cur.at(d.$('n-brain'), t, { fx: 0.5, fy: 0.5, dx: 90, dy: 30 })
  t += 0.4
  RING.forEach((id, i) => {
    const node = d.$(`n-${id}`)
    t = cur.to(node, t, { fx: 0.5, fy: 0.55, dx: 40, dy: 14, dur: 0.6 })
    cur.click(t)
    times.push(t)
    ping(d, id, t, { dur: 0.7 })
    // read and write the Brain: out along the spoke and back
    packet(d, 'sp', `k${i}`, t + 0.1, 0.42, { keep: true, ease: 'power1.inOut' })
    packet(d, 'sp', `k${i}`, t + 0.55, 0.42, { from: 1, to: 0, ease: 'power1.inOut' })
    ping(d, 'brain', t + 0.5, { dur: 0.5 })
    // the work item moves on round the ring
    packet(d, 'wi', `r${i}`, t + 1.05, 0.8, { ease: 'power1.inOut' })
    t += 1.0
    if (i < RING.length - 1) t += 0.7
  })
  t += 0.9
  t = cur.to(d.$('n-brain'), t, { fx: 0.5, fy: 0.5, dx: 90, dy: 30, dur: 0.7 })
  times.push(t)
  ping(d, 'brain', t, { dur: 0.8 })
  cur.hide(t + 0.5)
  tally(d, 'sys', ids.length + 1, times)
  d.at(() => {}, t + 0.8)
}

export function SystemMapScene(props) {
  const order = [...RING.map((id) => id), 'brain']
  const detail = (id) => {
    const p = PART[id]
    return <><Icon name={ICON[id]} size={16} /><strong>{p.name}</strong>{ACTOR[id] && <Actor kind={ACTOR[id]} />}<span>{p.d}</span></>
  }
  const nodes = ['brain', ...RING].map((id) => ({
    id, ...box(id), tone: TONE[id], cls: id === 'brain' ? 'gx__n--hub' : '',
    children: <><span className="gx__k"><Icon name={ICON[id]} size={13} />{PART[id].kind}</span><b className={`gx__t${id === 'brain' ? ' gx__t--lg' : ''}`}>{PART[id].name}</b>
      <span className="gx__chips">{(id === 'brain' ? brainHolds : SUB[id]).map((c) => <span key={c} className="gx__chip">{c[0].toUpperCase() + c.slice(1)}</span>)}</span></>,
  }))
  const svg = <><circle className="gx__orbit" cx={POS.brain.x} cy={POS.brain.y} r="230" /><circle className="gx__orbit gx__orbit--in" cx={POS.brain.x} cy={POS.brain.y} r="196" /></>
  return (
    <Scene id="system-map" title="System map" crumbs={['Platform', 'System map']} className="app--gx" build={buildSystem} speed={1.25} {...props}>
      <Canvas w={MW} h={MH} nodes={nodes} edges={[...spokes, ...ringEdges]} packets={[{ id: 'wi', tone: 'accent', label: 'WI-014' }, { id: 'sp', tone: 'brain' }]} svg={svg} fs={1.1} />
      <List label="The parts of the system" items={parts.items.map((p) => ({ t: p.name, k: p.kind, d: p.d }))} />
      <Readout k="sys" col dup items={['brain', ...order].map((id) => <span className="gx__detail">{detail(id)}</span>)}
        legend={<><span><Dot tone="flow" />One work item travels the ring</span><span><Dot tone="spoke" />Every part reads and writes the Brain</span></>} />
      <Cur id="pm" name="Your PM" tone="person" />
    </Scene>
  )
}

/* ═══════════ Home: the signal that never reaches the decision that should read it ═══════════ */
const GW = 560, GH = 440
const G = home.problem.diagram
const gN = { from: { x: 30, y: 24, w: 500, h: 112 }, brk: { x: 190, y: 190, w: 180, h: 64 }, to: { x: 30, y: 308, w: 500, h: 112 } }
const gA = { id: 'a', state: 'ok', geo: route([[280, 136], [280, 186]]) }
const gB = { id: 'b', state: 'gap', geo: route([[280, 258], [280, 304]]) }

function buildGap(d) {
  const cur = d.cur('det')
  prep(d, { nodes: ['from', 'brk', 'to'], edges: [gA, gB].map((e) => [e.id, e.state]), packets: ['p'] })
  nodeIn(d, 'from', 0.3); nodeIn(d, 'to', 0.5); nodeIn(d, 'brk', 0.9)
  let t = 1.5
  cur.at(d.$('n-from'), t, { fx: 0.8, fy: 0.5, dx: 30, dy: 16 })
  const times = [t + 0.3]
  ;[0, 1].forEach((i) => {
    const s = t + 0.5 + i * 1.3
    edgeIn(d, 'a', s, 0.5)
    packet(d, 'p', 'a', s, 0.5, { keep: true, ease: 'power1.in' })
    d.tl.fromTo(d.$('n-brk'), { scale: 1 }, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, s + 0.5)
    d.tl.to(d.$('pk-p'), { autoAlpha: 0, duration: 0.2 }, s + 0.6)
  })
  t += 3.3
  cur.to(d.$('n-brk'), t - 0.5, { fx: 0.6, fy: 0.5, dx: 40, dy: 20, dur: 0.6 })
  edgeFade(d, 'b', t, 0.4)
  cur.to(d.$('n-to'), t + 0.4, { fx: 0.8, fy: 0.5, dx: 30, dy: 16, dur: 0.7 })
  mark(d, 'to', t + 1.0)
  times.push(t - 0.4, t + 1.1)
  cur.hide(t + 1.6)
  tally(d, 'gp', 3, times.slice(1))
  d.at(() => {}, t + 2)
}

export function GapScene(props) {
  const nodes = [
    { id: 'from', ...gN.from, tone: 'agent', children: <><span className="gx__k">{G.from.k}</span><b className="gx__t gx__t--lg">{G.from.t}</b><span className="gx__d">{G.from.d}</span></> },
    { id: 'brk', ...gN.brk, cls: 'gx__n--break', children: <><span className="gx__k"><Icon name="x" size={12} />{G.gap}</span></> },
    { id: 'to', ...gN.to, tone: 'person', cls: 'is-blind', children: <><span className="gx__k">{G.to.k}</span><b className="gx__t gx__t--lg">{G.to.t}</b><span className="gx__d">{G.to.d}</span></> },
  ]
  const items = [`${G.from.t} records a failure code on every attempt.`, `${G.gap} between ${G.from.t} and the ${G.to.t}.`, G.loss]
  return (
    <Scene id="gap" title="Signal to decision" crumbs={['Signal to decision']} className="app--gx" build={buildGap} speed={1.15} {...props}>
      <Canvas w={GW} h={GH} nodes={nodes} edges={[gA, gB]} packets={[{ id: 'p', tone: 'amber', label: 'failure code' }]} fit="any" fs={2.3} />
      <List label="The signal and the decision that never reads it" items={[{ t: G.from.t, k: G.from.k, d: G.from.d }, { t: G.gap }, { t: G.to.t, k: G.to.k, d: G.to.d }]} />
      <Readout k="gp" items={items} />
      <Cur id="det" name="Detectors" tone="code" />
    </Scene>
  )
}
