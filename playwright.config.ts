import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", forbidOnly: Boolean(process.env.CI), retries: 0, workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:43144", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: [
    { command: "node scripts/catalogue-fixture.mjs", url: "http://127.0.0.1:43145", reuseExistingServer: false },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 43144",
      url: "http://127.0.0.1:43144", reuseExistingServer: false, timeout: 60_000,
      env: { CLEARPROOF_CONTENT_URL: "http://127.0.0.1:43145" },
    },
  ],
});
