import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Multi-folder project.
//   src/        the site (content, lib, components, diagrams, pages, styles)
//   public/     static files copied as they are (logo, opener film, icons, theme-init.js, opener.js)
//   scripts/    build tooling (site.mjs: per-route HTML, SEO files, checks)
// npm run build -> dist/  (real URLs, one HTML file per route, for Vercel)
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  build: {
    target: 'es2020', sourcemap: false, outDir: 'dist',
    copyPublicDir: !isSsrBuild, // the SSR bundle is build tooling, not a deploy target
    manifest: !isSsrBuild, // scripts/site.mjs reads it to preload each route's own chunk
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks: { react: ['react', 'react-dom'], gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/CustomEase', 'gsap/DrawSVGPlugin', 'gsap/MotionPathPlugin', '@gsap/react'] } } },
  },
}))
