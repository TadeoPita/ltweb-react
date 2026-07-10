import { motion } from 'framer-motion'
import TextReveal from './TextReveal'
import { SOLUTIONS } from '../data/content'

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

      <div className="relative mx-auto max-w-[1140px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-white border border-black/6 shadow-[0_8px_24px_rgba(0,0,0,0.07)] px-6 py-2.5 text-sm font-semibold font-body">
            Brindamos las mejores soluciones
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 text-center font-display font-bold uppercase text-ink leading-[0.95] text-5xl sm:text-7xl"
        >
          El futuro del
          <br />
          contenido
        </motion.h2>

        <TextReveal
          as="p"
          text="Transformamos tu presencia digital con diseño estratégico y soluciones personalizadas."
          dim={0.12}
          stagger={0.08}
          className="mt-6 text-center font-body font-medium text-ink text-lg max-w-xl mx-auto"
        />

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-card border border-black/4 p-9 min-h-[340px]"
            >
              <div className="text-ink">{icons[s.icon]}</div>
              <h3 className="mt-7 font-display font-bold uppercase text-[22px] text-[#101a3c]">{s.title}</h3>
              <p className="mt-4 font-body text-[15.5px] leading-relaxed text-ink/75">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
