import { useState } from 'react'
import { CASES, TAGS, work as P } from '../content'
import { Cta, LinkArrow, PageHero } from '../components/ui'
import { KHead, KSection } from '../components/kit'
import { CaseCard } from '../components/v4'
import { WorkStage } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

/* Work: six cases, filterable, as onboarding-style cards: the title on paper, the system's window on a painting
   inset below it, its numbers at the foot. The first card of the list runs wide. The whole card links to the case. */
export default function Work() {
  const [tag, setTag] = useState('All')
  const list = CASES.filter((c) => tag === 'All' || c.tag === tag)
  return (
    <PageMotion routeKey="/work">
      <PageHero variant="work" eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<div className="ph2__win"><WorkStage /></div>} visualLive>
        <ul className="ph2__facts">{P.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHero>
      <KSection id="cases">
        <KHead n="01" label="All six systems" tag="Product thinking to business outcome" title="Explore the ==decisions==" sub="behind the results." lead="Six real systems across conversion, growth, search, platform and operations. Each case maps the problem, trade-offs, requirements and measurable outcomes.">
          <LinkArrow to="/hire">How I apply this in consulting</LinkArrow>
        </KHead>
        <div className="s-filter" role="group" aria-label="Filter cases" data-reveal>
          {TAGS.map((t) => <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}<small>{t === 'All' ? CASES.length : CASES.filter((c) => c.tag === t).length}</small></button>)}
        </div>
        <div className="wc-grid" aria-live="polite">
          {list.map((c) => <CaseCard key={c.slug} c={c} k={parseInt(c.n, 10) - 1} />)}
        </div>
      </KSection>
      <Cta topic="work" title="Want this *done on ==your system==?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
