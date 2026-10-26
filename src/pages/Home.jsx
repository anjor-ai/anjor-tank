import { CASES, ARC, gtm, home, roqiva } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, Rich, Section } from '../components/ui'
import { Icon } from '../components/icons'
import { Sticky } from '../components/Sticky'
import { CaseCard, CaseStack, LeakStrip, ProofStrip, WhereIFit } from '../components/folio'
import { WordReel } from '../art/Reel'
import { FindingCard } from '../diagrams/FindingCard'
import { HeroApp } from '../scenes/HeroApp'
import { PageMotion } from '../lib/PageMotion'
import { Stage } from '../showcase/primitives'

/* The home page is the hub of one story: proof → practice → system. Each step below opens a page of its own. */

const RQ_D = {
  overview: 'What it is, in numbers',
  origin: 'Why I am building it',
  workspace: 'The tool, clickable',
  parts: 'The parts that run it',
  flow: 'One work item, six steps',
  principle: 'Code, agents, people',
  stack: 'What stays in your cloud',
  ways: 'Two ways to adopt it',
  rules: 'Five rules it keeps',
}

function RoqivaBand() {
  const H = home.roqiva
  return (
    <Section id="roqiva" tone="band">
      <div className="rqh" data-reveal>
        <div className="rqh__id">
          <p className="label rqh__eyebrow"><i className="rqh__live" />{H.eyebrow}</p>
          <div className="rqh__name"><WordReel word="roq" size="foot" label={roqiva.name} /></div>
          <p className="rqh__full">{roqiva.fullName}</p>
          <h2 className="h-3 rqh__h"><Rich text={H.title} /></h2>
          <p className="rqh__lead">{H.lead}</p>
          <Button to={H.primary.to} className="rqh__btn">{H.primary.label}<Arrow /></Button>
        </div>
        <nav className="rqh__map" aria-label={H.explore}>
          <p className="label rqh__cap">{H.explore}</p>
          <ul>
            {roqiva.tool.menu.map((m, i) => (
              <li key={m.id}>
                <a href={`/roqiva#${m.id}`} className="rqh__item">
                  <span className="rqh__n">0{i + 1}</span>
                  <Icon name={m.icon} size={16} />
                  <span className="rqh__t"><b>{m.label}</b><small>{RQ_D[m.id]}</small></span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Section>
  )
}

const THREAD_VIS = {
  'th-work': () => <CaseStack />,
  'th-gtm': () => <LeakStrip />,
  'th-roq': () => <Stage tone="soft" label="A ROQIVA finding card, with sample data"><FindingCard /></Stage>,
}

export default function Home() {
  const h = home.hero
  return (
    <PageMotion routeKey="/">
      <header className="hero">
        <div className="container hero__in">
          <div className="hero__copy">
            <p className="label eyebrow hero__a" style={{ '--i': 0 }}>{h.eyebrow}</p>
            <h1 className="h-hero hero__a" style={{ '--i': 1 }}><Rich text={h.title} /></h1>
            <p className="lead hero__a" style={{ '--i': 2 }}>{h.lead}</p>
            <div className="hero__btns hero__a" style={{ '--i': 3 }}>
              <Button to={h.primary.to} track="cta_roqiva_hero">{h.primary.label}<Arrow /></Button>
              <Button to={h.secondary.to} variant="ghost">{h.secondary.label}</Button>
            </div>
            <ul className="hero__facts label hero__a" style={{ '--i': 5 }}>{h.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="hero__app hero__a" style={{ '--i': 3 }}><HeroApp brand="ROQIVA" /></div>
        </div>
      </header>

      <Section id="proof">
        <Head scrub eyebrow={home.proof.eyebrow} title={home.proof.title} lead={home.proof.lead} />
        <ProofStrip />
        <p className="more" data-reveal><LinkArrow to={home.proof.link[1]}>{home.proof.link[0]}</LinkArrow></p>
      </Section>

      <Section id="fit" tone="alt">
        <Head eyebrow={home.fit.eyebrow} title={home.fit.title} lead={home.fit.lead} />
        <WhereIFit />
        <p className="more" data-reveal><LinkArrow to={home.fit.link[1]}>{home.fit.link[0]}</LinkArrow></p>
      </Section>

      <Section id="story">
        <Sticky label="The story in three steps" items={home.thread.steps.map((s) => ({
          id: s.id,
          eyebrow: `${s.n} · ${s.eyebrow}`,
          title: s.title,
          lead: s.lead,
          extra: <p className="more"><LinkArrow to={s.link[1]}>{s.link[0]}</LinkArrow></p>,
          visual: THREAD_VIS[s.id],
        }))} />
      </Section>

      <RoqivaBand />

      <Section id="gtm">
        <Head scrub eyebrow={home.gtm.eyebrow} title={home.gtm.title} lead={home.gtm.lead} />
        <ul className="leaks">
          {gtm.problems.map((p, i) => (
            <li key={p.id} className="leak" data-reveal>
              <a href={`/gtm#leaks`}>
                <span className="label">0{i + 1} · {p.name}</span>
                <h3 className="h-4">{p.title}</h3>
                <p className="muted">{p.line}</p>
                <span className="leak__c"><i>Costs</i>{p.costs}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="more" data-reveal><LinkArrow to={home.gtm.link[1]}>{home.gtm.link[0]}</LinkArrow></p>
      </Section>

      <Section id="work" tone="alt">
        <Head eyebrow={home.work.eyebrow} title={home.work.title} lead={home.work.lead} />
        <ul className="deck" tabIndex={0} aria-label="Case studies, scroll sideways">
          {CASES.map((c) => <CaseCard key={c.slug} c={c} compact />)}
        </ul>
        <p className="more" data-reveal><LinkArrow to={home.work.link[1]}>{home.work.link[0]}</LinkArrow></p>
      </Section>

      <Section id="journey">
        <Head eyebrow={home.journey.eyebrow} title={home.journey.title} lead={home.journey.lead} />
        <ol className="arc">
          {ARC.map((a) => (
            <li key={a.k} className="arc__i" data-reveal>
              <span className="arc__k">{a.k}</span>
              <span className="label">{a.when}</span>
              <h3 className="h-3">{a.t}</h3>
              <p className="muted">{a.d}</p>
            </li>
          ))}
        </ol>
        <p className="more" data-reveal><LinkArrow to={home.journey.link[1]}>{home.journey.link[0]}</LinkArrow></p>
      </Section>

      <Cta {...home.cta} />
    </PageMotion>
  )
}
