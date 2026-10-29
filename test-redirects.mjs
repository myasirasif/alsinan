// vercel.json "source" patterns are compiled with path-to-regexp, the same
// library Vercel uses. Two redirects shipped broken because ":slug*" does not
// match a path that ends in a slash, and trailingSlash:true means every real
// request has one. This checks the patterns before they reach production.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToRegexp } from "path-to-regexp";

const dir = path.dirname(fileURLToPath(import.meta.url));
const repoDist = path.join(dir, "app", "dist");
const cfg = JSON.parse(fs.readFileSync(path.join(dir, "app", "vercel.json"), "utf8"));

// every legacy URL that must end up redirected, in the trailing-slash form
// Vercel normalises to, and the bare form as well
const MUST_REDIRECT = [
  "/how-visitors-move-around-dubai-without-stress/",
  "/tag/dubai-travel/", "/tag/dubai-travel",
  "/category/cars/", "/category/buses/", "/category/uncategorized/",
  "/tag/dubai-transport-tips/",
  "/author/yaserr/", "/author/yaserr",
  "/2026/01/", "/2026/01",
  "/2026/02/",
  "/feed/", "/comments/feed/", "/services/feed/", "/our-fleet/feed/",
  "/blogs/page/2/", "/page/2/",
  "/wp-admin/", "/wp-admin/options.php",
  "/wp-login.php",
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
  "/services/for-staff/", "/services/for-staff",
  "/services/for-hotel/", "/services/for-hotel",
  "/services/for-airport/", "/services/for-school/",
  "/services/for-tours/", "/services/for-private/",
  "/services/bus/",
  "/thankyou/", "/thanks/",
];

// real routes that must NOT be swallowed by any redirect
const MUST_NOT_REDIRECT = [
  "/", "/about/", "/services/", "/services/airport-transport-in-dubai/",
  "/our-fleet/", "/blogs/", "/contact-us/", "/privacy-policy/",
  "/terms-and-conditions/",
  "/sitemap.xml", "/robots.txt",
];

// strict:true is what Vercel does. Without it path-to-regexp allows an optional
// trailing delimiter, every pattern appears to match, and the test passes while
// production 404s - which is exactly what happened with "/tag/:slug*".
const compiled = cfg.redirects.map((r) => ({
  src: r.source,
  re: pathToRegexp(r.source, [], { strict: true }),
}));
// trailingSlash:true means Vercel normalises a bare path to its slashed form
// before any redirect rule runs, so a bare path is covered when the slashed
// form matches. Paths that end in a file extension are not normalised.
const normalised = (p) => (p.endsWith("/") || /\.[a-z0-9]+$/i.test(p) ? p : p + "/");
const match = (p) => compiled.find((c) => c.re.test(p) || c.re.test(normalised(p)));

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  -- " + detail : ""}`);
};

for (const p of MUST_REDIRECT) {
  const m = match(p);
  check(`redirects: ${p}`, !!m, m ? `via ${m.src}` : "NO RULE MATCHES");
}

for (const p of MUST_NOT_REDIRECT) {
  const m = match(p);
  check(`left alone: ${p}`, !m, m ? `WRONGLY caught by ${m.src}` : "");
}

// Cache headers. The theme CSS and JS keep stable names in the repo and get a
// content hash at build time, because they were served immutable for a year
// under names that never changed and so no CSS change ever reached a returning
// visitor. Two things have to stay true: every file the build emits matches the
// hashed rule and is cached hard, and anything unhashed falls through to a rule
// that revalidates.
const headerRules = cfg.headers
  .filter((h) => h.source.startsWith("/assets/"))
  .map((h) => ({ src: h.source, value: h.headers[0].value, re: pathToRegexp(h.source, [], { strict: true }) }));
const headerFor = (p) => [...headerRules].reverse().find((r) => r.re.test(p));

const distAssets = (sub) => {
  const dir = path.join(repoDist, "assets", sub);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith("." + sub)).map((f) => `/assets/${sub}/${f}`)
    : [];
};

const built = [...distAssets("css"), ...distAssets("js")];
if (built.length) {
  const unhashed = built.filter((p) => !/\.[0-9a-f]{8}\.(css|js)$/.test(p));
  check("every built theme asset carries a content hash", unhashed.length === 0,
    unhashed.length ? unhashed.join(", ") : `${built.length} files`);

  const notImmutable = built.filter((p) => !(headerFor(p) || {}).value?.includes("immutable"));
  check("hashed assets are cached immutably", notImmutable.length === 0, notImmutable.join(", "));
}

for (const p of ["/assets/css/styles.css", "/assets/js/script.js", "/assets/css/fonts/slick.woff"]) {
  const h = headerFor(p);
  check(`unhashed ${p} revalidates`, !!h && h.value.includes("must-revalidate"),
    h ? h.value : "no rule matches");
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
