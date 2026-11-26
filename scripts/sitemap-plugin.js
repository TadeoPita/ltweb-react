import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { armarSitemap } from '../servidor/lib/sitemap.js'

/* Deja una copia de respaldo en dist/sitemap.xml al terminar el build.

   El sitemap que ve Google lo arma el servidor en cada pedido, con lo que está
   publicado desde el panel (servidor/lib/sitemap.js). Esta copia sale de
   datos/semilla.json y solo se usa si el servidor no pudo armar el suyo, o al
   servir dist/ con otra cosa que no sea nuestro servidor.

   Historia, para no repetirla: esto antes consultaba Supabase. Cuando el
   contenido pasó a un archivo propio la consulta empezó a fallar siempre y el
   catch escribía un sitemap con dos rutas, sin que nada se rompiera a la
   vista. Por eso el aviso de abajo se imprime fuerte. */
export function sitemapPlugin() {
  return {
    name: 'ltweb-sitemap',
    apply: 'build',
    async closeBundle() {
      const hoy = new Date().toISOString().slice(0, 10)
      let proyectos = []
      try {
        const ruta = resolve('datos/semilla.json')
        if (!existsSync(ruta)) throw new Error('no existe datos/semilla.json')
        const datos = JSON.parse(readFileSync(ruta, 'utf8'))
        proyectos = Array.isArray(datos.proyectos) ? datos.proyectos : []
      } catch (err) {
        console.warn(`[sitemap] no se pudieron leer los proyectos (${err.message}); la copia sale sin fichas`)
      }

      const xml = armarSitemap(proyectos, { sitio: hoy })
      writeFileSync(resolve('dist/sitemap.xml'), xml)
      console.log(`[sitemap] copia de respaldo con ${xml.split('<url>').length - 1} URLs`)
    },
  }
}
