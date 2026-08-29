# -*- coding: utf-8 -*-
"""SEO fixes applied on top of the scraped WordPress output.

Kept separate from convert.py/build.py so the whole site can be re-scraped and
regenerated without losing them.
"""
import json, os, re, html as htmlmod

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

# ---------------------------------------------------------------------------
# NAP consistency
# ---------------------------------------------------------------------------
# The number was written three ways: "+97155 525 2397" in the footer and most
# links, "+971 55 525 2397" on the airport page, and the same string with a
# space inside the tel: href, which is not a valid tel URI. Local ranking leans
# on name/address/phone matching exactly across the site and the Google
# Business Profile, so all three are normalised here:
#   displayed  ->  +971 55 525 2397   (correct UAE grouping)
#   tel: href  ->  +971555252397      (E.164, no spaces)
TEL_DISPLAY = "+971 55 525 2397"
TEL_URI = "+971555252397"

TEL_HREF = re.compile(r'href="tel:[^"]*"')
TEL_TEXT = re.compile(r"\+971\s*55\s*525\s*2397")


def fix_phone(text):
    """Normalise every rendering of the phone number.

    Order matters. TEL_TEXT's \s* matches zero characters, so it happily
    rewrites the digits inside a tel: URI as well; running it first and the href
    rule second means the href always ends up in E.164 regardless.
    """
    text = TEL_TEXT.sub(TEL_DISPLAY, text)
    return TEL_HREF.sub('href="tel:%s"' % TEL_URI, text)


# ---------------------------------------------------------------------------
# Enquiry form on the service pages
# ---------------------------------------------------------------------------
# The form was on all seven blog posts and the contact page, and on none of the
# six service pages - backwards, because a reader on a service page is the one
# ready to buy. The wrapper below reuses the theme's own needbox_section /
# form_section_inner classes, the same ones the contact page uses, so no new
# styling is needed.
#
# The copy differs per page on purpose. Identical boilerplate on six pages would
# have deepened the vocabulary overlap the content audit already flags between
# the airport and hotel pages, and each version asks for the details that page's
# reader actually has to hand.
SERVICE_FORM_COPY = {
    "/services/school-transport-in-dubai/": (
        "School Transport",
        "Tell us about your school run",
        "Share the route, how many students travel and the pickup and drop timings, "
        "and we will come back with a plan for the term. Our buses run from "
        "14 seaters up to 67 seater coaches.",
    ),
    "/services/staff-transport-in-dubai/": (
        "Staff Transport",
        "Plan your staff routes with us",
        "Send us your shift timings, pickup points and headcount, and we will put "
        "together a monthly plan for your team. We run 14, 30, 34, 50 and "
        "67 seater vehicles.",
    ),
    "/services/airport-transport-in-dubai/": (
        "Airport Transport",
        "Book an airport transfer",
        "Give us the flight number, the terminal and how many passengers are "
        "travelling, and we will confirm the driver and the pickup point.",
    ),
    "/services/hotel-transport-service-in-dubai/": (
        "Hotel Transport",
        "Arrange transport for your guests",
        "Tell us the pickup schedule and how many guests you move in a typical "
        "week, and we will set up a standing arrangement.",
    ),
    "/services/private-car-rental-in-dubai/": (
        "Private Car Rental",
        "Book a private car",
        "Let us know the dates, the pickup area and whether you need a chauffeur, "
        "and we will send you the options that fit.",
    ),
    "/services/dubai-tours-transport-services/": (
        "Tours & Excursions",
        "Plan your group trip",
        "Tell us the destinations, the group size and the dates, and we will build "
        "an itinerary around the right vehicle - anything from a 7 seater to "
        "a 67 seater coach.",
    ),
}

SERVICE_FORM_TPL = """<section class="needbox_section svc_enquiry">
<div class="form_section_inner">
<div class="container">
<div class="row">
<div class="col-lg-7">
<div class="form_top_row">
<div class="content_middle_contact_form">
<span class="sub_head">%(eyebrow)s</span>
<h2>%(heading)s</h2>
<p>%(intro)s</p>
</div>
</div>
</div>
</div>
<div class="row">
<div class="col-lg-7">
<div class="form_middle_row">
<div class="contact_form">
<contactform variant="compact"></contactform>
</div>
</div>
</div>
<div class="col-lg-5">
<div class="form_middle_row">
<div class="contact_frm_content">
<h3>Rather talk to us?</h3>
<ul>
<li><a href="tel:%(tel_uri)s"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" width="19" height="19" /> %(tel)s</a></li>
<li><a href="mailto:alsinantransport@gmail.com"><img src="/wp-content/uploads/2025/09/icon_mail.svg" alt="" width="19" height="14" /> alsinantransport@gmail.com</a></li>
</ul>
<a href="https://wa.me/971555252397?text=I%%20want%%20to%%20know%%20more%%20about%%20Alsinan" target="_blank" rel="noopener" class="btn btn-secondary">WhatsApp Us</a>
</div>
</div>
</div>
</div>
</div>
</div>
</section>"""

FINAL_NEEDBOX = re.compile(r'<section class="needbox_section"[^>]*>')

# ---------------------------------------------------------------------------
# Service areas on the service pages
# ---------------------------------------------------------------------------
# The schema's areaServed has always listed Jabal Ali Industrial Area 1 & 2,
# Jabal Ali Free Zone, Dubai Industrial City and UAE-wide coverage. The only
# page that said any of it in words was the homepage, so five of the six
# service pages claimed areas in their markup that their copy never mentioned -
# the same schema/page mismatch class as the FAQ.
#
# This puts the names on the pages. The area lines are deliberately geographic
# rather than promises about service in each district: the client confirmed the
# areas, not a per-district service level, and a claim they did not make is not
# ours to publish. The lead sentence differs per page so the block is not six
# identical paragraphs.
#
# It reuses the homepage's own services_area_section / service_area_box shell,
# so it needs no new styling.
SERVICE_AREAS = [
    ("Jabal Ali Industrial Area 1 &amp; 2",
     "Factories, warehouses and business parks across both zones."),
    ("Jabal Ali Free Zone (JAFZA)",
     "One of the region\u2019s largest free zones, on Dubai\u2019s western edge."),
    ("Dubai Industrial City (DIC)",
     "Manufacturing and logistics sites in Dubai\u2019s south, with staff accommodation close by."),
    ("Across Dubai and the wider UAE",
     "Intercity runs and long-distance work beyond the emirate."),
]

AREA_LEAD = {
    "/services/school-transport-in-dubai/":
        "School routes run across Dubai. These are the areas we cover most often:",
    "/services/staff-transport-in-dubai/":
        "Staff routes are the bulk of our daily work, and these are the areas we run them in:",
    "/services/airport-transport-in-dubai/":
        "We collect from and drop to the airports from anywhere in the emirate, including:",
    "/services/hotel-transport-service-in-dubai/":
        "Guest transfers start from anywhere in Dubai. The areas we cover most often are:",
    "/services/private-car-rental-in-dubai/":
        "Private hires can start from anywhere in Dubai, including:",
    "/services/dubai-tours-transport-services/":
        "Trips set off from anywhere in Dubai, including:",
}

AREAS_TPL = """<section class="services_area_section svc_areas">
<div class="container">
<div class="row">
<div class="col-12">
<h2>Areas We Cover</h2>
<p>%(lead)s</p>
</div>
</div>
<div class="row justify-content-between g-4">
%(boxes)s</div>
<div class="row">
<div class="col-12">
<p class="svc_areas_note">Somewhere else in the UAE? Tell us the pickup point and we will confirm whether we already run a route nearby.</p>
</div>
</div>
</div>
</section>"""

AREA_BOX_TPL = """<div class="col-lg-6">
<div class="service_area_box">
<h3>%(name)s</h3>
<p>%(line)s</p>
<a href="/contact-us/" class="btn btn-secondary">Book Now</a>
</div>
</div>
"""

# ---------------------------------------------------------------------------
# Fleet capacities
# ---------------------------------------------------------------------------
# Two problems in the same six cards on /our-fleet/.
#
# 1. Every card carried the same hidden label, "12-Passenger". The theme has a
#    slot for capacity beside each vehicle name; it was filled in once, copied
#    to all six, and then hidden with `.card-body .title span { display:none }`
#    rather than corrected. So the site never stated a single seat count -
#    "seater" appeared zero times across 26,000 words - while "14 seater van
#    rental dubai" and "30 seater bus rental" are among the most common searches
#    in this category.
#
# 2. The Toyota Hiace card still held lorem ipsum, visible, beside real copy.
#
# Capacities are the client's own, from their marketing material: 7, 14 (Hiace),
# 30 (Coaster), 34, 50 and 67 (Ashok Leyland). The Executive & Standard Cars
# card gets no number - none was given for it, and a guess in a specification is
# worse than a blank.
FLEET_CARDS = {
    "SUVs & Family Cars": (
        "7 Seater",
        "Seven seats for families, luggage, or the longer drives where comfort matters.",
    ),
    "Vans & Hiace Models": (
        "14 Seater",
        "Our 14 seater Hiace vans handle medium groups, hotel shuttles and project runs.",
    ),
    "Minibuses": (
        "30 &amp; 34 Seater",
        "Available as 30 seater and 34 seater buses, both air conditioned.",
    ),
    "Full-Size Coaches": (
        "50 &amp; 67 Seater",
        "Our 50 seater and 67 seater coaches carry luggage and recline for long routes.",
    ),
    "Toyota Hiace": (
        "14 Seater",
        "Fourteen comfortable seats, air conditioning, and room to spread out. "
        "The one we send when a small group is travelling together.",
    ),
}

FLEET_CARD = re.compile(r'<div class="fleet-card.*?</a>\s*</div>\s*</div>', re.S)
FLEET_TITLE = re.compile(r'<h5 class="card-title[^"]*"[^>]*>(.*?)</h5>', re.S)
FLEET_SUB = re.compile(r'(<span class="fleet-subtitle[^"]*"[^>]*>)(.*?)(</span>)', re.S)
FLEET_BODY = re.compile(r'(<p class="card-text">)(.*?)(</p>)', re.S)
LOREM = re.compile(r"Sed ut perspiciatis[^<]*")


def fix_fleet_capacities(html):
    """Give each fleet card its real seat count, and replace the placeholder."""

    def card(m):
        block = m.group(0)
        t = FLEET_TITLE.search(block)
        title = htmlmod.unescape(t.group(1)).strip() if t else ""
        entry = FLEET_CARDS.get(title)
        if not entry:
            # no capacity supplied for this vehicle; drop the wrong label rather
            # than leave "12-Passenger" sitting there
            return FLEET_SUB.sub(lambda s: s.group(1) + s.group(3), block)

        seats, line = entry
        block = FLEET_SUB.sub(lambda s: s.group(1) + seats + s.group(3), block)

        def body(bm):
            text = bm.group(2).strip()
            if LOREM.search(text):
                return bm.group(1) + line + bm.group(3)
            return bm.group(1) + text + " " + line + bm.group(3)

        return FLEET_BODY.sub(body, block, count=1)

    return FLEET_CARD.sub(card, html)



def add_service_areas(html, path):
    """Name the service areas on a service page, above its enquiry form."""
    lead = AREA_LEAD.get(path)
    if not lead or "svc_areas" in html:
        return html

    boxes = "".join(
        AREA_BOX_TPL % {"name": name, "line": line} for name, line in SERVICE_AREAS
    )
    section = AREAS_TPL % {"lead": lead, "boxes": boxes}

    m = FINAL_NEEDBOX.search(html)
    if not m:
        return html + section
    return html[: m.start()] + section + html[m.start() :]



def add_service_form(html, path):
    """Put an enquiry form on a service page, above its closing CTA band."""
    copy = SERVICE_FORM_COPY.get(path)
    if not copy or "svc_enquiry" in html:
        return html

    eyebrow, heading, intro = copy
    section = SERVICE_FORM_TPL % {
        "eyebrow": eyebrow,
        "heading": heading,
        "intro": intro,
        "tel": TEL_DISPLAY,
        "tel_uri": TEL_URI,
    }

    # The page closes with the red "contact us today" band. The form belongs
    # just before it, so the reader meets the form while still in the service
    # copy and the band stays the page's closing note.
    m = FINAL_NEEDBOX.search(html)
    if not m:
        return html + section  # layout moved; append rather than lose the form
    return html[: m.start()] + section + html[m.start() :]


# ---------------------------------------------------------------------------
# Links that went nowhere
# ---------------------------------------------------------------------------
# Two of these render on the live site:
#
#   1. The address in the header and footer is wrapped in <a href="">, which
#      reloads the current page. It appears on all 22 routes, twice each. The
#      schema already carries a hasMap URL built from the business coordinates,
#      so the address now points at the same place - which is also the link
#      Google likes to see beside a local business's NAP block.
#
#   2. All six BOOK NOW buttons on /our-fleet/ are href="#". They are the
#      primary call to action on that page and they do nothing.
#
# A third set - LinkedIn and X icons - is href="#" but sits inside HTML
# comments, so it never renders. Left alone.
MAP_URL = "https://www.google.com/maps/search/?api=1&amp;query=25.0760224,55.2274879"

ADDRESS_LINK = re.compile(r'<a href="">(\s*<img[^>]*icon_pin_map[^>]*>)')
BOOK_NOW = re.compile(r'<a href="#"(\s+class="btn btn-danger[^"]*")>')


def fix_dead_links(html):
    """Point the address at the map and BOOK NOW at the contact page."""
    html = ADDRESS_LINK.sub(
        lambda m: '<a href="%s" target="_blank" rel="noopener">%s' % (MAP_URL, m.group(1)),
        html,
    )
    return BOOK_NOW.sub(lambda m: '<a href="/contact-us/"%s>' % m.group(1), html)



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

# Google truncates a title around 60 characters. These five ran over, and on
# three of them the part that fell off the end was the brand name. Rewritten to
# keep the head term first and land under the limit; measured lengths in
# comments so a later edit can see the budget it is working inside.
TITLE_OVERRIDES = {
    "/": "Transport Services in Dubai | Safe, Affordable Travel",          # 52
    "/about/": "About Alsinan Transport | Dubai Transport Company",        # 49
    "/services/": "Transport Services We Offer in Dubai | Alsinan",        # 46
    "/services/hotel-transport-service-in-dubai/":
        "Hotel Transport Service in Dubai | 24/7 Transfers",               # 49
    "/ride-service-for-daily-commuting-in-dubai/":
        "Daily Commuting Ride Service in Dubai",                           # 37
}


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


# ---------------------------------------------------------------------------
# FAQ schema / page mismatch
# ---------------------------------------------------------------------------
# The homepage renders nine FAQs and marks up nine FAQs, and not one of the
# eighteen strings matches. The markup was written separately from the copy, so
# it says "How can I book a vehicle with you?" where the page says "How do I
# book a vehicle?", and paraphrases every answer the same way.
#
# Google's structured data policy is that marked-up content has to be present on
# the page. Same topic, different words does not satisfy that, and a mismatch is
# what manual actions for structured data are issued over. The page copy is the
# thing people read, so the schema is rewritten to mirror it exactly rather than
# the other way round.
FAQ_SECTION = re.compile(r'<section class="faqs_section">(.*?)</section>', re.S)
FAQ_ITEM = re.compile(r"<h2[^>]*>(.*?)</h2>(.*?)(?=<h2|\Z)", re.S)
TAGS = re.compile(r"<[^>]+>")


def _text(fragment):
    return re.sub(r"\s+", " ", htmlmod.unescape(TAGS.sub(" ", fragment))).strip()


def visible_faq(content_html):
    """Return the [(question, answer)] a reader actually sees, in page order."""
    sec = FAQ_SECTION.search(content_html)
    if not sec:
        return []
    pairs = []
    for q, a in FAQ_ITEM.findall(sec.group(1)):
        question, answer = _text(q), _text(a)
        # the section's own title is an h2 too, and has no answer under it
        if question and answer:
            pairs.append((question, answer))
    return pairs


def sync_faq_schema(seo, content_html):
    """Rewrite any FAQPage block so its questions match the rendered page."""
    pairs = visible_faq(content_html)
    if not pairs:
        return seo

    def rewrite(node):
        if isinstance(node, list):
            return [rewrite(x) for x in node]
        if not isinstance(node, dict):
            return node
        if node.get("@type") == "FAQPage":
            node = dict(node)
            node["mainEntity"] = [
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": a},
                }
                for q, a in pairs
            ]
            return node
        return {k: rewrite(v) for k, v in node.items()}

    out = []
    for block in seo["jsonld"]:
        try:
            data = json.loads(block)
        except ValueError:
            out.append(block)
            continue
        out.append(json.dumps(rewrite(data), ensure_ascii=False))
    seo["jsonld"] = out
    return seo


# ---------------------------------------------------------------------------
# One business name
# ---------------------------------------------------------------------------
# The site called itself five things: "Alsinan Transportation" in the schema and
# og:site_name, "Alsinan Transport" in the page titles and footer, and
# "transportalsinan" - a URL slug, not a name - in schema legalName. The
# marketing material adds "Al Sinan Passengers Transport by Rented Buses L.L.C".
#
# Google matches a local business on the name it uses in the real world, not on
# its company registration, so a single trading name used everywhere is what
# counts. "Alsinan Transport" is the client's choice and is what the footer and
# titles already said.
#
# legalName is a different field and should hold the registered entity name. We
# do not know it yet, and a wrong value is worse than none, so it is dropped
# until the client confirms it from the documents.
BRAND = "Alsinan Transport"
BRAND_OLD = re.compile(r"Alsinan Transportation")


def fix_brand_name(text):
    return BRAND_OLD.sub(BRAND, text)


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

    if path in TITLE_OVERRIDES:
        title = TITLE_OVERRIDES[path]
        seo["title"] = title
        set_meta("og:title", title, attr="property")
        set_meta("twitter:title", title)

    if path in DESCRIPTION_OVERRIDES:
        desc = DESCRIPTION_OVERRIDES[path]
        set_meta("description", desc)
        set_meta("og:description", desc, attr="property")
        set_meta("twitter:description", desc)

    if path == CATEGORY_PATH:
        set_meta("robots", "noindex, follow, max-image-preview:large")

    # The phone is also written into meta descriptions and the schema, neither of
    # which passes through the markup pipeline where fix_phone runs.
    for m in meta:
        if "content" in m:
            if "2397" in m["content"]:
                m["content"] = TEL_TEXT.sub(TEL_DISPLAY, m["content"])
            m["content"] = fix_brand_name(m["content"])
    seo["title"] = fix_brand_name(TEL_TEXT.sub(TEL_DISPLAY, seo.get("title", "")))

    seo["jsonld"] = [fix_brand_name(fix_phone(patch_jsonld(b))) for b in seo["jsonld"]]
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
    # legalName held "transportalsinan", a slug rather than a company name.
    # Dropping it is better than publishing a wrong one; it goes back in when
    # the registered name is confirmed.
    if isinstance(node, dict) and node.get("legalName") in ("transportalsinan", ""):
        node = {k: v for k, v in node.items() if k != "legalName"}

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

# The /services/ hub had no inbound links from body copy anywhere on the site -
# only the navigation pointed at it, which tells Google nothing about what it is
# for. These phrases already appear in the existing prose, so the links read as
# sentences rather than as SEO plumbing.
HUB_PHRASES = [
    ("transport services in Dubai", "/services/"),
    ("transport services", "/services/"),
    ("rental services", "/services/"),
]

# Pages that should link up to the hub. Deliberately not /services/ itself, and
# not the blog posts, which already spend their link budget pointing at the six
# service pages - a more valuable destination than the hub.
HUB_SOURCES = {
    "/",
    "/about/",
    "/our-fleet/",
    "/services/school-transport-in-dubai/",
    "/services/staff-transport-in-dubai/",
    "/services/airport-transport-in-dubai/",
    "/services/hotel-transport-service-in-dubai/",
    "/services/private-car-rental-in-dubai/",
    "/services/dubai-tours-transport-services/",
}

# only link inside body paragraphs, never headings, links or attributes
PARA = re.compile(r"(<p\b[^>]*>)(.*?)(</p>)", re.S)


def add_internal_links(html, path, max_links=3):
    """Link the first mention of each service phrase in a page's paragraphs."""
    if path in HUB_SOURCES:
        # one link per page: the hub is worth pointing at, not worth shouting at
        return _link(html, HUB_PHRASES, max_links=1)
    if path not in BLOG_PATHS:
        return html
    return _link(html, LINK_PHRASES, max_links)


def _link(html, phrases, max_links):
    """Link the first mention of each phrase, at most max_links times."""
    used = set()
    added = [0]

    def link_paragraph(m):
        open_tag, body, close_tag = m.groups()
        if added[0] >= max_links or "<a " in body:
            return m.group(0)
        for phrase, target in phrases:
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
