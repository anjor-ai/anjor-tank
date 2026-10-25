import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { routes, renderRoute } from "../src/render.js";
import { CASES } from "../src/content.js";
import { LABS } from "../src/lab-data.js";
const pages = routes(),
  paths = new Set(pages.map((p) => p.path));
assert.equal(paths.size, pages.length);
for (const r of pages) {
  const html = renderRoute(r);
  assert(html.startsWith("<!doctype html>") && html.endsWith("</html>"));
  assert(!html.includes("undefined"), "Undefined at " + r.path);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "One h1: " + r.path);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  assert.equal(new Set(ids).size, ids.length, "Duplicate id " + r.path);
  for (const [, url] of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g))
    assert(
      paths.has(url) || existsSync("public" + url),
      "Broken destination " + url,
    );
  for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/g))
    assert(existsSync("public" + src), "Missing image " + src);
  for (const [, hash] of html.matchAll(/href="#([^"]+)"/g))
    assert(ids.includes(hash), "Missing section " + hash);
}
for (const c of CASES) {
  const l = LABS[c.slug];
  assert(l && l.choices.length === l.results.length && l.results.length === 3);
  assert(l.results.every((r) => r.length === 3));
  assert(
    renderRoute(pages.find((p) => p.path === "/work/" + c.slug)).includes(
      "data-lab",
    ),
  );
}
const html = (p) => renderRoute(pages.find((r) => r.path === p));
assert.equal((html("/").match(/data-key="/g) || []).length, 6);
assert(!html("/experience").includes("Founder and Product Architect"));
assert(html("/hire").includes("TRACK B"));
assert(html("/founder").includes("IN DEVELOPMENT"));
assert(html("/about").includes("data-photo-filter"));
console.log(
  `Verified ${pages.length} routes, destinations, image assets, section anchors, founder separation and ${CASES.length} interactive workspaces.`,
);
