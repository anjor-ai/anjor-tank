import { useState } from 'react'
import { CASES, TAGS, work as P } from '../content'
import { Cta, LinkArrow, PageHero } from '../components/ui'
import { KHead, KSection } from '../components/kit'
import { CaseTile } from '../components/sections'
import { WorkStage } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

/* Work: six cases, filterable. The whole tile is the link to the full case. */
export default function Work() {
  const [tag, setTag] = useState('All')
  const list = CASES.filter((c) => tag === 'All' || c.tag === tag)
  return (
    <PageMotion routeKey="/work">
      <PageHero variant="work" eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<WorkStage />} visualLive>
        <ul className="hero__facts label hero__a" style={{ '--i': 3 }}>{P.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHero>
      <KSection id="cases">
        <KHead n="01" label="All six systems" tag="Product thinking to business outcome" title="Explore the decisions" sub="behind the results." lead="Six real systems across conversion, growth, search, platform and operations. Each case maps the problem, trade-offs, requirements and measurable outcomes.">
          <LinkArrow to="/hire">How I apply this in consulting</LinkArrow>
        </KHead>
        <div className="k-filter" role="group" aria-label="Filter cases" data-reveal>
          {TAGS.map((t) => <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
        </div>
        <div className="k-bento k-bento--grid" aria-live="polite">
          {list.map((c) => <CaseTile key={c.slug} c={c} size="third" className="k-c4" />)}
        </div>
      </KSection>
      <Cta title="Want this *done on your system?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
