import { useSyncExternalStore } from 'react'
import { PORTFOLIO } from './content'

/* Store del portfolio.
 *
 * Reemplaza a la versión que hablaba con Supabase. Hay dos fuentes, y el orden
 * en que se prueban importa:
 *
 * 1. window.__LTWEB_DATOS__ — lo escribe el panel al publicar, y viene en
 *    public/data/projects.js con una etiqueta <script> del index.html. Como se
 *    ejecuta antes que el bundle, los proyectos ya están en memoria cuando
 *    React arranca: no hay pedido de red, ni pantalla de carga, ni salto de
 *    maqueta. Este es el camino del sitio publicado.
 *
 * 2. /api/proyectos — la fuente del panel, tanto en desarrollo como en la app
 *    Node publicada. Es el borrador y puede tener cambios aún no publicados.
 *
 * 3. PORTFOLIO de content.js — el contenido que viene con el proyecto, por si
 *    no hay ninguna de las dos.
 *
 * Las escrituras van todas a /api. En producción exigen la sesión del panel;
 * la web pública nunca usa esos endpoints ni puede modificar el borrador.
 */

let state = {
  variant: 'gallery',
  pageVariant: 'classic',
  heroVariant: 'centered',
  items: [],
  loading: true,
  error: null,
}

const listeners = new Set()

function emit() {
  listeners.forEach((l) => l())
}

/* Normaliza un proyecto venga de donde venga. La galería es el único campo con
   dos formas históricas: el panel viejo guardaba objetos {url, path} y el
   nuevo guarda {url}. Se aceptan las dos para que un JSON exportado del panel
   anterior no deje las fotos invisibles. */
function normalizar(p) {
  return {
    id: p.id,
    name: p.name ?? '',
    type: p.type ?? '',
    image: p.image ?? '',
    url: p.url ?? '',
    size: p.size ?? 'normal',
    home: p.home !== false,
    label: p.label || undefined,
    blurred: Boolean(p.blurred),
    category: p.category ?? '',
    problem: p.problem ?? '',
    solution: p.solution ?? '',
    description: p.description ?? '',
    services: p.services ?? '',
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((g) => (typeof g === 'string' ? { url: g } : g)).filter((g) => g && g.url)
      : [],
    beforeImage: p.beforeImage ?? '',
  }
}

function aplicar({ ajustes, proyectos }) {
  state = {
    variant: ajustes?.variant ?? 'gallery',
    pageVariant: ajustes?.pageVariant ?? 'classic',
    heroVariant: ajustes?.heroVariant ?? 'centered',
    items: proyectos.map(normalizar),
    loading: false,
    error: null,
  }
  emit()
}

/* Lo que dejó la última publicación. */
function datosPublicados() {
  if (typeof window === 'undefined') return null
  const d = window.__LTWEB_DATOS__
  if (!d || !Array.isArray(d.proyectos) || d.proyectos.length === 0) return null
  return d
}

async function pedir(ruta, opciones = {}) {
  const headers = new Headers(opciones.headers)
  if (typeof opciones.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch('/api' + ruta, { ...opciones, headers })
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}))
    throw new Error(cuerpo.error || `Falló ${ruta} (${res.status})`)
  }
  return res.json()
}

/* Tras cada escritura se relee todo del servidor en vez de parchear el estado
   en memoria. Es un pedido de más, pero contra un archivo local no se nota, y
   evita la clase de bug en la que la pantalla y el archivo dicen cosas
   distintas porque alguna actualización optimista salió mal. */
async function recargar() {
  aplicar(await pedir('/proyectos'))
}

let cargaInicial

function esPanel() {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
}

function marcarError(err) {
  state = { ...state, loading: false, error: err?.message || 'No se pudo cargar el portfolio.' }
  emit()
}

async function cargar() {
  /* El panel siempre tiene que leer el borrador real. Si usara el snapshot
     publicado, al recargar ocultaría cambios pendientes y también cualquier
     problema de almacenamiento del servidor. */
  const panel = esPanel()
  const publicado = panel ? null : datosPublicados()
  if (publicado) {
    aplicar(publicado)
    return
  }

  try {
    await recargar()
  } catch (err) {
    if (panel) {
      marcarError(err)
      return
    }
    /* Sin panel levantado y sin publicación previa: queda el contenido que
       viene con el proyecto, así el sitio nunca se ve vacío. */
    aplicar({ ajustes: {}, proyectos: PORTFOLIO })
  }
}

function asegurarCarga() {
  cargaInicial ??= cargar()
  return cargaInicial
}

/* Existía para la suscripción en tiempo real de Supabase. Se deja como función
   vacía para no romper el import de AdminPage: con un archivo local no hay
   nada a lo que suscribirse, la única fuente de cambios es este mismo panel. */
export function startRealtime() {}

export const portfolioStore = {
  get state() {
    return state
  },

  subscribe(listener) {
    listeners.add(listener)
    asegurarCarga()
    return () => listeners.delete(listener)
  },

  // --- Ajustes ------------------------------------------------------------

  async setVariant(variant) {
    await pedir('/ajustes', { method: 'PUT', body: JSON.stringify({ variant }) })
    await recargar()
  },

  async setPageVariant(pageVariant) {
    await pedir('/ajustes', { method: 'PUT', body: JSON.stringify({ pageVariant }) })
    await recargar()
  },

  async setHeroVariant(heroVariant) {
    await pedir('/ajustes', { method: 'PUT', body: JSON.stringify({ heroVariant }) })
    await recargar()
  },

  // --- Proyectos ----------------------------------------------------------

  async updateItem(id, patch) {
    await pedir(`/proyectos/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    await recargar()
  },

  async addItem(item) {
    const nuevo = await pedir('/proyectos', { method: 'POST', body: JSON.stringify(item) })
    await recargar()
    return nuevo
  },

  async removeItem(id) {
    await pedir(`/proyectos/${encodeURIComponent(id)}`, { method: 'DELETE' })
    await recargar()
  },

  async moveItem(id, dir) {
    await pedir(`/proyectos/${encodeURIComponent(id)}/mover`, {
      method: 'POST',
      body: JSON.stringify({ dir }),
    })
    await recargar()
  },

  // --- Imágenes -----------------------------------------------------------
  //
  // El archivo viaja crudo en el cuerpo. No hace falta multipart ni
  // comprimirlo antes: el servidor lo recodifica a WebP y lo achica a 1600 px
  // con sharp, que hace mejor trabajo que el canvas del navegador.

  async uploadImage(file, itemId) {
    const r = await pedir(`/proyectos/${encodeURIComponent(itemId)}/portada`, {
      method: 'POST',
      body: file,
    })
    await recargar()
    return r.url
  },

  async uploadBeforeImage(file, itemId) {
    const r = await pedir(`/proyectos/${encodeURIComponent(itemId)}/antes`, {
      method: 'POST',
      body: file,
    })
    await recargar()
    return r.url
  },

  async removeBeforeImage(itemId) {
    await pedir(`/proyectos/${encodeURIComponent(itemId)}/antes`, { method: 'DELETE' })
    await recargar()
  },

  async addGalleryImage(file, itemId) {
    const r = await pedir(`/proyectos/${encodeURIComponent(itemId)}/galeria`, {
      method: 'POST',
      body: file,
    })
    await recargar()
    return r.url
  },

  async removeGalleryImage(itemId, index) {
    await pedir(`/proyectos/${encodeURIComponent(itemId)}/galeria?i=${index}`, { method: 'DELETE' })
    await recargar()
  },

  // --- Traspaso y publicación --------------------------------------------

  async importJSON(json) {
    const datos = typeof json === 'string' ? JSON.parse(json) : json
    const r = await pedir('/importar', { method: 'POST', body: JSON.stringify(datos) })
    await recargar()
    return r.importados
  },

  exportJSON() {
    return JSON.stringify(
      {
        exportado: new Date().toISOString(),
        ajustes: {
          variant: state.variant,
          pageVariant: state.pageVariant,
          heroVariant: state.heroVariant,
        },
        proyectos: state.items,
      },
      null,
      2,
    )
  },

  /* Escribe public/data/projects.js. Hasta que se aprieta esto, los cambios
     viven solo en datos/proyectos.json y el sitio publicado no los ve. */
  async publicar() {
    const r = await pedir('/publicar', { method: 'POST' })
    return r.publicados
  },

  /* Vuelve al contenido que viene con el proyecto. */
  async reset() {
    await pedir('/importar', {
      method: 'POST',
      body: JSON.stringify({ proyectos: PORTFOLIO }),
    })
    await recargar()
  },
}

export function usePortfolio() {
  return useSyncExternalStore(
    portfolioStore.subscribe,
    () => state,
    () => state,
  )
}
