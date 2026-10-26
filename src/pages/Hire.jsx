import { TOOLS, consulting as C, hire as P } from '../content'
import { Arrow, Button, Cta, Head, PageHero, Section } from '../components/ui'
import { RoqivaFounder, WhereIFit } from '../components/folio'
import { HireHeroVisual } from '../components/Editorial'
import { Leaks, Phases } from '../components/gtm'
import { SystemStory } from '../components/system'
import { Kinetic } from '../components/kinetic'
import { PageMotion } from '../lib/PageMotion'

/* Hire me: one page, three ways in. Join the team, consult on GTM engineering and RevOps, or build alongside ROQIVA.
   The consulting part is one story: find the leak, fix the loop, prove the lift, run it in ROQIVA. */
export default function Hire() {
  const h = P.hero
  return (
    <PageMotion routeKey="/hire">
      <PageHero variant="hire" eyebrow={h.eyebrow} title={h.title} lead={h.lead} visual={<HireHeroVisual />}>
        <div className="hero__btns hero__a" style={{ '--i': 3 }}>
          <Button to={h.primary.to} track="cta_hire_hero">{h.primary.label}<Arrow /></Button>
          <Button href={h.secondary.href} variant="ghost">{h.secondary.label} ↗</Button>
        </div>
        <ol className="ways hero__a" style={{ '--i': 4 }}>
          {h.ways.map((w) => <li key={w.n}><a href={w.to}><span className="label">{w.n}</span><b>{w.t}</b><span>{w.d}</span></a></li>)}
        </ol>
      </PageHero>

      <Section id="fit" rule={false}>
        <Head eyebrow={P.fit.eyebrow} title={P.fit.title} />
        <WhereIFit />
        <ul className="chips-sm gap-top" data-reveal>{TOOLS.slice(0, 14).map((t) => <li key={t}>{t}</li>)}</ul>
      </Section>

      <Kinetic rows={['GTM engineering', 'RevOps', 'ROQIVA']} />

      <Section id="system" tone="alt">
        <Head eyebrow={C.eyebrow} title={C.title} lead={C.lead} />
        <SystemStory />
      </Section>

      <Section id="consulting">
        <h3 className="label">{C.leaks.title.replace(/\*/g, '')}</h3>
        <Leaks />
        <h3 className="label gap-top">{C.process.title.replace(/\*/g, '')}</h3>
        <Phases />
        <p className="more" data-reveal><Button to={C.cta.to}>{C.cta.label}<Arrow /></Button></p>
      </Section>

      <Section id="roqiva" tone="band"><RoqivaFounder compact /></Section>

      <Cta {...P.cta} />
    </PageMotion>
  )
}
