import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { usePortfolio } from '../data/portfolioStore'
import { useLightbox } from '../components/ProjectLightbox'
import { useSeo } from '../lib/seo'
import BeforeAfter from '../components/BeforeAfter'
import { WHATSAPP_URL } from '../data/content'
import NotFoundPage from './NotFoundPage'

const ease = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

/* Bloque "Problema / Solución". Solo se renderiza si hay contenido cargado
   desde /admin, así un proyecto sin datos no muestra secciones vacías. */
function DetailBlock({ label, text, delay }) {
  if (!text) return null
  return (
    <motion.div {...fadeUp(delay)}>
      <p className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-xs">{label}</p>
      <p className="mt-3 font-body text-white/70 text-base sm:text-lg leading-relaxed">{text}</p>
    </motion.div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const { items, loading } = usePortfolio()
  const { open } = useLightbox()
  const project = items.find((p) => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  /* La ficha aporta su propio título, descripción e imagen: así cada
     proyecto se comparte con su propia portada en vez de la genérica. */
  useSeo({
    title: project ? `${project.name} — Proyecto de LTWEB` : 'Proyecto — LTWEB',
    description:
      project?.solution?.replace(/\*\*/g, '') ||
      project?.problem?.replace(/\*\*/g, '') ||
      'Un proyecto diseñado y desarrollado por LTWEB.',
    image: project?.image?.startsWith('http') ? project.image : undefined,
    path: `/proyecto/${id}`,
    type: 'article',
  })

  if (loading) {
    return (
      <main className="bg-ink-2 min-h-screen flex items-center justify-center">
        <p className="font-body text-white/40">Cargando proyecto...</p>
      </main>
    )
  }

  // Una vez cargado, si el id no existe mostramos el 404 de siempre.
  if (!project) return <NotFoundPage />

  const services = (project.services || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const hasLiveSite = project.url && project.url !== '#'

  return (
    <main className="bg-ink-2 min-h-screen pt-36 pb-32">
      <div className="mx-auto max-w-[1140px] px-6">
        {/* Volver */}
        <motion.div {...fadeUp(0)}>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
        </motion.div>

        {/* Encabezado */}
        <div className="mt-10">
          {project.category && (
            <motion.p
              {...fadeUp(0.05)}
              className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm"
            >
              {project.category}
            </motion.p>
          )}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-3 font-display font-bold uppercase text-white leading-[0.95] text-4xl sm:text-6xl lg:text-7xl"
          >
            {project.name}
          </motion.h1>
          <motion.p
            {...fadeUp(0.15)}
            className="mt-4 font-display font-semibold uppercase text-white/40 text-sm sm:text-base tracking-wide"
          >
            {project.type}
          </motion.p>
        </div>

        {/* Imagen principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="clip-fix relative mt-12 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]"
        >
          <img
            src={project.image}
            alt={project.name}
            className={'w-full h-auto object-cover object-top ' + (project.blurred ? 'blur-[6px] scale-105' : '')}
          />
          {project.label && (
            <span className="absolute top-5 left-5 rounded-full bg-black/60 backdrop-blur px-4 py-1.5 font-body text-xs text-white/85">
              {project.label}
            </span>
          )}
        </motion.div>

        {/* Contenido */}
        <div className="mt-16 grid lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-20 items-start">
          <div className="space-y-10">
            <DetailBlock label="El problema" text={project.problem} delay={0.25} />
            <DetailBlock label="La solución" text={project.solution} delay={0.3} />

            {project.description && (
              <motion.div {...fadeUp(0.35)}>
                <p className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-xs">
                  Qué hicimos
                </p>
                {/* Cada línea en blanco del admin se convierte en un párrafo */}
                {project.description.split('\n').filter((l) => l.trim()).map((para, i) => (
                  <p key={i} className="mt-3 font-body text-white/70 text-base sm:text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </motion.div>
            )}

            {!project.problem && !project.solution && !project.description && (
              <motion.p {...fadeUp(0.25)} className="font-body text-white/40 text-base">
                Estamos preparando el detalle de este proyecto.
              </motion.p>
            )}

            {/* Antes / después: solo si se cargó la captura del sitio viejo */}
            {project.beforeImage && (
              <div>
                <p className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-xs">
                  Antes y después
                </p>
                <p className="mt-2 font-body text-white/50 text-sm">
                  Arrastrá el divisor para comparar el sitio anterior con el nuevo.
                </p>
                <BeforeAfter
                  before={project.beforeImage}
                  after={project.image}
                  alt={project.name}
                  className="mt-4"
                />
              </div>
            )}

            {/* Galería de fotos extra cargadas desde /admin */}
            {(project.gallery?.length ?? 0) > 0 && (
              <div>
                <motion.p
                  {...fadeUp(0.2)}
                  className="font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-xs"
                >
                  Más imágenes
                </motion.p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {project.gallery.map((photo, i) => (
                    <motion.a
                      key={photo.url}
                      href={photo.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!open || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                        e.preventDefault()
                        // i + 1 porque la foto 0 del visor es la portada
                        open(project, i + 1)
                      }}
                      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.3), ease }}
                      className="clip-fix group block rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]"
                    >
                      <img
                        src={photo.url}
                        alt={`${project.name} — imagen ${i + 1}`}
                        loading="lazy"
                        className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ficha lateral */}
          <motion.aside
            {...fadeUp(0.4)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 lg:sticky lg:top-32"
          >
            {services.length > 0 && (
              <>
                <p className="font-display font-semibold uppercase tracking-wide text-white/40 text-xs">
                  Servicios
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-white/8 border border-white/12 px-3 py-1 font-body text-xs text-white/75"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="my-6 h-px bg-white/10" />
              </>
            )}

            {hasLiveSite && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white text-ink font-body font-semibold px-6 py-3.5 hover:bg-white/90 transition-colors"
              >
                Visitar sitio
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            )}

            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={
                'flex items-center justify-center gap-2 rounded-xl bg-white/8 text-white border border-white/15 font-body font-semibold px-6 py-3.5 hover:bg-white/12 transition-colors ' +
                (hasLiveSite ? 'mt-3' : '')
              }
            >
              Quiero algo así
            </motion.a>
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
