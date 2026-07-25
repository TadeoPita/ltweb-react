import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import MotionLink, { projectPath } from './MotionLink'
import { useProjectCard } from './ProjectLightbox'
import { WHATSAPP_URL } from '../data/content'

/* Tercera versión del portfolio: galería horizontal cinemática.
   Las imágenes se ven de entrada (sin hover). Al scrollear verticalmente,
   la pista se desliza en horizontal con física suave.
   En mobile cae a una grilla vertical simple con imágenes grandes. */

function GalleryCard({ project, index }) {
  const card = useProjectCard(project)
  return (
    <MotionLink
      to={projectPath(project)}
      onClick={card.onClick}
      layoutId={card.layoutId}
      style={card.style}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="clip-fix group relative shrink-0 w-[78vw] sm:w-[420px] rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03]"
    >
      <div className="relative h-[420px] sm:h-[460px] overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className={
            'w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04] ' +
            (project.blurred ? 'blur-[6px] scale-105' : '')
          }
        />
        {/* Velo inferior para legibilidad del texto */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        {project.label && (
          <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur px-4 py-1.5 font-body text-xs text-white/85">
            {project.label}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <div className="min-w-0">
            <h3 className="font-display font-bold uppercase text-white text-2xl leading-tight truncate">{project.name}</h3>
            <p className="font-display font-semibold uppercase text-[#7db6e8] text-sm mt-1">{project.type}</p>
          </div>
          <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/12 backdrop-blur border border-white/20 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </MotionLink>
  )
}

function NewProjectGalleryCard() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="group relative shrink-0 w-[78vw] sm:w-[420px] h-[420px] sm:h-[460px] rounded-2xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] to-[#5a2ea6] flex flex-col items-center justify-center gap-6 text-center p-8"
    >
      <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-[#3b2a8f] group-hover:rotate-90 transition-transform duration-500 ease-out">
        <Plus className="w-9 h-9" strokeWidth={2.5} />
      </span>
      <div>
        <p
          className="font-display font-bold uppercase text-2xl text-gradient"
          style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #A0A0A0 100%)' }}
        >
          Contanos tu proyecto
        </p>
        <p
          className="font-display font-semibold uppercase text-lg mt-2 text-gradient"
          style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #A0A0A0 100%)' }}
        >
          Nuevo proyecto
        </p>
      </div>
    </a>
  )
}

export default function PortfolioGallery({ items }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [shift, setShift] = useState(0)

  // Distancia horizontal a recorrer = ancho de la pista - ancho visible
  useEffect(() => {
    function measure() {
      const track = trackRef.current
      if (!track) return
      setShift(Math.max(0, track.scrollWidth - track.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -shift])
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.4 })
  const progressScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <>
      {/* Desktop: galería horizontal ligada al scroll (full-bleed, sale del contenedor de 1140px) */}
      <div
        ref={sectionRef}
        className="hidden lg:block mx-[calc(50%-50vw)]"
        style={{ height: `${Math.max(180, 110 + items.length * 24)}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-6 pl-[max(2.5rem,calc(50vw-570px))] pr-10">
            {items.map((p, i) => (
              <GalleryCard key={p.id ?? p.name} project={p} index={i} />
            ))}
            <NewProjectGalleryCard />
          </motion.div>

          {/* Barra de progreso */}
          <div className="mt-10 mx-auto w-56 h-[3px] rounded-full bg-white/10 overflow-hidden">
            <motion.div style={{ scaleX: progressScale }} className="h-full w-full origin-left rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: pila vertical con imágenes grandes */}
      <div className="lg:hidden flex flex-col gap-5 items-center">
        {items.map((p, i) => (
          <GalleryCard key={p.id ?? p.name} project={p} index={i} />
        ))}
        <NewProjectGalleryCard />
      </div>
    </>
  )
}
