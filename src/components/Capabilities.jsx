import { motion } from 'framer-motion'
import { CAPABILITIES } from '../data/content'

/* Franja sobria de capacidades, debajo del hero.
   Sin movimiento constante ni marquesina: es un ancla visual para orientar
   rápido al visitante sobre qué hace el estudio. Los items van separados
   por líneas divisorias en desktop y en columna en mobile. */
export default function Capabilities() {
  return (
    <section className="bg-white border-y border-black/8">
      <div className="mx-auto max-w-[1280px] px-6 py-8 sm:py-10">
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 divide-y divide-x divide-black/8 sm:divide-y-0 border-y sm:border-y-0 border-black/8 sm:-mx-6"
        >
          {CAPABILITIES.map((cap) => (
            <li
              key={cap}
              className="font-display font-semibold uppercase text-ink text-sm sm:text-base tracking-wide text-center py-4 sm:py-6 px-4"
            >
              {cap}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
