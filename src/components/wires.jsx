import { Icon } from './icons'
import { cx } from './board'

/* ═══════════════════════════════════════════════════════════════════════════
   Wireframes and workflows: the picture of each case, drawn the way product people sketch software.
   Three views per case: the screen the system was built around, the workflow behind it, and the outcome.
   Soft grey bars stand in for content; only the words that carry the idea are written, all taken from the case.
   A number appears only when it is the case's own figure.
   ═══════════════════════════════════════════════════════════════════════════ */

const Bar = ({ w = 60, tone, h }) => <i className={cx('w-bar', tone && `w-bar--${tone}`)} style={{ width: `${w}%`, height: h }} />
const Cursor = ({ className }) => <svg className={cx('w-cur', className)} width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path d="M1 1 L1 14 L4.6 10.8 L7.2 16.6 L9.6 15.5 L7 9.8 L12 9.6 Z" /></svg>
const Toggle = ({ on }) => <span className={cx('w-tog', on && 'is-on')} aria-hidden="true"><i /></span>
const Panel = ({ title, icon, children, className }) => (
  <div className={cx('w-panel', className)}>
    {title && <p className="w-panel__h">{icon && <Icon name={icon} size={13} />}<b>{title}</b><Bar w={22} /></p>}
    {children}
  </div>
)

/* ───────────── The screens ───────────── */
const SCREENS = {
  'price-lock-checkout': () => (
    <Panel title="Checkout" icon="lock" className="w-panel--md">
      <p className="w-row"><Bar w={46} /><b>₹ 420</b></p>
      <p className="w-row"><Bar w={34} /><b>₹ 310</b></p>
      <p className="w-chip w-chip--ok"><Icon name="lock" size={12} />Price locked at ₹ 730</p>
      <p className="w-pills"><span className="is-on">UPI</span><span>Card</span><span className="is-off">Cash on delivery</span></p>
      <p className="w-btn">Pay ₹ 730<Cursor /></p>
    </Panel>
  ),
  'sku-substitution-engine': () => (
    <div className="w-stack">
      <Panel title="Warehouse portal" icon="layers" className="w-panel--md">
        <p className="w-row w-row--warn"><span>Item A · 10 tabs</span><em className="w-tag w-tag--warn">Out</em></p>
        <p className="w-row"><Bar w={40} /><em className="w-tag w-tag--ok">In</em></p>
        <p className="w-row"><Bar w={30} /><Bar w={14} /></p>
      </Panel>
      <div className="w-pop">
        <p className="w-pop__k">Suggested for Item A</p>
        <p className="w-pop__o is-on"><b>Item A2 · 10 tabs</b><small>₹ 0 to customer</small><Cursor /></p>
        <p className="w-pop__o"><b>Item A3 · 2 × 5 tabs</b><small>+ ₹ 6 absorbed</small></p>
      </div>
    </div>
  ),
  'retention-reminders': () => (
    <div className="w-phone">
      <span className="w-phone__notch" />
      <p className="w-note"><span className="w-note__ic"><Icon name="bell" size={13} /></span><span><b>Time to refill?</b><small>Your regular order is ready in one tap.</small></span></p>
      <Bar w={70} /><Bar w={52} />
      <p className="w-btn">Reorder<Cursor /></p>
    </div>
  ),
  'search-discovery': () => (
    <Panel className="w-panel--md">
      <p className="w-search"><Icon name="search" size={13} /><span className="w-typo">parcetamol</span><em>→ paracetamol</em></p>
      <p className="w-row w-row--on"><span><b>Paracetamol 650 mg</b><small>Strip of 15 · in stock</small></span><em className="w-tag w-tag--ok">Best match</em></p>
      <p className="w-row"><span><b>Paracetamol 500 mg</b><small>Strip of 10</small></span></p>
      <p className="w-row"><Bar w={38} /><Bar w={12} /></p>
    </Panel>
  ),
  'ai-automation': () => (
    <div className="w-route">
      <p className="w-node"><Icon name="mobile" size={14} /><span><small>Trigger</small><b>Customer calls</b></span></p>
      <p className="w-node w-node--mid"><Icon name="radar" size={14} /><span><small>Intent</small><b>Where is my order?</b></span></p>
      <div className="w-route__out">
        <p className="w-node w-node--ok"><Icon name="agent" size={14} /><span><small>Low complexity</small><b>Voice bot answers</b></span></p>
        <p className="w-node w-node--warn"><Icon name="person" size={14} /><span><small>Needs a person</small><b>Agent with risk view</b></span></p>
      </div>
    </div>
  ),
  'headless-cms-experimentation': () => (
    <Panel title="Campaign page" icon="frame" className="w-panel--md">
      {[['Hero banner', true], ['Offer strip', true], ['Social proof', false], ['Sticky CTA', true]].map(([t, on]) => (
        <p key={t} className="w-row"><span className={cx('w-ck', on && 'is-on')}><Icon name={on ? 'check' : 'x'} size={11} /></span><span className="w-row__t">{t}</span><Toggle on={on} /></p>
      ))}
      <p className="w-row w-row--note"><small>Marketing publishes without a ticket.</small></p>
    </Panel>
  ),
}

/* ───────────── The workflows (the steps are the case's own) ───────────── */
const FLOWS = {
  'price-lock-checkout': ['Order placed', 'Price locked', 'Warehouse change', 'Absorbed or refunded', 'Paid'],
  'sku-substitution-engine': ['Stockout', 'Live inventory', 'Suggest nearest SKU', 'Operator confirms', 'Price held'],
  'retention-reminders': ['Order', 'Reminder', 'Repeat order', 'Referral'],
  'search-discovery': ['Query', 'Intent', 'Rank', 'Result'],
  'ai-automation': ['Call in', 'Detect intent', 'Automate or hand over', 'Log outcome'],
  'headless-cms-experimentation': ['Brief page', 'Build in CMS', 'QA and preview', 'Launch test', 'Measure CVR'],
}
const FLOW_IC = ['target', 'branch', 'layers', 'check', 'chart']
function Flow({ slug }) {
  const steps = FLOWS[slug] || []
  const hub = Math.floor((steps.length - 1) / 2)
  return (
    <div className="w-flow">
      <span className="w-flow__hub"><Icon name={FLOW_IC[1]} size={16} /></span>
      <ol className="w-flow__l">
        {steps.map((t, k) => (
          <li key={t} className={cx(k === hub && 'is-on', k === steps.length - 1 && 'is-end')}>
            <i aria-hidden="true" />
            <span className="w-flow__ic"><Icon name={k === steps.length - 1 ? 'check' : FLOW_IC[k % FLOW_IC.length]} size={12} /></span>
            <b>{t}</b>
            <Toggle on={k <= hub || k === steps.length - 1} />
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ───────────── The outcome: the case's own figure, on a plain chart ───────────── */
function Result({ c }) {
  const [v, l] = c.metrics[0]
  const ab = /^([\d.]+)\s*→\s*([\d.]+)%$/.exec(String(c.impact?.rows?.[0]?.[0] || '').trim())
  return (
    <Panel title="Outcome" icon="chart" className="w-panel--md w-result">
      {ab ? (
        <div className="w-ab">
          <p><small>Before</small><i style={{ height: `${ab[1]}%` }} /><b>{ab[1]}%</b></p>
          <p className="is-on"><small>After</small><i style={{ height: `${ab[2]}%` }} /><b>{ab[2]}%</b></p>
        </div>
      ) : (
        <svg className="w-spark" viewBox="0 0 220 70" preserveAspectRatio="none" aria-hidden="true">
          <path className="w-spark__a" d="M0 60 C30 58 50 55 76 52 S120 40 146 30 S190 14 220 8 L220 70 L0 70 Z" />
          <path className="w-spark__l" d="M0 60 C30 58 50 55 76 52 S120 40 146 30 S190 14 220 8" />
        </svg>
      )}
      <p className="w-result__v"><b>{v}</b><span>{l}</span></p>
    </Panel>
  )
}

export const WIRE_KINDS = [['screen', 'The screen'], ['flow', 'The workflow'], ['result', 'The outcome']]

/** One view of a case: kind is 'screen', 'flow' or 'result'. */
export function Wire({ c, kind = 'screen' }) {
  const S = SCREENS[c.slug]
  return (
    <div className={cx('w', `w--${kind}`, `w--${c.slug}`)} role="img" aria-label={`${kind === 'flow' ? 'Workflow' : kind === 'result' ? 'Outcome' : 'Screen'} of ${c.title}`}>
      {kind === 'screen' && S && <S />}
      {kind === 'flow' && <Flow slug={c.slug} />}
      {kind === 'result' && <Result c={c} />}
    </div>
  )
}
