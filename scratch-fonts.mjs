import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:5180/our-fleet/", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const box = document.querySelector(".service_area_box");
  const cs = (e) => { const s = getComputedStyle(e); return {
    font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color }; };
  return {
    h3: cs(box.querySelector("h3")),
    p: cs(box.querySelector("p")),
    btn: cs(box.querySelector("a")),
    boxBg: getComputedStyle(box).backgroundColor,
    boxRadius: getComputedStyle(box).borderRadius,
    boxPad: getComputedStyle(box).padding,
    sectionBg: getComputedStyle(box.closest("section")).backgroundColor,
  };
}));
await b.close();
