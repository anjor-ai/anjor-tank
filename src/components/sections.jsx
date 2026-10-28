import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Dot, DotMap, KHead, KSection, ListTabs, Tile, useClock } from './kit'
import { AppWin, Float, Paint } from './paint'
import { AsciiCanvas } from './ascii'
import { CareerGraph } from './v5'
import { ConsultMapScene } from '../scenes/ConsultMap'

/* Home sections composed from the kit and the painted stages: how I think, the story so far, consulting. */


/* ───────── How I think: the question, the real product illustration, the result ───────── */

const THINK = [
  { slug: 'price-lock-checkout', title: 'What happens when an order changes after payment?', sub: 'Keep the promise made at checkout.', tint: 'peach', paint: 'dawn', result: '+12.5pp', metric: 'prepaid conversion', rule: 'Committed price preserved' },
  { slug: 'search-discovery', title: 'Should a typo ever become a lost order?', sub: 'Understand the query before ranking the results.', tint: 'sky', paint: 'noon', result: '+9%', metric: 'search-to-order conversion', rule: 'Intent matched and results ranked' },
  { slug: 'retention-reminders', title: 'When does a reminder become genuinely useful?', sub: 'Match the reminder to the reorder window.', tint: 'mint', paint: 'meadow', result: '~1,100', metric: 'additional repeat orders a day', rule: 'Reorder cadence identified' },
]

/** How I work, as three instrument cards: each runs a small ASCII scene of the idea (scan, branch, loop). */
export function MethodTrio() {
  const items = [['find', 'Find the real problem.', 'Follow the friction across the journey, not just the screen.', 'Scan'], ['decide', 'Make the difficult call.', 'Turn the evidence into a decision with clear guardrails.', 'Branch'], ['loop', 'Close the loop.', 'Ship, measure the outcome, and use it to shape the next move.', 'Loop']]
  return (
    <ul className="v-mx">
      {items.map(([k, t, d, m], i) => (
        <li key={k} className="v-mx__c" data-reveal>
          <div className="v-mx__art">
            <AsciiCanvas scene={k} className="v-mx__cv" label={`An animated drawing: ${t}`} />
            <span className="v-mx__hud" aria-hidden="true"><b>{String(i + 1).padStart(2, '0')}</b>{m}<i /></span>
            <span className="v-mx__br" aria-hidden="true" />
          </div>
          <div className="v-mx__b"><h3>{t}</h3><p>{d}</p></div>
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


export function CareerSection() {
  const t = useClock()
  return (
    <KSection id="journey">
      <KHead n="03" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to building what delivers it." lead="Different roles. One growing curiosity about how products and businesses really work." />
      <div className="v-career">
        <Tile className="k-photo" reveal>
          <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
          <p className="k-photo__cap"><b>Anjor Tank</b><span>Curiosity is the through line.</span></p>
        </Tile>
        <div className="v-career__g" data-reveal>
          <Paint name="noon" className="v-road">
            <CareerGraph />
          </Paint>
        </div>
        <div className="v-career__row">
          <Tile tint="mint" className="k-now">
            <p className="k-tile__k"><Dot />Right now</p>
            <h3>Founder of ROQIVA. Product Manager, GNC India.</h3>
            <p><LinkArrow to="/journey">The story so far</LinkArrow></p>
          </Tile>
          <Tile tint="lilac" className="k-where">
            <p className="k-tile__k"><span>Based in</span></p>
            <DotMap city="Mumbai" caption="Dotted map with a pin on Mumbai" />
            <p className="k-where__t"><b>Mumbai</b><span>{t || 'India'}</span></p>
          </Tile>
        </div>
      </div>
    </KSection>
  )
}

/* ───────── Consulting: signals in, a decision layer, outputs ───────── */

export function ConsultSection() {
  return (
    <KSection id="consulting" tone="soft">
      <KHead n="04" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="between tools." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift." />
      <div className="v-cmap">
        <div className="v-cmap__side">
          <Tile className="v-consult__c"><p className="v-k"><b>01</b>GTM engineering</p><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></Tile>
          <Tile className="v-consult__c"><p className="v-k"><b>02</b>RevOps</p><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></Tile>
          <Tile tint="ink" className="v-cmap__bar">
            <p className="k-tile__k"><Dot tone="accent" />ROQIVA · Intelligence layer · in development</p>
            <h3>The product I am founding to make the method repeatable.</h3>
            <div className="k-bar__btns"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
          </Tile>
        </div>
        <div className="v-cmap__stage" data-reveal><ConsultMapScene /></div>
      </div>
    </KSection>
  )
}
