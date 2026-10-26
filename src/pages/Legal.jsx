import { legal } from '../content'
import { PageHero, Section } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'

/** Privacy notice. Plain text, one column: easy to read and easy to quote. */
export default function Legal() {
  return (
    <PageMotion routeKey="/privacy">
      <PageHero eyebrow={legal.hero.eyebrow} title={legal.hero.title} lead={legal.hero.lead} />
      <Section rule={false}>
        <div className="legal">
          <p className="label">Last updated {legal.updated}</p>
          {legal.sections.map((s) => (
            <article key={s.h} className="legal__s">
              <h2 className="h-3">{s.h}</h2>
              {s.p.map((t) => <p key={t}>{t}</p>)}
            </article>
          ))}
        </div>
      </Section>
    </PageMotion>
  )
}
