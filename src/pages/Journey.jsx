import { BELIEFS, EDU, journeyPage as P } from '../content'
import { SectionNav } from '../components/SectionNav'
import { Cta, Head, LinkArrow, PageHero, Section } from '../components/ui'
import { Icon } from '../components/icons'
import { EduPath, HelloFlicker, JourneyStage, useInView } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

/* Journey: a route in three chapters. The chapter sits still on the left while its roles scroll past as boarding passes. */
const OPEN = [['Demand', 'I · HOW DEMAND IS MADE'], ['Systems', 'II · THE SYSTEMS UNDERNEATH'], ['ROQIVA', 'III · THE SYSTEM THAT RUNS THEM']]
const TINT = ['peach', 'sky', 'lilac']

function Ticket({ r }) {
  return (
    <li className={`tkt${r.now ? ' is-now' : ''}`}>
      <div className="tkt__top">
        <span className="tkt__mono" aria-hidden="true">{r.mono}</span>
        <div><h3 className="h-4">{r.role}</h3><p className="tkt__org">{r.org}</p></div>
        <span className="tkt__when label">{r.now && <i />}{r.when}</span>
      </div>
      <p className="tkt__text">{r.text}</p>
      {r.stats && <ul className="tkt__stats">{r.stats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>}
      {(r.tags || r.to) && (
        <div className="tkt__foot">
          {r.tags && <ul className="chips-sm">{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
          {r.to && <LinkArrow to={r.to}>{r.to === '/roqiva' ? 'Open ROQIVA' : 'Read the cases'}</LinkArrow>}
        </div>
      )}
    </li>
  )
}

function Chapter({ ch, i }) {
  const [ref, on] = useInView(0.12)
  return (
    <article id={`ch-${ch.k}`} ref={ref} className={`chp chp--${TINT[i]}${on ? ' is-in' : ''}`} aria-label={`Chapter ${ch.k}: ${ch.t}`}>
      <div className="chp__side">
        <span className="chp__num" aria-hidden="true">{ch.k}</span>
        <p className="chp__meta"><span className="label">Chapter {ch.k}</span><span className="label">{ch.span}</span></p>
        <h2 className="h-2">{ch.t}</h2>
        <p className="lead">{ch.d}</p>
        <blockquote className="chp__lesson"><span className="label">The lesson</span><p>{ch.lesson}</p></blockquote>
      </div>
      <ol className="chp__roles">{ch.roles.map((r) => <Ticket key={r.role + r.when} r={r} />)}</ol>
    </article>
  )
}

export default function Journey() {
  const nav = P.chapters.map((ch) => ({ id: `ch-${ch.k}`, label: `${ch.k} · ${ch.t}` }))
  return (
    <PageMotion routeKey="/journey">
      <PageHero variant="journey" eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<JourneyStage />} visualLive opener={<HelloFlicker words={OPEN} label="Demand, systems, ROQIVA" />} />
      <SectionNav items={nav} label="Three chapters" />

      <Section id="chapters" rule={false}>
        <div className="trl">{P.chapters.map((ch, i) => <Chapter key={ch.k} ch={ch} i={i} />)}</div>
      </Section>

      <Section id="beliefs" tone="alt">
        <Head eyebrow={P.beliefs.eyebrow} title={P.beliefs.title} />
        <ul className="blf">
          {BELIEFS.map((b, i) => (
            <li key={b.t} className={`blf__c blf__c--${TINT[i]}`} data-reveal>
              <span className="blf__n" aria-hidden="true">0{i + 1}</span>
              <span className="blf__i"><Icon name={['layers', 'chart', 'database'][i]} size={26} /></span>
              <h3 className="h-3">{b.t}</h3>
              <p>{b.d}</p>
              <ul className="chips-sm">{b.chips.map((c) => <li key={c}>{c}</li>)}</ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="learning">
        <Head eyebrow="Education" title="Where the *foundations* came from." />
        <EduPath edu={EDU} />
      </Section>

      <Cta title="Ask me *about any of it.*" lead="Pick a chapter, a case or a role." primary={{ label: 'Start a conversation', to: '/contact#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
