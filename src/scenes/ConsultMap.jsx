import { Icon } from '../components/icons'
import { Cur, Scene } from './engine'
import { Canvas, List, Readout, edgeFade, edgeIn, nodeIn, packet, ping, prep, tally } from './graph'

const Dot = ({ tone }) => <i className={`gx__sw gx__sw--${tone}`} aria-hidden="true" />

/* ═══════════ Consulting map: the decision layer at the centre; one leak travels from your tools to a measured result ═══════════ */
const CW = 1100, CH = 600
const CPOS = {
  hub: { x: 550, y: 300, w: 330, h: 150 },
  tools: { x: 165, y: 112 }, identity: { x: 550, y: 66 }, detect: { x: 935, y: 112 },
  approve: { x: 935, y: 488 }, act: { x: 550, y: 534 }, measure: { x: 165, y: 488 },
}
const CRING = ['tools', 'identity', 'detect', 'approve', 'act', 'measure']
const CNODE = {
  hub: { kind: 'The system I build', name: 'Decision layer', icon: 'branch', tone: 'brain', chips: ['Rules', 'Suppression', 'Holdout', 'Owners'], d: 'Holds the rules, who owns each one, what to stay quiet on and the group held back to prove the lift.' },
  tools: { kind: 'Your stack', name: 'Your tools', icon: 'layers', tone: 'ext', chips: ['Store', 'Payments', 'CRM', 'Analytics'], d: 'Orders, gateway events, journeys and sessions, read where they already live. Nothing replaced.' },
  identity: { kind: 'Code', name: 'Identity', icon: 'link', tone: 'code', chips: ['One customer', 'One record'], d: 'Every event resolves to one customer, so the decision sees the whole journey, not one tool’s slice.' },
  detect: { kind: 'Code', name: 'Detectors', icon: 'radar', tone: 'code', chips: ['Payment failure', 'Reorder window', 'No-result search'], d: 'Each detector checks one leak against the rules and ranks it by what it costs.' },
  approve: { kind: 'Humans', name: 'Approval', icon: 'person', tone: 'person', chips: ['A person signs off', 'Guardrails'], d: 'Nothing that changes the business ships without a named owner approving it.' },
  act: { kind: 'Actions', name: 'The fix', icon: 'bolt', tone: 'agent', chips: ['Retry or reroute', 'Timed reminder', 'Ops queue'], d: 'The action fires on the channel the customer replies on, with a fallback to a person.' },
  measure: { kind: 'Code', name: 'Measure', icon: 'target', tone: 'code', chips: ['Treated', 'Held back', 'Lift'], d: 'The treated group is read against the held-back group. The result becomes evidence for the next rule.' },
}
const cbox = (id) => { const p = CPOS[id], w = p.w || 262, h = p.h || 98; return { x: p.x - w / 2, y: p.y - h / 2, w, h } }
function cleave(a, b, gap = 9) {
  const A = CPOS[a], B = CPOS[b], { w, h } = cbox(a)
  const dx = B.x - A.x, dy = B.y - A.y
  const t = Math.min(dx ? (w / 2 + gap) / Math.abs(dx) : Infinity, dy ? (h / 2 + gap) / Math.abs(dy) : Infinity)
  return [A.x + dx * t, A.y + dy * t]
}
const cseg = (a, b) => ({ d: `M${cleave(a, b).map((v) => v.toFixed(1)).join(' ')}L${cleave(b, a).map((v) => v.toFixed(1)).join(' ')}`, end: cleave(b, a), ang: Math.atan2(CPOS[b].y - CPOS[a].y, CPOS[b].x - CPOS[a].x) })
const cRing = CRING.map((id, i) => ({ id: `cr${i}`, state: 'flow', geo: cseg(id, CRING[(i + 1) % CRING.length]) }))
const cSpokes = CRING.map((id, i) => ({ id: `ck${i}`, state: 'spoke', geo: cseg(id, 'hub') }))

function buildConsult(d) {
  const cur = d.cur('at')
  const ids = ['hub', ...CRING]
  prep(d, { nodes: ids, edges: [...cRing, ...cSpokes].map((e) => [e.id, e.state]), packets: ['lk', 'sp'] })
  nodeIn(d, 'hub', 0.3)
  CRING.forEach((id, i) => nodeIn(d, id, 0.7 + i * 0.12))
  cSpokes.forEach((e, i) => edgeFade(d, e.id, 1.4 + i * 0.08, 0.5))
  cRing.forEach((e, i) => edgeIn(d, e.id, 1.8 + i * 0.1, 0.5))
  let t = 2.7
  const times = []
  cur.at(d.$('n-hub'), t, { fx: 0.5, fy: 0.5, dx: 90, dy: 30 })
  t += 0.4
  CRING.forEach((id, i) => {
    t = cur.to(d.$(`n-${id}`), t, { fx: 0.5, fy: 0.55, dx: 40, dy: 14, dur: 0.6 })
    cur.click(t)
    times.push(t)
    ping(d, id, t, { dur: 0.7 })
    packet(d, 'sp', `ck${i}`, t + 0.1, 0.42, { keep: true, ease: 'power1.inOut' })
    packet(d, 'sp', `ck${i}`, t + 0.55, 0.42, { from: 1, to: 0, ease: 'power1.inOut' })
    ping(d, 'hub', t + 0.5, { dur: 0.5 })
    packet(d, 'lk', `cr${i}`, t + 1.05, 0.8, { ease: 'power1.inOut' })
    t += 1.0
    if (i < CRING.length - 1) t += 0.7
  })
  t += 0.9
  t = cur.to(d.$('n-hub'), t, { fx: 0.5, fy: 0.5, dx: 90, dy: 30, dur: 0.7 })
  times.push(t)
  ping(d, 'hub', t, { dur: 0.8 })
  cur.hide(t + 0.5)
  tally(d, 'cm', ids.length + 1, times)
  d.at(() => {}, t + 0.8)
}

export function ConsultMapScene(props) {
  const ids = ['hub', ...CRING]
  const nodes = ids.map((id) => {
    const n = CNODE[id]
    return {
      id, ...cbox(id), tone: n.tone, cls: id === 'hub' ? 'gx__n--hub' : '',
      children: <><span className="gx__k"><Icon name={n.icon} size={13} />{n.kind}</span><b className={`gx__t${id === 'hub' ? ' gx__t--lg' : ''}`}>{n.name}</b>
        <span className="gx__chips">{n.chips.map((c) => <span key={c} className="gx__chip">{c}</span>)}</span></>,
    }
  })
  const detail = (id) => { const n = CNODE[id]; return <><Icon name={n.icon} size={16} /><strong>{n.name}</strong><span>{n.d}</span></> }
  const svg = <><circle className="gx__orbit" cx={CPOS.hub.x} cy={CPOS.hub.y} r="230" /><circle className="gx__orbit gx__orbit--in" cx={CPOS.hub.x} cy={CPOS.hub.y} r="196" /></>
  return (
    <Scene id="consult-map" title="System map" crumbs={['Consulting', 'One leak, end to end']} className="app--gx" build={buildConsult} speed={1.25} {...props}>
      <Canvas w={CW} h={CH} nodes={nodes} edges={[...cSpokes, ...cRing]} packets={[{ id: 'lk', tone: 'accent', label: 'leak' }, { id: 'sp', tone: 'brain' }]} svg={svg} fs={1.32} />
      <List label="The parts of the system" items={ids.map((id) => ({ t: CNODE[id].name, k: CNODE[id].kind, d: CNODE[id].d }))} />
      <Readout k="cm" col dup items={['hub', ...CRING, 'hub'].map((id) => <span className="gx__detail">{detail(id)}</span>)}
        legend={<><span><Dot tone="flow" />One leak travels the loop</span><span><Dot tone="spoke" />Every step reads and writes the decision layer</span></>} />
      <Cur id="at" name="Anjor" tone="person" />
    </Scene>
  )
}
