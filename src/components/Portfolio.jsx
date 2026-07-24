import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TextReveal from './TextReveal'
import { PortfolioGrid, NewProjectCard } from './PortfolioCards'
import PortfolioShowcase from './PortfolioShowcase'
import PortfolioGallery from './PortfolioGallery'
import PortfolioBento from './PortfolioBento'
import PortfolioStack from './PortfolioStack'
import { usePortfolio } from '../data/portfolioStore'

export function PortfolioHeader() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center font-display font-semibold uppercase tracking-wide text-[#7db6e8]"
      >
        Nuestro trabajo
      </motion.p>

      <TextReveal
        as="h2"
        text="Proyectos seleccionados"
        dim={0.14}
        stagger={0.16}
        className="mt-4 text-center font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl lg:text-7xl"
      />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-center font-body text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
      >
        Diseñamos cada experiencia a partir de las necesidades reales del negocio, su público y sus objetivos.
      </motion.p>
    </>
  )
}

export default function Portfolio() {
  const { items, variant, loading } = usePortfolio()
  const homeItems = items.filter((p) => p.home)

  if (loading) return null

  return (
    <section id="proyectos" className="bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6">
        <PortfolioHeader />

        <div className="mt-16">
          {variant === 'showcase' ? (
            <PortfolioShowcase items={homeItems} />
          ) : variant === 'gallery' ? (
            <PortfolioGallery items={homeItems} />
          ) : variant === 'bento' ? (
            <PortfolioBento items={homeItems} />
          ) : variant === 'stack' ? (
            <PortfolioStack items={homeItems} />
          ) : (
            <PortfolioGrid items={homeItems}>
              <NewProjectCard />
            </PortfolioGrid>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/portfolio">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block rounded-full bg-white/8 border border-white/12 text-[#fdfdfd] font-body font-semibold px-8 py-3.5 hover:bg-[#060606] transition-colors cursor-pointer"
            >
              Ver mas
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  )
}
