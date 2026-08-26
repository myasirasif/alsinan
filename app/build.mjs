// Client build -> SSR build -> prerender every route to static HTML.
//
// Vite is driven through its JavaScript API rather than by spawning
// node <path-to-vite.js>. Building a filesystem path out of import.meta.url is
// where this script used to break: the Windows fix (stripping the leading slash
// from a /C:/... pathname) turns a POSIX absolute path into a relative one, so
// on Vercel the path was resolved against the cwd and doubled. There is no path
// to get wrong now.
import { build } from "vite";

// validates vercel.json and exits non-zero if Vercel would reject it
await import("./check-vercel-config.mjs");

console.log("\n> vite build (client)");
await build();

console.log("\n> vite build (ssr)");
await build({
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist-ssr",
  },
});

console.log("\n> prerender");
await import("./prerender.mjs");
