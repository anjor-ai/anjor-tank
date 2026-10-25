# Keyboard navigation

## Purpose and features
A dimensional keyboard is the homepage navigation. Six sculpted destination keys lead to Work, Experience, MESHHETU, Consulting, Outside work and Contact. Hover/focus displays a short description. Tab + Enter works with native links. No global single-letter shortcuts capture user input.

## Inputs and outputs
Click/tap/Enter navigates to the key URL. The greeting input accepts up to 32 characters; hello and meshhetu return special greetings. Other input gets a generic response. Typed physical key labels briefly depress. This input sends nothing and is not persisted.

## States and decisions
Default / hover / focus / pressed. Leaving or blurring restores the default caption. Pointer tilt is limited to fine pointers on desktop and disabled with reduced motion. Native links still work without JavaScript. On mobile the miniature keyboard is supplemented with six 44px-high text links.

## Assumptions and edge cases
CSS 3D transforms are visual presentation, not a WebGL model. Touch users do not need hover. Unknown greeting text remains safe via textContent. Theme preference persists locally; motion choice persists in the session. OS reduced motion takes precedence.

## UX and measurement
No analytics or remote calls. Proposed future optional event: destination_opened(destination, source); do not enable without an explicit analytics decision.

## Technical notes
src/render.js, src/main.js, src/studio-next.css. MESHHETU word reel uses src/artcv.js, src/dots.js and src/wm.js.

## Changelog / backlog
2026-10-25: New keyboard geometry, destinations, caption, greeting and mobile fallback. Backlog: owner-selected additional physical props and optional bespoke modeled assets.
