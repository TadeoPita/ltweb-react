import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CLIENTS } from '../data/content'

/* Acordeón horizontal de clientes: el panel activo se expande,
   los demás quedan como columnas angostas con el nombre en vertical. */
export default function ClientsShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setActive((a) => (a + 1) % CLIENTS.length), 6000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section className="relative bg-white pb-16">
      <div
        className="mx-auto max-w-[1140px] px-4 sm:px-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[640px]">
          {CLIENTS.map((client, i) => {
            const isActive = i === active
            return (
              <motion.div
                key={client.id}
                layout
                onClick={() => setActive(i)}
                transition={{ type: 'spring', stiffness: 170, damping: 26 }}
                style={{ backgroundColor: client.bg }}
                className={
                  'relative rounded-2xl overflow-hidden cursor-pointer ' +
                  (isActive ? 'lg:flex-[6.5] h-130 lg:h-auto' : 'lg:flex-[0.8] h-20 lg:h-auto')
                }
              >
                {/* Etiqueta vertical (panel colapsado) */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center lg:items-end justify-center lg:pb-16"
                    >
                      <span className="font-display font-bold uppercase tracking-widest text-ink text-lg lg:[writing-mode:vertical-rl] lg:rotate-180">
                        {client.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contenido expandido */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.5 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      className="absolute inset-0 grid lg:grid-cols-2 gap-6 p-8 sm:p-14 items-center"
                    >
                      <div>
                        <motion.span
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
                          className="inline-block rounded-full bg-white/60 backdrop-blur border border-black/8 px-3 py-1 text-[11px] font-semibold font-body uppercase tracking-wide text-ink/70"
                        >
                          {client.category}
                        </motion.span>
                        <motion.h3
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1, transition: { delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                          style={{
                            backgroundImage: `linear-gradient(100deg, ${client.titleGradient[0]} 20%, ${client.titleGradient[1]} 100%)`,
                          }}
                          className="mt-4 font-display font-bold uppercase leading-[1.02] text-3xl sm:text-5xl whitespace-pre-line text-gradient"
                        >
                          {client.title}
                        </motion.h3>
                        <motion.div
                          initial={{ y: 24, opacity: 0 }}
                          animate={{ y: 0, opacity: 1, transition: { delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                          className="mt-6 max-w-md space-y-4"
                        >
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Problema</p>
                            <p className="mt-1 text-ink/85 font-body text-[15px] leading-relaxed">{client.problem}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Solución</p>
                            <p className="mt-1 text-ink/85 font-body text-[15px] leading-relaxed">{client.solution}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
                          className="mt-5 flex flex-wrap gap-2"
                        >
                          {client.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white/60 backdrop-blur border border-black/8 px-3 py-1 text-xs font-body text-ink/70">
                              {tag}
                            </span>
                          ))}
                        </motion.div>
                        <motion.a
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1, transition: { delay: 0.55, duration: 0.5 } }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          href={client.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-7 inline-block rounded-lg bg-[#2b2b2b] text-white font-body font-semibold px-7 py-3.5 hover:bg-[#060606] transition-colors"
                        >
                          Visitar proyecto
                        </motion.a>
                      </div>
                      <motion.div
                        initial={{ scale: 0.92, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0, transition: { delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                        className="hidden lg:flex items-center justify-center"
                      >
                        <img src={client.image} alt={client.label} className="max-h-[480px] w-auto object-contain" loading="lazy" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
