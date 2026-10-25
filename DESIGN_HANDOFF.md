# Liquid Studio — visual handoff

**Branch:** preview  · **Design direction:** restrained Apple Keynote-inspired liquid glass (not neon dashboard).

## Design tokens
- Light background `#f7f9fd`, text `#151b29`, primary cobalt `#386ff2`
- Dark background `#080c15`, text `#edf3ff`, light-blue interactive accents
- Pearl/chrome keyboard on a soft cool background, translucent frosted UI surfaces with subtle glass edge strokes
- Typography: Space Grotesk / IBM Plex Sans / IBM Plex Mono; type remains <=40px in headings
- Design system source: `src/liquid-glass.css` (loaded after prior styles)

## Hero architecture
- Primary composition `src/liquid-hero.js`: centered headline + full-width silver keyboard; direct call-to-actions.
- Static **SVG image** in `public/img/keyboard-silver.svg`: genuine scale-independent, locally served artwork, not WebGL.
- Six anchor hotspots are positioned by original art coordinates: x = [102, 317, 532, 747, 962, 1177], width = 196, y = 258, height = 128, base viewBox = 1500×610. Update these numbers together if replacing artwork.
- Work, Experience, Hire Me, MESHHETU, About and Contact route links stay functional on desktop. Dedicated mobile shortcut links appear when hotspots are too small.
- `src/liquid-motion.js` adds hover information, subtle GSAP depth and reveal. Reduced-motion skips animation.
- To make the keyboard *truly photoreal*, replace `keyboard-silver.svg` with an optimized wide render at matching 1500×610 composition and preserve hotspot geometry. Do not use a full screenshot with header text baked into it.
- Any replacement should include appropriate image rights, a compressed responsive source and a visible fallback.

## Editorial architecture
- Home: keyboard hero → measured proof → three featured stories → timeline teaser → Track A consulting → personal teaser.
- Work: three featured case studies, four compact studies and seven detailed pages.
- Experience: full career timeline with GNC India PM current, Truemeds, marketing experience; MESHHETU represented separately as a founder venture.
- Hire Me: consumer PM opportunities + Track A (available consulting); ROQIVA is in development.
- About: perspectives and personal interests, **not a duplicate full career timeline**.
- Contact: direct email / LinkedIn + existing form.

## Release quality gates
1. `npm run test` static route verification (14 pages, keyboard links, consulting and timeline).
2. `npm run build`, then Vercel preview build.
3. Visual review at 390, 768, 1280 and 1440 pixels, both color themes, keyboard tab order and touch links.
4. Check contact form delivery and Core Web Vitals before promoting preview to production.

**Deployment rule:** Stage blobs and an unreferenced Git commit, then perform a *single* preview ref update. No repeated incremental pushes to the Vercel-watched branch.
