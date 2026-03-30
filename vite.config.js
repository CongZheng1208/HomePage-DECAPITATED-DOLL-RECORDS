import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    rollupOptions: {
      maxParallelFileOps: 1,
    },
    sourcemap: false,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})
