import { useState } from 'react'
import { CASES, TAGS, work as P } from '../content'
import { Cta, PageHero, Section } from '../components/ui'
import { CaseCard } from '../components/folio'
import { WorkStage } from '../components/Story'
import { LinkArrow } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'

/* Work: seven cases, filterable. Each card opens its full case. */
export default function Work() {
  const [tag, setTag] = useState('All')
  const list = CASES.filter((c) => tag === 'All' || c.tag === tag)
  return (
    <PageMotion routeKey="/work">
      <PageHero variant="work" eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<WorkStage />} visualLive>
        <ul className="hero__facts label hero__a" style={{ '--i': 3 }}>{P.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHero>
      <Section id="cases" rule={false}><div className="v3-workintro"><div><h2 className="h-2">Explore the decisions behind the results.</h2><p className="lead">Six real systems across conversion, growth, search, platform and operations. Each case maps the problem, trade-offs, requirements and measurable outcomes.</p></div><div className="v3-workintro__aside">PRODUCT THINKING → SYSTEM DESIGN → BUSINESS OUTCOME <LinkArrow to="/hire">How I apply this in consulting</LinkArrow></div></div>
        <div className="chips-row" role="group" aria-label="Filter cases" data-reveal>
          {TAGS.map((t) => <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
        </div>
        <ul className={`cgrid cgrid--3${tag === 'All' ? ' cgrid--bento' : ''}`} aria-live="polite">{list.map((c) => <CaseCard key={c.slug} c={c} />)}</ul>
      </Section>
      <Cta title="Want this *done on your system?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
