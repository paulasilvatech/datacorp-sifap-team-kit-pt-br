import { defineConfig } from "@playwright/test";

const published = new URL(process.env.SITE_URL ?? "http://127.0.0.1:4321/preview/");
const baseURL = `http://127.0.0.1:4321${published.pathname.replace(/\/?$/, "/")}`;

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 960 } } },
    { name: "mobile", use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "npm run preview -- --port 4321",
    url: `${baseURL}en/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    env: { SITE_URL: `${published.origin}${published.pathname}`, ASTRO_TELEMETRY_DISABLED: "1" },
  },
});
