/* Native scrolling. The page no longer hijacks the wheel: the browser's own scroll is smoother on every device and
   never fights ScrollTrigger. This helper scrolls to a y offset or an element, leaving room for the fixed bar. */
export function initScroll() { return null }

export function scrollToY(target, { immediate = false, offset = 0 } = {}) {
  if (typeof window === 'undefined') return
  const behavior = immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  if (typeof target === 'number') { window.scrollTo({ top: target, behavior }); return }
  if (!target) return
  const y = target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top: Math.max(0, y), behavior })
}
