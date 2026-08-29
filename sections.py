# -*- coding: utf-8 -*-
"""Lift repeated section wrappers out of the generated pages into components.

The layout of these sections is identical everywhere; only the heading and the
number of cards change. The wrapper markup therefore moves into a component and
the page keeps the content as JSX children, so what React renders stays
byte-for-byte what it rendered before.

Every matcher is strict: if a section does not have exactly the expected shape
the original JSX is returned untouched, so no content can be lost silently.
"""
import re


def _balanced(s, start, tag="div"):
    """Return the substring covering one balanced <tag>...</tag> from index start."""
    depth = 0
    for m in re.finditer(r"</?%s\b" % tag, s[start:]):
        if s[start + m.start() + 1] != "/":
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                end = s.index(">", start + m.end()) + 1
                return s[start:end]
    return None


def _find_block(s, pattern, tag="div"):
    m = re.search(pattern, s)
    if not m:
        return None, None
    body = _balanced(s, m.start(), tag)
    return body, m.start()


def _inner(block, tag):
    """Inner JSX of the first <tag ...>...</tag> in block."""
    m = re.search(r"<%s\b[^>]*>" % tag, block)
    if not m:
        return None
    whole = _balanced(block, m.start(), tag)
    if whole is None:
        return None
    return whole[m.end() - m.start():whole.rindex("</%s>" % tag)]


def _sections(src, cls):
    """Yield (start, end) for each <section className="cls..."> in src."""
    for m in re.finditer(r'<section className="%s[ "]' % cls, src):
        whole = _balanced(src, m.start(), "section")
        if whole:
            yield m.start(), m.start() + len(whole)


# --------------------------------------------------------- services_section
SERVICES_SHELL = re.compile(
    r'^<section className="(services_section[^"]*)">\s*'
    r'<div className="container">\s*'
    r'<div className="row">\s*'
    r'<div className="col-lg-6">\s*'
    r'<div className="servcies_content">\s*',
    re.S,
)


def _services_section(jsx):
    """<ServicesSection> + <ServiceBox> children, or None if the shape differs.

    Rather than trying to understand the left column, everything before the
    WhatsApp block is passed through verbatim as `heading`. An earlier version
    picked out the span and h2 by name and silently dropped a paragraph the
    homepage has between them.
    """
    shell = SERVICES_SHELL.match(jsx)
    if not shell:
        return None
    section_class = shell.group(1)

    content, c_at = _find_block(jsx, r'<div className="servcies_content">')
    if not content:
        return None
    inner = content[content.index(">") + 1:content.rindex("</div>")]

    wa, wa_at = _find_block(inner, r'<div className="whatsapp_num">')
    if not wa:
        return None
    heading = inner[:wa_at]
    # the component supplies the WhatsApp block itself, so nothing may follow it
    if inner[wa_at + len(wa):].strip():
        return None

    fields, f_at = _find_block(jsx, r'<div className="servies_fields">')
    if not fields:
        return None

    # Anything between the right column opening and servies_fields is the intro.
    # It is passed through verbatim, so it can be an h4, a paragraph or nothing.
    col_open = jsx.rindex('<div className="col-lg-6">', 0, f_at)
    intro_jsx = jsx[col_open + len('<div className="col-lg-6">'):f_at].strip()

    inner_row = re.search(r'<div className="(row[^"]*)">', fields)
    if not inner_row:
        return None
    row_class = inner_row.group(1)

    boxes = []
    for m in re.finditer(r'<div className="(col-lg-\d+)">', fields):
        col = m.group(1)
        wrapper = _balanced(fields, m.start())
        if wrapper is None:
            return None
        box_m = re.search(r'<div className="services_box">', wrapper)
        if not box_m:
            return None
        box = _balanced(wrapper, box_m.start())
        body = box[box_m.end() - box_m.start():box.rindex("</div>")]
        boxes.append((col.replace("col-lg-", ""), body.strip("\n")))

    if not boxes:
        return None

    props = []
    # some pages add utility classes to the section; keep the string verbatim
    if section_class != "services_section":
        props.append('className="%s"' % section_class)
    # the inner row is not always justify-content-center
    if row_class != "row justify-content-center":
        props.append('rowClass="%s"' % row_class)
    props.append("heading={<>%s</>}" % heading.strip("\n"))
    if intro_jsx:
        props.append("intro={<>%s</>}" % intro_jsx)

    kids = "\n".join(
        '  <ServiceBox col="%s">\n%s\n  </ServiceBox>' % (col, body) for col, body in boxes
    )
    return "<ServicesSection\n  %s>\n%s\n</ServicesSection>" % ("\n  ".join(props), kids)


# ------------------------------------------------------------------ driver
TRANSFORMS = {
    "services_section": _services_section,
}


def componentise(jsx, path=None):
    """Rewrite known sections into components. Returns (jsx, {name: count})."""
    used = {}
    for cls, fn in TRANSFORMS.items():
        # the about panel is configured per route, further down this file
        if cls == "about_section" and path not in ABOUT_PANEL:
            continue
        while True:
            spans = list(_sections(jsx, cls))
            replaced = False
            for start, end in spans:
                original = jsx[start:end]
                if original.lstrip().startswith(("<ServicesSection", "<WhyChoose", "<AboutPanel")):
                    continue
                out = (fn(original, path) if cls in ("about_section", "why_choose")
                       else fn(original))
                if out is None:
                    continue
                jsx = jsx[:start] + out + jsx[end:]
                used[cls] = used.get(cls, 0) + 1
                replaced = True
                break
            if not replaced:
                break
    return jsx, used


# -------------------------------------------------------------- why_choose
WHY_SHELL = re.compile(
    r'^<section className="(why_choose[^"]*)">\s*'
    r'<div className="container">\s*'
    r'<div className="(row[^"]*)">\s*'
    r'<div className="(col-lg-\d+)">\s*'
    r'<div className="content_why_choose">\s*',
    re.S,
)


# Per route. Sand everywhere except /about/, where the section sits directly
# under the sand About panel and two tinted bands would merge into one.
WHY_LEDGER = {"/about/": "plain"}


def _why_choose(jsx, path="/"):
    """The "why choose us" section: intro, a grid of points, and a picture pair.

    Three of the eleven uses have a different inner layout (`about_content`
    rather than `content_why_choose`); the shell regex rejects those and they
    keep their original markup.
    """
    shell = WHY_SHELL.match(jsx)
    if not shell:
        return None
    section_class, row_class, col_class = shell.groups()

    content, c_at = _find_block(jsx, r'<div className="content_why_choose">')
    if not content:
        return None
    inner = content[content.index(">") + 1:content.rindex("</div>")]

    # the points live in a nested row; everything before it is the intro
    items_row, ir_at = _find_block(inner, r'<div className="row[^"]*">')
    if not items_row:
        return None
    items_row_class = re.match(r'<div className="([^"]*)"', items_row).group(1)
    heading = inner[:ir_at]
    footer = inner[ir_at + len(items_row):].strip()

    items = []
    for m in re.finditer(r'<div className="(col-lg-\d+)">', items_row):
        wrapper = _balanced(items_row, m.start())
        if wrapper is None:
            return None
        list_m = re.search(r'<div className="choose_list">', wrapper)
        if not list_m:
            return None
        box = _balanced(wrapper, list_m.start())
        body = box[list_m.end() - list_m.start():box.rindex("</div>")]
        items.append((m.group(1).replace("col-lg-", ""), body.strip("\n")))
    if not items:
        return None

    # whatever columns follow the text column are the picture side, kept as-is
    left_col_start = jsx.rindex('<div className="%s">' % col_class, 0, c_at)
    left_col = _balanced(jsx, left_col_start)
    after = jsx[left_col_start + len(left_col):]
    media = after[:after.rindex("</div>", 0, after.rindex("</div>", 0, after.rindex("</section>")))].strip()

    props = ['variant="ledger"']
    tone = WHY_LEDGER.get(path, "sand")
    if tone != "sand":
        props.append('tone="%s"' % tone)
    if section_class != "why_choose":
        props.append('className="%s"' % section_class)
    if row_class != "row":
        props.append('rowClass="%s"' % row_class)
    if col_class != "col-lg-6":
        props.append('colClass="%s"' % col_class)
    if items_row_class != "row":
        props.append('itemsRowClass="%s"' % items_row_class)
    props.append("heading={<>%s</>}" % heading.strip("\n"))
    if footer:
        props.append("footer={<>%s</>}" % footer)
    props.append("media={<>%s</>}" % media)

    kids = "\n".join(
        '  <ChoosePoint col="%s">\n%s\n  </ChoosePoint>' % (col, body) for col, body in items
    )
    return "<WhyChoose\n  %s>\n%s\n</WhyChoose>" % ("\n  ".join(props), kids)


TRANSFORMS["why_choose"] = _why_choose


# -------------------------------------------------------------- about panel
# Per route, because the pages have different neighbours. On the homepage the
# banner's vehicle image overhangs on the right, so the panel's photograph goes
# left to avoid colliding with it. The About page has no overhang and the section
# sits mid-page, so it keeps the photograph on the right.
ABOUT_PANEL = {
    "/": {"tone": "day", "mirrored": True},
    "/about/": {"tone": "day", "mirrored": False},
}

ABOUT_SHELL = re.compile(
    r'^<section className="about_section">\s*'
    r'<div className="container">\s*'
    r'<div className="row">\s*'
    r'<div className="col-lg-6">\s*'
    r'<div className="about_img_section">',
    re.S,
)


def _about_panel(jsx, path="/"):
    """The homepage About section as a full-bleed panel.

    The copy column is handed over verbatim as children, so all five paragraphs,
    the kicker, the heading and the button survive exactly. The photo collage is
    replaced by a single full-height image, which is the point of the redesign.
    """
    if not ABOUT_SHELL.match(jsx):
        return None

    content, _ = _find_block(jsx, r'<div className="about_content">')
    if not content:
        return None
    inner = content[content.index(">") + 1:content.rindex("</div>")].strip("\n")

    # the two pages use different photographs, so it travels as a prop
    big = re.search(r'<div className="about_lg_img">\s*<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"', jsx)
    if not big:
        big = re.search(r'<div className="about_lg_img">\s*<img[^>]*src="([^"]*)"', jsx)
    if not big:
        return None
    image, alt = big.group(1), (big.group(2) if big.lastindex and big.lastindex > 1 else "")

    cfg = ABOUT_PANEL.get(path, {})
    props = ['image="%s"' % image]
    if alt:
        props.append('alt="%s"' % alt)
    if cfg.get("tone", "day") != "day":
        props.append('tone="%s"' % cfg["tone"])
    if cfg.get("mirrored"):
        props.append("mirrored")
    head = "<AboutPanel\n  %s>" % "\n  ".join(props)

    return (
        '%s\n  <div className="about_content">\n%s\n  </div>\n</AboutPanel>'
        % (head, inner)
    )


TRANSFORMS["about_section"] = _about_panel
