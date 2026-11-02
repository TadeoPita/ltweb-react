import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react'
import { usePortfolio } from '../data/portfolioStore'
import { TESTIMONIOS } from '../data/testimonios'
import { TRANSCRIPCIONES } from '../data/transcripciones'
import { WHATSAPP_URL } from '../data/content'
import { useJsonLd, useSeo } from '../lib/seo'
import { descripcionResena, esquemaResena } from '../lib/esquemas'
import { nombreProyecto, proyectoConFicha } from '../lib/titulos'
import { BotonWhatsapp, Volanta, alVer, aparecer } from '../components/Bloques'
import NotFoundPage from './NotFoundPage'

export function OtrasResenas({ excepto }) {
  const lista = TESTIMONIOS.filter((t) => t.id !== excepto)
  return (
    <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {lista.map((t, i) => (
        <motion.li key={t.id} {...alVer(i * 0.05)}>
          <Link to={`/resenas/${t.id}`} className="clip-fix group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <span className="relative block aspect-[9/16] overflow-hidden">
              <img
                src={t.poster}
                alt={`Reseña de ${t.nombre}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play className="h-5 w-5 fill-white text-white" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span className="block font-alt text-[15px] font-semibold leading-tight text-white">{t.nombre}</span>
                <span className="mt-1 block font-alt text-[11.5px] text-white/60">{t.detalle}</span>
              </span>
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  )
}

export default function ResenaPage() {
  const { id } = useParams()
  const { items } = usePortfolio()
  const t = TESTIMONIOS.find((x) => x.id === id)
  const parrafos = (t && TRANSCRIPCIONES[t.id]) || []
  const proyecto = t && items.find((p) => p.id === t.proyecto && !p.blurred)
  const conFicha = proyecto && proyectoConFicha(proyecto)

  useSeo({
    title: t ? `Reseña de ${t.nombre}: «${t.frase}» | LTWEB` : 'Reseña — LTWEB',
    description: t ? descripcionResena(t) : undefined,
    image: t?.poster,
    path: `/resenas/${id}`,
    type: 'video.other',
  })
  useJsonLd(t && esquemaResena(t, parrafos, conFicha ? proyecto : null))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!t) return <NotFoundPage />

  return (
    <main className="bg-ink-2 min-h-screen pt-36 pb-32 text-white">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.div {...aparecer(0)}>
          <Link to="/resenas" className="inline-flex items-center gap-2 font-body text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Todas las reseñas
          </Link>
        </motion.div>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="clip-fix mx-auto w-full max-w-[380px] overflow-hidden rounded-3xl border border-white/10 bg-black lg:sticky lg:top-32"
          >
            <video
              key={t.id}
              src={t.video}
              poster={t.poster}
              controls
              playsInline
              preload="metadata"
              className="block aspect-[9/16] w-full bg-black object-cover"
            />
          </motion.div>

          <div>
            <motion.div {...aparecer(0.05)}>
              <Volanta>Reseña en video · {t.detalle}</Volanta>
            </motion.div>
            <motion.h1 {...aparecer(0.1)} className="mt-3 font-display font-bold uppercase leading-[0.95] text-4xl sm:text-6xl">
              {t.nombre}
            </motion.h1>
            <motion.p {...aparecer(0.15)} className="mt-5 font-serif text-3xl italic text-white/80 sm:text-4xl">
              “{t.frase}”
            </motion.p>

            {parrafos.length > 0 && (
              <motion.section {...aparecer(0.22)} className="mt-12">
                <h2 className="font-display text-xs font-semibold uppercase tracking-wide text-white/40">Lo que nos contó</h2>
                <div className="mt-4 space-y-4">
                  {parrafos.map((p, i) => (
                    <p key={i} className="font-body text-base leading-relaxed text-white/70 sm:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.div {...aparecer(0.3)} className="mt-12 flex flex-wrap gap-3">
              {conFicha && (
                <Link
                  to={`/proyecto/${proyecto.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-body font-semibold text-ink transition-colors hover:bg-white/90"
                >
                  Ver el proyecto de {nombreProyecto(proyecto)}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
              <BotonWhatsapp href={WHATSAPP_URL} claro={!conFicha}>
                Quiero trabajar con LTWEB
              </BotonWhatsapp>
            </motion.div>
          </div>
        </div>

        <section className="mt-28">
          <Volanta>Más reseñas</Volanta>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[0.95] sm:text-5xl">Otros clientes</h2>
          <OtrasResenas excepto={t.id} />
        </section>
      </div>
    </main>
  )
}
