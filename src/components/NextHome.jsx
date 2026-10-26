import { useState } from 'react'
import { Arrow, Button, LinkArrow } from './ui'

const examples = [
 {name:'Checkout',slug:'price-lock-checkout',headline:'A price you can trust.',problem:'An order might change after the customer pays.',decision:'Preserve the committed price',result:'+12.5pp',metric:'prepaid conversion',flow:['Order intent','Price Lock','Warehouse change','Rule applied','Payment kept']},
 {name:'Discovery',slug:'search-discovery',headline:'Understand the intent.',problem:'A typo should not become a lost order.',decision:'Predict and repair the query',result:'+9.0%',metric:'search-to-order conversion',flow:['Customer query','Intent detected','Query expanded','Results ranked','Product found']},
 {name:'Retention',slug:'retention-reminders',headline:'Find the right moment.',problem:'A returning customer misses the right reorder window.',decision:'Trigger a timely reminder',result:'~1,100',metric:'additional repeat orders / day',flow:['Order placed','Cadence inferred','Reminder sent','Reorder action','Repeat order']}
]
export function HomeWorkbench() {
 const [active,setActive] = useState(0)
 const d=examples[active]
 return <div className="nx-workbench" aria-label="Interactive product portfolio">
   <div className="nx-workbench__chrome"><b>✳ ANJOR <span>/ PRODUCT WORKSPACE</span></b><small><i/> INTERACTIVE</small></div>
   <div className="nx-workbench__tabs" role="group" aria-label="Explore selected product systems">{examples.map((x,i)=><button type="button" key={x.slug} aria-pressed={i===active} onClick={()=>setActive(i)}><span>0{i+1}</span> {x.name}</button>)}</div>
   <div className="nx-workbench__body" key={d.slug}>
      <div className="nx-workbench__left"><span className="nx-kicker">PRODUCT DECISION / 0{active+1}</span><h2>{d.headline}</h2><p>{d.problem}</p>
       <div className="nx-workbench__window"><div className="nx-workbench__windowbar"><span>Illustrative decision path</span><span>● ● ●</span></div>
        <div className="nx-workbench__paths">{d.flow.map((s,i)=><div key={s}><small>0{i+1}</small><strong>{s}</strong><i/></div>)}</div>
       </div>
      </div>
      <aside className="nx-workbench__right"><div><span className="nx-kicker">SYSTEM LOGIC</span><h3>{d.decision}</h3><p>Evidence → decision → measured result.</p></div><div className="nx-workbench__result"><span>BUSINESS IMPACT</span><b>{d.result}</b><small>{d.metric}</small></div></aside>
   </div>
   <a className="nx-workbench__bottom" href={'/work/'+d.slug}>Explore the {d.name.toLowerCase()} case study <span>↗</span></a>
 </div>
}
export function ProductThinking() {
 const [active,setActive] = useState(0),d=examples[active]
 return <div className="nx-thinking">
  <div className="nx-thinking__copy"><h2 className="h-2">A great interface is just <span className="em">the visible part.</span></h2><p className="lead">The product is the decision beneath it. I work across the customer experience, the systems that deliver it, and the metrics that reveal whether it worked.</p><LinkArrow to="/work">Explore the decisions behind the results</LinkArrow></div>
  <div className="nx-thinking__app"><div className="nx-thinking__menu" role="group" aria-label="Choose a system">{examples.map((e,i)=><button key={e.slug} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{e.name}<span>0{i+1}</span></button>)}</div>
   <div className="nx-thinking__detail" key={d.slug}><div className="nx-thinking__bar"><span>ANATOMY OF A PRODUCT DECISION</span><span>CASE 0{active+1}</span></div><h3>{d.problem}</h3><div className="nx-thinking__flow">{d.flow.slice(0,4).map((s,i)=><div key={s}><span>0{i+1}</span><b>{s}</b></div>)}</div><div className="nx-thinking__impact"><div><small>THE PRODUCT DECISION</small><strong>{d.decision}</strong></div><div><small>MEASURABLE RESULT</small><strong>{d.result}</strong><span>{d.metric}</span></div></div><a href={'/work/'+d.slug}>Examine the full case <span>↗</span></a></div>
  </div>
 </div>
}
const career = [
 {period:'2022—23',org:'Eggfirst / Neil Patel Digital',h:'Understand demand.',body:'Customers, campaigns and the distance between a message and an order.'},
 {period:'2023—26',org:'Truemeds',h:'Build what delivers it.',body:'Payments, search, operations and retention — the systems underneath commerce.'},
 {period:'2026—now',org:'GNC India / ROQIVA',h:'Own the whole loop.',body:'D2C product management and an independent revenue intelligence product in development.'}
]
export function CareerFeature() {
 return <div className="nx-career"><div className="nx-career__top"><div><h2 className="h-2">From understanding demand to <span className="em">building what delivers it.</span></h2><p className="lead">Different roles. One growing curiosity about how products and businesses really work.</p><LinkArrow to="/journey">Follow my journey</LinkArrow></div><figure><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy"/><figcaption>ALWAYS CURIOUS.</figcaption></figure></div><div className="nx-career__row">{career.map((c,i)=><a href="/journey" key={c.period} className={'nx-career__tile nx-career__tile--'+i}><span>{c.period} <b>0{i+1}</b></span><h3>{c.h}</h3><p>{c.body}</p><footer>{c.org}<span>↗</span></footer></a>)}</div></div>
}
const trinity=[
 {name:'GTM engineering',title:'Find the leak.',desc:'Trace real customer intent across acquisition, search, checkout and CRM.',nodes:['Signal','Journey','Conversion']},
 {name:'RevOps',title:'Fix the loop.',desc:'Make scattered data, owners, rules and handoffs part of one operating system.',nodes:['Data','Decision','Workflow']},
 {name:'ROQIVA',title:'Make it repeatable.',desc:'My founder-led product in development: detect, draft, approve and monitor.',nodes:['Detect','Review','Monitor']}
]
export function ConsultingFeature(){
 const [active,setActive]=useState(0),x=trinity[active]
 return <div className="nx-consult"><div className="nx-consult__copy"><h2 className="h-2">Growth often breaks <span className="em">between tools.</span></h2><p className="lead">My consulting work combines GTM engineering and RevOps: discover where the commercial journey leaks, engineer the missing operating loop, and prove the lift.</p><div><Button to="/hire">Explore consulting <Arrow/></Button><LinkArrow to="/contact?intent=consult#brief">Discuss a project</LinkArrow></div></div><div className="nx-consult__panel"><div className="nx-consult__options" role="group" aria-label="Explore connected growth systems">{trinity.map((t,i)=><button type="button" key={t.name} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span>{t.name}</button>)}</div><div className="nx-consult__stage" key={x.name}><span className="nx-kicker">ANJOR / GROWTH OPERATING SYSTEM</span><h3>{x.title}</h3><p>{x.desc}</p><div className="nx-consult__nodes">{x.nodes.map((n,i)=><div key={n}><small>0{i+1}</small><b>{n}</b></div>)}</div><small>{active===2?'FOUNDER-LED PRODUCT · IN DEVELOPMENT':'CONSULTING · AVAILABLE NOW'}</small></div></div></div>
}
