import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { NAV_LINKS } from '../data/content'

export default function BottomNav() {
  const [active, setActive] = useState('#inicio')
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    if (!onHome) {
      setActive(pathname.startsWith('/portfolio') ? '#portfolio' : '')
      return
    }
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive('#' + entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [onHome, pathname])

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 rounded-full bg-[#15161a]/85 backdrop-blur-md px-2.5 py-2 shadow-2xl shadow-black/30">
        {NAV_LINKS.map((link) => {
          const isActive = active === link.href
          const isPortfolio = link.href === '#portfolio'
          return (
            <div key={link.href} className={isPortfolio ? 'relative group' : 'relative'}>
              <a
                href={onHome ? link.href : '/' + link.href}
                className="relative block px-4 sm:px-5 py-2 text-[13px] sm:text-[15px] font-semibold font-alt whitespace-nowrap"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-white/15 border border-white/10"
                  />
                )}
                <span className={isActive ? 'relative text-white' : 'relative text-white/55 hover:text-white transition-colors duration-300'}>
                  {link.label}
                </span>
              </a>
              {isPortfolio && (
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden sm:block opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out">
                  <Link
                    to="/portfolio"
                    className="flex items-center gap-1.5 rounded-full bg-[#15161a] border border-white/12 px-4 py-2 text-xs font-semibold text-white/80 hover:text-white shadow-2xl shadow-black/40 whitespace-nowrap"
                  >
                    Ver portfolio completo
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.nav>
  )
}
