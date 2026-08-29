# -*- coding: utf-8 -*-
"""Content audit: what the pages actually say, and how that reads for Dubai search."""
import os, re, sys, glob, collections, html as htmlmod

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "app", "dist")

STOP = set("""a an the and or but if of to in on for with at by from as is are was were be been
being it its this that these those we our you your they their he she i not no do does did have
has had will would can could should may might must so than then there here when where which who
whom what how why all any both each few more most other some such only own same too very just
about into over under again further once because while during before after above below up down out
off own s t don now""".split())


def text_of(html):
    body = html[html.find("<body"):]
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", body, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return re.sub(r"\s+", " ", htmlmod.unescape(body)).strip()


def route_of(path):
    rel = os.path.relpath(os.path.dirname(path), DIST).replace("\\", "/")
    return "/" if rel == "." else "/" + rel + "/"


pages = {}
for f in glob.glob(os.path.join(DIST, "**", "index.html"), recursive=True):
    raw = open(f, encoding="utf-8", errors="replace").read()
    r = route_of(f)
    if r == "/category/cars/":
        continue
    pages[r] = {"raw": raw, "text": text_of(raw)}

# the header and footer repeat on every page; strip them so counts mean something
nav_words = None
for p in pages.values():
    words = p["text"].split()
    nav_words = set(words) if nav_words is None else nav_words

print("=" * 92)
print("%-56s %6s %6s %6s" % ("PAGE", "WORDS", "H2", "H3"))
print("=" * 92)
for r, p in sorted(pages.items()):
    print("%-56s %6d %6d %6d" % (
        r[:56], len(p["text"].split()),
        len(re.findall(r"<h2", p["raw"])), len(re.findall(r"<h3", p["raw"]))))

# ---- what each page is actually about, by its own most distinctive words ----
print("\n" + "=" * 92)
print("DISTINCTIVE TERMS PER PAGE (words this page uses far more than the others)")
print("=" * 92)
tf = {}
for r, p in pages.items():
    words = [w.strip(".,!?;:\"'()").lower() for w in p["text"].split()]
    words = [w for w in words if len(w) > 3 and w not in STOP and not w.isdigit()]
    tf[r] = collections.Counter(words)
df = collections.Counter()
for c in tf.values():
    df.update(set(c))
n = len(pages)
for r in sorted(tf):
    scored = [(cnt * (n / df[w]), w, cnt) for w, cnt in tf[r].items() if cnt >= 3]
    scored.sort(reverse=True)
    top = ", ".join("%s(%d)" % (w, c) for _, w, c in scored[:8])
    print("  %-46s %s" % (r[:46], top))

# ---- the commercial phrases, and where they land ----
print("\n" + "=" * 92)
print("COMMERCIAL PHRASE COVERAGE")
print("=" * 92)
phrases = [
    "transport services in dubai", "rental transport in dubai",
    "transport rental services in dubai", "bus rental in dubai",
    "car rental in dubai", "hiace van for rent", "minibus hire with driver",
    "school bus rental", "staff transport", "airport transfer", "hotel transport",
    "chauffeur", "with driver", "monthly", "coach",
]
for ph in phrases:
    hits = {r: p["text"].lower().count(ph) for r, p in pages.items() if ph in p["text"].lower()}
    total = sum(hits.values())
    where = sorted(hits, key=lambda k: -hits[k])[:3]
    flag = "  <-- nowhere" if total == 0 else ""
    print("  %-38s %3d uses across %2d pages   %s%s" % (
        ph, total, len(hits), ", ".join(w[:28] for w in where), flag))

# ---- Dubai geography: does the site say where it works? ----
print("\n" + "=" * 92)
print("LOCAL SIGNALS - places named in the copy")
print("=" * 92)
places = ["dubai", "abu dhabi", "sharjah", "uae", "bur dubai", "jabal ali", "jebel ali",
          "internet city", "marina", "deira", "downtown", "business bay", "silicon oasis",
          "al quoz", "dip", "jlt", "barsha", "expo", "sheikh zayed"]
for pl in places:
    hits = {r: p["text"].lower().count(pl) for r, p in pages.items() if pl in p["text"].lower()}
    total = sum(hits.values())
    mark = "" if total else "   <-- never mentioned"
    print("  %-22s %3d uses across %2d pages%s" % (pl, total, len(hits), mark))

# ---- overlap: are the service pages saying the same thing? ----
print("\n" + "=" * 92)
print("OVERLAP BETWEEN SERVICE PAGES (shared vocabulary, higher = more alike)")
print("=" * 92)
svc = sorted(r for r in pages if r.startswith("/services/"))
def sig(r):
    return set(w for w, c in tf[r].items() if c >= 2)
for i, a in enumerate(svc):
    for bq in svc[i + 1:]:
        A, B = sig(a), sig(bq)
        j = len(A & B) / len(A | B) if A | B else 0
        if j > 0.30:
            print("  %.0f%%  %s  vs  %s" % (j * 100, a.split("/")[2][:30], bq.split("/")[2][:30]))
