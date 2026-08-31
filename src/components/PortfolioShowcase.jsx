import { useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import MotionLink, { projectPath } from './MotionLink'
import { useLightbox } from './ProjectLightbox'
import { WHATSAPP_URL } from '../data/content'
import { chica, mediana } from '../lib/imagen'

/* Diseño alternativo del portfolio: lista tipográfica grande.
   Al pasar el mouse por un proyecto, aparece una preview flotante
   que sigue al cursor con física spring. En touch se muestran
   thumbnails fijos al lado de cada fila. */
export default function PortfolioShowcase({ items }) {
  const [active, setActive] = useState(null)
  const { open } = useLightbox()

  /* Es una lista tipográfica, no una grilla de fotos: acá no tiene sentido
     el efecto de expandir desde la card, solo interceptamos el click. */
  function onRowClick(e, p) {
    if (!open) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    open(p)
  }
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.3 })
  const y = useSpring(my, { stiffness: 120, damping: 18, mass: 0.3 })

  const activeItem = items.find((p) => p.id === active)

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setActive(null)} className="relative">
      {/* Preview flotante (solo desktop) */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block overflow-visible">
        <motion.div style={{ x, y }} className="absolute -top-32 -left-44 w-88">
          <AnimatePresence mode="popLayout">
            {activeItem && (
              <motion.img
                key={activeItem.id}
                src={mediana(activeItem.image)}
                alt=""
                initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 6 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-88 h-60 object-cover object-top rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.55)] border border-white/10"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="border-t border-white/8">
        {items.map((p, i) => {
          const isActive = active === p.id
          return (
            <MotionLink
              key={p.id}
              to={projectPath(p)}
              onClick={(e) => onRowClick(e, p)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActive(p.id)}
              className="group relative flex items-center justify-between gap-6 border-b border-white/8 py-7 sm:py-9 px-2 sm:px-4"
            >
              <div className="flex items-center gap-5 min-w-0">
                {/* Thumb fijo en mobile/tablet */}
                <img
                  src={chica(p.image)}
                  alt=""
                  loading="lazy"
                  className="lg:hidden w-20 h-14 object-cover object-top rounded-lg border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <motion.h3
                    animate={{ x: isActive ? 14 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={
                      'font-display font-bold uppercase leading-none text-3xl sm:text-5xl lg:text-6xl truncate transition-colors duration-500 ' +
                      (isActive ? 'text-white' : 'text-white/85 lg:text-white/35')
                    }
                  >
                    {p.name}
                  </motion.h3>
                  <p className="mt-2 font-display font-semibold uppercase text-[#7db6e8] text-xs sm:text-sm tracking-wide">
                    {p.type}
                    {p.label ? <span className="ml-3 text-white/40 normal-case font-body">· {p.label}</span> : null}
                  </p>
                </div>
              </div>

              <motion.span
                animate={{ rotate: isActive ? 0 : 45, opacity: isActive ? 1 : 0.35 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/15 text-white"
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.span>
            </MotionLink>
          )
        })}

        {/* Fila CTA nuevo proyecto */}
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setActive(null)}
          className="group flex items-center justify-between gap-6 border-b border-white/8 py-7 sm:py-9 px-2 sm:px-4"
        >
          <div>
            <h3
              className="font-display font-bold uppercase leading-none text-3xl sm:text-5xl lg:text-6xl text-gradient"
              style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #A0A0A0 100%)' }}
            >
              Contanos tu proyecto
            </h3>
            <p className="mt-2 font-display font-semibold uppercase text-[#a796f0] text-xs sm:text-sm tracking-wide">
              Nuevo proyecto
            </p>
          </div>
          <span className="shrink-0 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-[#3b2a8f] group-hover:rotate-90 transition-transform duration-500 ease-out">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </span>
        </motion.a>
      </div>
    </div>
  )
}
