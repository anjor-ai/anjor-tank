// Entry point: fonts, styles, and the app shell (providers + header/footer + the page for the current URL).
// The page for the current route renders here, at route time. Nothing is injected into the DOM afterwards.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/space-grotesk/latin-400.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-600.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/chakra-petch/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/anton/latin-400.css'

import './styles'
import { App, loadPage } from './app'
import { track } from './lib/track'

// Load the code for the page being opened first, then render once: the page appears in one step, with no empty frame in between.
const start = () => createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
loadPage(window.location.pathname.replace(/\/+$/, '') || '/').then(start, start)

// Uncaught errors become one `js_error` event each (max 5 per page view), so a monitor or tag manager can alert on them.
let reported = 0
const report = (message, source) => { if (reported++ < 5) track('js_error', { message: String(message).slice(0, 120), source }) }
window.addEventListener('error', (e) => report(e.message, 'window'))
window.addEventListener('unhandledrejection', (e) => report(e.reason && e.reason.message ? e.reason.message : e.reason, 'promise'))
