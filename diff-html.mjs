// Byte-compares the prerendered HTML against a saved snapshot. A refactor that
// only moves wrappers into components must not change a single byte of output.
//   node diff-html.mjs html-before
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const beforeDir = path.join(ROOT, process.argv[2] || "html-before");
const afterDir = path.join(ROOT, "app", "dist");

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
      })
    : [];

const files = walk(beforeDir);
let same = 0;
const differ = [];

for (const b of files) {
  const rel = path.relative(beforeDir, b);
  const a = path.join(afterDir, rel);
  if (!fs.existsSync(a)) {
    differ.push([rel, "missing after build"]);
    continue;
  }
  // the bundle filename carries a content hash that changes on every build
  const strip = (s) => s.replace(/\/assets\/index-[A-Za-z0-9_-]+\.js/g, "/assets/index-HASH.js");
  const bs = strip(fs.readFileSync(b, "utf8"));
  const as = strip(fs.readFileSync(a, "utf8"));
  if (bs === as) {
    same++;
    continue;
  }
  // find the first differing offset so the cause is visible
  let i = 0;
  while (i < bs.length && i < as.length && bs[i] === as[i]) i++;
  differ.push([
    rel,
    `${bs.length} -> ${as.length} bytes, first difference at ${i}\n` +
      `        before: ${JSON.stringify(bs.slice(i - 60, i + 90))}\n` +
      `        after : ${JSON.stringify(as.slice(i - 60, i + 90))}`,
  ]);
}

console.log(`${same} of ${files.length} pages byte-identical`);
for (const [rel, note] of differ) console.log(`  DIFFERS ${rel}: ${note}`);
process.exit(differ.length ? 1 : 0);
