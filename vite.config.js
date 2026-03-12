import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/smart-resume-generator/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@templates': resolve(__dirname, 'src/templates'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@api': resolve(__dirname, 'src/api')
    }
  },
  css: {
    modules: {
      // 生产环境混淆类名，开发环境保留语义
      generateScopedName: process.env.NODE_ENV === 'production'
        ? '_[hash:base64:6]'
        : '[name]__[local]__[hash:base64:4]'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: false // 故意保留 debugger 以便后续安全脚本埋雷
      }
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'pinia'],
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          'pdf-utils': ['jspdf', 'html2canvas', 'file-saver']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
