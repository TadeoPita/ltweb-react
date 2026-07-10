import { motion } from 'framer-motion'
import TextReveal from './TextReveal'
import { STATEMENTS } from '../data/content'

const iconSrc = {
  profile: '/images/vector-22.svg',
  key: '/images/mobile-access.svg',
  ok: '/images/x31_2.svg',
}

export default function Statements() {
  return (
    <section className="bg-ink text-white">
      {STATEMENTS.map((s, i) => (
        <div key={i}>
          <div className="py-40 sm:py-56 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mb-14"
            >
              <img src={iconSrc[s.icon]} alt="" aria-hidden className="w-16 h-16 sm:w-20 sm:h-20" />
            </motion.div>
            <TextReveal
              as="p"
              text={s.text}
              dim={0.14}
              stagger={0.14}
              className="font-display font-bold uppercase text-center leading-[1.05] text-4xl sm:text-6xl lg:text-7xl max-w-4xl mx-auto text-white"
            />
          </div>
          {i < STATEMENTS.length - 1 && <div className="h-px bg-white/6 mx-auto max-w-[1140px]" />}
        </div>
      ))}
    </section>
  )
}
