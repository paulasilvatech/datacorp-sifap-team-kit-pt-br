import { defineConfig } from "astro/config";
import react from "@astrojs/react";

if (process.env.GITHUB_ACTIONS === "true" && !process.env.SITE_URL) {
  throw new Error("SITE_URL must come from the verified GitHub Pages configuration.");
}

const url = new URL(process.env.SITE_URL ?? "http://127.0.0.1:4321/");
if (!["http:", "https:"].includes(url.protocol)) {
  throw new Error("SITE_URL must be an HTTP or HTTPS URL.");
}

export default defineConfig({
  integrations: [react()],
  site: url.origin,
  base: url.pathname,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
});
