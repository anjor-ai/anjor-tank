import { Cta, Section, PageHero, Arrow, Button } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'
import { SystemSuite, OfferBento, EngagementBoard, FounderBridge } from '../components/ConsultingSuite'
import { Leaks } from '../components/gtm'
import { WhereIFit } from '../components/folio'

export default function Hire() {
 return <PageMotion routeKey="/hire">
  <header className="v3-hirehero">
   <div className="container v3-hirehero__in">
    <div className="v3-hirehero__copy">
     <p className="v3-hero-kicker">PRODUCT-LED CONSULTING</p>
     <h1 className="h-hero">Build the systems that <span className="em">make growth work.</span></h1>
     <p className="lead">I connect GTM engineering, RevOps and product thinking to diagnose revenue leaks, engineer operating loops and prove the lift. ROQIVA is the independent product I am founding from that method.</p>
     <div className="hero__btns"><Button to="/contact?intent=consult#brief">Discuss consulting <Arrow /></Button><Button to="#system" variant="ghost">Explore the system</Button></div>
     <p className="v3-hirehero__minor">Prefer a product role conversation? <a href="/contact?intent=job#brief">Get in touch ↗</a></p>
    </div>
    <div className="v3-hirehero__graphic" aria-label="GTM, RevOps, and ROQIVA connected">
     <div className="v3-hirehero__glass"><span>THE GROWTH SYSTEM</span><div><i>01</i><b>GTM engineering</b><small>Capture intent & close journey gaps</small></div><div><i>02</i><b>Revenue operations</b><small>Standardize decisions & workflows</small></div><div><i>03</i><b>ROQIVA</b><small>Governed product in development</small></div><p>Find the leak → Fix the loop → Prove the lift</p></div>
    </div>
   </div>
  </header>
  <Section id="system" rule={false}><SystemSuite /></Section>
  <Section id="consulting" tone="alt"><OfferBento /></Section>
  <Section id="problems"><div className="v3-centered"><h2 className="h-2">Recognize the revenue leak?</h2><p className="lead">Explore the failure modes I help diagnose across your commercial journey.</p></div><Leaks /></Section>
  <Section id="process" tone="alt"><EngagementBoard /></Section>
  <Section id="roqiva"><FounderBridge /></Section>
  <Section id="fit" tone="alt"><div className="v3-centered"><h2 className="h-2">The product roles I can own.</h2><p className="lead">Consulting is one way we can work together. I also build consumer, growth and platform products as part of a team.</p></div><WhereIFit /></Section>
  <Cta title="Bring a real constraint. *Let's design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{label:"Discuss consulting",to:"/contact?intent=consult#brief"}} secondary={{label:"Talk about a product role",to:"/contact?intent=job#brief"}}/>
 </PageMotion>
}