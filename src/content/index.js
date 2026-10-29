// One CONTENT object. Pages read named exports from here; scripts/site.mjs reads the same data through the SSR bundle.
import * as siteFacts from './site.js'
import * as system from './system.js'
import * as pages from './portfolio.js'
import * as showcase from './showcase.js'
import * as roq from './roqiva.js'
import * as folio from './folio.js'
import * as gtmData from './gtm.js'
import { bridge } from './bridge.js'
import * as consultData from './consult.js'

export * from './site.js'
export * from './system.js'
export * from './portfolio.js'
export * from './showcase.js'
export * from './roqiva.js'
export * from './folio.js'
export { bridge } from './bridge.js'
export * from './consult.js'
export * as gtm from './gtm.js'

export const CONTENT = { ...siteFacts, ...system, ...pages, ...showcase, ...roq, ...folio, ...consultData, bridge, gtm: gtmData }
