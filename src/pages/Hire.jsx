import { TOOLS, consulting as C, gtm, hire as P } from '../content'
import { Arrow, Button, Cta, Head, PageHero, Section } from '../components/ui'
import { RoqivaFounder, WhereIFit } from '../components/folio'
import { Leaks, Phases } from '../components/gtm'
import { PageMotion } from '../lib/PageMotion'

/* Hire me: one page, three ways in. Join the team, consult on GTM engineering and RevOps, or build alongside ROQIVA. */
export default function Hire() {
  const h = P.hero
  return (
    <PageMotion routeKey="/hire">
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead}>
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

      <Section id="consulting" tone="alt">
        <Head eyebrow={C.eyebrow} title={C.title} lead={C.lead} />
        <h3 className="label gap-top">{C.leaks.title.replace(/\*/g, '')}</h3>
        <Leaks />
        <h3 className="label gap-top">{C.offers.title.replace(/\*/g, '')}</h3>
        <ol className="rows6" id="offers" data-reveal>
          {gtm.services.map((o) => (
            <li key={o.id}><span className="offer__c">{o.code}</span><b>{o.name}</b><span className="muted">{o.line}</span><small>{o.first} · {o.model}</small></li>
          ))}
        </ol>
        <h3 className="label gap-top">{C.process.title.replace(/\*/g, '')}</h3>
        <Phases />
        <p className="more" data-reveal><Button to={C.cta.to}>{C.cta.label}<Arrow /></Button></p>
      </Section>

      <Section id="roqiva" tone="band"><RoqivaFounder compact /></Section>

      <Cta {...P.cta} />
    </PageMotion>
  )
}
