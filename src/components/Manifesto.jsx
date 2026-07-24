import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TextReveal from './TextReveal'

/* Separador tipográfico grande en fondo oscuro.
   Rompe la cadena de secciones blancas y sirve como "manifiesto" del
   estudio: tres frases cortas que se pintan palabra por palabra al
   entrar al viewport, con un glow lila muy suave que se desplaza en
   parallax con el scroll. Nada de partículas ni brillos AI. */
export default function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9])

  return (
    <section
      ref={ref}
      className="relative bg-ink-2 py-32 sm:py-44 overflow-hidden"
    >
      {/* Glow lila apagado, muy sutil, con parallax por scroll */}
      <motion.img
        src="/images/glow.png"
        alt=""
        aria-hidden
        style={{ y: glowY, scale: glowScale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-none pointer-events-none select-none opacity-40"
      />

      {/* Textura de líneas horizontales apenas visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm"
        >
          Cómo pensamos
        </motion.p>

        {/* Tres frases cortas, cada una en su propia línea, con TextReveal palabra por palabra */}
        <div className="mt-10 sm:mt-14 space-y-4 sm:space-y-6 text-center">
          <TextReveal
            as="p"
            text="Diseño con propósito."
            dim={0.14}
            stagger={0.14}
            className="font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl lg:text-7xl tracking-tight"
          />
          <TextReveal
            as="p"
            text="Desarrollo sin atajos."
            dim={0.14}
            stagger={0.14}
            className="font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl lg:text-7xl tracking-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold uppercase leading-[0.95] text-4xl sm:text-6xl lg:text-7xl tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(120deg, #ffffff 20%, #7db6e8 60%, #a78bfa 100%)',
            }}
          >
            Webs que representan a tu negocio.
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 text-center font-body text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Cada proyecto arranca con las mismas preguntas: qué necesita tu negocio, quién lo usa y qué tiene que resolver la web para que valga la pena.
        </motion.p>
      </div>
    </section>
  )
}
