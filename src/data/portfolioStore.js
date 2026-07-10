import { useSyncExternalStore } from 'react'
import { PORTFOLIO } from './content'

/* Store del portfolio con persistencia en localStorage.
   - items: lista completa de proyectos (la página /portfolio muestra todos)
   - home: flag por proyecto → aparece en la grilla del inicio
   - variant: diseño del portfolio del inicio ('classic' | 'showcase')
   El admin (/admin) edita este store; "Restablecer" vuelve a los datos de content.js */

const STORAGE_KEY = 'ltweb-portfolio-v1'

const defaults = () => ({
  variant: 'classic',
  items: PORTFOLIO.map((p) => ({ ...p })),
})

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return defaults()
    return { ...defaults(), ...parsed }
  } catch {
    return defaults()
  }
}

let state = load()
const listeners = new Set()

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

export const portfolioStore = {
  get: () => state,
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setVariant(variant) {
    state = { ...state, variant }
    emit()
  },
  updateItem(id, patch) {
    state = { ...state, items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
    emit()
  },
  addItem(item) {
    const id = 'p' + Date.now().toString(36)
    state = { ...state, items: [...state.items, { size: 'normal', home: true, url: '#', ...item, id }] }
    emit()
    return id
  },
  removeItem(id) {
    state = { ...state, items: state.items.filter((it) => it.id !== id) }
    emit()
  },
  moveItem(id, dir) {
    const items = [...state.items]
    const i = items.findIndex((it) => it.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= items.length) return
    ;[items[i], items[j]] = [items[j], items[i]]
    state = { ...state, items }
    emit()
  },
  importJSON(json) {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed.items)) throw new Error('JSON inválido: falta "items"')
    state = { ...defaults(), ...parsed }
    emit()
  },
  exportJSON() {
    return JSON.stringify(state, null, 2)
  },
  reset() {
    state = defaults()
    emit()
  },
}

export function usePortfolio() {
  return useSyncExternalStore(portfolioStore.subscribe, portfolioStore.get)
}
