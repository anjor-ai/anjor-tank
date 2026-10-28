import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Dot, DotMap, KHead, KSection, pad, useClock } from './kit'
import { Paint } from './paint'
import { AsciiCanvas } from './ascii'
import { CareerGraph } from './v5'
import { Icon } from './icons'
import { Shader } from '../system/Shader'
import { ConsultMapScene } from '../scenes/ConsultMap'

/* Home sections. How I think stacks; the method reads like an onboarding; the story is a persona sheet;
   consulting sits on a shader. Every window stays on a painting or a shader; words stay on paper. */

/* ───────── How I think: three cards that stick and stack, each a question beside its product ───────── */
const THINK = [
  { slug: 'price-lock-checkout', title: 'What happens when an order changes after payment?', sub: 'Keep the promise made at checkout.', paint: 'dawn', result: '+12.5pp', metric: 'prepaid conversion', rule: 'Committed price preserved' },
  { slug: 'search-discovery', title: 'Should a typo ever become a lost order?', sub: 'Understand the query before ranking the results.', paint: 'noon', result: '+9%', metric: 'search-to-order conversion', rule: 'Intent matched and results ranked' },
  { slug: 'retention-reminders', title: 'When does a reminder become genuinely useful?', sub: 'Match the reminder to the reorder window.', paint: 'meadow', result: '~1,100', metric: 'additional repeat orders a day', rule: 'Reorder cadence identified' },
]

function ThinkStack() {
  return (
    <ol className="tk" data-stack>
      {THINK.map((s, k) => (
        <li key={s.slug} className="tk__card" style={{ '--k': k }}>
          <div className="tk__copy">
            <p className="tk__n"><b>{pad(k + 1)}</b><span>{s.rule}</span></p>
            <h3>{s.title}</h3>
            <p className="tk__sub">{s.sub}</p>
            <a className="tk__res" href={`/work/${s.slug}`}><b>{s.result}</b><span>{s.metric}</span><em>Read the case<Arrow /></em></a>
          </div>
          <Paint name={s.paint} fit="bleed" className="tk__paint" tilt={false}>
            <div className="tk__mock"><CaseMock slug={s.slug} /></div>
          </Paint>
        </li>
      ))}
    </ol>
  )
}

/** How I work, as three onboarding cards: the step and its line on paper, a painted panel holding a dark window
    that runs an ASCII scene of the idea, then "1 of 3". */
export function MethodTrio() {
  const items = [['find', 'Find the real problem.', 'Follow the friction across the journey, not just the screen.', 'Scan', 'dawn'], ['decide', 'Make the difficult call.', 'Turn the evidence into a decision with clear guardrails.', 'Branch', 'dusk'], ['loop', 'Close the loop.', 'Ship, measure the outcome, and use it to shape the next move.', 'Loop', 'meadow']]
  return (
    <ul className="ob">
      {items.map(([k, t, d, m, paint], i) => (
        <li key={k} className="ob__c" data-reveal>
          <div className="ob__top"><h3>{t}</h3><span className="ob__x" aria-hidden="true"><Icon name="arrow" size={14} /></span></div>
          <p>{d}</p>
          <div className="ob__art">
            <img src={`/img/paint/${paint}.webp`} alt="" width="1600" height="1000" loading="lazy" decoding="async" />
            <div className="ob__win">
              <span className="ob__bar" aria-hidden="true"><i /><i /><i /><b>{m}</b></span>
              <AsciiCanvas scene={k} className="ob__cv" label={`An animated drawing: ${t}`} />
            </div>
          </div>
          <footer className="ob__f"><span>{i + 1} of {items.length}</span><span className="ob__pill">{m}</span></footer>
        </li>
      ))}
    </ul>
  )
}

export function ThinkingSection() {
  return (
    <KSection id="method" tone="soft">
      <KHead n="02" label="How I think" tag="Product decisions" title="A great interface is just" sub="the ==visible part==." lead="The product is the decision beneath it. I connect customer experience with the systems that deliver it, and the metrics that prove it worked." />
      <ThinkStack />
      <MethodTrio />
    </KSection>
  )
}

/* ───────── The story so far, as a persona sheet: the portrait, where I am now, where I am, then the roadmap ───────── */
export function CareerSection() {
  const t = useClock()
  return (
    <KSection id="journey">
      <KHead n="03" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to ==building what delivers it==." lead="Different roles. One growing curiosity about how products and businesses really work." />
      <div className="ps">
        <figure className="ps__photo" data-clip>
          <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
          <figcaption><span><b>Anjor Tank</b><small>Curiosity is the through line.</small></span><i className="ps__qr" aria-hidden="true" /></figcaption>
        </figure>
        <div className="ps__side">
          <article className="ps__c" data-reveal>
            <p className="ps__h"><span className="ps__ic"><Dot /></span>Right now</p>
            <h3>Founder of ROQIVA. Product Manager, GNC India.</h3>
            <p><LinkArrow to="/journey">The story so far</LinkArrow></p>
          </article>
          <article className="ps__c ps__c--map" data-reveal>
            <p className="ps__h"><span className="ps__ic"><Icon name="pin" size={14} /></span>Based in</p>
            <DotMap city="Mumbai" caption="Dotted map with a pin on Mumbai" />
            <p className="ps__city"><b>Mumbai</b><span>{t || 'India'}</span></p>
          </article>
        </div>
        <div className="ps__road" data-reveal>
          <Paint name="noon" fit="center" className="ps__paint" tilt={false}><CareerGraph /></Paint>
        </div>
      </div>
    </KSection>
  )
}

/* ───────── Consulting: the system map on a shader, the three ways in below it ───────── */
export function ConsultSection() {
  return (
    <KSection id="consulting" tone="soft">
      <KHead n="04" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="==between tools==." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift." />
      <div className="gt" data-clip>
        <Shader preset="violet" className="gt__bg" />
        <div className="gt__map"><ConsultMapScene /></div>
      </div>
      <div className="gt__row">
        <article className="gt__c" data-reveal><p className="ps__h"><span className="ps__ic">01</span>GTM engineering</p><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></article>
        <article className="gt__c" data-reveal><p className="ps__h"><span className="ps__ic">02</span>RevOps</p><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></article>
        <article className="gt__c gt__c--ink" data-reveal>
          <p className="ps__h"><span className="ps__ic"><Dot tone="accent" /></span>ROQIVA · Intelligence layer · in development</p>
          <h3>The product I am founding to make the method repeatable.</h3>
          <div className="gt__btns"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
        </article>
      </div>
    </KSection>
  )
}
