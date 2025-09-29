import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/*.spec.ts',
    timeout: 30000,
    retries: 0,
    use: {
        launchOptions: {
            slowMo: 2000, // 2000ms delay
            env: { PWDEBUG: '1' }, // Always open inspector
        },
    },

    projects: [
        {
            name: 'chromium',
            outputDir: 'tests/e2e/test-results',
            use: {
                browserName: 'chromium',
                headless: false,
                baseURL: 'http://localhost:5173',
                trace: 'on',
                viewport: { width: 1920, height: 1080 }, 
                // viewport: { width: 2560, height: 1440 },
            },
            workers: 1,
        },
    ],
});
