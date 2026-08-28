import { motion } from 'framer-motion'
import RichText from './RichText'
import Label from './Label'
import ScrollText from './ScrollText'
import { blurUp, blurStagger, blurChild } from '../lib/motion'
import { SERVICES, EXTRA_CAPABILITIES } from '../data/content'

const icons = {
  check: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.2l2.7 2.7L16.2 9.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  rocket: <img src="/images/vector-20.svg" alt="" aria-hidden className="w-5 h-5" />,
  chat: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5v-10z" />
      <path d="M20 9.5v5a2.5 2.5 0 0 1-2.5 2.5H16l2.5 3v-3" />
    </svg>
  ),
}

export default function Solutions() {
  return (
    <section id="servicios" className="relative bg-white py-24 sm:py-32">

      {/* Encabezado en dos columnas en vez de centrado.

          Todas las secciones venían con la misma receta —volanta, título
          centrado y bajada debajo— una atrás de otra, y esa repetición es lo
          que hace que una página se lea armada con plantilla. Acá el título
          va a la izquierda y la bajada lo acompaña a la derecha, apoyada
          sobre la misma línea de base. En mobile se apila. */}
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-16 lg:items-end text-center lg:text-left">
          <div>
            <motion.div {...blurUp(0)} className="flex justify-center lg:justify-start">
              <Label>Servicios</Label>
            </motion.div>

            <motion.h2
              {...blurUp(0.08)}
              className="relative mt-7 font-display font-bold uppercase text-ink leading-[0.9] text-5xl sm:text-7xl"
            >
              Qué hacemos
            </motion.h2>
          </div>

          <ScrollText
            text="Tres áreas de trabajo que cubren desde una landing simple hasta soluciones a medida integradas con el resto de tu negocio."
            className="mx-auto max-w-xl font-body text-ink text-base sm:text-lg leading-relaxed lg:mx-0 lg:pb-3"
          />
        </div>

        {/* Tres tarjetas sueltas, cada una con su borde, en vez de un bloque
            único dividido por líneas. Separadas se leen como tres propuestas
            que se pueden comparar; pegadas se leían como una tabla.

            El tratamiento es el de una página de producto: fondo blanco,
            borde de 1px, y al pasar el cursor la tarjeta se levanta y el borde
            se marca. Nada de relleno de color, que es lo que las hacía verse
            decorativas en vez de informativas.

            Lo que aporta el aire "de empresa" es la estructura, no el adorno:
            arriba el número de área y el ícono, en el medio qué es, y abajo,
            separado por una línea, el detalle de lo que incluye — leído como
            una ficha y no como un párrafo suelto. */}
        <motion.div {...blurStagger(0.1)} className="mt-16 grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              variants={blurChild}
              style={{ '--tinte': s.tint }}
              className="group flex flex-col rounded-2xl border border-black/[0.08] bg-white p-8 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:border-black/[0.16] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(0,0,0,0.30)] md:text-left"
            >
              <div className="flex items-center justify-center gap-4 md:justify-between md:gap-0">
                {/* Pastilla neutra en reposo. El color de cada area aparece
                    recien al pasar el cursor: usado asi es un dato, y no cinco
                    pasteles repartidos por la pagina para decorar. */}
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.07] bg-black/[0.03] text-ink/75 transition-all duration-500 ease-out group-hover:border-transparent group-hover:bg-[var(--tinte)] group-hover:text-ink">
                  {icons[s.icon]}
                </span>
                <span className="font-body text-[11px] font-semibold tracking-[0.18em] text-ink/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-7 font-display font-bold uppercase text-[22px] leading-tight text-ink">{s.title}</h3>
              <RichText
                as="p"
                text={s.text}
                className="mt-4 font-body text-[15px] leading-relaxed text-ink/65"
                strongClassName="text-ink"
              />

              {/* El detalle va al pie y con mt-auto, así las tres líneas
                  divisorias quedan alineadas aunque los textos midan distinto. */}
              <div className="mt-auto pt-7">
                <p className="font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/35">
                  Incluye
                </p>
                <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
                  {s.items.map((item) => (
                    <li key={item} className="font-body text-[13px] text-ink/55">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Capacidades complementarias */}
        <motion.div {...blurUp(0.1)} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/40">También trabajamos</span>
          {EXTRA_CAPABILITIES.map((cap) => (
            <motion.span
              key={cap}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="cursor-default rounded-full bg-white border border-black/8 px-4 py-1.5 text-sm font-body text-ink/70 transition-colors duration-300 hover:bg-ink hover:text-white hover:border-ink hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_20px_-12px_rgba(0,0,0,0.28)]"
            >
              {cap}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
