import { manejarApi } from '../servidor/lib/api.js'
import { rutas } from '../servidor/lib/datos.js'

/* El panel durante el desarrollo.
 *
 * Monta las mismas rutas que el servidor de producción, pero adentro de Vite.
 * La lógica no está duplicada: las dos entradas llaman a manejarApi. Si
 * estuviera escrita dos veces se irían separando con el tiempo, y terminaría
 * andando en tu máquina y fallando en el servidor, que es la peor clase de
 * bug para encontrar.
 *
 * Dos diferencias con producción, las dos a propósito:
 *
 *   - No pide contraseña. Corre en localhost contra tu propio Vite; pedir
 *     login cada vez solo estorba.
 *   - Publica a public/data/projects.js y no a dist/, porque en desarrollo el
 *     sitio se sirve desde public/.
 */
export function panelPlugin() {
  return {
    name: 'ltweb-panel',
    /* Solo en `npm run dev`. En el build no existe. */
    apply: 'serve',

    configureServer(server) {
      const raiz = server.config.root

      server.middlewares.use(async (req, res, next) => {
        const manejada = await manejarApi(req, res, {
          raiz,
          raizPublica: raiz + '/public',
          rutas: rutas(raiz),
          produccion: false,
          pedirSesion: false,
        })
        if (!manejada) next()
      })

      const puerto = server.config.server.port ?? 5173
      console.log(`\n  [panel]  http://localhost:${puerto}/admin  — sin Supabase\n`)
    },
  }
}
