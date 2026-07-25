import { motion } from 'framer-motion'
import { blurStagger, blurChild } from '../lib/motion'
import { CAPABILITIES } from '../data/content'

/* Franja sobria de capacidades, debajo del hero.
   Sin movimiento constante ni marquesina: es un ancla visual para orientar
   rápido al visitante sobre qué hace el estudio.

   El separador se dibuja con un borde en cada item en vez de `divide-*`:
   con `divide-x` + `divide-y` a la vez la grilla quedaba cortada y con
   líneas sueltas al cambiar de cantidad de columnas. Así cada fila y cada
   columna resuelven su propio borde y funciona con cualquier cantidad. */
export default function Capabilities() {
  return (
    <section className="bg-white border-y border-black/8">
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.ul
          {...blurStagger(0.08)}
          className="grid grid-cols-1 sm:grid-cols-3"
        >
          {CAPABILITIES.map((cap, i) => (
            <motion.li
              key={cap}
              variants={blurChild}
              className={
                'font-display font-semibold uppercase text-ink text-sm sm:text-base tracking-wide text-center py-5 sm:py-7 px-4 ' +
                // línea entre filas en mobile, entre columnas en desktop
                (i > 0 ? 'border-t border-black/8 sm:border-t-0 sm:border-l' : '')
              }
            >
              {cap}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
