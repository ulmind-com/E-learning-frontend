import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    nodePolyfills({
      include: ['events', 'buffer', 'process', 'util', 'stream'],
      globals: { Buffer: true, global: true, process: true },
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
})
