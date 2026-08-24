import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'
import TextReveal from './TextReveal'
import { blurUp, blurStagger, blurChild } from '../lib/motion'
import { TESTIMONIALS } from '../data/content'

/* Testimonios de clientes.

   La sección no se renderiza si no hay testimonios cargados: es preferible
   que no aparezca a que aparezca con texto de relleno. Las frases tienen que
   ser reales y dichas por el cliente; inventarlas sería falsear una reseña.

   Cada tarjeta puede enlazar a la ficha del proyecto de ese cliente
   (`projectId`), lo que ademas conecta esta sección con el portfolio. */

const TINTS = [
  'var(--color-pastel-blue)',
  'var(--color-pastel-pink)',
  'var(--color-pastel-green)',
  'var(--color-pastel-orange)',
  'var(--color-pastel-purple)',
]

function Card({ item, index }) {
  const tint = TINTS[index % TINTS.length]

  return (
    <motion.li
      variants={blurChild}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex flex-col rounded-2xl border border-black/5 p-8"
      style={{ backgroundColor: tint }}
    >
      <Quote className="w-7 h-7 text-ink/25 shrink-0" strokeWidth={1.8} aria-hidden />

      <blockquote className="mt-5 grow font-body text-[15px] sm:text-base leading-relaxed text-ink/85">
        {item.quote}
      </blockquote>

      <footer className="mt-7 pt-6 border-t border-black/10">
        <p className="font-display font-bold uppercase text-[15px] leading-tight text-[#101a3c]">
          {item.name}
        </p>
        {item.role && <p className="mt-1 font-body text-[13.5px] text-ink/60">{item.role}</p>}

        {item.projectId && (
          <Link
            to={`/proyecto/${item.projectId}`}
            className="mt-4 inline-flex items-center gap-1.5 font-body font-semibold text-[13.5px] text-ink/70 hover:text-ink transition-colors"
          >
            Ver el proyecto
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </footer>
    </motion.li>
  )
}

export default function Testimonials() {
  if (!TESTIMONIALS.length) return null

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            {...blurUp(0)}
            className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm"
          >
            Testimonios
          </motion.p>
          <TextReveal
            as="h2"
            text="Lo que dicen los que ya trabajaron con nosotros"
            dim={0.14}
            stagger={0.1}
            className="mt-4 font-display font-bold uppercase text-ink leading-[0.95] text-4xl sm:text-6xl"
          />
        </div>

        <motion.ul
          {...blurStagger(0.08, 0.1)}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map((item, i) => (
            <Card key={item.name} item={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
