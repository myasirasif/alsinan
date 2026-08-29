// Records the rendered size of every image, plus page height and overflow, so a
// change can be proved not to have moved anything. Run before and after.
//   node snapshot-layout.mjs before.json
import fs from "node:fs";
import { chromium } from "playwright";

const out = process.argv[2] || "layout-snapshot.json";
const BASE = "http://localhost:5180";
const PAGES = [
  "/", "/about/", "/services/", "/our-fleet/", "/contact-us/", "/blogs/",
  "/services/airport-transport-in-dubai/",
  "/how-visitors-move-around-dubai-without-stress/",
];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const snapshot = {};

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    snapshot[`${vp.name} ${path}`] = await page.evaluate(() => {
      const imgs = [...document.images].map((i) => {
        const r = i.getBoundingClientRect();
        return {
          src: (i.getAttribute("src") || "").split("/").pop(),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
      return {
        docHeight: document.documentElement.scrollHeight,
        docWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        overflows: document.documentElement.scrollWidth > window.innerWidth + 1,
        images: imgs,
      };
    });
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(out, JSON.stringify(snapshot, null, 1));
const pages = Object.keys(snapshot).length;
const imgs = Object.values(snapshot).reduce((a, p) => a + p.images.length, 0);
console.log(`captured ${pages} page/viewport combinations, ${imgs} image measurements -> ${out}`);
