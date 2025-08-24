import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Alias pour nos packages
      '@malolebrin/entity-store-core': resolve(__dirname, '../../core'),
      '@malolebrin/entity-store-pinia': resolve(__dirname, '../')
    }
  },
  
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  // Configuration pour le développement
  optimizeDeps: {
    include: ['vue', 'pinia']
  }
})
