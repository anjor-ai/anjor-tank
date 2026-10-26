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

/* 02 · SKU substitution engine */
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

/* 03 · Retention reminders */
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

/* 04 · Search and discovery */
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

/* 05 · AI and automation */
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

/* 06 · Headless CMS and experimentation */
function Cms() {
  return (
    <Frame title="Page builder · campaign page" flow={['Brief page', 'Build in CMS', 'QA and preview', 'Launch test', 'Measure CVR']}>
      <div className="mk__split">
        <div className="mk__side">
          <p className="label">Modules</p>
          <ul className="mk__blocks"><li>Hero banner</li><li className="is-on">Offer strip</li><li>Social proof</li><li className="is-on">Sticky CTA</li></ul>
          <p className="mk__note">Marketing publishes without a ticket.</p>
        </div>
        <div className="mk__side">
          <p className="label">Experiment</p>
          <ul className="mk__kv"><li><span>Variant A</span><b>Control</b></li><li><span>Variant B</span><b className="is-up">+1.7% CVR</b></li><li><span>Tracking</span><b>Verified</b></li></ul>
          <div className="mk__ev is-ok"><b>QA passed</b><span>Links, tags and layout checked</span></div>
        </div>
      </div>
    </Frame>
  )
}

const MOCKS = {
  'price-lock-checkout': Checkout,
  'sku-substitution-engine': Substitution,
  'retention-reminders': Loops,
  'search-discovery': Search,
  'ai-automation': Automation,
  'headless-cms-experimentation': Cms,
}

/** The illustration for one case, picked by slug. */
export function CaseMock({ slug }) {
  const M = MOCKS[slug]
  return M ? <M /> : null
}
