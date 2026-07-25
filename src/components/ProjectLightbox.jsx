import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { EASE } from '../lib/motion'

/* Visor de fotos estilo iOS: la imagen crece desde el lugar exacto donde
   estaba la card y al cerrarse vuelve a ese mismo lugar. Eso lo resuelve
   `layoutId` de Framer: la card y el visor comparten el mismo id, así que
   Framer interpola posición y tamaño entre ambos. El fondo entra con blur.

   El contexto deja que cualquier variante del portfolio abra el visor sin
   tener que pasar props por toda la jerarquía. */

/* Misma física de ida y de vuelta: si la apertura y el cierre usan curvas
   distintas, el movimiento se siente cortado. Un spring suave da el
   arranque y la frenada progresivos del efecto de iOS. */
const LAYOUT_SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }

const LightboxContext = createContext(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  // Si algún día se renderiza una variante fuera del provider, no rompe:
  // simplemente no hay visor y el link navega a la ficha como siempre.
  return ctx ?? { open: null, openId: null }
}

/* Junta la portada y la galería en una sola lista de fotos. */
function photosOf(project) {
  if (!project) return []
  const extra = (project.gallery ?? []).map((g) => g.url)
  return [project.image, ...extra].filter(Boolean)
}

/* Props que necesita una card del portfolio para participar del visor.

   El link a /proyecto/:id se mantiene (sirve para ctrl+click, "abrir en
   pestaña nueva" y para los buscadores), pero el click común lo intercepta
   y abre el visor en su lugar. */
/* `scope` distingue el contexto donde se dibuja la card. Hace falta porque
   algunas variantes montan la misma lista dos veces (por ejemplo la galería
   arma la pista de desktop y la pila de mobile, y CSS oculta una de las dos):
   con dos elementos vivos compartiendo layoutId, Framer elige uno como
   "líder" y deja el otro en opacity 0. Con el scope cada uno tiene su id y el
   visor usa el de la card que realmente se tocó. */
export function useProjectCard(project, scope = 'default') {
  const { open, openId } = useLightbox()
  const layoutId = `project-photo-${scope}-${project.id}`
  const isOpen = openId === layoutId

  function onClick(e) {
    if (!open) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    open(project, 0, layoutId)
  }

  return {
    /* Va en la raíz de la card. */
    onClick,
    /* Va en el contenedor de la imagen, NUNCA en la raíz de la card: la card
       tiene su propia animación de entrada y, en el mosaico, una inclinación
       3D. La proyección de layout de Framer pelea con las dos: la entrada
       quedaba trabada en opacity 0 y al abrir el visor se veía un salto. */
    imageProps: {
      layoutId,
      transition: LAYOUT_SPRING,
      // Mientras el visor muestra esta foto la ocultamos, si no se duplica.
      style: isOpen ? { opacity: 0 } : undefined,
    },
  }
}

export function ProjectLightboxProvider({ children }) {
  const [project, setProject] = useState(null)
  const [index, setIndex] = useState(0)
  /* La card de origen se oculta mientras dura la transición, si no se ve
     duplicada. No alcanza con mirar `project`: al cerrar hay que esperar a
     que termine la animación de salida, por eso se limpia en onExitComplete. */
  const [activeId, setActiveId] = useState(null)

  /* `layoutId` es el de la card concreta que se tocó; el visor se expande
     desde esa. Si no viene (por ejemplo desde la galería de la ficha), el
     visor entra sin origen y simplemente aparece. */
  const open = useCallback((p, startIndex = 0, layoutId = null) => {
    setProject(p)
    setActiveId(layoutId)
    setIndex(startIndex)
  }, [])

  const close = useCallback(() => setProject(null), [])

  const photos = useMemo(() => photosOf(project), [project])
  const many = photos.length > 1

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length])

  // Teclado: Escape cierra, flechas navegan.
  useEffect(() => {
    if (!project) return
    function onKey(e) {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight' && many) next()
      else if (e.key === 'ArrowLeft' && many) prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, many, close, next, prev])

  // Bloquea el scroll del fondo mientras el visor está abierto.
  useEffect(() => {
    if (!project) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [project])

  const value = useMemo(() => ({ open, openId: activeId }), [open, activeId])

  const hasSite = project?.url && project.url !== '#'

  return (
    <LightboxContext.Provider value={value}>
      {children}

      {createPortal(
        <AnimatePresence onExitComplete={() => setActiveId(null)}>
          {project && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
              {/* Fondo con desenfoque */}
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={close}
                className="absolute inset-0 bg-black/70"
              />

              {/* Imagen: comparte layoutId con la card de origen */}
              <motion.div
                layoutId={activeId ?? undefined}
                transition={LAYOUT_SPRING}
                className="relative z-10 max-w-5xl w-full max-h-[78vh] rounded-2xl overflow-hidden bg-ink-2 shadow-[0_40px_90px_rgba(0,0,0,0.6)]"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photos[index]}
                    src={photos[index]}
                    alt={project.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-h-[78vh] object-contain"
                  />
                </AnimatePresence>
              </motion.div>

              {/* Cerrar */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                onClick={close}
                aria-label="Cerrar"
                className="absolute top-5 right-5 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Flechas */}
              {many && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    onClick={prev}
                    aria-label="Foto anterior"
                    className="absolute left-3 sm:left-6 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    onClick={next}
                    aria-label="Foto siguiente"
                    className="absolute right-3 sm:right-6 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </>
              )}

              {/* Pie: nombre, contador y accesos */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.4, ease: EASE } }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
                className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 flex flex-wrap items-end justify-between gap-4 pointer-events-none"
              >
                <div className="pointer-events-auto">
                  <h3 className="font-display font-bold uppercase text-white text-xl sm:text-3xl leading-tight">
                    {project.name}
                  </h3>
                  <p className="font-display font-semibold uppercase text-[#7db6e8] text-xs sm:text-sm mt-1">
                    {project.type}
                    {many && <span className="ml-3 text-white/40">{index + 1} / {photos.length}</span>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                  <Link
                    to={`/proyecto/${project.id}`}
                    onClick={close}
                    className="rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white/20 transition-colors"
                  >
                    Ver ficha completa
                  </Link>
                  {hasSite && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-white text-ink font-body font-semibold text-sm px-5 py-2.5 hover:bg-white/90 transition-colors"
                    >
                      Visitar sitio
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </LightboxContext.Provider>
  )
}
