import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    origin: 'https://mern-store-seven-eta.vercel.app' 
  }
})
