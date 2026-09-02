import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sitemapPlugin } from './scripts/sitemap-plugin.js'
import { panelPlugin } from './scripts/panel-plugin.js'
import { contenidoParaBuscadores } from './scripts/contenido-para-buscadores.js'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin(loadEnv(mode, process.cwd(), 'VITE_')),
    /* El panel. Solo en `npm run dev`: el sitio publicado no escribe nada. */
    panelPlugin(),
    /* Vuelca el contenido real al HTML para quien no ejecuta JavaScript,
       que es el caso de casi todos los crawlers de IA. Solo en build. */
    contenidoParaBuscadores(),
  ],
  build: {
    /* Vaciar dist antes de cada build.
    
       Deberia ser el valor por defecto, pero en la practica no estaba pasando:
       dist tenia 451 archivos en assets cuando el build genera unos 20, y 56
       imagenes cuando en public/images hay 25. Eran los restos de cada build
       anterior mas las imagenes que se fueron borrando del proyecto, que
       quedaban ahi para siempre.
    
       No es solo desprolijidad: eso es lo que se sube al servidor. El paquete
       para publicar pesaba 27 MB cuando el sitio entero no llega a 3. */
    emptyOutDir: true,

    /* Las dependencias grandes van en chunks propios. No bajan el peso total
       de la primera visita, pero cambian mucho menos seguido que nuestro
       código: al publicar una corrección de textos el navegador revalida
       solo el chunk de la app y reusa React y Framer Motion del caché en vez
       de bajar todo de nuevo. */
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
}))
