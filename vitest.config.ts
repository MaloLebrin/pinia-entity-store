/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  test: {
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/index.ts',

    ],
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/index.ts',
        '**/dataFixtures.ts',
        '**/store/**',
      ],
    },
  },
  plugins: [
    AutoImport({
      dts: './types/shims/auto-imports.d.ts',
      imports: [
        'vue',
        'vitest',
        'pinia',
        {
          '@antfu/utils': [
            'noNull',
          ],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': './',
    },
  },

})
