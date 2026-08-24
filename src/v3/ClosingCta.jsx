import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import AuroraBackground from './AuroraBackground'
import { WHATSAPP_URL, CONTACT_EMAIL } from '../data/content'
import { EASE } from '../lib/motion'

/* Cierre.

   Repite el Aurora del encabezado a propósito: abre y cierra con el mismo
   recurso, así la página queda enmarcada en vez de terminar en cualquier
   lado. Es el único momento donde se vuelve a usar, para que no pierda efecto.

   Una sola acción, como en el hero. El correo va abajo como alternativa para
   quien no quiere escribir por WhatsApp, pero sin competirle en peso visual. */
export default function ClosingCta() {
  return (
    <AuroraBackground className="py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: EASE }}
          className="font-display font-bold uppercase text-[#26262b] leading-[0.9] text-4xl sm:text-6xl lg:text-7xl"
        >
          Contanos qué necesitás
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="mx-auto mt-6 max-w-lg font-body text-base sm:text-lg leading-relaxed text-ink/60"
        >
          Escribinos y en la primera charla te decimos qué te conviene, cuánto sale y cuánto
          tarda. Sin compromiso.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-[#111113] px-7 py-3.5 font-body text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.16),0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-colors hover:bg-black"
          >
            Escribinos por WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-1.5 font-body text-[13.5px] text-ink/50 hover:text-ink transition-colors"
          >
            {CONTACT_EMAIL}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </AuroraBackground>
  )
}
