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
html_by_route = {}
for p in pages:
    rel = os.path.relpath(os.path.dirname(p), BUILT).replace("\\", "/")
    route = "/" if rel == "." else "/" + rel + "/"
    html_by_route[route] = open(p, encoding="utf-8", errors="replace").read()

# 404.html sits in the same directory as the homepage, so deriving its route
# from its parent folder gave it "/" as well - and because it was appended last
# it replaced the homepage in this map. Every check above was silently running
# against the 404 page instead of the front page. It gets its own key now.
html_by_route["/404"] = open(os.path.join(BUILT, "404.html"),
                             encoding="utf-8", errors="replace").read()

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

# 9. titles fit in a search result
SERVICE_ROUTES = [
    "/services/school-transport-in-dubai/",
    "/services/staff-transport-in-dubai/",
    "/services/airport-transport-in-dubai/",
    "/services/hotel-transport-service-in-dubai/",
    "/services/private-car-rental-in-dubai/",
    "/services/dubai-tours-transport-services/",
]

long_titles = []
for route, h in html_by_route.items():
    m = re.search(r"<title[^>]*>(.*?)</title>", h, re.S)
    if m:
        import html as _h
        t = _h.unescape(m.group(1)).strip()
        if len(t) > 60:
            long_titles.append((route, len(t)))
check("no title runs past the 60-character truncation point", not long_titles,
      str(long_titles[:4]))

# 10. the enquiry form reaches every service page
formless = [r for r in SERVICE_ROUTES if "<form" not in html_by_route.get(r, "")]
check("every service page carries an enquiry form", not formless, str(formless))

# 11. one phone format, everywhere
old_phone = {r for r, h in html_by_route.items() if "+97155 525 2397" in h}
bad_tel = {}
for r, h in html_by_route.items():
    wrong = [t for t in re.findall(r'href="tel:([^"]*)"', h) if t != "+971555252397"]
    if wrong:
        bad_tel[r] = wrong[:2]
check("phone number is written one way sitewide", not old_phone and not bad_tel,
      "old format on %d pages, %d pages with a non-E.164 tel: link"
      % (len(old_phone), len(bad_tel)))

# 12. FAQ markup matches what the page actually shows. Google's policy is that
# marked-up content has to be present on the page; same topic, different wording
# is what a structured-data manual action is issued over.
faq_problems = []
for route, h in html_by_route.items():
    sec = re.search(r'<section class="faqs_section">(.*?)</section>', h, re.S)
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
    questions = {}
    for b in blocks:
        try:
            data = json.loads(b)
        except ValueError:
            continue
        stack = [data]
        while stack:
            n = stack.pop()
            if isinstance(n, list):
                stack.extend(n)
            elif isinstance(n, dict):
                if n.get("@type") == "Question":
                    questions[n.get("name", "")] = True
                stack.extend(n.values())
    if not questions:
        continue
    if not sec:
        faq_problems.append((route, "marked up but nothing rendered"))
        continue
    import html as _h
    strip = lambda t: re.sub(r"\s+", " ", _h.unescape(re.sub(r"<[^>]+>", " ", t))).strip()
    shown = {strip(q) for q in re.findall(r"<h2[^>]*>(.*?)</h2>", sec.group(1), re.S)}
    for q in questions:
        if q not in shown:
            faq_problems.append((route, q[:50]))
check("every marked-up FAQ question appears on the page", not faq_problems,
      str(faq_problems[:3]))

# 13. the services hub is reachable from body copy, not only the nav
hub_links = 0
for route, h in html_by_route.items():
    if route == "/services/":
        continue
    main = h[h.find("</header>"):h.find("<footer")]
    hub_links += len(re.findall(r'<a href="/services/"', main))
check("the /services/ hub is linked from body copy", hub_links > 0,
      "%d inbound body links" % hub_links)


print("\n%d checks failed" % len(fails))
sys.exit(1 if fails else 0)
