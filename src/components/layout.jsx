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

export function Nav() {
  const { route } = useRoute()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const btn = useRef(null)
  const menu = useRef(null)
  const pill = useRef(null)
  const links = routes.filter((r) => !r.hidden)
  const main = links.filter((r) => r.path !== '/' && r.path !== '/contact')

  useEffect(() => { setOpen(false) }, [route.path])
  // Hide on the way down, return on the way up; always shown near the top.
  useEffect(() => {
    let lastY = window.scrollY
    const on = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setHidden(y > 240 && y > lastY + 2)
      if (y < lastY - 2 || y < 240) setHidden(false)
      lastY = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // The marker slides to the current page's link.
  useEffect(() => {
    const p = pill.current
    if (!p) return undefined
    const place = () => {
      const a = p.querySelector('[aria-current="page"]') || p.querySelector(`a[href="/${route.path.split('/')[1]}"]`)
      if (!a) { p.style.setProperty('--mw', '0px'); return }
      p.style.setProperty('--mx', `${a.offsetLeft}px`); p.style.setProperty('--mw', `${a.offsetWidth}px`)
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [route.path])
  // Open: lock page scroll, make the page behind inert, move focus into the menu. Esc closes.
  useEffect(() => {
    if (!open) return undefined
    const behind = BEHIND_MENU.flatMap((s) => [...document.querySelectorAll(s)])
    behind.forEach((el) => el.setAttribute('inert', ''))
    document.body.style.overflow = 'hidden'
    menu.current?.querySelector('a')?.focus({ preventScroll: true })
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    const mq = window.matchMedia('(min-width: 1021px)')
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
  return (
    <header className={`nv${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}${open ? ' is-open' : ''}`}>
      <div className="nv__in">
        <a href="/" className="nv__brand" aria-label={`${site.name} home`}><BrandMark className="nv__mark" decorative /><span>{site.name}</span></a>
        <nav className="nv__pill" ref={pill} aria-label="Main">
          <span className="nv__marker" aria-hidden="true" />
          {main.map((r) => (
            <a key={r.path} href={r.path} aria-current={here(r.path) ? 'page' : undefined}>{r.label}{r.badge && <span className="nv__dot" aria-label={r.badge} />}</a>
          ))}
        </nav>
        <div className="nv__right">
          <SoundToggle />
          <span className="nv__theme"><ThemeToggle /></span>
          <Button to="/contact?intent=consult#brief" size="sm" className="nv__cta" track="cta_consult_nav">Let's talk <Arrow /></Button>
          <Button to="/contact#brief" size="sm" className="nv__cta-m" track="cta_contact_nav_mobile">Get in touch</Button>
          <button type="button" ref={btn} className="nv-ic nv__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className={`burger${open ? ' is-open' : ''}`} aria-hidden><i /><i /></span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={menu} className="mm" hidden={!open} onClick={(e) => { if (e.target.closest('a')) setOpen(false) }}>
        <Shader preset="violet" className="mm__bg" />
        <nav className="mm__in" aria-label="Mobile">
          {links.map((r, i) => (
            <a key={r.path} href={r.path} className="mm__link" style={{ '--i': i }} aria-current={here(r.path) && r.path !== '/' ? 'page' : route.path === '/' && r.path === '/' ? 'page' : undefined}>
              <small>0{i + 1}</small>{r.label}
            </a>
          ))}
          <div className="mm__row">
            <Button to="/contact?intent=consult#brief" className="mm__cta" track="cta_consult_menu">Discuss a project<Arrow /></Button>
            <span className="mm__ic"><SoundToggle /><ThemeToggle /></span>
          </div>
        </nav>
      </div>
    </header>
  )
}

const STORY = routes.filter((r) => r.story)
const storyIndex = (path) => STORY.findIndex((r) => r.path === path || path.startsWith(r.path + '/'))

/** The trail below the nav on every page but the home page. The same trail ships as BreadcrumbList JSON-LD (site.mjs). */
export function Breadcrumbs() {
  const { route } = useRoute()
  if (route.path === '/') return null
  const r = routes.find((x) => x.path === route.path)
  const parent = r && r.parent ? routes.find((x) => x.path === r.parent) : null
  const cur = storyIndex(route.path)
  return (
    <div className="bc">
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          {parent && <li><a href={parent.path}>{parent.label}</a></li>}
          <li><span aria-current="page">{r ? r.label : 'Page not found'}</span></li>
        </ol>
      </nav>
      {cur >= 0 && (
        <nav className="bc__steps" aria-label="The story, in order">
          <ol>
            {STORY.map((x, i) => (
              <li key={x.path}><a href={x.path} title={x.label} aria-current={i === cur ? 'step' : undefined} className={i < cur ? 'is-past' : undefined}><b>0{i + 1}</b><span>{x.step}</span></a></li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  )
}

/** The hand-over at the bottom of each story page: one large line that is a door to the next page. */
export function StoryPager() {
  const { route } = useRoute()
  const p = pager[route.path]
  if (!p) return null
  const next = routes.find((r) => r.path === p.to)
  return (
    <section className="np" aria-label="Next page">
      <a className="np__a" href={p.to} data-track="pager_next" data-cursor="Next">
        <span className="np__k">{p.kicker}</span>
        <span className="np__t"><Rich text={p.title} /></span>
        <span className="np__d">{p.d}</span>
        <span className="np__go">{next ? next.label : 'Continue'}<i><Icon name="arrow" size={20} /></i></span>
        <span className="np__fill" aria-hidden="true" />
      </a>
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
        <Shader preset="violet" className="ft__bg" />
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
