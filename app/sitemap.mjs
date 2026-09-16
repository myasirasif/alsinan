// Writes sitemap.xml and its three child sitemaps into dist/ at build time.
//
// The sitemaps used to be static files copied from the WordPress site, so a
// new blog post never appeared in them. They are now built from the same data
// the pages are: the route list and page type come from bodyClasses.js, the
// dates from the dateModified that jsonld.js already carries, and anything
// marked noindex in seo.js is left out.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, "dist");
const SITE = "https://alsinantransport.com";

const load = (...p) => import(pathToFileURL(path.join(dir, ...p)).href);
const { bodyClasses } = await load("src", "data", "bodyClasses.js");
const { jsonld } = await load("src", "data", "jsonld.js");
const { seo } = await load("src", "data", "seo.js");

// Pages whose structured data has no dateModified. Bump the date here when
// one of these pages changes, or the sitemap keeps telling Google it has not.
const LASTMOD = {
  "/services/": "2025-10-22T03:00:34+00:00",
  "/our-fleet/": "2025-10-23T06:42:40+00:00",
  "/blogs/": "2026-01-08T01:48:07+00:00",
  "/privacy-policy/": "2026-01-30T03:10:09+00:00",
  "/terms-and-conditions/": "2026-01-30T03:09:36+00:00",
};

// WordPress body classes say what kind of page a route is, and every route
// needs one for its styling, so a new post cannot be added without it.
const SITEMAPS = [
  { file: "post-sitemap.xml", bodyClass: "single-post" },
  { file: "page-sitemap.xml", bodyClass: "page" },
  { file: "services-sitemap.xml", bodyClass: "single-services" },
];

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

function schemaDate(route) {
  for (const block of jsonld[route] || []) {
    const data = JSON.parse(block);
    for (const node of data["@graph"] || [data]) {
      if (node.dateModified) return node.dateModified;
    }
  }
  return null;
}

// No seed value: Date.parse(undefined) is NaN, NaN never compares greater, and
// a seeded reduce would hand back the seed every time.
const latest = (dates) => {
  const known = dates.filter(Boolean);
  return known.length ? known.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a)) : null;
};

const entries = { "post-sitemap.xml": [], "page-sitemap.xml": [], "services-sitemap.xml": [] };
const skipped = [];

for (const route of Object.keys(bodyClasses)) {
  const robots = (seo[route]?.meta || []).find((m) => m.name === "robots")?.content || "";
  if (/\bnoindex\b/.test(robots)) {
    skipped.push(route);
    continue;
  }

  const classes = bodyClasses[route].split(/\s+/);
  const target = SITEMAPS.find((s) => classes.includes(s.bodyClass));
  if (!target) {
    throw new Error(`sitemap: ${route} has none of the body classes ${SITEMAPS.map((s) => s.bodyClass).join(", ")}`);
  }

  const lastmod = schemaDate(route) || LASTMOD[route] || null;
  if (lastmod && !ISO.test(lastmod)) {
    throw new Error(`sitemap: ${route} has a malformed date "${lastmod}"`);
  }
  if (!lastmod) {
    console.warn(`sitemap: ${route} has no dateModified in jsonld.js and no LASTMOD entry, so it goes out without <lastmod>`);
  }
  entries[target.file].push({ route, lastmod });
}

// The blog index lists every post, so it changes whenever a post does.
const blogs = entries["page-sitemap.xml"].find((e) => e.route === "/blogs/");
if (blogs) {
  blogs.lastmod = latest([blogs.lastmod, ...entries["post-sitemap.xml"].map((e) => e.lastmod)]);
}

const HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  `<?xml-stylesheet type="text/xsl" href="//alsinantransport.com/main-sitemap.xsl"?>\n`;

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function urlset(list) {
  const urls = list
    .map(({ route, lastmod }) =>
      [
        "\t<url>",
        `\t\t<loc>${escape(SITE + route)}</loc>`,
        lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
        "\t</url>",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");
  return `${HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const index = [];
for (const { file } of SITEMAPS) {
  const list = entries[file];
  if (!list.length) continue;
  fs.writeFileSync(path.join(dist, file), urlset(list));
  index.push({ file, lastmod: latest(list.map((e) => e.lastmod)) });
}

const sitemaps = index
  .map(({ file, lastmod }) =>
    [
      "\t<sitemap>",
      `\t\t<loc>${SITE}/${file}</loc>`,
      lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
      "\t</sitemap>",
    ]
      .filter(Boolean)
      .join("\n")
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `${HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`
);

const total = index.reduce((n, { file }) => n + entries[file].length, 0);
console.log(
  `sitemap: ${total} URLs across ${index.length} sitemaps` +
    (skipped.length ? `, left out as noindex: ${skipped.join(", ")}` : "")
);
