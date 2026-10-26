import { useState } from 'react'
import { CASES, home } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, Rich, Section } from '../components/ui'
import { CaseCard, CaseModal, HelloCard, RoqivaFounder, WhereIFit } from '../components/folio'
import { PageMotion } from '../lib/PageMotion'

/* Home: hello, the founder band, the work (each case opens a quick view), where I fit. Four short steps, then a way to talk. */
export default function Home() {
  const h = home.hello
  const [open, setOpen] = useState('')
  return (
    <PageMotion routeKey="/">
      <header className="hero hero--hello">
        <div className="container hero__in">
          <div className="hero__copy">
            <p className="label eyebrow hero__a" style={{ '--i': 0 }}>Hello · Anjor Tank · Mumbai</p>
            <h1 className="h-hero hero__a" style={{ '--i': 1 }}><Rich text={h.title} /></h1>
            <p className="lead hero__a" style={{ '--i': 2 }}>{h.lead}</p>
            <div className="hero__btns hero__a" style={{ '--i': 3 }}>
              <Button to={h.primary.to} track="cta_work_hero">{h.primary.label}<Arrow /></Button>
              <Button to={h.secondary.to} variant="ghost">{h.secondary.label}</Button>
            </div>
          </div>
          <div className="hero__app hero__a" style={{ '--i': 3 }}><HelloCard /></div>
        </div>
      </header>

      <Section id="roqiva" tone="band"><RoqivaFounder /></Section>

      <Section id="work">
        <Head scrub eyebrow={home.work.eyebrow} title={home.work.title} />
        <ul className="cgrid cgrid--3">{CASES.map((c) => <CaseCard key={c.slug} c={c} onOpen={setOpen} />)}</ul>
        <p className="more" data-reveal><LinkArrow to={home.work.link[1]}>{home.work.link[0]}</LinkArrow></p>
        {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}
      </Section>

      <Section id="fit" tone="alt">
        <Head eyebrow={home.fit.eyebrow} title={home.fit.title} />
        <WhereIFit />
        <p className="more" data-reveal><LinkArrow to={home.fit.link[1]}>{home.fit.link[0]}</LinkArrow></p>
      </Section>

      <Cta {...home.cta} />
    </PageMotion>
  )
}
