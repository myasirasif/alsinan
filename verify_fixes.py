# -*- coding: utf-8 -*-
"""Check every fix against the built output, not against intentions."""
import os, re, json, glob, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "app", "public")
BUILT = os.path.join(ROOT, "app", "dist")
sys.path.insert(0, ROOT)

fails = []


def check(label, ok, detail=""):
    print("%-4s %s%s" % ("PASS" if ok else "FAIL", label, ("  -- " + detail) if detail else ""))
    if not ok:
        fails.append(label)


pages = sorted(glob.glob(os.path.join(BUILT, "**", "index.html"), recursive=True))
pages += [os.path.join(BUILT, "404.html")]
html_by_route = {}
for p in pages:
    rel = os.path.relpath(os.path.dirname(p), BUILT).replace("\\", "/")
    route = "/" if rel == "." else "/" + rel + "/"
    html_by_route[route] = open(p, encoding="utf-8", errors="replace").read()

# 1. image alts
missing = []
for route, h in html_by_route.items():
    body = h[h.find("<body"):]
    for tag in re.findall(r"<img\b[^>]*>", body):
        if not re.search(r'\balt="', tag):
            missing.append((route, tag[:90]))
check("every rendered <img> has an alt attribute", not missing,
      "%d without alt" % len(missing))

filename_alts = []
for route, h in html_by_route.items():
    for tag in re.findall(r"<img\b[^>]*>", h[h.find("<body"):]):
        m = re.search(r'\balt="([^"]*)"', tag)
        if m and m.group(1).strip() and re.match(r"^[\w.-]+$", m.group(1).strip()):
            filename_alts.append((route, m.group(1)))
check("no filename-style alt text left", not filename_alts,
      str(sorted({a for _, a in filename_alts})[:5]))

# 2. robots.txt
robots = open(os.path.join(DIST, "robots.txt"), encoding="utf-8").read()
adsbot = re.search(r"User-agent: AdsBot-Google\s*\n(Allow|Disallow): /", robots)
check("AdsBot-Google is allowed", bool(adsbot) and adsbot.group(1) == "Allow",
      adsbot.group(0).replace("\n", " ") if adsbot else "not found")

# 3. opening hours in JSON-LD
bad_hours, spec_found = [], 0
for route, h in html_by_route.items():
    for block in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
        if "09:00-17:00" in block:
            bad_hours.append(route)
        if "openingHoursSpecification" in block:
            spec_found += 1
check("no 09:00-17:00 opening hours remain", not bad_hours, str(bad_hours[:3]))
check("openingHoursSpecification present", spec_found > 0, "on %d pages" % spec_found)

# 4. category archive
cat = html_by_route.get("/category/cars/", "")
robots_meta = re.search(r'<meta[^>]*name="robots"[^>]*content="([^"]*)"', cat)
check("/category/cars/ is noindex", bool(robots_meta) and "noindex" in robots_meta.group(1),
      robots_meta.group(1) if robots_meta else "no robots meta")
desc = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"', cat)
check("/category/cars/ has a description", bool(desc) and len(desc.group(1)) > 50,
      "%d chars" % len(desc.group(1)) if desc else "none")
sitemap = open(os.path.join(DIST, "sitemap.xml"), encoding="utf-8").read()
check("category dropped from sitemap", "category-sitemap" not in sitemap)

# 5. webp swaps
swaps = json.load(open(os.path.join(ROOT, "image_swaps.json"), encoding="utf-8"))
leftover = []
for route, h in html_by_route.items():
    body = h[h.find("<body"):]
    for old in swaps:
        if old in body:
            leftover.append((route, old))
check("heavy PNG/JPEG references replaced with WebP", not leftover,
      str(leftover[:3]))
total_webp = sum(1 for route, h in html_by_route.items() if ".webp" in h)
check("WebP in use across pages", total_webp > 0, "%d pages" % total_webp)

# 6. description lengths
long_desc = []
for route, h in html_by_route.items():
    m = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"', h)
    if m and len(m.group(1)) > 160:
        long_desc.append((route, len(m.group(1))))
check("no meta description over 160 chars", not long_desc, str(long_desc))

# 7. og:type
wrong_ogtype = []
from fixes import BLOG_PATHS
for route, h in html_by_route.items():
    m = re.search(r'<meta[^>]*property="og:type"[^>]*content="([^"]*)"', h)
    if not m or route == "/404.html":
        continue
    expected = "article" if route in BLOG_PATHS else "website"
    if m.group(1) != expected:
        wrong_ogtype.append((route, m.group(1)))
check("og:type correct per page type", not wrong_ogtype, str(wrong_ogtype[:4]))

# 8. internal links added to blog posts
added = {}
for route in BLOG_PATHS:
    h = html_by_route.get(route, "")
    # count only the article body, not the header/footer nav
    main = h[h.find("</header>"):h.find("<footer")]
    added[route] = len(re.findall(r'<a href="/services/[^"]*"[^>]*>', main))
check("blog posts link out to service pages",
      all(v > 0 for v in added.values()),
      json.dumps({k.split("/")[1][:26]: v for k, v in added.items()}))

print("\n%d checks failed" % len(fails))
sys.exit(1 if fails else 0)
