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
            src={onDark ? '/images/logo-blanco.png' : '/images/logo-negro.png'}
            alt="LT WEB"
            className="h-10 sm:h-12 w-auto"
          />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={
              'hidden sm:inline-flex items-center gap-2 rounded-full font-body font-semibold text-sm px-5 py-2.5 transition-colors ' +
              (onDark
                ? 'bg-white text-ink hover:bg-white/90'
                : 'bg-ink text-white hover:bg-[#060606]')
            }
          >
            Contanos tu proyecto
          </motion.a>
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
