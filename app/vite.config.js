import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  ssr: {
    // ships as CommonJS, so bundle it rather than leaving it external
    noExternal: ["react-helmet-async"],
  },
  build: {
    // the pages are static markup; one big chunk is expected here
    chunkSizeWarningLimit: 1200,
  },
});
