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
import { blurUp, blurStagger, blurChild } from '../lib/motion'
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
  return (
    <motion.li
      variants={blurChild}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-card p-5 cursor-default"
    >
      {/* Mancha de color difuminada: aparece al pasar el cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
        style={{ backgroundColor: TINTS[index % TINTS.length] }}
      />

      <span
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-ink transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundColor: TINTS[index % TINTS.length] }}
      >
        <Icon className="w-5 h-5" strokeWidth={1.9} />
      </span>

      <p className="relative mt-4 font-display font-bold uppercase text-[15px] leading-tight text-[#101a3c]">
        {item.title}
      </p>

      {/* El detalle se despliega en hover: mantiene la grilla corta y da algo
          para descubrir sin cargar la sección de texto. */}
      <span className="relative grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
        <span className="overflow-hidden">
          <span className="block pt-2 font-body text-[13.5px] leading-relaxed text-ink/60">
            {item.text}
          </span>
        </span>
      </span>
    </motion.li>
  )
}

export default function About() {
  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden">
      {/* Halo lila muy suave, el mismo recurso que ya usan Servicios y FAQ */}
      <img
        src="/images/glow.png"
        alt=""
        aria-hidden
        className="absolute -top-20 -left-32 w-[520px] pointer-events-none select-none opacity-60"
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="max-w-2xl">
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
          <motion.p
            {...blurUp(0.15)}
            className="mt-8 font-body text-ink/70 text-base sm:text-lg leading-relaxed"
          >
            LTWEB es un estudio de diseño y desarrollo web enfocado en crear soluciones digitales claras, funcionales y adaptadas a cada negocio. Trabajamos directamente con nuestros clientes para entender sus objetivos, ordenar su comunicación y construir una experiencia que realmente los represente.
          </motion.p>
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
