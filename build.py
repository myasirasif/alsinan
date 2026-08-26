# -*- coding: utf-8 -*-
"""Generate the React replica from the scraped WordPress HTML."""
import re, os, json, sys, html as htmlmod
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from convert import html_to_jsx, abs_url
from fixes import fix_alts, patch_seo, add_internal_links

ROOT = os.path.dirname(os.path.abspath(__file__))
SCRAPE = os.path.join(ROOT, "scrape")
APP = os.path.join(ROOT, "app")
SRC = os.path.join(APP, "src")
LIVE = "https://alsinantransport.com"

PAGES = []
for line in open(os.path.join(ROOT, "urls.txt"), encoding="utf-8"):
    line = line.strip()
    if not line:
        continue
    path, name = line.split("|")
    PAGES.append((path, name))

# name -> React component name
def comp_name(name):
    parts = re.split(r"[-_]", name)
    return "".join(p[:1].upper() + p[1:] for p in parts if p)

SKIP_META_NAMES = {"viewport", "generator", "msapplication-TileImage"}


def read(name):
    with open(os.path.join(SCRAPE, name + ".html"), encoding="utf-8", errors="replace") as f:
        return f.read()


def extract_head(html):
    head = re.search(r"<head[^>]*>(.*?)</head>", html, re.S).group(1)
    seo = {}
    t = re.search(r"<title>(.*?)</title>", head, re.S)
    # Helmet writes these as text nodes, so decode the entities WordPress emitted
    seo["title"] = htmlmod.unescape(t.group(1).strip()) if t else ""
    metas = []
    for m in re.findall(r"<meta\b[^>]*>", head):
        nm = re.search(r'\bname=["\']([^"\']+)["\']', m)
        pr = re.search(r'\bproperty=["\']([^"\']+)["\']', m)
        ct = re.search(r'\bcontent=["\']([^"\']*)["\']', m, re.S)
        if not ct:
            continue
        if nm and nm.group(1) in SKIP_META_NAMES:
            continue
        content = htmlmod.unescape(ct.group(1))
        if nm:
            metas.append({"name": nm.group(1), "content": content})
        elif pr:
            metas.append({"property": pr.group(1), "content": content})
    seo["meta"] = metas
    can = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', head)
    seo["canonical"] = can.group(1) if can else ""
    seo["jsonld"] = [s.strip() for s in re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', head, re.S) if s.strip()]
    return seo


# the theme wraps its custom-logo link in a second <a href="/">, which is invalid
# HTML and makes React complain about nested anchors
NESTED_LOGO = re.compile(r'<a href="/">\s*(<a [^>]*class="custom-logo-link".*?</a>)\s*</a>', re.S)


def unnest_logo(html):
    return NESTED_LOGO.sub(lambda m: m.group(1), html)


LD_IN_BODY = re.compile(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.S)


def split_jsonld(html):
    """Pull page-specific JSON-LD out of the shared header markup.

    The homepage injects its FAQPage schema inside header.php; leaving it in the
    shared Header component would publish it on every route.
    """
    blocks = [b.strip() for b in LD_IN_BODY.findall(html) if b.strip()]
    return LD_IN_BODY.sub("", html), blocks


def body_parts(html):
    bstart = re.search(r"<body[^>]*>", html)
    body = html[bstart.end():]
    bodyclass = re.search(r'<body[^>]*class="([^"]*)"', html)
    hstart = body.find('<div class="header_top">')
    if hstart == -1:
        hstart = body.find('<header id="masthead"')
    hend = body.find("</header>") + len("</header>")
    header = body[hstart:hend]
    fm = re.search(r'<footer id="colophon".*?</footer>', body, re.S)
    footer = fm.group(0)
    content = body[hend:fm.start()]
    tail = body[fm.end():]
    return {
        "bodyclass": bodyclass.group(1) if bodyclass else "",
        "header": fix_alts(unnest_logo(header)),
        "content": fix_alts(content),
        "footer": fix_alts(unnest_logo(footer)),
        "tail": tail,
    }


# The Contact Form 7 markup has no backend now, so swap the whole <form> for our
# own component. The wrapping div.wpcf7 stays, because the theme CSS targets it.
CF7_FORM = re.compile(r'<form\b[^>]*class="wpcf7-form[^"]*"[^>]*>.*?</form>', re.S)


def replace_forms(html):
    """Return (html, variants) with each CF7 form swapped for a placeholder tag."""
    variants = []

    def repl(m):
        # the contact page splits first/last name across two columns
        variant = "contact" if 'data-name="text-lname"' in m.group(0) else "compact"
        variants.append(variant)
        return '<contactform variant="%s"></contactform>' % variant

    return CF7_FORM.sub(repl, html), variants


CORE_SCRIPT_MARKERS = ("_wpemojiSettings", "wp.i18n.setLocaleData", "wpcf7 =", "wpcf7_recaptcha",
                       "prefetch", "googletagmanager", "dataLayer.push", "gtag(")


def page_scripts(tail, content):
    """Inline jQuery/theme scripts that must run after the page mounts."""
    out = []
    for chunk in (content, tail):
        for s in re.findall(r"<script(?![^>]*\ssrc=)[^>]*>(.*?)</script>", chunk, re.S):
            t = s.strip()
            if not t:
                continue
            if "schema.org" in t or t.startswith("{"):
                continue
            if any(mk in t for mk in CORE_SCRIPT_MARKERS):
                continue
            out.append(t)
    return out


# ---------------------------------------------------------------- header nav
MENU_LI = re.compile(
    r'(<li id="menu-item-\d+" className=)("(?:[^"\\]|\\.)*")(>\s*<Link to=)("(?:[^"\\]|\\.)*")')


def make_header_jsx(header_html):
    jsx, _, _ = html_to_jsx(header_html)

    def repl(m):
        cls = json.loads(m.group(2))
        # drop WP's server-rendered active-state classes; mi() re-adds them per route
        cls = " ".join(c for c in cls.split()
                       if not c.startswith(("current-", "current_", "page-item-", "page_item")))
        return "%s{mi(%s, %s)}%s%s" % (m.group(1), json.dumps(cls), m.group(4), m.group(3), m.group(4))

    return MENU_LI.sub(repl, jsx)


HEADER_TPL = '''import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const here = pathname.endsWith("/") ? pathname : pathname + "/";

  // Rebuilds the active-state classes WordPress renders server-side.
  const mi = (base, to) => {
    const target = to.endsWith("/") ? to : to + "/";
    if (here === target) return base + " current-menu-item current_page_item";
    if (target !== "/" && here.startsWith(target)) return base + " current-menu-ancestor current-menu-parent";
    return base;
  };

  return (
    <>
%s
    </>
  );
}
'''

FOOTER_TPL = '''import { Link } from "react-router-dom";

export default function Footer() {
  return (
%s
  );
}
'''

PAGE_TPL = '''import { Link } from "react-router-dom";
import Seo from "../components/Seo";%(form_import)s
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function %(comp)s() {
  useThemeScripts(%(scripts)s);

  return (
    <>
      <Seo {...seo[%(key)s]} />
%(body)s
    </>
  );
}
'''


def indent(text, pad="      "):
    return "\n".join((pad + ln) if ln.strip() else ln for ln in text.split("\n"))


def main():
    os.makedirs(os.path.join(SRC, "pages"), exist_ok=True)
    os.makedirs(os.path.join(SRC, "components"), exist_ok=True)
    os.makedirs(os.path.join(SRC, "hooks"), exist_ok=True)
    os.makedirs(os.path.join(SRC, "data"), exist_ok=True)

    seo_map = {}
    routes = []
    header_done = footer_done = False

    for path, name in PAGES:
        html = read(name)
        seo = extract_head(html)
        parts = body_parts(html)
        parts["header"], header_ld = split_jsonld(parts["header"])
        seo["jsonld"].extend(header_ld)
        seo_map[path] = patch_seo(path, seo)
        parts["content"] = add_internal_links(parts["content"], path)
        parts["content"], form_variants = replace_forms(parts["content"])

        if not header_done:
            hj = make_header_jsx(parts["header"])
            with open(os.path.join(SRC, "components", "Header.jsx"), "w", encoding="utf-8") as f:
                f.write(HEADER_TPL % indent(hj.strip(), "      "))
            header_done = True
        if not footer_done:
            fj, _, _ = html_to_jsx(parts["footer"])
            with open(os.path.join(SRC, "components", "Footer.jsx"), "w", encoding="utf-8") as f:
                f.write(FOOTER_TPL % indent(fj.strip(), "    "))
            footer_done = True

        body_jsx, _, _ = html_to_jsx(parts["content"])
        body_jsx = re.sub(r'<contactform variant="(\w+)"></contactform>',
                          lambda m: '<ContactForm variant="%s" />' % m.group(1), body_jsx)
        scripts = page_scripts(parts["tail"], parts["content"])
        comp = comp_name(name)
        code = PAGE_TPL % {
            "comp": comp,
            "key": json.dumps(path),
            "scripts": json.dumps(scripts, ensure_ascii=False),
            "form_import": ('\nimport ContactForm from "../components/ContactForm";'
                            if form_variants else ""),
            "body": indent(body_jsx.strip(), "      "),
        }
        with open(os.path.join(SRC, "pages", comp + ".jsx"), "w", encoding="utf-8") as f:
            f.write(code)
        routes.append((path, comp, parts["bodyclass"]))

    with open(os.path.join(SRC, "data", "seo.js"), "w", encoding="utf-8") as f:
        f.write("// Extracted verbatim from the live WordPress site (Rank Math output).\n")
        f.write("export const seo = " + json.dumps(seo_map, indent=2, ensure_ascii=False) + ";\n")

    body_classes = {p: bc for p, comp, bc in routes}
    with open(os.path.join(SRC, "data", "bodyClasses.js"), "w", encoding="utf-8") as f:
        f.write("export const bodyClasses = " + json.dumps(body_classes, indent=2) + ";\n")

    # static imports: renderToString cannot resolve React.lazy during prerendering
    imports = "\n".join('import %s from "./pages/%s";' % (c, c) for p, c, b in routes)
    route_els = "\n".join('        <Route path=%s element={<%s />} />' % (json.dumps(p), c)
                          for p, c, b in routes)
    app = APP_TPL % {"imports": imports, "routes": route_els}
    with open(os.path.join(SRC, "App.jsx"), "w", encoding="utf-8") as f:
        f.write(app)

    print("generated %d pages" % len(routes))


APP_TPL = '''import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import { bodyClasses } from "./data/bodyClasses";
%(imports)s

function BodyClass() {
  const { pathname } = useLocation();
  useEffect(() => {
    const key = pathname.endsWith("/") ? pathname : pathname + "/";
    document.body.className = bodyClasses[key] || "";
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// WordPress fired a real pageview per navigation; in a SPA only the first one
// happens on its own, so push a virtual pageview for every route change after it.
function TrackPageViews() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_pageview",
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div id="page" className="site">
      <BodyClass />
      <ScrollToTop />
      <TrackPageViews />
      <a className="skip-link screen-reader-text" href="#primary">Skip to content</a>
      <Header />
      <Routes>
%(routes)s
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
'''

if __name__ == "__main__":
    main()
