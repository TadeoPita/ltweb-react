import { motion } from 'framer-motion'
import RichText from './RichText'
import Label from './Label'
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
    <section id="servicios" className="relative bg-white py-24 sm:py-32 overflow-hidden">

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

          <motion.p
            {...blurUp(0.16)}
            className="mx-auto max-w-xl font-body text-ink/60 text-base sm:text-lg leading-relaxed lg:mx-0 lg:pb-3"
          >
            Tres áreas de trabajo que cubren desde una landing simple hasta soluciones a medida integradas con el resto de tu negocio.
          </motion.p>
        </div>

        {/* Las tarjetas venían rellenas de pastel de punta a punta. Tres
            bloques grandes de color plano, uno al lado del otro, es de las
            cosas que más hacen que un sitio se lea genérico: el color termina
            ocupando el lugar de la jerarquía.

            Ahora el fondo es blanco y lo que separa cada tarjeta es una línea
            de 1px. El pastel se conserva pero reducido a la pastilla del
            ícono, que es donde suma identidad sin gobernar el bloque. El
            número ordena la lectura y le da un aire editorial. */}
        <motion.div {...blurStagger(0.12)} className="mt-16 grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07] rounded-2xl overflow-hidden">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              variants={blurChild}
              className="group bg-white p-8 flex flex-col text-center md:text-left transition-colors duration-300 hover:bg-black/[0.015]"
            >
              <div className="flex items-center justify-center gap-4 md:justify-between md:gap-0">
                <span
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-ink transition-transform duration-500 ease-out group-hover:-rotate-6"
                  style={{ backgroundColor: s.tint }}
                >
                  {icons[s.icon]}
                </span>
                <span className="font-body text-[11px] font-semibold tracking-[0.18em] text-ink/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-7 font-display font-bold uppercase text-[22px] leading-tight text-ink">{s.title}</h3>
              <RichText as="p" text={s.text} className="mt-4 font-body text-[15px] leading-relaxed text-ink/65" strongClassName="text-ink" />
              <ul className="mt-6 pt-6 border-t border-black/[0.07] flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
                {s.items.map((item) => (
                  <li key={item} className="font-body text-[13px] text-ink/50">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Capacidades complementarias */}
        <motion.div {...blurUp(0.1)} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sheen text-xs font-semibold uppercase tracking-wide">También trabajamos</span>
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
