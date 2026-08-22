import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { InstagramIcon, WhatsAppIcon } from './Icons'
import { INSTAGRAM_URL, WHATSAPP_URL } from '../data/content'

export default function Navbar() {
  // En /portfolio y en las fichas de proyecto el fondo es oscuro: logo blanco
  const { pathname } = useLocation()
  const onDark = pathname.startsWith('/portfolio') || pathname.startsWith('/proyecto')
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between px-6 sm:px-12 py-8">
        <a href="/#inicio" className="select-none" aria-label="LT WEB">
          <img
            src={onDark ? '/images/logo-blanco.webp' : '/images/logo-negro.webp'}
            alt="LT WEB"
            /* Los archivos venían con márgenes transparentes enormes y además
               distintos entre sí (el negro ocupaba el 37% del alto del lienzo
               y el blanco apenas el 11%), así que con la misma clase el logo
               se achicaba a un tercio al pasar sobre una sección oscura. Los
               archivos ahora están recortados al contenido, con la misma
               proporción, y esta altura es la del logo de verdad. */
            className="h-8 sm:h-10 w-auto"
          />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-11 h-11 rounded-full bg-[#3a3a3a] text-white flex items-center justify-center"
          >
            <InstagramIcon />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="w-11 h-11 rounded-full bg-[#3a3a3a] text-white flex items-center justify-center"
          >
            <WhatsAppIcon />
          </motion.a>
        </div>
      </div>
    </motion.header>
  )
}
