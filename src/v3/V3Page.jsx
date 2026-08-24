import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { utils } from 'swapy'
import { ArrowRight } from 'lucide-react'
import V3Nav from './V3Nav'
import HeroWall from './HeroWall'
import Ending from './Ending'

/* Secciones tomadas tal cual del sitio original, sobre pedido. */
import Portfolio from '../components/Portfolio'
import FAQ from '../components/FAQ'
import SocialSection from '../components/SocialSection'
import { SwapyLayout, SwapySlot, SwapyItem } from './Swapy'
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
/* Once tarjetas en filas de doce columnas: 4+5+3, 3+4+5, 5+4+3 y una ultima
   de 12 que cierra a lo ancho, asi no queda ningun hueco. */
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
  'lg:col-span-6 sm:col-span-6 col-span-12 h-64',
  'lg:col-span-6 sm:col-span-6 col-span-12 h-64',
]

export default function V3Page() {
  const { items } = usePortfolio()

  /* Dos proyectos en el bento, no tres: con tres, la grilla quedaba muy cargada
     de capturas y las tarjetas de contenido perdian peso. Cuales aparecen sale
     del interruptor "Mostrar en la home" de /admin, asi que se eligen desde el
     panel sin tocar codigo. */
  const destacados = useMemo(() => items.filter((p) => p.home && p.image).slice(0, 2), [items])

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
    <main className="bg-[#08080a]">
      <V3Nav />

      <HeroWall />

      {/* El bento va sobre blanco, como estaba. */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display font-bold uppercase leading-[0.9] text-4xl sm:text-6xl max-w-xl text-ink">
              Todo el estudio en una pantalla
            </h2>
            <p className="max-w-xs font-body text-[13.5px] text-ink/45">
              Arrastrá las tarjetas para acomodarlas como quieras. Sí, se puede.
            </p>
          </div>

          <SwapyLayout
            id="bento-v3"
            className="mt-12"
            clave={tarjetas.map((t) => t.id).join(',')}
            config={{ swapMode: 'hover', autoScrollOnDrag: true }}
          >
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {enSlots.map(({ slotId, itemId }, i) => {
                const tarjeta = tarjetas.find((t) => t.id === itemId)
                if (!tarjeta) return null
                return (
                  <SwapySlot key={slotId} id={slotId} className={ANCHOS[i % ANCHOS.length]}>
                    {/* Sin manija: la tarjeta entera se arrastra. Con la
                        manija chica de antes, agarrarla del cuerpo no movia
                        nada y encima seleccionaba el texto. select-none corta
                        esa seleccion, que es lo que dejaba todo marcado. */}
                    <SwapyItem
                      id={itemId}
                      className="group relative cursor-grab select-none active:cursor-grabbing"
                    >
                      {tarjeta.nodo}
                    </SwapyItem>
                  </SwapySlot>
                )
              })}
            </div>
          </SwapyLayout>
        </div>
      </section>

      <Portfolio />

      <FAQ />

      <SocialSection />

      <Ending />
    </main>
  )
}
