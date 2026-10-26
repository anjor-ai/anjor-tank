import { BELIEFS, CERTS, EDU, SKILLS, journeyPage as P } from '../content'
import { ArtCard } from '../components/Art'
import { Sticky } from '../components/Sticky'
import { Cta, Head, LinkArrow, PageHero, Section } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'

/* Journey: three chapters as a sticky story. Text steps on the left, the roles of that chapter on the right. */
function Roles({ ch }) {
  return (
    <div className="jrn" aria-label={`Chapter ${ch.k}: ${ch.t}`}>
      <div className="jrn__top"><span className="jrn__k">{ch.k}</span><span className="label">{ch.span}</span></div>
      <ol className="jrn__roles">
        {ch.roles.map((r) => (
          <li key={r.role + r.when} className="jrn__r">
            <span className="label jrn__w">{r.when}</span>
            <h3 className="h-4">{r.role}</h3>
            <p className="jrn__o">{r.org}</p>
            <p className="muted">{r.text}</p>
            {r.tags && <ul className="chips-sm">{r.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
            {r.to && <LinkArrow to={r.to}>{r.to === '/roqiva' ? 'Open ROQIVA' : 'Read the cases'}</LinkArrow>}
          </li>
        ))}
      </ol>
      <p className="jrn__l"><span className="label">The lesson</span>{ch.lesson}</p>
    </div>
  )
}

export default function Journey() {
  const items = P.chapters.map((ch) => ({
    id: `ch-${ch.k}`,
    eyebrow: `Chapter ${ch.k} · ${ch.span}`,
    title: ch.t,
    lead: ch.d,
    visual: () => <Roles ch={ch} />,
  }))
  return (
    <PageMotion routeKey="/journey">
      <PageHero eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead}
        visual={<figure className="portrait"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" decoding="async" /></figure>} visualLive />

      <Section id="chapters" rule={false}>
        <Sticky label="Three chapters" items={items} />
      </Section>

      <Section id="beliefs" tone="alt">
        <Head eyebrow={P.beliefs.eyebrow} title={P.beliefs.title} lead={P.beliefs.lead} />
        <ul className="acards acards--3">
          {BELIEFS.map((b, i) => (
            <ArtCard key={b.t} icon={['layers', 'chart', 'database'][i]} label={`0${i + 1}`} t={b.t} d={b.d}>
              <ul className="chips-sm">{b.chips.map((c) => <li key={c}>{c}</li>)}</ul>
            </ArtCard>
          ))}
        </ul>
      </Section>

      <Section id="learning">
        <div className="trio">
          <div data-reveal>
            <h2 className="label">{P.edu.eyebrow}</h2>
            <ul className="plain">{EDU.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
          </div>
          <div data-reveal>
            <h2 className="label">{P.certs.eyebrow}</h2>
            <ul className="plain">{CERTS.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div data-reveal>
            <h2 className="label">{P.skills.eyebrow}</h2>
            <ul className="chips-sm">{SKILLS.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Cta title="Walk me through *a part of this.*" lead="Pick a chapter, a case or a role. I will tell you what I would do differently." primary={{ label: 'Start a conversation', to: '/contact#brief' }} secondary={{ label: 'Read the cases', to: '/work' }} />
    </PageMotion>
  )
}
