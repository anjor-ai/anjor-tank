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
export function HelloFlicker() {
  const [i, setI] = useState(0)
  const [fl, setFl] = useState(false)
  useEffect(() => {
    if (!motionOK()) return
    let a, b
    const id = setInterval(() => {
      setFl(true)
      a = setTimeout(() => setI((x) => (x + 1) % HI.length), 160)
      b = setTimeout(() => setFl(false), 560)
    }, 2300)
    return () => { clearInterval(id); clearTimeout(a); clearTimeout(b) }
  }, [])
  const [w, l] = HI[i]
  return (
    <div className="hi hero__a" style={{ '--i': 0 }} role="img" aria-label="Hello">
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

export function JourneyStage() {
  return (
    <div className="stg stg--route" role="img" aria-label="A route through three chapters">
      <div className="stg__bar"><Dots /><span>ROUTE / THREE CHAPTERS</span></div>
      <div className="rt">
        <figure className="rt__who"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" decoding="async" /></figure>
        <svg className="rt__map" viewBox="0 0 300 340" aria-hidden="true">
          <path className="rt__path" d="M30 316 C 90 304, 60 236, 128 216 S 214 160, 226 108 S 262 44, 282 26" pathLength="1" />
          <path className="rt__ghost" d="M30 316 C 90 304, 60 236, 128 216 S 214 160, 226 108 S 262 44, 282 26" />
          {[[30, 316, 'I'], [128, 216, 'II'], [226, 108, 'III']].map(([x, y, n], k) => (
            <g key={n} className="rt__pin" style={{ '--k': k }} transform={`translate(${x} ${y})`}><circle r="15" /><text y="4.5" textAnchor="middle">{n}</text></g>
          ))}
        </svg>
        <ul className="rt__tags">
          <li style={{ '--k': 0 }}><b>I</b>EGGFIRST / NEIL PATEL DIGITAL</li>
          <li style={{ '--k': 1 }}><b>II</b>TRUEMEDS / GNC INDIA</li>
          <li style={{ '--k': 2 }}><b>III</b>ROQIVA / FOUNDING</li>
        </ul>
      </div>
    </div>
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
    <div className="lk" data-reveal>
      <div className="lk__fig" role="group" aria-label="Where revenue leaks along the journey">
        <span className="lk__end">DEMAND</span>
        <div className="lk__pipe" aria-hidden="true"><i /></div>
        <ol className="lk__valves">
          {P.map((x, k) => (
            <li key={x.name}>
              <button type="button" className={'lk__v' + (k === i ? ' is-on' : '')} aria-pressed={k === i} onClick={() => setI(k)}>
                <span className="lk__n">0{k + 1}</span><span className="lk__t"><b>{x.name}</b><small>{x.title}</small></span><span className="lk__drip" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <span className="lk__end lk__end--b">REVENUE</span>
      </div>
      <div className="lk__panel" key={p.name}>
        <p className="label">{p.name}</p>
        <h3 className="h-2">{p.title}</h3>
        <p className="lead">{p.line}</p>
        <dl className="lk__dl">
          <div><dt className="label">What it looks like</dt><dd>{p.looks}</dd></div>
          <div><dt className="label">What it costs</dt><dd>{p.costs}</dd></div>
          <div><dt className="label">The offer that closes it</dt><dd><a className="accent" href={offerHref}>{o ? o.name : ''}</a></dd></div>
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

const Ph = ({ p, idx, open, cls = '' }) => (
  <button type="button" className={'bph ' + cls} onClick={() => open(idx)} aria-label={`Open photo: ${p.cap}`}>
    <img src={`/img/adventure/${p.src}.webp`} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" />
    <span className="bph__c">{p.cap}</span>
  </button>
)

export function WanderScene({ open }) {
  const ref = useRef(null)
  const L = photosOf('Wander')
  const base = 0
  const go = (d) => ref.current && ref.current.scrollBy({ left: d * 320, behavior: 'smooth' })
  return (
    <div className="scn scn--wander">
      <svg className="scn__topo" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M-20 ${60 + k * 46} C 160 ${20 + k * 50}, 280 ${120 + k * 30}, 440 ${70 + k * 44} S 700 ${10 + k * 52}, 820 ${80 + k * 38}`} />)}
        <path className="scn__trail" d="M0 250 C 140 220, 200 120, 360 150 S 600 60, 800 40" />
      </svg>
      <div className="scn__ctl"><button type="button" className="kbd" onClick={() => go(-1)} aria-label="Scroll back">←</button><button type="button" className="kbd" onClick={() => go(1)} aria-label="Scroll forward">→</button></div>
      <div className="scn__rail" ref={ref} tabIndex={0} aria-label="Wander photos, scroll sideways">
        {L.map((p, k) => <Ph key={p.src} p={p} idx={base + k} open={open} cls={'bph--w' + (k % 3)} />)}
      </div>
    </div>
  )
}

export function SpeedScene({ open }) {
  const L = photosOf('Speed')
  const base = photosOf('Wander').length
  return (
    <div className="scn scn--speed">
      <div className="spd__main">
        <Ph p={L[1]} idx={base + 1} open={open} cls="bph--pole" />
        <div className="spd__hud" aria-hidden="true">
          <span>LAP</span>
          <ul>{['S1', 'S2', 'S3'].map((s, k) => <li key={s} style={{ '--k': k }}><em>{s}</em><i /></li>)}</ul>
        </div>
      </div>
      <div className="spd__side">
        {[0, 2, 3].map((n, k) => <Ph key={L[n].src} p={L[n]} idx={base + n} open={open} cls={'bph--s' + k} />)}
      </div>
      <div className="spd__flag" aria-hidden="true" />
    </div>
  )
}

export function LiveScene({ open }) {
  const L = photosOf('Live')
  const base = photosOf('Wander').length + photosOf('Speed').length
  return (
    <div className="scn scn--live">
      <div className="lv__beams" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="lv__row">{L.map((p, k) => <Ph key={p.src} p={p} idx={base + k} open={open} cls={'bph--l' + k} />)}</div>
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
