// The app shell: providers, header/footer and the page for the current URL. Shared by the browser entry (main.jsx)
// and the build-time text snapshot (ssr.jsx), so both render exactly the same pages.
import { Component, Suspense, useEffect } from 'react'
import { routes } from './content'
import { Breadcrumbs, Footer, Nav, StoryPager } from './components/layout'
import { Button } from './components/ui'
import { RouterProvider, setPreloader, useRoute } from './lib/router'
import { ThemeProvider } from './lib/theme'
import { ToastProvider } from './lib/toast'
import { track } from './lib/track'

// Each page is its own chunk, loaded when its route is opened (and preloaded on hover or touch). `loaded` caches the components.
const loaders = {
  '/': () => import('./pages/Home'),
  '/work': () => import('./pages/Work'),
  '/work/:slug': () => import('./pages/Case'),
  '/roqiva': () => import('./pages/Roqiva'),
  '/journey': () => import('./pages/Journey'),
  '/beyond': () => import('./pages/Beyond'),
  '/hire': () => import('./pages/Hire'),
  '/contact': () => import('./pages/Contact'),
  '/privacy': () => import('./pages/Legal'),
}
// A case study opens at /work/<slug>; every slug is the same page, so they share one loader.
const loaderFor = (path) => loaders[path] || (/^\/work\/[a-z0-9-]+$/.test(path) && routes.some((r) => r.path === path) ? loaders['/work/:slug'] : null)
const loaded = {}
/** Used by the build-time text snapshot (ssr.jsx), which renders synchronously from already-imported pages. */
export const seedPages = (o) => Object.assign(loaded, o)
export const loadPage = (path) => {
  const load = loaderFor(path)
  if (loaded[path] || !load) return Promise.resolve()
  return load().then((m) => { loaded[path] = m.default })
}
setPreloader(loadPage)

function PageSlot({ path }) {
  const Page = loaded[path]
  if (!Page) { if (loaderFor(path)) throw loadPage(path); return <NotFound /> }
  return <Page />
}

function NotFound() {
  return (
    <section className="sec"><div className="container">
      <p className="label">404</p>
      <h1 className="h-hero">That page does not exist.</h1>
      <p className="lead" style={{ marginTop: 20 }}>It may have moved, or the link is mistyped. These pages do exist:</p>
      <ul className="nf__links">
        {routes.filter((r) => !r.hidden).map((r) => <li key={r.path}><a className="accent" href={r.path}>{r.label}</a></li>)}
      </ul>
    </div></section>
  )
}

/** One broken component must not blank the whole site. Keyed by route, so moving to another page recovers. */
class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err, info) { console.error('[boundary]', err, info && info.componentStack); track('js_error', { message: String(err && err.message).slice(0, 120), source: 'boundary' }) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="sec"><div className="container">
        <p className="label">Something went wrong</p>
        <h1 className="h-hero">This page did not load.</h1>
        <p className="lead" style={{ marginTop: 20 }}>Reload to try again. If it keeps happening, write to us and we will fix it.</p>
        <div style={{ marginTop: 24 }}><Button onClick={() => window.location.reload()}>Reload the page</Button></div>
      </div></section>
    )
  }
}

const setMeta = (sel, attr, value) => { const el = document.querySelector(sel); if (el && value != null) el.setAttribute(attr, value) }

/** Keeps the document head true to the page on screen when the visitor moves between routes. Static HTML already carries
    the right head for a direct load; this covers client-side navigation. */
function useDocumentHead(path) {
  useEffect(() => {
    const r = routes.find((x) => x.path === path)
    const brand = routes[0].title.split(' — ')[0]
    const title = r ? r.title : `Page not found — ${brand}`
    document.title = title
    const canon = document.querySelector('link[rel="canonical"]')
    const origin = canon ? new URL(canon.href).origin : window.location.origin
    const url = origin + (path === '/' ? '/' : path)
    if (r) {
      setMeta('meta[name="description"]', 'content', r.description)
      setMeta('meta[property="og:description"]', 'content', r.description)
      setMeta('meta[name="twitter:description"]', 'content', r.description)
    }
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="twitter:title"]', 'content', title)
    if (r) { setMeta('link[rel="canonical"]', 'href', url); setMeta('meta[property="og:url"]', 'content', url) }
    setMeta('meta[name="robots"]', 'content', r ? 'index,follow,max-image-preview:large' : 'noindex')
    // The page-specific JSON-LD in the static HTML describes the page that was loaded. Drop it once the visitor moves on.
    document.querySelectorAll('script[data-ld="page"]').forEach((el) => { if (el.getAttribute('data-path') !== path) el.remove() })
  }, [path])
}

function Shell() {
  const { route } = useRoute()
  useDocumentHead(route.path)
  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1} key={route.path + (route.n || '')} className="page route-enter" style={{ outline: 'none' }}>
        {!['/hire', '/journey', '/beyond'].includes(route.path) && <Breadcrumbs />}
        <Boundary key={route.path}>
          <Suspense fallback={<div className="page-wait" />}>
            <PageSlot path={route.path} />
          </Suspense>
        </Boundary>
        <StoryPager />
      </main>
      <Footer />
    </>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </RouterProvider>
    </ThemeProvider>
  )
}
