// One function, one event name per conversion step. It emits a DOM event (`oi:track`) and, if a tag manager has
// created window.dataLayer, pushes to it. No provider is bundled: add one in index.html (and in the CSP) when chosen.
export function track(name, props = {}) {
  try {
    const detail = { event: name, path: window.location.pathname, ...props }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail)
    if (typeof window.plausible === 'function') window.plausible(name, { props })
    if (typeof window.gtag === 'function') window.gtag('event', name, props)
    window.dispatchEvent(new CustomEvent('oi:track', { detail }))
  } catch (e) { /* tracking must never break the page */ }
}
