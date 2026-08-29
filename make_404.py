# -*- coding: utf-8 -*-
"""Generate the NotFound page from the live 404 response."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import read, body_parts, indent
from fixes import BRAND
from convert import html_to_jsx

ROOT = os.path.dirname(os.path.abspath(__file__))
html = read("notfound")
parts = body_parts(html)
jsx, _, _ = html_to_jsx(parts["content"])

tpl = '''import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page not found | BRAND_NAME</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
%s
    </>
  );
}
'''

out = os.path.join(ROOT, "app", "src", "pages", "NotFound.jsx")
open(out, "w", encoding="utf-8").write(
    (tpl % indent(jsx.strip(), "      ")).replace("BRAND_NAME", BRAND))
print("wrote NotFound.jsx (%d chars)" % len(jsx))
