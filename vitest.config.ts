/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [
    AutoImport({
      dts: './types/shims/auto-imports.d.ts',
      imports: [
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
