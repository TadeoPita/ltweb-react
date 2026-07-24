import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { WhatsAppIcon } from './Icons'
import { WHATSAPP_URL, CONTACT_EMAIL } from '../data/content'

const ease = [0.22, 1, 0.36, 1]

/* Bloque de cierre: es el CTA principal antes del footer.
   Se ancla como #contacto para que el link del nav caiga acá. */
export default function FinalCTA() {
  return (
    <section id="contacto" className="bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm"
        >
          Hablemos
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mt-4 font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl max-w-3xl mx-auto"
        >
          Construyamos una web a la altura de tu negocio.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="mt-6 font-body text-white/60 text-base sm:text-lg max-w-xl mx-auto"
        >
          Contanos qué necesitás y te ayudamos a definir una solución clara, profesional y preparada para crecer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href={`mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20propuesta%20-%20LTWEB`}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-ink font-body font-semibold text-base sm:text-lg px-8 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] hover:bg-white/90 transition-colors"
          >
            Solicitar una propuesta
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white/8 text-white border border-white/15 font-body font-semibold text-base sm:text-lg px-8 py-4 hover:bg-white/12 transition-colors"
          >
            <WhatsAppIcon />
            Hablar por WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
