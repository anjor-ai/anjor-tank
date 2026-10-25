import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { routes, renderRoute } from '../src/render.js';

const pages = routes();
const seen = new Set();
for (const r of pages) {
  assert(!seen.has(r.path), 'Duplicate path: ' + r.path);
  seen.add(r.path);
  const html = renderRoute(r);
  assert(html.includes('<!doctype html>') && html.includes('</html>'), 'Invalid document at ' + r.path);
  assert(!html.includes('undefined'), 'Undefined interpolation in ' + r.path);
  assert(html.includes('href="/hire"'), 'Expected Hire me entry in global navigation');
  const internalLinks = [...html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)].map(m => m[1]);
  for (const url of internalLinks) {
    if (/\.(?:svg|png|ico|jpg|webp|xml|webmanifest)$/i.test(url)) continue;
    assert(seen.has(url) || pages.some(p => p.path === url), 'Broken internal destination ' + url + ' at ' + r.path);
  }
}
const by = p => renderRoute(pages.find(r => r.path === p));
assert(by('/').includes('data-keyboard-root') && by('/').includes('home-xp') && by('/').includes('home-consult'));
assert((by('/').match(/data-liquid-key/g)||[]).length>=6,'Missing keyboard navigation keys');
assert(existsSync('public/img/keyboard-silver.svg'),'Keyboard asset must exist');
const art=readFileSync('public/img/keyboard-silver.svg','utf8');
assert(art.startsWith('<svg') && art.includes('</svg>') && art.includes('MESHHETU'),'Keyboard asset must have artwork and labels');
assert(by('/experience').includes('xp-timeline__item'));
assert(by('/hire').includes('track-a__cards') && by('/hire').includes('MESHHETU'));
assert(by('/about').includes('xp-timeline__item'));
for (const p of ['/work','/experience','/hire','/about','/contact']) assert(seen.has(p));
console.log('Smoke test passed: ' + pages.length + ' static routes, full-length SVG keyboard, timeline and Track A consulting.');
