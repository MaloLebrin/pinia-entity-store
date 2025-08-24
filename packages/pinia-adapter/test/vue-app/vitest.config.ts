import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Alias pour nos packages
      '@malolebrin/entity-store-core': resolve(__dirname, '../../core'),
      '@malolebrin/entity-store-pinia': resolve(__dirname, '../')
    }
  }
})
