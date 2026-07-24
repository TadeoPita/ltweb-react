import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

export default function NotFoundPage() {
  const { pathname } = useLocation()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })

  // Parallax sutil: cada orbe se mueve a distinta profundidad según el mouse
  const axA = useTransform(sx, (v) => v * 0.6)
  const ayA = useTransform(sy, (v) => v * 0.6)
  const axB = useTransform(sx, (v) => v * -0.4)
  const ayB = useTransform(sy, (v) => v * -0.4)
  const axC = useTransform(sx, (v) => v * 0.3)
  const ayC = useTransform(sy, (v) => v * -0.3)

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left - rect.width / 2)
    my.set(e.clientY - rect.top - rect.height / 2)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = '404 — LTWEB'
    return () => {
      document.title = 'Diseño y Desarrollo Web En Argentina - LTWEB'
    }
  }, [])

  return (
    <main
      ref={ref}
      onMouseMove={onMove}
      className="relative bg-ink-2 min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden select-none"
    >
      {/* Orbes flotantes con parallax al mover el mouse */}
      <motion.div style={{ x: axA, y: ayA }} className="pointer-events-none absolute -top-24 -left-24">
        <div className="w-[420px] h-[420px] rounded-full bg-[#7db6e8]/25 blur-[110px] animate-[float-orb-a_16s_ease-in-out_infinite]" />
      </motion.div>
      <motion.div style={{ x: axB, y: ayB }} className="pointer-events-none absolute -bottom-32 -right-16">
        <div className="w-[460px] h-[460px] rounded-full bg-[#a78bfa]/25 blur-[120px] animate-[float-orb-b_20s_ease-in-out_infinite]" />
      </motion.div>
      <motion.div style={{ x: axC, y: ayC }} className="pointer-events-none absolute top-1/3 right-1/4">
        <div className="w-64 h-64 rounded-full bg-[#fbd2cf]/10 blur-[90px] animate-[float-orb-a_13s_ease-in-out_infinite_reverse]" />
      </motion.div>

      {/* Scanlines sutiles */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(180deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Indicador de estado */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7db6e8] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7db6e8]" />
          </span>
          <span className="font-body text-xs text-white/60 tracking-wide">Señal perdida</span>
        </motion.div>

        {/* 404 gigante con efecto glitch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative leading-none mb-8"
          aria-hidden
        >
          <span className="font-display font-bold text-[clamp(7rem,28vw,18rem)] text-white/[0.04]" style={{ letterSpacing: '-0.04em' }}>
            404
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center font-display font-bold text-[clamp(7rem,28vw,18rem)] bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #7db6e8 0%, #a78bfa 50%, #7db6e8 100%)',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center font-display font-bold text-[clamp(7rem,28vw,18rem)] text-[#7db6e8] mix-blend-screen animate-[glitch-shift-1_6s_infinite]"
            style={{ letterSpacing: '-0.04em' }}
          >
            404
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center font-display font-bold text-[clamp(7rem,28vw,18rem)] text-[#fb7cd2] mix-blend-screen animate-[glitch-shift-2_6s_infinite]"
            style={{ letterSpacing: '-0.04em' }}
          >
            404
          </span>
        </motion.div>

        {/* Label */}
        <motion.p
          {...fadeUp(0.15)}
          className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm mb-4"
        >
          Página no encontrada
        </motion.p>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.25)}
          className="font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl max-w-xl"
        >
          Esta URL no existe
        </motion.h1>

        {/* Body */}
        <motion.p
          {...fadeUp(0.35)}
          className="mt-6 font-body text-white/50 text-base sm:text-lg max-w-md"
        >
          La página que buscás no está disponible o fue movida. Volvé al inicio y seguí explorando.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.45)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block rounded-full bg-white/8 border border-white/12 text-[#fdfdfd] font-body font-semibold px-8 py-3.5 hover:bg-[#060606] transition-colors cursor-pointer"
            >
              Volver al inicio
            </motion.span>
          </Link>
          <Link to="/portfolio">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block rounded-full border border-white/15 text-white/70 font-body font-semibold px-8 py-3.5 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            >
              Ver portfolio
            </motion.span>
          </Link>
        </motion.div>

        {/* Ruta solicitada */}
        <motion.p {...fadeUp(0.55)} className="mt-10 font-mono text-[11px] text-white/25 tracking-wide">
          error 404 · ruta solicitada: {pathname}
        </motion.p>
      </div>
    </main>
  )
}
