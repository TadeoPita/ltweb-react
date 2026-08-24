import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { STEPS } from '../data/content'

/* Cómo trabajamos, como recorrido horizontal.

   La versión anterior era una lista de cuatro pasos en una columna: correcta
   y completamente previsible. Acá el bloque se ancla en pantalla y los pasos
   se recorren de costado a medida que se baja, así que el proceso se siente
   como un recorrido y no como cuatro cajas apiladas.

   Cómo funciona: la sección mide cuatro pantallas de alto y adentro lleva un
   contenedor sticky de una pantalla. El progreso de scroll de la sección se
   traduce en un desplazamiento horizontal de la cinta. Al terminar, la página
   sigue normalmente.

   El desplazamiento se calcula por porcentaje del ancho de la cinta y no en
   píxeles fijos, así no hay que medir nada al montar ni recalcular al
   redimensionar.

   En pantallas chicas no hay ancho para que esto tenga sentido, así que abajo
   de lg se muestran los pasos apilados de forma corriente. */

/* Los mismos pasteles que el bento: la página no suma una paleta nueva. */
const TINTES = [
  'var(--color-pastel-blue)',
  'var(--color-pastel-pink)',
  'var(--color-pastel-green)',
  'var(--color-pastel-orange)',
]

/* La versión anterior de esta tarjeta era una caja blanca muy alta con el
   número flotando arriba, el texto varado abajo y un vacío enorme entre
   medio: se leía sin terminar. Ahora es compacta y con el mismo lenguaje que
   las tarjetas del bento, que es lo que ya funciona: fondo pastel, número
   como pastilla y el contenido apoyado sin huecos muertos. */
function Paso({ paso, i }) {
  return (
    <article
      className="group relative flex h-full w-[80vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(0,0,0,0.18)] sm:w-[46vw] lg:w-[30vw]"
      style={{ backgroundColor: TINTES[i % TINTES.length] }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 font-body text-[13px] font-semibold text-ink/70">
          {String(i + 1).padStart(2, '0')}
        </span>
        <img
          src="/images/sparkle.svg"
          alt=""
          aria-hidden
          draggable={false}
          className="h-6 w-6 opacity-0 transition-opacity duration-500 group-hover:opacity-70"
        />
      </div>

      <div className="mt-8">
        <h3 className="font-display font-bold uppercase text-ink text-xl sm:text-2xl leading-tight">
          {paso.title}
        </h3>
        <p className="mt-3 font-body text-[14.5px] leading-relaxed text-ink/65">{paso.text}</p>
      </div>
    </article>
  )
}

export default function ProcessRail() {
  const seccion = useRef(null)
  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ['start start', 'end end'],
  })

  /* De 0 a -68%: lo que sobra del ancho de la cinta respecto de la pantalla. */
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-58%'])
  const barra = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="proceso-v3" className="bg-paper">
      {/* Encabezado */}
      <div className="mx-auto max-w-[1280px] px-6 pt-24 sm:pt-32">
        <span className="inline-flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-black/15" />
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            Cómo trabajamos
          </span>
        </span>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display font-bold uppercase leading-[0.9] text-ink text-4xl sm:text-6xl">
            Cuatro etapas, sin sorpresas
          </h2>
          <p className="max-w-xs font-body text-[13.5px] leading-relaxed text-ink/50">
            Sabés en qué etapa está el proyecto y qué sigue en cada momento.
          </p>
        </div>
      </div>

      {/* Recorrido horizontal, solo desde lg */}
      <div ref={seccion} className="relative hidden h-[400vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-6 pl-6 will-change-transform">
            {STEPS.map((paso, i) => (
              <div key={paso.title} className="h-[340px]">
                <Paso paso={paso} i={i} />
              </div>
            ))}
          </motion.div>

          {/* Barra de avance del recorrido */}
          <div className="mx-auto mt-14 h-px w-[min(560px,70vw)] bg-black/10">
            <motion.div style={{ width: barra }} className="h-px bg-ink/70" />
          </div>
        </div>
      </div>

      {/* Apilado en pantallas donde el recorrido no tendría sentido */}
      <div className="mx-auto max-w-[1280px] px-6 pb-24 lg:hidden">
        <div className="mt-12 flex flex-col gap-4">
          {STEPS.map((paso, i) => (
            <div key={paso.title} className="h-[280px]">
              <Paso paso={paso} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
