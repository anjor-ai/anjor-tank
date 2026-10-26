// One tool, seven commands (no dependencies):
//   node scripts/site.mjs preflight   runs before every build: makes sure the project was uploaded completely
//   node scripts/site.mjs postbuild   runs after `vite build` + `vite build --ssr`: one HTML file per route (own head, JSON-LD, text snapshot),
//                             sitemap.xml, robots.txt (from seo/), llms.txt, llms-full.txt, a markdown copy of every page, humans.txt,
//                             IndexNow key, manifest, 404.html; generated files are mirrored to ignored seo/ locally.
//   node scripts/site.mjs check       verifies dist/ is safe and complete to deploy (SEO, security, CSP, structure)
//   node scripts/site.mjs links       follows every internal link and #anchor in dist/ and reports the broken ones
//   node scripts/site.mjs indexnow    pings Bing, Yandex and others (IndexNow) with every URL after a deploy; needs SITE_URL and network
//   node scripts/site.mjs serve       serves dist/ like Vercel (clean URLs, redirects, real headers, real 404)
import http from 'node:http'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { site as canonicalSite } from '../src/content/site.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const cmd = process.argv[2]
// public/ is copied into dist/ by Vite. These are the files the site cannot work without (preflight and check both look for them).
// scripts/security.txt is templated into /.well-known/security.txt, and scripts/404.html into /404.html.
const PUBLIC = ['theme-init.js', 'favicon.svg', 'favicon.ico', 'favicon-32.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'og-image.jpg', 'hills-light.webp', 'hills-dark.webp', 'band-light.webp', 'band-dark.webp', 'sky-light.webp', 'sky-dark.webp']
const PAGES = ['Home', 'Work', 'Case', 'Roqiva', 'Journey', 'Beyond', 'Hire', 'Contact', 'Legal']
const loadContent = () => import(pathToFileURL(join(root, 'src', 'content', 'index.js')).href)
const read = (f) => readFileSync(f, 'utf8')
const routeFile = (p) => (p === '/' ? join(dist, 'index.html') : join(dist, p.slice(1), 'index.html'))

const siteUrl = () => {
  // All deployments (including previews) use the verified public canonical
  // origin in SEO metadata, never the Vercel deployment hostname.
  const expected = canonicalSite.url.replace(/\/+$/, '')
  const configured = (process.env.SITE_URL || '').replace(/\/+$/, '')
  if (configured && configured !== expected) {
    throw new Error(`SITE_URL must be ${expected}, not ${configured}. Update build configuration.`)
  }
  return expected
}

// ─────────────────────────── preflight ───────────────────────────
function preflight() {
  const need = ['index.html', 'vite.config.js', 'vercel.json', 'scripts/404.html', 'scripts/security.txt', 'src/main.jsx', 'src/app.jsx', 'src/ssr.jsx', 'src/content/index.js', 'src/styles/index.js',
    ...PUBLIC.map((f) => `public/${f}`), 'seo/robots.txt', 'seo/humans.txt', 'seo/indexnow-key.txt', ...PAGES.map((p) => `src/pages/${p}.jsx`)]
  const missing = need.filter((f) => !existsSync(join(root, f)))
  if (!missing.length) return
  console.error('\n✗ The project is incomplete. These files are missing:\n' + missing.map((m) => '   ' + m).join('\n'))
  console.error('\nKeep the folder layout from the README (src/, public/, scripts/, seo/) and redeploy.\n')
  process.exit(1)
}

// ─────────────────────────── helpers for postbuild ───────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ld = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

/** Structured data. Every fact here comes from src/content: nothing is added that the visible pages do not already say. */
function structuredData(c, SITE, r) {
  const { site, gtm } = c
  const person = `${SITE}/#person`, web = `${SITE}/#website`
  const url = SITE + (r.path === '/' ? '/' : r.path)
  const siteGraph = [
    {
      '@type': 'Person', '@id': person, name: site.name, url: `${SITE}/`, jobTitle: 'Product architect', description: `${site.category}. ${site.tagline}`,
      email: site.email, sameAs: [site.linkedin], image: `${SITE}/img/anjor.webp`, address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
      knowsAbout: ['Product management', 'Payments and checkout', 'Growth and lifecycle', 'GTM engineering', 'Revenue operations', 'Agentic AI'],
    },
    { '@type': 'WebSite', '@id': web, url: `${SITE}/`, name: site.name, description: site.category, inLanguage: 'en', publisher: { '@id': person } },
  ]
  const page = [{
    '@type': r.type || 'WebPage', '@id': `${url}#webpage`, url, name: r.title, description: r.description, inLanguage: 'en',
    isPartOf: { '@id': web }, about: { '@id': person }, dateModified: r.updated,
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.jpg`, width: 1200, height: 630 },
    ...(r.path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  }]
  if (r.path !== '/') {
    const trail = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }]
    const parent = r.parent && c.routes.find((x) => x.path === r.parent)
    if (parent) trail.push({ '@type': 'ListItem', position: 2, name: parent.label, item: SITE + parent.path })
    trail.push({ '@type': 'ListItem', position: trail.length + 1, name: r.label, item: url })
    page.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: trail })
  }
  if (r.path === '/hire') {
    page.push({
      '@type': 'Service', '@id': `${SITE}/#service`, name: 'GTM engineering and revenue operations', serviceType: 'Revenue systems for ecommerce and D2C teams', description: r.description,
      provider: { '@id': person }, audience: { '@type': 'Audience', audienceType: 'Ecommerce and D2C teams' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Six offers', itemListElement: gtm.services.map((o) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: o.name, description: o.line } })) },
    })
  }
  if (r.path === '/roqiva') {
    page.push({ '@type': 'SoftwareApplication', '@id': `${url}#software`, name: 'ROQIVA', applicationCategory: 'BusinessApplication', url, creator: { '@id': person }, description: r.description })
  }
  return { siteLd: { '@context': 'https://schema.org', '@graph': siteGraph }, pageLd: { '@context': 'https://schema.org', '@graph': page } }
}

const decode = (t) => t.replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const flat = (t) => decode(t.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

/** Markdown copy of a page, made from the same text snapshot that crawlers read. Main content only (no header, footer or controls' chrome). */
function htmlToMd(html, SITE) {
  const m = html.match(/<main[^>]*>([\s\S]*)<\/main>/)
  let h = (m ? m[1] : html).replace(/<!--[\s\S]*?-->/g, '')
  h = h.replace(/<nav[^>]*aria-label="(?:Breadcrumb|The story, in order|Sections of this page)"[^>]*>[\s\S]*?<\/nav>/g, '')
    .replace(/<(span|i|b|em|u|small)\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<(span|i)\b[^>]*aria-hidden="true"[^>]*\/>/g, '')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, t) => {
      const txt = flat(t); if (!txt) return ''
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return txt
      return `[${txt}](${href.startsWith('/') ? SITE + href : href})`
    })
    .replace(/<h([1-4])\b(?![^>]*role="presentation")[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, t) => `\n\n${'#'.repeat(+n)} ${flat(t)}\n\n`)
    .replace(/<li\b[^>]*>/g, '\n- ').replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?(p|div|section|article|aside|header|footer|ul|ol|li|tr|table|figure|figcaption|dl|dt|dd|pre|blockquote|button|h[1-6])\b[^>]*>/g, '\n')
  const lines = decode(h.replace(/<[^>]+>/g, ' ')).split('\n').map((l) => l.replace(/[ \t]+/g, ' ').replace(/ ([.,;:!?)])/g, '$1').replace(/\)\[/g, ') [').trim())
  const out = []
  for (const l of lines) {
    if (!l) { if (out.length && out[out.length - 1] !== '') out.push(''); continue }
    if (l === '-' || l === '- ') continue
    if (l.startsWith('- ') && out[out.length - 1] === '' && (out[out.length - 2] || '').startsWith('- ')) out.pop()
    if (out.length && out[out.length - 1] === l && !l.startsWith('#')) continue
    out.push(l)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
const mdPath = (r) => (r.path === '/' ? 'index.md' : `${r.path.slice(1)}.md`)

/** llms.txt (the llmstxt.org layout): name, one-line summary, a short orientation, then links to clean markdown copies of each page. Built from src/content only. */
function llmsTxt(c, SITE) {
  const { site, routes, gtm, status } = c
  const L = [`# ${site.name}`, '', `> ${site.category}. ${site.tagline}`, '',
    `${site.name} is a product architect in Mumbai. He has owned payments, growth, search, AI and internal platforms at a Series C online pharmacy, offers GTM engineering and RevOps work, and is building ROQIVA, a governed revenue-operations system that is in development. ROQIVA has no separate website; its page here is the only one.`, '',
    '## Pages', '', ...routes.map((r) => `- [${r.label}](${SITE}/${mdPath(r)}): ${r.description}`), '',
    '## Offers', '', ...gtm.services.map((o) => `- ${o.name} (${o.first}, ${o.model}): ${o.line}`), '',
    '## Status vocabulary', '', 'Anything not marked Available today is not available today. ROQIVA is In development.', '', ...Object.values(status).map((s) => `- ${s.label}`), '',
    '## Contact', '', `- Email: ${site.email}`, `- Book a call: ${SITE}/contact#book`, `- Send a brief: ${SITE}/contact#brief`, '',
    '## Optional', '', `- [Full site as one markdown file](${SITE}/llms-full.txt)`, `- [Sitemap](${SITE}/sitemap.xml)`, '']
  return L.join('\n')
}

/** Everything in one file, for assistants that read a single document. */
function llmsFull(c, SITE, pages) {
  const { site, routes, gtm } = c
  const L = [`# ${site.name}: full site content`, '', `> ${site.category}. ${site.tagline}`, '', `Source: ${SITE}. Generated from the live pages; product screens use sample data. ROQIVA is in development.`, '']
  for (const r of routes) L.push('---', '', `Page: ${SITE}${r.path === '/' ? '/' : r.path}`, `Title: ${r.title}`, `Last updated: ${r.updated}`, '', pages[r.path] || r.description, '')
  return L.join('\n')
}

/** Render one route to HTML text with the app itself (ssr.jsx). Text only: drawings and styles are removed. */
async function snapshot(render, path) {
  const orig = console.error
  console.error = (m, ...a) => { if (!String(m).includes('useLayoutEffect does nothing on the server')) orig(m, ...a) }
  let html
  try { html = render(path) } finally { console.error = orig }
  return html
    .replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<canvas[\s\S]*?<\/canvas>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/\sstyle="[^"]*"/g, '').replace(/\s(?:tabindex|data-track)="[^"]*"/g, '')
}

// ─────────────────────────── postbuild ───────────────────────────
async function postbuild() {
  const c = await loadContent()
  const { routes, site } = c
  if (!existsSync(join(dist, 'index.html'))) { console.error('dist/index.html not found. Run `vite build` first.'); process.exit(1) }
  const SITE = siteUrl()
  const fill = (h) => h.replaceAll('__SITE_URL__', SITE).replaceAll('__SITE_NAME__', esc(site.name)).replaceAll('__OG_ALT__', esc(site.ogAlt))
  const base = fill(read(join(dist, 'index.html')))

  // Text snapshot from the real app. If it cannot run, the build still ships; crawlers then rely on JavaScript rendering.
  let render = null
  const ssrFile = join(root, 'dist-ssr', 'ssr.js')
  if (existsSync(ssrFile)) render = (await import(pathToFileURL(ssrFile).href)).render
  else console.warn('⚠  dist-ssr/ssr.js not found. Run `vite build --ssr src/ssr.jsx --outDir dist-ssr` (npm run build does). Pages ship without a text snapshot.')

  // Preload the four fonts that paint above the fold, so text does not reflow when they arrive.
  const assets = existsSync(join(dist, 'assets')) ? readdirSync(join(dist, 'assets')) : []
  const preloads = ['chakra-petch-latin-600-normal', 'space-grotesk-latin-600-normal', 'ibm-plex-sans-latin-400-normal', 'ibm-plex-mono-latin-400-normal']
    .map((k) => assets.find((a) => a.startsWith(k) && a.endsWith('.woff2')))
    .filter(Boolean).map((a) => `<link rel="preload" href="/assets/${a}" as="font" type="font/woff2" crossorigin>`)

  // Code for each page is its own chunk. Preload the chunk (and the shared chunks it needs) in the page's own head, so the browser
  // fetches it alongside the entry script instead of discovering it only after the entry has run.
  const mf = existsSync(join(dist, '.vite', 'manifest.json')) ? JSON.parse(read(join(dist, '.vite', 'manifest.json'))) : {}
  const entryKey = Object.keys(mf).find((k) => mf[k].isEntry)
  const closure = (key, acc = new Set()) => { if (!key || acc.has(key) || !mf[key]) return acc; acc.add(key); (mf[key].imports || []).forEach((k) => closure(k, acc)); return acc }
  const inEntry = closure(entryKey)
  const pageFile = { '/': 'src/pages/Home.jsx', '/work': 'src/pages/Work.jsx', '/roqiva': 'src/pages/Roqiva.jsx', '/journey': 'src/pages/Journey.jsx', '/beyond': 'src/pages/Beyond.jsx', '/hire': 'src/pages/Hire.jsx', '/contact': 'src/pages/Contact.jsx', '/privacy': 'src/pages/Legal.jsx' }
  const pageKey = (path) => pageFile[path] || (path.startsWith('/work/') ? 'src/pages/Case.jsx' : undefined)
  const chunkPreloads = (path) => [...closure(pageKey(path))].filter((k) => !inEntry.has(k) && !base.includes(`/${mf[k].file}"`)).map((k) => `<link rel="modulepreload" crossorigin href="/${mf[k].file}">`)

  const mdPages = {}
  const forRoute = async (r) => {
    const url = SITE + (r.path === '/' ? '/' : r.path)
    const { siteLd, pageLd } = structuredData(c, SITE, r)
    const extra = [...preloads, ...chunkPreloads(r.path),
      `<link rel="alternate" hreflang="en" href="${url}">`, `<link rel="alternate" hreflang="x-default" href="${url}">`,
      `<link rel="alternate" type="text/markdown" href="${SITE}/${mdPath(r)}" title="${esc(r.label)} as markdown">`,
      `<script type="application/ld+json" data-ld="site">${ld(siteLd)}</script>`,
      `<script type="application/ld+json" data-ld="page" data-path="${r.path}">${ld(pageLd)}</script>`].join('\n    ')
    let h = base
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
      .replace('<!--head-extra-->', extra)
    const snap = render ? await snapshot(render, r.path) : ''
    h = h.replace('<!--ssr-->', snap ? `<div class="ssr-snap">${snap}</div>` : '')
    if (snap) mdPages[r.path] = htmlToMd(snap, SITE)
    return h
  }

  mkdirSync(join(dist, '.well-known'), { recursive: true })
  const sec = read(join(root, 'scripts', 'security.txt')).replace(/^Canonical:.*\n/gm, '').trimEnd()
  writeFileSync(join(dist, '.well-known', 'security.txt'), `${sec}\nCanonical: ${SITE}/.well-known/security.txt\n`)
  writeFileSync(join(dist, '404.html'), fill(read(join(root, 'scripts', '404.html'))).replace('<!--links-->', routes.filter((r) => !r.hidden).map((r) => `<a href="${r.path}">${esc(r.label)}</a>`).join('')))
  writeFileSync(join(dist, 'site.webmanifest'), JSON.stringify({
    id: '/', name: `${site.name} — ${site.category}`, short_name: site.name, description: routes[0].description, lang: 'en',
    start_url: '/', scope: '/', display: 'standalone', background_color: '#fdfcfc', theme_color: '#fdfcfc',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
  }, null, 2) + '\n')
  for (const r of routes) {
    const html = await forRoute(r)
    if (r.path === '/') writeFileSync(join(dist, 'index.html'), html)
    else { mkdirSync(join(dist, r.path.slice(1)), { recursive: true }); writeFileSync(routeFile(r.path), html) }
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    routes.map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc><lastmod>${r.updated}</lastmod>${r.path === '/' ? `<image:image><image:loc>${SITE}/og-image.jpg</image:loc><image:title>${esc(site.ogAlt)}</image:title></image:image>` : ''}</url>`).join('\n') + `\n</urlset>\n`
  const seoDir = join(root, 'seo')
  mkdirSync(join(seoDir, 'pages'), { recursive: true })
  // Hand-edited SEO sources stay in git. Generated SEO outputs go to dist/ (deployed)
  // and to local gitignored seo/ copies for debugging; no checked-in stale snapshots.
  writeFileSync(join(dist, 'robots.txt'), read(join(seoDir, 'robots.txt')).replaceAll('__SITE_URL__', SITE))
  writeFileSync(join(dist, 'humans.txt'), read(join(seoDir, 'humans.txt')).replaceAll('__SITE_URL__', SITE))
  const key = read(join(seoDir, 'indexnow-key.txt')).trim()
  writeFileSync(join(dist, `${key}.txt`), key + '\n')
  const generated = { 'sitemap.xml': sitemap, 'llms.txt': llmsTxt(c, SITE), 'llms-full.txt': llmsFull(c, SITE, mdPages) }
  for (const [f, body] of Object.entries(generated)) { writeFileSync(join(dist, f), body); writeFileSync(join(seoDir, f), body) }
  for (const r of routes) if (mdPages[r.path]) {
    const body = `# ${r.title}\n\nSource: ${SITE}${r.path === '/' ? '/' : r.path}\nLast updated: ${r.updated}\n\n${mdPages[r.path]}`
    const f = mdPath(r); mkdirSync(dirname(join(dist, f)), { recursive: true }); writeFileSync(join(dist, f), body)
    writeFileSync(join(seoDir, 'pages', f.replace(/\//g, '-')), body)
  }
  console.log(`postbuild: ${routes.length} routes · ${render ? 'text snapshots' : 'NO text snapshots'} · ${SITE}`)
}

// ─────────────────────────── check ───────────────────────────
async function check() {
  const c = await loadContent()
  const { routes } = c
  const fails = [], warns = []
  const need = (ok, m) => { if (!ok) fails.push(m) }
  need(existsSync(dist), 'dist/ is missing. Run `npm run build` first.')
  if (existsSync(dist)) {
    for (const r of routes) {
      const f = routeFile(r.path)
      need(existsSync(f), `missing HTML for ${r.path}`)
      if (!existsSync(f)) continue
      const h = read(f)
      need(h.includes(`<title>${esc(r.title).replace(/&quot;/g, '"')}</title>`) || h.includes(`<title>${esc(r.title)}</title>`), `${r.path}: <title> not set per route`)
      need(!/__SITE_|__OG_ALT__|<!--ssr-->|<!--head-extra-->/.test(h), `${r.path}: placeholder left in HTML`)
      const inline = [...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].filter((m) => m[1].trim() && !/ld\+json/.test(m[0]))
      need(inline.length === 0, `${r.path}: inline <script> found. The CSP would block it.`)
      const canonical = `${siteUrl()}${r.path === '/' ? '/' : r.path}`
      need(h.includes(`<link rel="canonical" href="${canonical}"`), `${r.path}: canonical must use ${canonical}`)
      need(h.includes(`<meta property="og:url" content="${canonical}"`), `${r.path}: og:url must match canonical`)
      need(h.includes(`<meta property="og:image" content="${siteUrl()}/og-image.jpg"`), `${r.path}: social image must use the canonical origin`)
      need(!/<meta name="robots" content="[^"]*noindex/.test(h), `${r.path}: marked noindex`)
      need(/<link rel="alternate" hreflang="en"/.test(h) && /hreflang="x-default"/.test(h), `${r.path}: hreflang links missing`)
      need(new RegExp(`rel="alternate" type="text/markdown" href="[^"]+/${mdPath(r).replace('.', '\\.')}"`).test(h), `${r.path}: markdown alternate link missing`)
      need(existsSync(join(dist, mdPath(r))), `${r.path}: ${mdPath(r)} (markdown copy for AI assistants) missing`)
      need(/max-snippet:-1/.test(h), `${r.path}: robots meta should allow full snippets`)
      for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:title', 'twitter:card']) need(new RegExp(`(?:property|name)="${k}" content="[^"]+"`).test(h), `${r.path}: ${k} missing`)
      const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''
      need(d.length >= 50, `${r.path}: meta description too short (${d.length})`)
      if (d.length > 170) warns.push(`${r.path}: meta description is ${d.length} characters. Search results cut near 155–160.`)
      if (r.title.length > 65) warns.push(`${r.path}: title is ${r.title.length} characters. Search results cut near 60.`)
      const lds = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      need(lds.length >= 2, `${r.path}: JSON-LD missing`)
      for (const m of lds) { try { JSON.parse(m[1]) } catch (e) { fails.push(`${r.path}: JSON-LD is not valid JSON`) } }
      const snap = (h.match(/<div class="ssr-snap">([\s\S]*)<\/div><\/div>\s*<script|<div class="ssr-snap">([\s\S]*?)<\/body>/) || [])[0] || ''
      if (!snap) warns.push(`${r.path}: no text snapshot in the HTML`)
      else {
        need((snap.match(/<h1[\s>]/g) || []).length === 1, `${r.path}: snapshot must contain exactly one <h1>`)
        need(!/<img(?![^>]*\balt=)[^>]*>/.test(snap), `${r.path}: an <img> has no alt attribute`)
      }
    }
    for (const f of ['404.html', 'robots.txt', 'sitemap.xml', 'llms.txt', 'site.webmanifest', '.well-known/security.txt', 'llms-full.txt', 'humans.txt', 'index.md', ...PUBLIC]) need(existsSync(join(dist, f)), `dist/${f} is missing`)
    if (existsSync(join(dist, '.well-known/security.txt'))) {
      const sec = read(join(dist, '.well-known/security.txt'))
      need(sec.includes(`Contact: mailto:${c.site.email}`), 'security.txt: support contact missing')
      need(sec.includes(`Canonical: ${siteUrl()}/.well-known/security.txt`), 'security.txt: wrong canonical')
    }
    // The brand film: markup in the HTML, and its three files.
    if (existsSync(join(dist, 'index.html'))) { const ih = read(join(dist, 'index.html')); need(/src="\/theme-init\.js"/.test(ih), 'index.html: theme script is missing') }
    if (existsSync(join(dist, '404.html'))) {
      const nf = read(join(dist, '404.html'))
      need(!/__SITE_|<!--links-->/.test(nf), '404.html: placeholder left in HTML')
      need(/name="robots" content="noindex/.test(nf), '404.html must be noindex')
    }
    if (existsSync(join(dist, 'index.html'))) for (const m of read(join(dist, 'index.html')).matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) need(existsSync(join(dist, m[1])), `referenced asset missing: ${m[1]}`)
    if (existsSync(join(dist, 'sitemap.xml'))) {
      const sm = read(join(dist, 'sitemap.xml'))
      for (const r of routes) need(sm.includes(`${r.path === '/' ? '/' : r.path}</loc>`), `sitemap.xml missing ${r.path}`)
      need(!/<loc>[^<]*\/\/[^<]*\/\//.test(sm.replace('https://', '')), 'sitemap.xml has a malformed URL')
      need(!/<loc>https:\/\/(?!anjor-portfolio\.vercel\.app(?:\/|<))/.test(sm), 'sitemap.xml includes a noncanonical host')
            need(sm.includes(`<loc>${siteUrl()}/</loc>`), 'sitemap missing the canonical origin')
    }
    if (existsSync(join(dist, 'robots.txt'))) {
      const rb = read(join(dist, 'robots.txt'))
      need(rb.includes(`Sitemap: ${siteUrl()}/sitemap.xml`), 'robots.txt: sitemap must use the canonical origin')
      need(!/^Disallow:\s*\/\s*$/m.test(rb), 'robots.txt blocks the whole site')
      for (const b of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended']) need(new RegExp(`^User-agent: ${b}$`, 'm').test(rb), `robots.txt: ${b} is not named`)
      need(!rb.includes('__SITE_URL__'), 'robots.txt: __SITE_URL__ placeholder left')
    }
    if (existsSync(join(dist, 'llms.txt'))) {
      const lt = read(join(dist, 'llms.txt'))
      need(/^# .+/m.test(lt) && /^> .+/m.test(lt), 'llms.txt: needs an H1 and a blockquote summary')
      for (const r of routes) need(lt.includes(`/${mdPath(r)}`), `llms.txt: missing ${r.path}`)
      need(existsSync(join(dist, 'llms-full.txt')) && read(join(dist, 'llms-full.txt')).length > 2000, 'llms-full.txt is missing or too short')
    }
    if (existsSync(join(root, 'seo', 'indexnow-key.txt'))) {
      const k = read(join(root, 'seo', 'indexnow-key.txt')).trim()
      need(/^[a-f0-9]{16,64}$/.test(k) && existsSync(join(dist, `${k}.txt`)), 'IndexNow key file missing from dist/')
    }
    const js = existsSync(join(dist, 'assets')) ? readdirSync(join(dist, 'assets')).filter((f) => f.endsWith('.js')) : []
    const big = js.map((f) => [f, statSync(join(dist, 'assets', f)).size]).filter(([, n]) => n > 700 * 1024)
    big.forEach(([f, n]) => warns.push(`asset/${f} is ${(n / 1024).toFixed(0)} kB. Split it or trim dependencies.`))
  }
  const src = ['site.js', 'system.js', 'portfolio.js'].map((f) => read(join(root, 'src', 'content', f))).join('\n')
  if (/CONFIRM BEFORE LAUNCH/.test(src)) warns.push('src/content contains launch-signoff notes; review docs/HANDOFF.md.')
  if (/Claude-Session|sk_live|sk-ant-|BEGIN (RSA|PRIVATE)/.test(src)) fails.push('src/content looks like it contains a secret')
  try {
    const cfg = JSON.parse(read(join(root, 'vercel.json')))
    const hs = Object.fromEntries((cfg.headers || []).flatMap((h) => h.headers).map((h) => [h.key.toLowerCase(), h.value]))
    need(/default-src 'self'/.test(hs['content-security-policy'] || ''), 'vercel.json: Content-Security-Policy header missing')
    need(/form-action https:\/\/api\.web3forms\.com/.test(hs['content-security-policy'] || ''), 'vercel.json: only the Web3Forms endpoint may receive form submissions')
    need(!/script-src[^;]*unsafe-(inline|eval)/.test(hs['content-security-policy'] || ''), "vercel.json: script-src must not allow 'unsafe-inline' or 'unsafe-eval'")
    need(/frame-ancestors 'none'/.test(hs['content-security-policy'] || ''), 'vercel.json: CSP frame-ancestors missing')
    for (const k of ['strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy']) need(hs[k], `vercel.json: ${k} header missing`)
    need(Array.isArray(cfg.redirects) && cfg.redirects.length > 0, 'vercel.json: no redirects configured')
  } catch (e) { fails.push('vercel.json is not valid JSON') }
  warns.forEach((w) => console.log('⚠ ', w))
  if (fails.length) { fails.forEach((f) => console.log('✗ ', f)); console.log(`\n${fails.length} problem(s). Fix before deploying.`); process.exit(1) }
  console.log('All checks passed.')
}

// ─────────────────────────── indexnow ───────────────────────────
/** Tell IndexNow-compatible engines (Bing, Yandex, Seznam, Naver and others) that every page changed. Run after a deploy, with the real domain:
 *  SITE_URL=https://anjor-portfolio.vercel.app node scripts/site.mjs indexnow */
async function indexnow() {
  const { routes } = await loadContent()
  const SITE = siteUrl()
  if (SITE !== canonicalSite.url) { console.error('IndexNow requires the canonical origin.'); process.exit(1) }
  const key = read(join(root, 'seo', 'indexnow-key.txt')).trim()
  const body = { host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList: routes.map((r) => SITE + (r.path === '/' ? '/' : r.path)) }
  const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) })
  console.log(`IndexNow responded ${res.status} for ${body.urlList.length} URLs (200/202 = accepted).`)
}

// ─────────────────────────── links ───────────────────────────
async function links() {
  const { routes } = await loadContent()
  const bad = []
  const known = new Set(routes.map((r) => r.path))
  const redirects = (JSON.parse(read(join(root, 'vercel.json'))).redirects || []).map((r) => r.source)
  const ids = {}
  for (const r of routes) ids[r.path] = new Set([...read(routeFile(r.path)).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  let n = 0
  for (const r of routes) {
    const h = read(routeFile(r.path))
    for (const m of h.matchAll(/\shref="([^"]+)"/g)) {
      const href = m[1]
      if (!href.startsWith('/') || href.startsWith('//')) continue
      if (/^\/(assets|\.well-known)\//.test(href) || /\.(ico|svg|png|jpg|webp|md|xml|txt|webmanifest)$/.test(href)) { if (!existsSync(join(dist, href.split('#')[0]))) bad.push(`${r.path} → ${href} (file missing)`); continue }
      const [p0, hash] = href.split('#'), p = p0.split('?')[0], path = p.replace(/\/+$/, '') || '/'
      n++
      if (!p) continue
      if (!known.has(path)) { bad.push(`${r.path} → ${href} (no such page)`); continue }
      if (hash && !ids[path].has(hash)) bad.push(`${r.path} → ${href} (no element with id "${hash}")`)
    }
  }
  for (const s of redirects) if (known.has(s)) bad.push(`redirect source ${s} is also a real page`)
  if (bad.length) { bad.forEach((b) => console.log('✗ ', b)); console.log(`\n${bad.length} broken link(s) of ${n} checked.`); process.exit(1) }
  console.log(`Links OK: ${n} internal links and anchors checked across ${routes.length} pages.`)
}

// ─────────────────────────── serve ───────────────────────────
function serve() {
  const cfg = JSON.parse(read(join(root, 'vercel.json')))
  const port = Number(process.env.PORT || 4180)
  const types = { '.mp4': 'video/mp4', '.md': 'text/markdown; charset=utf-8', '.webp': 'image/webp', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' }
  const rules = (cfg.headers || []).map((h) => ({ re: new RegExp('^' + h.source + '$'), headers: h.headers }))
  const reds = (cfg.redirects || []).map((r) => ({ re: new RegExp('^' + r.source.replace(/:path\*/g, '(.*)') + '$'), to: r.destination, code: r.statusCode || (r.permanent === false ? 307 : 308) }))
  const isFile = (p) => existsSync(p) && statSync(p).isFile()
  http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    const path = decodeURIComponent(url.pathname)
    if (path.length > 1 && path.endsWith('/')) { res.writeHead(308, { Location: path.replace(/\/+$/, '') + url.search }); return res.end() }
    if (/\.html$/.test(path) && path !== '/404.html') { res.writeHead(308, { Location: (path.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '') || '/') + url.search }); return res.end() }
    for (const r of reds) { const m = path.match(r.re); if (m) { res.writeHead(r.code, { Location: r.to.replace(':path*', m[1] || '') }); return res.end() } }
    let file = join(dist, path)
    if (!file.startsWith(dist)) { res.writeHead(403); return res.end() }
    if (!isFile(file)) file = isFile(file + '.html') ? file + '.html' : isFile(join(file, 'index.html')) ? join(file, 'index.html') : null
    let status = 200
    if (!file) { file = join(dist, '404.html'); status = 404 }
    const headers = { 'Content-Type': types[extname(file)] || 'application/octet-stream' }
    for (const r of rules) if (r.re.test(path)) for (const h of r.headers) headers[h.key] = h.value
    const buf = readFileSync(file), range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '')
    if (range && status === 200) {
      const a = range[1] === '' ? 0 : Number(range[1]), b = range[2] === '' ? buf.length - 1 : Math.min(Number(range[2]), buf.length - 1)
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${a}-${b}/${buf.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 })
      return res.end(buf.subarray(a, b + 1))
    }
    res.writeHead(status, { ...headers, 'Accept-Ranges': 'bytes' })
    res.end(buf)
  }).listen(port, () => console.log(`Serving dist/ like Vercel at http://localhost:${port}`))
}

const commands = { preflight, postbuild, check, links, serve, indexnow }
if (!commands[cmd]) { console.error('Usage: node scripts/site.mjs <preflight|postbuild|check|links|serve|indexnow>'); process.exit(1) }
await commands[cmd]()
