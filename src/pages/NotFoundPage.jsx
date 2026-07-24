import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = '404 — LTWEB'
    return () => {
      document.title = 'Diseño y Desarrollo Web En Argentina - LTWEB'
    }
  }, [])

  return (
    <main className="bg-ink-2 min-h-screen flex flex-col items-center justify-center px-6 text-center select-none">
      {/* Giant 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
        className="relative leading-none mb-8"
        aria-hidden
      >
        <span
          className="font-display font-bold text-[clamp(7rem,28vw,18rem)] text-white/[0.04] select-none"
          style={{ letterSpacing: '-0.04em' }}
        >
          404
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center font-display font-bold text-[clamp(7rem,28vw,18rem)] bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #7db6e8 0%, #a78bfa 50%, #7db6e8 100%)',
            backgroundSize: '200% 200%',
            letterSpacing: '-0.04em',
          }}
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

      {/* CTA */}
      <motion.div {...fadeUp(0.45)} className="mt-10">
        <Link to="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block rounded-full bg-white/8 border border-white/12 text-[#fdfdfd] font-body font-semibold px-8 py-3.5 hover:bg-[#060606] transition-colors cursor-pointer"
          >
            Volver al inicio
          </motion.span>
        </Link>
      </motion.div>
    </main>
  )
}
