import { defineConfig } from "vite";
import path from "node:path";
import { routes, renderRoute } from "./src/render.js";

/* Every page is generated from src/content.js + src/render.js. There are no per-page HTML files:
   this plugin hands Vite each page as a virtual .html entry, so the build bundles, hashes and rewrites
   them like normal pages, and the dev server serves them at their real URLs. */
function pages() {
  const root = process.cwd();
  const table = new Map(routes().map((r) => [path.join(root, r.file), r]));
  const byUrl = new Map(routes().map((r) => [r.path, r]));
  return {
    name: "site-pages",
    enforce: "pre",
    resolveId(id) {
      if (table.has(id)) return id;
    },
    load(id) {
      const r = table.get(id);
      if (r) return renderRoute(r);
    },
    configurePreviewServer(server) {
      // local preview only: Vercel's cleanUrls does this in production
      server.middlewares.use((req, res, next) => {
        const [u, q] = (req.url || "/").split("?");
        if (u !== "/" && !/\.[a-z0-9]+$/i.test(u))
          req.url = u.replace(/\/$/, "") + "/index.html" + (q ? "?" + q : "");
        next();
      });
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || "/").split("?")[0].replace(/\/$/, "") || "/";
        const r = byUrl.get(url);
        if (!r || req.method !== "GET") return next();
        const html = await server.transformIndexHtml(req.url, renderRoute(r));
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },
  };
}

export default defineConfig({
  base: "/",
  server: { allowedHosts: ["terminal.local"] },
  publicDir: "public",
  appType: "mpa",
  plugins: [pages()],
  build: {
    target: "es2020",
    sourcemap: false,
    outDir: "dist",
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: Object.fromEntries(
        routes().map((r) => [
          r.file.replace(/\.html$/, ""),
          path.join(process.cwd(), r.file),
        ]),
      ),
    },
  },
});
