import { motion } from 'framer-motion'
import { PLANS } from '../data/content'

export default function Plans() {
  return (
    <section className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              className="rounded-2xl bg-white/[0.03] border border-white/6 p-7 sm:p-9"
            >
              <span className="font-display font-semibold text-white text-lg">{plan.number}</span>
              <h3 className="mt-3 text-center font-display font-bold uppercase text-white text-2xl sm:text-[26px]">
                {plan.title}
              </h3>
              <div className="mt-7 rounded-xl overflow-hidden bg-black/40">
                <motion.img
                  src={plan.image}
                  alt={plan.title}
                  loading="lazy"
                  className="w-full h-64 object-cover object-top"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-7 text-center font-body text-[15px] leading-relaxed text-white/70">{plan.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
