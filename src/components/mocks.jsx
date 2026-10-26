import { Icon } from './icons'

/* Product illustrations for each case: the screen or flow the system was built around, drawn in HTML with sample data.
   No real screenshots exist, so every figure says so. Numbers that appear in a metric come from the case; the rest is labelled sample. */

function Frame({ title, children, flow, note = 'Illustration with sample data' }) {
  return (
    <figure className="mk">
      <div className="mk__bar"><span className="mk__dots" aria-hidden="true"><i /><i /><i /></span><span className="mk__title">{title}</span></div>
      <div className="mk__body">{children}</div>
      {flow && <ol className="mk__flow" aria-label="Flow">{flow.map((f, i) => <li key={f} className={i === flow.length - 1 ? 'is-end' : ''}>{f}</li>)}</ol>}
      <figcaption className="label mk__cap">{note}</figcaption>
    </figure>
  )
}
const Pill = ({ tone = '', children }) => <span className={`mk__pill ${tone}`}>{children}</span>

/* 01 · Price Lock and checkout */
function Checkout() {
  return (
    <Frame title="Checkout · pay now" flow={['Order placed', 'Price locked', 'Warehouse change', 'Absorbed or refunded', 'Paid']}>
      <div className="mk__split">
        <div className="mk__phone">
          <p className="label">Your order</p>
          <ul className="mk__rows"><li><span>Item A × 2</span><b>₹ 420</b></li><li><span>Item B × 1</span><b>₹ 310</b></li><li><span>Delivery</span><b>Free</b></li></ul>
          <p className="mk__lock"><Icon name="lock" size={13} />Price locked at ₹ 730</p>
          <div className="mk__opts"><span className="is-on">UPI</span><span>Card</span><span className="is-off">Cash on delivery</span></div>
          <span className="mk__btn">Pay ₹ 730</span>
        </div>
        <div className="mk__side">
          <p className="label">At the warehouse</p>
          <div className="mk__ev is-warn"><b>+ ₹ 40</b><span>Batch change raised the price</span></div>
          <div className="mk__ev is-ok"><b>− ₹ 40</b><span>Absorbed as a discount on the bill</span></div>
          <p className="mk__note">The payable amount never changes after checkout.</p>
        </div>
      </div>
    </Frame>
  )
}

/* 02 · Coupons and cashback */
function Coupons() {
  return (
    <Frame title="Coupons · rule builder" flow={['Create rule', 'Target cohort', 'Best coupon applies', 'Cashback credited']}>
      <div className="mk__split">
        <div className="mk__phone">
          <p className="label">Offers for you</p>
          <ul className="mk__cards">
            <li className="is-best"><b>SAVE10</b><span>10% off · applied</span><Pill tone="ok">Best</Pill></li>
            <li><b>WELCOME</b><span>New users · app only</span></li>
            <li><b>CASHBACK</b><span>Credited to wallet</span></li>
          </ul>
          <p className="mk__lock"><Icon name="check" size={13} />You save more with SAVE10</p>
        </div>
        <div className="mk__side">
          <p className="label">Rule</p>
          <ul className="mk__kv"><li><span>Channel</span><b>App</b></li><li><span>Cohort</span><b>Lapsed 30d</b></li><li><span>Reward</span><b>Cashback</b></li><li><span>Expires</span><b>Alerts on</b></li></ul>
        </div>
      </div>
    </Frame>
  )
}

/* 03 · SKU substitution engine */
function Substitution() {
  return (
    <Frame title="Warehouse portal · order" flow={['Stockout', 'Live inventory', 'Suggest nearest SKU', 'Operator confirms', 'Price held']}>
      <table className="mk__tbl">
        <thead><tr><th>Item</th><th>Stock</th><th>Action</th></tr></thead>
        <tbody>
          <tr className="is-warn"><td>Item A · 10 tabs</td><td><Pill tone="warn">Out</Pill></td><td>Substitute</td></tr>
          <tr><td>Item B · 15 ml</td><td><Pill tone="ok">In</Pill></td><td>Pick</td></tr>
        </tbody>
      </table>
      <div className="mk__sug">
        <p className="label">Suggested for Item A</p>
        <ul className="mk__cards">
          <li className="is-best"><b>Item A2 · 10 tabs</b><span>Smallest price delta · in stock</span><Pill tone="ok">₹ 0 to customer</Pill></li>
          <li><b>Item A3 · 2 × 5 tabs</b><span>Same quantity</span><Pill>+ ₹ 6 absorbed</Pill></li>
        </ul>
      </div>
    </Frame>
  )
}

/* 04 · Growth loops */
function Loops() {
  return (
    <Frame title="Growth · the loop" flow={['Order', 'Reminder', 'Repeat order', 'Referral']}>
      <div className="mk__split">
        <div className="mk__phone">
          <p className="label">Notification</p>
          <div className="mk__push"><b>Time to refill?</b><span>Your regular order is ready in one tap.</span></div>
          <span className="mk__btn">Reorder</span>
        </div>
        <div className="mk__side">
          <p className="label">Page builder</p>
          <ul className="mk__blocks"><li>Hero banner</li><li>Offer strip</li><li className="is-on">Referral card</li></ul>
          <p className="mk__note">Growth edits and publishes without a ticket.</p>
          <div className="mk__ev is-warn"><b>Blocked</b><span>Same device claiming repeat rewards</span></div>
        </div>
      </div>
    </Frame>
  )
}

/* 05 · Search and discovery */
function Search() {
  return (
    <Frame title="Search · results" flow={['Query', 'Intent', 'Rank', 'Result']}>
      <div className="mk__phone mk__phone--wide">
        <p className="mk__q"><Icon name="search" size={14} />paracetamol 650</p>
        <ul className="mk__res">
          <li><b>Paracetamol 650 mg</b><span>Strip of 15 · in stock</span><Pill tone="ok">Best match</Pill></li>
          <li><b>Paracetamol 500 mg</b><span>Strip of 10</span></li>
        </ul>
        <p className="mk__q is-zero"><Icon name="search" size={14} />parcetamol</p>
        <p className="mk__fix"><Icon name="check" size={13} />Misspelling mapped to the right product. No empty page.</p>
      </div>
    </Frame>
  )
}

/* 06 · AI and automation */
function Automation() {
  const N = ({ k, t, tone = '' }) => <div className={`mk__node ${tone}`}><span className="label">{k}</span><b>{t}</b></div>
  return (
    <Frame title="Support · automation flow" flow={['Call in', 'Detect intent', 'Automate or hand over', 'Log outcome']}>
      <div className="mk__graph">
        <N k="Trigger" t="Customer calls" />
        <span className="mk__arrow" aria-hidden="true">→</span>
        <N k="Intent" t="Where is my order?" />
        <span className="mk__arrow" aria-hidden="true">→</span>
        <div className="mk__branch">
          <N k="Low complexity" t="Voice bot answers" tone="is-ok" />
          <N k="Needs a person" t="Agent with risk view" tone="is-warn" />
        </div>
      </div>
    </Frame>
  )
}

/* 07 · Internal ops and CX */
function Ops() {
  const col = (h, items) => <div className="mk__col"><p className="label">{h}</p>{items.map(([t, s, tone]) => <div key={t} className="mk__tk"><b>{t}</b><Pill tone={tone}>{s}</Pill></div>)}</div>
  return (
    <Frame title="CX · query board" flow={['Query in', 'One owner', 'SLA timer', 'Resolved']}>
      <div className="mk__board">
        {col('New', [['Refund query', '3h left', 'warn'], ['Delivery delay', '5h left', '']])}
        {col('Owned', [['Return pickup', 'Finance', ''], ['Wrong item', 'Warehouse', '']])}
        {col('Resolved', [['Refund issued', 'On time', 'ok']])}
      </div>
    </Frame>
  )
}

const MOCKS = {
  'price-lock-checkout': Checkout,
  'coupons-cashback': Coupons,
  'sku-substitution-engine': Substitution,
  'growth-loops': Loops,
  'search-discovery': Search,
  'ai-automation': Automation,
  'internal-ops-cx': Ops,
}

/** The illustration for one case, picked by slug. */
export function CaseMock({ slug }) {
  const M = MOCKS[slug]
  return M ? <M /> : null
}
