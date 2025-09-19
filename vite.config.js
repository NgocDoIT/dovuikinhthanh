import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Thiết lập đường dẫn gốc cho GitHub Pages
  base: '/dovuikinhthanh/',
})
