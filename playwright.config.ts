import { defineConfig, devices } from '@playwright/test'

// Deliberately the deployment (TRD section 18), so `bun run e2e` says nothing about your working
// tree. `bun run e2e:local` tests the tree.
const baseURL = process.env.E2E_BASE_URL ?? 'https://cekgu-op7lf5dspq-as.a.run.app'

// Playwright loads this in the runner and in every worker; TEST_WORKER_INDEX is unset only in the runner.
if (!process.env.TEST_WORKER_INDEX)
  console.log(
    `\ne2e target: ${baseURL}${process.env.E2E_BASE_URL ? '' : '  (default: the deployment, not your tree)'}\n`
  )

export default defineConfig({
  testDir: './e2e',
  // Not .spec.ts or .test.ts: bun test claims those and cannot run Playwright's test().
  testMatch: '**/*.e2e.ts',
  // One worker: every test shares the one Guest account, and demo.e2e.ts resets the sample record
  // whose counts smoke.e2e.ts asserts.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
})
