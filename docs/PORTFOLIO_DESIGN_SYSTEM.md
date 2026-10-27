# Portfolio design system

## Direction
Expressive, precise and welcoming. Simple typography should frame substantial illustration and interaction rather than remove them. Use the supplied references for layered product screens, dimensional compositions, illustrated bento panels, editorial photography and distinct visual rhythms.

## Preserved experiences
Retain the homepage case carousel and quick view, homepage ROQIVA, final CTA, footer, Work and Contact pages. Restore the signature opening film and Beyond Work's original illustrated experiences. Do not replace these with plain text rows or static photo grids.

## Palette and composition
- Shared light and dark tokens remain the basis: neutral surfaces, blue emphasis, strong contrast.
- Larger illustration panels use restrained navy, sage, blue and violet. Photo sections carry their own natural color.
- Layer product screens, smaller signal cards and evidence panels over an unfilled wireframe stage.
- Hero typography may reach 58px on Home and 82px on Beyond Work; mobile sizes and wrapping are explicit.
- Keep meaningful labels readable, borders fine, shadows localized and radii consistent within a component.

## Components
- Home: centered introduction, three-state product explorer using the real case-study mock components, animated signal illustrations, measured outcomes, and three illustrated method cards.
- Consulting: connected intelligence illustration, three selectable architecture layers, six illustrated service cards with native expandable scope, four illustrated delivery stages.
- Journey: portrait composition, career altitude diagram, illustrated chapters and principle cards. All career content remains accessible without switching tabs.
- Beyond Work: photographic hero with three manual scene selectors, contour lines and compass; original polaroid collage, topographic photo rail, racing telemetry and music visualizer. All 15 original photos retained. Decorative telemetry is explicitly labelled illustrative.

## Motion and access
- The original SiteFilm plays once per session (except the standalone ROQIVA intro), with Skip and Escape controls. Home offers replay.
- Do not stack a second Beyond Work intro over the site film.
- Respect reduced-motion preferences; the film and replay control are omitted in that mode.
- Canvas illustrations pause offscreen and in background tabs using the existing art engine.
- Native buttons expose selection with aria-pressed; native details expose expanded state. Images have descriptive alt text; decorative diagrams are hidden from assistive technology.

## Verification and release
Inspect Home, Consulting, Journey and Beyond Work in desktop/mobile layouts and both themes. Check the opener, selectors and restored photo rail. Run npm run verify and git diff --check. Publish the complete change set with one preview branch update and its single Git-triggered Vercel deployment. Do not manually redeploy or push main.

## Editorial composition refinement

The final `composition.css` layer establishes warm paper backgrounds, charcoal and sage contrast, with peach and lavender confined to illustration stages. Headlines use a larger, lighter scale. ProductStudio is a two-part composition: an editorial decision and outcome panel beside a substantial product interface. Rotation and small floating hero cards have been removed.

Consulting offerings use six distinct, explicitly illustrative workflow previews. Method, architecture and career chapter visuals use reusable code-native geometric studies in `EngineeringArt.jsx`: an isometric structure, an orbital system and layered interface planes. Retain the opener, ASCII artwork elsewhere, case carousel and Beyond Work scenes.

On narrow screens, scenes stack below the editorial copy. Workflow provenance remains visible, controls retain semantic buttons and native disclosures, and geometry remains decorative to assistive technology.
