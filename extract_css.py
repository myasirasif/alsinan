# -*- coding: utf-8 -*-
"""Pull the inline <style> blocks out of the live head into real CSS files."""
import re, os, html, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from convert import rewrite_css_urls
CSS = os.path.join(ROOT, "app", "public", "assets", "css")

src = open(os.path.join(ROOT, "scrape", "home.html"), encoding="utf-8", errors="replace").read()
head = re.search(r"<head[^>]*>(.*?)</head>", src, re.S).group(1)
blocks = [html.unescape(m) for m in re.findall(r"<style[^>]*>(.*?)</style>", head, re.S)]

# blocks 0-3 load before the theme sheets, block 4 is the site's own override layer
before = rewrite_css_urls("\n\n".join(blocks[:4]))
after = rewrite_css_urls(blocks[4] if len(blocks) > 4 else "")

open(os.path.join(CSS, "wp-inline.css"), "w", encoding="utf-8").write(before)
open(os.path.join(CSS, "site-overrides.css"), "w", encoding="utf-8").write(after)
print("wp-inline.css %d bytes, site-overrides.css %d bytes" % (len(before), len(after)))
