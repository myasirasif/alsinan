import { pathToRegexp } from "path-to-regexp";

const paths = ["/tag/dubai-travel/", "/author/yaserr/", "/2026/01/", "/wp-admin/", "/wp-admin/options.php"];
const candidates = [
  "/tag/:slug*",
  "/tag/(.*)",
  "/tag/:slug*/",
  "/author/(.*)",
  "/(\\d{4})/(.*)",
  "/:year(\\d{4})/:month(\\d{2})",
  "/wp-admin/(.*)",
  "/wp-admin/:path*",
];

console.log("pattern".padEnd(34), "matches under strict:true");
for (const c of candidates) {
  const re = pathToRegexp(c, [], { strict: true });
  const hits = paths.filter((p) => re.test(p));
  console.log(c.padEnd(34), hits.length ? hits.join("  ") : "(none)");
}
