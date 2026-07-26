import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE } from '../lib/motion'
import { usePortfolio } from '../data/portfolioStore'
import { WHATSAPP_URL } from '../data/content'

/* Cuatro composiciones distintas del hero, conmutables desde /admin.
   Todas comparten la identidad: fondo claro con la textura de líneas, Phudu
   en mayúsculas para el título, el sparkle lila y los dos CTA de siempre. */

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

const HEADLINE = 'Tu web tiene que'
const HEADLINE_2 = 'laburar para vos.'
const SUBLINE =
  'Desarrollo web, tiendas online y sistemas personalizados para empresas que necesitan comunicar mejor y generar nuevas oportunidades.'

function Sparkle({ className = 'w-9 h-9 sm:w-14 sm:h-14' }) {
  return (
    <motion.span
      animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-block"
    >
      <img src="/images/sparkle.svg" alt="" aria-hidden className={className} />
    </motion.span>
  )
}

function PrimaryCta({ size = 'lg' }) {
  const pad = size === 'lg' ? 'px-8 py-4 text-base sm:text-lg' : 'px-7 py-3.5 text-base'
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-block rounded-xl bg-[#2b2b2b] text-[#fdfdfd] font-body font-semibold shadow-[0_18px_40px_rgba(0,0,0,0.25)] hover:bg-[#060606] transition-colors ${pad}`}
    >
      Contanos tu proyecto
    </motion.a>
  )
}

function SecondaryCta({ size = 'lg' }) {
  const pad = size === 'lg' ? 'px-8 py-4 text-base sm:text-lg' : 'px-7 py-3.5 text-base'
  return (
    <motion.a
      href="#proyectos"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-block rounded-xl bg-white text-ink font-body font-semibold border border-black/10 hover:border-black/25 transition-colors ${pad}`}
    >
      Ver proyectos
    </motion.a>
  )
}

function Badge() {
  return (
    <span className="inline-flex items-center gap-3 rounded-full bg-white/80 backdrop-blur border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pl-1.5 pr-6 py-1.5">
      <span className="rounded-full bg-white border border-black/8 shadow-sm px-4 py-1.5 text-[13px] font-semibold font-body">
        Estudio
      </span>
      <span className="text-[13px] font-semibold font-body text-ink">
        Diseño y desarrollo web · Buenos Aires
      </span>
    </span>
  )
}

/* 1. Centrado — la composición actual. */
function HeroCentered() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto max-w-5xl px-6 text-center"
    >
      <motion.div variants={item}>
        <Badge />
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-10 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl lg:text-[76px] tracking-tight"
      >
        {HEADLINE}
        <span className="flex items-center justify-center gap-3 sm:gap-5 mt-2">
          <Sparkle />
          {HEADLINE_2}
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-8 text-base sm:text-lg font-alt font-medium text-ink/70 max-w-2xl mx-auto leading-relaxed"
      >
        {SUBLINE}
      </motion.p>

      <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <PrimaryCta />
        <SecondaryCta />
      </motion.div>
    </motion.div>
  )
}

/* 2. Dividido — texto a la izquierda, captura de proyecto a la derecha
   dentro de una ventana de navegador. */
function HeroSplit({ featured }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto max-w-[1280px] px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center"
    >
      <div>
        <motion.div variants={item}>
          <Badge />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl tracking-tight"
        >
          {HEADLINE}
          <span className="flex items-center gap-3 mt-2">
            <Sparkle className="w-8 h-8 sm:w-12 sm:h-12" />
            {HEADLINE_2}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 text-base sm:text-lg font-alt font-medium text-ink/70 max-w-xl leading-relaxed"
        >
          {SUBLINE}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
          <PrimaryCta size="sm" />
          <SecondaryCta size="sm" />
        </motion.div>
      </div>

      {/* Ventana de navegador con el proyecto destacado */}
      <motion.div
        variants={item}
        className="clip-fix relative rounded-2xl overflow-hidden border border-black/10 bg-white shadow-[0_40px_80px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/8 bg-[#f6f6f7]">
          <span className="w-2.5 h-2.5 rounded-full bg-black/12" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/12" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/12" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white border border-black/8 px-3 py-1 text-[11px] font-body text-ink/40">
            {featured?.url && featured.url !== '#' ? featured.url.replace(/^https?:\/\//, '') : 'ltweb.com.ar'}
          </span>
        </div>
        {featured?.image && (
          <img
            src={featured.image}
            alt={featured.name}
            className="w-full h-[300px] sm:h-[420px] object-cover object-top"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

/* 3. Minimal — sin badge, tipografía enorme y un solo CTA fuerte. */
function HeroMinimal() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto max-w-[1280px] px-6"
    >
      <motion.h1
        variants={item}
        className="font-display font-bold uppercase text-ink leading-[0.9] text-[13vw] sm:text-[11vw] lg:text-[112px] tracking-tight"
      >
        {HEADLINE}
        <span className="flex items-center gap-4 mt-1">
          <Sparkle className="w-10 h-10 sm:w-16 sm:h-16" />
          {HEADLINE_2}
        </span>
      </motion.h1>

      <motion.div
        variants={item}
        className="mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t border-black/10 pt-8"
      >
        <p className="text-base sm:text-lg font-alt font-medium text-ink/70 max-w-xl leading-relaxed">
          {SUBLINE}
        </p>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <PrimaryCta size="sm" />
          <a
            href="#proyectos"
            className="inline-flex items-center gap-1.5 font-body font-semibold text-ink/70 hover:text-ink transition-colors"
          >
            Ver proyectos
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* 4. Con proyectos abajo — el centrado, más una fila de miniaturas reales. */
function HeroShowcase({ thumbs }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto max-w-[1280px] px-6 text-center"
    >
      <motion.div variants={item}>
        <Badge />
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-8 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl lg:text-[72px] tracking-tight"
      >
        {HEADLINE}
        <span className="flex items-center justify-center gap-3 sm:gap-5 mt-2">
          <Sparkle />
          {HEADLINE_2}
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-7 text-base sm:text-lg font-alt font-medium text-ink/70 max-w-2xl mx-auto leading-relaxed"
      >
        {SUBLINE}
      </motion.p>

      <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <PrimaryCta size="sm" />
        <SecondaryCta size="sm" />
      </motion.div>

      {/* Miniaturas de proyectos reales */}
      <motion.div variants={item} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {thumbs.map((p, i) => (
          <div
            key={p.id}
            className={
              'clip-fix rounded-xl overflow-hidden border border-black/8 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.10)] ' +
              (i % 2 === 1 ? 'sm:translate-y-5' : '')
            }
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="w-full h-32 sm:h-44 object-cover object-top"
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const { items, heroVariant } = usePortfolio()
  const featured = items.find((p) => p.home && p.image) ?? items[0]
  const thumbs = items.filter((p) => p.home && p.image && !p.blurred).slice(0, 4)

  // Las variantes con imágenes necesitan que el portfolio ya haya cargado.
  const needsItems = heroVariant === 'split' || heroVariant === 'showcase'
  const variant = needsItems && items.length === 0 ? 'centered' : heroVariant

  return (
    <section
      id="inicio"
      className={
        'relative overflow-hidden bg-white bg-top bg-no-repeat bg-cover ' +
        (variant === 'minimal' ? 'pt-44 sm:pt-52 pb-24' : 'pt-40 sm:pt-48 pb-24')
      }
      style={{ backgroundImage: "url('/images/bg-6.png')" }}
    >
      {variant === 'split' ? (
        <HeroSplit featured={featured} />
      ) : variant === 'minimal' ? (
        <HeroMinimal />
      ) : variant === 'showcase' ? (
        <HeroShowcase thumbs={thumbs} />
      ) : (
        <HeroCentered />
      )}
    </section>
  )
}
