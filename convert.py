# -*- coding: utf-8 -*-
"""HTML -> JSX converter for the Alsinan WordPress replica."""
import re, json
from html.parser import HTMLParser
from fixes import swap_image

LIVE = "https://alsinantransport.com"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "colspan": "colSpan", "rowspan": "rowSpan", "maxlength": "maxLength",
    "minlength": "minLength", "autocomplete": "autoComplete", "autofocus": "autoFocus",
    "autoplay": "autoPlay", "readonly": "readOnly", "novalidate": "noValidate",
    "frameborder": "frameBorder", "allowfullscreen": "allowFullScreen",
    "contenteditable": "contentEditable", "spellcheck": "spellCheck",
    "crossorigin": "crossOrigin", "charset": "charSet", "http-equiv": "httpEquiv",
    "accept-charset": "acceptCharset", "usemap": "useMap", "datetime": "dateTime",
    "itemprop": "itemProp", "itemscope": "itemScope", "itemtype": "itemType",
    "srcset": "srcSet", "enctype": "encType", "formaction": "formAction",
    "srclang": "srcLang", "hreflang": "hrefLang", "marginwidth": "marginWidth",
    "marginheight": "marginHeight", "cellpadding": "cellPadding",
    "cellspacing": "cellSpacing", "playsinline": "playsInline",
    "referrerpolicy": "referrerPolicy", "nomodule": "noModule",
    "fetchpriority": "fetchPriority", "decoding": "decoding", "loading": "loading",
}

BOOL_ATTRS = {"disabled", "checked", "readOnly", "required", "autoFocus", "autoPlay",
              "controls", "loop", "muted", "multiple", "selected", "noValidate",
              "allowFullScreen", "itemScope", "noModule", "async", "defer", "open",
              "hidden", "playsInline"}

URL_ATTRS = ("src", "href", "poster", "data-src", "data-bg", "action")
SRCSET_ATTRS = ("srcset", "data-srcset", "imagesrcset")


def css_to_obj(style):
    out = []
    for decl in style.split(";"):
        if ":" not in decl:
            continue
        p, v = decl.split(":", 1)
        p, v = p.strip(), rewrite_css_urls(v.strip())
        if not p:
            continue
        if p.startswith("--"):
            key = "'%s'" % p
        else:
            key = re.sub(r"-([a-zA-Z])", lambda m: m.group(1).upper(), p)
            if not re.match(r"^[A-Za-z_$][\w$]*$", key):
                key = "'%s'" % key
        out.append("%s: %s" % (key, json.dumps(v)))
    return "{{ %s }}" % ", ".join(out) if out else "{{}}"


def abs_url(u):
    """Serve wp-content from our own public/ folder, whatever form the source used."""
    if not u:
        return u
    s = u.strip()
    for prefix in ("https://alsinantransport.com", "http://alsinantransport.com",
                   "https://alsinan-2026.local", "http://alsinan-2026.local"):
        if s.startswith(prefix):
            s = s[len(prefix):]
            break
    if s.startswith("./"):
        s = s[1:]
    if s.startswith(("/wp-content", "/wp-includes")):
        return swap_image(s)
    # the theme also emits root-relative paths without the leading slash
    if s.startswith(("wp-content/", "wp-includes/")):
        return swap_image("/" + s)
    return u


def rewrite_css_urls(css):
    """Normalise every wp-content url() to a root-relative path we serve ourselves."""
    return re.sub(r"url\((\s*['\"]?)(?:https?://alsinantransport\.com|https?://alsinan-2026\.local)?/?"
                  r"(wp-(?:content|includes)/[^'\")]+)",
                  lambda m: "url(%s%s" % (m.group(1), swap_image("/" + m.group(2))), css or "")


def abs_srcset(s):
    parts = []
    for item in (s or "").split(","):
        item = item.strip()
        if not item:
            continue
        bits = item.split(None, 1)
        bits[0] = abs_url(bits[0])
        parts.append(" ".join(bits))
    return ", ".join(parts)


def internal_path(href):
    """Return the router path when href points at an internal page, else None."""
    if not href:
        return None
    h = href.strip()
    if h.startswith(LIVE):
        h = h[len(LIVE):] or "/"
    elif h.startswith("http://alsinan-2026.local"):
        h = h[len("http://alsinan-2026.local"):] or "/"
    elif h.startswith(("http", "mailto:", "tel:", "#", "javascript:")):
        return None
    if not h.startswith("/"):
        return None
    if h.startswith(("/wp-content", "/wp-includes", "/wp-json", "/feed", "/xmlrpc")):
        return None
    if re.search(r"\.(php|xml|jpe?g|png|svg|webp|gif|pdf|css|js)($|\?)", h, re.I):
        return None
    return h


def esc_text(t):
    # single pass, so the braces we introduce are not re-escaped
    return re.sub(r"[{}]", lambda m: "{'%s'}" % m.group(0), t)


class JSXConverter(HTMLParser):
    def __init__(self, use_link=True):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.stack = []
        self.use_link = use_link
        self.uses_link = False
        self.raw_mode = None
        self.raw_attrs = None
        self.raw_buf = []
        self.scripts = []

    def emit(self, s):
        self.out.append(s)

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.raw_mode = tag
            self.raw_attrs = dict(attrs)
            self.raw_buf = []
            return
        d = {}
        for k, v in attrs:
            d[k] = v
        comp = tag
        if tag == "a" and self.use_link:
            p = internal_path(d.get("href"))
            if p is not None:
                comp = "Link"
                d.pop("href", None)
                d.pop("aria-current", None)
                d["to"] = p
                self.uses_link = True
        parts = []
        for k, v in d.items():
            lk = k.lower()
            if lk in URL_ATTRS:
                v = abs_url(v)
            elif lk in SRCSET_ATTRS:
                v = abs_srcset(v)
            elif lk == "style":
                parts.append("style=" + css_to_obj(v or ""))
                continue
            name = ATTR_MAP.get(lk, lk)
            # these fields have no change handler, so React wants the uncontrolled form
            if lk == "value" and tag in ("input", "textarea"):
                name = "defaultValue"
            elif lk == "checked" and tag == "input":
                name = "defaultChecked"
            if not re.match(r"^[A-Za-z_][-A-Za-z0-9_:.]*$", name):
                continue
            if v is None:
                parts.append(name if name in BOOL_ATTRS else '%s=""' % name)
            else:
                parts.append("%s=%s" % (name, json.dumps(v)))
        attr_s = (" " + " ".join(parts)) if parts else ""
        if tag in VOID:
            self.emit("<%s%s />" % (comp, attr_s))
        else:
            self.emit("<%s%s>" % (comp, attr_s))
            self.stack.append((tag, comp))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack and self.stack[-1][0] == tag:
            t, comp = self.stack.pop()
            self.emit("</%s>" % comp)

    def handle_endtag(self, tag):
        if self.raw_mode == tag:
            raw = "".join(self.raw_buf)
            a = self.raw_attrs or {}
            if tag == "style":
                self.emit("<style dangerouslySetInnerHTML={{ __html: %s }} />" % json.dumps(rewrite_css_urls(raw)))
            else:
                t = (a.get("type") or "").lower()
                if t == "application/ld+json":
                    self.emit('<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: %s }} />' % json.dumps(raw))
                elif "src" not in a and raw.strip() and t in ("", "text/javascript"):
                    self.scripts.append(raw)
            self.raw_mode = None
            self.raw_buf = []
            self.raw_attrs = None
            return
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                while len(self.stack) > i:
                    t, comp = self.stack.pop()
                    self.emit("</%s>" % comp)
                return

    def handle_data(self, data):
        if self.raw_mode:
            self.raw_buf.append(data)
            return
        if data.strip() == "" and "\n" in data:
            self.emit("\n")
            return
        self.emit(esc_text(data))

    def handle_entityref(self, name):
        if self.raw_mode:
            self.raw_buf.append("&%s;" % name)
            return
        self.emit("&%s;" % name)

    def handle_charref(self, name):
        if self.raw_mode:
            self.raw_buf.append("&#%s;" % name)
            return
        self.emit("&#%s;" % name)

    def handle_comment(self, data):
        if self.raw_mode:
            self.raw_buf.append("<!--%s-->" % data)

    def result(self):
        while self.stack:
            t, comp = self.stack.pop()
            self.emit("</%s>" % comp)
        return "".join(self.out)


def html_to_jsx(html, use_link=True):
    c = JSXConverter(use_link=use_link)
    c.feed(html)
    return c.result(), c.uses_link, c.scripts
