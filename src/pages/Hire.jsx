import { Arrow, Button, Cta, Section } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'
import { ConsultingHero, SystemArchitecture, ServiceEditorial, DeliveryRunbook } from '../components/NextPages'
import { RoqivaFounder } from '../components/folio'

export default function Hire(){
 return <PageMotion routeKey="/hire">
  <ConsultingHero/>
  <Section id="system" rule={false}><SystemArchitecture/></Section>
  <Section id="consulting" tone="alt"><ServiceEditorial/></Section>
  <Section id="process"><DeliveryRunbook/></Section>
  <Section id="roqiva" tone="alt"><RoqivaFounder compact/></Section>
  <Section id="fit"><div className="nx-role"><div><h2 className="h-2">A builder in your <span className="em">product team.</span></h2><p className="lead">Alongside consulting, I'm open to conversations about owning consumer, growth and platform products — from discovery through delivery and measurement.</p></div><Button to="/contact?intent=job#brief" variant="ghost">Talk about a product role <Arrow/></Button></div></Section>
  <Cta title="Bring a real constraint. *Let's design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{label:'Discuss consulting',to:'/contact?intent=consult#brief'}} secondary={{label:'Talk about a product role',to:'/contact?intent=job#brief'}}/>
 </PageMotion>
}