import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE = 'https://ltweb.com.ar'

/* Genera dist/sitemap.xml al terminar el build.

   Se genera en vez de mantenerse a mano porque las fichas de proyecto salen de
   la base: cada vez que cargamos un proyecto nuevo desde /admin, el próximo
   deploy lo incluye solo. Un sitemap estático quedaría desactualizado al día
   siguiente.

   Solo entran los proyectos que tienen contenido cargado. Los que están
   vacíos muestran "Estamos preparando el detalle de este proyecto", y mandar
   a Google veintipico de páginas así es contraproducente: siguen siendo
   accesibles desde /portfolio, pero no las promocionamos.

   Si la API no responde (build sin red o sin variables de entorno), se
   escriben igual las rutas fijas en vez de romper el deploy. */
export function sitemapPlugin(env) {
  return {
    name: 'ltweb-sitemap',
    apply: 'build',
    async closeBundle() {
      const hoy = new Date().toISOString().slice(0, 10)
      const urls = [
        { loc: `${SITE}/`, priority: '1.0', changefreq: 'monthly' },
        { loc: `${SITE}/portfolio`, priority: '0.8', changefreq: 'weekly' },
      ]

      try {
        const res = await fetch(
          `${env.VITE_SUPABASE_URL}/rest/v1/portfolio_items` +
            '?select=id,category,problem,solution,description&order=position',
          {
            headers: {
              apikey: env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const items = await res.json()
        const conFicha = items.filter((p) =>
          [p.category, p.problem, p.solution, p.description].some((v) => v && v.trim()),
        )
        for (const p of conFicha) {
          urls.push({
            loc: `${SITE}/proyecto/${encodeURIComponent(p.id)}`,
            priority: '0.6',
            changefreq: 'monthly',
          })
        }
        console.log(
          `[sitemap] ${urls.length} URLs (${conFicha.length} fichas de proyecto con contenido, ` +
            `${items.length - conFicha.length} sin cargar quedaron afuera)`,
        )
      } catch (err) {
        console.warn(`[sitemap] no se pudo leer la base (${err.message}); solo rutas fijas`)
      }

      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls
          .map(
            (u) =>
              '  <url>\n' +
              `    <loc>${u.loc}</loc>\n` +
              `    <lastmod>${hoy}</lastmod>\n` +
              `    <changefreq>${u.changefreq}</changefreq>\n` +
              `    <priority>${u.priority}</priority>\n` +
              '  </url>\n',
          )
          .join('') +
        '</urlset>\n'

      writeFileSync(resolve('dist/sitemap.xml'), xml)
    },
  }
}
