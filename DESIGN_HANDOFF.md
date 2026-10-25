# Anjor Tank portfolio — connected workspace redesign

## Direction · 25 October 2026
Deep ink / white, electric blue, pale blue and lime. Tactile keyboard navigation with small dimensional scenes. Space Grotesk + IBM Plex Sans + IBM Plex Mono; headings at most 40px. No metallic or glass skin. Content is server-generated static HTML, with progressive enhancements.

## Active architecture
- `src/render.js`: shell and all 15 static routes.
- `src/main.js`: navigation, GSAP motion, greeting, filters, case scenarios, email composer.
- `src/studio-next.css`: single active stylesheet, including responsive layouts.
- `src/content.js`: retained evidence, career history, project details and photography.
- `src/lab-data.js`: seven independent illustrative scenario sets.
- `src/artcv.js`, `src/dots.js`, `src/wm.js`: existing MESHHETU word-reel port and artwork.
- Older studio/liquid files remain as historical source only; they are not imported by the active renderer or runtime.

## Story and routes
Home → selected decisions → separate MESHHETU founder feature → current employment → outside work → contact.
`/work` and seven `/work/:slug` pages preserve detailed case narratives. `/experience` excludes the founder role. `/founder` owns the MESHHETU story; `/hire` explains Track A strategic consulting and Track B modular intelligence. ROQIVA is explicitly Track C, in development. `/about` owns personality and photography; `/contact` prepares an email draft for the visitor to send.

## Sources
All four user-specified reference repos were inspected. The supplied résumé and LinkedIn PDF informed career positioning. MESHHETU `src/art/Reel.jsx` was checked against the retained port: same hold, stagger, easing, shrinking letters, rotating miniature screens and sequential return; a ninth slot accommodates ANJOR TANK. Videos informed spatial navigation, restrained section reveals and photo layering. The uploaded keyboard image informed keycap depth and small workspace sculptures.

## Interaction specifications
Each case has its own spec in `docs/interactions/`. The examples are illustrative, never live business or clinical systems. No analytics or production API writes are added. Mobile supplies larger navigation links beneath the scaled keyboard; desktop retains direct keycap links. Wordmarks and animation stop under reduced motion or the session pause setting. Email composer uses `mailto:` and does not claim that a message has been sent.

## Verification
- Build and smoke tests: 15 routes, one H1 per route, unique IDs, internal links, images, anchors, founder separation, seven scenario datasets.
- Browser: desktop navigation, greeting, Payments filter, all seven third-scenario states, Price Lock refund and reset, light theme, motion pause, Track B enquiry preselection.
- Responsive QA: 390px frame (375px content) and 768px frame; fixed mobile keyboard overflow; mobile menu opens/closes and Escape restores focus. No horizontal overflow in the tested phone home layout.
- Limitations: no real-device test, Lighthouse score, external booking completion or email delivery assertion. Existing project metrics remain self-reported, with editorial verification notes in CONTENT_QA.md.

## Release
One final preview branch update after local checks. Main is not changed. Use the Git-connected Vercel preview; do not add a second deployment for the same commit.
