import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Dot, DotMap, Flow, Gantt, KHead, KSection, ListTabs, Tile, useClock } from './kit'
import { AppWin, Float, Paint } from './paint'

/* Home sections composed from the kit and the painted stages: how I think, the story so far, consulting. */


/* ───────── How I think: the question, the real product illustration, the result ───────── */

const THINK = [
  { slug: 'price-lock-checkout', title: 'What happens when an order changes after payment?', sub: 'Keep the promise made at checkout.', tint: 'peach', paint: 'dawn', result: '+12.5pp', metric: 'prepaid conversion', rule: 'Committed price preserved' },
  { slug: 'search-discovery', title: 'Should a typo ever become a lost order?', sub: 'Understand the query before ranking the results.', tint: 'sky', paint: 'noon', result: '+9%', metric: 'search-to-order conversion', rule: 'Intent matched and results ranked' },
  { slug: 'retention-reminders', title: 'When does a reminder become genuinely useful?', sub: 'Match the reminder to the reorder window.', tint: 'mint', paint: 'meadow', result: '~1,100', metric: 'additional repeat orders a day', rule: 'Reorder cadence identified' },
]

/** Three dotted-grid cards with line art: find, decide, close the loop. One accent element each. */
function MethodArt({ kind }) {
  const cube = (x, y, s, on) => (
    <g key={`${x}-${y}`} className={on ? 'is-on' : ''}>
      <path d={`M${x} ${y - s} L${x + s * 0.87} ${y - s / 2} L${x} ${y} L${x - s * 0.87} ${y - s / 2}Z`} />
      <path d={`M${x - s * 0.87} ${y - s / 2} V${y + s / 2} L${x} ${y + s} V${y}`} />
      <path d={`M${x + s * 0.87} ${y - s / 2} V${y + s / 2} L${x} ${y + s}`} />
    </g>
  )
  if (kind === 'find') return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      {[104, 80, 56].map((y, i) => <path key={y} className={i === 1 ? 'is-fill' : ''} d={`M120 ${y - 24} L180 ${y} L120 ${y + 24} L60 ${y}Z`} />)}
      <path className="is-dash" d="M120 20 V122" /><circle className="is-dot" cx="120" cy="80" r="5.5" />
    </svg>
  )
  if (kind === 'decide') return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <path className="is-dash" d="M120 72 L66 100 M120 72 L174 100 M120 72 V34" />
      {cube(120, 56, 20, true)}{cube(60, 112, 18, false)}{cube(180, 112, 18, false)}
    </svg>
  )
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <circle className="is-dash" cx="120" cy="75" r="46" />
      {[[120, 29], [166, 75], [120, 121], [74, 75]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="4" />)}
      <g className="k-orbit"><circle className="is-dot" cx="166" cy="75" r="5.5" /></g>
    </svg>
  )
}

export function MethodTrio() {
  const items = [['find', 'Find the real problem.', 'Follow the friction across the journey, not just the screen.'], ['decide', 'Make the difficult call.', 'Turn the evidence into a decision with clear guardrails.'], ['loop', 'Close the loop.', 'Ship, measure the outcome, and use it to shape the next move.']]
  return (
    <ul className="k-trio">
      {items.map(([k, t, d], i) => (
        <li key={k} className="k-art" data-reveal>
          <span className="k-art__n">{String(i + 1).padStart(2, '0')}</span>
          <div className="k-art__fig"><MethodArt kind={k} /></div>
          <h3>{t}</h3><p>{d}</p>
        </li>
      ))}
    </ul>
  )
}

export function ThinkingSection() {
  return (
    <KSection id="method" tone="soft">
      <KHead n="02" label="How I think" tag="Product decisions" title="A great interface is just" sub="the visible part." lead="The product is the decision beneath it. I connect customer experience with the systems that deliver it, and the metrics that prove it worked." />
      <ListTabs items={THINK} label="Product decisions">
        {(s) => (
          <Paint name={s.paint} fit="bleed" className="v-think">
            <div className="v-think__mock"><CaseMock slug={s.slug} /></div>
            <Float className="v-think__res" depth={1.6}>
              <a href={`/work/${s.slug}`}><b>{s.result}</b><span>{s.metric}</span><em>Read the case<Arrow /></em></a>
            </Float>
          </Paint>
        )}
      </ListTabs>
      <MethodTrio />
    </KSection>
  )
}

/* ───────── The story so far: a roadmap, a photo, where I am now ───────── */

export const CAREER_ROWS = [
  { label: 'Eggfirst', sub: 'Client services · 2022', a: 2022.25, b: 2022.75, tone: 'butter' },
  { label: 'Neil Patel Digital', sub: 'Management trainee · 2023', a: 2023.67, b: 2023.95, tone: 'sky' },
  { label: 'Truemeds', sub: 'Associate PM · 2023 to 2026', a: 2023.92, b: 2026.5, tone: 'peach' },
  { label: 'GNC India', sub: 'Product Manager · Oct 2026', a: 2026.75, b: 2026.82, tone: 'mint', open: true },
  { label: 'ROQIVA', sub: 'Founder · in development', a: 2026.0, b: 2026.82, tone: 'accent', open: true },
]
export const NOW = 2026.82

export function CareerSection() {
  const t = useClock()
  return (
    <KSection id="journey">
      <KHead n="03" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to building what delivers it." lead="Different roles. One growing curiosity about how products and businesses really work." />
      <div className="k-bento k-bento--career">
        <Tile className="k-c4 k-r2 k-photo" reveal>
          <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
          <p className="k-photo__cap"><b>Anjor Tank</b><span>Curiosity is the through line.</span></p>
        </Tile>
        <div className="k-c8 k-career__road" data-reveal>
          <Paint name="noon" className="v-road">
            <AppWin title="Roles on one timeline" tag="2022 to now">
              <Gantt rows={CAREER_ROWS} from={2022} to={2027} ticks={[2022, 2023, 2024, 2025, 2026, 2027]} now={NOW} caption="Roles on one timeline, 2022 to now" />
              <p className="v-road__go"><LinkArrow to="/journey">The story so far</LinkArrow></p>
            </AppWin>
          </Paint>
        </div>
        <Tile tint="mint" className="k-c4 k-now">
          <p className="k-tile__k"><Dot />Right now</p>
          <h3>Product Manager, GNC India.</h3>
          <p>Founding ROQIVA, a system in development.</p>
        </Tile>
        <Tile tint="lilac" className="k-c4 k-where">
          <p className="k-tile__k"><span>Based in</span></p>
          <DotMap city="Mumbai" caption="Dotted map with a pin on Mumbai" />
          <p className="k-where__t"><b>Mumbai</b><span>{t || 'India'}</span></p>
        </Tile>
      </div>
    </KSection>
  )
}

/* ───────── Consulting: signals in, a decision layer, outputs ───────── */

export function ConsultSection() {
  return (
    <KSection id="consulting" tone="soft">
      <KHead n="04" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="between tools." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift." />
      <div className="v-consult">
        <Paint name="dusk" className="v-consult__paint">
          <Flow label="Product, CRM and analytics signals flow into one decision layer, then into finding the leak, fixing the loop and proving the lift"
            left={[{ icon: 'grid', label: 'Product' }, { icon: 'users', label: 'CRM' }, { icon: 'chart', label: 'Analytics' }]}
            hub={{ label: 'Decision layer', sub: 'GTM · RevOps' }}
            right={[{ icon: 'search', label: 'Find the leak' }, { icon: 'bolt', label: 'Fix the loop' }, { icon: 'check', label: 'Prove the lift' }]} />
        </Paint>
        <div className="v-consult__side">
          <Tile className="v-consult__c"><p className="v-k"><b>01</b>GTM engineering</p><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></Tile>
          <Tile className="v-consult__c"><p className="v-k"><b>02</b>RevOps</p><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></Tile>
        </div>
        <Tile tint="ink" className="k-bar v-consult__bar">
          <div><p className="k-tile__k"><Dot tone="accent" />ROQIVA · Intelligence layer · in development</p><h3>The product I am founding to make the method repeatable.</h3></div>
          <div className="k-bar__btns"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
        </Tile>
      </div>
    </KSection>
  )
}
