import { useState } from 'react'
import { CASES, home } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, Rich, Section } from '../components/ui'
import { CaseCard, CaseModal, RoqivaFounder } from '../components/folio'
import { WorkRing } from '../components/kinetic'
import { JourneyRibbon, ConsultingPanel, LifePreview } from '../components/Editorial'
import { PortfolioConsole, DecisionStudio, ProofBento } from '../components/Studio'
import { PageMotion } from '../lib/PageMotion'

/* Person → evidence → method → journey → consulting → founding → personality.
   The illustrated work ring and its quick-view modal are deliberately preserved. */
export default function Home() {
  const h = home.hello
  const [open, setOpen] = useState('')
  return (
    <PageMotion routeKey="/">
      <header className="ed-homehero">
        <div className="container">
          <div className="ed-homehero__copy">
            <p className="ed-homehero__crumb hero__a" style={{ '--i': 0 }}><span className="ed-dot" /><span className="label">ANJOR TANK · PRODUCT MANAGER · MUMBAI</span></p>
            <h1 className="h-hero hero__a" style={{ '--i': 1 }}><Rich text={h.title} /></h1>
            <p className="lead hero__a" style={{ '--i': 2 }}>I design consumer experiences, build the operational systems behind them, and measure what moves. Currently Product Manager at GNC India, founder of ROQIVA, and available for selective consulting.</p>
            <div className="hero__btns hero__a" style={{ '--i': 3 }}>
              <Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow /></Button>
              <Button to="#work" variant="ghost">Explore the work</Button>
            </div>
            <div className="ed-homehero__trail hero__a" style={{ '--i': 4 }} aria-label="Product areas"><span>ECOMMERCE & GROWTH</span><span>PLATFORM & OPERATIONS</span><span>AI & AUTOMATION</span></div>
          </div>
          <div className="ed-homehero__desk hero__a" style={{ '--i': 5 }}><PortfolioConsole /></div>
          <p className="ed-homehero__caption">SELECT A SYSTEM IN THE WORKSPACE TO EXPLORE AN ACTUAL PRODUCT DECISION.</p>
          <ProofBento />
        </div>
      </header>

      <Section id="work" className="ed-work">
        <Head title="Not just features. *Products that changed the outcome.*" lead="Six detailed stories behind measurable results. Explore the illustrated cards, open a quick view, or dive into the system design." />
        <WorkRing label="Selected work" items={CASES} render={(c) => <CaseCard c={c} onOpen={setOpen} />} />
        <p className="more" data-reveal><LinkArrow to="/work">Explore all six case studies</LinkArrow></p>
        {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}
      </Section>

      <Section id="method" tone="alt"><DecisionStudio /></Section>

      <Section id="journey"><JourneyRibbon /></Section>

      <Section id="consulting" tone="alt"><ConsultingPanel /></Section>

      <Section id="roqiva" tone="band"><RoqivaFounder /></Section>

      <Section id="beyond"><LifePreview /></Section>

      <Cta title="Bring a difficult problem. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{label:'Discuss consulting',to:'/contact?intent=consult#brief'}} secondary={{label:'Talk about a product role',to:'/contact?intent=job#brief'}} />
    </PageMotion>
  )
}
