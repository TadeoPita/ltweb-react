import { motion } from 'framer-motion'
import TextReveal from './TextReveal'
import { STEPS, WHATSAPP_URL } from '../data/content'

export default function Steps() {
  return (
    <section id="proceso" className="bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="text-center font-display font-semibold uppercase tracking-wide text-[#7db6e8] text-sm">
          Cómo trabajamos
        </p>
        <TextReveal
          as="h2"
          text="De la primera charla al lanzamiento"
          dim={0.14}
          stagger={0.11}
          className="mt-4 text-center font-display font-bold uppercase text-white leading-[1.05] text-3xl sm:text-5xl max-w-3xl mx-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-center font-body text-white/60 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Un proceso ordenado y transparente. Sabés en qué etapa está el proyecto y qué sigue en cada momento.
        </motion.p>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-white/8 border border-white/15 font-body font-semibold text-sm text-white cursor-default transition-colors duration-400 ease-out hover:bg-white hover:text-ink hover:border-white">
                  {step.number}
                </span>
                {/* El lazo se extiende a través del gap para unirse con el próximo número */}
                <div className={'h-px flex-1 bg-white/10 ' + (i < STEPS.length - 1 ? 'lg:-mr-8' : '')} />
              </div>
              <h3 className="mt-9 font-display font-bold uppercase text-[19px] text-white">{step.title}</h3>
              <p className="mt-4 font-body text-[15.5px] leading-relaxed text-white/60 max-w-70">{step.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <span className="inline-block rounded-full bg-white/8 border border-white/12 px-6 py-2.5 text-[15px] font-body text-white/70">
            ¿Tenés dudas?{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-[#7db6e8] font-medium hover:underline">
              Escribinos por WhatsApp.
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
