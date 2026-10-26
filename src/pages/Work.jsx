import { useState } from 'react'
import { CASES, TAGS, bridge, work } from '../content'
import { Arrow, Cta, DataTable, Head, LinkArrow, PageHero, Section } from '../components/ui'
import { CaseCard, ProofStrip } from '../components/folio'
import { PageMotion } from '../lib/PageMotion'
import { CASE_STEPS } from '../content'

/* Work: the proof. The seven cases as a filterable grid, then the through-line to ROQIVA. */
export default function Work() {
  const [tag, setTag] = useState('All')
  const shown = CASES.filter((c) => tag === 'All' || c.tag === tag)
  const H = work.hero
  return (
    <PageMotion routeKey="/work">
      <PageHero eyebrow={H.eyebrow} title={H.title} lead={H.lead}>
        <ul className="hero__facts label hero__a" style={{ '--i': 4 }}>{H.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHero>

      <Section id="numbers" rule={false}>
        <ProofStrip />
      </Section>

      <Section id="cases" tone="alt">
        <Head eyebrow={work.list.eyebrow} title={work.list.title} lead={work.list.lead} />
        <div className="chips-row" role="group" aria-label="Filter cases by area" data-reveal>
          {TAGS.map((t) => <button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
        </div>
        <ul className="cgrid" aria-live="polite">{shown.map((c) => <CaseCard key={c.slug} c={c} />)}</ul>
      </Section>

      <Section id="bridge">
        <Head scrub eyebrow={work.bridge.eyebrow} title={work.bridge.title} lead={work.bridge.lead} />
        <div data-reveal>
          <DataTable cols={work.bridge.cols} caption="What each case became in ROQIVA"
            rows={CASES.map((c) => [<a key={c.slug} className="accent" href={`/work/${c.slug}`}>{c.title}</a>, c.hook.split('.')[0] + '.', bridge[c.slug].became])} />
        </div>
        <p className="more" data-reveal><LinkArrow to={work.bridge.link[1]}>{work.bridge.link[0]}</LinkArrow></p>
      </Section>

      <Section id="how" tone="alt">
        <Head eyebrow={work.how.eyebrow} title={work.how.title} lead={work.how.lead} />
        <ol className="steps8" data-reveal>{CASE_STEPS.map((s, i) => <li key={s}><span className="label">0{i + 1}</span>{s}</li>)}</ol>
      </Section>

      <Cta title="Read one *end to end.*" lead="Start with the checkout. It is the case that taught me the most." primary={{ label: 'Open Price Lock and the checkout rebuild', to: '/work/price-lock-checkout' }} secondary={{ label: 'Send a brief', to: '/contact#brief' }} />
    </PageMotion>
  )
}
