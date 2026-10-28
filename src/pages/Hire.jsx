import { gtm } from '../content'
import { Button, Cta, Kin, LinkArrow } from '../components/ui'
import { Icon } from '../components/icons'
import { Chip, Dot, Gantt, KHead, KSection, ListTabs, StepTabs, TINTS, Tile, Win } from '../components/kit'
import { RoqivaFounder } from '../components/folio'
import { AppWin, Paint } from '../components/paint'
import { ScrollStory, Transform } from '../components/v5'
import { ConsultMapScene } from '../scenes/ConsultMap'
import { AsciiCanvas } from '../components/ascii'
import { PageMotion } from '../lib/PageMotion'

/* Hire: what I build, how a project runs, who it fits. Every widget below is an illustration and is labelled as one. */

const LAYERS = [
  { title: 'GTM engineering', sub: 'Make every signal actionable', d: 'Instrument the journey, recover intent and connect acquisition with conversion.', steps: ['Acquisition signal', 'Customer intent', 'Conversion loop'], status: 'Available as consulting', tint: 'peach' },
  { title: 'Revenue operations', sub: 'Make the decisions repeatable', d: 'Govern data, decision rules and handoffs between the people and tools that actually deliver.', steps: ['Trustworthy data', 'Operating rule', 'Measured action'], status: 'Available as consulting', tint: 'lilac' },
  { title: 'ROQIVA', sub: 'Build the intelligence layer', d: 'Founder-led software in development to surface signals, prepare evidence and preserve human approval.', steps: ['Detect the signal', 'Draft the action', 'Human approval'], status: 'Independent product · in development', tint: 'mint' },
]

/** One small, different widget per service. Shapes only: no numbers, nothing to mistake for a result. */
function Mini({ i, s }) {
  const w = [86, 64, 41, 22]
  if (i === 0) return <div className="k-mini"><ul className="k-mini__bars">{w.map((x, k) => <li key={k}><i style={{ width: `${x}%` }} /><span>Finding {k + 1}</span></li>)}</ul></div>
  if (i === 1) return <div className="k-mini k-mini--route"><span className="k-pill k-pill--on">{s.flow[0]}</span><div><span className="k-pill">Transient error → retry</span><span className="k-pill">Hard decline → human</span><span className="k-pill k-pill--on">Warm intent → nudge</span></div></div>
  if (i === 2) return <div className="k-mini k-mini--states">{['New', 'Active', 'Due', 'Lapsing', 'Won back'].map((x, k) => <span key={x} className={k === 2 ? 'k-pill k-pill--on' : 'k-pill'}>{x}</span>)}</div>
  if (i === 3) return <div className="k-mini"><ol className="k-mini__q">{['Signal', 'Opportunity', 'Owner'].map((x, k) => <li key={x}><b>{k + 1}</b>{x}<Chip>{['ranked', 'sized', 'assigned'][k]}</Chip></li>)}</ol></div>
  if (i === 4) return <div className="k-mini k-mini--flow">{s.flow.slice(0, 4).map((x, k) => <span key={x} className="k-pill">{x}</span>)}</div>
  return <div className="k-mini k-mini--ab"><div><small>Held back</small><i style={{ height: '46%' }} /></div><div><small>Treated</small><i className="on" style={{ height: '72%' }} /></div><p>Lift = the gap between the two bars</p></div>
}

function Service({ s, i }) {
  return (
    <Tile tint={TINTS[i % 5]} className="k-svc k-c4">
      <p className="k-tile__k"><b>{s.code}</b>{s.cat}</p>
      <Win title={s.official} tag="Illustration" className="k-svc__win"><Mini i={i} s={s} /></Win>
      <h3>{s.name}</h3>
      <p>{s.line}</p>
      <dl className="k-svc__f"><div><dt>First result</dt><dd>{s.first}</dd></div><div><dt>Model</dt><dd>{s.model}</dd></div></dl>
      <LinkArrow to="/contact?intent=consult#brief">Discuss the scope</LinkArrow>
    </Tile>
  )
}

export default function Hire() {
  const rows = gtm.phases.map((p, i) => ({ label: p.label, sub: p.weeks, a: p.start, b: p.start + p.span, tone: TINTS[i] }))
  return (
    <PageMotion routeKey="/hire">
      <header className="k-jhero k-hhero">
        <div className="container k-jhero__in">
          <div className="k-jhero__copy">
            <p className="k-rule"><b>[00]</b><span>Selective consulting</span><i /><small>/ Hire</small></p>
            <h1 data-kin data-kin-hero><Kin text="Build the ==systems==" /><br /><em><Kin text="behind growth." /></em></h1>
            <p className="k-lead">I work where your product, CRM, analytics and operations meet. GTM engineering finds the leak. RevOps fixes the loop. ROQIVA is the product I’m founding to make the method repeatable.</p>
            <p className="k-actions"><Button to="/contact?intent=consult#brief">Discuss a project <Icon name="arrow" size={15} /></Button><LinkArrow to="#system">Explore the system</LinkArrow></p>
            <small className="k-hhero__n"><Dot tone="ok" /> Open to the right product role, too. <a href="/contact?intent=job#brief">Let’s talk ↗</a></small>
          </div>
          <Paint name="dusk" className="k-hhero__vis v-hhero">
            <Transform />
          </Paint>
        </div>
      </header>

      <KSection id="story">
        <KHead n="01" label="The idea" tag="Scroll through one decision" title="One decision," sub="==five stages==." lead="One customer, one refill window, five stages. This is the loop I build for clients, and the loop ROQIVA is designed to run." />
        <ScrollStory />
      </KSection>

      <KSection id="build" tone="soft">
        <KHead n="02" label="What gets built" tag="Moving parts" title="Signals in, ==decisions out==," sub="and a person at every gate that matters." lead="Events from the tools you already run resolve to one customer, detectors find the leak, a decision layer chooses the action, and a held-back group proves the lift." />
        <div className="v-cmap__solo" data-reveal><ConsultMapScene /></div>
      </KSection>

      <KSection id="system">
        <KHead n="03" label="One commercial system" tag="Three connected layers" title="From the first signal" sub="to the next ==measured outcome==." lead="Each layer solves a different part of the same problem." />
        <ListTabs items={LAYERS} label="Explore the architecture">
          {(l, i) => (
            <Tile tint={l.tint} reveal={false} className="k-layer">
              <p className="k-tile__k"><b>0{i + 1}</b>{l.status}</p>
              <div className="k-layer__art"><AsciiCanvas scene={['signals', 'handoff', 'gate'][i]} label={`Animated drawing for ${l.title}`} /></div>
              <h3>{l.sub}.</h3>
              <p>{l.d}</p>
              <ol className="k-chev">{l.steps.map((x, k) => <li key={x}><b>{k + 1}</b>{x}</li>)}</ol>
            </Tile>
          )}
        </ListTabs>
      </KSection>

      <KSection id="consulting" tone="soft">
        <KHead n="04" label="Engagements" tag="Six ways to start" title="Start with" sub="the ==constraint==." lead="A focused audit or a production-ready workflow: I scope the work around what has to change." />
        <div className="k-bento">{gtm.services.slice(0, 6).map((s, i) => <Service key={s.id} s={s} i={i} />)}</div>
      </KSection>

      <KSection id="process">
        <KHead n="05" label="How a project runs" tag="Twelve weeks, typically" title="Less theatre." sub="More ==shipped decisions==." lead="Find the problem, define the guardrails, build the fix, and measure its effect. Timelines depend on scope." />
        <div className="k-bento">
          <Tile className="k-c7 k-proc"><StepTabs steps={gtm.phases} label="Project phases">
            {(p) => (
              <div className="k-proc__p">
                <h3>{p.label}<small>{p.weeks}</small></h3>
                <p>{p.does}</p>
                <dl><div><dt>Your input</dt><dd>{p.you}</dd></div><div><dt>Deliverable</dt><dd>{p.out}</dd></div></dl>
              </div>
            )}
          </StepTabs></Tile>
          <div className="k-c5" data-reveal>
            <Paint name="noon" className="v-road k-proc__g">
              <AppWin title="Twelve weeks" tag="Weeks from kickoff">
                <Gantt rows={rows} from={0} to={12} ticks={[0, 3, 6, 9, 12]} labelW={112} caption="Project phases across twelve weeks" />
              </AppWin>
            </Paint>
          </div>
        </div>
      </KSection>

      <KSection id="fit" tone="soft">
        <KHead n="06" label="Fit check" tag="Before we talk" title="Who this is ==for==," sub="and who it is not." />
        <div className="k-bento">
          <Tile tint="mint" className="k-c6 k-fit"><h3>A good fit</h3><ul>{gtm.fitCheck.good.map((x) => <li key={x}><Icon name="check" size={15} />{x}</li>)}</ul></Tile>
          <Tile className="k-c6 k-fit k-fit--no"><h3>Not what I do</h3><ul>{gtm.fitCheck.not.map((x) => <li key={x}><span aria-hidden="true">–</span>{x}</li>)}</ul></Tile>
        </div>
      </KSection>

      <KSection id="roqiva"><RoqivaFounder compact /></KSection>

      <KSection id="role">
        <Tile tint="lilac" className="k-rolecta">
          <div><h2 className="k-h">A builder in your <em>product team.</em></h2><p className="k-lead">Alongside consulting, I’m open to conversations about owning consumer, growth and platform products — from discovery through delivery and measurement.</p></div>
          <Button to="/contact?intent=job#brief" variant="ghost">Talk about a product role <Icon name="arrow" size={15} /></Button>
        </Tile>
      </KSection>

      <Cta title="Bring a ==real constraint==. *Let's design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}
