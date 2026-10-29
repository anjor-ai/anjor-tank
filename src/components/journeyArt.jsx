import { useEffect, useRef, useState } from 'react'
import { CASES } from '../content'
import { Icon } from './icons'
import { STEPS } from './method'
import { MQ } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The Journey chapters, drawn as the software each chapter was about: one main window with a card or two
   floating over it, in the same language as the case wireframes (components/wires.jsx).
   I   How demand is made:     a campaign manager (15 dealers, 48 landing pages, ~100 campaigns), a dealer landing
                               page, and a lead arriving in a dealer's inbox.
   II  The systems underneath: a release board where the six systems move from spec to shipped, each with the number it moved.
   III The system that runs it: one work item travelling the six steps, stopping at a gate for a person.
   Each steps forward only while on screen; under reduced motion it rests on its most telling frame.
   ═══════════════════════════════════════════════════════════════════════════ */

/** 0..n-1 every `ms` while `ref` is on screen. `still` is the frame shown when motion is reduced. */
function useTick(n, ms, ref, still = 0) {
  const [i, setI] = useState(still)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(MQ.motion).matches) return undefined
    setI(0)
    let seen = false
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0.25 })
    io.observe(el)
    const t = setInterval(() => { if (seen && !document.hidden) setI((x) => (x + 1) % n) }, ms)
    return () => { clearInterval(t); io.disconnect() }
  }, [n, ms, ref])
  return i
}

const Bar = ({ w }) => <i className="ja-bar" style={{ width: `${w}%` }} />
const Top = ({ t, em }) => (
  <p className="ja-win__bar"><span className="ja-dots" aria-hidden="true"><i /><i /><i /></span><b>{t}</b>{em && <em>{em}</em>}</p>
)

/* ─────────── I · How demand is made ─────────── */
const BARS = [38, 52, 44, 70, 58, 82, 64, 90, 72, 60, 86, 76]

function Demand() {
  const ref = useRef(null)
  const i = useTick(6, 2600, ref, 3)
  const dealer = (i * 7 + 3) % 15
  return (
    <div className="ja ja--demand" ref={ref} role="img" aria-label="A campaign manager for 15 dealers, 48 landing pages and about 100 campaigns; a lead from a dealer landing page arrives in a dealer's inbox">
      <div className="ja-win ja-dm">
        <Top t="Campaign manager" />
        <div className="ja-dm__kpi">
          {[['15', 'Dealers'], ['48', 'Landing pages'], ['~100', 'Campaigns']].map(([v, l]) => <span key={l}><b>{v}</b><small>{l}</small></span>)}
        </div>
        <div className="ja-dm__body">
          <div className="ja-dm__chart" aria-hidden="true">
            <small>Leads by campaign</small>
            <span className="ja-dm__bars">{BARS.map((h, k) => <i key={k} className={k === (i * 2 + 5) % BARS.length ? 'is-on' : ''} style={{ height: `${h}%` }} />)}</span>
          </div>
          <div className="ja-dm__grid" aria-hidden="true">
            <small>Dealers</small>
            <span>{Array.from({ length: 15 }, (_, k) => <i key={k} className={k === dealer ? 'is-on' : ''} />)}</span>
          </div>
        </div>
      </div>
      <div className="ja-fl ja-dm__page" aria-hidden="true">
        <span className="ja-dm__hero" />
        <Bar w={78} /><Bar w={54} />
        <span className="ja-dm__field">Name</span>
        <span className="ja-dm__field">Phone</span>
        <span className="ja-dm__field">City</span>
        <span className="ja-dm__btn">Request a call</span>
      </div>
      <div className="ja-fl ja-dm__toast" key={i} aria-hidden="true">
        <span className="ja-dm__ic"><Icon name="bell" size={13} /></span>
        <span><b>New lead</b><small>Routed to dealer {String(dealer + 1).padStart(2, '0')}</small></span>
      </div>
    </div>
  )
}

/* ─────────── II · The systems underneath ─────────── */
function Systems() {
  const ref = useRef(null)
  const n = CASES.length
  const i = useTick(n + 2, 1700, ref, n + 1) // n+1 holds the board with everything shipped
  const shipped = Math.min(i, n)
  const col = (k) => (k < shipped ? 2 : k === shipped ? 1 : 0)
  const last = CASES[Math.max(0, shipped - 1)]
  const cols = [['Spec', 'doc'], ['Build', 'layers'], ['Shipped', 'check']]
  return (
    <div className="ja ja--board" ref={ref} role="img" aria-label="A release board: the six systems move from spec to build to shipped, each with the number it moved">
      <div className="ja-win ja-rb">
        <Top t="Release board" em="0-to-1" />
        <div className="ja-rb__cols">
          {cols.map(([t, ic], c) => {
            const items = CASES.map((x, k) => [x, k]).filter(([, k]) => col(k) === c)
            return (
              <div key={t} className={`ja-rb__col ja-rb__col--${c}`}>
                <p className="ja-rb__h"><Icon name={ic} size={11} />{t}<em>{items.length}</em></p>
                <ul>
                  {items.map(([x]) => (
                    <li key={x.slug}>
                      <span className="ja-rb__tag">{x.tag}</span>
                      <b>{x.title}</b>
                      {c === 2 && <strong>{x.metrics[0][0]}</strong>}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
      <div className="ja-fl ja-rb__chip" aria-hidden="true"><Icon name="users" size={13} /><b>2</b> pods · <b>12</b> engineers</div>
      {shipped > 0 && (
        <div className="ja-fl ja-rb__metric" key={last.slug} aria-hidden="true">
          <small><Icon name="check" size={11} />Shipped · {last.tag}</small>
          <strong>{last.metrics[0][0]}</strong>
          <span>{last.metrics[0][1]}</span>
        </div>
      )}
    </div>
  )
}

/* ─────────── III · The system that runs it ─────────── */
function Run() {
  const ref = useRef(null)
  const i = useTick(STEPS.length, 2400, ref, 2)
  const s = STEPS[i]
  const gate = s.gate && s.gate.startsWith('Gate') ? s.gate.split(' · ') : null
  return (
    <div className="ja ja--run" ref={ref} role="img" aria-label="One work item travels six steps; at each of four gates a person approves or sends it back">
      <div className="ja-win ja-win--dark ja-rn">
        <Top t="ROQIVA · WI-014" em="In development" />
        <div className="ja-rn__track" style={{ '--i': i, '--n': STEPS.length }}>
          <i className="ja-rn__line" aria-hidden="true"><i /></i>
          {STEPS.map((x, k) => (
            <span key={x.k} className={`ja-rn__node${k === i ? ' is-on' : k < i ? ' is-done' : ''}`}>
              <i><Icon name={x.icon} size={13} /></i>
              <small>{x.k}</small>
              {x.gate && x.gate.startsWith('Gate') && <em className="ja-rn__gate" aria-hidden="true" />}
            </span>
          ))}
        </div>
        <div className="ja-rn__panel" key={i}>
          <p className="ja-rn__k">Step {String(i + 1).padStart(2, '0')} · {s.k}</p>
          <dl>
            <div><dt>Run by</dt><dd>{s.who.join(', ')}</dd></div>
            <div><dt>Hands on</dt><dd>{s.out}</dd></div>
          </dl>
        </div>
        <ol className="ja-rn__log" aria-hidden="true">
          {STEPS.slice(Math.max(0, i - 2), i).reverse().map((x) => <li key={x.k}><Icon name="check" size={11} /><b>{x.k}</b><span>{x.out}</span></li>)}
          {i === 0 && <li className="is-wait"><Icon name="clock" size={11} /><b>Waiting</b><span>No earlier steps on this item</span></li>}
        </ol>
      </div>
      <div className="ja-fl ja-rn__chip" aria-hidden="true"><b>6</b> steps · <b>4</b> gates · <b>6</b> agents</div>
      {gate && (
        <div className="ja-fl ja-rn__ask" key={`g${i}`} aria-hidden="true">
          <small><Icon name="gate" size={11} />{gate[0]}</small>
          <b>{gate[1]}</b>
          <span><i className="is-ok">Approve</i><i>Send back</i></span>
        </div>
      )}
    </div>
  )
}

export const CHAPTER_ART = [Demand, Systems, Run]
