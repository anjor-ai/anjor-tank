import { defineConfig } from 'vite'
import * as S from './src/site.js'

// Build-time rendering: <!--@name--> markers in index.html are replaced with HTML from src/site.js,
// so the page ships as real markup (no empty shell, readable without JavaScript, good for crawlers).
const MARKERS = {
  proof: S.renderProof,
  'decision-list': S.renderDecisionList,
  'decision-body': () => S.renderDecisionBody(S.C.decisions[0]),
  work: S.renderWork,
  timeline: S.renderTimeline,
  edu: S.renderEdu,
  certs: S.renderCerts,
  gallery: S.renderGallery,
}
const render = () => ({
  name: 'render-static-markup',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace(/<!--@([\w-]+)-->/g, (m, k) => (MARKERS[k] ? MARKERS[k]() : m)),
  },
})

export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [render()],
  build: {
    rollupOptions: { input: { main: 'index.html', notfound: '404.html' } }, target: 'es2020', sourcemap: false, outDir: 'dist', chunkSizeWarningLimit: 600 },
})
