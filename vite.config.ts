/// <reference types="vitest/config" />
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Fixed ports registered in ../ports.md (krabeui-*), so KrabeUI never
  // collides with sibling projects.
  server: {
    port: 4060,
    strictPort: true,
  },
  preview: {
    port: 4063,
    strictPort: true,
  },
  // Runs each story's `play` function as a Vitest test in a real browser.
  // See https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        // expect-type ships CommonJS. When Vite doesn't pre-bundle it, the
        // browser gets the raw file, every test file fails to import
        // `expectTypeOf`, and the run hangs.
        optimizeDeps: {
          include: ['expect-type'],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // Vitest's default (63315) can land in a Windows-reserved port
            // range (Hyper-V/WinNAT) and fail with EACCES.
            api: {
              port: 4062,
              strictPort: true,
            },
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
