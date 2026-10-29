import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { track } from './track'
import { scrollToY } from '../system/scroll'

// Real URLs through the History API. Every route also ships its own static HTML (`node scripts/site.mjs postbuild`),
// so direct loads, sharing and crawlers work on Vercel. The page for the current route renders at route time.
const RouterCtx = createContext(null)
let preloadPage = () => {}
/** app.jsx registers the function that fetches a page's code, so links can warm it up before the click. */
export const setPreloader = (fn) => { preloadPage = fn }

function parseLocation() {
  // The build-time snapshot (ssr.jsx) has no window: it passes the path it is rendering.
  if (typeof window === 'undefined') return { path: globalThis.__SSR_PATH__ || '/', params: {} }
  return {
    path: window.location.pathname.replace(/\/+$/, '') || '/',
    params: Object.fromEntries(new URLSearchParams(window.location.search)),
  }
}

export function scrollToHash(hash, { instant = false } = {}) {
  const id = (hash || '').replace(/^#/, '')
  if (!id) return
  let tries = 0
  const go = () => {
    const el = document.getElementById(id)
    if (!el) { if (tries++ < 24) requestAnimationFrame(go); return }
    scrollToY(el, { immediate: instant, offset: -84 })
    if (!instant) return
    // A page opened on a hash: fonts and diagrams settle after first paint and move the target, so land again a few times.
    // Stops as soon as the visitor scrolls on their own.
    let mine = true
    const stop = () => { mine = false }
    window.addEventListener('wheel', stop, { once: true, passive: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    ;[250, 700, 1400].forEach((ms) => setTimeout(() => { if (mine) scrollToY(document.getElementById(id), { immediate: true, offset: -84 }) }, ms))
  }
  requestAnimationFrame(go)
}

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(parseLocation)

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = new URL(to, window.location.origin)
    const here = window.location.pathname.replace(/\/+$/, '') || '/'
    const samePage = (url.pathname.replace(/\/+$/, '') || '/') === here
    window.history[replace ? 'replaceState' : 'pushState'](null, '', url.pathname + url.search + url.hash)
    if (samePage && url.hash) { scrollToHash(url.hash); return }
    window.__oiNav = (window.__oiNav || 0) + 1 // pages can tell an arrival from inside the site from a direct visit
    const go = () => {
      startTransition(() => setRoute({ ...parseLocation(), n: Date.now() }))
      if (url.hash) scrollToHash(url.hash)
      else scrollToY(0, { immediate: true })
    }
    go()
  }, [])

  useEffect(() => {
    const on = () => { window.__oiNav = (window.__oiNav || 0) + 1; startTransition(() => setRoute(parseLocation())) }
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])

  // Any element with data-track reports a click. Registered once.
  useEffect(() => {
    const on = (e) => {
      const el = e.target.closest?.('[data-track]')
      if (el) track(el.getAttribute('data-track'), { label: (el.textContent || '').trim().slice(0, 48) })
    }
    document.addEventListener('click', on, true)
    return () => document.removeEventListener('click', on, true)
  }, [])

  // Same-origin relative links become client-side navigation. Registered once.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      navigate(href)
    }
    // Warm the next page on hover, keyboard focus or touch, so the click usually lands on code that is already here.
    const warm = (e) => {
      const href = e.target.closest?.('a[href^="/"]')?.getAttribute('href')
      if (href && !href.startsWith('//')) preloadPage(href.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/')
    }
    document.addEventListener('click', onClick)
    document.addEventListener('pointerover', warm, { passive: true })
    document.addEventListener('focusin', warm)
    document.addEventListener('touchstart', warm, { passive: true })
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', warm)
      document.removeEventListener('focusin', warm)
      document.removeEventListener('touchstart', warm)
    }
  }, [navigate])

  // Land on #section when a page is opened directly with a hash.
  useEffect(() => { scrollToHash(window.location.hash, { instant: true }) }, [])

  const value = useMemo(() => ({ route, navigate }), [route, navigate])
  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>
}
export const useRoute = () => useContext(RouterCtx)
