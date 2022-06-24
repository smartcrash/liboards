/// <reference types="vitest" />

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'

// See: https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  test: { environment: 'jsdom' }
})
