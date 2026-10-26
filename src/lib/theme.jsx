import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

const ThemeCtx = createContext(null)
const THEME_KEY = 'orch-theme'
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Paint a theme on the page. Does not remember it. */
function paint(t) {
  document.documentElement.setAttribute('data-theme', t)
  const m = document.querySelector('meta[name="theme-color"]')
  if (m) m.setAttribute('content', t === 'light' ? '#FAFAFA' : '#141413')
}
/** The reader's own choice: painted and remembered on this device. */
function store(t) {
  try { localStorage.setItem(THEME_KEY, t) } catch (e) { /* storage may be blocked */ }
}

export function ThemeProvider({ children }) {
  // The reader's choice. A page can force a theme for itself (ROQIVA is always dark) without changing that choice.
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' } catch (e) { return 'light' }
  })
  const [forced, setForced] = useState(null)
  const shown = forced || theme
  useIso(() => { paint(shown) }, [shown])
  // Circular reveal from the click point through the View Transitions API. Falls back to an instant swap.
  const toggle = useCallback((origin) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const apply = () => { store(next); paint(next); setTheme(next) }
    if (!document.startViewTransition || reduce) { apply(); return }
    const x = origin?.clientX ?? window.innerWidth - 48
    const y = origin?.clientY ?? 32
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const vt = document.startViewTransition(() => { flushSync(apply) })
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    }).catch(() => {})
  }, [theme])
  const value = useMemo(() => ({ theme: shown, chosen: theme, forced, toggle, setForced }), [shown, theme, forced, toggle])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}
export const useTheme = () => useContext(ThemeCtx)

/** Show this page in one theme while it is open. The reader's own choice comes back when they leave. */
export function useForcedTheme(t) {
  const { setForced } = useTheme()
  useIso(() => { setForced(t); return () => setForced(null) }, [t, setForced])
}
