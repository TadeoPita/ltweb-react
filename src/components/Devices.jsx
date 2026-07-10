import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DEVICES } from '../data/content'

function DeviceCard({ device, index, total }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // La card se encoge levemente cuando la siguiente la tapa (efecto stack)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const isLast = index === total - 1

  return (
    <div ref={ref} className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-8" style={{ zIndex: index + 1 }}>
      <motion.div
        style={{ scale: isLast ? 1 : scale, backgroundColor: device.bg }}
        className="w-full max-w-[870px] h-[86vh] rounded-3xl overflow-hidden flex flex-col items-center pt-14 sm:pt-20 px-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
      >
        <span className="rounded-full bg-white shadow-sm border border-black/5 px-4 py-1.5 font-display font-semibold text-sm">
          {device.number}
        </span>
        <motion.h3
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display font-bold uppercase leading-[0.98] text-4xl sm:text-5xl lg:text-[62px] text-gradient max-w-3xl"
          style={{ backgroundImage: `linear-gradient(180deg, ${device.gradient[0]}, ${device.gradient[1]})` }}
        >
          {device.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-body text-[15.5px] sm:text-[17px] leading-relaxed text-ink/80 max-w-xl"
        >
          {device.text}
        </motion.p>
        <motion.img
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          src={device.image}
          alt={device.title}
          loading="lazy"
          className={
            'mt-10 object-contain object-top flex-1 min-h-0 ' +
            (device.device === 'phone' ? 'max-w-[320px]' : device.device === 'tablet' ? 'max-w-[420px]' : 'max-w-3xl')
          }
        />
      </motion.div>
    </div>
  )
}

export default function Devices() {
  return (
    <section className="relative bg-white">
      {DEVICES.map((d, i) => (
        <DeviceCard key={d.number} device={d} index={i} total={DEVICES.length} />
      ))}
    </section>
  )
}
