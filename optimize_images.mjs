// Converts the heavy PNG/JPEG assets to WebP and records the swap map the
// generator uses to rewrite markup. Originals stay on disk so og:image and
// JSON-LD references keep resolving.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// fileURLToPath handles both /C:/... on Windows and /var/... on POSIX
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(ROOT, "app", "public", "wp-content", "uploads");
const THRESHOLD = 150 * 1024;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const candidates = walk(UPLOADS).filter((f) => {
  if (!/\.(png|jpe?g)$/i.test(f)) return false;
  return fs.statSync(f).size >= THRESHOLD;
});

const map = {};
let saved = 0;

for (const file of candidates) {
  const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const before = fs.statSync(file).size;

  if (!fs.existsSync(webp)) {
    await sharp(file).webp({ quality: 82, effort: 5 }).toFile(webp);
  }
  const after = fs.statSync(webp).size;

  // only adopt the WebP when it is actually smaller
  if (after < before * 0.95) {
    const rel = (p) => "/" + path.relative(path.join(ROOT, "app", "public"), p).replace(/\\/g, "/");
    map[rel(file)] = rel(webp);
    saved += before - after;
    console.log(
      `${path.basename(file).padEnd(52)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(after / 1024).toFixed(0).padStart(6)} KB`
    );
  } else {
    fs.unlinkSync(webp);
  }
}

fs.writeFileSync(path.join(ROOT, "image_swaps.json"), JSON.stringify(map, null, 2) + "\n");
console.log(`\n${Object.keys(map).length} images converted, ${(saved / 1024 / 1024).toFixed(2)} MB saved`);
