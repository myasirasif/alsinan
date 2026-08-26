// Guards against the bug that broke the Vercel build: deriving a filesystem
// path from import.meta.url by string-munging the URL pathname. That works on
// Windows and silently produces a relative path on Linux, which Node then
// resolves against the cwd.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(dir, "..");

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  -- " + detail : ""}`);
};

// 1. no script may strip the leading slash off a URL pathname
const scripts = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "dist" || e.name === "dist-ssr") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mjs") || e.name.endsWith(".js")) scripts.push(p);
  }
};
walk(repo);

const offenders = scripts.filter((f) => {
  const src = fs.readFileSync(f, "utf8");
  return /import\.meta\.url[\s\S]{0,120}?pathname[\s\S]{0,60}?replace\(\s*\/\^\\?\//.test(src) ||
         /new URL\([^)]*import\.meta\.url\)\s*\.pathname\s*\.replace/.test(src);
});
check(
  "no script builds a path via pathname.replace(/^\\//)",
  offenders.length === 0,
  offenders.map((f) => path.relative(repo, f)).join(", ")
);

// 2. what that hack produced on Linux, demonstrated with a POSIX file URL.
// fileURLToPath refuses a foreign-platform URL, so compare the raw pathname,
// which is exactly what it returns on POSIX.
const posixUrl = "file:///vercel/path0/app/node_modules/vite/bin/vite.js";
const broken = new URL(posixUrl).pathname.replace(/^\//, "");
const correct = new URL(posixUrl).pathname;
check("the old approach yields a relative path on POSIX", !path.posix.isAbsolute(broken), broken);
check("the URL pathname itself is absolute on POSIX", path.posix.isAbsolute(correct), correct);

// and it still works for a Windows file URL, which is why this went unnoticed
const winPath = fileURLToPath("file:///D:/allProjects/alsinan/app/build.mjs");
check("fileURLToPath handles Windows URLs too", path.win32.isAbsolute(winPath), winPath);

// 3. the build entry must not spawn vite by path at all
const buildSrc = fs.readFileSync(path.join(dir, "build.mjs"), "utf8");
check("build.mjs uses the Vite JS API, not a spawned path",
  buildSrc.includes('from "vite"') && !buildSrc.includes("vite/bin/vite.js"));

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
