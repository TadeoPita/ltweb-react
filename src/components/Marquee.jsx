import { motion } from 'framer-motion'
import { MARQUEE_ITEMS } from '../data/content'

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <section className="bg-white py-10 overflow-hidden" aria-hidden>
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            className="shrink-0 rounded-full bg-lilac text-white font-alt font-medium text-[15px] px-7 py-3 shadow-[0_6px_18px_rgba(167,150,240,0.35)]"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
