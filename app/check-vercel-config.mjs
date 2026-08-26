// Vercel validates vercel.json server-side and fails the whole build on an
// unknown property, which costs a deploy cycle to discover. Catch it locally.
import fs from "node:fs";

const ALLOWED = {
  root: new Set([
    "$schema", "buildCommand", "outputDirectory", "framework", "installCommand",
    "devCommand", "ignoreCommand", "trailingSlash", "cleanUrls", "redirects",
    "headers", "rewrites", "functions", "regions", "crons", "images", "public",
    "git", "github", "builds", "routes",
  ]),
  redirect: new Set(["source", "destination", "permanent", "statusCode", "has", "missing"]),
  header: new Set(["source", "headers", "has", "missing"]),
  headerEntry: new Set(["key", "value"]),
  condition: new Set(["type", "key", "value"]),
};

const cfg = JSON.parse(fs.readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const problems = [];

const check = (obj, allowed, where) => {
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) problems.push(`${where}: unknown property "${k}"`);
  }
};

check(cfg, ALLOWED.root, "vercel.json");

(cfg.redirects || []).forEach((r, i) => {
  check(r, ALLOWED.redirect, `redirects[${i}]`);
  [...(r.has || []), ...(r.missing || [])].forEach((c, j) =>
    check(c, ALLOWED.condition, `redirects[${i}].condition[${j}]`)
  );
});

(cfg.headers || []).forEach((h, i) => {
  check(h, ALLOWED.header, `headers[${i}]`);
  (h.headers || []).forEach((e, j) => check(e, ALLOWED.headerEntry, `headers[${i}].headers[${j}]`));
  [...(h.has || []), ...(h.missing || [])].forEach((c, j) =>
    check(c, ALLOWED.condition, `headers[${i}].condition[${j}]`)
  );
});

if (problems.length) {
  console.error("vercel.json would be rejected by Vercel:");
  problems.forEach((p) => console.error("  - " + p));
  console.error("\nJSON has no comments: explain rules in README.md, not in the file.");
  process.exit(1);
}

console.log("vercel.json config OK");
