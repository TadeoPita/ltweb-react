import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQS } from '../data/content'
import { EASE } from '../lib/motion'

/* Preguntas frecuentes.

   Vuelve a la composición del sitio original: título centrado arriba, el
   glow detrás y la lista de preguntas debajo separadas apenas por una línea,
   con el botón redondo que gira a cruz. Es la versión que ya funcionaba.

   Las respuestas traen <strong> desde content.js, así que se insertan como
   HTML. Es contenido nuestro, escrito en el repo y no algo que llegue de
   afuera: no hay superficie para inyección. */

function Pregunta({ faq, abierta, alTocar }) {
  return (
    <div className="border-b border-black/[0.07]">
      <button
        onClick={alTocar}
        aria-expanded={abierta}
        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left"
      >
        <span className="font-body font-semibold text-[17px] sm:text-lg text-ink">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: abierta ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-[#ececec]"
        >
          <Plus className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className="pb-7 pr-16 font-body text-[15.5px] leading-relaxed text-ink/65 [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: faq.a }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [abierta, setAbierta] = useState(-1)

  return (
    <section id="faq-v3" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <img
        src="/images/glow.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 w-72 -translate-x-1/2 select-none"
      />

      <div className="relative mx-auto max-w-[1140px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center font-display font-bold uppercase text-ink text-4xl sm:text-6xl"
        >
          ¿Tenés preguntas?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-5 max-w-md text-center font-body text-ink/60"
        >
          Las dudas más comunes que nos escriben antes de arrancar un proyecto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-16"
        >
          {FAQS.map((faq, i) => (
            <Pregunta
              key={faq.q}
              faq={faq}
              abierta={abierta === i}
              alTocar={() => setAbierta(abierta === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
