import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // This ensures your build files go into a folder 
    // that Django can easily find
    outDir: 'dist',
  }
})