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
import Label from './Label'
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
    /* Mismo sistema que las tarjetas de Servicios: fondo blanco y una línea de
       1px como única separación, en vez de ocho tarjetas sueltas con borde
       propio. Se quitó también el globo de color difuminado que entraba por el
       costado al pasar el cursor: era un efecto puesto para llamar la atención
       que no comunicaba nada y ensuciaba la retícula. */
    <motion.li
      variants={blurChild}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col items-center bg-white p-6 text-center cursor-default transition-colors duration-300 sm:items-start sm:text-left hover:bg-black/[0.015]"
    >

      {/* La pastilla se inclina unos grados hacia el costado y se levanta:
          rotación 2D pura sobre el eje Z (rotate), sin rotateX/rotateY ni
          perspectiva — eso era 3D y deformaba el ícono en vez de inclinarlo. */}
      {/* Neutra en reposo y con el pastel al pasar el cursor. Ocho pastillas
          de colores distintos, una al lado de la otra, era lo que mas le daba
          aire de plantilla a esta grilla. */}
      <motion.span
        animate={hovered ? { rotate: -8, y: -4, scale: 1.04 } : { rotate: 0, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        style={{ backgroundColor: hovered ? tint : undefined }}
        className={
          'relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-300 ' +
          (hovered ? 'border border-transparent text-ink' : 'border border-black/[0.07] bg-black/[0.03] text-ink/75')
        }
      >
        <Icon className="w-5 h-5" strokeWidth={1.9} />
      </motion.span>

      <p className="relative mt-5 font-display font-bold uppercase text-[15px] leading-tight text-ink">
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
          <Label>Sobre LTWEB</Label>
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
              text="Diseñamos y programamos webs, sin vueltas. Te escuchamos, entendemos tu negocio y armamos algo que te represente de verdad."
              highlight={['escuchamos', 'negocio', 'represente']}
              className="mt-8 font-body text-ink/70 text-base sm:text-lg leading-relaxed"
            />
          </motion.div>
        </div>

        <motion.ul
          {...blurStagger(0.06, 0.1)}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07] rounded-2xl overflow-hidden"
        >
          {DIFFERENTIATORS.map((item, i) => (
            <Card key={item.title} item={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
