import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_URL } from '../data/content'

/* Barra superior de la v3.

   La v3 dejó de usar el navbar del sitio actual porque hablaba otro idioma
   visual, pero con eso se fue también el logo. Este es el reemplazo: mínimo,
   fijo arriba, con la marca a la izquierda y una sola acción a la derecha.

   Arranca transparente sobre el hero oscuro y recién toma fondo cuando se
   scrolea, para no tapar el muro de proyectos de entrada. */

const ENLACES = [
  { label: 'El estudio', href: '#bento-v3' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Preguntas', href: '#faq' },
]

export default function V3Nav() {
  const [scrolleado, setScrolleado] = useState(false)

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 40)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  return (
    <nav
      className={
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ' +
        (scrolleado ? 'border-b border-white/10 bg-[#08080a]/85 backdrop-blur-md' : 'border-b border-transparent')
      }
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Link to="/v3" aria-label="LT WEB" className="shrink-0">
          <img
            draggable={false}
            src="/images/logo-blanco.webp"
            alt="LT WEB"
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="font-body text-[13.5px] text-white/55 transition-colors hover:text-white"
            >
              {e.label}
            </a>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full border border-white/20 px-5 py-2 font-body text-[13.5px] font-semibold text-white/90 transition-colors hover:border-white/50 hover:bg-white hover:text-[#08080a]"
        >
          Escribinos
        </a>
      </div>
    </nav>
  )
}
