# -*- coding: utf-8 -*-
"""SEO fixes applied on top of the scraped WordPress output.

Kept separate from convert.py/build.py so the whole site can be re-scraped and
regenerated without losing them.
"""
import json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
LIVE = "https://alsinantransport.com"

# ---------------------------------------------------------------- image alts
# Written after looking at each image. Decorative icons get an explicit empty
# alt (the adjacent text already carries the meaning); anything that is the only
# content of a link, or that carries information, gets a real description.
ALT_TEXT = {
    # decorative icons sitting next to text that already says the same thing
    "icon_mail.svg": "",
    "icon_ph.svg": "",
    "icon_pin_map.svg": "",
    "icon_about.svg": "",
    "icon_safety_security.svg": "",
    "icon_ontime.svg": "",
    "iocn_professional_drivers.svg": "",
    "iocn_maintenance.svg": "",
    "red_area.png": "",
    "img_404.jpg": "Illustration for a page that could not be found",

    # icons that are the only content of a link, so they must be described
    "icon_fb.svg": "Alsinan Transport on Facebook",
    "icon_insta.svg": "Alsinan Transport on Instagram",
    "icon_ln.svg": "Alsinan Transport on LinkedIn",
    "icon_x.svg": "Alsinan Transport on X",
    "icon_wp.svg": "Chat with Alsinan Transport on WhatsApp",

    # photographs
    "vehcle_banner.webp": "Alsinan Transport coach bus and car against the Dubai skyline",
    "about_large.png": "Grey Mercedes Sprinter passenger van with its side door open",
    "about_large.webp": "Grey Mercedes Sprinter passenger van with its side door open",
    "about_small.png": "Red BMW coupe available for private car rental",
    "about_small.webp": "Red BMW coupe available for private car rental",
    "choose_large.png": "Rear view of a white Toyota Hiace Premio passenger van",
    "choose_small.png": "Orange BMW M3 parked on a palm-lined street",
    "e58f33d6b68636dd830cb3cede724d823788f6b3-scaled.jpg":
        "Red BMW coupe available for private car rental in Dubai",
    "WhatsApp-Image-2025-10-14-at-18.33.09_51e9ed5f.jpg":
        "Toyota Hiace vans parked as part of the Alsinan Transport fleet in Dubai",
    "WhatsApp-Image-2025-10-14-at-18.33.10_41bbae53.jpg":
        "White Toyota Hiace high-roof van with Alsinan Passengers Transport branding, parked in Dubai",
    "WhatsApp-Image-2025-10-14-at-18.33.11_24296a51.jpg":
        "White Ashok Leyland bus from the Alsinan Transport fleet parked in Dubai",
}

FILENAME_ALT = re.compile(r"^[\w.-]+$")


def _basename(src):
    return os.path.basename((src or "").split("?")[0])


def fix_alts(html):
    """Fill in missing alts and replace filename-style ones."""
    def repl(m):
        tag = m.group(0)
        src = re.search(r'\bsrc="([^"]*)"', tag)
        if not src:
            return tag
        base = _basename(src.group(1))
        # the WebP swap runs later, so accept either extension here
        alt_key = base if base in ALT_TEXT else re.sub(r"\.webp$", ".png", base)
        if alt_key not in ALT_TEXT:
            alt_key = re.sub(r"\.webp$", ".jpg", base)
        if alt_key not in ALT_TEXT:
            return tag

        current = re.search(r'\balt="([^"]*)"', tag)
        if current:
            val = current.group(1).strip()
            # keep alt text a human wrote; only replace filename-shaped values
            if val and not FILENAME_ALT.match(val):
                return tag
            return tag[:current.start(1)] + ALT_TEXT[alt_key] + tag[current.end(1):]
        return tag[:-1].rstrip().rstrip("/") + ' alt="%s">' % ALT_TEXT[alt_key]

    return re.sub(r"<img\b[^>]*>", repl, html)


# -------------------------------------------------------- image dimensions
def _load_sizes():
    p = os.path.join(ROOT, "image_sizes.json")
    if not os.path.exists(p):
        return {}
    with open(p, encoding="utf-8") as f:
        return json.load(f)


IMAGE_SIZES = _load_sizes()


def _normalise_src(src):
    s = (src or "").split("?")[0].strip()
    for prefix in (LIVE, "http://alsinantransport.com",
                   "https://alsinan-2026.local", "http://alsinan-2026.local"):
        if s.startswith(prefix):
            s = s[len(prefix):]
            break
    if s.startswith("./"):
        s = s[1:]
    if not s.startswith("/"):
        s = "/" + s
    return s


P_WRAPPING_LI = re.compile(r"<p(\s[^>]*)?>(\s*<li\b.*?</li>\s*)</p>", re.S)


def fix_list_in_paragraph(html):
    """Turn a <p> that wraps bare <li> elements into the <ul> it should be.

    The fleet page had four <li> inside a <p>. A browser's parser closes the <p>
    before the first <li>, so the DOM never matched what React rendered and
    hydration failed - React threw away the whole prerendered page and rebuilt
    it, which is exactly what prerendering exists to avoid.
    """
    return P_WRAPPING_LI.sub(lambda m: "<ul%s>%s</ul>" % (m.group(1) or "", m.group(2)), html)




COPYRIGHT = re.compile(r'(<p class="mb-0">Copyright[^<]*</p>)')

# The bottom bar's link list, as the theme emits it in the right-hand column.
# Anchored on the d-inline-flex list: .list_col is also the class on the "Our
# Services" column higher up the footer, and matching that one moved the wrong
# block. Only the bottom bar's ul carries d-inline-flex.
LIST_COL = re.compile(
    r'\s*<div class="list_col">\s*<ul class="d-inline-flex[^>]*>.*?</ul>\s*</div>', re.S
)

# A text heart rather than an inline SVG. The HTML-to-JSX converter lowercases
# attribute names, which is right for HTML but breaks SVG: viewBox became
# viewbox, the browser ignored it, and the path drew clipped against a 13px
# viewport. A character has no attributes to mangle and scales with the text.
HEART = '<span class="site_credit__heart">&#9829;</span>'


def add_credit(html):
    """Rearrange the footer's bottom bar and add the build credit.

    The theme puts the copyright on the left and the Blogs/Terms/Privacy links
    on the right. Dropping the credit under those links left it crowded and easy
    to miss. Moving the links up beside the copyright frees the whole right-hand
    side for the credit, on the same line as the copyright rather than below it.
    The links stay in the footer - they are the only route to those pages.
    """
    if "site_credit" in html:
        return html

    found = LIST_COL.search(html)
    if not found:
        return html  # markup moved; leave the footer alone rather than mangle it
    links = found.group(0).strip()

    credit = (
        '<p class="mb-0 site_credit">Design and developed with '
        + HEART
        + ' by <a href="https://yasirafridi.dev/" target="_blank" rel="noopener">Yasir</a></p>'
    )

    # the credit takes the place the links vacate, so it lands in the right column
    html = LIST_COL.sub(lambda m: credit, html, count=1)
    return COPYRIGHT.sub(
        lambda m: '<div class="copyright_line">' + m.group(1) + links + "</div>",
        html,
        count=1,
    )


def fix_lazy_hero(html):
    """A hero image marked fetchpriority=high must not also be lazy.

    WordPress emitted both on the banner images, which cancel out: the browser
    is told the image is urgent and then told to defer it. Since these are the
    LCP element, drop the lazy attribute and load them eagerly.
    """
    def repl(m):
        tag = m.group(0)
        if 'fetchpriority="high"' not in tag.lower():
            return tag
        return re.sub(r'\sloading="lazy"', ' loading="eager"', tag, flags=re.I)

    return re.sub(r"<img\b[^>]*>", repl, html)


def add_image_dimensions(html):
    """Give every raster <img> its real width/height.

    Browsers derive an aspect ratio from these attributes and reserve the space
    before the file arrives, which is what stops the page shifting (CLS). The
    theme has no global `img { height: auto }`, so spa-fixes.css adds one scoped
    to `img[width][height]` - only the images touched here are affected.
    """
    def repl(m):
        tag = m.group(0)
        if re.search(r"\b(width|height)=", tag):
            return tag
        src = re.search(r'\bsrc="([^"]*)"', tag)
        if not src:
            return tag
        # the raw markup uses absolute, root-relative and bare forms
        dims = IMAGE_SIZES.get(_normalise_src(src.group(1)))
        if not dims:
            return tag
        return '%s width="%d" height="%d">' % (tag[:-1].rstrip().rstrip("/"), dims[0], dims[1])

    return re.sub(r"<img\b[^>]*>", repl, html)


# ------------------------------------------------------------- WebP swapping
def _load_swaps():
    p = os.path.join(ROOT, "image_swaps.json")
    if not os.path.exists(p):
        return {}
    with open(p, encoding="utf-8") as f:
        return json.load(f)


IMAGE_SWAPS = _load_swaps()


def swap_image(url):
    """Point a heavy PNG/JPEG at its WebP twin. Originals stay reachable."""
    if not url:
        return url
    clean = url.split("?")[0]
    for prefix in (LIVE, "http://alsinantransport.com", "http://alsinan-2026.local"):
        if clean.startswith(prefix):
            clean = clean[len(prefix):]
    if not clean.startswith("/"):
        clean = "/" + clean.lstrip("./")
    return IMAGE_SWAPS.get(clean, url)


# --------------------------------------------------------------- SEO patches
BLOG_PATHS = {
    "/compare-different-hotel-transport-options-dubai/",
    "/transport-service-options-for-airport-transfers-uae/",
    "/ride-service-for-daily-commuting-in-dubai/",
    "/what-to-think-about-before-traveling-to-dubai/",
    "/the-daily-transport-challenges-businesses-face-in-dubai/",
    "/why-many-families-prefer-dedicated-transport-services-in-dubai/",
    "/how-visitors-move-around-dubai-without-stress/",
}

# The category archive duplicates /blogs/ and shipped with no description.
# Keep it crawlable so it still passes link equity, but out of the index.
CATEGORY_PATH = "/category/cars/"

DESCRIPTION_OVERRIDES = {
    # trimmed to stay inside the ~158 character snippet limit
    "/services/hotel-transport-service-in-dubai/":
        "Reliable hotel transport in Dubai for guest pickups, drop-offs and "
        "day trips. Professional drivers, clean vehicles and 24/7 availability.",
    "/how-visitors-move-around-dubai-without-stress/":
        "How visitors get around Dubai without the stress: comparing taxis, "
        "ride apps, metro and private transport, and when each one makes sense.",
    CATEGORY_PATH:
        "Articles from Alsinan Transport on cars, vans and buses for travel "
        "around Dubai and the wider UAE.",
}


def patch_seo(path, seo):
    """Apply the head-level fixes for one route."""
    meta = seo["meta"]

    def set_meta(key, value, attr="name"):
        for m in meta:
            if m.get(attr) == key:
                m["content"] = value
                return
        meta.append({attr: key, "content": value})

    # og:type was "article" on ordinary pages; only the blog posts are articles
    if path not in BLOG_PATHS:
        set_meta("og:type", "website" if path != CATEGORY_PATH else "website", attr="property")

    if path in DESCRIPTION_OVERRIDES:
        desc = DESCRIPTION_OVERRIDES[path]
        set_meta("description", desc)
        set_meta("og:description", desc, attr="property")
        set_meta("twitter:description", desc)

    if path == CATEGORY_PATH:
        set_meta("robots", "noindex, follow, max-image-preview:large")

    seo["jsonld"] = [patch_jsonld(b) for b in seo["jsonld"]]
    return seo


# The business advertises round-the-clock airport transfers, but the schema
# said 09:00-17:00. Contradicting yourself in structured data is worse than
# omitting it, so state the real availability.
OPENING_SPEC = [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday",
                  "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59",
}]


def _patch_node(node):
    if not isinstance(node, dict):
        return node
    if "openingHours" in node or "openingHoursSpecification" in node:
        node.pop("openingHours", None)
        node["openingHoursSpecification"] = OPENING_SPEC
    for k, v in list(node.items()):
        if isinstance(v, dict):
            node[k] = _patch_node(v)
        elif isinstance(v, list):
            node[k] = [_patch_node(i) for i in v]
    return node


def patch_jsonld(block):
    try:
        data = json.loads(block)
    except Exception:
        return block
    if isinstance(data, dict) and "@graph" in data:
        data["@graph"] = [_patch_node(n) for n in data["@graph"]]
    else:
        data = _patch_node(data)
    return json.dumps(data, ensure_ascii=False)


# --------------------------------------------------------- internal linking
# Blog posts mention these services in plain text. Linking the first mention is
# mechanical and safe: no copy is invented, only the existing phrase is wrapped.
LINK_PHRASES = [
    ("staff transport", "/services/staff-transport-in-dubai/"),
    ("school transport", "/services/school-transport-in-dubai/"),
    ("hotel transport", "/services/hotel-transport-service-in-dubai/"),
    ("airport transfers", "/services/airport-transport-in-dubai/"),
    ("airport transport", "/services/airport-transport-in-dubai/"),
    ("private car rental", "/services/private-car-rental-in-dubai/"),
    ("car rental", "/services/private-car-rental-in-dubai/"),
]

# only link inside body paragraphs, never headings, links or attributes
PARA = re.compile(r"(<p\b[^>]*>)(.*?)(</p>)", re.S)


def add_internal_links(html, path, max_links=3):
    """Link the first mention of each service phrase in a blog post's paragraphs."""
    if path not in BLOG_PATHS:
        return html

    used = set()
    added = [0]

    def link_paragraph(m):
        open_tag, body, close_tag = m.groups()
        if added[0] >= max_links or "<a " in body:
            return m.group(0)
        for phrase, target in LINK_PHRASES:
            if target in used or added[0] >= max_links:
                continue
            pattern = re.compile(r"(?<![\w>])(" + re.escape(phrase) + r")(?![\w<])", re.I)
            hit = pattern.search(body)
            if not hit:
                continue
            body = body[:hit.start()] + '<a href="%s">%s</a>' % (target, hit.group(1)) + body[hit.end():]
            used.add(target)
            added[0] += 1
        return open_tag + body + close_tag

    return PARA.sub(link_paragraph, html)
