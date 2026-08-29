// Compares two layout snapshots. Any image whose rendered size moved is a
// regression, not an improvement.
import fs from "node:fs";

const [beforeFile, afterFile] = process.argv.slice(2);
const before = JSON.parse(fs.readFileSync(beforeFile, "utf8"));
const after = JSON.parse(fs.readFileSync(afterFile, "utf8"));

const TOLERANCE = 2; // sub-pixel rounding
let moved = 0, checked = 0;
const report = [];

for (const key of Object.keys(before)) {
  const b = before[key], a = after[key];
  if (!a) { report.push(`MISSING in after: ${key}`); continue; }

  const dh = Math.abs(b.docHeight - a.docHeight);
  if (dh > 8) report.push(`${key}: page height ${b.docHeight} -> ${a.docHeight} (${dh}px)`);
  if (b.overflows !== a.overflows)
    report.push(`${key}: overflow ${b.overflows} -> ${a.overflows}`);
  if (b.docWidth !== a.docWidth)
    report.push(`${key}: doc width ${b.docWidth} -> ${a.docWidth}`);

  b.images.forEach((bi, i) => {
    const ai = a.images[i];
    checked++;
    if (!ai) { report.push(`${key}: image ${bi.src} disappeared`); moved++; return; }
    if (Math.abs(bi.w - ai.w) > TOLERANCE || Math.abs(bi.h - ai.h) > TOLERANCE) {
      moved++;
      report.push(`${key}: ${bi.src} ${bi.w}x${bi.h} -> ${ai.w}x${ai.h}`);
    }
  });
}

console.log(`compared ${checked} image measurements across ${Object.keys(before).length} page/viewport pairs`);
console.log(`${moved} images changed size`);
if (report.length) {
  console.log("\nDifferences:");
  report.slice(0, 30).forEach((r) => console.log("  " + r));
  if (report.length > 30) console.log(`  ... and ${report.length - 30} more`);
} else {
  console.log("\nNothing moved.");
}
process.exit(moved ? 1 : 0);
