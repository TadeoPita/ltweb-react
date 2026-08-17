import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  MessageSquare,
  MonitorSmartphone,
  SlidersHorizontal,
  LifeBuoy,
  Puzzle,
  Code2,
  ReceiptText,
} from 'lucide-react'
import TextReveal from './TextReveal'
import RevealText from './RevealText'
import { blurUp, blurStagger, blurChild, EASE } from '../lib/motion'
import { DIFFERENTIATORS } from '../data/content'

const ICONS = {
  palette: Palette,
  message: MessageSquare,
  devices: MonitorSmartphone,
  sliders: SlidersHorizontal,
  lifebuoy: LifeBuoy,
  puzzle: Puzzle,
  code: Code2,
  receipt: ReceiptText,
}

/* Los pasteles del theme rotan entre las tarjetas. Son los mismos que usan
   las fichas de clientes y las cards de servicios, así la paleta del sitio
   se mantiene única en vez de sumar colores nuevos. */
const TINTS = [
  'var(--color-pastel-blue)',
  'var(--color-pastel-pink)',
  'var(--color-pastel-green)',
  'var(--color-pastel-orange)',
  'var(--color-pastel-purple)',
  'var(--color-pastel-blue)',
  'var(--color-pastel-green)',
  'var(--color-pastel-pink)',
]

function Card({ item, index }) {
  const Icon = ICONS[item.icon] ?? Puzzle
  const [hovered, setHovered] = useState(false)
  const tint = TINTS[index % TINTS.length]

  return (
    <motion.li
      variants={blurChild}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-card p-5 cursor-default"
    >
      {/* Iluminación lateral: entra desde el costado derecho al pasar el cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"
        style={{ backgroundColor: tint }}
      />

      {/* La pastilla se inclina unos grados hacia el costado y se levanta:
          rotación 2D pura sobre el eje Z (rotate), sin rotateX/rotateY ni
          perspectiva — eso era 3D y deformaba el ícono en vez de inclinarlo. */}
      <motion.span
        animate={hovered ? { rotate: -8, y: -4, scale: 1.04 } : { rotate: 0, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        style={{ backgroundColor: tint }}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-ink"
      >
        <Icon className="w-5 h-5" strokeWidth={1.9} />
      </motion.span>

      <p className="relative mt-4 font-display font-bold uppercase text-[15px] leading-tight text-[#101a3c]">
        {item.title}
      </p>

      {/* El detalle queda siempre visible */}
      <p className="relative mt-2 font-body text-[13.5px] leading-relaxed text-ink/60">
        {item.text}
      </p>
    </motion.li>
  )
}

export default function About() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm">
            Sobre LTWEB
          </p>
          <TextReveal
            as="h2"
            text="Diseño claro. Desarrollo sólido."
            dim={0.14}
            stagger={0.12}
            className="mt-4 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl"
          />
          <motion.div {...blurUp(0.15)}>
            {/* Las palabras clave se descifran al apuntarlas: da algo para
                descubrir sin sumar un bloque más de contenido. */}
            <RevealText
              text="LTWEB es un estudio de diseño y desarrollo web enfocado en crear soluciones digitales claras, funcionales y adaptadas a cada negocio. Trabajamos directamente con nuestros clientes para entender sus objetivos, ordenar su comunicación y construir una experiencia que realmente los represente."
              highlight={['claras', 'funcionales', 'objetivos', 'comunicación', 'represente']}
              className="mt-8 font-body text-ink/70 text-base sm:text-lg leading-relaxed"
            />
          </motion.div>
        </div>

        <motion.ul
          {...blurStagger(0.06, 0.1)}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {DIFFERENTIATORS.map((item, i) => (
            <Card key={item.title} item={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
