const keys = [
  {label:'Work', detail:'Seven product stories, one decision at a time', href:'/work', index:'01'},
  {label:'Experience',detail:'From campaigns to product systems',href:'/experience',index:'02'},
  {label:'Hire Me',detail:'Product opportunities & founder-led consulting',href:'/hire',index:'03'},
  {label:'MESHHETU',detail:'My systems engineering venture',href:'https://meshhetu.com',index:'04',external:true},
  {label:'About',detail:'The story beyond the backlog',href:'/about',index:'05'},
  {label:'Contact',detail:'Have a product problem? Say hello.',href:'/contact',index:'06'}
];
export function liquidHero(){
  return `<section class="liquid-hero" id="home-hero">
    <div class="liquid-hero__orb liquid-hero__orb--a" aria-hidden="true"></div>
    <div class="liquid-hero__orb liquid-hero__orb--b" aria-hidden="true"></div>
    <div class="wrap liquid-hero__top" data-liquid-intro>
      <p class="liquid-hero__eyebrow"><span class="liquid-hero__dot"></span> ANJOR TANK <span class="liquid-hero__sep">/</span> PRODUCT MANAGER & FOUNDER</p>
      <h1>I build what <em>makes it work.</em></h1>
      <p class="liquid-hero__lead">I build consumer products, growth engines and operational systems that turn complex problems into measurable outcomes.</p>
      <div class="liquid-hero__cta">
        <a class="liquid-button liquid-button--dark" href="/work"><span>Explore my work</span><span aria-hidden="true">↗</span></a>
        <a class="liquid-button liquid-button--glass" href="/hire"><span>Hire me</span><span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div class="liquid-hero__showcase" data-keyboard-root>
      <div class="liquid-hero__floater liquid-hero__floater--left" aria-hidden="true">
        <span>PRODUCT SIGNAL / 01</span>
        <svg viewBox="0 0 150 48"><path d="M5 42L26 31 46 36 66 12 85 23 113 5 145 11" stroke="#4e8fef" stroke-width="2.3" fill="none" stroke-linecap="round"/><circle cx="113" cy="5" r="3.5" fill="#4e8fef"/></svg>
        <b>Build for outcomes.</b>
      </div>
      <div class="liquid-hero__floater liquid-hero__floater--right" aria-hidden="true"><span>SYSTEMS / ALWAYS ON</span><b>Experience · Growth · Operations</b><i>● All connected</i></div>
      <div class="liquid-hero__keyboard" data-keyboard-tilt>
        <img src="/img/keyboard-silver.svg" width="1500" height="610" alt="Full-length silver keyboard with six glass keys, each representing a part of the portfolio" fetchpriority="high" decoding="async" />
        <nav class="liquid-hero__hotkeys" aria-label="Explore the portfolio keyboard">
          ${keys.map((k,i)=>`<a
            href="${k.href}"
            ${k.external?'target="_blank" rel="noopener noreferrer"':''}
            class="liquid-hero__hotkey"
            style="--hot-x:${(102+i*215)/1500*100}%;--hot-w:${196/1500*100}%;"
            data-liquid-key
            data-liquid-label="${k.label}"
            data-liquid-detail="${k.detail}"
            aria-label="${k.label}: ${k.detail}"><span class="liquid-hero__sr">${k.label}</span></a>`).join('')}
        </nav>
      </div>
      <div class="liquid-hero__keyboard-foot">
        <span class="liquid-hero__keyboard-note">YOUR NEXT DESTINATION <span aria-hidden="true">↗</span></span>
        <div class="liquid-hero__key-info" aria-live="polite"><strong data-liquid-title>Press a key to explore</strong><span data-liquid-desc>Hover a glass key or use Tab + Enter.</span></div>
        <span class="liquid-hero__keyboard-note liquid-hero__keyboard-note--right">A PORTFOLIO IN SIX KEYS <span aria-hidden="true">✦</span></span>
      </div>
      <nav class="liquid-hero__mobilelinks" aria-label="Portfolio shortcuts on mobile">
        ${keys.map(k=>`<a href="${k.href}" ${k.external?'target="_blank" rel="noopener noreferrer"':''}>${k.label} <span aria-hidden="true">↗</span></a>`).join('')}
      </nav>
    </div>
    <div class="liquid-hero__scroll"><span>SCROLL TO DISCOVER</span><i aria-hidden="true"></i></div>
  </section>`;
}
