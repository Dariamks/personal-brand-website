import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "pnpm preview",
    port: 4321,
    timeout: 30_000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:4321",
    locale: "zh-CN",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  workers: 2,
});
