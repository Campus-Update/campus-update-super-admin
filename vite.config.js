import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = { '/api': { target: 'https://campus-update-api-staging.vercel.app', changeOrigin: true } }

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: true,
    proxy: apiProxy,
  },
  preview: {
    host: '0.0.0.0',
    proxy: apiProxy,
  },
})
