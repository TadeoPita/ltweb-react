import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIOS } from '../data/testimonios'
import { WHATSAPP_URL } from '../data/content'
import { useJsonLd, useSeo } from '../lib/seo'
import { DESCRIPCION_RESENAS, esquemaResenas } from '../lib/esquemas'
import { BotonWhatsapp, Volanta, aparecer } from '../components/Bloques'
import { OtrasResenas } from './ResenaPage'

export default function ResenasPage() {
  useSeo({ title: 'Reseñas en video de nuestros clientes — LTWEB', description: DESCRIPCION_RESENAS, path: '/resenas' })
  useJsonLd(esquemaResenas(TESTIMONIOS))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="bg-ink-2 min-h-screen pt-36 pb-32 text-white">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.div {...aparecer(0)} className="text-center">
          <Volanta>Reseñas</Volanta>
        </motion.div>
        <motion.h1
          {...aparecer(0.08)}
          className="mt-4 text-center font-display font-bold uppercase leading-[0.95] text-5xl sm:text-7xl"
        >
          Lo que dicen nuestros clientes
        </motion.h1>
        <motion.p {...aparecer(0.15)} className="mx-auto mt-6 max-w-2xl text-center font-body text-base text-white/55 sm:text-lg">
          {DESCRIPCION_RESENAS}
        </motion.p>
        <OtrasResenas />
        <motion.div {...aparecer(0.3)} className="mt-16 flex justify-center">
          <BotonWhatsapp href={WHATSAPP_URL}>Quiero trabajar con LTWEB</BotonWhatsapp>
        </motion.div>
      </div>
    </main>
  )
}
