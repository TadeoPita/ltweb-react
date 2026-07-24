import { useEffect } from 'react'
import { motion } from 'framer-motion'
import TextReveal from '../components/TextReveal'
import { PortfolioGrid, NewProjectCard } from '../components/PortfolioCards'
import { usePortfolio } from '../data/portfolioStore'

export default function PortfolioPage() {
  const { items, loading } = usePortfolio()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Portfolio - LTWEB'
    return () => {
      document.title = 'Diseño y Desarrollo Web En Argentina - LTWEB'
    }
  }, [])

  return (
    <main className="bg-ink-2 min-h-screen pt-36 pb-32">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display font-semibold uppercase tracking-wide text-[#7db6e8]"
        >
          Nuestro trabajo
        </motion.p>
        <TextReveal
          as="h1"
          text="Portfolio completo"
          dim={0.14}
          stagger={0.18}
          className="mt-4 text-center font-display font-bold uppercase text-white leading-[0.95] text-5xl sm:text-7xl"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-center font-body text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Todos los proyectos que diseñamos y desarrollamos: landing pages, e-commerce y experiencias a medida.
        </motion.p>

        <div className="mt-20">
          {loading ? (
            <p className="text-center font-body text-white/40">Cargando portfolio...</p>
          ) : (
            <PortfolioGrid items={items}>
              <NewProjectCard />
            </PortfolioGrid>
          )}
        </div>
      </div>
    </main>
  )
}
