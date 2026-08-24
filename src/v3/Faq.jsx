import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQS } from '../data/content'
import { EASE } from '../lib/motion'

/* Preguntas frecuentes.

   Va justo después de "cómo trabajamos" porque es el orden en que aparecen
   las dudas: primero se entiende el recorrido y enseguida surge el "¿y cuánto
   sale?, ¿cuánto tarda?, ¿lo puedo cambiar después?".

   Las respuestas vienen con <strong> desde content.js, así que se insertan
   como HTML. Es contenido nuestro, escrito en el repo, no algo que llegue de
   afuera: no hay superficie para inyección.

   El acordeón deja abierta una sola: obliga a elegir y evita que la sección
   se estire a lo largo de tres pantallas. */
export default function Faq() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section id="faq-v3" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
          <div>
            <span className="inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-black/15" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
                Preguntas
              </span>
            </span>
            <h2 className="mt-7 font-display font-bold uppercase leading-[0.9] text-4xl sm:text-6xl text-[#26262b]">
              Lo que nos preguntan antes de arrancar
            </h2>
          </div>

          <ul className="border-t border-black/[0.08]">
            {FAQS.map((f, i) => {
              const activa = abierta === i
              return (
                <li key={f.q} className="border-b border-black/[0.08]">
                  <button
                    onClick={() => setAbierta(activa ? null : i)}
                    aria-expanded={activa}
                    className="group flex w-full cursor-pointer items-center gap-5 py-5 text-left"
                  >
                    <span className="flex-1 font-display font-bold uppercase text-[#26262b] text-base sm:text-lg leading-tight transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {f.q}
                    </span>
                    <Plus
                      className={
                        'h-5 w-5 shrink-0 text-ink/35 transition-transform duration-300 ease-out ' +
                        (activa ? 'rotate-45' : 'group-hover:rotate-90')
                      }
                      strokeWidth={1.8}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {activa && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pb-6 pr-10 font-body text-[15px] leading-relaxed text-ink/60 [&_strong]:font-semibold [&_strong]:text-ink/85"
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
