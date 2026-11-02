import { nombreProyecto } from './titulos.js'

export const SITIO = 'https://ltweb.com.ar'
const ESTUDIO = { '@id': `${SITIO}/#estudio` }

function migas(pasos) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: pasos.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITIO}${item}` })),
  }
}

function preguntas(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export function absoluta(url) {
  if (!url) return `${SITIO}/og-image.jpg`
  if (/^https?:\/\//.test(url)) return url
  return SITIO + (url.startsWith('/') ? url : `/${url}`)
}

export function esquemaServicio(s) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      migas([['Inicio', '/'], [s.nombre, `/${s.slug}`]]),
      {
        '@type': 'Service',
        name: s.h1,
        serviceType: s.nombre,
        description: s.descripcion,
        url: `${SITIO}/${s.slug}`,
        provider: ESTUDIO,
        areaServed: [{ '@type': 'Country', name: 'Argentina' }, 'Mundo'],
        inLanguage: 'es-AR',
      },
      preguntas(s.faqs),
    ],
  }
}

export const DESCRIPCION_RESENAS =
  'Clientes de LTWEB cuentan en video cómo fue trabajar con nosotros en su página web, sus redes y sus sistemas.'

export function descripcionResena(t) {
  return `Reseña en video de ${t.nombre} (${t.detalle}) sobre su experiencia trabajando con LTWEB: «${t.frase}».`
}

export function esquemaResena(t, parrafos, proyecto) {
  const url = `${SITIO}/resenas/${t.id}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      migas([['Inicio', '/'], ['Reseñas', '/resenas'], [t.nombre, `/resenas/${t.id}`]]),
      {
        '@type': 'VideoObject',
        name: `Reseña de ${t.nombre} sobre LTWEB`,
        description: descripcionResena(t),
        thumbnailUrl: absoluta(t.poster),
        contentUrl: absoluta(t.video),
        uploadDate: t.fecha,
        duration: t.duracion,
        inLanguage: 'es-AR',
        transcript: (parrafos || []).join(' '),
        url,
        publisher: ESTUDIO,
        ...(proyecto && { about: { '@type': 'CreativeWork', name: nombreProyecto(proyecto), url: `${SITIO}/proyecto/${proyecto.id}` } }),
      },
    ],
  }
}

export function esquemaResenas(lista) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      migas([['Inicio', '/'], ['Reseñas', '/resenas']]),
      {
        '@type': 'CollectionPage',
        name: 'Reseñas en video de clientes de LTWEB',
        url: `${SITIO}/resenas`,
        hasPart: lista.map((t) => ({ '@type': 'VideoObject', name: `Reseña de ${t.nombre} sobre LTWEB`, url: `${SITIO}/resenas/${t.id}` })),
      },
    ],
  }
}
