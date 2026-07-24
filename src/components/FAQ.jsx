import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FAQS } from '../data/content'

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-black/6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-7 text-left cursor-pointer group"
      >
        <span className="font-body font-semibold text-[17px] sm:text-lg text-ink">{faq.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white group-hover:bg-[#efefef] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className="pb-7 pr-16 font-body text-[15.5px] leading-relaxed text-ink/70 [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: faq.a }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(-1)

  return (
    <section id="faq" className="relative bg-paper py-24 sm:py-32 overflow-hidden">
      <img
        src="/images/glow.png"
        alt=""
        aria-hidden
        className="absolute top-16 left-1/2 -translate-x-1/2 w-72 pointer-events-none select-none"
      />
      <div className="relative mx-auto max-w-[1140px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display font-bold uppercase text-ink text-4xl sm:text-6xl"
        >
          ¿Tenés preguntas?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-5 text-center font-body text-ink/60 max-w-md mx-auto"
        >
          Las dudas más comunes que nos escriben antes de arrancar un proyecto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-14"
        >
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
