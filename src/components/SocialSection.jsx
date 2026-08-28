import { useState } from 'react'
import { motion } from 'framer-motion'
import TextReveal from './TextReveal'
import { INSTAGRAM_URL, SOCIAL_CHIPS_LEFT, SOCIAL_CHIPS_RIGHT } from '../data/content'

/* Chip estática; al hacer hover la estrella cruza al otro lado del texto
   con una animación de layout muy suave. */
function Chip({ text, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="inline-flex items-center gap-2.5 rounded-full bg-paper border border-black/4 px-5 py-2.5 font-body font-medium text-[15px] text-ink cursor-default select-none shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-14px_rgba(0,0,0,0.20)] transition-shadow duration-300"
    >
      <motion.img
        layout
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        src="/images/sparkle.svg"
        alt=""
        aria-hidden
        className="w-3.5 h-3.5"
        style={{ order: hovered ? 2 : 0 }}
      />
      <motion.span layout transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }} style={{ order: 1 }}>
        {text}
      </motion.span>
    </motion.span>
  )
}

/* Sangrías horizontales para imitar la disposición escalonada del original */
const LEFT_OFFSETS = [0, 180, 30, 170]
const RIGHT_OFFSETS = [150, 0, 150, 20]

export default function SocialSection() {
  return (
    <section className="bg-paper py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <img src="/images/x39_3.svg" alt="" aria-hidden className="w-12 h-16" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display font-bold uppercase text-ink leading-[1.02] text-4xl sm:text-6xl"
        >
          Seguinos en
          <br />
          nuestras redes
          <br />
          sociales
        </motion.h2>

        <div className="mt-16 grid lg:grid-cols-[1fr_auto_1fr] items-center gap-10">
          {/* Chips izquierda */}
          <div className="hidden lg:flex flex-col items-start gap-12">
            {SOCIAL_CHIPS_LEFT.map((c, i) => (
              <span key={c} style={{ marginLeft: `${LEFT_OFFSETS[i]}px` }}>
                <Chip text={c} delay={i * 0.1} />
              </span>
            ))}
          </div>

          {/* Teléfono con Instagram */}
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            
            className="block mx-auto w-full max-w-md border-0 border-ink rounded-[22px] overflow-hidden"
          >
            <img src="/images/instagram-phone.webp" alt="Instagram de LT WEB" loading="lazy" className="w-full h-auto rounded-[22px]" />
          </motion.a>

          {/* Chips derecha */}
          <div className="hidden lg:flex flex-col items-end gap-12">
            {SOCIAL_CHIPS_RIGHT.map((c, i) => (
              <span key={c} style={{ marginRight: `${RIGHT_OFFSETS[i]}px` }}>
                <Chip text={c} delay={i * 0.1 + 0.1} />
              </span>
            ))}
          </div>
        </div>

        {/* En mobile no van las chips: quedan solo el teléfono y el texto de
            abajo. Amontonadas ocupaban media pantalla sin aportar nada. */}

        <TextReveal
          as="p"
          text="Conéctate con LT WEB y descubre las últimas tendencias en diseño web, estrategias digitales y optimización online. ¡No te pierdas nuestras novedades! 🚀"
          dim={0.14}
          stagger={0.06}
          className="mt-14 text-center font-body text-ink/70 max-w-md mx-auto leading-relaxed"
        />
      </div>
    </section>
  )
}
