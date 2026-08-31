import { useSyncExternalStore } from 'react'
import { PORTFOLIO } from './content'
import { restSelect } from '../lib/supabaseRest'
import { comprimirImagen } from '../lib/comprimirImagen'

/* Store del portfolio respaldado por Supabase (tablas portfolio_items y
   portfolio_settings, bucket portfolio-images). Lectura pública; escritura
   requiere sesión válida de Firebase (Third-Party Auth + políticas RLS
   configuradas en Supabase).

   La lectura va por HTTP contra la API REST (ver lib/supabaseRest.js) para no
   cargar el SDK en el sitio público. El SDK completo —escrituras, Storage y
   tiempo real— se importa recién cuando hace falta, o sea en /admin. */

let clientPromise
function sb() {
  clientPromise ??= import('../lib/supabase').then((m) => m.supabase)
  return clientPromise
}

let state = { variant: 'gallery', pageVariant: 'classic', heroVariant: 'centered', items: [], loading: true, error: null }
const listeners = new Set()

function emit() {
  listeners.forEach((l) => l())
}

/* La galería se guarda como JSON en una columna de texto:
   [{ url, path }]. Guardamos también el path del Storage para poder
   borrar el archivo cuando se saca una foto de la galería. */
function parseGallery(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((g) => g && g.url) : []
  } catch {
    return []
  }
}

function itemsFromRows(rows) {
  return rows
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      image: r.image,
      imagePath: r.image_path ?? undefined,
      url: r.url,
      size: r.size,
      home: r.home,
      label: r.label ?? undefined,
      blurred: r.blurred,
      category: r.category ?? '',
      problem: r.problem ?? '',
      solution: r.solution ?? '',
      description: r.description ?? '',
      services: r.services ?? '',
      gallery: parseGallery(r.gallery),
      beforeImage: r.before_image ?? '',
      beforeImagePath: r.before_image_path ?? '',
    }))
}

/* Datos publicados por el panel PHP.

   El panel escribe /data/projects.js, que index.html carga con una etiqueta
   <script> comun antes del bundle. O sea que cuando React arranca los
   proyectos ya estan en memoria: no hay pedido de red, ni pantalla de carga,
   ni salto de maqueta cuando llegan.

   Si el archivo no esta —en desarrollo, o antes de la primera publicacion— se
   devuelve null y sigue el camino de siempre contra Supabase. Los dos
   conviven a proposito: asi el sitio no depende de que la mudanza este
   terminada para seguir funcionando. */
function datosPublicados() {
  if (typeof window === 'undefined') return null
  const d = window.__LTWEB_DATOS__
  if (!d || !Array.isArray(d.proyectos) || d.proyectos.length === 0) return null
  return d
}

/* El panel ya entrega los campos con los nombres del sitio; lo unico que hace
   falta es asegurar los tipos y poner los valores por defecto. */
function itemsPublicados(proyectos) {
  return proyectos.map((p) => ({
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
    /* La galeria del panel viejo eran objetos {url, path} y la del nuevo son
       rutas sueltas. Se aceptan las dos para que un export viejo importado no
       deje las fotos invisibles. */
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((g) => (typeof g === 'string' ? { url: g } : g)).filter((g) => g && g.url)
      : [],
    beforeImage: p.beforeImage ?? '',
    beforeImagePath: '',
  }))
}

async function loadInitial() {
  const publicado = datosPublicados()
  if (publicado) {
    state = {
      variant: publicado.ajustes?.variant ?? 'gallery',
      pageVariant: publicado.ajustes?.pageVariant ?? 'classic',
      heroVariant: publicado.ajustes?.heroVariant ?? 'centered',
      items: itemsPublicados(publicado.proyectos),
      loading: false,
      error: null,
    }
    emit()
    return
  }

  let items, settingsRows
  try {
    ;[items, settingsRows] = await Promise.all([
      restSelect('portfolio_items', '&order=position'),
      restSelect('portfolio_settings', '&id=eq.1'),
    ])
  } catch (err) {
    state = { ...state, loading: false, error: err.message }
    emit()
    return
  }
  if (items.length === 0 && !state.seeding) {
    await seedDefaults()
    return
  }
  const settings = settingsRows[0]
  state = {
    variant: settings?.variant ?? 'gallery',
    pageVariant: settings?.page_variant ?? 'classic',
    heroVariant: settings?.hero_variant ?? 'centered',
    items: itemsFromRows(items),
    loading: false,
    error: null,
  }
  emit()
}

async function seedDefaults() {
  state = { ...state, seeding: true }
  const rows = PORTFOLIO.map((p, i) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    image: p.image,
    url: p.url ?? '#',
    size: p.size ?? 'normal',
    home: p.home ?? true,
    label: p.label ?? null,
    blurred: p.blurred ?? false,
    position: i,
  }))
  const client = await sb()
  await client.from('portfolio_items').insert(rows)
  await client
    .from('portfolio_settings')
    .upsert({ id: 1, variant: 'gallery', page_variant: 'classic', hero_variant: 'centered' })
  state = { ...state, seeding: false }
  await loadInitial()
}

loadInitial()

// Cualquier cambio en las tablas (desde /admin o desde otra pestaña) recarga el estado.
// Debounce corto para no disparar N recargas cuando una operación toca varias filas.
let reloadTimer
function scheduleReload() {
  clearTimeout(reloadTimer)
  reloadTimer = setTimeout(loadInitial, 150)
}

/* Suscripción a cambios en vivo. Antes se abría sola al importar el store, o
   sea que cada visitante del sitio público mantenía un WebSocket abierto solo
   para que nosotros viéramos los cambios mientras editábamos. Ahora la levanta
   /admin explícitamente: el visitante ve el contenido de cuando cargó la
   página, que es exactamente lo que necesita. */
let realtimeStarted = false
export function startRealtime() {
  if (realtimeStarted) return
  realtimeStarted = true
  sb().then((client) => {
    client
      .channel('portfolio-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, scheduleReload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_settings' }, scheduleReload)
      .subscribe()
  })
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearTimeout(reloadTimer)
    if (realtimeStarted) sb().then((client) => client.removeAllChannels())
  })
}

function must(result) {
  if (result.error) throw result.error
  return result
}

export const portfolioStore = {
  get: () => state,
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  async setVariant(variant) {
    const supabase = await sb()
    must(await supabase.from('portfolio_settings').update({ variant }).eq('id', 1))
    state = { ...state, variant }
    emit()
  },

  async setPageVariant(pageVariant) {
    const supabase = await sb()
    must(await supabase.from('portfolio_settings').update({ page_variant: pageVariant }).eq('id', 1))
    state = { ...state, pageVariant }
    emit()
  },

  async setHeroVariant(heroVariant) {
    const supabase = await sb()
    must(await supabase.from('portfolio_settings').update({ hero_variant: heroVariant }).eq('id', 1))
    state = { ...state, heroVariant }
    emit()
  },

  async updateItem(id, patch) {
    const supabase = await sb()
    const row = {}
    if ('name' in patch) row.name = patch.name
    if ('type' in patch) row.type = patch.type
    if ('image' in patch) row.image = patch.image
    if ('imagePath' in patch) row.image_path = patch.imagePath ?? null
    if ('url' in patch) row.url = patch.url
    if ('size' in patch) row.size = patch.size
    if ('home' in patch) row.home = patch.home
    if ('label' in patch) row.label = patch.label ?? null
    if ('blurred' in patch) row.blurred = patch.blurred
    if ('category' in patch) row.category = patch.category ?? ''
    if ('problem' in patch) row.problem = patch.problem ?? ''
    if ('solution' in patch) row.solution = patch.solution ?? ''
    if ('description' in patch) row.description = patch.description ?? ''
    if ('services' in patch) row.services = patch.services ?? ''
    if ('gallery' in patch) row.gallery = JSON.stringify(patch.gallery ?? [])
    if ('beforeImage' in patch) row.before_image = patch.beforeImage ?? ''
    if ('beforeImagePath' in patch) row.before_image_path = patch.beforeImagePath ?? ''
    must(await supabase.from('portfolio_items').update(row).eq('id', id))
    state = { ...state, items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
    emit()
  },

  async addItem(item) {
    const supabase = await sb()
    const id = 'p' + Date.now().toString(36)
    const row = {
      name: item.name ?? '',
      type: item.type ?? '',
      image: item.image ?? '',
      url: item.url ?? '#',
      size: item.size ?? 'normal',
      home: item.home ?? true,
      label: item.label ?? null,
      blurred: item.blurred ?? false,
      category: item.category ?? '',
      problem: item.problem ?? '',
      solution: item.solution ?? '',
      description: item.description ?? '',
      services: item.services ?? '',
      gallery: '[]',
    }
    must(await supabase.from('portfolio_items').insert({ id, ...row, position: state.items.length }))
    state = {
      ...state,
      items: [...state.items, { id, ...row, label: row.label ?? undefined, imagePath: undefined, gallery: [] }],
    }
    emit()
    return id
  },

  async removeItem(id) {
    const supabase = await sb()
    const item = state.items.find((it) => it.id === id)
    must(await supabase.from('portfolio_items').delete().eq('id', id))
    // Limpiamos del Storage tanto la portada como las fotos de la galería.
    const paths = [item?.imagePath, item?.beforeImagePath, ...(item?.gallery ?? []).map((g) => g.path)].filter(Boolean)
    if (paths.length) {
      supabase.storage.from('portfolio-images').remove(paths).catch(() => {})
    }
    const remaining = state.items.filter((it) => it.id !== id)
    state = { ...state, items: remaining }
    emit()
    // Renumerar para que las posiciones sigan 0..n-1 sin huecos (moveItem depende de esto).
    await Promise.all(
      remaining.map((it, i) => supabase.from('portfolio_items').update({ position: i }).eq('id', it.id)),
    )
  },

  async moveItem(id, dir) {
    const supabase = await sb()
    const items = state.items
    const i = items.findIndex((it) => it.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= items.length) return
    await Promise.all([
      must(await supabase.from('portfolio_items').update({ position: j }).eq('id', items[i].id)),
      must(await supabase.from('portfolio_items').update({ position: i }).eq('id', items[j].id)),
    ])
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    state = { ...state, items: next }
    emit()
  },

  async uploadImage(file, itemId) {
    const supabase = await sb()
    file = await comprimirImagen(file)
    const path = `${itemId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    const prev = state.items.find((it) => it.id === itemId)?.imagePath
    await portfolioStore.updateItem(itemId, { image: data.publicUrl, imagePath: path })
    if (prev) {
      supabase.storage.from('portfolio-images').remove([prev]).catch(() => {})
    }
  },

  /* Sube la captura del sitio anterior, para el comparador antes/después. */
  async uploadBeforeImage(file, itemId) {
    const supabase = await sb()
    file = await comprimirImagen(file)
    const path = `${itemId}/antes/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    const prev = state.items.find((it) => it.id === itemId)?.beforeImagePath
    await portfolioStore.updateItem(itemId, { beforeImage: data.publicUrl, beforeImagePath: path })
    if (prev) supabase.storage.from('portfolio-images').remove([prev]).catch(() => {})
  },

  async removeBeforeImage(itemId) {
    const supabase = await sb()
    const prev = state.items.find((it) => it.id === itemId)?.beforeImagePath
    await portfolioStore.updateItem(itemId, { beforeImage: '', beforeImagePath: '' })
    if (prev) supabase.storage.from('portfolio-images').remove([prev]).catch(() => {})
  },

  /* Sube una foto extra a la galería del proyecto y la agrega al final. */
  async addGalleryImage(file, itemId) {
    const supabase = await sb()
    file = await comprimirImagen(file)
    const path = `${itemId}/galeria/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
    const current = state.items.find((it) => it.id === itemId)?.gallery ?? []
    await portfolioStore.updateItem(itemId, {
      gallery: [...current, { url: data.publicUrl, path }],
    })
  },

  /* Saca una foto de la galería y borra el archivo del Storage si era nuestro. */
  async removeGalleryImage(itemId, index) {
    const supabase = await sb()
    const current = state.items.find((it) => it.id === itemId)?.gallery ?? []
    const removed = current[index]
    await portfolioStore.updateItem(itemId, {
      gallery: current.filter((_, i) => i !== index),
    })
    if (removed?.path) {
      supabase.storage.from('portfolio-images').remove([removed.path]).catch(() => {})
    }
  },

  async importJSON(json) {
    const supabase = await sb()
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed.items)) throw new Error('JSON inválido: falta "items"')
    must(await supabase.from('portfolio_items').delete().neq('id', ''))
    const rows = parsed.items.map((p, i) => ({
      id: p.id ?? 'p' + Date.now().toString(36) + i,
      name: p.name ?? '',
      type: p.type ?? '',
      image: p.image ?? '',
      image_path: p.imagePath ?? null,
      url: p.url ?? '#',
      size: p.size ?? 'normal',
      home: p.home ?? true,
      label: p.label ?? null,
      blurred: p.blurred ?? false,
      category: p.category ?? '',
      problem: p.problem ?? '',
      solution: p.solution ?? '',
      description: p.description ?? '',
      services: p.services ?? '',
      gallery: JSON.stringify(p.gallery ?? []),
      position: i,
    }))
    must(await supabase.from('portfolio_items').insert(rows))
    must(
      await supabase.from('portfolio_settings').upsert({
        id: 1,
        variant: parsed.variant ?? 'gallery',
        page_variant: parsed.pageVariant ?? 'classic',
        hero_variant: parsed.heroVariant ?? 'centered',
      }),
    )
    await loadInitial()
  },

  exportJSON() {
    return JSON.stringify(
      {
        variant: state.variant,
        pageVariant: state.pageVariant,
        heroVariant: state.heroVariant,
        items: state.items,
      },
      null,
      2,
    )
  },

  async reset() {
    const supabase = await sb()
    must(await supabase.from('portfolio_items').delete().neq('id', ''))
    await seedDefaults()
  },
}

export function usePortfolio() {
  return useSyncExternalStore(portfolioStore.subscribe, portfolioStore.get)
}
