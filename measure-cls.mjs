import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
// throttle so layout shifts actually have time to happen, like a real phone
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8,
  uploadThroughput: 750 * 1024 / 8, latency: 150,
});
for (const path of ["/", "/about/", "/our-fleet/"]) {
  await page.goto("http://localhost:5180" + path, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(3500);
  const cls = await page.evaluate(() => new Promise(res => {
    let v = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    setTimeout(() => res(Number(v.toFixed(4))), 400);
  }));
  const imgs = await page.evaluate(() => {
    const a = [...document.images];
    return a.filter(i => i.getAttribute("width") && i.getAttribute("height")).length + "/" + a.length;
  });
  console.log(`  ${path.padEnd(14)} CLS ${String(cls).padEnd(8)} images with dimensions: ${imgs}`);
}
await browser.close();
