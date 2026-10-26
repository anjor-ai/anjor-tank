import { useState } from 'react'
import { DesignScene } from './DesignScene'
import { PrdScene } from './PrdScene'

/** Build is two scenes, one after the other: the Product agent writes the PRD, then the Design agent builds the prototype from it.
 *  `auto` hands over to `onDone` after the second; otherwise the pair repeats. */
export function BuildStage({ auto = false, onDone, ...rest }) {
  const [phase, setPhase] = useState(0)
  return phase === 0
    ? <PrdScene key="prd" mode="active" onDone={() => setPhase(1)} {...rest} />
    : <DesignScene key="design" mode="active" onDone={() => (auto && onDone ? onDone() : setPhase(0))} {...rest} />
}
