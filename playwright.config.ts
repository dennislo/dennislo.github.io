import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test-e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Each worker gets its own browser context → isolated localStorage. Safe to parallelise locally.
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.CI ? "http://localhost:9000" : "http://localhost:8000",
    trace: "on-first-retry",
    // Pin the emulated browser locale to the site's default (en-GB) so specs are
    // deterministic regardless of the host/CI runner's OS locale. Without this,
    // Chromium falls back to the runner's locale (e.g. en-US on GitHub Actions
    // Ubuntu runners), which the auto-detection feature in src/i18n/detect.ts
    // then legitimately redirects '/' away from — breaking specs that assume an
    // unprefixed en-GB root. Individual specs (e.g. locale-auto-detect.spec.ts)
    // override this per-describe via test.use({ locale: ... }) when they need
    // to exercise a different browser locale.
    locale: "en-GB",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run serve" : "npm run develop",
    url: process.env.CI ? "http://localhost:9000" : "http://localhost:8000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
