import { motion } from 'framer-motion'
import { STEPS } from '../data/content'
import { EASE } from '../lib/motion'

/* Cómo trabajamos.

   La home actual resuelve esto con cuatro tarjetas iguales en fila, que es la
   forma más previsible de contarlo. Acá el título queda fijo a la izquierda
   mientras los pasos pasan al costado: el encabezado acompaña toda la
   lectura, así el visitante nunca pierde de vista de qué se le está hablando,
   y el recorrido se siente como una secuencia y no como cuatro cajas sueltas.

   El `sticky` solo se activa desde lg. En una pantalla angosta no hay ancho
   para dos columnas y fijar el título solo comería la pantalla. */
export default function Process() {
  return (
    <section id="proceso-v3" className="bg-[#111113] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-white/25" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Cómo trabajamos
              </span>
            </span>

            <h2 className="mt-7 font-display font-bold uppercase text-white leading-[0.9] text-4xl sm:text-6xl">
              De la primera charla al lanzamiento
            </h2>

            <p className="mt-6 max-w-md font-body text-white/50 text-base leading-relaxed">
              Sabés en qué etapa está el proyecto y qué sigue en cada momento. Sin sorpresas de
              plazo ni de presupuesto.
            </p>
          </div>

          <ol className="flex flex-col">
            {STEPS.map((paso, i) => (
              <motion.li
                key={paso.title}
                initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="group border-t border-white/10 py-8 last:border-b"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-body text-[11px] font-semibold tracking-[0.16em] text-white/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display font-bold uppercase text-white text-xl sm:text-2xl leading-tight">
                      {paso.title}
                    </h3>
                    <p className="mt-3 font-body text-white/50 text-[15px] leading-relaxed max-w-md">
                      {paso.text}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
