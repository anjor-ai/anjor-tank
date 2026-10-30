// One function, one event name per conversion step. It only emits a DOM event (`oi:track`) on the page:
// no analytics or tag-manager script is loaded or called.
export function track(name, props = {}) {
  try {
    window.dispatchEvent(new CustomEvent('oi:track', { detail: { event: name, path: window.location.pathname, ...props } }))
  } catch (e) { /* tracking must never break the page */ }
}
