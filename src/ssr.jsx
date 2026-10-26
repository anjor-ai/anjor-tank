// Build-time text snapshot. `vite build --ssr` bundles this; `node scripts/site.mjs postbuild` calls render(path) for each route
// and places the result inside #root (visually hidden) so crawlers and AI agents that do not run JavaScript still get the
// page's real headings and copy. The browser then replaces it with the live page (createRoot, never hydrate).
import { renderToStaticMarkup } from 'react-dom/server'
import { App, seedPages } from './app'
import Home from './pages/Home'
import Work from './pages/Work'
import Case from './pages/Case'
import Roqiva from './pages/Roqiva'
import Journey from './pages/Journey'
import Beyond from './pages/Beyond'
import Hire from './pages/Hire'
import Contact from './pages/Contact'
import Legal from './pages/Legal'
import { CONTENT, CASES } from './content'

seedPages({
  '/': Home, '/work': Work, '/roqiva': Roqiva, '/journey': Journey, '/beyond': Beyond, '/hire': Hire, '/contact': Contact, '/privacy': Legal,
  ...Object.fromEntries(CASES.map((c) => [`/work/${c.slug}`, Case])),
})

export function render(path) {
  globalThis.__SSR_PATH__ = path
  return renderToStaticMarkup(<App />)
}
// scripts/site.mjs reads routes, tracks, agents and the rest of the copy from here, so the sitemap, JSON-LD and llms.txt never drift from the pages.
export { CONTENT }
