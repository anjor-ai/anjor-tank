import { useEffect, useRef, useState } from 'react'
import { footer, pager, routes, site } from '../content'
import { useRoute } from '../lib/router'
import { MQ, gsap, useGSAP } from '../lib/motion'
import { useTheme } from '../lib/theme'
import { Icon } from './icons'
import { BrandMark } from './BrandMark'
import { Arrow, Button, Rich, Wordmark } from './ui'
import { AsciiName } from './asciiName'

function ThemeToggle() {
  const { theme, forced, toggle } = useTheme()
  if (forced) return null // this page has one theme (ROQIVA is always dark)
  return (
    <button type="button" className="icon-btn" onClick={(e) => toggle(e)} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  )
}

/** Elements made inert while the full-screen mobile menu is open, so Tab and screen readers stay inside it. */
const BEHIND_MENU = ['.skip-link', '#main', '.ft']

export function Nav() {
  const { route } = useRoute()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const btn = useRef(null)
  const menu = useRef(null)
  const links = routes.filter((r) => !r.hidden)

  useEffect(() => { setOpen(false) }, [route.path])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // Open: lock page scroll, make the page behind inert, move focus into the menu. Esc closes and returns focus to the button.
  // Growing past the burger breakpoint closes it too, so a rotated phone never keeps the page locked.
  useEffect(() => {
    if (!open) return
    const behind = BEHIND_MENU.flatMap((q) => [...document.querySelectorAll(q)])
    behind.forEach((el) => el.setAttribute('inert', ''))
    document.body.style.overflow = 'hidden'
    menu.current?.querySelector('a')?.focus({ preventScroll: true })
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    const mq = window.matchMedia('(min-width: 901px)')
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

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container nav__in">
        <a href="/" className="nav__brand" aria-label={`${site.name} home`}><BrandMark className="nav__mark" decorative /><AsciiName text={site.name} /></a>
        <nav className="nav__links" aria-label="Main">
          {links.filter((r) => r.path !== '/' && r.path !== '/contact').map((r) => (
            <a key={r.path} href={r.path} className={`nav__link${r.badge ? ' nav__link--new' : ''}`} aria-current={route.path === r.path ? 'page' : undefined}>{r.label}{r.badge && <span className="nav__dot" aria-label={r.badge} />}</a>
          ))}
        </nav>
        <div className="nav__right">
          <span className="nav__theme"><ThemeToggle /></span>
          <Button to="/contact?intent=consult#brief" size="sm" className="nav__cta" track="cta_consult_nav">Let's talk <Arrow /></Button>
          <Button to="/contact#brief" size="sm" className="nav__cta-m" track="cta_contact_nav_mobile">Get in touch</Button>
          <button type="button" ref={btn} className="icon-btn nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className={`burger${open ? ' is-open' : ''}`} aria-hidden><i /><i /></span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" ref={menu} className="mmenu" hidden={!open} onClick={(e) => { if (e.target.closest('a')) setOpen(false) }}>
        <nav className="container mmenu__in" aria-label="Mobile">
          {links.map((r, i) => (
            <a key={r.path} href={r.path} className="mmenu__link" style={{ '--i': i }} aria-current={route.path === r.path ? 'page' : undefined}>
              <span className="label">0{i + 1}</span>{r.label}
            </a>
          ))}
          <div className="mmenu__row">
            <Button to="/contact?intent=consult#brief" className="mmenu__cta" track="cta_consult_menu">Discuss a project<Arrow /></Button>
            <span className="mmenu__theme"><ThemeToggle /></span>
          </div>
        </nav>
      </div>
    </header>
  )
}

const STORY = routes.filter((r) => r.story)
/** Where a path sits in the story: the index of its page, or of its parent for a case study. */
const storyIndex = (path) => STORY.findIndex((r) => r.path === path || path.startsWith(r.path + '/'))

/** The trail for every page below the home page, plus the story: six numbered steps, the current one marked.
    The same trail ships as BreadcrumbList JSON-LD (site.mjs). */
export function Breadcrumbs() {
  const { route } = useRoute()
  if (route.path === '/') return null
  const r = routes.find((x) => x.path === route.path)
  const parent = r && r.parent ? routes.find((x) => x.path === r.parent) : null
  const cur = storyIndex(route.path)
  return (
    <div className="crumbs container story">
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          {parent && <li><a href={parent.path}>{parent.label}</a></li>}
          <li><span aria-current="page">{r ? r.label : 'Page not found'}</span></li>
        </ol>
      </nav>
      {cur >= 0 && (
        <nav className="story__steps" aria-label="The story, in order">
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

/** The hand-over at the bottom of each story page: where the story goes next, and why. */
export function StoryPager() {
  const { route } = useRoute()
  const p = pager[route.path]
  if (!p) return null
  const next = routes.find((r) => r.path === p.to)
  return (
    <section className="pager" aria-label="Next page">
      <div className="container">
        <a className="pager__card" href={p.to} data-track="pager_next">
          <span className="label pager__k">{p.kicker}</span>
          <span className="pager__t h-2"><Rich text={p.title} /></span>
          <span className="pager__d">{p.d}</span>
          <span className="pager__go">{next ? next.label : 'Continue'}<Arrow /></span>
        </a>
      </div>
    </section>
  )
}

// The footer: the story, how to talk, where I am now. The name lives in the nav, as an ASCII decode.

export function Footer() {
  const story = routes.filter((r) => r.story)
  const ref = useRef(null)
  // The signature move: the name at the foot grows into place as the page closes (scroll-linked, under 8%).
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo('[data-ft-name]', { scale: 0.93, yPercent: 12 }, { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <footer className="ft" ref={ref}>
      <div className="container ft__in">
        <div className="ft__brand">
          <a href="/" className="ft__logo"><BrandMark className="nav__mark" decorative /><Wordmark /></a>
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
      <div className="ft__name" aria-hidden="true"><span data-ft-name>{site.name}</span></div>
      <div className="container ft__base">
        <p><span>© {new Date().getFullYear()} {site.name} · <a href="/privacy">Privacy</a></span></p>
        <p>{footer.note}</p>
      </div>
    </footer>
  )
}
