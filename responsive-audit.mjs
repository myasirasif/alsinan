// Walks every route at every breakpoint and reports anything a person would
// call wrong: sideways scroll, text too small to read, lines too long or too
// short, elements overlapping, images spilling their box, tap targets too small,
// and spacing that is either cramped or cavernous.
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = "http://localhost:5180";
const ROUTES = fs
  .readFileSync("urls.txt", "utf8")
  .trim()
  .split("\n")
  .map((l) => l.split("|")[0]);

const SCREENS = [
  { name: "mobile-s", width: 320, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-l", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "tablet-l", width: 1024, height: 1366 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

const audit = () => {
  const out = [];
  const add = (kind, detail) => out.push({ kind, detail });
  const vw = window.innerWidth;
  const label = (e) =>
    e.tagName.toLowerCase() +
    (e.className && typeof e.className === "string" && e.className.trim()
      ? "." + e.className.trim().split(/\s+/)[0]
      : "");

  // ---- sideways scroll, and what causes it ----
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprits = [...document.querySelectorAll("body *")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        if (r.height < 2 || r.right <= vw + 2) return false;
        const p = e.parentElement;
        return !p || p.getBoundingClientRect().right <= vw + 2;
      })
      .slice(0, 3)
      .map((e) => `${label(e)} right=${Math.round(e.getBoundingClientRect().right)}`);
    add("overflow", `page ${document.documentElement.scrollWidth}px wide vs ${vw}px — ${culprits.join("; ") || "clipped ancestor"}`);
  }

  // ---- body text that is too small to read comfortably ----
  const small = new Map();
  document.querySelectorAll("p, li, dd, td, figcaption").forEach((e) => {
    if (!e.textContent.trim() || e.children.length) return;
    const r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    const fs = parseFloat(getComputedStyle(e).fontSize);
    if (fs < 13) small.set(label(e), Math.round(fs * 10) / 10);
  });
  small.forEach((size, where) => add("tiny-text", `${where} at ${size}px`));

  // ---- line length: long lines tire the eye, very short ones stutter ----
  const measures = [];
  document.querySelectorAll("p").forEach((e) => {
    const t = e.textContent.trim();
    if (t.length < 90 || e.children.length > 2 || measures.length > 40) return;
    // getClientRects() returns one rect per inline box, so a paragraph wrapped in
    // a <span> reports exactly double its real line count. Measure the rendered
    // width against the font size instead - that cannot be fooled by markup.
    const cs = getComputedStyle(e);
    const box = e.getBoundingClientRect();
    if (box.width < 40) return;
    const lines = Math.round(box.height / parseFloat(cs.lineHeight));
    if (lines < 2) return;
    const cpl = Math.round(box.width / (parseFloat(cs.fontSize) * 0.5));
    measures.push({ where: label(e.parentElement), cpl });
  });
  const tooLong = measures.filter((m) => m.cpl > 95);
  // a narrow phone column naturally gives short lines; only flag a measure that
  // is broken rather than merely narrow
  const tooShort = measures.filter((m) => m.cpl < (vw < 500 ? 18 : 28));
  if (tooLong.length) add("long-lines", `${tooLong.length} paragraphs over 95 chars/line (worst ${Math.max(...tooLong.map((m) => m.cpl))} in ${tooLong[0].where})`);
  if (tooShort.length) add("short-lines", `${tooShort.length} paragraphs under 28 chars/line (worst ${Math.min(...tooShort.map((m) => m.cpl))} in ${tooShort[0].where})`);

  // ---- images spilling past their container ----
  [...document.images].forEach((i) => {
    const r = i.getBoundingClientRect();
    const p = i.parentElement;
    if (!p || r.width < 4) return;
    const pr = p.getBoundingClientRect();
    if (r.width > pr.width + 4 && getComputedStyle(p).overflow === "visible")
      add("image-spill", `${label(i)} ${Math.round(r.width)}px in a ${Math.round(pr.width)}px ${label(p)}`);
  });

  // ---- text colliding with text ----
  const blocks = [...document.querySelectorAll("h1, h2, h3, h4, p, li")].slice(0, 160).filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 20 && r.height > 8 && e.textContent.trim() && getComputedStyle(e).position === "static";
  });
  // only neighbours in document order realistically collide, and comparing every
  // pair blew up on the 7,500-word archive page
  let collisions = 0;
  for (let i = 0; i < blocks.length && collisions < 3; i++) {
    for (let j = i + 1; j < Math.min(i + 10, blocks.length); j++) {
      const a = blocks[i], b = blocks[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox > 12 && oy > 8) {
        add("overlap", `${label(a)} over ${label(b)} (${Math.round(ox)}x${Math.round(oy)}px)`);
        collisions++;
        break;
      }
    }
  }

  // ---- tap targets, counting any hit area a pseudo-element adds ----
  const tiny = [...document.querySelectorAll("a, button, input[type=submit]")].filter((e) => {
    if (e.classList.contains("skip-link")) return false;
    const r = e.getBoundingClientRect();
    if (r.width < 1) return false;
    // Links inside a sentence are exempt under WCAG 2.2. The enclosing block can
    // be a couple of levels up - <p><strong><a> is the common one here - so walk
    // past inline wrappers instead of only checking the immediate parent.
    let p = e.parentElement;
    while (p && ["STRONG", "EM", "B", "I", "SPAN", "U", "SMALL"].includes(p.tagName))
      p = p.parentElement;
    if (p && ["P", "LI", "TD"].includes(p.tagName) && p.textContent.trim().length > e.textContent.trim().length + 10)
      return false;
    const after = getComputedStyle(e, "::after");
    const w = after.content !== "none" ? Math.max(r.width, parseFloat(after.width) || 0) : r.width;
    const h = after.content !== "none" ? Math.max(r.height, parseFloat(after.height) || 0) : r.height;
    return w < 24 || h < 24;
  });
  if (tiny.length) add("tap-target", `${tiny.length} under 24px, e.g. ${label(tiny[0])} "${tiny[0].textContent.trim().slice(0, 20)}"`);

  // ---- spacing between sections: cramped or cavernous ----
  // Measuring headroom *inside* one section is the wrong question: a section
  // that opens with zero padding looks fine when the section above it closes
  // with 100px, and that is how half this theme is built. What the eye actually
  // judges is the gap between the last painted thing in one band and the first
  // painted thing in the next, so measure that instead. This replaces a metric
  // that produced ~500 findings, nearly all of them sections that were never
  // wrong on screen.
  // "Painted" has to mean ink on the screen, not any box in the layout. Counting
    // every element made a .container wrapper - transparent, no text of its own -
  // the topmost thing in a section, which reported 0px gaps where the screenshot
  // plainly showed 90px. Text, media, and anything with a visible background or
  // border count; bare wrappers do not.
  const INK = /^(IMG|SVG|VIDEO|IFRAME|CANVAS|INPUT|TEXTAREA|SELECT|BUTTON|HR)$/;
  const inks = (e) => {
    // The floating call and WhatsApp buttons are position:fixed and follow the
    // viewport, so they turned up as the "first ink" in whatever band happened
    // to be on screen and made every footer gap read as a large negative.
    const pos = getComputedStyle(e).position;
    if (pos === "fixed" || pos === "absolute") return false;
    if (INK.test(e.tagName)) return true;
    const ownText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (ownText) return true;
    const cs = getComputedStyle(e);
    if (cs.backgroundImage !== "none") return true;
    const bg = cs.backgroundColor;
    if (bg && bg !== "transparent" && !/rgba\(0, 0, 0, 0\)/.test(bg)) return true;
    return parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderBottomWidth) > 0;
  };

  const painted = (el, which) => {
    let v = which === "top" ? Infinity : -Infinity;
    let node = null;
    el.querySelectorAll("*").forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) return;
      if (!inks(e)) return;
      if (which === "top" ? r.top < v : r.bottom > v) {
        v = which === "top" ? r.top : r.bottom;
        node = e;
      }
    });
    return { edge: v, node };
  };

  // Only bands that are literally adjacent siblings can have a gap between them.
  // Comparing merely-consecutive matches reported nonsense - 10,071px "between"
  // a banner and a section with a whole article sitting in between. Sidebar
  // widgets are stacked cards, not page bands, so they are out too.
  const bands = [...document.querySelectorAll("#page section, #page footer")]
    .filter((s) => s.getBoundingClientRect().height > 100)
    .filter((s) => !s.closest("aside, .sidebar, .widget-area"))
    .filter((s, i, a) => !a.some((o) => o !== s && o.contains(s)));  // outermost only

  for (let i = 0; i < bands.length - 1; i++) {
    const a = bands[i], b = bands[i + 1];
    if (a.nextElementSibling !== b) continue;
    const last = painted(a, "bottom"), first = painted(b, "top");
    if (!isFinite(last.edge) || !isFinite(first.edge)) continue;
    const gap = Math.round(first.edge - last.edge);
    if (gap < 0) continue;  // bands that overlap by design (cards straddling a seam)
    const pair = `${label(a)} -> ${label(b)}`;
    if (gap < 28) add("cramped", `only ${gap}px between ${pair}`);
    else if (gap > 260) add("cavernous", `${gap}px of empty space between ${pair}`);
  }

  return out;
};

const browser = await chromium.launch();
const findings = [];
let checks = 0;

for (const screen of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: screen.width, height: screen.height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 70)));

  for (const route of ROUTES) {
    errors.length = 0;
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(280);
    const found = await page.evaluate(audit);
    checks++;
    found.forEach((f) => findings.push({ screen: screen.name, width: screen.width, route, ...f }));
    errors.forEach((e) => findings.push({ screen: screen.name, width: screen.width, route, kind: "js-error", detail: e }));
  }
  await ctx.close();
  process.stdout.write(`${screen.name} `);
}
await browser.close();

console.log(`\n\n${checks} page/screen combinations checked, ${findings.length} findings\n`);

const byKind = {};
findings.forEach((f) => (byKind[f.kind] = byKind[f.kind] || []).push(f));

const ORDER = ["js-error", "overflow", "overlap", "image-spill", "tiny-text", "tap-target", "long-lines", "short-lines", "cramped", "cavernous"];
for (const kind of ORDER) {
  const rows = byKind[kind];
  if (!rows) continue;
  console.log(`${kind.toUpperCase()}  (${rows.length})`);
  const seen = new Set();
  for (const r of rows) {
    const key = r.detail.replace(/\d+/g, "#") + r.screen;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`   ${r.screen.padEnd(9)} ${r.route.slice(0, 40).padEnd(42)} ${r.detail}`);
    if (seen.size > 14) { console.log(`   ... ${rows.length - 14} more`); break; }
  }
  console.log();
}
if (!findings.length) console.log("Nothing to report.");

// The grouped listing above collapses findings whose text differs only in its
// numbers, which hides how many routes a spacing problem actually spans. Print
// the spacing findings in full when there are any.
const spacing = findings.filter((f) => f.kind === "cramped" || f.kind === "cavernous");
if (spacing.length) {
  console.log("--- every spacing finding ---");
  spacing.forEach((f) =>
    console.log(`   ${f.kind.padEnd(10)} ${f.screen.padEnd(9)} ${f.route.slice(0, 42).padEnd(44)} ${f.detail}`));
}
