import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com; style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com; img-src 'self' data: https:; font-src 'self' data: https://*.clerk.accounts.dev https://*.clerk.com; connect-src 'self' https://polished-puffin-622.convex.cloud wss://polished-puffin-622.convex.cloud https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com; worker-src 'self' blob:;"
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})