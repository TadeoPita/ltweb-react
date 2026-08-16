import { useEffect } from 'react'

/* SEO por página.

   Como es una SPA, el index.html trae un solo juego de etiquetas y todas las
   rutas compartían el mismo título y descripción. Peor todavía: al pegar un
   link en WhatsApp no aparecía preview porque faltaba og:image.

   Este hook actualiza las etiquetas de forma imperativa en vez de renderizar
   <meta> desde React: así se reutilizan las que ya existen en el index.html
   en lugar de duplicarlas, y el resultado es el mismo con o sin hidratación. */

const SITE = 'https://ltweb.com.ar'
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`
const DEFAULT_TITLE = 'Diseño y Desarrollo Web En Argentina - LTWEB'

function upsertMeta(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export function useSeo({ title, description, image, path = '', type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ?? DEFAULT_TITLE
    const url = SITE + path
    const img = image ?? DEFAULT_IMAGE

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertCanonical(url)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:site_name', 'LTWEB')
    upsertMeta('property', 'og:locale', 'es_AR')

    // Sin esto X/Twitter muestra una tarjeta chica sin imagen
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)
  }, [title, description, image, path, type])
}
