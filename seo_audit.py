# -*- coding: utf-8 -*-
"""Audit the scraped live pages and report concrete SEO facts."""
import os, re, json, sys, html as htmlmod
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from build import read, extract_head, body_parts, PAGES


def text_of(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", h, flags=re.S)
    return re.sub(r"<[^>]+>", " ", h)


rows = []
for path, name in PAGES:
    raw = read(name)
    seo = extract_head(raw)
    parts = body_parts(raw)
    content = parts["content"]
    meta = {m.get("name") or m.get("property"): m["content"] for m in seo["meta"]}

    heads = {}
    for lvl in range(1, 5):
        heads[lvl] = [htmlmod.unescape(re.sub(r"<[^>]+>", "", m)).strip()
                      for m in re.findall(r"<h%d[^>]*>(.*?)</h%d>" % (lvl, lvl), content, re.S)]

    imgs = re.findall(r"<img\b[^>]*>", content)
    no_alt = [i for i in imgs if not re.search(r'\balt="[^"]+"', i)]

    links = re.findall(r'<a\b[^>]*href="([^"]*)"', content)
    internal = [l for l in links if "alsinantransport.com" in l or l.startswith("/")]
    external = [l for l in links if l.startswith("http") and "alsinantransport.com" not in l]
    nofollow = len(re.findall(r'rel="[^"]*nofollow', content))

    schema_types = []
    for block in seo["jsonld"]:
        try:
            data = json.loads(block)
        except Exception:
            continue
        graph = data.get("@graph", [data])
        for node in graph:
            t = node.get("@type")
            if isinstance(t, list):
                schema_types.extend(t)
            elif t:
                schema_types.append(t)

    words = len(text_of(content).split())

    rows.append({
        "path": path,
        "title": seo["title"],
        "tlen": len(seo["title"]),
        "desc": meta.get("description", ""),
        "dlen": len(meta.get("description", "")),
        "robots": meta.get("robots", ""),
        "canonical": seo["canonical"],
        "ogtype": meta.get("og:type", ""),
        "h1": heads[1],
        "h2": len(heads[2]),
        "h3": len(heads[3]),
        "imgs": len(imgs),
        "no_alt": len(no_alt),
        "words": words,
        "int_links": len(internal),
        "ext_links": len(external),
        "nofollow": nofollow,
        "schema": schema_types,
    })

print("=" * 100)
print("%-58s %5s %5s %4s %4s %4s %5s %5s" % ("PATH", "TITLE", "DESC", "H1", "H2", "IMG", "NOALT", "WORDS"))
print("=" * 100)
for r in rows:
    print("%-58s %5d %5d %4d %4d %4d %5d %5d"
          % (r["path"][:58], r["tlen"], r["dlen"], len(r["h1"]), r["h2"], r["imgs"], r["no_alt"], r["words"]))

print("\n--- TITLE LENGTH ISSUES (ideal 30-60) ---")
for r in rows:
    if r["tlen"] > 60 or r["tlen"] < 30:
        print("  %-56s %3d  %s" % (r["path"][:56], r["tlen"], r["title"][:70]))

print("\n--- DESCRIPTION LENGTH ISSUES (ideal 120-158) ---")
for r in rows:
    if r["dlen"] == 0 or r["dlen"] > 160 or r["dlen"] < 110:
        print("  %-56s %3d" % (r["path"][:56], r["dlen"]))

print("\n--- H1 PROBLEMS ---")
h1seen = Counter()
for r in rows:
    for h in r["h1"]:
        h1seen[h] += 1
    if len(r["h1"]) != 1:
        print("  %-56s h1 count = %d  %s" % (r["path"][:56], len(r["h1"]), r["h1"][:2]))
dupe_h1 = {h: c for h, c in h1seen.items() if c > 1}
if dupe_h1:
    print("  duplicate H1 text across pages:")
    for h, c in dupe_h1.items():
        print("    x%d  %s" % (c, h[:80]))

print("\n--- DUPLICATE TITLES / DESCRIPTIONS ---")
for key in ("title", "desc"):
    c = Counter(r[key] for r in rows if r[key])
    for val, n in c.items():
        if n > 1:
            print("  %s x%d: %s" % (key, n, val[:80]))

print("\n--- CANONICAL / ROBOTS ---")
for r in rows:
    expected = "https://alsinantransport.com" + r["path"]
    if r["canonical"] != expected:
        print("  %-56s canonical=%s" % (r["path"][:56], r["canonical"]))
    if "noindex" in r["robots"]:
        print("  %-56s NOINDEX" % r["path"][:56])
    if not r["robots"]:
        print("  %-56s no robots meta" % r["path"][:56])

print("\n--- OG:TYPE ---")
print("  " + json.dumps(Counter(r["ogtype"] for r in rows)))

print("\n--- SCHEMA TYPES IN USE ---")
allschema = Counter()
for r in rows:
    allschema.update(set(r["schema"]))
for t, n in allschema.most_common():
    print("  %-28s on %d pages" % (t, n))
print("  pages with NO schema: %s" % [r["path"] for r in rows if not r["schema"]])

print("\n--- IMAGE ALT COVERAGE ---")
ti = sum(r["imgs"] for r in rows)
tn = sum(r["no_alt"] for r in rows)
print("  %d images, %d missing alt (%.1f%% covered)" % (ti, tn, 100 * (ti - tn) / ti if ti else 0))
for r in rows:
    if r["no_alt"]:
        print("    %-56s %d missing" % (r["path"][:56], r["no_alt"]))

print("\n--- THIN CONTENT (<300 words) ---")
for r in rows:
    if r["words"] < 300:
        print("  %-56s %d words" % (r["path"][:56], r["words"]))

print("\n--- INTERNAL LINKING ---")
for r in rows:
    print("  %-56s internal=%-4d external=%-3d nofollow=%d"
          % (r["path"][:56], r["int_links"], r["ext_links"], r["nofollow"]))
