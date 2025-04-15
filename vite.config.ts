import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/leetcode-200-number-of-islands/', // 使用确切的GitHub Pages项目路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // GitHub Pages不支持下划线开头的文件夹，确保没有这样的输出
    assetsInlineLimit: 4096,
  },
  // 添加这些配置以提高构建性能
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})
