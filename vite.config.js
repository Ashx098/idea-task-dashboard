import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",  // ✅ Ensure relative paths for Firebase hosting
  plugins: [react()],
})
