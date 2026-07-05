import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createApp } from './server/app.js'

function apiMiddleware() {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use(createApp())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddleware()],
})
