import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TextReveal from './TextReveal'
import { PortfolioGrid, NewProjectCard } from './PortfolioCards'
import PortfolioShowcase from './PortfolioShowcase'
import PortfolioGallery from './PortfolioGallery'
import PortfolioBento from './PortfolioBento'
import PortfolioAccordion from './PortfolioAccordion'
import { usePortfolio } from '../data/portfolioStore'

export function PortfolioHeader() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center mb-10"
      >
        <img src="/images/users.svg" alt="" aria-hidden className="w-14 h-16" />
      </motion.div>

      <TextReveal
        as="h2"
        text="Para todos los negocios"
        dim={0.14}
        stagger={0.16}
        className="text-center font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl lg:text-7xl"
      />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-center font-body text-white/50 text-base sm:text-lg max-w-3xl mx-auto"
      >
        LT WEB crea sitios web estratégicos y escalables, adaptados tanto para emprendedores como para empresas
        consolidadas.
      </motion.p>
    </>
  )
}

export default function Portfolio() {
  const { items, variant, loading } = usePortfolio()
  const homeItems = items.filter((p) => p.home)

  if (loading) return null

  return (
    <section id="portfolio" className="bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6">
        <PortfolioHeader />

        <div className="mt-16">
          {variant === 'showcase' ? (
            <PortfolioShowcase items={homeItems} />
          ) : variant === 'gallery' ? (
            <PortfolioGallery items={homeItems} />
          ) : variant === 'bento' ? (
            <PortfolioBento items={homeItems} />
          ) : variant === 'accordion' ? (
            <PortfolioAccordion items={homeItems} />
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
