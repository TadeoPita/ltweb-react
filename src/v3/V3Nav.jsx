import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { EASE } from '../lib/motion'

/* Barra superior de la v3.

   La v3 dejó de usar el navbar del sitio actual porque hablaba otro idioma
   visual, pero con eso se fue también el logo. Este es el reemplazo: mínimo,
   fijo arriba, con la marca a la izquierda y una sola acción a la derecha.

   Arranca transparente sobre el hero oscuro y recién toma fondo cuando se
   scrolea, para no tapar el muro de proyectos de entrada.

   Proyectos tiene dos destinos: los destacados de la home o el portfolio
   completo. En vez de elegir uno, abre un panel con los dos.

   Reseñas lleva tres barritas que se mueven como el indicador de audio de los
   videos del carrusel. Es la única sección que se escucha, y eso la marca sin
   necesitar un "nuevo" ni un color que grite.

   En celular los enlaces no entran en la barra: van en un panel a pantalla
   completa que se abre con el botón de menú. */

const SECCIONES = [
  { id: 'bento-v3', label: 'El estudio' },
  { id: 'proyectos', label: 'Proyectos', todos: '/portfolio' },
  { id: 'testimonios', label: 'Reseñas', ondas: true },
  { id: 'faq', label: 'Preguntas' },
]

/* Los enlaces son "/#seccion" para que funcionen desde cualquier página. En la
   home se scrolea directo; desde otra ruta se vuelve a la home y se espera a
   que la sección exista, porque las reseñas y el portfolio se cargan aparte y
   el salto nativo al hash llega antes que ellas. */
function usarIrASeccion() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const ir = (id) => {
    const llegar = (comportamiento) => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView({ behavior: comportamiento, block: 'start' })
      return true
    }
    if (pathname === '/' || pathname === '/v3') {
      llegar('smooth')
      return
    }
    navigate(`/#${id}`)
    let intentos = 0
    const espera = setInterval(() => {
      intentos += 1
      if (document.getElementById(id) || intentos > 50) {
        clearInterval(espera)
        /* Un respiro más para que termine de acomodarse lo que carga arriba. */
        setTimeout(() => llegar('auto'), 250)
      }
    }, 100)
  }

  /* antes: algo a hacer primero, como cerrar el panel del celular. El scroll
     espera un instante porque con el panel abierto la página está bloqueada. */
  return (id, antes) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    if (!antes) return ir(id)
    antes()
    setTimeout(() => ir(id), 60)
  }
}

function Ondas({ grande = false }) {
  const reducir = useReducedMotion()
  return (
    <span aria-hidden className={`inline-flex items-end ${grande ? 'ml-1 h-5 gap-[3px]' : 'ml-1.5 h-2.5 gap-[2px]'}`}>
      {[0.55, 1, 0.7].map((h, k) => (
        <motion.i
          key={k}
          className={`block h-full origin-bottom rounded-full bg-lilac ${grande ? 'w-[3px]' : 'w-[2px]'}`}
          initial={{ scaleY: h }}
          animate={reducir ? { scaleY: h } : { scaleY: [h, 0.3, 1, h] }}
          transition={{ duration: 1.5 + k * 0.35, repeat: Infinity, ease: 'easeInOut', delay: k * 0.2 }}
        />
      ))}
    </span>
  )
}

const enlace = 'font-body text-[13.5px] text-white/55 transition-colors hover:text-white'

function MenuProyectos({ seccion, irA }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  const demora = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => {
      if (!caja.current?.contains(e.target)) setAbierto(false)
    }
    const tecla = (e) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  const abrir = () => {
    clearTimeout(demora.current)
    setAbierto(true)
  }
  const cerrarLuego = () => {
    clearTimeout(demora.current)
    demora.current = setTimeout(() => setAbierto(false), 160)
  }

  const opcion =
    'group/op flex flex-col rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] outline-none'

  return (
    <div ref={caja} className="relative" onPointerEnter={abrir} onPointerLeave={cerrarLuego}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="true"
        onClick={() => setAbierto((a) => !a)}
        className={`${enlace} flex cursor-pointer items-center gap-1 ${abierto ? 'text-white' : ''}`}
      >
        {seccion.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>

      <AnimatePresence>
        {abierto && (
          /* El pt hace de puente entre el botón y el panel: sin él, cruzar el
             hueco con el mouse lo cerraba. */
          <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="grid w-[320px] grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-[#111114]/95 p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <a
                href={`/#${seccion.id}`}
                onClick={irA(seccion.id, () => setAbierto(false))}
                className={opcion}
              >
                <span className="font-alt text-[14px] font-semibold text-white">Destacados</span>
                <span className="mt-0.5 font-body text-[12px] text-white/45">En esta página</span>
              </a>
              <Link to={seccion.todos} onClick={() => setAbierto(false)} className={opcion}>
                <span className="flex items-center gap-1 font-alt text-[14px] font-semibold text-white">
                  Ver todos
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/op:translate-x-0.5 group-hover/op:-translate-y-0.5" />
                </span>
                <span className="mt-0.5 font-body text-[12px] text-white/45">El portfolio completo</span>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PanelMovil({ abierto, cerrar, irA }) {
  useEffect(() => {
    if (!abierto) return
    const raiz = document.documentElement
    const antes = raiz.style.overflow
    raiz.style.overflow = 'hidden'
    const tecla = (e) => e.key === 'Escape' && cerrar()
    document.addEventListener('keydown', tecla)
    return () => {
      raiz.style.overflow = antes
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto, cerrar])

  const ir = (id) => irA(id, cerrar)

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          id="menu-movil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex flex-col bg-[#08080a]/[0.97] px-6 pb-8 pt-24 backdrop-blur-xl md:hidden"
        >
          <motion.ul
            initial="oculto"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            className="flex flex-col"
          >
            {SECCIONES.map((s, i) => (
              <motion.li
                key={s.id}
                variants={{ oculto: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
                className="border-b border-white/10 py-4"
              >
                <a href={`/#${s.id}`} onClick={ir(s.id)} className="flex items-baseline gap-3">
                  <span className="font-body text-[11px] tabular-nums text-white/30">0{i + 1}</span>
                  <span className="font-display text-[34px] font-bold uppercase leading-none text-white">{s.label}</span>
                  {s.ondas && <Ondas grande />}
                </a>
                {s.todos && (
                  <div className="mt-3 flex gap-2 pl-[26px]">
                    <a
                      href={`/#${s.id}`}
                      onClick={ir(s.id)}
                      className="rounded-full border border-white/15 px-4 py-2 font-body text-[13px] font-semibold text-white/80"
                    >
                      Destacados
                    </a>
                    <Link
                      to={s.todos}
                      onClick={cerrar}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 font-body text-[13px] font-semibold text-[#08080a]"
                    >
                      Ver todos
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ul>

          <motion.a
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.4, ease: EASE } }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onClick={cerrar}
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-lilac py-4 font-body text-[15px] font-semibold text-[#08080a]"
          >
            Escribinos por WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function V3Nav() {
  const [scrolleado, setScrolleado] = useState(false)
  const [menu, setMenu] = useState(false)
  const irA = usarIrASeccion()
  const { pathname } = useLocation()

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 40)
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  /* Si se cambia de página con el panel abierto, se cierra solo. */
  useEffect(() => setMenu(false), [pathname])

  const cerrarMenu = useRef(() => setMenu(false)).current

  return (
    <>
      <nav
        className={
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ' +
          (scrolleado && !menu ? 'border-b border-white/10 bg-[#08080a]/85 backdrop-blur-md' : 'border-b border-transparent')
        }
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-4">
          <Link to="/" aria-label="LT WEB" className="shrink-0">
            <img
              draggable={false}
              src="/images/logo-blanco.webp"
              alt="LT WEB"
              className="h-7 w-auto sm:h-8"
              width="200"
              height="32"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {SECCIONES.map((s) =>
              s.todos ? (
                <MenuProyectos key={s.id} seccion={s} irA={irA} />
              ) : (
                <a key={s.id} href={`/#${s.id}`} onClick={irA(s.id)} className={`${enlace} inline-flex items-center`}>
                  {s.label}
                  {s.ondas && <Ondas />}
                </a>
              ),
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-2 font-body text-[13.5px] font-semibold text-white/90 transition-colors hover:border-white/50 hover:bg-white hover:text-[#08080a]"
            >
              Escribinos
            </a>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="menu-movil"
              aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/90 md:hidden"
            >
              {menu ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </nav>
      <PanelMovil abierto={menu} cerrar={cerrarMenu} irA={irA} />
    </>
  )
}
