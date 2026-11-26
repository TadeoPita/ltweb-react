import { SERVICIOS } from '../../src/data/servicios.js'
import { TESTIMONIOS } from '../../src/data/testimonios.js'
import { proyectoIndexable } from '../../src/lib/titulos.js'

const SITIO = 'https://ltweb.com.ar'

/* El sitemap, armado con la lista de proyectos que se le pase.

   Lo usan dos lados: el servidor, que lo arma en cada pedido con lo publicado
   desde el panel, y el build, que deja una copia en dist/sitemap.xml por si
   algo falla.

   Antes solo existía la copia del build, hecha con datos/semilla.json. Esa
   semilla es una foto del repo: un proyecto borrado desde el panel seguía en
   el sitemap (Google lo pedía y le daba 404) y uno nuevo no entraba nunca.

   `fechas.sitio` es la del último despliegue y `fechas.proyectos` la de la
   última publicación. Google solo hace caso a lastmod si es verdad, así que
   no se pone la fecha de hoy en todo. */
export function armarSitemap(proyectos, fechas) {
  const sitio = fechas.sitio
  const publicacion = fechas.proyectos || sitio

  const urls = [
    { loc: `${SITIO}/`, lastmod: sitio, priority: '1.0', changefreq: 'monthly' },
    { loc: `${SITIO}/portfolio`, lastmod: publicacion, priority: '0.8', changefreq: 'weekly' },
    ...SERVICIOS.map((s) => ({ loc: `${SITIO}/${s.slug}`, lastmod: sitio, priority: '0.9', changefreq: 'monthly' })),
    { loc: `${SITIO}/resenas`, lastmod: sitio, priority: '0.6', changefreq: 'monthly' },
    ...TESTIMONIOS.map((t) => ({ loc: `${SITIO}/resenas/${t.id}`, lastmod: sitio, priority: '0.5', changefreq: 'yearly' })),
    ...proyectos.filter(proyectoIndexable).map((p) => ({
      loc: `${SITIO}/proyecto/${encodeURIComponent(p.id)}`,
      lastmod: publicacion,
      priority: '0.6',
      changefreq: 'monthly',
    })),
  ]

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          '  <url>\n' +
          `    <loc>${u.loc}</loc>\n` +
          (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          '  </url>\n',
      )
      .join('') +
    '</urlset>\n'
  )
}
