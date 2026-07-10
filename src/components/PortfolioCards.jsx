import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'

export function ProjectCard({ project, className = '' }) {
  return (
    <motion.a
      href={project.url}
      target={project.url && project.url !== '#' ? '_blank' : undefined}
      rel="noreferrer"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className={'group flex flex-col rounded-2xl bg-white/[0.02] border border-white/6 p-5 sm:p-6 ' + className}
    >
      <h3 className="font-display font-bold uppercase text-white text-lg sm:text-xl leading-tight">{project.name}</h3>
      <p className="font-display font-semibold uppercase text-[#7db6e8] text-sm sm:text-base mt-0.5">{project.type}</p>
      <div className="relative mt-5 rounded-xl overflow-hidden flex-1">
        <motion.img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className={
            'w-full h-full object-cover object-top group-hover:scale-[1.025] transition-transform duration-700 ease-out ' +
            (project.blurred ? 'blur-[6px] scale-105' : '')
          }
        />
        {project.label && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center p-4">
            <span className="font-display font-medium text-white/90 text-base sm:text-lg text-center">
              {project.label}
            </span>
          </div>
        )}
      </div>
    </motion.a>
  )
}

export function NewProjectCard({ className = '' }) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        'flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#3b2a8f] to-[#5a2ea6] min-h-90 p-8 text-center ' +
        className
      }
    >
      <motion.span
        whileHover={{ rotate: 90 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-[#3b2a8f]"
      >
        <Plus className="w-9 h-9" strokeWidth={2.5} />
      </motion.span>
      <div>
        <p
          className="font-display font-bold uppercase text-2xl text-gradient"
          style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #A0A0A0 100%)' }}
        >
          ¡Trabajemos juntos!
        </p>
        <p
          className="font-display font-semibold uppercase text-lg mt-2 text-gradient"
          style={{ backgroundImage: 'linear-gradient(180deg, #FFFFFF 20%, #A0A0A0 100%)' }}
        >
          Nuevo proyecto
        </p>
      </div>
    </motion.a>
  )
}

/* Grilla estilo original: cards con distintos anchos según su tamaño */
export function PortfolioGrid({ items, children }) {
  const classFor = (size) => {
    if (size === 'full') return 'md:col-span-3 [&_img]:max-h-[620px]'
    if (size === 'wide') return 'md:col-span-2 [&_img]:max-h-[560px]'
    if (size === 'tall') return 'md:col-span-1 [&_img]:max-h-[680px]'
    return 'md:col-span-1 [&_img]:max-h-[420px]'
  }

  return (
    <div className="grid md:grid-cols-3 gap-5 items-start">
      {items.map((p) => (
        <ProjectCard key={p.id ?? p.name} project={p} className={classFor(p.size)} />
      ))}
      {children}
    </div>
  )
}
