
import { SITE, CHAPTERS } from './content.js';
const E=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action=(url,title,secondary=false,external=false)=>`<a class="studio-link${secondary?' studio-link--secondary':''}" href="${url}"${external?' target="_blank" rel="noopener noreferrer"':''}><span>${E(title)}</span><span aria-hidden="true">↗</span></a>`;
const pages=[
 ['01','HOME','Starting point','/','⌂'],
 ['02','WORK','Product systems','/work','↗'],
 ['03','EXPERIENCE','Career timeline','/experience','◎'],
 ['04','HIRE ME','Work together','/hire','✳'],
 ['05','ABOUT','Beyond work','/about','✦'],
 ['06','CONTACT','Say hello','/contact','↗']
];
export function keyboardShowcase(){
 return `<div class="keylab" data-keylab aria-label="Interactive keyboard navigation">
 <div class="keylab__top"><span class="keylab__led"></span><span>ANJOR.OS / NAVIGATOR</span><span>INTERACTIVE INDEX</span></div>
 <div class="keylab__display" aria-live="polite"><p class="keylab__displayline">● SYSTEM READY <span>6 DESTINATIONS</span></p>
 <strong data-keylab-title>Choose where to explore.</strong><p data-keylab-subtitle>Navigate a product career, one key at a time.</p>
 <div class="keylab__equalizer" aria-hidden="true">${Array.from({length:23},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>
 </div>
 <div class="keylab__stage" data-keylab-stage>
 <div class="keylab__keys">${pages.map(([num,label,desc,url,glyph],i)=>`<a href="${url}" class="keylab__key${i===1?' keylab__key--hot':''}" data-keylab-key data-preview="${E(desc)}" data-caption="${E(num+' / '+label)}" aria-label="${E(label)} — ${E(desc)}">
   <small>${num}</small><b class="keylab__glyph" aria-hidden="true">${glyph}</b><span>${E(label)}</span>
 </a>`).join('')}</div>
 <div class="keylab__bar" aria-hidden="true"><span>SHIFT</span><b>ANJOR / TANK</b><span>↵ ENTER</span></div>
 </div><div class="keylab__chassis" aria-hidden="true"></div>
 <p class="keylab__help">HOVER TO PREVIEW <span>·</span> CLICK TO EXPLORE <span>·</span> TAB + ENTER SUPPORTED</p>
 </div>`;
}
const chronological=CHAPTERS.flatMap(c=>c.roles.map(r=>({...r,era:c.span}))).reverse();
export function experienceTimeline(compact=false){
 const list=compact?chronological.slice(0,4):chronological;
 return `<div class="xp-timeline${compact?' xp-timeline--compact':''}" data-xp-timeline>
 ${list.map((r,i)=>`<article class="xp-timeline__item" data-studio-reveal>
  <div class="xp-timeline__time"><i></i><span>${E(r.when)}</span></div>
  <div class="xp-timeline__body"><p class="studio-kicker">${r.org==='MESHHETU'?'FOUNDER / OWN VENTURE':'PROFESSIONAL EXPERIENCE'}</p>
  <h3>${E(r.role)}</h3><b>${E(r.org)}</b><p>${E(r.text)}</p>
  ${r.tags?.length?`<ul class="xp-timeline__chips">${r.tags.slice(0,4).map(t=>`<li>${E(t)}</li>`).join('')}</ul>`:''}</div>
 </article>`).join('')}</div>`;
}
export function homepageExperience(){
 return `<section class="studio-section home-xp"><div class="wrap"><div class="studio-section-head" data-studio-reveal>
 <p class="studio-kicker">03 / EXPERIENCE</p><h2>From understanding demand to building the systems behind it.</h2>
 <p>Marketing, ecommerce product and founder-led systems work: every chapter sharpened a different part of the craft.</p></div>
 ${experienceTimeline(true)}<div class="studio-section-cta">${action('/experience','Explore the full timeline',true)}</div>
 </div></section>`;
}
const offers=[
 ['01','Decision audit','Find the gap between the signals tools capture and the decisions teams make. Evidence-ranked findings and a decision register.'],
 ['02','Research brief','Competitor and market benchmarking, prior-test context and an actionable research readout.'],
 ['03','Strategy & PRDs','Prioritised CRO opportunities, measurement plans, technical specifications and build-ready acceptance criteria.'],
 ['04','Delivery governance','Agreed milestone reviews, risk and change logs, tracking verification and outcome review.']
];
export function consultingTeaser(){
 return `<section class="studio-section home-consult" id="consulting"><div class="wrap home-consult__inner" data-studio-reveal>
 <div><p class="studio-kicker">FOUNDER-LED / MESHHETU TRACK A</p><h2>Great systems start with <em>the right decision.</em></h2>
 <p>Strategic consulting for ecommerce and D2C teams: diagnose revenue leaks, design interventions and prepare evidence-backed handoffs.</p>
 <div class="studio-actions">${action('/hire#consulting','Explore consulting')}${action('https://meshhetu.com/services#track-a','See Track A at MESHHETU',true,true)}</div></div>
 <div class="home-consult__graphic" aria-label="Consulting process">
 ${['DIAGNOSE','DECIDE','SPECIFY','VERIFY'].map((x,i)=>`<div><small>0${i+1}</small><b>${x}</b><span>${['Evidence','Trade-offs','Handoff','Outcomes'][i]}</span></div>`).join('')}</div></div>
 </div></section>`;
}
export function experiencePage(){
 return `<section class="studio-page-head xp-hero"><div class="wrap"><p class="studio-kicker">CAREER / 2021—NOW</p>
 <h1>Marketing taught me demand. <em>Product taught me systems.</em></h1>
 <p class="studio-lead">I started with campaigns, dealerships and customer behaviour. At Truemeds, I worked on payments, growth, search and operational platforms. Today I'm Product Manager at GNC India and separately founder of MESHHETU.</p>
 <div class="studio-actions">${action('/work','Selected case studies')}${action('/hire','Work with me',true)}</div>
 </div></section>
 <section class="studio-section xp-page"><div class="wrap">
 <div class="studio-section-head"><p class="studio-kicker">01 / PROFESSIONAL TIMELINE</p><h2>Six roles. Four chapters.</h2><p>Dates and responsibilities grounded in my resume and LinkedIn profile; no claimed performance results yet for my current role.</p></div>
 ${experienceTimeline()}
 </div></section>
 <section class="studio-section xp-capabilities"><div class="wrap"><div class="studio-section-head">
 <p class="studio-kicker">02 / WHAT CONNECTS THE ROLES</p><h2>The product lens I bring to a team.</h2></div>
 <div class="studio-lens-grid">
 <article><span>COMMERCE</span><h3>Consumer & growth</h3><p>Checkout, payments, search, retention, SEO and experimentation.</p></article>
 <article><span>PLATFORM</span><h3>Internal systems</h3><p>Warehouse and catalogue tools, CRM, order processing and returns workflows.</p></article>
 <article><span>EXECUTION</span><h3>Build with the team</h3><p>Discovery, requirements, wireframing, analytics and measurable releases.</p></article>
 </div></div></section>
 <section class="studio-close"><div class="wrap"><p class="studio-kicker">03 / NEXT</p><h2>Want this thinking on your product team?</h2>${action('/hire','Hire me')}</div></section>`;
}
export function hirePage(){
 return `<section class="studio-page-head hire-hero"><div class="wrap hire-hero__grid">
  <div><p class="studio-kicker">HIRE ME / TWO WAYS TO WORK TOGETHER</p>
  <h1>Build on a team. <em>Or solve the problem with one.</em></h1>
  <p class="studio-lead">I manage consumer product across web, app, growth and the systems behind them. I'm open to the right product opportunity, and I offer strategic consulting independently through MESHHETU.</p>
  <div class="studio-actions">${action('#roles','Product opportunities')}${action('#consulting','Consulting · Track A',true)}</div></div>
  <div class="hire-panel" data-studio-reveal><div class="hire-panel__head"><i></i><i></i><i></i><span>ENGAGEMENT SELECTOR / READY</span></div>
    <div class="hire-panel__option"><small>01</small><b>PRODUCT TEAM</b><span>Growth / Platform / Ecommerce</span></div>
    <div class="hire-panel__option"><small>02</small><b>MESHHETU TRACK A</b><span>Founder-led strategic consulting</span></div>
    <p><span>●</span> ALWAYS START WITH THE PROBLEM</p>
  </div>
 </div></section>
 <section id="roles" class="studio-section hire-roles"><div class="wrap">
   <div class="studio-section-head"><p class="studio-kicker">01 / IN-HOUSE PRODUCT</p>
    <h2>Own the outcome, not only the feature.</h2>
    <p>I bring consumer product experience, technical PM discipline and an operational view of what happens after conversion.</p></div>
   <div class="studio-lens-grid">
    <article><span>GROWTH</span><h3>Find the conversion leak.</h3><p>Funnel diagnosis, offers, retention and experiments tied to actual customer behaviour.</p></article>
    <article><span>PLATFORM</span><h3>Make complexity usable.</h3><p>Internal products, API contracts, catalogue and operations workflows.</p></article>
    <article><span>DELIVERY</span><h3>Ship and measure.</h3><p>PRDs, wireframes, release planning, tracking, outcomes and iteration.</p></article>
   </div><div class="studio-actions hire-roles__cta">${action('mailto:'+SITE.email+'?subject=Product%20opportunity','Talk about a role')}${action('/experience','View experience',true)}</div>
 </div></section>
 <section id="consulting" class="studio-section track-a"><div class="wrap">
   <div class="track-a__head"><div><p class="studio-kicker">02 / MESHHETU · TRACK A · AVAILABLE TODAY</p>
   <h2>Consulting built around <em>decisions, not decks.</em></h2></div>
   <p>Founder-led diagnosis, research, growth strategy, specifications and delivery governance as scoped. The brand retains responsibility for build, QA and production release unless separately agreed.</p></div>
   <div class="track-a__cards">${offers.map(([n,t,d])=>`<article data-studio-reveal><small>${n} / CONSULTING</small><h3>${t}</h3><p>${d}</p><span aria-hidden="true">↗</span></article>`).join('')}</div>
   <div class="track-a__flow" aria-label="Track A methodology">${['QUALIFY','DISCOVER','AUDIT','STRATEGY','SPECIFY','REVIEW'].map((x,i)=>`<span>${x}</span>`).join('<i aria-hidden="true">→</i>')}</div>
   <p class="studio-footnote">Track A is strategic consulting, not a software subscription. Deliverables and timelines are scoped per engagement. Findings state evidence levels and limitations. ROQIVA remains a separate product in development.</p>
   <div class="studio-actions track-a__actions">${action('https://meshhetu.com/contact#book','Book a working session',false,true)}${action('https://meshhetu.com/services#track-a','Track A details',true,true)}</div>
 </div></section>
 <section class="studio-section hire-guardrails"><div class="wrap"><div class="studio-section-head">
   <p class="studio-kicker">03 / HOW ENGAGEMENTS WORK</p><h2>Evidence first. Clear handoffs. No invented outcomes.</h2></div>
   <div class="studio-lens-grid">
    <article><span>01 / EXPLORE</span><h3>Find the real blocker.</h3><p>Map the signals, current decision rules and who owns each consequence.</p></article>
    <article><span>02 / DECIDE</span><h3>Make the trade-offs visible.</h3><p>Review ranked opportunities and define the narrowest useful intervention.</p></article>
    <article><span>03 / HAND OVER</span><h3>Keep implementation accountable.</h3><p>Specifications and governance support the client's delivery team, not hidden production changes.</p></article>
   </div></div></section>
 <section class="studio-close"><div class="wrap"><p class="studio-kicker">NEXT / CONVERSATION</p><h2>Have an interesting role or a commercial problem?</h2>${action('/contact','Get in touch')}</div></section>`;
}
