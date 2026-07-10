import { motion } from 'framer-motion'
import TextReveal from './TextReveal'
import { STEPS, WHATSAPP_URL } from '../data/content'

export default function Steps() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1140px] px-6">
        <TextReveal
          as="h2"
          text="Cómo contratar tu sitio web en 3 simples pasos:"
          dim={0.14}
          stagger={0.11}
          className="text-center font-display font-extrabold uppercase text-ink leading-[1.05] text-3xl sm:text-5xl max-w-3xl mx-auto"
        />

        <div className="mt-20 grid md:grid-cols-3 gap-x-10 gap-y-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-white border border-black/10 shadow-sm font-body font-semibold text-sm cursor-default transition-colors duration-400 ease-out hover:bg-ink hover:text-white hover:border-ink">
                  {step.number}
                </span>
                {/* El lazo se extiende a través del gap para unirse con el próximo número */}
                <div className={'h-px flex-1 bg-black/8 ' + (i < STEPS.length - 1 ? 'md:-mr-10' : '')} />
              </div>
              <h3 className="mt-9 font-display font-bold uppercase text-[19px] text-[#101a3c]">{step.title}</h3>
              <p className="mt-4 font-body text-[15.5px] leading-relaxed text-ink/75 max-w-70">{step.text}</p>
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
          <span className="inline-block rounded-full bg-[#eef3fb] px-6 py-2.5 text-[15px] font-body text-[#8a9bb8]">
            ¿Tienes dudas?{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-[#3b82f6] font-medium hover:underline">
              Envíanos un mensaje.
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
