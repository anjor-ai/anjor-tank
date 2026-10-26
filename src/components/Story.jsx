import { useEffect, useRef, useState } from 'react'
import { ALT, LOVES, PHOTOS, gtm } from '../content'
import { MQ } from '../lib/motion'
import { Icon } from './icons'

/* Story.jsx: the illustrated pieces behind the heroes and the long pages (home opener, method circuit, page stages,
   journey tickets, beyond scenes, hire illustrations). Everything here is drawn with CSS and inline SVG from the site tokens,
   so it follows the theme. Illustrations are labelled as illustrations; no number here is invented. */

const motionOK = () => typeof window !== 'undefined' && window.matchMedia(MQ.motion).matches

export function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setOn(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

export const Dots = () => <span className="stg__dots" aria-hidden="true"><i /><i /><i /></span>

/* ───────────── Home: HELLO that flickers through languages ───────────── */
const HI = [['Hello', 'English'], ['नमस्ते', 'Hindi'], ['હેલો', 'Gujarati'], ['Hola', 'Spanish'], ['Bonjour', 'French'], ['こんにちは', 'Japanese'], ['Ciao', 'Italian'], ['안녕하세요', 'Korean'], ['مرحبا', 'Arabic'], ['Olá', 'Portuguese']]
export function HelloFlicker({ words = HI, label = 'Hello' }) {
  const [i, setI] = useState(0)
  const [fl, setFl] = useState(false)
  useEffect(() => {
    if (!motionOK()) return
    let a, b
    const id = setInterval(() => {
      setFl(true)
      a = setTimeout(() => setI((x) => (x + 1) % words.length), 160)
      b = setTimeout(() => setFl(false), 560)
    }, 2300)
    return () => { clearInterval(id); clearTimeout(a); clearTimeout(b) }
  }, [])
  const [w, l] = words[i]
  return (
    <div className="hi hero__a" style={{ '--i': 0 }} role="img" aria-label={label}>
      <span className={'hi__w' + (fl ? ' is-fl' : '')} aria-hidden="true" data-t={w}>{w}</span>
      <span className="hi__tag" aria-hidden="true"><i />{l}</span>
    </div>
  )
}

/* ───────────── Home: the product-method circuit ───────────── */
const Wire = () => <span className="mth__wire" aria-hidden="true"><i /></span>
export function MethodCircuit({ cases, active, setActive, Arrow }) {
  const c = cases[active]
  return (
    <div className={'mth mth--' + c.palette} data-reveal>
      <div className="mth__bar"><Dots /><span>PRODUCT DECISION MAP</span><span className="mth__live"><i />INTERACTIVE</span></div>
      <div className="mth__tabs" role="group" aria-label="Switch system diagram">
        {cases.map((s, k) => (
          <button type="button" key={s.id} aria-pressed={active === k} onClick={() => setActive(k)}>
            <span>{s.n}</span><b>{s.short}</b><em>{s.result}</em>
          </button>
        ))}
      </div>
      <div className="mth__head" key={c.id}><small>THE PRODUCT PROBLEM / {c.n}</small><h3>{c.signal}</h3></div>
      <div className="mth__flow" key={'f' + c.id} aria-label="Product decision flow">
        <div className="mth__node mth__node--in">
          <span className="mth__k">INPUT / FRICTION</span>
          <div className="mth__scatter" aria-hidden="true">{Array.from({ length: 14 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</div>
          <b>{c.before}</b><small>Customer or operational signal</small>
        </div>
        <Wire />
        <div className="mth__node mth__node--gate">
          <span className="mth__k">DECISION / LOGIC</span>
          <div className="mth__gate" aria-hidden="true"><i /><i /><i /></div>
          <b>{c.after}</b>
          <ul className="mth__rules" aria-label="Product, platform and experience"><li>Product</li><li>Platform</li><li>Experience</li></ul>
        </div>
        <Wire />
        <div className="mth__node mth__node--out">
          <span className="mth__k">OUTPUT / PROOF</span>
          <strong>{c.result}</strong>
          <small>{c.resultLabel}</small>
          <div className="mth__delta" aria-hidden="true"><i /><i /></div>
        </div>
      </div>
      <div className="mth__steps" aria-label="Method">
        {['Hypothesis', 'Requirements', 'Build', 'Measurement'].map((s, k) => <span key={s} style={{ '--k': k }}><i>{k + 1}</i>{s}</span>)}
        <a href={'/work/' + c.slug}>Examine this decision <Arrow /></a>
      </div>
    </div>
  )
}

/* ───────────── Page hero stages (one drawn visual per page) ───────────── */
const WORK_TILES = [['Checkout', '+12.5pp', 'peach', 0], ['Fulfilment', '+3.0%', 'mint', 0], ['Retention', '~1,100/day', 'lilac', 0], ['Search', '+9.0%', 'sky', 0], ['AI Ops', '−20%', 'butter', 1], ['Growth infra', '+1.7%', 'peach', 0]]
export function WorkStage() {
  return (
    <div className="stg stg--work" role="img" aria-label="Six product systems and their outcomes">
      <div className="stg__bar"><Dots /><span>PRODUCT SYSTEMS / EVIDENCE</span></div>
      <div className="stg__feat"><strong>06</strong><span>Detailed case studies<br />across the commerce journey</span></div>
      <ul className="stg__tiles">
        {WORK_TILES.map(([a, b, t, d], k) => (
          <li key={a} className={'stg__tile stg__tile--' + t} style={{ '--k': k }}>
            <small>{a}</small><b>{b}</b><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={d ? { transform: 'scaleY(-1)' } : undefined}><path d="M4 18 L10 11 L14 14 L20 6 M15 6 H20 V11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </li>
        ))}
      </ul>
      <p className="stg__foot">PROBLEM → PRODUCT DECISION → OUTCOME</p>
    </div>
  )
}

const STEPS = [
  ['EF', "Eggfirst", "Dealer networks", "2022"], ['NP', "Neil Patel Digital", "Client accounts", "2023"],
  ['TM', "Truemeds", "Two pods, 12 engineers", "2023–26"], ['GN', "GNC India", "Consumer brand", "2026"], ['RQ', "ROQIVA", "Founding", "now"],
]
export function JourneyStage() {
  return (
    <div className="stg stg--climb" role="img" aria-label="Career altitude: from dealer networks to founding ROQIVA">
      <div className="stg__bar"><Dots /><span>CAREER / ALTITUDE</span></div>
      <div className="clb">
        <svg className="clb__line" viewBox="0 0 500 220" preserveAspectRatio="none" aria-hidden="true">
          <path className="clb__ghost" d="M20 200 L120 168 L220 126 L320 84 L420 40" />
          <path className="clb__draw" pathLength="1" d="M20 200 L120 168 L220 126 L320 84 L420 40" />
        </svg>
        <ol className="clb__steps">
          {STEPS.map(([m, org, what, yr], k) => (
            <li key={m} className={'clb__s' + (k === 4 ? ' is-top' : '')} style={{ '--k': k }}>
              <span className="clb__what">{what}</span>
              <span className="clb__bar"><b>{m}</b></span>
              <span className="clb__org">{org}</span>
              <span className="clb__yr">{yr}</span>
            </li>
          ))}
        </ol>
        <span className="clb__flag" aria-hidden="true">NEXT ›</span>
      </div>
    </div>
  )
}

/** Education: two degrees, side by side. */
export function EduPath({ edu }) {
  return (
    <ul className="edu">
      {edu.map(([a, b], k) => {
        const [deg, field] = a.split(' · ')
        const [school, yrs] = b.split(' · ')
        return (
          <li key={a} className={'edu__c edu__c--' + k} data-reveal>
            <span className="edu__yrs">{yrs}</span>
            <h3>{deg}</h3>
            <p>{field}</p>
            <small>{school}</small>
          </li>
        )
      })}
    </ul>
  )
}

const POLAROIDS = [['kart-pov', 'Speed'], ['lake-overlook', 'Wander'], ['lights-red', 'Live']]
export function BeyondStage() {
  return (
    <div className="stg stg--beyond" aria-label="Moments beyond work">
      <div className="stg__bar"><Dots /><span>SIDE QUESTS / ALWAYS ON</span></div>
      <div className="pol">
        {POLAROIDS.map(([s, g], k) => {
          const p = PHOTOS.find((x) => x.src === s)
          return (
            <figure key={s} className={'pol__c pol__c--' + k}>
              <img src={`/img/adventure/${s}.webp`} alt={ALT[s]} loading="lazy" decoding="async" />
              <figcaption><span>{g}</span>{p.cap}</figcaption>
            </figure>
          )
        })}
        <span className="pol__stamp" aria-hidden="true">STAY<br />CURIOUS</span>
      </div>
    </div>
  )
}

const ORBIT = [['GTM engineering', 'Capture intent & close journey gaps', 0], ['Revenue operations', 'Standardize decisions & workflows', 1], ['ROQIVA', 'Governed product in development', 2]]
const ORB_POS = [[50, 11], [80, 78], [20, 78]]
export function HireStage() {
  return (
    <div className="stg stg--orbit" role="img" aria-label="GTM engineering, revenue operations and ROQIVA connected in one loop">
      <div className="stg__bar"><Dots /><span>THE GROWTH SYSTEM</span></div>
      <div className="orb">
        <svg className="orb__ring" viewBox="0 0 320 320" aria-hidden="true">
          <circle className="orb__r0" cx="160" cy="160" r="112" />
          <circle className="orb__r1" cx="160" cy="160" r="112" pathLength="1" />
          <circle className="orb__r2" cx="160" cy="160" r="70" />
        </svg>
        <div className="orb__core"><b>Find the leak</b><i>→</i><b>Fix the loop</b><i>→</i><b>Prove the lift</b></div>
        {ORBIT.map(([a, b, k]) => (
          <div key={a} className={'orb__n orb__n--' + k} style={{ left: ORB_POS[k][0] + '%', top: ORB_POS[k][1] + '%' }}>
            <i>0{k + 1}</i><b>{a}</b><small>{b}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────── Hire: illustrations that carry the statements ───────────── */
export function LayerStack({ active = 0 }) {
  const L = [['ROQIVA', 'Governed intelligence', 2], ['Revenue operations', 'Decisions & handoffs', 1], ['GTM engineering', 'Signals & journeys', 0]]
  return (
    <div className="lyr" role="img" aria-label="Three layers: GTM engineering at the base, revenue operations in the middle, ROQIVA on top">
      <span className="lyr__axis lyr__axis--up" aria-hidden="true">SIGNALS ↑</span>
      {L.map(([a, b, k]) => (
        <div key={a} className={'lyr__p lyr__p--' + k + (active === k ? ' is-on' : '')}><b>{a}</b><small>{b}</small></div>
      ))}
      <span className="lyr__axis lyr__axis--dn" aria-hidden="true">DECISIONS ↓</span>
    </div>
  )
}

const GLYPH = { 'revenue-audit': 'search', 'intent-sprint': 'target', 'lifecycle-sprint': 'replay', 'data-foundation': 'database', 'ops-systems': 'bolt', partnership: 'chart' }
export const OfferGlyph = ({ id }) => <span className="ofg"><Icon name={GLYPH[id] || 'spark'} size={22} /></span>

export function LeakStory({ offerHref = '/contact?intent=consult#brief' }) {
  const [i, setI] = useState(0)
  const P = gtm.problems
  const p = P[i]
  const o = gtm.services.find((s) => s.id === p.offer)
  return (
    <div className="lkh" data-reveal>
      <div className="lkh__rail" role="group" aria-label="Where revenue leaks along the journey">
        <span className="lkh__end">DEMAND</span>
        <ol>
          {P.map((x, k) => (
            <li key={x.name}>
              <button type="button" className={'lkh__v' + (k === i ? ' is-on' : '')} aria-pressed={k === i} onClick={() => setI(k)}>
                <i aria-hidden="true">{k + 1}</i><b>{x.name.replace(' leakage', '')}</b>
              </button>
            </li>
          ))}
        </ol>
        <span className="lkh__end lkh__end--b">REVENUE</span>
      </div>
      <div className="lkh__panel" key={p.name}>
        <div className="lkh__head"><p className="label">{p.name}</p><h3>{p.title}</h3></div>
        <dl>
          <div><dt className="label">Looks like</dt><dd>{p.looks}</dd></div>
          <div><dt className="label">Costs</dt><dd>{p.costs}</dd></div>
          <div><dt className="label">Closed by</dt><dd><a className="accent" href={offerHref}>{o ? o.name : ''}</a></dd></div>
        </dl>
      </div>
    </div>
  )
}

export function PhaseGantt() {
  const rows = gtm.phases.map((p) => {
    const n = (p.weeks.match(/\d+/g) || [1]).map(Number)
    return { ...p, s: n[0], e: n[n.length - 1] }
  })
  return (
    <div className="gnt" role="img" aria-label="Twelve-week reference engagement, in four phases">
      <div className="gnt__weeks" aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <span key={k}>{k + 1}</span>)}</div>
      {rows.map((r, k) => (
        <div key={r.id} className="gnt__row" aria-hidden="true">
          <div className={'gnt__bar gnt__bar--' + k} style={{ gridColumn: `${r.s} / ${r.e + 1}`, '--k': k }}><i>0{k + 1}</i><b>{r.label}</b></div>
        </div>
      ))}
    </div>
  )
}

/* ───────────── Beyond: scenes ───────────── */
export const SCENES = [
  { g: 'Wander', k: '01', lede: 'Finding the longer route.', sub: 'Water, mountains and back roads.' },
  { g: 'Speed', k: '02', lede: 'Chasing a better lap.', sub: 'Karts, a racing sim and the apex.' },
  { g: 'Live', k: '03', lede: 'Listening to something loud.', sub: 'Lights, lasers and a full room.' },
]
export const photosOf = (g) => PHOTOS.filter((p) => p.g === g)
export const ORDERED = SCENES.flatMap((s) => photosOf(s.g))

const Ph = ({ p, cls = '' }) => (
  <figure className={'bph ' + cls}>
    <img src={`/img/adventure/${p.src}.webp`} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" />
    <figcaption className="bph__c">{p.cap}</figcaption>
  </figure>
)

/** Counts a number up while it is on screen. */
function Tick({ to, dec = 0, ms = 1800, suffix = '' }) {
  const [ref, on] = useInView(0.3)
  const [v, set] = useState(0)
  useEffect(() => {
    if (!on) return undefined
    if (typeof window !== 'undefined' && !window.matchMedia(MQ.motion).matches) { set(to); return undefined }
    let raf, t0
    const f = (t) => { t0 = t0 ?? t; const k = Math.min(1, (t - t0) / ms); set(to * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(f) }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [on, to, ms])
  return <span ref={ref}>{v.toFixed(dec)}{suffix}</span>
}

/** Speed: a circuit with a car on it, a gauge and sector times. */
function Telemetry() {
  const track = 'M60 120 C 40 60, 100 30, 170 40 S 250 90, 300 60 S 370 20, 400 70 S 380 140, 300 140 S 90 160, 60 120 Z'
  return (
    <div className="tel" aria-hidden="true">
      <svg className="tel__trk" viewBox="0 0 450 180">
        <path className="tel__road" d={track} />
        <path className="tel__run" d={track} pathLength="1" />
        <g className="tel__sf"><path d="M58 108 L58 132" /></g>
        <circle className="tel__car" r="7" style={{ offsetPath: `path('${track}')` }} />
      </svg>
      <div className="tel__gauge">
        <svg viewBox="0 0 120 70"><path className="tel__arc" d="M10 62 A50 50 0 0 1 110 62" pathLength="1" /><path className="tel__needle" d="M60 62 L60 20" /><circle cx="60" cy="62" r="4" /></svg>
        <b><Tick to={168} suffix=" km/h" /></b>
      </div>
      <p className="tel__lap"><span>BEST LAP</span><b><Tick to={58.412} dec={3} suffix="s" /></b></p>
    </div>
  )
}

/** Live: a waveform across the room, bass rings and a BPM counter. */
function Soundwave() {
  return (
    <div className="snd" aria-hidden="true">
      <div className="snd__rings"><i /><i /><i /><b>BPM<em><Tick to={128} /></em></b></div>
      <div className="snd__wave">{Array.from({ length: 56 }, (_, k) => <i key={k} style={{ '--k': k, '--h': 18 + ((k * 37) % 70) + '%' }} />)}</div>
    </div>
  )
}

export function WanderScene() {
  const ref = useRef(null)
  const L = photosOf('Wander')
  const go = (d) => ref.current && ref.current.scrollBy({ left: d * 320, behavior: 'smooth' })
  return (
    <div className="scn scn--wander">
      <svg className="scn__topo" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M-20 ${60 + k * 46} C 160 ${20 + k * 50}, 280 ${120 + k * 30}, 440 ${70 + k * 44} S 700 ${10 + k * 52}, 820 ${80 + k * 38}`} />)}
        <path className="scn__trail" d="M0 250 C 140 220, 200 120, 360 150 S 600 60, 800 40" />
      </svg>
      <div className="scn__ctl"><button type="button" className="kbd" onClick={() => go(-1)} aria-label="Scroll back">←</button><button type="button" className="kbd" onClick={() => go(1)} aria-label="Scroll forward">→</button></div>
      <div className="scn__rail" ref={ref} tabIndex={0} aria-label="Wander photos, scroll sideways">
        {L.map((p, k) => <Ph key={p.src} p={p} cls={'bph--w' + (k % 3)} />)}
      </div>
    </div>
  )
}

export function SpeedScene() {
  const L = photosOf('Speed')
  return (
    <div className="scn scn--speed">
      <div className="spd__main">
        <Ph p={L[1]} cls="bph--pole" />
        <div className="spd__hud" aria-hidden="true">
          <span>LAP</span>
          <ul>{['S1', 'S2', 'S3'].map((s, k) => <li key={s} style={{ '--k': k }}><em>{s}</em><i /></li>)}</ul>
        </div>
      </div>
      <div className="spd__side">
        {[0, 2, 3].map((n, k) => <Ph key={L[n].src} p={L[n]} cls={'bph--s' + k} />)}
      </div>
      <div className="spd__flag" aria-hidden="true" />
      <Telemetry />
    </div>
  )
}

export function LiveScene() {
  const L = photosOf('Live')
  return (
    <div className="scn scn--live">
      <div className="lv__beams" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="lv__row">{L.map((p, k) => <Ph key={p.src} p={p} cls={'bph--l' + k} />)}</div>
      <Soundwave />
      <ol className="lv__set" aria-label="Setlist">{L.map((p, k) => <li key={p.src}><span>0{k + 1}</span>{p.cap}</li>)}<li className="lv__eq" aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</li></ol>
    </div>
  )
}

export function Radar() {
  return (
    <ul className="rdr" aria-label="Also on the radar">
      {LOVES.map(([a, b], k) => <li key={a} className={'rdr__c rdr__c--' + (k % 5)} data-reveal><b>{a}</b><span>{b}</span></li>)}
    </ul>
  )
}

/* ───────────── ROQIVA overview: one run, drawn ───────────── */
const RUN = [['Brain', 'Store', 'v'], ['Detectors and Analyst', 'Code and one agent', 'o'], ['Orchestrator', 'Code', 'b'], ['Drafting agents', 'Agents', 'p'], ['Human gate', 'A person approves', 'gate'], ['Monitor', 'Code', 'g']]
export function RoqivaStage() {
  return (
    <div className="stg rqs" role="img" aria-label="One run through ROQIVA, with a human gate before anything ships">
      <div className="stg__bar"><Dots /><span>ONE RUN / BY DESIGN</span></div>
      <ol className="rqs__l">
        {RUN.map(([a, b, t], k) => (
          <li key={a} className={'rqs__n rqs__n--' + t} style={{ '--k': k }}>
            <i>{t === 'gate' ? <Icon name="gate" size={14} /> : a[0]}</i><b>{a}</b><span>{b}</span>
          </li>
        ))}
      </ol>
      <p className="stg__foot">READ-ONLY BY DESIGN · NOTHING SHIPS WITHOUT A PERSON</p>
    </div>
  )
}


/* ───────────── Hire: system blueprints ───────────── */
function BpGtm({ nodes }) {
  return (
    <div className="bp bp--gtm">
      <ol className="bp__flow">
        {nodes.map(([a, b], k) => <li key={a} style={{ '--k': k }}><span>0{k + 1}</span><b>{a}</b><small>{b}</small></li>)}
        <i className="bp__pipe" /><i className="bp__sig" /><i className="bp__sig" /><i className="bp__sig" />
        <em className="bp__x" aria-hidden="true">✕<u>leak</u></em>
      </ol>
      <p className="bp__leak"><span className="bp__tag bp__tag--bad">LEAK</span>Attribution is lost between Qualify and Convert.<em><Icon name="check" size={13} />Patched with one identity and one owner.</em></p>
    </div>
  )
}
function BpRev({ nodes }) {
  const P = [[110, 18], [202, 90], [110, 162], [18, 90]]
  return (
    <div className="bp bp--rev">
      <svg className="bp__loop" viewBox="0 0 220 180" aria-hidden="true">
        <circle className="bp__ring" cx="110" cy="90" r="72" />
        <g className="bp__orbit"><circle cx="110" cy="18" r="6" /></g>
        <text x="110" y="87" textAnchor="middle" className="bp__ct">ONE</text><text x="110" y="101" textAnchor="middle" className="bp__ct">OWNER</text>
        {nodes.map(([a], k) => (
          <g key={a} className="bp__ln" transform={`translate(${P[k][0]} ${P[k][1]})`}>
            <rect x="-34" y="-13" width="68" height="26" rx="13" /><text textAnchor="middle" y="4">{a.toUpperCase()}</text>
          </g>
        ))}
      </svg>
      <ul className="bp__rule">{[['Trigger', 'Cart idle for 20 minutes'], ['Rule', 'Offer only if margin allows'], ['Owner', 'Growth lead']].map(([a, b]) => <li key={a}><em>{a}</em><b>{b}</b></li>)}</ul>
    </div>
  )
}
function BpRoq({ nodes }) {
  return (
    <div className="bp bp--roq">
      <ol className="bp__cols">
        <li style={{ '--k': 0 }}><b>{nodes[0][0]}</b><div className="bp__sigs"><i>checkout drop</i><i>refund spike</i></div></li>
        <li style={{ '--k': 1 }}><b>{nodes[1][0]}</b><div className="bp__doc"><i /><i /><i /></div></li>
        <li style={{ '--k': 2 }}><b>{nodes[2][0]}</b><div className="bp__gate"><span className="bp__sw"><i /></span><small>a person approves</small></div></li>
        <li style={{ '--k': 3 }}><b>{nodes[3][0]}</b>
          <svg viewBox="0 0 120 60" aria-hidden="true"><path className="bp__spark" d="M2 48 L22 42 L42 46 L62 28 L82 30 L102 12 L118 8" pathLength="1" /></svg></li>
      </ol>
    </div>
  )
}
export function BlueprintViz({ kind, nodes }) {
  if (kind === 'gtm') return <BpGtm nodes={nodes} />
  if (kind === 'revops') return <BpRev nodes={nodes} />
  return <BpRoq nodes={nodes} />
}

/* ───────────── Hire: pick your symptom, pick your business ───────────── */
export function SymptomRouter() {
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const t = useRef(null)
  useEffect(() => () => clearTimeout(t.current), [])
  const pick = (k) => {
    if (k === i) return
    setI(k); setBusy(true); clearTimeout(t.current)
    t.current = setTimeout(() => setBusy(false), 600)
  }
  const sy = gtm.symptoms[i]
  const offer = gtm.services.find((s) => s.id === sy.offer)
  return (
    <div className="sym">
      <div className="sym__list" role="tablist" aria-label="Symptoms">
        {gtm.symptoms.map((s, k) => (
          <button key={s.q} type="button" role="tab" aria-selected={k === i} className={'sym__q' + (k === i ? ' is-on' : '')} onClick={() => pick(k)}>
            <span>0{k + 1}</span>{s.q}
          </button>
        ))}
      </div>
      <div className="sym__out" aria-live="polite">
        {busy ? <p className="sym__busy"><i />Tracing the leak<em /></p> : (
          <div className="sym__res" key={i}>
            <div><p className="label">Likely leak</p><p className="sym__leak">{sy.leak}</p></div>
            <div><p className="label">What I would check first</p><ol className="sym__check">{sy.check.map((c) => <li key={c}>{c}</li>)}</ol></div>
            <div className="sym__start">
              <div><p className="label">Start with</p><p className="sym__offer">{offer.name}</p><p className="sym__meta">{offer.first} · {offer.model}</p></div>
              <a className="btn btn--sm" href="/contact?intent=consult#brief">Bring this one <span aria-hidden="true">→</span></a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FitCheck() {
  return (
    <div className="fitc">
      <div className="fitc__col fitc__col--good"><p className="label">A good fit if</p><ul>{gtm.fitCheck.good.map((g) => <li key={g}><Icon name="check" size={14} />{g}</li>)}</ul></div>
      <div className="fitc__col fitc__col--not"><p className="label">Not a fit if you want</p><ul>{gtm.fitCheck.not.map((g) => <li key={g}><span aria-hidden="true">✕</span>{g}</li>)}</ul></div>
    </div>
  )
}
