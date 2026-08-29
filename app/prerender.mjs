// Renders every route to static HTML so crawlers get the full page and its
// SEO tags without executing JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, "dist");

// Windows absolute paths need a file:// URL for dynamic import
const load = (...p) => import(pathToFileURL(path.join(dir, ...p)).href);

const { render } = await load("dist-ssr", "entry-server.js");
const { bodyClasses } = await load("src", "data", "bodyClasses.js");
const { jsonld } = await load("src", "data", "jsonld.js");

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const routes = Object.keys(bodyClasses);

let written = 0;
for (const route of routes) {
  const { html, helmet } = render(route);

  // React 19 emits <link rel="preload"> for images it renders. Rendering only
  // the app subtree leaves them inside #root, where the client never puts them,
  // so hydration failed and React threw the whole prerendered tree away and
  // re-rendered it. Lifting them into <head> fixes that and is where a preload
  // belongs anyway.
  const preloads = [];
  const body = html.replace(/<link\b[^>]*\brel="preload"[^>]*>/g, (tag) => {
    preloads.push(tag);
    return "";
  });

  // Structured data is written straight into the HTML rather than rendered by
  // React, so every crawler still sees it while the ~155 KB of JSON-LD stays
  // out of the client bundle.
  const structured = (jsonld[route] || [])
    .map((block) => `<script type="application/ld+json">${block}</script>`)
    .join("\n    ");

  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    preloads.join("\n    "),
    structured,
  ]
    .filter(Boolean)
    .join("\n    ");

  const page = template
    // helmet emits the real <title>; drop the build-time placeholder
    .replace(/<title>.*?<\/title>\s*/s, "")
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", body)
    .replace("<body>", `<body class="${bodyClasses[route] || ""}">`);

  const outDir = route === "/" ? dist : path.join(dist, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), page);
  written++;
}

// SPA fallback for anything that is not a known route
const { html: nfHtml, helmet: nfHelmet } = render("/__not_found__");
const nfPreloads = [];
const nfBody = nfHtml.replace(/<link\b[^>]*\brel="preload"[^>]*>/g, (tag) => {
  nfPreloads.push(tag);
  return "";
});
const notFound = template
  .replace(/<title>.*?<\/title>\s*/s, "")
  .replace(
    "<!--app-head-->",
    [nfHelmet.title.toString(), nfHelmet.meta.toString(), nfPreloads.join("\n    ")]
      .filter(Boolean)
      .join("\n    ")
  )
  .replace("<!--app-html-->", nfBody);
fs.writeFileSync(path.join(dist, "404.html"), notFound);

console.log(`prerendered ${written} routes + 404.html`);
