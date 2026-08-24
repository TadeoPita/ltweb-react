import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/* Listado de proyectos con vista previa que sigue al cursor.

   Deliberadamente NO es otra grilla de miniaturas: eso ya lo hace el bento de
   arriba y repetirlo seria volver al problema de la home actual, donde varias
   secciones muestran lo mismo de maneras apenas distintas.

   Acá el listado se lee como un índice —nombre, tipo, número— y la captura
   aparece solo cuando el cursor se posa sobre una fila. Ocupa poco, deja leer
   los veintipico de proyectos de un saque y la imagen aparece cuando de
   verdad interesa.

   La previsualización va solo en dispositivos con puntero fino. En touch no
   hay hover: la fila entera es un enlace y se entra al proyecto. */
export default function ProjectList({ items }) {
  const [activo, setActivo] = useState(null)
  const contenedor = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 })

  function alMover(e) {
    const caja = contenedor.current?.getBoundingClientRect()
    if (!caja) return
    x.set(e.clientX - caja.left + 24)
    y.set(e.clientY - caja.top - 110)
  }

  const proyecto = items.find((p) => p.id === activo)

  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div ref={contenedor} className="relative mx-auto max-w-[1280px] px-6" onMouseMove={alMover}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display font-bold uppercase text-ink leading-[0.9] text-4xl sm:text-6xl">
            Lo que ya hicimos
          </h2>
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-1.5 font-body text-[13.5px] font-semibold text-ink/50 hover:text-ink transition-colors"
          >
            Ver el portfolio completo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Vista previa flotante. pointer-events-none para que nunca se
            interponga entre el cursor y la fila que está debajo. */}
        <AnimatePresence>
          {proyecto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block w-[320px] overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_60px_-20px_rgba(0,0,0,0.35)]"
            >
              <img
                src={proyecto.image}
                alt=""
                aria-hidden
                className="h-[200px] w-full object-cover object-top"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="mt-12 border-t border-black/[0.08]">
          {items.map((p, i) => (
            <li key={p.id} onMouseEnter={() => setActivo(p.id)} onMouseLeave={() => setActivo(null)}>
              <Link
                to={`/proyecto/${p.id}`}
                className="group flex items-center gap-6 border-b border-black/[0.08] py-6 transition-colors duration-300 hover:bg-black/[0.015]"
              >
                <span className="font-body text-[11px] font-semibold tracking-[0.16em] text-ink/25 w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="font-display font-bold uppercase text-ink text-xl sm:text-3xl leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">
                  {p.name}
                </span>

                <span className="ml-auto hidden sm:block font-body text-[13px] text-ink/45">
                  {p.type}
                </span>

                <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/25 transition-all duration-300 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
