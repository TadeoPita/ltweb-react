import { motion } from 'framer-motion'
import { WHATSAPP_URL } from '../data/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
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
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-3 rounded-full bg-white/80 backdrop-blur border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pl-1.5 pr-6 py-1.5">
          <span className="rounded-full bg-white border border-black/8 shadow-sm px-4 py-1.5 text-[13px] font-semibold font-body">
            Exclusivo
          </span>
          <span className="text-[13px] font-semibold font-body text-ink">Asesoramiento 100% Gratuito</span>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={item}
          className="mt-10 font-display font-bold uppercase text-ink leading-[0.95] text-5xl sm:text-7xl lg:text-[92px] tracking-tight"
        >
          Hacemos la web
          <span className="flex items-center justify-center gap-3 sm:gap-5">
            <motion.span
              animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <img src="/images/sparkle.svg" alt="" aria-hidden className="w-9 h-9 sm:w-14 sm:h-14" />
            </motion.span>
            que soñas
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p variants={item} className="mt-8 text-lg sm:text-xl font-alt font-medium text-ink/85">
          Diseñamos tu pagina web sin rellenos.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mt-10">
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-block rounded-xl bg-[#2b2b2b] text-[#fdfdfd] font-body font-semibold text-base sm:text-lg px-9 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)] hover:bg-[#060606] transition-colors"
          >
            Contáctanos Ahora
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
