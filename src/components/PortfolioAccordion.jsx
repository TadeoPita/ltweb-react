import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'

/* Quinta versión del portfolio: acordeón de paneles.
   En desktop todos los proyectos son tiras angostas mostrando el nombre en
   vertical; al pasar el mouse por una, se expande y las demás se achican,
   como un abanico de cartas. En mobile cae a una pila vertical simple. */

function AccordionPanel({ project, isActive, onEnter }) {
  return (
    <motion.a
      href={project.url}
      target={project.url && project.url !== '#' ? '_blank' : undefined}
      rel="noreferrer"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      tabIndex={0}
      animate={{ flexGrow: isActive ? 6 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[440px] sm:h-[520px] min-w-0 basis-0 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
    >
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        className={
          'absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] ' +
          (project.blurred ? 'blur-[6px] scale-105' : '')
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      {/* Etiqueta vertical, visible cuando el panel está colapsado */}
      <div
        className={
          'absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 ' +
          (isActive ? 'opacity-0' : 'opacity-100 delay-200')
        }
      >
        <h3
          className="font-display font-bold uppercase text-white text-sm sm:text-base tracking-wide whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {project.name}
        </h3>
      </div>

      {/* Detalle completo, visible cuando el panel está expandido */}
      <div
        className={
          'absolute inset-x-0 bottom-0 p-5 sm:p-7 transition-opacity duration-300 ' +
          (isActive ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none')
        }
      >
        {project.label && (
          <span className="inline-block mb-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 font-body text-xs text-white/85">
            {project.label}
          </span>
        )}
        <h3 className="font-display font-bold uppercase text-white text-xl sm:text-3xl leading-tight whitespace-nowrap">
          {project.name}
        </h3>
        <p className="font-display font-semibold uppercase text-[#7db6e8] text-xs sm:text-sm mt-1">{project.type}</p>
      </div>

      <span
        className={
          'absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white transition-all duration-300 ' +
          (isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1')
        }
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </motion.a>
  )
}

function NewProjectPanel({ isActive, onEnter }) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      tabIndex={0}
      animate={{ flexGrow: isActive ? 6 : 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[440px] sm:h-[520px] min-w-0 basis-0 overflow-hidden rounded-2xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] to-[#5a2ea6] flex items-center justify-center"
    >
      <div className={'absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 ' + (isActive ? 'opacity-0' : 'opacity-100 delay-200')}>
        <p
          className="font-display font-bold uppercase text-white text-sm sm:text-base tracking-wide whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Nuevo proyecto
        </p>
      </div>

      <div className={'flex flex-col items-center gap-5 text-center px-4 transition-opacity duration-300 ' + (isActive ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none')}>
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-[#3b2a8f] group-hover:rotate-90 transition-transform duration-500 ease-out">
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </span>
        <p className="font-display font-bold uppercase text-lg sm:text-xl text-white whitespace-nowrap">¡Trabajemos juntos!</p>
      </div>
    </motion.a>
  )
}

export default function PortfolioAccordion({ items }) {
  const [active, setActive] = useState(items[0]?.id ?? 'new-project')

  return (
    <>
      {/* Desktop: abanico horizontal */}
      <div className="hidden lg:flex gap-3">
        {items.map((p) => (
          <AccordionPanel key={p.id ?? p.name} project={p} isActive={active === (p.id ?? p.name)} onEnter={() => setActive(p.id ?? p.name)} />
        ))}
        <NewProjectPanel isActive={active === 'new-project'} onEnter={() => setActive('new-project')} />
      </div>

      {/* Mobile / tablet: pila vertical simple */}
      <div className="lg:hidden flex flex-col gap-5">
        {items.map((p) => (
          <a
            key={p.id ?? p.name}
            href={p.url}
            target={p.url && p.url !== '#' ? '_blank' : undefined}
            rel="noreferrer"
            className="group relative h-72 rounded-2xl overflow-hidden border border-white/8"
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className={'absolute inset-0 w-full h-full object-cover object-top ' + (p.blurred ? 'blur-[6px] scale-105' : '')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            {p.label && (
              <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur px-3 py-1 font-body text-xs text-white/85">
                {p.label}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display font-bold uppercase text-white text-xl leading-tight">{p.name}</h3>
              <p className="font-display font-semibold uppercase text-[#7db6e8] text-sm mt-1">{p.type}</p>
            </div>
          </a>
        ))}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] to-[#5a2ea6] h-72 text-center p-6"
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-[#3b2a8f] group-hover:rotate-90 transition-transform duration-500 ease-out">
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </span>
          <p className="font-display font-bold uppercase text-lg text-white">¡Trabajemos juntos!</p>
        </a>
      </div>
    </>
  )
}
