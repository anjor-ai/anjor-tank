# Interactive portfolio components

## Purpose
Help a visitor understand Anjor's product decisions and consulting approach, inspect the evidence, and open a relevant case study or contact path.

## Inputs and states
- Home illustration: Checkout (default), Discovery, Retention.
- Product thinking: three independent problem selections, Checkout default.
- Consulting architecture: GTM engineering (default), Revenue operations, ROQIVA.
- Services: six independent native disclosures; first initially open.
- Delivery: four independent native input/output disclosures; all initially closed.
- Theme: existing shared light/dark preference.

## Logic and outputs
Selection changes local React state only. Home and methodology values are fixed presentations of existing case metrics, not forecasts: +12.5pp prepaid conversion, +9% search-to-order, approximately 1,100 additional repeat orders/day. Each selection points to its matching case. Consulting selections explain each layer and link to contact or the ROQIVA walkthrough. ROQIVA is explicitly in development.

## UX, interactions and edge cases
Native keyboard-operable buttons expose pressed state. Links remain regular route URLs. Services and delivery use details/summary so their content remains in HTML and keyboard-accessible. No timers auto-switch the user's selection. State resets on route remount. Responsive layouts stack below 760px; narrow illustration composition keeps its outcome separate from explanatory text. Reduced-motion removes connector animation and transitions. No backend, user data, persisted prototype state, or fabricated live status.

## Measurement
Existing CTA tracking is retained on the homepage consulting link. Existing route analytics and error reporting remain. No additional tracking provider or personal data collection is introduced.

## Technical notes
NextHome.jsx and NextPages.jsx share GrowthMap; CSS in atelier.css. PageMotion owns GSAP reveals, scoped to each route. Components support server-rendered snapshots. Dark/light use shared tokens. Approved carousel and modal implementations are unchanged.

## Changelog
2026-10-27: Replaced repeated workspace/card patterns with layered decision scene, editorial questions, connected growth illustration, service disclosures and visible career chronology. Removed blocking site intro. Added responsive and reduced-motion rules.

## Backlog
User review of the visual direction; no additional functionality promised or enabled.

## Beyond Work opening and photo chapters
- Opening states: settled on SSR; optional intro after hydration; settled after 2.6 seconds or Skip. Session storage prevents repeat playback. Reduced-motion users see no intro.
- Explore and chapter links use native anchors; all 15 original photographs remain visible in three responsive chapters.
- No scroll lock, fabricated lap metrics, or auto-advancing photo gallery.
- Decorative SVG and ASCII artwork is hidden from assistive technology.
