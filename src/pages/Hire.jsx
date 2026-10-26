import { CASES, TOOLS, WINS, CERTS, EDU, hire as P, journeyPage } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, PageHero, Section } from '../components/ui'
import { WhereIFit } from '../components/folio'
import { PageMotion } from '../lib/PageMotion'

/* Hire: the fit. Where I fit (six seats), how I work, the twelve results, the experience, and how to start. */
export default function Hire() {
  const h = P.hero
  const xp = journeyPage.chapters.slice().reverse().flatMap((c) => c.roles.slice().reverse().map((r) => ({ ...r, ch: c.k })))
  return (
    <PageMotion routeKey="/hire">
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead}>
        <div className="hero__btns hero__a" style={{ '--i': 3 }}>
          <Button to={h.primary.to} track="cta_hire_hero">{h.primary.label}<Arrow /></Button>
          <Button href={h.secondary.href} variant="ghost" target="_blank" rel="noopener noreferrer">{h.secondary.label} ↗</Button>
        </div>
        <div className="open hero__a" style={{ '--i': 4 }}>
          <p className="label"><i />{h.open.label}</p>
          <ul>{h.open.roles.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="open__w">{h.open.where}</p>
        </div>
      </PageHero>

      <Section id="fit" rule={false}>
        <Head eyebrow={P.fit.eyebrow} title={P.fit.title} lead={P.fit.lead} />
        <WhereIFit />
      </Section>

      <Section id="moves" tone="alt">
        <Head eyebrow={P.moves.eyebrow} title={P.moves.title} lead={P.moves.lead} />
        <ol className="moves">
          {P.moves.items.map(([t, d], i) => <li key={t} className="move" data-reveal><span className="move__n">0{i + 1}</span><h3 className="h-3">{t}</h3><p className="muted">{d}</p></li>)}
        </ol>
      </Section>

      <Section id="results">
        <Head eyebrow={P.wins.eyebrow} title={P.wins.title} lead={P.wins.lead} />
        <ul className="ress">{WINS.map((w) => <li key={w.d} className="res" data-reveal><span className="label">{w.k}</span><strong>{w.v}</strong><p className="muted">{w.d}</p></li>)}</ul>
        <p className="more" data-reveal><LinkArrow to="/work">Read the case studies</LinkArrow></p>
      </Section>

      <Section id="experience" tone="alt">
        <Head eyebrow={P.xp.eyebrow} title={P.xp.title} lead={P.xp.lead} />
        <div className="xp">
          {xp.map((r) => (
            <article key={r.role + r.when} className="role" data-reveal>
              <div className="role__w label">{r.when}</div>
              <div className="role__c">
                <h3 className="h-3">{r.role}</h3>
                <p className="role__o">{r.org}</p>
                <p className="muted">{r.text}</p>
                {r.tags && <ul className="chips-sm">{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
              </div>
            </article>
          ))}
        </div>
        <p className="more" data-reveal><LinkArrow to="/journey">The full journey</LinkArrow></p>
      </Section>

      <Section id="toolbox">
        <div className="trio">
          <div data-reveal><h2 className="label">Strongest areas</h2><ul className="chips-sm">{P.strengths.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div data-reveal><h2 className="label">Toolbox</h2><ul className="chips-sm">{TOOLS.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div data-reveal><h2 className="label">Education and certifications</h2><ul className="plain">{EDU.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}{CERTS.slice(0, 4).map((c) => <li key={c}>{c}</li>)}</ul></div>
        </div>
      </Section>

      <Cta {...P.cta} />
    </PageMotion>
  )
}
