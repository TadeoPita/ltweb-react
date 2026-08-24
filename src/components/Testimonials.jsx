import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'
import TextReveal from './TextReveal'
import Label from './Label'
import { blurUp, blurStagger, blurChild } from '../lib/motion'
import { TESTIMONIALS } from '../data/content'

/* Testimonios de clientes.

   La sección no se renderiza si no hay testimonios cargados: es preferible
   que no aparezca a que aparezca con texto de relleno. Las frases tienen que
   ser reales y dichas por el cliente; inventarlas sería falsear una reseña.

   Cada tarjeta puede enlazar a la ficha del proyecto de ese cliente
   (`projectId`), lo que ademas conecta esta sección con el portfolio. */

function Card({ item }) {
  return (
    /* Fondo blanco y una línea de 1px, igual que en Servicios. La cita ya
       tiene bastante peso propia; rellenar la tarjeta de color le sacaba
       protagonismo al texto, que es lo único que importa acá. */
    <motion.li
      variants={blurChild}
      className="group flex flex-col bg-white p-8 transition-colors duration-300 hover:bg-black/[0.015]"
    >
      <Quote className="w-6 h-6 text-ink/20 shrink-0" strokeWidth={1.8} aria-hidden />

      <blockquote className="mt-5 grow font-body text-[15px] sm:text-base leading-relaxed text-ink/80">
        {item.quote}
      </blockquote>

      <footer className="mt-7 pt-6 border-t border-black/[0.07]">
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
        <div className="max-w-3xl">
          <motion.div {...blurUp(0)}>
            <Label>Testimonios</Label>
          </motion.div>
          <TextReveal
            as="h2"
            text="Lo que dicen los que ya trabajaron con nosotros"
            dim={0.14}
            stagger={0.1}
            className="mt-7 font-display font-bold uppercase text-ink leading-[0.9] text-5xl sm:text-7xl"
          />
        </div>

        <motion.ul
          {...blurStagger(0.08, 0.1)}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07] rounded-2xl overflow-hidden"
        >
          {TESTIMONIALS.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
