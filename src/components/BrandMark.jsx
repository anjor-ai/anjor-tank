/** The AT keycap: the site's mark, the same as the favicon. */
export function BrandMark({ className = '', decorative = false }) {
  return <img src="/favicon.svg" className={['brand-mark', className].filter(Boolean).join(' ')} width="40" height="40" alt={decorative ? '' : 'Anjor Tank'} aria-hidden={decorative || undefined} decoding="async" />
}
