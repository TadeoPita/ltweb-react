import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { EASE } from '../lib/motion'
import { mediana } from '../lib/imagen'

const RESORTE = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }
const RADIO = 16

const LightboxContext = createContext(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  return ctx ?? { open: null, openId: null }
}

function photosOf(project) {
  if (!project) return []
  const extra = (project.gallery ?? []).map((g) => g.url)
  return [project.image, ...extra].filter(Boolean)
}

function rectDe(id) {
  if (!id) return null
  const el = document.querySelector(`[data-foto-id="${id}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return null
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

function rectCentrado() {
  const ancho = Math.min(window.innerWidth * 0.5, 560)
  const alto = Math.min(window.innerHeight * 0.4, 340)
  return { left: (window.innerWidth - ancho) / 2, top: (window.innerHeight - alto) / 2, width: ancho, height: alto }
}

export function useProjectCard(project, scope = 'default') {
  const { open, openId } = useLightbox()
  const id = `project-photo-${scope}-${project.id}`
  const isOpen = openId === id

  function onClick(e) {
    if (!open) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    open(project, 0, id)
  }

  return {
    onClick,
    imageProps: {
      'data-foto-id': id,
      style: { opacity: isOpen ? 0 : 1, transition: 'opacity 0.18s ease' },
    },
  }
}

export function ProjectLightboxProvider({ children }) {
  const reducir = useReducedMotion()
  const [project, setProject] = useState(null)
  const [index, setIndex] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const [fase, setFase] = useState('cerrado')
  const [origen, setOrigen] = useState(null)
  const faseRef = useRef('cerrado')
  const idOrigen = useRef(null)
  faseRef.current = fase

  const open = useCallback((p, startIndex = 0, id = null) => {
    idOrigen.current = id
    setOrigen(rectDe(id) ?? rectCentrado())
    setProject(p)
    setIndex(startIndex)
    setAsentado(false)
    setFase('origen')
  }, [])

  const alTerminarLayout = useCallback(() => {
    if (faseRef.current === 'abierto') setAsentado(true)
    if (faseRef.current !== 'volviendo') return
    setProject(null)
    setOrigen(null)
    setFase('cerrado')
  }, [])

  useEffect(() => {
    if (fase !== 'origen') return
    let segundo
    const primero = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => {
        setFase('abierto')
        setActiveId(idOrigen.current)
      })
    })
    return () => {
      cancelAnimationFrame(primero)
      cancelAnimationFrame(segundo)
    }
  }, [fase])

  const terminar = useCallback(() => {
    if (faseRef.current !== 'volviendo') return
    setProject(null)
    setOrigen(null)
    setFase('cerrado')
  }, [])

  const close = useCallback(() => {
    if (faseRef.current !== 'abierto') return
    setOrigen(rectDe(idOrigen.current) ?? rectCentrado())
    setActiveId(null)
    setFase('volviendo')
  }, [])

  useEffect(() => {
    if (fase !== 'volviendo') return
    const id = setTimeout(terminar, reducir ? 80 : 1100)
    return () => clearTimeout(id)
  }, [fase, terminar, reducir])

  const photos = useMemo(() => photosOf(project), [project])
  const many = photos.length > 1
  const [grandes, setGrandes] = useState(() => new Set())
  const [asentado, setAsentado] = useState(false)

  useEffect(() => {
    const url = photos[index]
    if (!url || grandes.has(url) || !asentado) return
    let viva = true
    const img = new Image()
    img.src = url
    const listo = () => {
      if (viva) setGrandes((g) => new Set(g).add(url))
    }
    if (img.decode) img.decode().then(listo, listo)
    else img.onload = listo
    return () => {
      viva = false
    }
  }, [photos, index, grandes, asentado])

  const fuente = photos[index] ? (grandes.has(photos[index]) ? photos[index] : mediana(photos[index])) : null

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length])

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
  const abierto = fase === 'abierto'
  const enOrigen = fase === 'origen' || fase === 'volviendo'
  const movimiento = reducir ? { duration: 0 } : RESORTE
  const listo = abierto && asentado
  const controles = listo
    ? { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }
    : { opacity: 0, y: 8, transition: { duration: 0.15 } }

  return (
    <LightboxContext.Provider value={value}>
      {children}

      {createPortal(
        project && origen ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" data-fase={fase}>
            <motion.div
              initial={false}
              animate={{ opacity: abierto ? 1 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={close}
              className="absolute inset-0 bg-black/75"
              style={{ pointerEvents: abierto ? 'auto' : 'none' }}
            />
            <motion.div
              aria-hidden
              initial={false}
              animate={{ opacity: abierto && asentado ? 1 : 0 }}
              transition={{ duration: abierto ? 0.4 : 0.12, ease: EASE }}
              className="pointer-events-none absolute inset-0 backdrop-blur-xl"
            />

            <motion.div
              layout
              transition={movimiento}
              onLayoutAnimationComplete={alTerminarLayout}
              initial={false}
              animate={{ opacity: abierto ? 1 : fase === 'volviendo' ? 0 : 0 }}
              style={{
                borderRadius: RADIO,
                opacity: fase === 'origen' ? 0 : undefined,
                transition: fase === 'volviendo' ? 'opacity 0.32s ease 0.28s' : 'opacity 0.2s ease',
                ...(enOrigen
                  ? { position: 'fixed', left: origen.left, top: origen.top, width: origen.width, height: origen.height }
                  : {}),
              }}
              className={
                'z-10 overflow-hidden bg-ink-2 shadow-[0_40px_90px_rgba(0,0,0,0.6)] ' +
                (enOrigen ? '' : 'relative w-full max-w-5xl max-h-[78vh]')
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={fuente}
                  layout
                  src={fuente}
                  alt={project.name}
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    (enOrigen ? 'h-full w-full object-contain' : 'w-full max-h-[78vh] object-contain') +
                    (project.blurred ? ' blur-[6px] scale-105' : '')
                  }
                />
              </AnimatePresence>
            </motion.div>

            <motion.button
              initial={false}
              animate={listo ? { opacity: 1, scale: 1, transition: { duration: 0.25 } } : { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-5 right-5 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
              style={{ pointerEvents: abierto ? 'auto' : 'none' }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {many && (
              <>
                <motion.button
                  initial={false}
                  animate={listo ? { opacity: 1, transition: { duration: 0.25 } } : { opacity: 0, transition: { duration: 0.15 } }}
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-3 sm:left-6 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  style={{ pointerEvents: abierto ? 'auto' : 'none' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  initial={false}
                  animate={listo ? { opacity: 1, transition: { duration: 0.25 } } : { opacity: 0, transition: { duration: 0.15 } }}
                  onClick={next}
                  aria-label="Foto siguiente"
                  className="absolute right-3 sm:right-6 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  style={{ pointerEvents: abierto ? 'auto' : 'none' }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </>
            )}

            <motion.div
              initial={false}
              animate={controles}
              className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 flex flex-wrap items-end justify-between gap-4 pointer-events-none"
            >
              <div className={abierto ? 'pointer-events-auto' : ''}>
                <h3 className="font-display font-bold uppercase text-white text-xl sm:text-3xl leading-tight">{project.name}</h3>
                <p className="font-display font-semibold uppercase text-[#7db6e8] text-xs sm:text-sm mt-1">
                  {project.type}
                  {many && (
                    <span className="ml-3 text-white/40">
                      {index + 1} / {photos.length}
                    </span>
                  )}
                </p>
              </div>

              <div className={'flex flex-wrap items-center gap-2 ' + (abierto ? 'pointer-events-auto' : '')}>
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
        ) : null,
        document.body,
      )}
    </LightboxContext.Provider>
  )
}
