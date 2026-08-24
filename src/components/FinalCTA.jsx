import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { WhatsAppIcon } from './Icons'
import { blurUp } from '../lib/motion'
import { WHATSAPP_URL, CONTACT_EMAIL } from '../data/content'
import Label from './Label'

/* Bloque de cierre: es el CTA principal antes del footer.
   Se ancla como #contacto para que el link del nav caiga acá. */
export default function FinalCTA() {
  return (
    <section id="contacto" className="bg-[#111113] py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6 text-center">
        <motion.p
          {...blurUp(0)}
          >
          <Label tone="light">Hablemos</Label>
        </motion.p>

        <motion.h2
          {...blurUp(0.1)}
          className="mt-4 font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl max-w-3xl mx-auto"
        >
          Construyamos una web a la altura de tu negocio.
        </motion.h2>

        <motion.p
          {...blurUp(0.2)}
          className="mt-6 font-body text-white/60 text-base sm:text-lg max-w-xl mx-auto"
        >
          Contanos qué necesitás y te ayudamos a definir una solución clara, profesional y preparada para crecer.
        </motion.p>

        <motion.div {...blurUp(0.3)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href={`mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20propuesta%20-%20LTWEB`}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-ink font-body font-semibold text-base sm:text-lg px-8 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.10),0_10px_30px_-12px_rgba(0,0,0,0.30)] hover:bg-white/90 transition-colors"
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
