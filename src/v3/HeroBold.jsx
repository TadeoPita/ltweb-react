import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { usePortfolio } from '../data/portfolioStore'

/* Hero.

   Tres recursos tomados de la referencia que se pasó, que es lo que le daba
   el golpe de efecto:

   1. Fondo negro y tipografía enorme ocupando casi todo el ancho. El contraste
      hace la mitad del trabajo.
   2. El titular entra letra por letra, no de una. Cada letra es un
      inline-block propio que sube desde abajo con un retardo encadenado.
   3. Una cápsula con imagen incrustada dentro de la línea de texto, como si
      fuera una palabra más. Es el detalle que se recuerda, y acá muestra
      trabajo real: va rotando entre las portadas del portfolio.

   El titular es una declaración, no una descripción. La referencia dice
   "nobody remembers polite design"; el equivalente acá es que una web tibia
   no se la acuerda nadie. Dice más del criterio del estudio que cualquier
   lista de servicios.

   Las letras van dentro de un contenedor con overflow oculto para que suban
   desde detrás de la línea de base en vez de aparecer flotando. */

const LINEA_1 = 'Nadie recuerda'
const LINEA_2A = 'una web'
const LINEA_2B = 'tibia.'

function Letras({ texto, desde = 0 }) {
  return texto.split('').map((c, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: desde + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block whitespace-pre will-change-transform"
      >
        {c}
      </motion.span>
    </span>
  ))
}

/* Cápsula con la portada de un proyecto, incrustada en el renglón. */
function Capsula({ imagenes }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (imagenes.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % imagenes.length), 2600)
    return () => clearInterval(id)
  }, [imagenes.length])

  if (!imagenes.length) return null

  return (
    /* Se anima scaleX y no el ancho: `animate={{ width: 'auto' }}` escribe un
       estilo en línea que le gana a la clase w-[1.9em], y la cápsula se
       estiraba a todo el renglón. Con scaleX el ancho reservado no cambia,
       así que además el texto no se reacomoda mientras entra. */
    <motion.span
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      style={{ originX: 0 }}
      transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      /* `relative` es imprescindible: las capas de imagen van absolutas y sin
         él se posicionan contra la página, no contra la cápsula, y la
         cápsula queda como un hueco en el renglón. */
      className="relative mx-2 inline-block h-[0.72em] w-[1.9em] shrink-0 translate-y-[0.02em] overflow-hidden rounded-full bg-white/10 align-middle sm:mx-4"
    >
      {imagenes.map((src, n) => (
        <motion.img
          key={src}
          draggable={false}
          src={src}
          alt=""
          aria-hidden
          animate={{ opacity: n === i ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ))}
    </motion.span>
  )
}

export default function HeroBold() {
  const { items } = usePortfolio()
  const imagenes = items
    .filter((p) => p.home && p.image)
    .slice(0, 4)
    .map((p) => p.image)

  return (
    <section id="inicio-v3" className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0a0a0c] px-6 pt-32 pb-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40"
        >
          Diseño y desarrollo web · Buenos Aires
        </motion.p>

        <h1 className="mt-10 font-display font-bold uppercase leading-[0.86] text-white text-[13vw] sm:text-[11vw] lg:text-[8.6vw]">
          <span className="block">
            <Letras texto={LINEA_1} />
          </span>
          <span className="mt-2 flex flex-wrap items-center">
            <Letras texto={LINEA_2A} desde={0.3} />
            <Capsula imagenes={imagenes} />
            <Letras texto={LINEA_2B} desde={0.55} />
          </span>
        </h1>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md font-body text-[15px] leading-relaxed text-white/50"
          >
            Diseñamos y programamos webs, tiendas online y sistemas a medida. Cada proyecto se
            piensa desde cero sobre el negocio que tiene atrás.
          </motion.p>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-7 py-3.5 font-body text-[15px] font-semibold text-[#0a0a0c] transition-colors hover:bg-white/90"
          >
            Contanos tu proyecto
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
