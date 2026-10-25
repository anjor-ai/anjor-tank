/* Apple Keynote-inspired, unobtrusive motion on the SVG keyboard */
export function setupLiquidHero(gsap, ScrollTrigger, reducedMotion, finePointer) {
 const root=document.querySelector('[data-keyboard-root]');
 if(!root) return;
 const keys=[...root.querySelectorAll('[data-liquid-key]')];
 const title=root.querySelector('[data-liquid-title]');
 const detail=root.querySelector('[data-liquid-desc]');
 const device=root.querySelector('[data-keyboard-tilt]');
 const setActive=key=>{
   for(const node of keys)node.classList.toggle('is-active',node===key);
   if(key){title.textContent=key.dataset.liquidLabel;detail.textContent=key.dataset.liquidDetail}
   else{title.textContent='Press a key to explore';detail.textContent='Hover a glass key or use Tab + Enter.'}
 };
 keys.forEach(key=>{
   key.addEventListener('pointerenter',()=>setActive(key));
   key.addEventListener('focus',()=>setActive(key));
   key.addEventListener('blur',()=>requestAnimationFrame(()=>{
      const current=keys.find(k=>k===document.activeElement);
      if(current)setActive(current);else setActive(null);
   }));
 });
 root.addEventListener('pointerleave',()=>{if(!keys.includes(document.activeElement))setActive(null)});
 if(reducedMotion)return;
 const top=document.querySelector('[data-liquid-intro]');
 if(top){
  gsap.fromTo([...top.children],{autoAlpha:0,y:23},{
   autoAlpha:1,y:0,stagger:.13,duration:.85,ease:'power3.out',clearProps:'opacity,visibility,transform'
  });
 }
 if(device){
   gsap.fromTo(device,{opacity:0,y:40,scale:.96},{opacity:1,y:0,scale:1,duration:1.35,ease:'power3.out',delay:.24,
   clearProps:'opacity,transform'});
   // A few pixels of scroll depth, not scroll-jacking or a pinned timeline.
   gsap.fromTo(device,{y:0},{y:-20,ease:'none',
      scrollTrigger:{trigger:root,start:'top 80%',end:'bottom 8%',scrub:1, invalidateOnRefresh:true}});
   if(finePointer && window.matchMedia('(min-width:901px)').matches){
     const rx=gsap.quickTo(device,'rotateX',{duration:.85,ease:'power3.out'});
     const ry=gsap.quickTo(device,'rotateY',{duration:.85,ease:'power3.out'});
     root.addEventListener('pointermove',e=>{
       const r=root.getBoundingClientRect();
       ry(((e.clientX-r.left)/r.width-.5)*3);
       rx(-((e.clientY-r.top)/r.height-.5)*2);
     },{passive:true});
     root.addEventListener('pointerleave',()=>{rx(0);ry(0)});
   }
 }
}