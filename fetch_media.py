# -*- coding: utf-8 -*-
"""Download every wp-content asset the site references into app/public/wp-content."""
import os, re, sys, glob, urllib.request, urllib.error, concurrent.futures

ROOT = os.path.dirname(os.path.abspath(__file__))
LIVE = "https://alsinantransport.com"
DEST = os.path.join(ROOT, "app", "public")

# any /wp-content/... reference, absolute or root-relative, in HTML or CSS
PAT = re.compile(r"(?:https?://alsinantransport\.com|https?://alsinan-2026\.local)?/?"
                 r"(wp-content/uploads/[^\s\"'\)\\<>]+)")

BAD_TAIL = re.compile(r"(&amp;|&#\d+;|\\).*$")


def collect():
    urls = set()
    sources = glob.glob(os.path.join(ROOT, "scrape", "*.html"))
    sources += glob.glob(os.path.join(DEST, "assets", "css", "*.css"))
    for path in sources:
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
        for m in PAT.findall(text):
            m = BAD_TAIL.sub("", m)
            m = m.rstrip(".,;")
            if m:
                urls.add(m)
    return sorted(urls)


def fetch(rel):
    out = os.path.join(DEST, rel.replace("/", os.sep))
    if os.path.exists(out) and os.path.getsize(out) > 0:
        return ("skip", rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    url = LIVE + "/" + rel
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(out, "wb") as f:
            f.write(data)
        return ("ok", rel)
    except Exception as e:
        return ("fail:%s" % getattr(e, "code", e), rel)


def main():
    urls = collect()
    print("found %d media references" % len(urls))
    results = {"ok": 0, "skip": 0}
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for status, rel in pool.map(fetch, urls):
            if status.startswith("fail"):
                failures.append((status, rel))
            else:
                results[status] = results.get(status, 0) + 1
    print("downloaded %d, already present %d, failed %d"
          % (results.get("ok", 0), results.get("skip", 0), len(failures)))
    for s, rel in failures:
        print("  %s  %s" % (s, rel))


if __name__ == "__main__":
    main()
