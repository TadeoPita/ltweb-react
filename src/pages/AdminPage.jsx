import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, Trash2, Plus, Download, Upload, RotateCcw, Home, Eye, EyeOff } from 'lucide-react'
import { portfolioStore, usePortfolio } from '../data/portfolioStore'

/* Panel de administración del portfolio.
   Los cambios se guardan en Supabase y se reflejan al instante para
   cualquier visitante del sitio, no solo en este navegador.
   "Exportar JSON" permite guardar un respaldo de la configuración. */

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

/* Buffer local por campo: la UI responde al instante (setLocal es síncrono),
   y recién después de `delay` ms sin tipear se manda la escritura real a
   Supabase. Mientras el campo tiene cambios sin confirmar ("dirty"), se
   ignoran las actualizaciones que lleguen desde afuera (realtime) para que
   no te "pisen" lo que estás escribiendo. */
function useDebouncedField(value, commit, delay = 500) {
  const [local, setLocal] = useState(value)
  const dirty = useRef(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!dirty.current) setLocal(value)
  }, [value])

  useEffect(() => () => clearTimeout(timer.current), [])

  function onChange(next) {
    setLocal(next)
    dirty.current = true
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        await commit(next)
      } finally {
        dirty.current = false
      }
    }, delay)
  }

  return [local, onChange]
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

function ItemEditor({ item, index, total }) {
  const fileRef = useRef(null)
  const galleryRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [galleryBusy, setGalleryBusy] = useState(false)

  const update = (patch) => portfolioStore.updateItem(item.id, patch)

  const [name, setName] = useDebouncedField(item.name, (v) => update({ name: v }))
  const [type, setType] = useDebouncedField(item.type, (v) => update({ type: v }))
  const [url, setUrl] = useDebouncedField(item.url ?? '', (v) => update({ url: v }))
  const [image, setImage] = useDebouncedField(item.image, (v) => update({ image: v }))
  const [label, setLabel] = useDebouncedField(item.label ?? '', (v) => update({ label: v || undefined }))
  // Selección/checkbox: no hay riesgo de "perder letras", así que se confirma al toque (delay 0)
  // pero igual usan el buffer local para que el click se vea reflejado sin esperar la ida y vuelta a Supabase.
  const [size, setSize] = useDebouncedField(item.size ?? 'normal', (v) => update({ size: v }), 0)
  const [blurred, setBlurred] = useDebouncedField(!!item.blurred, (v) => update({ blurred: v }), 0)
  const [home, setHome] = useDebouncedField(!!item.home, (v) => update({ home: v }), 0)

  // Campos de la ficha del proyecto (/proyecto/:id)
  const [category, setCategory] = useDebouncedField(item.category ?? '', (v) => update({ category: v }))
  const [problem, setProblem] = useDebouncedField(item.problem ?? '', (v) => update({ problem: v }))
  const [solution, setSolution] = useDebouncedField(item.solution ?? '', (v) => update({ solution: v }))
  const [description, setDescription] = useDebouncedField(item.description ?? '', (v) => update({ description: v }))
  const [services, setServices] = useDebouncedField(item.services ?? '', (v) => update({ services: v }))

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_UPLOAD_BYTES) {
      alert('La imagen pesa más de 8 MB. Subí una versión más liviana.')
      e.target.value = ''
      return
    }
    setUploading(true)
    try {
      await portfolioStore.uploadImage(file, item.id)
    } catch (err) {
      alert('No se pudo subir la imagen: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  /* Galería: se pueden elegir varias fotos de una. Se suben de a una para
     poder avisar cuál falló sin cortar el resto. */
  async function onGalleryFiles(e) {
    const files = [...(e.target.files ?? [])]
    if (!files.length) return
    const tooBig = files.filter((f) => f.size > MAX_UPLOAD_BYTES)
    if (tooBig.length) {
      alert(`Estas superan los 8 MB y se omiten:\n${tooBig.map((f) => f.name).join('\n')}`)
    }
    setGalleryBusy(true)
    try {
      for (const file of files.filter((f) => f.size <= MAX_UPLOAD_BYTES)) {
        try {
          await portfolioStore.addGalleryImage(file, item.id)
        } catch (err) {
          alert(`No se pudo subir "${file.name}": ` + err.message)
        }
      }
    } finally {
      setGalleryBusy(false)
      e.target.value = ''
    }
  }

  async function removeGalleryPhoto(i) {
    setGalleryBusy(true)
    try {
      await portfolioStore.removeGalleryImage(item.id, i)
    } catch (err) {
      alert('No se pudo eliminar la foto: ' + err.message)
    } finally {
      setGalleryBusy(false)
    }
  }

  const gallery = item.gallery ?? []

  return (
    <div className="rounded-2xl bg-white border border-black/8 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={image} alt="" className="w-16 h-12 object-cover object-top rounded-md border border-black/10 shrink-0" />
          <div className="min-w-0">
            <p className="font-display font-bold uppercase truncate">{name || 'Sin nombre'}</p>
            <p className="text-xs text-ink/50">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            title={home ? 'Visible en el inicio' : 'Oculto en el inicio'}
            onClick={() => setHome(!home)}
            className={
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ' +
              (home ? 'bg-ink text-white border-ink' : 'bg-white text-ink/50 border-black/15')
            }
          >
            {home ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
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
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Tipo (subtítulo celeste)">
          <input className={inputCls} value={type} onChange={(e) => setType(e.target.value)} />
        </Field>
        <Field label="URL del sitio">
          <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Imagen (URL o archivo, hasta 8MB)">
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/... o https://..."
              disabled={uploading}
            />
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="shrink-0 rounded-lg border border-black/10 px-3 text-xs font-semibold hover:bg-black/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
          </div>
        </Field>
        <Field label="Tamaño de card">
          <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Etiqueta overlay (opcional)">
          <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder='Ej: "En Actualización"' />
        </Field>
        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={blurred}
            onChange={(e) => setBlurred(e.target.checked)}
            className="w-4 h-4 accent-ink cursor-pointer"
          />
          <span className="text-sm font-body">Imagen desenfocada (blur) — ej. "Próximamente"</span>
        </label>
      </div>

      {/* Ficha del proyecto: lo que se ve al entrar a /proyecto/<id> */}
      <details className="border-t border-black/8 pt-4">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-ink/50 select-none">
          Ficha del proyecto (página de detalle)
        </summary>
        <div className="mt-4 grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Categoría (rubro)">
              <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Salud, Educación, Tecnología" />
            </Field>
            <Field label="Servicios (separados por coma)">
              <input className={inputCls} value={services} onChange={(e) => setServices(e.target.value)} placeholder="UX/UI, WordPress, Responsive" />
            </Field>
          </div>
          <Field label="Problema — qué necesitaba el cliente">
            <textarea className={inputCls} rows={2} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Una o dos frases." />
          </Field>
          <Field label="Solución — qué hicimos">
            <textarea className={inputCls} rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Una o dos frases." />
          </Field>
          <Field label="Qué hicimos (detalle largo — un párrafo por línea)">
            <textarea className={inputCls} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explicación completa del trabajo. Cada salto de línea es un párrafo nuevo." />
          </Field>
          {/* Galería: fotos extra que se muestran en la ficha */}
          <div className="border-t border-black/8 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                Galería de fotos ({gallery.length})
              </span>
              <button
                onClick={() => galleryRef.current.click()}
                disabled={galleryBusy}
                className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {galleryBusy ? 'Subiendo...' : 'Agregar fotos'}
              </button>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onGalleryFiles}
                disabled={galleryBusy}
              />
            </div>

            {gallery.length === 0 ? (
              <p className="mt-2 text-xs text-ink/40 font-body">
                Sin fotos extra. Podés subir varias a la vez (hasta 8 MB cada una).
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {gallery.map((photo, i) => (
                  <div key={photo.url} className="relative group">
                    <img
                      src={photo.url}
                      alt=""
                      className="w-full h-20 object-cover rounded-md border border-black/10"
                    />
                    <button
                      onClick={() => removeGalleryPhoto(i)}
                      disabled={galleryBusy}
                      title="Quitar foto"
                      className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded-full bg-white/90 border border-black/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a
            href={`/proyecto/${item.id}`}
            target="_blank"
            rel="noreferrer"
            className="justify-self-start text-xs font-semibold text-ink/60 hover:text-ink underline"
          >
            Ver la ficha en la web →
          </a>
        </div>
      </details>
    </div>
  )
}

const VARIANTS = [
  { value: 'classic', label: 'Clásico (grilla)' },
  { value: 'showcase', label: 'Lista interactiva' },
  { value: 'gallery', label: 'Galería horizontal' },
  { value: 'bento', label: 'Mosaico bento' },
  { value: 'stack', label: 'Mazo interactivo' },
]

function VariantPicker({ title, hint, value, onChange }) {
  return (
    <div className="rounded-2xl bg-white border border-black/8 p-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-display font-bold uppercase">{title}</p>
        <p className="text-sm text-ink/50 font-body">{hint}</p>
      </div>
      <div className="flex flex-wrap rounded-full border border-black/10 p-1 bg-paper">
        {VARIANTS.map((v) => (
          <button
            key={v.value}
            onClick={() => onChange(v.value)}
            className={
              'rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ' +
              (value === v.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink')
            }
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { items, variant, pageVariant, loading, error } = usePortfolio()
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

  async function doImport() {
    try {
      await portfolioStore.importJSON(importText)
      setImportOpen(false)
      setImportText('')
    } catch (e) {
      alert('No se pudo importar: ' + e.message)
    }
  }

  if (loading) {
    return (
      <main className="bg-paper min-h-screen flex items-center justify-center">
        <p className="font-body text-ink/50">Cargando portfolio...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-paper min-h-screen flex items-center justify-center p-6 text-center">
        <p className="font-body text-red-500">Error al cargar el portfolio: {error}</p>
      </main>
    )
  }

  return (
    <main className="bg-paper min-h-screen pb-32">
      <header className="bg-white border-b border-black/8">
        <div className="mx-auto max-w-[1140px] px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold uppercase text-2xl">Admin · Portfolio</h1>
            <p className="text-sm text-ink/50 font-body">
              Los cambios se guardan automáticamente y se ven al instante para cualquier visitante de la web.
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

        <VariantPicker
          title="Diseño del portfolio en el inicio"
          hint="Cómo se ve la sección de portfolio en la página principal."
          value={variant}
          onChange={portfolioStore.setVariant}
        />
        <VariantPicker
          title="Diseño de la página /portfolio completa"
          hint="Cómo se ve el portfolio completo cuando alguien entra a /portfolio."
          value={pageVariant}
          onChange={portfolioStore.setPageVariant}
        />

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
