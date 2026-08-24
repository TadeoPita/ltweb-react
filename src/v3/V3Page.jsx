import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { utils } from 'swapy'
import { ArrowRight } from 'lucide-react'
import AuroraBackground from './AuroraBackground'
import ProjectList from './ProjectList'
import Process from './Process'
import ClosingCta from './ClosingCta'
import { SwapyLayout, SwapySlot, SwapyItem, DragHandle } from './Swapy'
import {
  CardMarca,
  CardProyecto,
  CardDato,
  CardAreas,
  CardRubros,
  CardContacto,
} from './BentoCards'
import { WHATSAPP_URL } from '../data/content'
import { usePortfolio } from '../data/portfolioStore'
import { EASE } from '../lib/motion'

/* v3 — propuesta de rediseño completo.

   Convive con la versión publicada sin tocarla: vive en /v3 y no comparte
   componentes con la home actual, así se pueden comparar una al lado de la
   otra y descartar esta sin romper nada.

   El cambio de estructura es el punto: en vez de una sección por tema
   (servicios, proyectos, sobre nosotros, casos), lo que hacemos, lo que ya
   hicimos y con quién trabajamos entran juntos en una sola grilla que además
   se puede reordenar arrastrando. Se ve todo de un vistazo en lugar de tener
   que scrollear seis bloques con la misma estructura.

   La comunicación también cambia de eje: la home actual apunta a la web
   soñada, en abstracto. Acá el gancho es lo que de verdad nos diferencia y
   que hoy está enterrado en una tarjeta chica de "Sobre LTWEB": que no
   usamos plantillas. */

const TITULO = 'Nada de plantillas.'
const TITULO_2 = 'Tu web, desde cero.'
const BAJADA =
  'Diseñamos y programamos cada proyecto a la medida del negocio. Sin temas comprados, sin secciones de relleno, sin pagar por lo que no vas a usar.'

const AREAS = ['Diseño y rediseño web', 'Tiendas online', 'Sistemas a medida']
const RUBROS = ['Salud', 'Educación', 'Tecnología', 'Gastronomía', 'Servicios profesionales', 'Comercio']

/* Anchos de la grilla de 12 columnas. El bento no es una grilla pareja: la
   irregularidad es lo que lo hace legible de un vistazo. */
const ANCHOS = [
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-3 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-3 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-7 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
]

export default function V3Page() {
  const { items } = usePortfolio()

  /* Tres proyectos reales del portfolio para las tarjetas con imagen. */
  const destacados = useMemo(
    () => items.filter((p) => p.home && p.image).slice(0, 3),
    [items],
  )

  const tarjetas = useMemo(() => {
    const lista = [
      { id: 'marca', nodo: <CardMarca /> },
      {
        id: 'p1',
        nodo: destacados[0] ? (
          <CardProyecto
            id={destacados[0].id}
            nombre={destacados[0].name}
            tipo={destacados[0].type}
            imagen={destacados[0].image}
          />
        ) : null,
      },
      { id: 'dato', nodo: <CardDato valor="27" etiqueta="Proyectos entregados" tint="var(--color-pastel-blue)" /> },
      { id: 'areas', nodo: <CardAreas areas={AREAS} /> },
      {
        id: 'p2',
        nodo: destacados[1] ? (
          <CardProyecto
            id={destacados[1].id}
            nombre={destacados[1].name}
            tipo={destacados[1].type}
            imagen={destacados[1].image}
          />
        ) : null,
      },
      { id: 'rubros', nodo: <CardRubros rubros={RUBROS} /> },
      {
        id: 'p3',
        nodo: destacados[2] ? (
          <CardProyecto
            id={destacados[2].id}
            nombre={destacados[2].name}
            tipo={destacados[2].type}
            imagen={destacados[2].image}
          />
        ) : null,
      },
      { id: 'contacto', nodo: <CardContacto /> },
    ]
    // Si todavía no cargaron los proyectos, esas tarjetas no se muestran.
    return lista.filter((t) => t.nodo)
  }, [destacados])

  const [mapa, setMapa] = useState(null)
  const mapaActual = mapa ?? utils.initSlotItemMap(tarjetas, 'id')
  const enSlots = useMemo(
    () => utils.toSlottedItems(tarjetas, 'id', mapaActual),
    [tarjetas, mapaActual],
  )

  return (
    <main className="bg-white">
      {/* Hero con el fondo Aurora */}
      <AuroraBackground className="min-h-[92vh] pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45"
          >
            Diseño y desarrollo web · Buenos Aires
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mt-8 font-display font-bold uppercase text-ink leading-[0.88] text-5xl sm:text-7xl lg:text-[104px]"
          >
            {TITULO}
            <span className="block text-ink/35">{TITULO_2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="mx-auto mt-8 max-w-xl font-body text-base sm:text-lg leading-relaxed text-ink/60"
          >
            {BAJADA}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="mt-10 flex justify-center"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#111113] px-6 py-3 font-body text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.16),0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-colors hover:bg-black"
            >
              Contanos tu proyecto
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Bento reordenable */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display font-bold uppercase text-ink leading-[0.9] text-4xl sm:text-6xl max-w-xl">
              Todo el estudio en una pantalla
            </h2>
            <p className="font-body text-[13.5px] text-ink/45 max-w-xs">
              Arrastrá las tarjetas para acomodarlas como quieras. Sí, se puede.
            </p>
          </div>

          <SwapyLayout
            id="bento-v3"
            className="mt-12"
            config={{ swapMode: 'hover', autoScrollOnDrag: true }}
          >
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {enSlots.map(({ slotId, itemId }, i) => {
                const tarjeta = tarjetas.find((t) => t.id === itemId)
                if (!tarjeta) return null
                return (
                  <SwapySlot key={slotId} id={slotId} className={ANCHOS[i % ANCHOS.length]}>
                    <SwapyItem id={itemId} className="group relative">
                      <DragHandle className="text-white/70 mix-blend-difference" />
                      {tarjeta.nodo}
                    </SwapyItem>
                  </SwapySlot>
                )
              })}
            </div>
          </SwapyLayout>
        </div>
      </section>

      {/* El listado toma los proyectos visibles en la home; el resto queda
          para /portfolio, que ya los muestra todos. */}
      <ProjectList items={items.filter((p) => p.home && p.image)} />

      <Process />

      <ClosingCta />
    </main>
  )
}
