import { Cta, Section, PageHero, Arrow, Button } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'
import { SystemSuite, OfferBento, EngagementBoard, FounderBridge } from '../components/ConsultingSuite'
import { HireStage, LeakStory } from '../components/Story'
import { WhereIFit } from '../components/folio'

export default function Hire() {
 return <PageMotion routeKey="/hire">
  <PageHero variant="hire" eyebrow="PRODUCT-LED CONSULTING" title="Build the systems that *make growth work.*" lead="I connect GTM engineering, RevOps and product thinking to diagnose revenue leaks, engineer operating loops and prove the lift. ROQIVA is the independent product I am founding from that method." visual={<HireStage />} visualLive>
   <div className="hero__btns hero__a" style={{ '--i': 3 }}><Button to="/contact?intent=consult#brief">Discuss consulting <Arrow /></Button><Button to="#system" variant="ghost">Explore the system</Button></div>
   <p className="v3-hirehero__minor hero__a" style={{ '--i': 4 }}>Prefer a product role conversation? <a href="/contact?intent=job#brief">Get in touch ↗</a></p>
  </PageHero>
  <Section id="system" rule={false}><SystemSuite /></Section>
  <Section id="consulting" tone="alt"><OfferBento /></Section>
  <Section id="problems"><div className="v3-centered"><h2 className="h-2">Recognize the revenue leak?</h2><p className="lead">Explore the failure modes I help diagnose across your commercial journey.</p></div><LeakStory /></Section>
  <Section id="process" tone="alt"><EngagementBoard /></Section>
  <Section id="roqiva"><FounderBridge /></Section>
  <Section id="fit" tone="alt"><div className="v3-centered"><h2 className="h-2">The product roles I can own.</h2><p className="lead">Consulting is one way we can work together. I also build consumer, growth and platform products as part of a team.</p></div><WhereIFit /></Section>
  <Cta title="Bring a real constraint. *Let's design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{label:"Discuss consulting",to:"/contact?intent=consult#brief"}} secondary={{label:"Talk about a product role",to:"/contact?intent=job#brief"}}/>
 </PageMotion>
}