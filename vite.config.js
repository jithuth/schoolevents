import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the critical fix for your 404 errors
  base: '/school/',
  build: {
    // This ensures your build files go into a folder 
    // that Django can easily find
    outDir: 'build',
  }
})