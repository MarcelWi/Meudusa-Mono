// vite.config.ts - Korrigiert
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths()
  ],
  css: {
    postcss: false // PostCSS explizit deaktivieren
  },
  // ✅ Für bessere SSR + Client Hydration
  optimizeDeps: {
    include: ["@tanstack/react-query"]
  }
});
