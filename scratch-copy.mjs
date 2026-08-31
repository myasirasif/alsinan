import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
for (const r of ["/services/airport-transport-in-dubai/", "/services/dubai-tours-transport-services/"]) {
  await p.goto("http://localhost:5180" + r, { waitUntil: "networkidle" });
  console.log("\n===== " + r + " =====");
  console.log(JSON.stringify(await p.evaluate(() =>
    [...document.querySelectorAll("section.thre-epoints-section .service_area_box")].map((x) => ({
      h: x.querySelector("h3")?.innerText.trim(),
      p: [...x.querySelectorAll("p")].map((e) => e.innerText.trim()),
      li: [...x.querySelectorAll("li")].map((e) => e.innerText.trim()),
      btn: x.querySelector("a")?.innerText.trim(),
    }))), null, 1));
}
await b.close();
