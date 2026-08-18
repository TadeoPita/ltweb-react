import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    /* Las dependencias grandes van en chunks propios. No bajan el peso total
       de la primera visita, pero cambian mucho menos seguido que nuestro
       código: al publicar una corrección de textos el navegador revalida
       solo el chunk de la app y reusa React, Framer Motion y Supabase del
       caché en vez de bajar todo de nuevo. */
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
