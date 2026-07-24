import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'

/* Cuarta versión del portfolio: mosaico tipo "bento".
   Las cards varían de tamaño en un patrón asimétrico (repite cada 6),
   y al pasar el mouse cada una inclina levemente en 3D y muestra un
   spotlight que sigue al cursor, todo con física spring. */

const PATTERN = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
]

function BentoCard({ project, index }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 200, damping: 20 })
  const spotlight = useTransform([mx, my], ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.20), transparent 55%)`)
  const big = index % PATTERN.length === 0

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  function onLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.a
      ref={ref}
      href={project.url}
      target={project.url && project.url !== '#' ? '_blank' : undefined}
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={PATTERN[index % PATTERN.length] + ' clip-fix group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]'}
    >
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        className={
          'absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06] ' +
          (project.blurred ? 'blur-[6px] scale-105' : '')
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />
      {project.label && (
        <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur px-3 py-1 font-body text-xs text-white/85">
          {project.label}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className={'font-display font-bold uppercase text-white leading-tight ' + (big ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg')}>
          {project.name}
        </h3>
        <p className="font-display font-semibold uppercase text-[#7db6e8] text-xs sm:text-sm mt-1">{project.type}</p>
      </div>
      <span className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </motion.a>
  )
}

function NewProjectBentoCard() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="col-span-1 row-span-1 group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] p-6 text-center"
    >
      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#3b2a8f] group-hover:rotate-90 transition-transform duration-500 ease-out">
        <Plus className="w-5 h-5" strokeWidth={2.5} />
      </span>
      <p className="font-display font-bold uppercase text-sm text-white">Nuevo proyecto</p>
    </a>
  )
}

export default function PortfolioBento({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-row-dense auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[210px] gap-4">
      {items.map((p, i) => (
        <BentoCard key={p.id ?? p.name} project={p} index={i} />
      ))}
      <NewProjectBentoCard />
    </div>
  )
}
