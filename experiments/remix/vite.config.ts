import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dns from 'node:dns';

// This may help with localhost resolution issues in some environments
dns.setDefaultResultOrder('verbatim');
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  css: {
    postcss: false as const // PostCSS explizit deaktivieren
  },
});
