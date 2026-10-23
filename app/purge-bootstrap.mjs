// Bootstrap ships 152 KB and this theme uses a small part of it: the grid, a
// few buttons and some utilities. Everything else is render-blocking weight on
// every page. This keeps only the selectors the built pages actually contain,
// plus a safelist for classes that only ever appear because JavaScript adds
// them, which no static scan can see.
import { PurgeCSS } from "purgecss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, "dist");
const target = path.join(dist, "assets", "css", "bootstrap.min.css");

if (!fs.existsSync(target)) {
  console.log("purge: bootstrap.min.css not in the build, skipping");
  process.exit(0);
}

const html = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) html.push(p);
  }
};
walk(dist);

const before = fs.statSync(target).size;

const js = fs
  .readdirSync(path.join(dist, "assets"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.join(dist, "assets", f));

// purgecss treats entries as globs, and a Windows path is not one
const fwd = (p) => p.split(path.sep).join("/");

const [result] = await new PurgeCSS().purge({
  content: [...html, ...js].map(fwd),
  css: [fwd(target)],
  safelist: {
    standard: [
      // toggled by bootstrap's own JavaScript, never present in the markup
      "collapse", "collapsing", "show", "showing", "hide", "fade", "active",
      "disabled", "modal-open", "modal-backdrop", "offcanvas-backdrop",
      "dropdown-menu", "dropdown-item", "dropup", "dropend", "dropstart",
      "carousel-item-next", "carousel-item-prev", "carousel-item-start", "carousel-item-end",
      "was-validated", "is-invalid", "is-valid",
    ],
    greedy: [
      /^owl-/, /^modal/, /^offcanvas/, /^tooltip/, /^popover/, /^toast/,
      /^wpcf7/, /^accordion/, /^nav-/, /^navbar/, /^carousel/,
    ],
    deep: [/^col-/, /^row/, /^container/, /^btn/, /^d-/, /^justify-/, /^align-/],
  },
});

fs.writeFileSync(target, result.css);
const after = fs.statSync(target).size;
console.log(
  `purge: bootstrap.min.css ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
  `(${(100 - (after / before) * 100).toFixed(0)}% removed)`
);
