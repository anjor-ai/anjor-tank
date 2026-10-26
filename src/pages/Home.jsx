import { useState } from 'react'
import { CASES, LAYERS, home } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, Rich, Section } from '../components/ui'
import { CaseCard, CaseModal, HelloCard, RoqivaFounder, WhereIFit } from '../components/folio'
import { Kinetic, LayerStack, Stat, WorkRing } from '../components/kinetic'
import { SystemRail } from '../components/system'
import { PageMotion } from '../lib/PageMotion'

/* Home: hello with the proof, the work as a ring of illustrated cases (each opens a quick view), the layers I build on,
   the one system from client leak to ROQIVA, the founder band, where I fit. */
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
            <ul className="htg hero__a" style={{ '--i': 4 }} aria-label="What I work on">
              {h.tags.map((t, k) => <li key={t} style={{ '--k': k }}>{t}</li>)}
            </ul>
          </div>
          <div className="hero__app hero__a" style={{ '--i': 3 }}><div className="hstage"><HelloCard /></div></div>
        </div>
        <div className="container">
          <ul className="hpr hero__a" style={{ '--i': 5 }} aria-label="Results">
            {h.proof.map(([v, l]) => <li key={l}><Stat v={v} /><span>{l}</span></li>)}
          </ul>
        </div>
      </header>

      <Kinetic rows={home.band} />

      <Section id="work">
        <Head scrub eyebrow={home.work.eyebrow} title={home.work.title} />
        <WorkRing label="Selected work" items={CASES} render={(c) => <CaseCard c={c} onOpen={setOpen} />} />
        <p className="more" data-reveal><LinkArrow to={home.work.link[1]}>{home.work.link[0]}</LinkArrow></p>
        {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}
      </Section>

      <Section id="layers" tone="alt">
        <Head eyebrow={home.layers.eyebrow} title={home.layers.title} lead={home.layers.lead} />
        <LayerStack layers={LAYERS} label="The four layers I build on" />
      </Section>

      <Section id="system">
        <Head eyebrow={home.system.eyebrow} title={home.system.title} lead={home.system.lead} />
        <SystemRail />
      </Section>

      <Section id="roqiva" tone="band"><RoqivaFounder /></Section>

      <Section id="fit" tone="alt">
        <Head eyebrow={home.fit.eyebrow} title={home.fit.title} />
        <WhereIFit />
        <p className="more" data-reveal><LinkArrow to={home.fit.link[1]}>{home.fit.link[0]}</LinkArrow></p>
      </Section>

      <Cta {...home.cta} />
    </PageMotion>
  )
}
