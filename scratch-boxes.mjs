import fs from "node:fs";
import { chromium } from "playwright";

const ROUTES = fs.readFileSync("urls.txt", "utf8").trim().split("\n").map((l) => l.split("|")[0]);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

for (const r of ROUTES) {
  await p.goto("http://localhost:5180" + r, { waitUntil: "networkidle" });
  const found = await p.evaluate(() => {
    // the red card grid: service_area_box inside a section that is not the
    // "Areas We Cover" block we added
    const secs = [...document.querySelectorAll("section")].filter(
      (s) => s.querySelector(".service_area_box") && !s.classList.contains("svc_areas"));
    return secs.map((s) => {
      const boxes = [...s.querySelectorAll(".service_area_box")];
      return {
        cls: s.className,
        heading: (s.querySelector("h2")?.innerText || "(no h2)").trim(),
        count: boxes.length,
        boxes: boxes.map((x) => {
          const h = x.querySelector("h3")?.innerText.trim() || "";
          const li = x.querySelectorAll("li").length;
          const words = x.innerText.trim().split(/\s+/).length;
          const rect = x.getBoundingClientRect();
          const inner = [...x.children].reduce((m, c) => Math.max(m, c.getBoundingClientRect().bottom), 0);
          return { h, words, li, h_px: Math.round(rect.height), slack: Math.round(rect.bottom - inner) };
        }),
      };
    });
  });
  found.forEach((f) => {
    console.log(`\n${r}`);
    console.log(`   section: ${f.cls}`);
    console.log(`   heading: ${f.heading}   |  ${f.count} boxes`);
    f.boxes.forEach((x) =>
      console.log(`      ${String(x.words).padStart(3)}w ${String(x.li).padStart(2)}li  h=${String(x.h_px).padStart(3)}px  dead space below content: ${String(x.slack).padStart(3)}px   ${x.h}`));
  });
}
await b.close();
