# Anjor Tank — portfolio

A multi-page product portfolio: Home, Work (7 case studies with a quick-view pop-up and a full page each), Architect, MESHHETU, Journey, Beyond work and Contact.

- **Content** lives in `src/content.js` (case studies, roles, copy). Edit text there.
- **Pages** are generated from that content by `src/render.js`; `vite.config.js` turns each route into a real HTML page at build time.
- **Illustrations** (isometric stack, wireframes, mockups) are generated as SVG in `src/art.js`.
- **Motion** is in `src/main.js` (GSAP: intro globe, scroll reveals, pinned story, quick-view, form).
- **Design tokens** (colours, type) are at the top of `src/styles.css`. No text is larger than 40px.

```
npm install
npm run dev      # local
npm run build    # outputs dist/
```

Deploys on Vercel from `main` (production) and `preview` (preview deployments).
