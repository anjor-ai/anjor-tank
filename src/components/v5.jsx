import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'
import { cx } from './kit'

/* ═══════════════════════════════════════════════════════════════════════════
   The career rows (CAREER, LEARNING), the brief board and useInView. Every moving part stops under reduced
   motion or off screen.
   ═══════════════════════════════════════════════════════════════════════════ */

/** True while the element is on screen. Starts false so prerendered HTML is the settled, still state. */
export function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

/* ───────────── Career graph: now first, drawn like a commit log with ROQIVA on its own branch ───────────── */

export const CAREER = [
  { id: 'roqiva', lane: 1, g: [[1, 'down']], head: true, ref: 'build/roqiva', when: '2026 – now', role: 'Building ROQIVA', org: 'In development', d: 'Building a governed revenue system for commerce and D2C. It finds the leak, drafts the fix and waits for a person to approve it. A company will form around it.', stats: [['6', 'agents'], ['6', 'steps'], ['4', 'human gates']], to: '/roqiva', cta: 'Explore ROQIVA' },
  { id: 'gnc', lane: 0, g: [[0, 'down'], [1, 'full']], now: true, ref: 'main', when: 'Oct 2026 – now', role: 'Product Manager', org: 'GNC India', sub: 'Mumbai', d: 'Ecommerce, growth and the platforms behind a consumer wellness brand.' },
  { id: 'truemeds', lane: 0, g: [[0, 'full']], fork: 1, when: 'Dec 2023 – Jul 2026', role: 'Associate Product Manager', org: 'Truemeds', sub: 'Series C online pharmacy', d: 'Co-managed two pods across payments and portals. Six systems shipped 0-to-1.', stats: [['2', 'pods'], ['12', 'engineers']], to: '/work', cta: 'See the six systems', note: 'ROQIVA started here: the loop I ran by hand.' },
  { id: 'npd', lane: 0, when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India', d: 'Client accounts and campaign targeting from consumer-behaviour data.' },
  { id: 'eggfirst', lane: 0, when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst', d: 'Dealer landing pages and a lead system for an automotive brand’s network.' },
]
export const LEARNING = [
  { id: 'mba', lane: 0, learn: true, when: '2021 – 2023', role: 'MBA · Marketing, Operations and SCM', org: 'NMIMS, Mumbai' },
  { id: 'btech', lane: 0, learn: true, end: true, when: '2018 – 2022', role: 'BTech · Electronics and Telecommunications', org: 'NMIMS, Mumbai' },
]

/* ───────────── The brief thread: a brief comes in, becomes a working session, then a finding card ─────────────
   A small board with three columns. The card is carried from column to column by a cursor; between the brief and the
   session a reply arrives. It loops while on screen. Under reduced motion it rests on the finding card. */

const BT_COLS = ['Brief', 'Session', 'Finding']
export function BriefThread({ topic = 'consult' }) {
  const [ref, on] = useInView(0.25)
  const [s, setS] = useState(0)        // 0 brief, 1 session, 2 finding
  const [drag, setDrag] = useState(false)
  const [reply, setReply] = useState(false)
  const [still, setStill] = useState(false)
  useEffect(() => { setStill(!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) }, [])
  useEffect(() => {
    if (still) { setS(2); return undefined }
    if (!on) return undefined
    const t = []
    const at = (ms, fn) => t.push(setTimeout(fn, ms))
    const loop = () => {
      setS(0); setDrag(false); setReply(false)
      at(1400, () => setReply(true))
      at(2300, () => setDrag(true))
      at(2500, () => setS(1))
      at(3500, () => { setDrag(false); setReply(false) })
      at(5000, () => setDrag(true))
      at(5200, () => setS(2))
      at(6200, () => setDrag(false))
      at(9400, loop)
    }
    loop()
    return () => t.forEach(clearTimeout)
  }, [on, still])
  const brief = topic === 'work' ? 'The number that will not move, and the tools behind it.' : 'One problem, the tools involved, and what should move.'
  const STATUS = ['Brief received', 'Reply sent', 'Session held', 'Finding shared']
  const done = s === 0 ? (reply ? 2 : 1) : s === 1 ? 3 : 4
  return (
    <div ref={ref} className="bt2" style={{ '--s': s }}>
      <div className="bt2__bar"><span className="v-win__dots" aria-hidden="true"><i /><i /><i /></span><b>From brief to first finding</b><span className="bt2__who" aria-hidden="true"><i>You</i><i className="is-me">AT</i></span></div>
      <div className="bt2__board" role="img" aria-label="A brief becomes a working session, then a finding card">
        {BT_COLS.map((c, k) => <p key={c} className={cx('bt2__col', k <= s && 'is-on')}><span>{String(k + 1).padStart(2, '0')}</span>{c}<em>{k === s ? 1 : 0}</em></p>)}
        <div className="bt2__ghosts" aria-hidden="true">{[0, 1, 2].map((k) => <span key={k} style={{ '--c': k }}><i /><i /></span>)}</div>
        <span className={cx('bt2__reply', reply && 'is-on')}><b>AT</b>Reply within two working days</span>
        <div className={cx('bt2__card', drag && 'is-drag', `is-${s}`)}>
          {s === 0 && <><p className="bt2__k"><span>You</span>Your brief</p><p className="bt2__d">{brief}</p><p className="bt2__chips"><em>Prepaid conversion</em><em>Checkout</em></p></>}
          {s === 1 && <><p className="bt2__k"><span className="is-me">AT</span>Working session<i className="bt2__rec" /></p><p className="bt2__d">We map the journey and agree where the leak most likely is.</p><p className="bt2__call"><span className="bt2__av"><i>You</i><i className="is-me">AT</i></span><span className="bt2__wave" aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span></p></>}
          {s === 2 && <><p className="bt2__k"><span className="is-flag"><Icon name="flag" size={11} /></span>Finding card</p><p className="bt2__d">Payment failures were all treated alike.</p><p className="bt2__ev" aria-hidden="true"><small>Evidence</small><span><i style={{ '--h': '82%' }} /><i style={{ '--h': '64%' }} /><i style={{ '--h': '38%' }} /><i style={{ '--h': '22%' }} /></span></p><dl><div><dt>Owner</dt><dd>Payments product</dd></div><div><dt>Next</dt><dd><em className="bt2__next">Pilot a retry rule</em></dd></div></dl></>}
          <svg className="bt2__cur" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 8-7 2.5L10 20z" fill="currentColor" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <ol className="bt2__status" aria-hidden="true">{STATUS.map((x, k) => <li key={x} className={k < done ? 'is-done' : ''}><i>{k < done ? <Icon name="check" size={10} /> : null}</i>{x}</li>)}</ol>
    </div>
  )
}
