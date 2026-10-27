# Portfolio visual system — 27 October 2026

## Direction
A welcoming product-management portfolio with the restraint of Linear and Vercel, the editorial clarity of Claude, and Clay's approachable product storytelling. Reference screenshots informed layered product surfaces, clear typographic hierarchy, a portrait-led story, and connected system illustrations. Do not copy third-party logos, copy, or product screens.

Consulting remains the primary contact path; a product role is secondary. ROQIVA is Anjor's founder-led product in development. Do not add family references or outbound Meshhetu links.

## Preserved experiences
Keep the homepage case-study carousel and quick-view modal, homepage ROQIVA component, final CTA, footer, Work page and Contact page. Their composition and behavior are retained. Shared palette tokens may update their inherited colors.

## Visual decisions
- Light: #fcfcfd canvas, white surfaces, #171a21 text, #3459bf accent text.
- Dark: #101114 canvas, #1a1c22 surfaces, #f0f1f5 text, #a9baff accent text.
- Use blue sparingly for active states, connectors, and affordances. No ambient orange/purple page wash.
- Space Grotesk headings (500), IBM Plex Sans body, IBM Plex Mono only where numbering helps.
- Product-page headings cap at 40px. Beyond Work uses a larger editorial hero. Supporting text must remain readable; technical annotations are secondary.
- New component corners: 8–12px. Prefer separators and open editorial layouts to nested cards.
- New sections: 64px desktop, 42px mobile. Center headings when the underlying composition is centered.
- Keep diagrams concrete: customer signal → product decision → measured outcome. Metrics are from existing case studies, not invented demo telemetry.

## Components
`NextHome.jsx`: selectable product scene, question-led methodology, portrait and compact career timeline, connected growth illustration.
`NextPages.jsx`: consulting architecture selector, native service disclosures, delivery process, complete visible career chronology, product principles.
`atelier.css`: final shared palette and isolated component rules; fixed import order in styles/index.js.
`PageMotion`: route-scoped reveal effects with reduced-motion support. No full-screen site intro gate.

## Interactions and accessibility
Selectors are native buttons with aria-pressed. Service and delivery disclosures use native details/summary. All actions work without hover. Case-state changes update the corresponding case link. Reduced-motion disables decorative motion. SVG connectors are decorative; explanatory text is available in HTML.

## Validation and publication
Run production build, static checks and internal-link validation. Inspect Home, Consulting, Journey and a case study in-browser, plus mobile-width layouts and both themes. Preserve the approved pages and interactions. Push one commit to preview; allow only its Git-triggered deployment. Do not push main or trigger an extra manual deployment.

## Beyond Work — revised scope
The October 27 request explicitly redesigns Beyond Work. Use warm stone, muted olive, real adventure photography, three editorial photo chapters, and a 2.6-second inline opener with a Skip control. Play once per session, omit under reduced motion, and never lock scrolling. Remove simulated telemetry from personal photos. Product scenes use SVG wireframe geometry and an ASCII signal instead of generic decorative stars.
