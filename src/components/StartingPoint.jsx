import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RichText from './RichText'
import { blurUp, EASE } from '../lib/motion'
import { STARTING_POINTS, WHATSAPP_URL } from '../data/content'
import Label from './Label'

/* "¿Por dónde empezamos?"

   En vez de explicarle lo mismo a todo el mundo, el visitante elige la frase
   con la que se identifica y lee solo la respuesta que le corresponde. Sirve
   para que cada uno se ubique rápido sin leer la página entera, y de paso
   deja ver que hay un criterio distinto según el caso.

   Fondo oscuro para cortar con las secciones claras de alrededor. La única
   animación es la del panel al cambiar: nada permanente. */
export default function StartingPoint() {
  const [active, setActive] = useState(STARTING_POINTS[0].id)
  const current = STARTING_POINTS.find((p) => p.id === active) ?? STARTING_POINTS[0]

  return (
    <section id="empecemos" className="relative bg-ink-2 py-24 sm:py-32 overflow-hidden">
      <img
        src="/images/glow.png"
        alt=""
        aria-hidden
        className="absolute top-0 right-0 w-[560px] pointer-events-none select-none opacity-25"
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <motion.p
          {...blurUp(0)}
          className="text-center"
        >
          <Label tone="light">Empecemos</Label>
        </motion.p>
        <motion.h2
          {...blurUp(0.08)}
          className="mt-4 text-center font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl"
        >
          ¿Por dónde empezamos?
        </motion.h2>
        <motion.p
          {...blurUp(0.16)}
          className="mt-6 text-center font-body text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Elegí la frase que más se parece a tu situación y te contamos cómo lo encaramos.
        </motion.p>

        {/* Selector */}
        <motion.div
          {...blurUp(0.24)}
          className="mt-16 flex flex-wrap justify-center gap-2"
          role="tablist"
        >
          {STARTING_POINTS.map((p) => {
            const isActive = p.id === active
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(p.id)}
                /* Los inactivos llevan borde y fondo propios: antes eran solo
                   texto sobre el fondo oscuro y no se leían como botones, así
                   que nadie tocaba las otras tres opciones y se perdía medio
                   contenido de la sección. */
                className={
                  'relative rounded-full border px-5 py-2.5 font-body font-semibold text-sm transition-all duration-300 cursor-pointer ' +
                  (isActive
                    ? 'text-ink border-transparent'
                    : 'text-white/75 border-white/20 bg-white/[0.06] hover:bg-white/12 hover:border-white/45 hover:text-white')
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="starting-point-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-white"
                  />
                )}
                <span className="relative">{p.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Panel */}
        <motion.div
          {...blurUp(0.3)}
          className="mt-8 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h3 className="font-display font-bold uppercase text-white text-2xl sm:text-3xl leading-tight">
                {current.title}
              </h3>
              <RichText
                as="p"
                text={current.text}
                className="mt-5 font-body text-white/60 text-base sm:text-lg leading-relaxed"
                strongClassName="text-white"
              />
              <ul className="mt-7 flex flex-wrap gap-2">
                {current.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-white/8 border border-white/12 px-3.5 py-1.5 font-body text-xs text-white/70"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white text-ink font-body font-semibold px-7 py-3.5 hover:bg-white/90 transition-colors"
              >
                Contanos tu caso
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
