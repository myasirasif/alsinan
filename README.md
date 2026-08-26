# Alsinan Transport — React replica

A React port of https://alsinantransport.com, rebuilt from the live WordPress
output. Design, markup, content, links, media and SEO metadata are reproduced
one-to-one, and every route is prerendered to static HTML at build time.

## Run it

```bash
cd app
npm install
npm run dev      # http://localhost:5173  (SPA, no prerender)
npm run build    # dist/ — static HTML for every route
npm run preview  # serve dist/ exactly as it will be served in production
```

## Deploying to Vercel

Point the project at the `app/` directory. `vercel.json` sets the build command,
output directory, `trailingSlash: true` (matching the WordPress URLs), the
legacy WordPress redirects, and long-lived cache headers for
`/wp-content/uploads` and `/assets`.

**Staging safety.** The first rule in `headers` attaches
`X-Robots-Tag: noindex, nofollow` to every response whose host is *not*
`alsinantransport.com`. Staging and `*.vercel.app` URLs therefore stay out of
Google, and the rule switches itself off on the real domain — nothing to
remember at launch. The page HTML still says `index`, which is what the live
domain needs; where the two disagree Google honours the more restrictive one.
For staging that must not be publicly reachable at all, also turn on
Settings -> Deployment Protection, which does not depend on crawlers behaving.

`vercel.json` is validated locally before every build by
`check-vercel-config.mjs`. Vercel rejects unknown properties and fails the whole
deploy, so note that **JSON takes no comments** — document rules here, not in
the file.

### The react-helmet-async override

`react-helmet-async@2` still declares its peer range as React 16/17/18, so a
plain `npm install` on React 19 fails with `ERESOLVE`. The package itself works
on React 19 — the prerender, hydration and all 22 routes are verified against it
— only its metadata is stale. `package.json` therefore carries:

```json
"overrides": { "react-helmet-async": { "react": "$react", "react-dom": "$react-dom" } }
```

Never install with `--legacy-peer-deps`: it hides this locally and lets a broken
tree reach Vercel, which installs with no flags. `npm install` from a clean
checkout must succeed on its own.

Version 3 of the package is not an option here: on React 19 it delegates to
React's built-in metadata hoisting and stops populating the SSR context that
`prerender.mjs` reads, so the static HTML comes out with no head tags.

Nothing else is required — the build emits plain static files:

```
dist/index.html                  ->  /
dist/about/index.html            ->  /about/
dist/services/<slug>/index.html  ->  /services/<slug>/
dist/404.html                    ->  anything unmatched
dist/robots.txt, dist/sitemap.xml, dist/*-sitemap.xml
```

Before going live on the real domain, point the DNS at Vercel and keep the URL
shapes identical — every canonical, sitemap entry and internal link already
uses `https://alsinantransport.com/...` with a trailing slash.

## What is in here

| Path | What it is |
| --- | --- |
| `app/` | The React application (Vite 7 + React 19 + React Router 7 + react-helmet-async 2) |
| `app/src/pages/` | One component per WordPress page — generated, do not hand-edit |
| `app/src/components/Header.jsx`, `Footer.jsx` | Shared theme header/footer — generated |
| `app/src/components/Seo.jsx` | Renders the per-route head tags |
| `app/src/data/seo.js` | Rank Math title/description/robots/canonical/OG/Twitter/JSON-LD, verbatim per route |
| `app/src/data/bodyClasses.js` | The `<body class>` WordPress emits per page — the theme CSS depends on it |
| `app/src/entry-server.jsx` | Renders one route to static HTML |
| `app/prerender.mjs` | Writes `dist/<route>/index.html` for all 22 routes plus `404.html` |
| `app/public/wp-content/uploads/` | All 92 media files, served from our own domain |
| `app/public/assets/` | The theme's own CSS and JS, byte-identical to `wp-content/themes/alsinan` |
| `app/public/robots.txt`, `sitemap*.xml` | Copied verbatim from the live site |
| `scrape/` | The downloaded live HTML the build reads from |
| `convert.py`, `build.py`, `make_404.py`, `extract_css.py`, `fetch_media.py` | The generator pipeline |
| `seo_audit.py` | Reports concrete SEO facts about the scraped pages |
| `compare.mjs` | Verifies every route against the live site |

## Routes

All 22 URLs keep their exact WordPress paths, trailing slash included:
8 pages, 6 `/services/*` pages, 7 blog posts, `/category/cars/`, plus a 404 route.

## Regenerating

The page components are generated, so changes to the live site are picked up by
re-running the pipeline rather than by editing JSX:

```bash
python extract_css.py     # inline <style> blocks from the live head -> CSS files
python fetch_media.py     # download any newly referenced media
node optimize_images.mjs  # convert heavy images to WebP, refresh image_swaps.json
python build.py           # pages, header, footer, SEO data, router (applies fixes.py)
python make_404.py        # the 404 route
cd app && npm run build
python ../verify_fixes.py # assert every SEO fix is present in the built HTML
node ../compare.mjs       # diff every route against the live site (needs preview running)
```

`compare.mjs` checks title, meta description, canonical, JSON-LD count, every
`h1`/`h2`, heading/section/image counts, broken images, rendered page height and
text length. Current status: **19/22 identical**, and the three that differ are
the three meta descriptions rewritten on purpose (see the fixes table). Zero
console errors, zero broken images, zero images without alt, and no runtime
requests to the old domain.

## How the theme's behaviour was carried over

- **CSS** loads in `index.html` in the exact order WordPress emitted it, including
  the two inline blocks (`wp-inline.css` and `site-overrides.css`).
- **jQuery** is loaded before React mounts, because the theme's inline snippets
  (owl carousels, accordions) run on page mount. Each page re-runs its own
  snippets through `useThemeScripts` and destroys carousels on route exit.
- **Active nav classes** (`current-menu-item`, `current-menu-ancestor`) are
  recomputed from the current route, since WordPress rendered them server-side.
- **Body classes** are applied per route, both in the prerendered HTML and after
  hydration.
- WordPress's own nested-`<a>` bug around the logo is unwrapped — it is invalid
  HTML that React refuses to render.

## SEO fixes applied on top of the WordPress output

All of these live in `fixes.py` (plus `optimize_images.mjs`), deliberately kept
out of the scraper so the site can be re-scraped without losing them.
`verify_fixes.py` checks each one against the built HTML — currently 13/13 pass.

| Fix | What changed |
| --- | --- |
| Image alt text | 46 missing alts filled and 19 filename-style alts replaced. Decorative icons get an explicit empty alt; icons that are a link's only content get a real description; photos are described from what is actually in them. |
| `robots.txt` | `AdsBot-Google` was blocked, which breaks Google Ads landing page checks. Now explicitly allowed. Other crawler blocks left as they were. |
| Opening hours | Schema said `09:00-17:00` while the site advertises 24/7 airport transfers. Replaced with an `openingHoursSpecification` covering all seven days. |
| `/category/cars/` | Duplicated `/blogs/`, was indexable and had no description. Now `noindex, follow`, given a description, and dropped from the sitemap. |
| Image weight | 23 heavy PNG/JPEGs converted to WebP. Site-wide **9.06 MB -> 3.00 MB**; the homepage alone drops **3.49 MB -> 0.83 MB**. The hero background went from 2128 KB to 160 KB, which is the LCP image. Originals stay on disk so `og:image` and JSON-LD keep resolving. |
| Meta descriptions | The two over 160 characters were trimmed; the category page got one. |
| `og:type` | Was `article` on 21 pages including ordinary service pages. Now `website` everywhere except the 7 blog posts. |
| Internal linking | Blog posts now link the first mention of each service phrase to that service page (1-5 links per post, 23 total). Only existing phrases are wrapped — no copy was invented. |
| Google Tag Manager | Container `GTM-5FBF59C5` was dropped when the head was rebuilt. Restored, plus a `virtual_pageview` dataLayer push on every route change — a SPA otherwise reports one pageview per session. |
| Broken archive links | `/category/cars/` linked to eight tag, author and date archives that no longer exist. `vercel.json` now 301s `/tag/*`, `/author/*` and date archives to `/blogs/`, along with `/wp-admin`, `/wp-login.php`, `/feed/` and the old sitemap paths. |

### Deliberately not changed

**The five titles at 61-63 characters.** Google truncates by pixel width, not
character count, and all five already lead with their keyword and brand. Editing
titles on a site that already ranks risks more than the two or three characters
it would save. They are listed in `seo_audit.py` output if you want them
shortened anyway.

## Contact form

The Contact Form 7 markup had no backend once WordPress was gone. It is now a
real form: `app/src/components/ContactForm.jsx` posts to `app/api/contact.js`,
a Vercel function that sends through Resend. The classes and layout are
unchanged, so the theme CSS still styles it, including Contact Form 7's own
`init` / `submitting` / `sent` / `invalid` / `failed` state classes.

Two variants exist, matching the live site: `contact` (full form on
`/contact-us/`, split first/last name) and `compact` (blog sidebar, single name
field). `build.py` picks the variant automatically from the original markup.

### Environment variables (set these in Vercel, never in the repo)

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend sending key. Scope it to this domain. |
| `CONTACT_TO_EMAIL` | no | Where leads land. Defaults to `alsinantransport@gmail.com`. |
| `CONTACT_FROM_EMAIL` | no | Defaults to `Alsinan Website <noreply@alsinantransport.com>`. The domain must be verified in Resend. |
| `RECAPTCHA_SECRET_KEY` | no | Enables server-side reCAPTCHA v3 checks. Without it the honeypot and rate limit still apply. |

### What the endpoint does

Server-side validation with per-field messages, a honeypot, a per-IP rate limit
(5 per 10 minutes, best-effort since serverless instances are recycled), HTML
escaping of everything that reaches the email, `reply_to` set to the customer so
replying in Gmail goes straight back to them, and the originating page included
in the email so you can see which page converts. On success the form pushes a
`generate_lead` event to the dataLayer for GTM.

`npm run test:contact` exercises the handler with `fetch` stubbed — no key, no
network, no real email. Currently 15/15 pass. Note that `npm run preview` does
**not** run the function; only `vercel dev` or a real deployment does.

## Notes and remaining work

1. **The sitemaps are a snapshot** of what Rank Math generated. They are correct
   for the current 22 URLs, but they will not update themselves when pages are
   added — regenerate them from the route list at that point.
2. **`og:image` and JSON-LD URLs still point at `alsinantransport.com`.** That is
   correct as long as the site ships on that domain; it needs a find-and-replace
   if the domain changes.
3. **Font Awesome and Google Fonts still load from their CDNs**, exactly as the
   live site does. Self-hosting them would remove two third-party round trips.
4. **The JS bundle is ~842 kB (162 kB gzipped)** in one chunk, because
   `renderToString` cannot resolve `React.lazy` during prerendering. Content is
   visible before that JS runs, so this affects interactivity, not first paint.
   Splitting it needs a streaming SSR setup.
