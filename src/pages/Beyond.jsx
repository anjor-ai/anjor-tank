import { useRef, useState } from 'react'
import { ALT } from '../content'
import { Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { Radar, SCENES, photosOf } from '../components/Story'
import { Chip, Win } from '../components/kit'
import { MQ, gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work. Entering the page is a camera: a viewfinder closes in on the first frame, the shutter fires and the photograph opens up from the centre.
   The reveal belongs to this page only. It is skippable (click or any key), it never plays under reduced motion, and everything it hides is set from JS,
   so the prerendered page and a no-JS visit show the finished hero. */

const COVERS = ['rainier', 'kart-pov', 'laser']
const LINES = [['Take the', 'long way.'], ['Find the', 'next apex.'], ['Stay for', 'one more set.']]
const TOTAL = SCENES.reduce((n, s) => n + photosOf(s.g).length, 0)

function Frame({ p, className = '' }) {
  return (
    <figure className={`bx-ph ${className}`}>
      <span className="bx-ph__in"><img src={`/img/adventure/${p.src}.webp`} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" /></span>
      <figcaption>{p.cap}</figcaption>
    </figure>
  )
}

/** Speed: a gauge and three sector bars, drawn as an illustration. No lap times are claimed. */
function Dash() {
  return (
    <Win title="Practice lap · telemetry" tag="Illustration" className="bx-dash">
      <svg className="bx-gauge" viewBox="0 0 200 120" role="img" aria-label="A speed gauge">
        <path d="M 20 110 A 80 80 0 0 1 180 110" className="bx-gauge__t" />
        <path d="M 20 110 A 80 80 0 0 1 180 110" className="bx-gauge__v" pathLength="100" />
        <g className="bx-gauge__n"><line x1="100" y1="110" x2="100" y2="42" /><circle cx="100" cy="110" r="6" /></g>
      </svg>
      <ul className="bx-sec">{['Sector 1', 'Sector 2', 'Sector 3'].map((s, k) => <li key={s}><span>{s}</span><i><b style={{ width: `${[82, 64, 90][k]}%` }} /></i></li>)}</ul>
    </Win>
  )
}

function Equalizer() {
  return <div className="bx-eq" aria-hidden="true">{Array.from({ length: 28 }, (_, k) => <i key={k} style={{ '--k': k, '--d': `${0.8 + ((k * 37) % 9) / 10}s` }} />)}</div>
}

export default function Beyond() {
  const [active, setActive] = useState(0)
  const root = useRef(null)

  /* Entry reveal: once, on mount. The hero image changing later (the switcher) is a plain crossfade, not this. */
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root.current)
      const hero = q('.bx-hero')[0]
      const tl = gsap.timeline({ defaults: { ease: 'eInOut' } })
      gsap.set(q('.bx-img'), { clipPath: 'circle(0% at 50% 56%)', scale: 1.3 })
      gsap.set(q('.bx-vf'), { scale: 1.45, autoAlpha: 0 })
      gsap.set(q('.bx-line > span'), { yPercent: 115 })
      gsap.set(q('.bx-sub, .bx-cta, .bx-switch > *, .bx-hud'), { autoAlpha: 0, y: 24 })
      tl.to(q('.bx-vf'), { autoAlpha: 1, duration: 0.35, ease: 'none' }, 0)
        .to(q('.bx-vf'), { scale: 1, duration: 1.1 }, 0)
        .to(q('.bx-img'), { clipPath: 'circle(82% at 50% 56%)', duration: 1.35 }, 0.55)
        .to(q('.bx-img'), { scale: 1, duration: 1.8, ease: 'eOut' }, 0.55)
        .fromTo(q('.bx-flash'), { autoAlpha: 0.85 }, { autoAlpha: 0, duration: 0.45, ease: 'none' }, 0.5)
        .to(q('.bx-line > span'), { yPercent: 0, duration: 0.85, stagger: 0.12, ease: 'eOut' }, 1.15)
        .to(q('.bx-sub, .bx-cta, .bx-hud'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'eOut' }, 1.5)
        .to(q('.bx-switch > *'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'eOut' }, 1.7)
        .set(q('.bx-img'), { clearProps: 'clipPath,transform' })
      const skip = () => { if (tl.progress() < 1) tl.progress(1) }
      hero.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      return () => { hero.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip) }
    })
    return () => mm.revert()
  }, { scope: root })

  /* Scroll motion for the chapters. Scoped to this page and reverted on leaving. */
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root.current)
      q('.bx-ph').forEach((f, k) => {
        gsap.fromTo(f.querySelector('.bx-ph__in'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'eInOut', clearProps: 'clipPath', scrollTrigger: { trigger: f, start: 'top 88%', once: true } })
        gsap.fromTo(f.querySelector('img'), { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.12, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      q('.bx-route path.bx-route__p').forEach((p) => gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: p.closest('section'), start: 'top 70%', end: 'bottom 55%', scrub: 0.6 } }))
      q('.bx-sec b').forEach((b, k) => gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.1, delay: k * 0.15, ease: 'eOut', scrollTrigger: { trigger: b, start: 'top 92%', once: true } }))
      q('.bx-gauge__n').forEach((n) => gsap.fromTo(n, { rotation: -70, transformOrigin: '100px 110px' }, { rotation: 48, duration: 1.8, ease: 'eSpring', scrollTrigger: { trigger: n, start: 'top 90%', once: true } }))
      q('.bx-gauge__v').forEach((n) => gsap.fromTo(n, { drawSVG: '0%' }, { drawSVG: '80%', duration: 1.8, ease: 'eOut', scrollTrigger: { trigger: n, start: 'top 90%', once: true } }))
      q('.bx-big').forEach((h) => gsap.fromTo(h.querySelectorAll('.bx-line > span'), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'eOut', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }))
    })
    return () => mm.revert()
  }, { scope: root })

  const s0 = SCENES[active]
  return (
    <PageMotion routeKey="/beyond">
      <div ref={root} className="bx">
        <header className="bx-hero" aria-labelledby="bx-h1">
          <img key={active} className="bx-img" src={`/img/adventure/${COVERS[active]}.webp`} alt={ALT[COVERS[active]]} fetchpriority="high" />
          <div className="bx-shade" />
          <div className="bx-vf" aria-hidden="true"><i /><i /><i /><i /><b /></div>
          <div className="bx-flash" aria-hidden="true" />
          <p className="bx-hud" aria-hidden="true"><span><em /> REC</span><span>FRAME 0{active + 1} / {TOTAL}</span></p>
          <div className="bx-copy">
            <p className="bx-eyebrow">Anjor / off the clock</p>
            <h1 id="bx-h1"><span className="bx-line"><span>{LINES[active][0]}</span></span><span className="bx-line"><span><em>{LINES[active][1]}</em></span></span></h1>
            <p className="bx-sub">Some of the best stories happen outside the roadmap.</p>
            <a className="bx-cta" href={`#scene-${s0.g.toLowerCase()}`}>Explore {s0.g.toLowerCase()} <Icon name="arrow" size={15} /></a>
          </div>
          <div className="bx-switch" role="group" aria-label="Choose an adventure">
            {SCENES.map((s, i) => (
              <button key={s.g} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
                <img src={`/img/adventure/${COVERS[i]}.webp`} alt="" width="56" height="56" />
                <span><small>0{i + 1} / {s.g}</small><b>{s.lede}</b></span>
              </button>
            ))}
          </div>
        </header>

        <section className="bx-intro">
          <div className="container">
            <p className="k-rule"><b>[00]</b><span>The person behind the product</span><i /><small>/ Off the clock</small></p>
            <h2 className="k-h bx-big">A little less planned. <em>A lot more alive.</em></h2>
            <p className="k-lead">Water, mountains and back roads. Karts, a racing sim and the apex. Lights, lasers and a full room. These are the things that keep me curious.</p>
            <nav className="bx-jump" aria-label="Jump to a chapter">{SCENES.map((s) => <a key={s.g} href={`#scene-${s.g.toLowerCase()}`}><b>{s.k}</b>{s.g}<Icon name="arrow" size={14} /></a>)}</nav>
          </div>
        </section>

        {SCENES.map((s) => {
          const L = photosOf(s.g)
          const id = s.g.toLowerCase()
          return (
            <section key={s.g} id={`scene-${id}`} className={`bx-ch bx-ch--${id}`} aria-labelledby={`bx-${id}`}>
              {id === 'wander' && (
                <svg className="bx-route" viewBox="0 0 1000 1400" preserveAspectRatio="none" aria-hidden="true">
                  <path className="bx-route__p" d="M 120 40 C 300 160, 80 300, 380 420 S 900 520, 640 700 S 120 860, 520 1020 S 900 1180, 700 1360" />
                </svg>
              )}
              <div className="container">
                <header className="bx-ch__head">
                  <p className="bx-ch__k"><b>{s.k}</b>Chapter · {L.length} frames</p>
                  <h2 id={`bx-${id}`} className="bx-big"><span className="bx-line"><span>{s.g}.</span></span> <span className="bx-line bx-line--dim"><span>{s.lede}</span></span></h2>
                  <p className="k-lead">{s.sub}</p>
                </header>
                {id === 'wander' && <div className="bx-wander">{L.map((p, k) => <Frame key={p.src} p={p} className={`bx-ph--w${k % 5}`} />)}</div>}
                {id === 'speed' && (
                  <div className="bx-speed">
                    <Frame p={L[1]} className="bx-ph--hero" />
                    <Dash />
                    <div className="bx-speed__r">{[0, 2, 3].map((n) => <Frame key={L[n].src} p={L[n]} />)}</div>
                    <p className="k-cap">Illustrated telemetry · for the love of racing.</p>
                  </div>
                )}
                {id === 'live' && (
                  <div className="bx-live">
                    <Equalizer />
                    <div className="bx-live__r">{L.map((p) => <Frame key={p.src} p={p} />)}</div>
                    <ol className="bx-set" aria-label="Setlist">{L.map((p, k) => <li key={p.src}><span>0{k + 1}</span>{p.cap}</li>)}</ol>
                    <p className="k-cap">Visual rhythm study · no audio plays.</p>
                  </div>
                )}
              </div>
            </section>
          )
        })}

        <section id="radar" className="bx-radar">
          <div className="container">
            <p className="k-rule"><b>[04]</b><span>On the radar</span><i /><small>/ Always</small></p>
            <h2 className="k-h">Always something <em>on the radar.</em></h2>
            <p className="k-lead">Curiosity doesn’t switch off when the working day ends.</p>
            <Radar />
          </div>
        </section>
        <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
      </div>
    </PageMotion>
  )
}
