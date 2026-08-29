// Reads the real pixel dimensions of every uploaded image so the generator can
// write width/height attributes. Without them the browser cannot reserve space
// and the page shifts as images arrive - the site's CLS problem.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, "app", "public");
const UPLOADS = path.join(PUBLIC, "wp-content", "uploads");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

// SVGs are included too: the icons still occupy space, and an intrinsic ratio
// keeps them from collapsing before they load.
const files = walk(UPLOADS).filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f));
const sizes = {};
let failed = 0;

for (const file of files) {
  try {
    const { width, height } = await sharp(file).metadata();
    if (!width || !height) continue;
    const url = "/" + path.relative(PUBLIC, file).replace(/\\/g, "/");
    sizes[url] = [width, height];
  } catch {
    failed++;
  }
}


fs.writeFileSync(path.join(ROOT, "image_sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`measured ${Object.keys(sizes).length} images (${failed} unreadable)`);
