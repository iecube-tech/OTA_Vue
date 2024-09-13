import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/dev-api': {
        // 后台地址
        target: 'http://192.168.1.39:8888/',
        // target: 'http://47.94.161.154:8090/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/files': {
        target: 'http://192.168.1.39:8888/files',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/files/, '')
      }
    }
  }
})
