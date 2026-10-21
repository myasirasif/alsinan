// Content-hashes the hand-copied theme CSS and JS, then rewrites every
// reference to them in the prerendered HTML.
//
// Why this exists: those files keep stable names across deploys, and they were
// being served with "max-age=31536000, immutable". A browser that stored
// spa-fixes.css once is told never to ask about it again, so weeks of CSS
// changes never reached anyone who had visited before. Relaxing the header
// alone does not fix it, because the browsers already holding the old copy will
// not re-request it to learn about the new header. The URL itself has to change.
//
// Vite already hashes its own bundle. This does the same for everything under
// /assets/css and /assets/js, which Vite only copies through from public/.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, "dist");

const FOLDERS = ["assets/css", "assets/js"];
const EXT = new Set([".css", ".js"]);

const hashOf = (buf) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);

// 1. rename each file to name.<hash>.ext, remembering the mapping
const renames = new Map();
for (const folder of FOLDERS) {
  const abs = path.join(dist, folder);
  if (!fs.existsSync(abs)) continue;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!EXT.has(ext)) continue;

    const from = path.join(abs, entry.name);
    const hash = hashOf(fs.readFileSync(from));
    const base = entry.name.slice(0, -ext.length);
    const hashed = `${base}.${hash}${ext}`;

    fs.renameSync(from, path.join(abs, hashed));
    renames.set(`/${folder}/${entry.name}`, `/${folder}/${hashed}`);
  }
}

// 2. rewrite references. Longest first, so "bootstrap.min.css" is not partially
//    matched by a shorter path that happens to be a prefix.
const urls = [...renames.keys()].sort((a, b) => b.length - a.length);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(urls.map(escape).join("|"), "g");

const htmlFiles = [];
const walk = (d) => {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".html")) htmlFiles.push(p);
  }
};
walk(dist);

let rewritten = 0;
for (const file of htmlFiles) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(pattern, (m) => renames.get(m) || m);
  if (after !== before) {
    fs.writeFileSync(file, after);
    rewritten++;
  }
}

// 3. nothing may still point at an unhashed path, or it would 404
const stale = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(/["'(](\/assets\/(?:css|js)\/[^"')]+)["')]/g)) {
    const ref = m[1];
    if (!fs.existsSync(path.join(dist, ref.replace(/^\//, "")))) stale.push(`${path.relative(dist, file)} -> ${ref}`);
  }
}
if (stale.length) {
  console.error("hash-assets: references with no file behind them:");
  for (const s of stale) console.error("   " + s);
  process.exit(1);
}

console.log(`hashed ${renames.size} files, rewrote ${rewritten} of ${htmlFiles.length} pages`);
