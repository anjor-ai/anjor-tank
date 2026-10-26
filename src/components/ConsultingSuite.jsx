import { useState } from 'react'
import { consulting, gtm } from '../content'
import { Arrow, Button, LinkArrow, Rich } from './ui'
import { FindingCard } from '../diagrams/FindingCard'

const lanes = [
  { key:'gtm', label:'GTM engineering', summary:'Turn fragmented demand into an instrumented journey.', accent:'blue',
    nodes:[['Acquire','Landing / campaigns'],['Qualify','Identity / intent'],['Convert','Checkout / payment'],['Retain','CRM / lifecycle']],
    input:'A customer signal exists in one tool', output:'A reusable trigger with an owner, rules and suppression',
    description:'I map the commercial journey, find breaks in attribution and conversion, then build the connective tissue between touchpoints.' },
  { key:'revops',label:'Revenue operations', summary:'Build the operating system behind predictable growth.',accent:'orange',
    nodes:[['Observe','Data trust'],['Decide','Rules + owners'],['Execute','Workflow / CRM'],['Measure','Holdout / lift']],
    input:'Multiple teams read different numbers',output:'A governed decision with a measurable outcome',
    description:'I define clean events, decision rights, handoffs and workflows so growth does not depend on another manual spreadsheet.' },
  { key:'roqiva',label:'ROQIVA',summary:'The software product emerging from the method.',accent:'violet',
    nodes:[['Detect','Signals'],['Draft','Agents'],['Approve','Human gates'],['Monitor','Outcomes']],
    input:'A signal meets a detection rule',output:'An evidence-backed recommendation awaiting approval',
    description:'ROQIVA is my founder-led product in development: a governed intelligence layer that reads signals, drafts actions and keeps people in control.' }
]
export function SystemSuite() {
 const [index,setIndex]=useState(0)
 const s=lanes[index]
 return <div className="v3-suite">
   <div className="v3-suite__intro"><h2 className="h-2">One commercial system. <span className="em">Three connected layers.</span></h2>
     <p className="lead">GTM engineering creates the signals and customer journeys. RevOps makes the decisions and handoffs repeatable. ROQIVA is the product I am building to support that loop with governed intelligence.</p></div>
   <div className="v3-suite__shell" data-reveal>
    <div className="v3-suite__tabs" role="group" aria-label="Explore connected capabilities">
      {lanes.map((x,i)=><button type="button" key={x.key} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>0{i+1}</span><b>{x.label}</b><small>{i===2?'In development':'Consulting / available'}</small></button>)}
    </div>
    <div className={'v3-suite__body v3-suite__body--'+s.accent} key={s.key}>
     <div className="v3-suite__top"><div><span className="v3-suite__caption">SYSTEM BLUEPRINT / {s.label}</span><h3>{s.summary}</h3></div><span className="v3-suite__pill">{index===2?'PRODUCT · IN DEVELOPMENT':'CONSULTING · AVAILABLE TODAY'}</span></div>
     <div className="v3-suite__window">
       <div className="v3-suite__bar"><span>Architecture / signal → decision → outcome</span><span className="v3-suite__running"><i />REFERENCE WORKFLOW</span></div>
       <div className="v3-suite__nodes">{s.nodes.map((n,i)=><div key={n[0]} className="v3-suite__node"><span>0{i+1}</span><b>{n[0]}</b><small>{n[1]}</small></div>)}</div>
       <div className="v3-suite__trail"><div><span>INPUT</span><b>{s.input}</b></div><div className="v3-suite__arrow">→</div><div><span>DESIGNED OUTPUT</span><b>{s.output}</b></div></div>
     </div>
     <div className="v3-suite__bottom"><p>{s.description}</p><a href={index===2?'/roqiva':'/contact?intent=consult#brief'}>{index===2?'Explore the ROQIVA product':'Discuss this layer'} <Arrow /></a></div>
    </div>
   </div>
   <div className="v3-suite__foot"><span>CONSULTING THAT WORKS TODAY</span><b>Diagnosis → GTM + RevOps build → measurement</b><span>FOUNDER-LED PRODUCT IN DEVELOPMENT</span><b>ROQIVA</b></div>
 </div>
}
export function OfferBento() {
 const selected=gtm.services.slice(0,6)
 return <div className="v3-offers">
   <div className="v3-offers__intro"><h2 className="h-2">Start with the constraint, <span className="em">not a package.</span></h2><p>There is a practical entry point for every level of friction: diagnose a leak, build a missing operating loop, or partner through measurement.</p><LinkArrow to="/contact?intent=consult#brief">Talk through your problem</LinkArrow></div>
   <div className="v3-offers__grid">{selected.map((o,i)=><article key={o.id} className={'v3-offer v3-offer--'+i}>
     <span className="v3-offer__code">{o.code}</span><h3>{o.name}</h3><p>{o.line}</p><div className="v3-offer__flow">{o.flow.slice(0,4).map((f,j)=><span key={j}>{f}</span>)}</div>
     <div className="v3-offer__out"><span>YOU GET</span><b>{o.gets.slice(0,2).join(' · ')}</b></div>
   </article>)}</div>
 </div>
}
export function EngagementBoard() {
 return <div className="v3-engage">
  <div><h2 className="h-2">From first question <span className="em">to a measured change.</span></h2><p className="lead">Engagement scope follows the problem. The twelve-week model is a reference process, not a guaranteed delivery promise.</p><Button to="/contact?intent=consult#brief">Bring a problem <Arrow /></Button></div>
  <div className="v3-engage__track">{gtm.phases.map((p,i)=><div key={p.id}><span>0{i+1} / {p.weeks}</span><h3>{p.label}</h3><p>{p.does}</p><small>Output: {p.out}</small></div>)}</div>
 </div>
}
export function FounderBridge() {
 return <div className="v3-founder"><div><p className="v3-founder__overline">FOUNDER · PRODUCT IN DEVELOPMENT</p><h2 className="h-2">ROQIVA. <span>The repeatable system behind the work.</span></h2><p>What I diagnose and engineer for teams today is informing a product designed to continuously surface commercial signals, prepare evidence and route decisions through human approval. It is not a claim of a live, autonomous service.</p><div><Button to="/roqiva">Explore ROQIVA <Arrow /></Button><LinkArrow to="/contact?intent=roqiva#brief">Share a use case</LinkArrow></div></div><div className="v3-founder__card"><FindingCard /></div></div>
}
