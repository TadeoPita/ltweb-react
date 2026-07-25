import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import TextReveal from './TextReveal'
import { DIFFERENTIATORS } from '../data/content'

/* Sobre LTWEB: descripción del estudio y lista de diferenciales.
   Fondo blanco para mantener el ritmo claro/oscuro con las secciones vecinas. */
export default function About() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 font-body text-ink/70 text-base sm:text-lg leading-relaxed max-w-lg"
            >
              LTWEB es un estudio de diseño y desarrollo web enfocado en crear soluciones digitales claras, funcionales y adaptadas a cada negocio. Trabajamos directamente con nuestros clientes para entender sus objetivos, ordenar su comunicación y construir una experiencia que realmente los represente.
            </motion.p>
          </div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {DIFFERENTIATORS.map((d) => (
              <motion.li
                key={d}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="flex items-start gap-3 rounded-xl border border-black/8 bg-card px-5 py-4"
              >
                <span className="mt-0.5 flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-ink text-white">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <span className="font-body text-[15px] text-ink/85 leading-snug">{d}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
