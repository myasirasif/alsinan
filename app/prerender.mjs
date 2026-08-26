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

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const routes = Object.keys(bodyClasses);

let written = 0;
for (const route of routes) {
  const { html, helmet } = render(route);

  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");

  const page = template
    // helmet emits the real <title>; drop the build-time placeholder
    .replace(/<title>.*?<\/title>\s*/s, "")
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", html)
    .replace("<body>", `<body class="${bodyClasses[route] || ""}">`);

  const outDir = route === "/" ? dist : path.join(dist, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), page);
  written++;
}

// SPA fallback for anything that is not a known route
const { html, helmet } = render("/__not_found__");
const notFound = template
  .replace(/<title>.*?<\/title>\s*/s, "")
  .replace("<!--app-head-->", [helmet.title.toString(), helmet.meta.toString()].join("\n    "))
  .replace("<!--app-html-->", html);
fs.writeFileSync(path.join(dist, "404.html"), notFound);

console.log(`prerendered ${written} routes + 404.html`);
