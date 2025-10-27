// vite.config.js (creado/actualizado)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // Host ngrok especificada (la que aparece en tu error)
    allowedHosts: ['unmisanthropical-trinidad-supertragically.ngrok-free.dev']
  }
})
