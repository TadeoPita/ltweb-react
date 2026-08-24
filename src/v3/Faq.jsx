import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQS } from '../data/content'
import { EASE } from '../lib/motion'

/* Preguntas frecuentes.

   Va justo después de "cómo trabajamos" porque es el orden en que aparecen
   las dudas: primero se entiende el recorrido y enseguida surge el "¿y cuánto
   sale?, ¿cuánto tarda?, ¿lo puedo cambiar después?".

   Composición: encabezado arriba y las preguntas centradas debajo, en una
   sola columna. El armado anterior las mandaba a una columna lateral y sobre
   blanco pelado, y quedaba como una lista suelta más que como una sección.
   Acá el fondo empedrado y la tarjeta blanca por encima le dan cuerpo y la
   separan de lo que viene antes y después.

   Las respuestas traen <strong> desde content.js, así que se insertan como
   HTML. Es contenido nuestro, escrito en el repo y no algo que llegue de
   afuera: no hay superficie para inyección.

   El acordeón deja abierta una sola: obliga a elegir y evita que la sección
   se estire a lo largo de tres pantallas. */
export default function Faq() {
  const [abierta, setAbierta] = useState(0)

  return (
    <section id="faq-v3" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[900px] px-6">
        {/* Encabezado, arriba y centrado */}
        <div className="text-center">
          <span className="inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-black/15" />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
              Preguntas
            </span>
            <span aria-hidden className="h-px w-8 bg-black/15" />
          </span>

          <h2 className="mt-7 font-display font-bold uppercase leading-[0.9] text-4xl sm:text-6xl text-[#26262b]">
            Lo que nos preguntan
            <br />
            antes de arrancar
          </h2>

          <p className="mx-auto mt-6 max-w-md font-body text-[15px] leading-relaxed text-ink/55">
            Si tu duda no está acá, escribinos y te la respondemos sin vueltas.
          </p>
        </div>

        {/* Preguntas, centradas debajo dentro de una tarjeta */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-16px_rgba(0,0,0,0.20)]">
          <ul>
            {FAQS.map((f, i) => {
              const activa = abierta === i
              return (
                <li key={f.q} className="border-b border-black/[0.07] last:border-b-0">
                  <button
                    onClick={() => setAbierta(activa ? null : i)}
                    aria-expanded={activa}
                    className={
                      'group flex w-full cursor-pointer items-center gap-5 px-6 py-5 text-left transition-colors duration-300 sm:px-8 ' +
                      (activa ? 'bg-black/[0.02]' : 'hover:bg-black/[0.015]')
                    }
                  >
                    <span
                      className={
                        'font-body text-[11px] font-semibold tracking-[0.16em] transition-colors duration-300 ' +
                        (activa ? 'text-ink/45' : 'text-ink/25')
                      }
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span className="flex-1 font-display font-bold uppercase text-[#26262b] text-base sm:text-lg leading-tight transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {f.q}
                    </span>

                    <span
                      className={
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out ' +
                        (activa
                          ? 'rotate-45 bg-[#26262b] text-white'
                          : 'bg-black/[0.05] text-ink/50 group-hover:bg-black/[0.09]')
                      }
                    >
                      <Plus className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {activa && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="overflow-hidden bg-black/[0.02]"
                      >
                        <p
                          className="px-6 pb-6 pl-[4.5rem] pr-14 font-body text-[15px] leading-relaxed text-ink/60 sm:px-8 sm:pl-[5.5rem] [&_strong]:font-semibold [&_strong]:text-ink/85"
                          dangerouslySetInnerHTML={{ __html: f.a }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
