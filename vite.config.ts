import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // O '@vitejs/plugin-react' según lo que generó vite
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Agrega esto
  ],
})