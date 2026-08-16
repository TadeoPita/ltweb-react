import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { EASE } from '../lib/motion'

/* Comparador antes / después para los rediseños.

   Las dos imágenes se apilan; la de arriba se recorta con clip-path según
   dónde esté el divisor. Se arrastra con mouse o dedo, y también se puede
   mover con el teclado (flechas) porque el control es un slider real
   por debajo — invisible pero enfocable. */
export default function BeforeAfter({ before, after, alt = '', className = '' }) {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const ref = useRef(null)

  const moveTo = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => moveTo(e.touches ? e.touches[0].clientX : e.clientX)
    const stop = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', stop)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', stop)
    }
  }, [dragging, moveTo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className={'relative ' + className}
    >
      <div
        ref={ref}
        onPointerDown={(e) => {
          setDragging(true)
          moveTo(e.clientX)
        }}
        className="clip-fix relative select-none overflow-hidden rounded-2xl border border-white/10 bg-ink-2 cursor-ew-resize"
      >
        {/* Después (debajo, siempre completa) */}
        <img src={after} alt={alt ? `${alt} — después` : 'Después'} className="block w-full h-auto" draggable={false} />

        {/* Antes (encima, recortada hasta el divisor) */}
        <img
          src={before}
          alt={alt ? `${alt} — antes` : 'Antes'}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        {/* Etiquetas: cada una se desvanece cuando el divisor la tapa */}
        <span
          className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur px-3 py-1 font-body text-xs text-white/85 transition-opacity duration-200"
          style={{ opacity: pos > 12 ? 1 : 0 }}
        >
          Antes
        </span>
        <span
          className="pointer-events-none absolute top-4 right-4 rounded-full bg-white/85 backdrop-blur px-3 py-1 font-body text-xs text-ink transition-opacity duration-200"
          style={{ opacity: pos < 88 ? 1 : 0 }}
        >
          Después
        </span>

        {/* Divisor */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white text-ink shadow-lg">
            <MoveHorizontal className="w-5 h-5" />
          </span>
        </div>

        {/* Control real: invisible, pero da teclado y accesibilidad */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Comparar antes y después"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
    </motion.div>
  )
}
