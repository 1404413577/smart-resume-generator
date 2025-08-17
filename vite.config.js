import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'element-plus-icons': ['@element-plus/icons-vue'],
          'vue-vendor': ['vue', 'pinia'],
          'pdf-utils': ['jspdf', 'html2canvas', 'file-saver'],
          'utils': ['lodash-es', 'dayjs']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
