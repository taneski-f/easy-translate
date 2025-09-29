import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // Exclude Playwright E2E tests and node_modules
      exclude: [...configDefaults.exclude, 'tests/e2e/**'],
      // Look for unit tests under tests/unit
      include: ['tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
