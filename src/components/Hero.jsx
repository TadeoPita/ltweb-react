import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'
import { WHATSAPP_URL } from '../data/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative pt-40 sm:pt-48 pb-24 overflow-hidden bg-white bg-top bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/images/bg-6.png')" }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-3 rounded-full bg-white/80 backdrop-blur border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pl-1.5 pr-6 py-1.5">
          <span className="rounded-full bg-white border border-black/8 shadow-sm px-4 py-1.5 text-[13px] font-semibold font-body">
            Estudio
          </span>
          <span className="text-[13px] font-semibold font-body text-ink">Diseño y desarrollo web · Buenos Aires</span>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={item}
          className="mt-10 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl lg:text-[76px] tracking-tight"
        >
          Tu negocio ya creció.
          <span className="flex items-center justify-center gap-3 sm:gap-5 mt-2">
            <motion.span
              animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <img src="/images/sparkle.svg" alt="" aria-hidden className="w-9 h-9 sm:w-14 sm:h-14" />
            </motion.span>
            Tu web también.
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p variants={item} className="mt-8 text-base sm:text-lg font-alt font-medium text-ink/70 max-w-2xl mx-auto leading-relaxed">
          Diseño UX/UI, desarrollo WordPress, tiendas online y soluciones personalizadas para empresas que necesitan comunicar mejor y generar nuevas oportunidades.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-block rounded-xl bg-[#2b2b2b] text-[#fdfdfd] font-body font-semibold text-base sm:text-lg px-8 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)] hover:bg-[#060606] transition-colors"
          >
            Contanos tu proyecto
          </motion.a>
          <motion.a
            href="#proyectos"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-block rounded-xl bg-white text-ink font-body font-semibold text-base sm:text-lg px-8 py-4 border border-black/10 hover:border-black/25 transition-colors"
          >
            Ver proyectos
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
