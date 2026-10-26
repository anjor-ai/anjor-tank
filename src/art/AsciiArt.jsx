import { DotCanvas } from './ArtCanvas'
import { SCENES, STILL } from './cards'

const ALIAS = { chart: 'prove', release: 'ship' }
export const hasScene = (k) => Boolean(SCENES[ALIAS[k] || k])

/** A small dark screen with a line-art scene that draws itself (see art/cards.js). Decorative. */
export function AsciiArt({ kind, className = '' }) {
  const k = ALIAS[kind] || kind
  const fn = SCENES[k]
  if (!fn) return null
  return (
    <span className={`asc ${className}`.trim()} aria-hidden="true">
      <DotCanvas draw={(D, t) => fn(D, t)} cell={3} fps={16} still={STILL[k] ?? 5} />
    </span>
  )
}
