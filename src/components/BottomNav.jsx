import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, Home, LayoutGrid, Sparkles, Route, MessageCircle } from 'lucide-react'
import { NAV_LINKS } from '../data/content'

/* En mobile las etiquetas solas no entran: las cinco sumaban 489px sobre un
   viewport de 375 y la barra se cortaba de los dos lados. Abajo de sm cada
   ítem pasa a ícono + etiqueta chica apilados (barra de pestañas de toda la
   vida), que entra holgado y además da un área de toque decente. Desde sm
   vuelve a ser la píldora horizontal de siempre. */
const ICONS = {
  '#inicio': Home,
  '#proyectos': LayoutGrid,
  '#servicios': Sparkles,
  '#empecemos': Route,
  '#contacto': MessageCircle,
}

const ITEM_CLASS =
  'relative flex flex-col sm:flex-row items-center gap-1 sm:gap-0 px-1.5 min-[360px]:px-2 sm:px-5 py-1.5 sm:py-2 font-semibold font-alt whitespace-nowrap'

export default function BottomNav() {
  const [active, setActive] = useState('#inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) {
      const inProjects = pathname.startsWith('/portfolio') || pathname.startsWith('/proyecto')
      setActive(inProjects ? '#proyectos' : '')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive('#' + entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    // Algunas secciones (ej. portfolio) tardan en montarse porque cargan datos
    // de Supabase de forma asíncrona. Si las observamos solo una vez al montar
    // este efecto, esas secciones tardías quedan afuera para siempre. Por eso
    // reintentamos cada vez que cambia el DOM, hasta tener todas observadas.
    const observed = new Set()
    function observeAvailable() {
      NAV_LINKS.forEach((l) => {
        if (observed.has(l.href)) return
        const el = document.querySelector(l.href)
        if (el) {
          observer.observe(el)
          observed.add(l.href)
        }
      })
    }

    observeAvailable()
    const mutationObserver = new MutationObserver(observeAvailable)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [onHome, pathname])

  // Cierra el mini menú de Portfolio al tocar/clickear afuera
  useEffect(() => {
    if (!menuOpen) return
    function onOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [menuOpen])

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1rem)]"
    >
      <div className="flex items-center gap-0 min-[360px]:gap-0.5 sm:gap-1 rounded-3xl sm:rounded-full bg-[#15161a]/85 backdrop-blur-md px-1.5 min-[360px]:px-2 sm:px-2.5 py-1.5 sm:py-2 shadow-2xl shadow-black/30">
        {NAV_LINKS.map((link) => {
          const isActive = active === link.href
          const isPortfolio = link.href === '#proyectos'
          const Icon = ICONS[link.href]

          if (isPortfolio) {
            return (
              <div key={link.href} ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={ITEM_CLASS + ' cursor-pointer'}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-2xl sm:rounded-full bg-white/15 border border-white/10"
                    />
                  )}
                  {Icon && (
                    <Icon
                      className={'relative w-[18px] h-[18px] sm:hidden ' + (isActive ? 'text-white' : 'text-white/55')}
                      strokeWidth={2}
                    />
                  )}
                  <span
                    className={
                      'relative flex items-center gap-0.5 text-[10px] sm:text-[15px] leading-none ' +
                      (isActive ? 'text-white' : 'text-white/55 hover:text-white transition-colors duration-300')
                    }
                  >
                    {link.label}
                    <ChevronDown className={'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ' + (menuOpen ? 'rotate-180' : '')} />
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col gap-1 rounded-2xl bg-[#15161a] border border-white/12 p-1.5 shadow-2xl shadow-black/40 whitespace-nowrap"
                    >
                      <a
                        href={onHome ? link.href : '/' + link.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-xl px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                      >
                        Ir a la sección
                      </a>
                      <Link
                        to="/portfolio"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                      >
                        Ver portfolio completo
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          return (
            <a key={link.href} href={onHome ? link.href : '/' + link.href} className={ITEM_CLASS}>
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 rounded-2xl sm:rounded-full bg-white/15 border border-white/10"
                />
              )}
              {Icon && (
                <Icon
                  className={'relative w-[18px] h-[18px] sm:hidden ' + (isActive ? 'text-white' : 'text-white/55')}
                  strokeWidth={2}
                />
              )}
              <span
                className={
                  'relative text-[10px] sm:text-[15px] leading-none ' +
                  (isActive ? 'text-white' : 'text-white/55 hover:text-white transition-colors duration-300')
                }
              >
                {link.label}
              </span>
            </a>
          )
        })}
      </div>
    </motion.nav>
  )
}
