import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import MotionLink, { projectPath } from './MotionLink'
import { useLightbox } from './ProjectLightbox'
import { WHATSAPP_URL } from '../data/content'

/* Quinta versión del portfolio: mazo de cards arrastrables, como cartas.
   La de encima se arrastra a los costados (con física real: elástico si
   soltás antes de tiempo, sale volando si pasás el umbral) y revela la
   siguiente, que ya se ve asomando detrás. También hay flechas y contador
   para navegar sin arrastrar. Loop infinito. */

function CardVisual({ project }) {
  return (
    <div className="clip-fix absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
      <img
        src={project.image}
        alt={project.name}
        draggable={false}
        loading="lazy"
        className={
          'absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none ' +
          (project.blurred ? 'blur-[6px] scale-105' : '')
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      {project.label && (
        <span className="absolute top-5 left-5 rounded-full bg-black/60 backdrop-blur px-3 py-1 font-body text-xs text-white/85">
          {project.label}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display font-bold uppercase text-white text-2xl sm:text-4xl leading-tight truncate">{project.name}</h3>
          <p className="font-display font-semibold uppercase text-[#7db6e8] text-sm sm:text-base mt-1">{project.type}</p>
        </div>
        <span className="shrink-0 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/12 backdrop-blur border border-white/20 text-white">
          <ArrowUpRight className="w-5 h-5" />
        </span>
      </div>
    </div>
  )
}

function CtaVisual() {
  return (
    <div className="clip-fix absolute inset-0 rounded-3xl overflow-hidden border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] flex flex-col items-center justify-center gap-6 text-center p-8 shadow-2xl shadow-black/50">
      <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-[#3b2a8f]">
        <Plus className="w-9 h-9" strokeWidth={2.5} />
      </span>
      <div>
        <p className="font-display font-bold uppercase text-2xl text-white">Contanos tu proyecto</p>
        <p className="font-display font-semibold uppercase text-lg mt-2 text-white/70">Nuevo proyecto</p>
      </div>
    </div>
  )
}

function FrontCard({ project, onSwiped }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-14, 14])
  const { open } = useLightbox()

  /* Al arrastrar, el navegador igual dispara click al soltar: si la card se
     movió, no abrimos el visor. */
  function onClick(e) {
    if (project.isCta || !open) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (Math.abs(x.get()) > 4) return
    e.preventDefault()
    open(project)
  }

  function onDragEnd(_e, info) {
    const passed = Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500
    if (passed) {
      const flyTo = info.offset.x < 0 ? -700 : 700
      animate(x, flyTo, { duration: 0.3, ease: 'easeIn', onComplete: onSwiped })
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 })
    }
  }

  // El CTA sale a WhatsApp (link externo); los proyectos van a su ficha interna.
  const Wrapper = project.isCta ? motion.a : MotionLink
  const linkProps = project.isCta
    ? { href: WHATSAPP_URL, target: '_blank', rel: 'noreferrer' }
    : { to: projectPath(project) }

  return (
    <Wrapper
      {...linkProps}
      onClick={onClick}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={onDragEnd}
      style={{ x, rotate }}
      whileTap={{ scale: 0.98 }}
      className="absolute inset-0 block cursor-grab active:cursor-grabbing touch-none"
    >
      {project.isCta ? <CtaVisual /> : <CardVisual project={project} />}
    </Wrapper>
  )
}

export default function PortfolioStack({ items }) {
  const deck = [...items, { id: '__new__', isCta: true }]
  const [order, setOrder] = useState(deck.map((_, i) => i))

  function advance(dir) {
    setOrder((o) => (dir > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]))
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-[440px] sm:h-[520px]">
        {order.slice(0, 4).map((itemIndex, depth) => {
          const project = deck[itemIndex]
          const key = project.id ?? project.name

          if (depth === 0) {
            return <FrontCard key={key} project={project} onSwiped={() => advance(1)} />
          }

          return (
            <motion.div
              key={key}
              animate={{ scale: 1 - depth * 0.045, y: depth * 12, opacity: depth < 3 ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: -depth }}
            >
              {project.isCta ? <CtaVisual /> : <CardVisual project={project} />}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-5">
        <button
          onClick={() => advance(-1)}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <p className="font-body text-sm text-white/40 tabular-nums w-14 text-center">
          {order[0] + 1} / {deck.length}
        </p>
        <button
          onClick={() => advance(1)}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-3 font-body text-xs text-white/25">Arrastrá la card o usá las flechas</p>
    </div>
  )
}
