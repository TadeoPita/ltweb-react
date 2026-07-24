import { useSyncExternalStore } from 'react'
import { PORTFOLIO } from './content'
import { supabase } from '../lib/supabase'

/* Store del portfolio respaldado por Supabase (tablas portfolio_items y
   portfolio_settings, bucket portfolio-images). Lectura pública; escritura
   requiere sesión válida de Firebase (Third-Party Auth + políticas RLS
   configuradas en Supabase). El admin (/admin) edita este store y los
   cambios se reflejan para todos los visitantes en tiempo real. */

let state = { variant: 'gallery', pageVariant: 'classic', items: [], loading: true, error: null }
const listeners = new Set()

function emit() {
  listeners.forEach((l) => l())
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
    }))
}

async function loadInitial() {
  const [itemsRes, settingsRes] = await Promise.all([
    supabase.from('portfolio_items').select('*').order('position'),
    supabase.from('portfolio_settings').select('*').eq('id', 1).maybeSingle(),
  ])
  const err = itemsRes.error || settingsRes.error
  if (err) {
    state = { ...state, loading: false, error: err.message }
    emit()
    return
  }
  if (itemsRes.data.length === 0 && !state.seeding) {
    await seedDefaults()
    return
  }
  state = {
    variant: settingsRes.data?.variant ?? 'gallery',
    pageVariant: settingsRes.data?.page_variant ?? 'classic',
    items: itemsFromRows(itemsRes.data),
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
  await supabase.from('portfolio_items').insert(rows)
  await supabase.from('portfolio_settings').upsert({ id: 1, variant: 'gallery', page_variant: 'classic' })
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

supabase
  .channel('portfolio-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, scheduleReload)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_settings' }, scheduleReload)
  .subscribe()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearTimeout(reloadTimer)
    supabase.removeAllChannels()
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
    must(await supabase.from('portfolio_settings').update({ variant }).eq('id', 1))
    state = { ...state, variant }
    emit()
  },

  async setPageVariant(pageVariant) {
    must(await supabase.from('portfolio_settings').update({ page_variant: pageVariant }).eq('id', 1))
    state = { ...state, pageVariant }
    emit()
  },

  async updateItem(id, patch) {
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
    must(await supabase.from('portfolio_items').update(row).eq('id', id))
    state = { ...state, items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
    emit()
  },

  async addItem(item) {
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
    }
    must(await supabase.from('portfolio_items').insert({ id, ...row, position: state.items.length }))
    state = {
      ...state,
      items: [...state.items, { id, ...row, label: row.label ?? undefined, imagePath: undefined }],
    }
    emit()
    return id
  },

  async removeItem(id) {
    const item = state.items.find((it) => it.id === id)
    must(await supabase.from('portfolio_items').delete().eq('id', id))
    if (item?.imagePath) {
      supabase.storage.from('portfolio-images').remove([item.imagePath]).catch(() => {})
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

  async importJSON(json) {
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
      position: i,
    }))
    must(await supabase.from('portfolio_items').insert(rows))
    must(
      await supabase.from('portfolio_settings').upsert({
        id: 1,
        variant: parsed.variant ?? 'gallery',
        page_variant: parsed.pageVariant ?? 'classic',
      }),
    )
    await loadInitial()
  },

  exportJSON() {
    return JSON.stringify({ variant: state.variant, pageVariant: state.pageVariant, items: state.items }, null, 2)
  },

  async reset() {
    must(await supabase.from('portfolio_items').delete().neq('id', ''))
    await seedDefaults()
  },
}

export function usePortfolio() {
  return useSyncExternalStore(portfolioStore.subscribe, portfolioStore.get)
}
