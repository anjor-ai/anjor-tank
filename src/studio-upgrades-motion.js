/* Keyboard navigator and scroll-driven experience: progressive enhancement only. */
export function setupStudioUpgrades(gsap, ScrollTrigger, reducedMotion, finePointer) {
  const keyboard = document.querySelector('[data-keylab]');
  if (keyboard) {
    const title = keyboard.querySelector('[data-keylab-title]');
    const subtitle = keyboard.querySelector('[data-keylab-subtitle]');
    const keys = [...keyboard.querySelectorAll('[data-keylab-key]')];
    const reset = () => {
      if (keyboard.contains(document.activeElement) && document.activeElement.matches('[data-keylab-key]')) return;
      title.textContent = 'Choose where to explore.';
      subtitle.textContent = 'Navigate a product career, one key at a time.';
      keys.forEach(k => k.classList.remove('is-selected'));
    };
    const preview = key => {
      keys.forEach(k => k.classList.toggle('is-selected',k===key));
      title.textContent = key.dataset.preview || key.textContent.trim();
      subtitle.textContent = key.dataset.caption + ' / CLICK TO OPEN';
    };
    keys.forEach(key => {
      key.addEventListener('pointerenter', () => preview(key));
      key.addEventListener('focus', () => preview(key));
      key.addEventListener('blur', () => requestAnimationFrame(reset));
    });
    keyboard.addEventListener('pointerleave', reset);
    const stage = keyboard.querySelector('[data-keylab-stage]');
    if (!reducedMotion && finePointer && stage && window.matchMedia('(min-width:901px)').matches) {
      const mx = gsap.quickTo(stage, 'rotateY', {duration:.7,ease:'power3.out'});
      const my = gsap.quickTo(stage, 'rotateX', {duration:.7,ease:'power3.out'});
      keyboard.addEventListener('pointermove', e => {
        const r=keyboard.getBoundingClientRect();
        mx(((e.clientX-r.left)/r.width-.5)*9);
        my(13-((e.clientY-r.top)/r.height-.5)*7);
      }, {passive:true});
      keyboard.addEventListener('pointerleave', () => {mx(0);my(13);});
      gsap.fromTo(keyboard.querySelectorAll('.keylab__key'), {y:27,opacity:0},
        {y:0,opacity:1,duration:.7,stagger:.065,ease:'back.out(1.25)',delay:.13,
          clearProps:'transform,opacity'});
    }
  }
  const timelines=[...document.querySelectorAll('[data-xp-timeline]')];
  if(!reducedMotion && timelines.length) {
    timelines.forEach(tl => {
      const items=[...tl.querySelectorAll('.xp-timeline__item')];
      items.forEach(item => ScrollTrigger.create({
        trigger:item,start:'top 75%',end:'bottom 33%',
        onToggle:self=>item.classList.toggle('is-current',self.isActive)
      }));
    });
  }
  if(!reducedMotion){
    document.querySelectorAll('.home-consult__graphic > div,.track-a__cards > article').forEach((el,i)=>{
      gsap.fromTo(el,{y:18,opacity:0},{
        y:0,opacity:1,duration:.7,delay:Math.min(i*.045,.18),ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 93%',once:true},clearProps:'transform,opacity'
      });
    });
  }
}