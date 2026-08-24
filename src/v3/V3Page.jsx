import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { utils } from 'swapy'
import { ArrowRight } from 'lucide-react'
import AuroraBackground from './AuroraBackground'
import Process from './Process'
import Faq from './Faq'
import ClosingCta from './ClosingCta'
import { SwapyLayout, SwapySlot, SwapyItem, DragHandle } from './Swapy'
import {
  CardMarca,
  CardProyecto,
  CardPortfolio,
  CardAreas,
  CardRubros,
  CardPanel,
  CardPlazo,
  CardDirecto,
  CardRedes,
  CardContacto,
} from './BentoCards'
import { WHATSAPP_URL } from '../data/content'
import { usePortfolio } from '../data/portfolioStore'
import { EASE } from '../lib/motion'

/* v3 — propuesta de rediseño completo.

   Convive con la versión publicada sin tocarla: vive en /v3 y no comparte
   componentes con la home actual.

   El cambio de estructura es el punto: en vez de una sección por tema
   (servicios, proyectos, sobre nosotros, casos), lo que hacemos, lo que ya
   hicimos y con quién trabajamos entran juntos en una sola grilla que además
   se reordena arrastrando. El bento hace de portfolio, así que no hay una
   sección aparte repitiendo los mismos proyectos más abajo.

   Los titulares no usan el negro del theme (#161616). A 104px ese tono pesa
   demasiado y se come la pantalla; TITULO_COLOR es un carbón algo más suave
   que se lee igual de firme sin gritar. */

const TITULO = 'Tu negocio merece'
const TITULO_2 = 'una web a la altura.'
const TITULO_COLOR = 'text-[#26262b]'
const TITULO_COLOR_2 = 'text-[#26262b]'

const BAJADA =
  'Diseñamos y programamos webs, tiendas online y sistemas a la medida de cada negocio. Vos contás qué necesitás y nosotros lo resolvemos de punta a punta.'

const AREAS = ['Diseño y rediseño web', 'Tiendas online', 'Sistemas a medida']
const RUBROS = ['Salud', 'Educación', 'Tecnología', 'Gastronomía', 'Servicios profesionales', 'Comercio']

/* Anchos sobre una grilla de 12 columnas. El bento no es una grilla pareja:
   la irregularidad es lo que lo hace legible de un vistazo. */
const ANCHOS = [
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-3 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-3 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-5 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-3 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-4 sm:col-span-6 col-span-12 h-64',
]

export default function V3Page() {
  const { items } = usePortfolio()

  const destacados = useMemo(() => items.filter((p) => p.home && p.image).slice(0, 3), [items])

  const tarjetas = useMemo(() => {
    const proyecto = (i) =>
      destacados[i] ? (
        <CardProyecto
          id={destacados[i].id}
          nombre={destacados[i].name}
          tipo={destacados[i].type}
          imagen={destacados[i].image}
        />
      ) : null

    return [
      { id: 'marca', nodo: <CardMarca /> },
      { id: 'p1', nodo: proyecto(0) },
      { id: 'portfolio', nodo: <CardPortfolio cantidad={items.length} /> },
      { id: 'areas', nodo: <CardAreas areas={AREAS} /> },
      { id: 'p2', nodo: proyecto(1) },
      { id: 'rubros', nodo: <CardRubros rubros={RUBROS} /> },
      { id: 'p3', nodo: proyecto(2) },
      { id: 'panel', nodo: <CardPanel /> },
      { id: 'plazo', nodo: <CardPlazo /> },
      { id: 'directo', nodo: <CardDirecto /> },
      { id: 'redes', nodo: <CardRedes /> },
      { id: 'contacto', nodo: <CardContacto /> },
    ].filter((t) => t.nodo)
  }, [destacados, items.length])

  const [mapa, setMapa] = useState(null)
  const mapaActual = mapa ?? utils.initSlotItemMap(tarjetas, 'id')
  const enSlots = useMemo(
    () => utils.toSlottedItems(tarjetas, 'id', mapaActual),
    [tarjetas, mapaActual],
  )

  return (
    <main className="bg-white">
      {/* Hero con el fondo Aurora */}
      <AuroraBackground className="sticky top-0 z-0 min-h-screen pt-32 pb-20">
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
            className={`mt-8 font-display font-bold uppercase leading-[0.88] text-5xl sm:text-7xl lg:text-[104px] ${TITULO_COLOR}`}
          >
            {TITULO}
            <span className={`block ${TITULO_COLOR_2}`}>{TITULO_2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="mx-auto mt-8 max-w-xl font-body text-base sm:text-lg leading-relaxed text-ink/65"
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
              className="group inline-flex items-center gap-2 rounded-full bg-[#1c1c20] px-6 py-3 font-body text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.14),0_8px_24px_-10px_rgba(0,0,0,0.30)] transition-colors hover:bg-[#101014]"
            >
              Contanos tu proyecto
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Todo lo que sigue sube por encima del hero fijo.

          Es el recurso que da la sensación de que la página se despliega
          sobre la portada en vez de simplemente correrla hacia arriba: el
          hero queda clavado y esta hoja lo va tapando. La esquina redondeada
          y la sombra de canto marcan el borde de la hoja mientras avanza. */}
      <div className="relative z-10 rounded-t-[28px] bg-white shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.35)]">
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={`font-display font-bold uppercase leading-[0.9] text-4xl sm:text-6xl max-w-xl ${TITULO_COLOR}`}>
              Todo el estudio en una pantalla
            </h2>
            <p className="max-w-xs font-body text-[13.5px] text-ink/45">
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

      <Process />

      <Faq />

      <ClosingCta />
      </div>
    </main>
  )
}
