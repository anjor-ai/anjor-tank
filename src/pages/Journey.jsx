import { Cta, Section } from '../components/ui'
import { EDU } from '../content'
import { JourneyArchive, JourneyBeliefs } from '../components/NextPages'
import { EduPath } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'
export default function Journey(){
 return <PageMotion routeKey="/journey">
  <JourneyArchive/>
  <Section id="beliefs" tone="alt"><JourneyBeliefs/></Section>
  <Section id="learning"><div className="nx-education"><div><h2 className="h-2">The foundations <span className="em">behind the work.</span></h2><p className="lead">A continuous education in customers, commerce and how complex products scale.</p></div><EduPath edu={EDU}/></div></Section>
  <Cta title="Ask me *about any of it.*" lead="Pick a chapter, a case or a role." primary={{label:'Start a conversation',to:'/contact#brief'}} secondary={{label:'Hire me',to:'/hire'}}/>
 </PageMotion>
}