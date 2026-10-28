import { useRef } from 'react'
import { Icon } from './icons'
import { Stat } from './kinetic'
import { Stage, Win, cx } from './board'
import { CAREER, LEARNING } from './v5'
import { MQ, gsap, useGSAP } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The pictures of the site: fragments of the products the work was about, drawn in HTML with sample data and
   labelled as illustrations. No real screenshots exist, so none of these pretends to be one. A number appears only
   when it is a figure from the case (77.2% → 89.7%, +12.5pp and so on); everything else is sample.
   Every fragment is fluid: it reads at 280px and at 640px (container queries in site.css trim the extras).
   ═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE = 'Illustration · sample data'

/* ───────────── Home hero: one decision, traced from the signals to the outcome ───────────── */
const TRACE = [
  ['warn', 'Order changed after payment', 'Checkout'],
  ['warn', 'Prepaid option sat below the fold', 'Payment'],
  ['info', 'Cash on delivery at high intent', 'Payment'],
  ['warn', 'Cancelled after dispatch', 'Fulfilment'],
]
export function DecisionTrace() {
  const ref = useRef(null)
  // The system at work: each signal lights in turn, the decision answers, the outcome confirms. Loops while on screen.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref)
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true, defaults: { ease: 'eInOut' } })
      q('.u-trace__sig li').forEach((li, k) => tl.to(li, { '--on': 1, duration: 0.35 }, k * 0.45).to(li, { '--on': 0, duration: 0.5 }, k * 0.45 + 0.9))
      tl.fromTo(q('.u-trace__dec'), { '--on': 0 }, { '--on': 1, duration: 0.5 }, 1.9)
        .to(q('.u-trace__dec'), { '--on': 0, duration: 0.6 }, 3.6)
        .fromTo(q('.u-trace__out'), { '--on': 0 }, { '--on': 1, duration: 0.5 }, 2.6)
        .to(q('.u-trace__out'), { '--on': 0, duration: 0.6 }, 4.2)
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()), { threshold: 0.2 })
      io.observe(ref.current)
      return () => { io.disconnect(); tl.kill() }
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className="u-trace" ref={ref}>
      <Win title="Decision layer · checkout" className="u-trace__win">
        <div className="u-trace__grid">
          <nav className="u-trace__side" aria-label="Decision layer views">
            <p className="u-trace__brand"><i aria-hidden="true">◆</i>Decision layer</p>
            {[['eye', 'Signals'], ['branch', 'Decisions'], ['layers', 'Experiments'], ['chart', 'Outcomes']].map(([ic, t], k) => (
              <span key={t} className={k === 1 ? 'is-on' : ''}><Icon name={ic} size={14} />{t}</span>
            ))}
          </nav>
          <div className="u-trace__main">
            <section aria-label="Signals">
              <p className="u-k">Signals <b>4 new</b></p>
              <ul className="u-trace__sig">
                {TRACE.map(([tone, t, s]) => <li key={t} className={`is-${tone}`}><i /><b>{t}</b><small>{s}</small></li>)}
              </ul>
            </section>
            <section className="u-trace__dec" aria-label="Decision">
              <p className="u-k">Decision</p>
              <div className="u-card">
                <b>Lock the price at checkout</b>
                <p>Absorb small batch changes. Surface prepaid at the moment of intent. Hand clean orders to the warehouse.</p>
                <p className="u-pills"><span className="is-ok">Eligible</span><span>Guardrails on</span><span>Holdout set</span></p>
              </div>
            </section>
            <section className="u-trace__out" aria-label="Outcome">
              <p className="u-k">Outcome · prepaid order-to-delivery</p>
              <div className="u-trace__big">
                <span>77.2%</span><Icon name="arrow" size={16} /><b><Stat v="89.7%" /></b>
                <svg viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true"><path className="u-spark__a" d="M0 42 C30 41 46 38 66 36 S104 28 124 22 S164 10 200 6 L200 48 L0 48 Z" /><path className="u-spark__l" d="M0 42 C30 41 46 38 66 36 S104 28 124 22 S164 10 200 6" data-draw /></svg>
              </div>
              <p className="u-pills"><span className="is-ok">+12.5pp</span><span>RTO −1.9pp</span><span>Cancellations −3.3pp</span></p>
            </section>
          </div>
        </div>
      </Win>
      <p className="u-float u-float--a"><Icon name="lock" size={14} /><span><b>Price locked</b><small>Order total held after payment</small></span></p>
      <p className="u-float u-float--b"><b>+12.5pp</b><small>Prepaid order-to-delivery · checkout case</small></p>
    </div>
  )
}

/* ───────────── The six cases ───────────── */
const Flow = ({ steps }) => <ol className="u-flow" aria-label="Flow">{steps.map((f, i) => <li key={f} className={i === steps.length - 1 ? 'is-end' : ''}>{f}</li>)}</ol>
const Pill = ({ tone = '', children }) => <span className={cx('u-pill', tone && `is-${tone}`)}>{children}</span>

function Checkout() {
  return (
    <Win title="Checkout · pay now" tag={SAMPLE}>
      <div className="u-split">
        <div className="u-col">
          <p className="u-k">Your order</p>
          <ul className="u-rows"><li><span>Item A × 2</span><b>₹ 420</b></li><li><span>Item B × 1</span><b>₹ 310</b></li><li><span>Delivery</span><b>Free</b></li></ul>
          <p className="u-lock"><Icon name="lock" size={13} />Price locked at ₹ 730</p>
          <p className="u-opts"><span className="is-on">UPI</span><span>Card</span><span className="is-off">Cash on delivery</span></p>
          <span className="u-btn">Pay ₹ 730</span>
        </div>
        <div className="u-col u-col--x">
          <p className="u-k">At the warehouse</p>
          <p className="u-ev is-warn"><b>+ ₹ 40</b><span>Batch change raised the price</span></p>
          <p className="u-ev is-ok"><b>− ₹ 40</b><span>Absorbed as a discount on the bill</span></p>
          <p className="u-note">The payable amount never changes after checkout.</p>
        </div>
      </div>
      <Flow steps={['Order placed', 'Price locked', 'Warehouse change', 'Absorbed or refunded', 'Paid']} />
    </Win>
  )
}
function Substitution() {
  return (
    <Win title="Warehouse portal · order" tag={SAMPLE}>
      <table className="u-tbl">
        <thead><tr><th>Item</th><th>Stock</th><th>Action</th></tr></thead>
        <tbody>
          <tr className="is-warn"><td>Item A · 10 tabs</td><td><Pill tone="warn">Out</Pill></td><td>Substitute</td></tr>
          <tr><td>Item B · 15 ml</td><td><Pill tone="ok">In</Pill></td><td>Pick</td></tr>
        </tbody>
      </table>
      <p className="u-k">Suggested for Item A</p>
      <ul className="u-sugs">
        <li className="is-best"><b>Item A2 · 10 tabs</b><span>Smallest price delta · in stock</span><Pill tone="ok">₹ 0 to customer</Pill></li>
        <li className="u-col--x"><b>Item A3 · 2 × 5 tabs</b><span>Same quantity</span><Pill>+ ₹ 6 absorbed</Pill></li>
      </ul>
      <Flow steps={['Stockout', 'Live inventory', 'Suggest nearest SKU', 'Operator confirms', 'Price held']} />
    </Win>
  )
}
function Loops() {
  return (
    <Win title="Growth · the loop" tag={SAMPLE}>
      <div className="u-split">
        <div className="u-col">
          <p className="u-k">Notification</p>
          <p className="u-push"><b>Time to refill?</b><span>Your regular order is ready in one tap.</span></p>
          <span className="u-btn">Reorder</span>
        </div>
        <div className="u-col u-col--x">
          <p className="u-k">Page builder</p>
          <ul className="u-blocks"><li>Hero banner</li><li>Offer strip</li><li className="is-on">Referral card</li></ul>
          <p className="u-note">Growth edits and publishes without a ticket.</p>
          <p className="u-ev is-warn"><b>Blocked</b><span>Same device claiming repeat rewards</span></p>
        </div>
      </div>
      <Flow steps={['Order', 'Reminder', 'Repeat order', 'Referral']} />
    </Win>
  )
}
function Search() {
  return (
    <Win title="Search · results" tag={SAMPLE}>
      <p className="u-q"><Icon name="search" size={14} />paracetamol 650</p>
      <ul className="u-res">
        <li><b>Paracetamol 650 mg</b><span>Strip of 15 · in stock</span><Pill tone="ok">Best match</Pill></li>
        <li><b>Paracetamol 500 mg</b><span>Strip of 10</span></li>
      </ul>
      <p className="u-q is-typo"><Icon name="search" size={14} />parcetamol</p>
      <p className="u-fix"><Icon name="check" size={13} />Misspelling mapped to the right product. No empty page.</p>
      <Flow steps={['Query', 'Intent', 'Rank', 'Result']} />
    </Win>
  )
}
function Automation() {
  const N = ({ k, t, tone = '' }) => <p className={cx('u-node', tone && `is-${tone}`)}><small>{k}</small><b>{t}</b></p>
  return (
    <Win title="Support · automation flow" tag={SAMPLE}>
      <div className="u-graph">
        <N k="Trigger" t="Customer calls" />
        <span className="u-graph__ar" aria-hidden="true"><Icon name="arrow" size={14} /></span>
        <N k="Intent" t="Where is my order?" />
        <span className="u-graph__ar" aria-hidden="true"><Icon name="arrow" size={14} /></span>
        <div className="u-graph__br">
          <N k="Low complexity" t="Voice bot answers" tone="ok" />
          <N k="Needs a person" t="Agent with risk view" tone="warn" />
        </div>
      </div>
      <Flow steps={['Call in', 'Detect intent', 'Automate or hand over', 'Log outcome']} />
    </Win>
  )
}
function Cms() {
  return (
    <Win title="Page builder · campaign page" tag={SAMPLE}>
      <div className="u-split">
        <div className="u-col">
          <p className="u-k">Modules</p>
          <ul className="u-blocks"><li>Hero banner</li><li className="is-on">Offer strip</li><li>Social proof</li><li className="is-on">Sticky CTA</li></ul>
          <p className="u-note">Marketing publishes without a ticket.</p>
        </div>
        <div className="u-col u-col--x">
          <p className="u-k">Experiment</p>
          <ul className="u-rows"><li><span>Variant A</span><b>Control</b></li><li><span>Variant B</span><b className="is-up">+1.7% CVR</b></li><li><span>Tracking</span><b>Verified</b></li></ul>
          <p className="u-ev is-ok"><b>QA passed</b><span>Links, tags and layout checked</span></p>
        </div>
      </div>
      <Flow steps={['Brief page', 'Build in CMS', 'QA and preview', 'Launch test', 'Measure CVR']} />
    </Win>
  )
}
const CASE_UI = {
  'price-lock-checkout': Checkout,
  'sku-substitution-engine': Substitution,
  'retention-reminders': Loops,
  'search-discovery': Search,
  'ai-automation': Automation,
  'headless-cms-experimentation': Cms,
}
/** The illustration for one case, by slug. */
export function CaseUI({ slug }) {
  const M = CASE_UI[slug]
  return M ? <div className="u-case">{<M />}</div> : null
}
/** Which painting each case stands on. */
export const CASE_PAINT = { 'price-lock-checkout': 'dawn', 'sku-substitution-engine': 'noon', 'retention-reminders': 'meadow', 'search-discovery': 'dusk', 'ai-automation': 'night', 'headless-cms-experimentation': 'dawn' }

/* ───────────── The career, as a commit log: now first, ROQIVA on its own branch ───────────── */
export function CareerLog({ withLearning = false, compact = false }) {
  const rows = withLearning ? [...CAREER, ...LEARNING] : CAREER
  return (
    <div className={cx('u-log', compact && 'u-log--c')}>
      <p className="u-log__top"><span><b>$</b> git log --graph --career</span><span className="u-log__legend"><i className="l1" />ROQIVA <i className="l0" />Career{withLearning && <><i className="lx" />Learning</>}</span></p>
      <ol className="u-log__rows" data-seq>
        {rows.map((r) => (
          <li key={r.id} className={cx('u-log__r', r.head && 'is-head', r.now && 'is-now', r.learn && 'is-learn', r.lane === 1 && 'is-branch')}>
            <span className="u-log__g" aria-hidden="true"><i /></span>
            <div className="u-log__c">
              <p className="u-log__m">
                {r.ref && <span className={cx('u-log__ref', r.head && 'is-head')}>{r.head ? 'HEAD → ' : ''}{r.ref}</span>}
                {r.now && !r.head && <span className="u-log__now"><i />Now</span>}
                <span>{r.when}</span>
              </p>
              <h3><b>{r.role}</b><span>{r.org}{r.sub && <em> · {r.sub}</em>}</span></h3>
              {r.d && <p className="u-log__d">{r.d}</p>}
              {r.note && <p className="u-log__note"><Icon name="branch" size={13} />{r.note}</p>}
              {(r.stats || r.to) && (
                <div className="u-log__f">
                  {r.stats && <dl>{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>}
                  {r.to && <a href={r.to}>{r.cta}<Icon name="arrow" size={13} /></a>}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ───────────── A dotted coastline with a pin on Mumbai. Abstract on purpose. ───────────── */
export function MapDots({ caption = 'Dotted map with a pin on Mumbai' }) {
  const coast = (y) => [[0, 10.5], [2, 9.6], [4, 10.6], [6, 9.4], [8, 10.2], [9, 10.9], [10, 11.4], [12, 12.4]].reduce((acc, p, i, a) => (y >= p[0] && a[i + 1] && y <= a[i + 1][0] ? p[1] + ((y - p[0]) / (a[i + 1][0] - p[0])) * (a[i + 1][1] - p[1]) : acc), 12.4)
  const dots = []
  for (let y = 0; y <= 12; y++) for (let x = 0; x < 26; x++) {
    const c = coast(y)
    const width = y > 7 ? Math.max(2.2, 15 - (y - 7) * 3.1) : 99
    if (x > c && x < c + width) dots.push([x, y])
  }
  return (
    <svg className="u-map" viewBox="0 0 260 130" role="img" aria-label={caption}>
      {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x * 10 + 5} cy={y * 10 + 5} r="2" />)}
      <g className="u-map__pin" transform="translate(152 98)"><circle className="u-map__pulse" r="6" /><circle r="6" /></g>
    </svg>
  )
}

/* ───────────── Case pages ───────────── */

/** The system as boxes and wires, left to right, two rows. */
export function ArchMap({ parts }) {
  const half = Math.ceil(parts.length / 2)
  const rows = [parts.slice(0, half), parts.slice(half)]
  return (
    <Win title="System map" tag="Illustration" dark className="u-arch" >
      <div role="img" aria-label={`System diagram: ${parts.map((p) => p.t).join(' → ')}`}>
        {rows.map((row, r) => (
          <div key={r} className="u-arch__row" data-seq>
            {row.map((p, k) => (
              <p key={p.t} className="u-arch__n"><small>{String(r * half + k + 1).padStart(2, '0')}</small><b>{p.t}</b></p>
            ))}
          </div>
        ))}
      </div>
    </Win>
  )
}

/** Low-fidelity phone screens, one per workflow step. */
export function Storyboard({ steps }) {
  const kinds = ['list', 'form', 'confirm', 'choice', 'chart', 'list']
  return (
    <div className="u-sb" role="img" aria-label={`Wireframe storyboard: ${steps.map((s) => s.t).join(', ')}`}>
      {steps.map((s, k) => {
        const kind = kinds[k % kinds.length]
        return (
          <figure key={s.t} className="u-sb__f">
            <div className="u-sb__ph">
              <p className="u-sb__hd"><i />{s.t}</p>
              {kind === 'list' && <div className="u-sb__ls">{[0, 1, 2].map((j) => <span key={j} className={j === 1 ? 'is-on' : ''}><i /><b /></span>)}</div>}
              {kind === 'form' && <div className="u-sb__fm"><b /><span /><b /><span className="is-on" /></div>}
              {kind === 'confirm' && <div className="u-sb__cf"><span><Icon name="lock" size={14} /></span><b /></div>}
              {kind === 'choice' && <div className="u-sb__ls">{[0, 1, 2].map((j) => <span key={j} className={j === 0 ? 'is-on' : ''}><i /><b /></span>)}</div>}
              {kind === 'chart' && <div className="u-sb__ct">{[40, 55, 48, 70, 82].map((h, j) => <i key={j} style={{ height: `${h}%` }} />)}</div>}
              <span className="u-sb__btn">{k === steps.length - 1 ? 'Done' : 'Continue'}</span>
            </div>
          </figure>
        )
      })}
    </div>
  )
}

/** A dashboard wireframe for the measurement plan. */
export function DashWire({ m }) {
  return (
    <Win title="Outcome dashboard" tag="Wireframe · no data" className="u-dash">
      <div role="img" aria-label={`Dashboard wireframe: ${m.primary[0]}, guarded by ${m.guard.join(', ')}`}>
        <p className="u-dash__f">{m.seg.slice(0, 4).map((s, k) => <span key={s} className={k === 0 ? 'is-on' : ''}>{s}</span>)}</p>
        <div className="u-dash__kpi">
          <small>Primary</small>
          <b>{m.primary[0]}</b>
          <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 C 40 47, 70 45, 100 39 S 160 29, 190 25 S 250 13, 300 8" data-draw /></svg>
        </div>
        <ul className="u-dash__g">{m.guard.slice(0, 4).map((g, k) => <li key={g}><span>{g}</span><i><b style={{ width: `${[38, 52, 30, 46][k]}%` }} /></i></li>)}</ul>
      </div>
    </Win>
  )
}

/** A case as a tile: its product on a painting, then what it is and the number it moved. The whole tile opens the case. */
export function CaseTile({ c, onOpen, wide = false, metrics = 1 }) {
  return (
    <article className={`b-case${wide ? ' b-case--wide' : ''}`} data-cursor="Read">
      <a className="b-case__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
      <Stage kind="paint" name={CASE_PAINT[c.slug]} className="b-case__art" align="end"><CaseUI slug={c.slug} /></Stage>
      <div className="b-case__b">
        <p className="b-case__k"><span>{c.cat}</span><span>{c.n} / 06</span></p>
        <h3>{c.title}</h3>
        <p className="b-case__l">{c.line}</p>
        <ul className="b-case__m">{c.metrics.slice(0, metrics).map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
        <p className="b-case__acts">
          {onOpen && <button type="button" className="b-case__q" onClick={() => onOpen(c.slug)}><Icon name="eye" size={14} />Quick view</button>}
          <span className="b-case__go">Read the case<i><Icon name="ne" size={13} /></i></span>
        </p>
      </div>
    </article>
  )
}

