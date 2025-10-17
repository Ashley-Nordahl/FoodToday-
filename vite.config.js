import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  define: {
    // Suppress React Router development warnings
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  esbuild: {
    // Suppress console warnings in development
    logLevel: 'error'
  }
})

