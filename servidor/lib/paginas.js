import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { descripcionProyecto, nombreProyecto, proyectoConFicha, tituloProyecto, urlSitio } from '../../src/lib/titulos.js'
import { DESCRIPCION_RESENAS, descripcionResena, esquemaResena, esquemaResenas, esquemaServicio } from '../../src/lib/esquemas.js'
import { SERVICIOS, whatsappCon } from '../../src/data/servicios.js'
import { TESTIMONIOS } from '../../src/data/testimonios.js'
import { TRANSCRIPCIONES } from '../../src/data/transcripciones.js'

export const SITIO = 'https://ltweb.com.ar'
const IMAGEN_DEFECTO = `${SITIO}/og-image.jpg`
const ESTILO =
  'max-width:52rem;margin:0 auto;padding:4rem 1.5rem;background:#08080a;color:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;line-height:1.6'

const SIN_INDICE = new Set(['/clasico', '/login', '/admin'])

const memoria = new Map()

async function leerConMemoria(ruta, transformar) {
  const info = await stat(ruta)
  const previo = memoria.get(ruta)
  if (previo && previo.mtime === info.mtimeMs) return previo.valor
  const valor = transformar(await readFile(ruta, 'utf8'))
  memoria.set(ruta, { mtime: info.mtimeMs, valor })
  return valor
}

function esc(t) {
  return String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function texto(t) {
  return String(t ?? '')
    .replace(/\*\*/g, '')
    .trim()
}

function parrafos(t) {
  return texto(t)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<p>${esc(l)}</p>`)
    .join('\n        ')
}

function absoluta(url) {
  if (!url) return IMAGEN_DEFECTO
  if (/^https?:\/\//.test(url)) return url
  return SITIO + (url.startsWith('/') ? url : `/${url}`)
}

function enFrase(t) {
  const s = texto(t).toLowerCase()
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

export async function leerProyectos(rutas, raiz) {
  const fuentes = [
    [rutas.publicado, (t) => t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)],
    [join(raiz, 'datos/semilla.json'), (t) => t],
  ]
  for (const [ruta, recortar] of fuentes) {
    try {
      const lista = await leerConMemoria(ruta, (t) => {
        const datos = JSON.parse(recortar(t))
        return Array.isArray(datos.proyectos) ? datos.proyectos : []
      })
      if (lista.length) return lista
    } catch {
      continue
    }
  }
  return []
}

function visibles(proyectos) {
  return proyectos.filter((p) => p && p.id && !p.blurred)
}

function bloque(contenido) {
  return `<div id="contenido-inicial" style="${ESTILO}">
      ${contenido}
    </div>`
}

function paginaPortfolio(proyectos) {
  const lista = visibles(proyectos)
    .map((p) => {
      const nombre = esc(nombreProyecto(p))
      const rubro = p.category ? ` — ${esc(texto(p.category))}` : ''
      if (!proyectoConFicha(p)) return `<li>${nombre}${rubro}</li>`
      return `<li>
          <a href="/proyecto/${esc(p.id)}">${nombre}</a>${rubro}
          <p>${esc(descripcionProyecto(p))}</p>
        </li>`
    })
    .join('\n        ')

  return {
    estado: 200,
    titulo: 'Proyectos — LTWEB',
    descripcion:
      'Todos los proyectos que diseñamos y desarrollamos: webs empresariales, tiendas online y sistemas personalizados para empresas de Argentina.',
    canonica: `${SITIO}/portfolio`,
    cuerpo: bloque(`<h1>Proyectos de LTWEB</h1>
      <p>Webs empresariales, tiendas online y sistemas personalizados que diseñamos y desarrollamos a medida, para empresas e instituciones de Argentina y otros países.</p>
      <ul>
        ${lista}
      </ul>
      <p><a href="/">Volver al inicio</a></p>`),
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
            { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${SITIO}/portfolio` },
          ],
        },
        {
          '@type': 'CollectionPage',
          name: 'Proyectos de LTWEB',
          url: `${SITIO}/portfolio`,
          hasPart: visibles(proyectos)
            .filter(proyectoConFicha)
            .map((p) => ({ '@type': 'CreativeWork', name: nombreProyecto(p), url: `${SITIO}/proyecto/${p.id}` })),
        },
      ],
    },
  }
}

function paginaProyecto(p, proyectos) {
  const nombre = nombreProyecto(p)
  const url = `${SITIO}/proyecto/${p.id}`
  const ficha = proyectoConFicha(p)
  const rubro = texto(p.category).split(',')[0].trim()

  const otros = visibles(proyectos)
    .filter((o) => o.id !== p.id && proyectoConFicha(o))
    .sort((a, b) => Number(texto(b.category).includes(rubro) && !!rubro) - Number(texto(a.category).includes(rubro) && !!rubro))
    .slice(0, 6)
    .map((o) => `<li><a href="/proyecto/${esc(o.id)}">${esc(nombreProyecto(o))}</a></li>`)
    .join('\n          ')

  const secciones = [
    ['El problema', p.problem],
    ['La solución', p.solution],
    ['Qué hicimos', p.description],
  ]
    .filter(([, v]) => texto(v))
    .map(([t, v]) => `<h2>${t}</h2>\n        ${parrafos(v)}`)
    .join('\n      ')

  const servicios = texto(p.services)
    ? `<h2>Servicios</h2>\n      <p>${esc(texto(p.services))}</p>`
    : ''
  const sitio = urlSitio(p) ? `<p><a href="${esc(urlSitio(p))}" rel="noopener">Visitar el sitio de ${esc(nombre)}</a></p>` : ''

  return {
    estado: 200,
    titulo: tituloProyecto(p),
    descripcion: descripcionProyecto(p),
    canonica: url,
    imagen: absoluta(p.image),
    tipo: 'article',
    noindex: !ficha || Boolean(p.blurred),
    cuerpo: bloque(`<p><a href="/portfolio">Proyectos</a></p>
      <h1>${esc(nombre)}</h1>
      <p>${esc(enFrase(p.type) || 'Sitio web')}${rubro ? ` · ${esc(rubro)}` : ''} · Diseñado y desarrollado por LTWEB</p>
      ${secciones}
      ${servicios}
      ${sitio}
      ${otros ? `<h2>Otros proyectos</h2>\n      <ul>\n          ${otros}\n      </ul>` : ''}
      <p><a href="/">LTWEB — Diseño y desarrollo web</a></p>`),
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
            { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${SITIO}/portfolio` },
            { '@type': 'ListItem', position: 3, name: nombre, item: url },
          ],
        },
        {
          '@type': 'CreativeWork',
          name: nombre,
          url,
          image: absoluta(p.image),
          description: descripcionProyecto(p),
          genre: texto(p.type) || undefined,
          about: rubro || undefined,
          creator: { '@type': 'Organization', name: 'LTWEB', url: `${SITIO}/` },
        },
      ],
    },
  }
}

function enlacesServicios(excepto) {
  return SERVICIOS.filter((s) => s.slug !== excepto)
    .map((s) => `<li><a href="/${s.slug}">${esc(s.nombre)}</a></li>`)
    .join('\n          ')
}

function paginaServicio(s, proyectos) {
  const casos = s.proyectos
    .map((id) => proyectos.find((p) => p && p.id === id))
    .filter((p) => p && !p.blurred && proyectoConFicha(p))
    .map((p) => `<li><a href="/proyecto/${esc(p.id)}">${esc(nombreProyecto(p))}</a> — ${esc(descripcionProyecto(p))}</li>`)
  const resena = s.resena && TESTIMONIOS.find((t) => t.id === s.resena)
  if (resena) casos.unshift(`<li><a href="/resenas/${resena.id}">Reseña en video de ${esc(resena.nombre)}</a></li>`)
  const lista = (items, render) => items.map(render).join('\n          ')

  return {
    estado: 200,
    titulo: s.titulo,
    descripcion: s.descripcion,
    canonica: `${SITIO}/${s.slug}`,
    cuerpo: bloque(`<p><a href="/">LTWEB</a></p>
      <p>${esc(s.volanta)}</p>
      <h1>${esc(s.h1)}</h1>
      <p>${esc(s.intro)}</p>
      <h2>Qué incluye</h2>
      <ul>
          ${lista(s.incluye, (x) => `<li><strong>${esc(x.t)}</strong>: ${esc(x.d)}</li>`)}
      </ul>
      <h2>Cómo trabajamos</h2>
      <ol>
          ${lista(s.proceso, (x) => `<li><strong>${esc(x.t)}</strong>: ${esc(x.d)}</li>`)}
      </ol>
      ${casos.length ? `<h2>Casos reales</h2>\n      <ul>\n          ${casos.join('\n          ')}\n      </ul>` : ''}
      <h2>Preguntas frecuentes</h2>
      ${lista(s.faqs, (f) => `<h3>${esc(f.q)}</h3>\n      <p>${esc(f.a)}</p>`)}
      <p><a href="${esc(whatsappCon(s.mensaje))}">Consultar por WhatsApp</a></p>
      <h2>Otros servicios</h2>
      <ul>
          ${enlacesServicios(s.slug)}
      </ul>`),
    jsonld: esquemaServicio(s),
  }
}

function paginaResenas() {
  return {
    estado: 200,
    titulo: 'Reseñas en video de nuestros clientes — LTWEB',
    descripcion: DESCRIPCION_RESENAS,
    canonica: `${SITIO}/resenas`,
    cuerpo: bloque(`<p><a href="/">LTWEB</a></p>
      <h1>Lo que dicen nuestros clientes</h1>
      <p>${esc(DESCRIPCION_RESENAS)}</p>
      <ul>
          ${TESTIMONIOS.map((t) => `<li><a href="/resenas/${t.id}">${esc(t.nombre)}</a> — ${esc(t.detalle)}: «${esc(t.frase)}»</li>`).join('\n          ')}
      </ul>`),
    jsonld: esquemaResenas(TESTIMONIOS),
  }
}

function paginaResena(t, proyectos) {
  const parrafos = TRANSCRIPCIONES[t.id] || []
  const proyecto = proyectos.find((p) => p && p.id === t.proyecto && !p.blurred)
  const conFicha = proyecto && proyectoConFicha(proyecto) ? proyecto : null
  const otras = TESTIMONIOS.filter((o) => o.id !== t.id)
    .map((o) => `<li><a href="/resenas/${o.id}">${esc(o.nombre)}</a></li>`)
    .join('\n          ')

  return {
    estado: 200,
    titulo: `Reseña de ${t.nombre}: «${t.frase}» | LTWEB`,
    descripcion: descripcionResena(t),
    canonica: `${SITIO}/resenas/${t.id}`,
    imagen: absoluta(t.poster),
    tipo: 'video.other',
    cuerpo: bloque(`<p><a href="/resenas">Reseñas</a></p>
      <h1>${esc(t.nombre)}</h1>
      <p>Reseña en video · ${esc(t.detalle)}</p>
      <video src="${esc(t.video)}" poster="${esc(t.poster)}" controls playsinline preload="metadata" style="width:100%;max-width:380px"></video>
      <p>«${esc(t.frase)}»</p>
      <h2>Lo que nos contó</h2>
      ${parrafos.map((x) => `<p>${esc(x)}</p>`).join('\n      ')}
      ${conFicha ? `<p><a href="/proyecto/${esc(conFicha.id)}">Ver el proyecto de ${esc(nombreProyecto(conFicha))}</a></p>` : ''}
      <h2>Otras reseñas</h2>
      <ul>
          ${otras}
      </ul>`),
    jsonld: esquemaResena(t, parrafos, conFicha),
  }
}

function paginaNoEncontrada() {
  return {
    estado: 404,
    titulo: 'Página no encontrada — LTWEB',
    descripcion: 'La página que buscás no existe o fue movida.',
    canonica: null,
    noindex: true,
    cuerpo: bloque(`<h1>Página no encontrada</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <p><a href="/">Ir al inicio</a> · <a href="/portfolio">Ver los proyectos</a></p>`),
  }
}

function reemplazarMeta(html, atributo, clave, valor) {
  const patron = new RegExp(`<meta\\s+${atributo}="${clave}"\\s+content="[^"]*"\\s*/?>`)
  const etiqueta = `<meta ${atributo}="${clave}" content="${esc(valor)}" />`
  return patron.test(html) ? html.replace(patron, () => etiqueta) : html.replace('</head>', () => `  ${etiqueta}\n  </head>`)
}

function aplicar(html, pagina) {
  let h = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(pagina.titulo)}</title>`)
  h = reemplazarMeta(h, 'property', 'og:title', pagina.titulo)

  if (pagina.descripcion) {
    h = reemplazarMeta(h, 'name', 'description', pagina.descripcion)
    h = reemplazarMeta(h, 'property', 'og:description', pagina.descripcion)
  }

  if (pagina.canonica) {
    h = h.replace(/<link\s+rel="canonical"[^>]*>/, () => `<link rel="canonical" href="${esc(pagina.canonica)}" />`)
    h = reemplazarMeta(h, 'property', 'og:url', pagina.canonica)
  } else {
    h = h.replace(/\s*<link\s+rel="canonical"[^>]*>/, '')
  }

  if (pagina.imagen) {
    h = reemplazarMeta(h, 'property', 'og:image', pagina.imagen)
    h = reemplazarMeta(h, 'name', 'twitter:image', pagina.imagen)
  }
  if (pagina.tipo) h = reemplazarMeta(h, 'property', 'og:type', pagina.tipo)
  if (pagina.noindex) h = reemplazarMeta(h, 'name', 'robots', 'noindex, follow')

  if (pagina.jsonld) {
    const json = JSON.stringify(pagina.jsonld).replace(/</g, '\\u003c')
    h = h.replace('</head>', () => `  <script type="application/ld+json" data-servidor="ld">${json}</script>\n  </head>`)
  }

  if (pagina.cuerpo) {
    h = h.replace(
      /<noscript>\s*<div id="contenido-inicial"[\s\S]*?<\/div>\s*<\/noscript>/,
      () => `<noscript>\n    ${pagina.cuerpo}\n    </noscript>`,
    )
  }
  return h
}

export async function renderizar(camino, { dist, rutas, raiz }) {
  const plantilla = await leerConMemoria(join(dist, 'index.html'), (t) => t)

  if (camino === '/') return { estado: 200, html: aplicar(plantilla, { titulo: 'LTWEB — Diseño y desarrollo web en Buenos Aires', canonica: `${SITIO}/` }) }

  if (SIN_INDICE.has(camino)) {
    return { estado: 200, html: aplicar(plantilla, { titulo: 'LTWEB', canonica: null, noindex: true }) }
  }

  if (camino === '/portfolio') {
    const proyectos = await leerProyectos(rutas, raiz)
    return { estado: 200, html: aplicar(plantilla, paginaPortfolio(proyectos)) }
  }

  const servicio = SERVICIOS.find((s) => camino === `/${s.slug}`)
  if (servicio) {
    const proyectos = await leerProyectos(rutas, raiz)
    return { estado: 200, html: aplicar(plantilla, paginaServicio(servicio, proyectos)) }
  }

  if (camino === '/resenas') return { estado: 200, html: aplicar(plantilla, paginaResenas()) }

  const resena = /^\/resenas\/([^/]+)$/.exec(camino)
  const testimonio = resena && TESTIMONIOS.find((t) => t.id === resena[1])
  if (testimonio) {
    const proyectos = await leerProyectos(rutas, raiz)
    return { estado: 200, html: aplicar(plantilla, paginaResena(testimonio, proyectos)) }
  }

  const ficha = /^\/proyecto\/([^/]+)$/.exec(camino)
  if (ficha) {
    let id
    try {
      id = decodeURIComponent(ficha[1])
    } catch {
      id = null
    }
    const proyectos = await leerProyectos(rutas, raiz)
    const p = id && proyectos.find((x) => x && x.id === id)
    if (p) {
      const pagina = paginaProyecto(p, proyectos)
      return { estado: pagina.estado, html: aplicar(plantilla, pagina) }
    }
  }

  const pagina = paginaNoEncontrada()
  return { estado: pagina.estado, html: aplicar(plantilla, pagina) }
}

const SITEMAPS_VIEJOS = /^\/(sitemap_index|wp-sitemap|(page|post|category|portfolio|attachment|author|post_tag|elementor_library|e-landing-page)-sitemap\d*|wp-sitemap-[\w-]+)\.xml$/

export function redireccion(host, camino, busqueda) {
  if (host === 'www.ltweb.com.ar') return `${SITIO}${camino}${busqueda}`
  if (SITEMAPS_VIEJOS.test(camino)) return '/sitemap.xml'
  if (camino === '/v3' || camino === '/index.html') return `/${busqueda}`
  if (camino.length > 1 && camino.endsWith('/') && !camino.startsWith('/api/')) {
    return `${camino.replace(/\/+$/, '')}${busqueda}`
  }
  return null
}
