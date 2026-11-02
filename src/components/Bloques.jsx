import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { chica, textoPortada } from '../lib/imagen'
import { nombreProyecto } from '../lib/titulos'
import { EASE } from '../lib/motion'

export const aparecer = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export const alVer = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: EASE, delay },
})

export function Volanta({ children, className = '' }) {
  return (
    <p className={`font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-xs sm:text-sm ${className}`}>
      {children}
    </p>
  )
}

export function Titulo({ children }) {
  return (
    <h2 className="mt-3 font-display font-bold uppercase text-white leading-[0.95] text-3xl sm:text-5xl">{children}</h2>
  )
}

export function BotonWhatsapp({ href, children, claro = true }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={
        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-body font-semibold transition-colors ' +
        (claro ? 'bg-white text-ink hover:bg-white/90' : 'border border-white/15 bg-white/8 text-white hover:bg-white/12')
      }
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </motion.a>
  )
}

export function TarjetasProyectos({ proyectos }) {
  return (
    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((p, i) => (
        <motion.li key={p.id} {...alVer(Math.min(i * 0.06, 0.3))}>
          <Link
            to={`/proyecto/${p.id}`}
            className="clip-fix group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={chica(p.image)}
                alt={textoPortada(p)}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-end justify-between gap-3 p-5">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{p.type}</p>
                <p className="mt-1 font-display text-lg font-bold uppercase leading-tight text-white">{nombreProyecto(p)}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
          </Link>
        </motion.li>
      ))}
    </ul>
  )
}

export function Preguntas({ faqs }) {
  return (
    <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-alt text-[17px] font-semibold text-white [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="mt-3 max-w-3xl font-body text-base leading-relaxed text-white/65">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
