import { defineConfig, devices } from '@playwright/test';
const external = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: external ?? 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  webServer: external
    ? undefined
    : {
        command: 'pnpm start --port 3100',
        url: 'http://127.0.0.1:3100/fr',
        reuseExistingServer: false,
        timeout: 60000,
      },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
