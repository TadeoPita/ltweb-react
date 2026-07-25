import { motion } from 'framer-motion'
import { blurUp, blurStagger, blurChild } from '../lib/motion'
import { SERVICES, EXTRA_CAPABILITIES } from '../data/content'

const icons = {
  check: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.2l2.7 2.7L16.2 9.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  rocket: <img src="/images/vector-20.svg" alt="" aria-hidden className="w-8 h-8" />,
  chat: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5v-10z" />
      <path d="M20 9.5v5a2.5 2.5 0 0 1-2.5 2.5H16l2.5 3v-3" />
    </svg>
  ),
}

export default function Solutions() {
  return (
    <section id="servicios" className="relative bg-white py-24 sm:py-32 overflow-hidden">
      {/* Glow violeta detrás del título */}
      <img
        src="/images/glow.png"
        alt=""
        aria-hidden
        className="absolute top-24 left-1/2 translate-x-8 w-105 pointer-events-none select-none opacity-90"
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <motion.div {...blurUp(0)} className="text-center">
          <span className="inline-block rounded-full bg-white border border-black/6 shadow-[0_8px_24px_rgba(0,0,0,0.07)] px-6 py-2.5 text-sm font-semibold font-body">
            Servicios
          </span>
        </motion.div>

        <motion.h2
          {...blurUp(0.08)}
          className="relative mt-8 text-center font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl"
        >
          Qué hacemos
        </motion.h2>

        <motion.p
          {...blurUp(0.16)}
          className="mt-6 text-center font-body text-ink/60 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Tres áreas de trabajo que cubren desde una landing simple hasta soluciones a medida integradas con el resto de tu negocio.
        </motion.p>

        <motion.div {...blurStagger(0.12)} className="mt-16 grid md:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <motion.div
              key={s.id}
              variants={blurChild}
              whileHover={{ y: -6 }}
              style={{ backgroundColor: s.tint }}
              className="rounded-2xl border border-black/5 p-8 flex flex-col"
            >
              <div className="text-ink">{icons[s.icon]}</div>
              <h3 className="mt-7 font-display font-bold uppercase text-[22px] text-[#101a3c]">{s.title}</h3>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink/75">{s.text}</p>
              <ul className="mt-6 pt-6 border-t border-black/10 flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li key={item} className="rounded-full bg-white/70 border border-black/8 px-3 py-1 text-xs font-body text-ink/75">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Capacidades complementarias */}
        <motion.div {...blurUp(0.1)} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sheen text-xs font-semibold uppercase tracking-wide">También trabajamos</span>
          {EXTRA_CAPABILITIES.map((cap) => (
            <motion.span
              key={cap}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="cursor-default rounded-full bg-white border border-black/8 px-4 py-1.5 text-sm font-body text-ink/70 transition-colors duration-300 hover:bg-ink hover:text-white hover:border-ink hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
            >
              {cap}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
