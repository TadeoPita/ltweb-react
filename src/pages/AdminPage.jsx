import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, Trash2, Plus, Download, Upload, RotateCcw, Home, Eye, EyeOff } from 'lucide-react'
import { portfolioStore, usePortfolio } from '../data/portfolioStore'

/* Panel de administración del portfolio.
   Los cambios se guardan en el navegador (localStorage) al instante.
   "Exportar JSON" permite guardar la configuración para pasarla a otro
   navegador o dejarla fija en el código (src/data/content.js). */

const SIZES = [
  { value: 'normal', label: 'Normal (1 col)' },
  { value: 'tall', label: 'Alta (1 col, imagen alta)' },
  { value: 'wide', label: 'Ancha (2 col)' },
  { value: 'full', label: 'Completa (3 col)' },
]

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink/50 mb-1">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-body focus:outline-none focus:border-black/40'

function ItemEditor({ item, index, total }) {
  const fileRef = useRef(null)

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      alert('La imagen pesa más de 1.5 MB. Para no llenar el almacenamiento del navegador, subí una versión comprimida o usá una URL.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => portfolioStore.updateItem(item.id, { image: reader.result })
    reader.readAsDataURL(file)
  }

  return (
    <div className="rounded-2xl bg-white border border-black/8 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={item.image} alt="" className="w-16 h-12 object-cover object-top rounded-md border border-black/10 shrink-0" />
          <div className="min-w-0">
            <p className="font-display font-bold uppercase truncate">{item.name || 'Sin nombre'}</p>
            <p className="text-xs text-ink/50">{item.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            title={item.home ? 'Visible en el inicio' : 'Oculto en el inicio'}
            onClick={() => portfolioStore.updateItem(item.id, { home: !item.home })}
            className={
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ' +
              (item.home ? 'bg-ink text-white border-ink' : 'bg-white text-ink/50 border-black/15')
            }
          >
            {item.home ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Inicio
          </button>
          <button title="Subir" onClick={() => portfolioStore.moveItem(item.id, -1)} disabled={index === 0} className="p-2 rounded-lg border border-black/10 disabled:opacity-30 hover:bg-black/5 cursor-pointer">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button title="Bajar" onClick={() => portfolioStore.moveItem(item.id, 1)} disabled={index === total - 1} className="p-2 rounded-lg border border-black/10 disabled:opacity-30 hover:bg-black/5 cursor-pointer">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            title="Eliminar"
            onClick={() => { if (confirm(`¿Eliminar "${item.name}" del portfolio?`)) portfolioStore.removeItem(item.id) }}
            className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="Nombre">
          <input className={inputCls} value={item.name} onChange={(e) => portfolioStore.updateItem(item.id, { name: e.target.value })} />
        </Field>
        <Field label="Tipo (subtítulo celeste)">
          <input className={inputCls} value={item.type} onChange={(e) => portfolioStore.updateItem(item.id, { type: e.target.value })} />
        </Field>
        <Field label="URL del sitio">
          <input className={inputCls} value={item.url ?? ''} onChange={(e) => portfolioStore.updateItem(item.id, { url: e.target.value })} placeholder="https://..." />
        </Field>
        <Field label="Imagen (URL o archivo)">
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={item.image.startsWith('data:') ? '(imagen subida)' : item.image}
              onChange={(e) => portfolioStore.updateItem(item.id, { image: e.target.value })}
              placeholder="/images/... o https://..."
            />
            <button onClick={() => fileRef.current.click()} className="shrink-0 rounded-lg border border-black/10 px-3 text-xs font-semibold hover:bg-black/5 cursor-pointer">
              Subir
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>
        </Field>
        <Field label="Tamaño de card">
          <select className={inputCls} value={item.size ?? 'normal'} onChange={(e) => portfolioStore.updateItem(item.id, { size: e.target.value })}>
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Etiqueta overlay (opcional)">
          <input className={inputCls} value={item.label ?? ''} onChange={(e) => portfolioStore.updateItem(item.id, { label: e.target.value || undefined })} placeholder='Ej: "En Actualización"' />
        </Field>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { items, variant } = usePortfolio()
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Admin Portfolio - LTWEB'
    return () => { document.title = 'Diseño y Desarrollo Web En Argentina - LTWEB' }
  }, [])

  function exportJSON() {
    const blob = new Blob([portfolioStore.exportJSON()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ltweb-portfolio.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function doImport() {
    try {
      portfolioStore.importJSON(importText)
      setImportOpen(false)
      setImportText('')
    } catch (e) {
      alert('No se pudo importar: ' + e.message)
    }
  }

  return (
    <main className="bg-paper min-h-screen pb-32">
      <header className="bg-white border-b border-black/8">
        <div className="mx-auto max-w-[1140px] px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold uppercase text-2xl">Admin · Portfolio</h1>
            <p className="text-sm text-ink/50 font-body">
              Los cambios se guardan automáticamente en este navegador y se ven al instante en la web.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5">
              <Home className="w-4 h-4" /> Ver web
            </Link>
            <button onClick={exportJSON} className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5 cursor-pointer">
              <Download className="w-4 h-4" /> Exportar JSON
            </button>
            <button onClick={() => setImportOpen(!importOpen)} className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5 cursor-pointer">
              <Upload className="w-4 h-4" /> Importar
            </button>
            <button
              onClick={() => { if (confirm('¿Volver a los datos originales? Se pierden los cambios guardados en este navegador.')) portfolioStore.reset() }}
              className="flex items-center gap-2 rounded-lg border border-red-200 text-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Restablecer
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1140px] px-6 mt-8 flex flex-col gap-6">
        {importOpen && (
          <div className="rounded-2xl bg-white border border-black/8 p-5">
            <p className="font-semibold text-sm mb-2">Pegá acá el JSON exportado:</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={6} className={inputCls + ' font-mono text-xs'} />
            <button onClick={doImport} className="mt-3 rounded-lg bg-ink text-white px-5 py-2 text-sm font-semibold cursor-pointer">
              Importar
            </button>
          </div>
        )}

        {/* Diseño del portfolio del inicio */}
        <div className="rounded-2xl bg-white border border-black/8 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold uppercase">Diseño del portfolio en el inicio</p>
            <p className="text-sm text-ink/50 font-body">Podés cambiar entre los dos diseños cuando quieras.</p>
          </div>
          <div className="flex rounded-full border border-black/10 p-1 bg-paper">
            {[
              { value: 'classic', label: 'Clásico (grilla)' },
              { value: 'showcase', label: 'Lista interactiva' },
              { value: 'gallery', label: 'Galería horizontal' },
            ].map((v) => (
              <button
                key={v.value}
                onClick={() => portfolioStore.setVariant(v.value)}
                className={
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ' +
                  (variant === v.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink')
                }
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink/60">
            {items.length} proyectos · {items.filter((i) => i.home).length} visibles en el inicio · todos aparecen en /portfolio
          </p>
          <button
            onClick={() => portfolioStore.addItem({ name: 'NUEVO PROYECTO', type: 'LANDING PAGE', image: '/images/pf-auralys.png' })}
            className="flex items-center gap-2 rounded-lg bg-ink text-white px-4 py-2 text-sm font-semibold hover:bg-black cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Agregar proyecto
          </button>
        </div>

        {items.map((item, i) => (
          <ItemEditor key={item.id} item={item} index={i} total={items.length} />
        ))}
      </div>
    </main>
  )
}
