/* Code-native geometric studies: scalable, decorative, and independent of theme. */
export function EngineeringArt({ variant = 0 }) {
 return <svg className="engineering-art" viewBox="0 0 600 360" fill="none" aria-hidden="true">
  <g className="engineering-stars">{Array.from({length:40},(_,i)=><circle key={i} cx={30+(i*137)%540} cy={20+(i*71)%320} r={i%4===0?1.2:.6} fill="currentColor"/>)}</g>
  {variant%3===0?<g>
   {[0,24,48,72].map(n=><path key={n} d={`M130 ${216+n} L300 ${126+n} L470 ${216+n} L300 ${306+n} Z`}/>)}
   {[0,1,2,3,4].map(i=><path key={i} opacity=".3" d={`M${130+i*34} ${216-i*18} L${300+i*34} ${306-i*18} M${130+i*34} ${216+i*18} L${300+i*34} ${126+i*18}`}/>)}
   <path className="engineering-solid" d="M245 94L300 63L355 94L300 126Z"/><path d="M245 94V157L300 190L355 157V94M300 126V190"/>
   <path strokeDasharray="3 6" opacity=".6" d="M300 190V276M245 157V243M355 157V243"/>
   <path className="engineering-solid" d="M286 269L300 261L314 269L300 277Z"/>
  </g>:variant%3===1?<g>
   {[0,15,30].map(n=><ellipse key={n} cx="300" cy={249+n} rx="169" ry="55"/>)}
   <ellipse cx="300" cy="249" rx="125" ry="40" strokeDasharray="40 12"/>
   <ellipse cx="300" cy="249" rx="68" ry="22"/><ellipse className="engineering-solid" cx="300" cy="249" rx="22" ry="7"/>
   <path opacity=".35" d="M232 140V249M368 140V249" strokeDasharray="2 5"/>
   <circle cx="300" cy="133" r="66"/><ellipse cx="300" cy="133" rx="30" ry="66" transform="rotate(45 300 133)"/><ellipse cx="300" cy="133" rx="30" ry="66" transform="rotate(-45 300 133)"/><ellipse cx="300" cy="133" rx="66" ry="23"/><circle className="engineering-solid" cx="300" cy="133" r="12"/>
  </g>:<g>
   {[0,1,2].map(i=><g key={i} transform={`translate(${i*80} ${i*25})`}><path className="engineering-panel" d="M130 106Q130 91 144 84L278 20Q292 13 292 28V208Q292 223 278 230L144 294Q130 301 130 286Z"/><path d="M152 114L268 58M152 131L222 97M152 260L268 204"/><circle cx="211" cy="167" r="33" transform="skewY(-25) translate(0 98)"/></g>)}
   <path strokeDasharray="4 7" d="M100 260L485 76"/><circle className="engineering-solid" cx="482" cy="78" r="6"/>
  </g>}
 </svg>
}

const scenes=[
 {label:'Opportunity review',title:'Follow the evidence.',rows:['Search friction','Payment drop-off','Reorder opportunity'],tags:['Investigate','Prioritise','Measure']},
 {label:'Recovery workflow',title:'Intent → action.',rows:['Customer signal received','Eligibility checked','Recovery journey queued'],tags:['Detected','Verified','Ready']},
 {label:'Lifecycle orchestration',title:'Timing is a product decision.',rows:['Understand purchase cadence','Respect contact frequency','Keep a measured holdout'],tags:['Signal','Guardrail','Control']},
 {label:'Customer intelligence',title:'One connected view.',rows:['Product events','Customer identity','Order history'],tags:['Product','CRM','Commerce']},
 {label:'Operations workspace',title:'An owner for every exception.',rows:['Payment exception','Fulfilment handoff','Support follow-up'],tags:['Review','Assign','Resolve']},
 {label:'Measurement plan',title:'Separate activity from impact.',rows:['Define the baseline','Compare with holdout','Review incremental outcome'],tags:['Baseline','Control','Decision']}
]
export function ServiceScene({index}) {
 const scene=scenes[index]
 return <div className={'service-demo service-demo--'+index}><div className="service-demo__orbit" aria-hidden="true"/><div className="service-demo__window"><header><span className="service-demo__mark">◈</span><span>{scene.label}</span><span>•••</span></header><div className="service-demo__body"><small>WORKFLOW PREVIEW</small><h4>{scene.title}</h4>{scene.rows.map((r,i)=><div className="service-demo__row" key={r}><span className="service-demo__step">0{i+1}</span><span>{r}</span><small>{scene.tags[i]}</small></div>)}</div><footer><span><i/> Human judgement, built in</span><span>Illustrative workflow</span></footer></div></div>
}
