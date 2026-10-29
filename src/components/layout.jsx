import { useEffect, useRef, useState } from 'react'
import { footer, pager, routes, site } from '../content'
import { useRoute } from '../lib/router'
import { MQ, gsap, useGSAP } from '../lib/motion'
import { useTheme } from '../lib/theme'
import { isSoundOn, subscribe, toggleSound } from '../system/sound'
import { Shader } from '../system/Shader'
import { Icon } from './icons'
import { BrandMark } from './BrandMark'
import { Arrow, Button, Rich } from './ui'

/* ═══════════════════════════════════════════════════════════════════════════
   The frame of every page: a floating nav (brand, a pill of links with a sliding marker, sound, theme, the
   one action), the trail, the next-page band and the footer, which closes on a shader with the name across it.
   ═══════════════════════════════════════════════════════════════════════════ */

function ThemeToggle() {
  const { theme, forced, toggle } = useTheme()
  if (forced) return null // this page has one theme (ROQIVA is always dark)
  return (
    <button type="button" className="nv-ic" onClick={(e) => toggle(e)} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
  )
}

/** Sound on and off. Four bars dance while it plays and lie flat when it does not. */
export function SoundToggle({ className = '' }) {
  const [on, setOn] = useState(false)
  useEffect(() => { setOn(isSoundOn()); return subscribe(setOn) }, [])
  return (
    <button type="button" className={`nv-ic nv-snd${on ? ' is-on' : ''} ${className}`.trim()} onClick={toggleSound} aria-pressed={on} aria-label={on ? 'Mute the ambient sound' : 'Play ambient sound'} title={on ? 'Sound on' : 'Sound off'}>
      <span className="nv-snd__bars" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  )
}

/** Elements made inert while the full-screen menu is open, so Tab and screen readers stay inside it. */
const BEHIND_MENU = ['.skip-link', '#main', '.ft']

/** The bar: the name, the pages, sound, theme and the one action. A plain solid bar that stays at the top while you scroll.
    On a phone the pages open as a full panel. */
export function Nav() {
  const { route } = useRoute()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btn = useRef(null)
  const menu = useRef(null)
  const links = routes.filter((r) => !r.hidden)
  const main = links.filter((r) => r.path !== '/' && r.path !== '/contact')

  useEffect(() => { setOpen(false) }, [route.path])
  useEffect(() => {
    let tick = false
    const on = () => {
      if (tick) return
      tick = true
      requestAnimationFrame(() => {
        tick = false
        setScrolled(window.scrollY > 4)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return undefined
    const behind = BEHIND_MENU.flatMap((s) => [...document.querySelectorAll(s)])
    behind.forEach((el) => el.setAttribute('inert', ''))
    document.body.style.overflow = 'hidden'
    menu.current?.querySelector('a')?.focus({ preventScroll: true })
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    const mq = window.matchMedia('(min-width: 1081px)')
    const wide = () => { if (mq.matches) setOpen(false) }
    window.addEventListener('keydown', key)
    mq.addEventListener('change', wide)
    return () => {
      document.body.style.overflow = ''
      behind.forEach((el) => el.removeAttribute('inert'))
      window.removeEventListener('keydown', key)
      mq.removeEventListener('change', wide)
    }
  }, [open])

  const here = (p) => route.path === p || (p !== '/' && route.path.startsWith(p + '/'))
  // The raised segment slides to the current page's link (and hides when no main link is current).
  const bar = useRef(null)
  useEffect(() => {
    const nav = bar.current
    if (!nav) return undefined
    const place = () => {
      const a = nav.querySelector('a[aria-current="page"]')
      const pill = nav.querySelector('.b-nav__pill')
      if (!pill) return
      if (!a) { pill.style.opacity = '0'; return }
      pill.style.opacity = '1'
      pill.style.width = `${a.offsetWidth}px`
      pill.style.transform = `translateX(${a.offsetLeft}px)`
    }
    place()
    document.fonts?.ready.then(place)
    const ro = new ResizeObserver(place)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [route.path])
  return (
    <header className={`b-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="b-nav__in">
        <a href="/" className="b-nav__brand" aria-label={`${site.name} home`}><BrandMark className="b-nav__mark" decorative /><span>{site.name}</span></a>
        <nav className="b-nav__links" aria-label="Main" ref={bar}>
          <span className="b-nav__pill" aria-hidden="true" />
          {main.map((r) => (
            <a key={r.path} href={r.path} aria-current={here(r.path) ? 'page' : undefined}>{r.label}{r.badge && <i className="b-nav__dot" aria-label={r.badge} />}</a>
          ))}
        </nav>
        <div className="b-nav__right">
          <div className="b-nav__tools">
            <SoundToggle className="b-nav__ic" />
            <span className="b-nav__theme"><ThemeToggle /></span>
          </div>
          <Button to="/contact?intent=consult#brief" size="sm" className="b-nav__cta" track="cta_consult_nav">Let's talk <Arrow /></Button>
          <button type="button" ref={btn} className="nv-ic b-nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className={`burger${open ? ' is-open' : ''}`} aria-hidden><i /><i /></span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={menu} className="b-menu" hidden={!open} onClick={(e) => { if (e.target.closest('a')) setOpen(false) }}>
        <nav className="b-menu__in" aria-label="Mobile">
          {links.map((r) => (
            <a key={r.path} href={r.path} className="b-menu__a" aria-current={(r.path === '/' ? route.path === '/' : here(r.path)) ? 'page' : undefined}>
              {r.label}<Icon name="arrow" size={18} />
            </a>
          ))}
        </nav>
        <div className="b-menu__row">
          <Button to="/contact?intent=consult#brief" className="b-menu__cta" track="cta_consult_menu">Discuss a project<Arrow /></Button>
          <span className="b-menu__ic"><SoundToggle /><ThemeToggle /></span>
        </div>
      </div>
    </header>
  )
}

/** The hand-over at the bottom of each story page: one tile that is a door to the next page. */
export function StoryPager() {
  const { route } = useRoute()
  const p = pager[route.path]
  if (!p) return null
  const next = routes.find((r) => r.path === p.to)
  return (
    <section className="b-next" aria-label="Next page">
      <div className="b-wrap">
        <a className="b-next__a" href={p.to} data-track="pager_next" data-cursor="Next" data-reveal>
          <span className="b-next__k">{p.kicker}</span>
          <span className="b-next__t"><Rich text={p.title} /></span>
          <span className="b-next__d">{p.d}</span>
          <span className="b-next__go">{next ? next.label : 'Continue'}<i><Icon name="arrow" size={18} /></i></span>
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  const story = routes.filter((r) => r.story)
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo('.ft__name span', { yPercent: 70 }, { yPercent: 0, ease: 'none', stagger: 0.03, scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <footer className="ft" ref={ref}>
      <div className="ft__card">
        <Shader preset="tide" className="ft__bg" />
        <div className="ft__in">
          <div className="ft__brand">
            <a href="/" className="ft__logo"><BrandMark className="nv__mark" decorative /><span>{site.name}</span></a>
            <p>{footer.line}</p>
            <p className="ft__cat">{site.category}</p>
          </div>
          <nav className="ft__col" aria-label="The story">
            <p className="ft__k">The story</p>
            {story.map((r, i) => <a key={r.path} href={r.path}><span>0{i + 1}</span>{r.label}</a>)}
          </nav>
          <div className="ft__col">
            <p className="ft__k">Talk</p>
            <a href="/roqiva">ROQIVA walkthrough</a>
            <a href="/contact#brief">Send a brief</a>
            <a href="/contact#book">Book a call</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
          <div className="ft__col">
            <p className="ft__k">Right now</p>
            <p>Product Manager at GNC India. Building ROQIVA, in development. {footer.how}</p>
          </div>
        </div>
        <div className="ft__name" aria-hidden="true">{site.name.split('').map((c, i) => <span key={i}>{c === ' ' ? ' ' : c}</span>)}</div>
        <div className="ft__base">
          <p><span>© {new Date().getFullYear()} {site.name} · <a href="/privacy">Privacy</a></span></p>
          <p>{footer.note}</p>
        </div>
      </div>
    </footer>
  )
}
