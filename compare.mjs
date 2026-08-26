// Compares the React replica against the live WordPress site, page by page.
import { chromium } from "playwright";
import fs from "fs";

const LIVE = "https://alsinantransport.com";
const LOCAL = "http://localhost:5180";

const paths = fs
  .readFileSync("urls.txt", "utf8")
  .trim()
  .split("\n")
  .map((l) => l.split("|")[0]);

const fingerprint = () => {
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  return {
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content || "",
    canonical: document.querySelector('link[rel="canonical"]')?.href || "",
    jsonld: document.querySelectorAll('script[type="application/ld+json"]').length,
    h1: [...document.querySelectorAll("h1")].map((e) => norm(e.textContent)),
    h2: [...document.querySelectorAll("h2")].map((e) => norm(e.textContent)),
    h3n: document.querySelectorAll("h3").length,
    sections: document.querySelectorAll("section").length,
    imgs: document.images.length,
    broken: [...document.images]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.getAttribute("src")),
    height: document.documentElement.scrollHeight,
    textLen: norm(document.body.innerText).length,
  };
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const results = [];
for (const p of paths) {
  const grab = async (base) => {
    await page.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(600);
    return page.evaluate(fingerprint);
  };
  let live, local;
  try {
    live = await grab(LIVE);
    local = await grab(LOCAL);
  } catch (e) {
    results.push({ p, error: String(e).slice(0, 120) });
    continue;
  }
  const diffs = [];
  if (live.title !== local.title) diffs.push(`title: live="${live.title}" local="${local.title}"`);
  if (live.desc !== local.desc) diffs.push("description differs");
  if (live.canonical !== local.canonical) diffs.push(`canonical ${live.canonical} vs ${local.canonical}`);
  if (live.jsonld !== local.jsonld) diffs.push(`json-ld ${live.jsonld} vs ${local.jsonld}`);
  if (JSON.stringify(live.h1) !== JSON.stringify(local.h1)) diffs.push(`h1 ${JSON.stringify(live.h1)} vs ${JSON.stringify(local.h1)}`);
  if (JSON.stringify(live.h2) !== JSON.stringify(local.h2)) diffs.push(`h2 count ${live.h2.length} vs ${local.h2.length}`);
  if (live.h3n !== local.h3n) diffs.push(`h3 ${live.h3n} vs ${local.h3n}`);
  if (live.sections !== local.sections) diffs.push(`sections ${live.sections} vs ${local.sections}`);
  if (live.imgs !== local.imgs) diffs.push(`imgs ${live.imgs} vs ${local.imgs}`);
  if (local.broken.length) diffs.push(`broken imgs: ${local.broken.slice(0, 3).join(", ")}`);
  const hd = Math.abs(live.height - local.height);
  if (hd > 80) diffs.push(`height ${live.height} vs ${local.height} (${hd}px)`);
  const td = Math.abs(live.textLen - local.textLen);
  if (td > 60) diffs.push(`text length ${live.textLen} vs ${local.textLen}`);
  results.push({ p, diffs });
}

await browser.close();

let bad = 0;
for (const r of results) {
  if (r.error) { console.log(`ERR  ${r.p}  ${r.error}`); bad++; continue; }
  if (r.diffs.length) { console.log(`DIFF ${r.p}`); r.diffs.forEach((d) => console.log(`       - ${d}`)); bad++; }
  else console.log(`OK   ${r.p}`);
}
console.log(`\n${results.length - bad}/${results.length} pages match`);
