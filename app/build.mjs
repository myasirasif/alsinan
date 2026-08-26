// Client build -> SSR build -> prerender every route to static HTML.
import { execFileSync } from "node:child_process";

const run = (args) => {
  console.log(`\n> ${args.join(" ")}`);
  execFileSync(process.execPath, args, { stdio: "inherit" });
};

const vite = new URL("./node_modules/vite/bin/vite.js", import.meta.url).pathname.replace(/^\//, "");

run(["check-vercel-config.mjs"]);
run([vite, "build"]);
run([vite, "build", "--ssr", "src/entry-server.jsx", "--outDir", "dist-ssr"]);
run(["prerender.mjs"]);
