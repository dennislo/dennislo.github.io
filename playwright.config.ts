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
