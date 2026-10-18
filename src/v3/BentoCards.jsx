import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { usarClicSinArrastre } from './usarClicSinArrastre'
import {
  ArrowUpRight,
  Bot,
  Clapperboard,
  Cpu,
  Globe,
  Instagram,
  Megaphone,
  MessageCircle,
  ShoppingBag,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import { WHATSAPP_URL, INSTAGRAM_URL } from '../data/content'
import { chica } from '../lib/imagen'
import { EASE, blurChild, blurStagger } from '../lib/motion'

/* Tarjetas del bento de la v3.

   El ejemplo de la librería venía con métricas inventadas ("4.875 project
   views", "$12.457 de saldo"). Acá cada tarjeta muestra algo real: proyectos
   del portfolio, la cantidad que hay cargada de verdad, las áreas de trabajo
   y los rubros. Un bento lleno de números falsos es exactamente lo que hace
   que una página se lea como una maqueta.

   Dos criterios comunes a todas:

   - Sombra mínima. Una sola capa de contacto muy suave, apenas para despegar
     la tarjeta del fondo. Nada de bloques difusos marcados.
   - Algo se mueve al pasar el cursor, pero poco: un ícono que se inclina, una
     flecha que se corre, un número que sube unos píxeles. Lo justo para que
     la tarjeta se sienta viva sin distraer. */

const SOMBRA = 'shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_16px_-10px_rgba(0,0,0,0.18)]'
const BASE = `relative h-full overflow-hidden rounded-2xl ${SOMBRA}`

const RESORTE = { type: 'spring', stiffness: 380, damping: 28 }
const PORTADAS = [
  '/images/pf-glamhair.webp',
  '/images/pf-heyinstitute.webp',
  '/images/pf-corteza.webp',
  '/images/pf-mundalma.webp',
  '/images/pf-auralys.webp',
]

const ICONOS_AREAS = {
  'Diseño y rediseño web': Globe,
  'Tiendas online': ShoppingBag,
  'Sistemas a medida': Cpu,
  Videos: Clapperboard,
  'Chatbots para WhatsApp, Instagram y Facebook': Bot,
  'Meta Ads': Megaphone,
}
const MotionLink = motion.create(Link)


const aparicion = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 26 } },
}

function Contador({ hasta }) {
  const ref = useRef(null)
  const enVista = useInView(ref, { once: true, margin: '-40px' })
  const reducir = useReducedMotion()
  const valorMV = useMotionValue(0)
  const redondo = useTransform(valorMV, (v) => Math.round(v))
  const [valor, setValor] = useState(0)

  useEffect(() => {
    if (!enVista) return
    if (reducir) {
      setValor(hasta)
      return
    }
    const control = animate(valorMV, hasta, { duration: 1.4, ease: EASE })
    const parar = redondo.on('change', setValor)
    return () => {
      control.stop()
      parar()
    }
  }, [enVista, hasta, reducir, valorMV, redondo])

  return <span ref={ref}>{valor}</span>
}

function Charla() {
  const ref = useRef(null)
  const enVista = useInView(ref, { once: true, margin: '-40px' })
  const reducir = useReducedMotion()
  const [paso, setPaso] = useState(0)

  useEffect(() => {
    if (!enVista) return
    if (reducir) {
      setPaso(3)
      return
    }
    const tiempos = [setTimeout(() => setPaso(1), 300), setTimeout(() => setPaso(2), 1200), setTimeout(() => setPaso(3), 2500)]
    return () => tiempos.forEach(clearTimeout)
  }, [enVista, reducir])

  return (
    <div ref={ref} aria-hidden className="flex min-h-[64px] flex-col gap-1.5">
      <AnimatePresence>
        {paso >= 1 && (
          <motion.span
            key="pregunta"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={RESORTE}
            className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white/75 px-3 py-1.5 font-body text-[12px] leading-snug text-ink/80"
          >
            ¿Se puede cambiar el banner para el finde?
          </motion.span>
        )}
        {paso === 2 && (
          <motion.span
            key="escribiendo"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={RESORTE}
            className="flex gap-1 self-end rounded-2xl rounded-br-md bg-ink px-3 py-2.5"
          >
            {[0, 1, 2].map((k) => (
              <motion.i
                key={k}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.15 }}
                className="block h-1.5 w-1.5 rounded-full bg-white/80"
              />
            ))}
          </motion.span>
        )}
        {paso >= 3 && (
          <motion.span
            key="respuesta"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={RESORTE}
            className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-ink px-3 py-1.5 font-body text-[12px] leading-snug text-white"
          >
            Dale. Ya quedó subido.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Marca. Usa el cohete del logo, el mismo que está en el favicon. */
export function CardMarca() {
  const x = useMotionValue(50)
  const y = useMotionValue(50)
  const sx = useSpring(x, { stiffness: 140, damping: 22 })
  const sy = useSpring(y, { stiffness: 140, damping: 22 })
  const brillo = useMotionTemplate`radial-gradient(240px circle at ${sx}% ${sy}%, rgba(167,150,240,0.32), transparent 70%)`

  const alMover = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width) * 100)
    y.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <div
      onPointerMove={alMover}
      onPointerLeave={() => {
        x.set(50)
        y.set(50)
      }}
      className={`${BASE} group bg-[#1c1c20] p-6 flex flex-col justify-between`}
    >
      <motion.div
        aria-hidden
        style={{ background: brillo }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <img draggable={false} src="/images/logo-blanco.webp" alt="LT WEB" className="relative h-7 w-auto self-start" />
      <motion.div {...blurStagger(0.08)} className="relative">
        <motion.p variants={blurChild} className="font-display font-bold uppercase text-white/95 leading-[0.95] text-2xl">
          Estudio de
          <br />
          diseño y código
        </motion.p>
        <motion.p variants={blurChild} className="mt-2 font-body text-[13px] text-white/45">
          Buenos Aires, Argentina
        </motion.p>
      </motion.div>
      <img
        draggable={false}
        src="/images/sparkle.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-6 w-28 opacity-20 transition-transform duration-700 ease-out group-hover:rotate-12 group-hover:scale-110"
      />
    </div>
  )
}

/* Proyecto con la captura de fondo. */
export function CardProyecto({ id, nombre, tipo, imagen }) {
  const navegar = useNavigate()
  const clic = usarClicSinArrastre(() => navegar(`/proyecto/${id}`))

  return (
    <Link draggable={false} to={`/proyecto/${id}`} {...clic} className={`${BASE} group block bg-black`}>
      <img
        draggable={false}
        src={chica(imagen)}
        alt={nombre}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top opacity-70 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {tipo}
        </p>
        <p className="mt-1 font-display font-bold uppercase text-white text-xl leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          {nombre}
        </p>
      </div>
      <ArrowUpRight className="absolute top-5 right-5 h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

/* Contador de proyectos.

   El número sale de la base, no está escrito a mano: cada proyecto que se
   carga desde /admin lo actualiza solo en el próximo ingreso a la página. */
export function CardPortfolio({ cantidad }) {
  const navegar = useNavigate()
  const clic = usarClicSinArrastre(() => navegar('/portfolio'))

  return (
    <MotionLink
      draggable={false}
      {...clic}
      to="/portfolio"
      initial="reposo"
      whileHover="hover"
      className={`${BASE} group block p-6 flex flex-col justify-center`}
      style={{ backgroundColor: 'var(--color-pastel-blue)' }}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display font-bold text-ink/90 leading-none text-6xl tabular-nums">
          <Contador hasta={cantidad} />
        </span>
        <span className="font-display font-bold text-ink/45 leading-none text-3xl">+</span>
      </div>
      <p className="mt-3 font-display font-bold uppercase text-ink/85 text-[15px] leading-tight">
        Proyectos entregados
      </p>
      <span className="mt-2 inline-flex items-center gap-1.5 font-body text-[13px] text-ink/55">
        Ver el portfolio
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <div aria-hidden className="pointer-events-none absolute -bottom-3 right-8 hidden h-20 w-48 sm:block">
        {PORTADAS.map((p, i) => (
          <motion.img
            key={p}
            src={chica(p)}
            alt=""
            draggable={false}
            variants={{
              reposo: { rotate: (i - 2) * 5, x: (i - 2) * 9, y: 0 },
              hover: { rotate: (i - 2) * 11, x: (i - 2) * 24, y: -9 },
            }}
            transition={RESORTE}
            style={{ zIndex: i }}
            className="absolute left-1/2 top-0 h-[58px] w-[56px] origin-bottom -translate-x-1/2 rounded-md object-cover object-top shadow-[0_12px_22px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/10"
          />
        ))}
      </div>
    </MotionLink>
  )
}

/* Las tres áreas de trabajo, en lista. */
export function CardAreas({ areas }) {
  return (
    <div className={`${BASE} border border-black/[0.07] bg-white p-6 flex flex-col`}>
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Qué hacemos
      </p>
      <motion.ul {...blurStagger(0.06)} className="mt-2.5 flex flex-col divide-y divide-black/[0.06]">
        {areas.map((a) => {
          const Icono = ICONOS_AREAS[a] ?? Globe
          return (
            <motion.li key={a} variants={blurChild} className="group/fila flex items-center gap-2 py-[3px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-paper text-ink/60 transition-colors duration-300 group-hover/fila:bg-ink group-hover/fila:text-white">
                <Icono className="h-3 w-3" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[12px] font-bold uppercase leading-[1.1] text-ink/85 transition-transform duration-300 ease-out group-hover/fila:translate-x-0.5">
                {a}
              </span>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}

/* Rubros con los que ya trabajamos. */
export function CardRubros({ rubros }) {
  return (
    <div className={`${BASE} border border-black/[0.07] bg-white p-6 flex flex-col justify-between`}>
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Dónde ya trabajamos
      </p>
      <motion.ul {...blurStagger(0.05)} className="mt-4 flex flex-wrap gap-2">
        {rubros.map((r) => (
          <motion.li
            key={r}
            variants={aparicion}
            whileHover={{ y: -2 }}
            className="cursor-default rounded-full border border-black/[0.09] px-3 py-1 font-body text-[13px] text-ink/65 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
          >
            {r}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

/* Autoadministrable: el panel es parte del producto, no un extra. */
/* Sitios autoadministrables.

   Es algo que el estudio hace pero ofrece poco, asi que el texto describe la
   posibilidad en vez de prometer una prestacion: antes decia "Lo editas vos...
   sin depender de nosotros ni pagar por cada cambio", que es un compromiso que
   despues hay que sostener en todos los proyectos. Tampoco enumera que se
   puede editar, porque eso cambia segun el caso. */
export function CardPanel() {
  return (
    <div
      className={`${BASE} group p-6 flex flex-col justify-between`}
      style={{ backgroundColor: 'var(--color-pastel-green)' }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-ink/80 transition-transform duration-500 ease-out group-hover:-rotate-6">
        <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div>
        <p className="font-display font-bold uppercase text-ink/90 text-[15px] leading-tight">
          Autoadministrable
        </p>
        <p className="mt-2 font-body text-[13.5px] leading-relaxed text-ink/60">
          Sitios autoadministrables a medida, según lo que necesite cada proyecto.
        </p>
      </div>
    </div>
  )
}

/* Trato directo: el diferencial que más repiten los clientes. */
export function CardDirecto() {
  return (
    <div className={`${BASE} group p-6 flex flex-col justify-between`} style={{ backgroundColor: 'var(--color-pastel-orange)' }}>
      <Charla />
      <div>
        <p className="flex items-center gap-1.5 font-display font-bold uppercase text-ink/90 text-[15px] leading-tight">
          <Zap className="h-4 w-4 transition-transform duration-500 ease-out group-hover:-rotate-12" strokeWidth={2.2} />
          Sin intermediarios
        </p>
        <p className="mt-2 font-body text-[13.5px] leading-relaxed text-ink/60">
          Hablás siempre con quien diseña y programa tu web. Nadie te pasa de área.
        </p>
      </div>
    </div>
  )
}

/* Redes, como salida secundaria. */
export function CardRedes() {
  const clic = usarClicSinArrastre(() => window.open(INSTAGRAM_URL, '_blank', 'noopener'))

  return (
    <a
      draggable={false}
      {...clic}
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} group border border-black/[0.07] bg-white p-6 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
          En Instagram
        </p>
        <Instagram className="h-4 w-4 text-ink/35 transition-colors duration-300 group-hover:text-ink/70" strokeWidth={1.8} />
      </div>
      <div>
        <p className="font-display font-bold uppercase text-ink/90 text-2xl leading-none transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          @ltweb.ar
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 font-body text-[13px] text-ink/55">
          Procesos y detrás de escena
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}

/* Plazo de entrega.

   El dato sale de la respuesta del FAQ, así que no es un número inventado
   para llenar la tarjeta: es el mismo que damos cuando nos preguntan. */
export function CardPlazo() {
  return (
    <motion.div
      {...blurStagger(0.04)}
      className={`${BASE} group border border-black/[0.07] bg-white p-6 flex flex-col justify-center`}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="font-display font-bold text-[#26262b] leading-none text-5xl transition-transform duration-500 ease-out group-hover:-translate-y-1">
          1-2
        </span>
        <span className="font-display font-bold uppercase text-ink/45 leading-none text-lg">semanas</span>
      </div>
      <p className="mt-3 font-display font-bold uppercase text-ink/85 text-[15px] leading-tight">
        Una web lista
      </p>
      <p className="mt-1.5 font-body text-[13px] leading-relaxed text-ink/55">
        Un e-commerce o un sitio más grande, entre dos y cuatro semanas.
      </p>
      <div className="mt-4 flex gap-[3px]" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { scaleY: 0.2, opacity: 0.2 },
              visible: { scaleY: 1, opacity: i < 7 ? 1 : 0.4, transition: { delay: i * 0.05, duration: 0.45, ease: EASE } },
            }}
            className="h-4 flex-1 origin-bottom rounded-[2px] bg-ink"
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-body text-[10px] font-medium uppercase tracking-[0.12em] text-ink/35">
        <span>Semana 1</span>
        <span>Semana 2</span>
      </div>
    </motion.div>
  )
}

/* Cierre: la acción. */
export function CardContacto() {
  const clic = usarClicSinArrastre(() => window.open(WHATSAPP_URL, '_blank', 'noopener'))
  const reducir = useReducedMotion()

  return (
    <a
      draggable={false}
      {...clic}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} group p-6 flex flex-col justify-between`}
      style={{ backgroundColor: '#d7c6f7' }}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/45 text-ink/85 transition-transform duration-500 ease-out group-hover:scale-105">
        {!reducir && (
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-ink/45"
          />
        )}
        <MessageCircle className="relative h-5 w-5" strokeWidth={1.9} />
      </span>
      <div>
        <p className="font-display font-bold uppercase text-ink leading-[0.95] text-2xl">
          Contanos
          <br />
          tu proyecto
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-body text-[13.5px] font-semibold text-ink/70">
          Escribinos por WhatsApp
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}

const MODULOS = [
  { id: 'turnos', etiqueta: 'Turnos' },
  { id: 'stock', etiqueta: 'Stock' },
  { id: 'pedidos', etiqueta: 'Pedidos' },
]
const HORAS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']
const PRODUCTOS = [
  { n: 'Remeras', q: 24, max: 40 },
  { n: 'Buzos', q: 6, max: 30 },
  { n: 'Gorras', q: 15, max: 20 },
]
const PEDIDOS = [
  { id: 1042, n: 'Mesa 4 · 2 pizzas' },
  { id: 1043, n: 'Delivery · Lucía' },
  { id: 1044, n: 'Mostrador · 1 combo' },
]
const ESTADOS = ['Nuevo', 'En preparación', 'Entregado']
const COLOR_ESTADO = { Nuevo: '#5b46b8', 'En preparación': '#c2410c', Entregado: '#2c6e52' }

function Turnos() {
  const [ocupados, setOcupados] = useState(() => new Set([1, 2, 5]))
  const alternar = (i) =>
    setOcupados((prev) => {
      const n = new Set(prev)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5">
        {HORAS.map((h, i) => {
          const ocupado = ocupados.has(i)
          return (
            <motion.button
              key={h}
              type="button"
              onClick={() => alternar(i)}
              whileTap={{ scale: 0.92 }}
              animate={{ backgroundColor: ocupado ? '#161616' : 'rgba(255,255,255,0.8)', color: ocupado ? '#ffffff' : '#161616' }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              aria-pressed={ocupado}
              aria-label={`Turno de las ${h}`}
              className="cursor-pointer rounded-md py-[5px] font-body text-[10.5px] font-semibold tabular-nums ring-1 ring-black/[0.06]"
            >
              {h}
            </motion.button>
          )
        })}
      </div>
      <p className="mt-2 font-body text-[10.5px] text-ink/50">
        <span className="font-semibold tabular-nums text-ink/80">{ocupados.size}</span> de {HORAS.length} turnos ocupados hoy
      </p>
    </div>
  )
}

function Stock() {
  const [cant, setCant] = useState(PRODUCTOS.map((p) => p.q))
  const mover = (i, d) => setCant((c) => c.map((v, k) => (k === i ? Math.max(0, Math.min(PRODUCTOS[k].max, v + d)) : v)))

  return (
    <div className="flex flex-col gap-[7px]">
      {PRODUCTOS.map((p, i) => {
        const bajo = cant[i] <= 8
        return (
          <div key={p.n} className="flex items-center gap-2">
            <span className="w-[52px] font-body text-[10.5px] font-semibold text-ink/80">{p.n}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.08]">
              <motion.div
                animate={{ width: `${(cant[i] / p.max) * 100}%`, backgroundColor: bajo ? '#c2410c' : '#161616' }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className="h-full rounded-full"
              />
            </div>
            <span className="w-5 text-right font-body text-[10.5px] tabular-nums text-ink/70">{cant[i]}</span>
            <span className="flex gap-0.5">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                aria-label={`Quitar una unidad de ${p.n}`}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-white/80 font-body text-[12px] leading-none ring-1 ring-black/[0.08] hover:bg-white"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                aria-label={`Agregar una unidad de ${p.n}`}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-white/80 font-body text-[12px] leading-none ring-1 ring-black/[0.08] hover:bg-white"
              >
                +
              </button>
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Pedidos() {
  const [estado, setEstado] = useState([0, 1, 2])
  const avanzar = (i) => setEstado((e) => e.map((v, k) => (k === i ? (v + 1) % ESTADOS.length : v)))

  return (
    <div className="flex flex-col gap-1.5">
      {PEDIDOS.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => avanzar(i)}
          aria-label={`Pedido ${p.id}, ${ESTADOS[estado[i]]}. Tocar para avanzar el estado`}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-white/75 px-2 py-1 text-left ring-1 ring-black/[0.06] transition-colors hover:bg-white"
        >
          <span className="font-body text-[9.5px] tabular-nums text-ink/40">#{p.id}</span>
          <span className="flex-1 truncate font-body text-[10.5px] font-semibold text-ink/80">{p.n}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={estado[i]}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              style={{ backgroundColor: COLOR_ESTADO[ESTADOS[estado[i]]] }}
              className="rounded-full px-1.5 py-[2px] font-body text-[8.5px] font-semibold text-white"
            >
              {ESTADOS[estado[i]]}
            </motion.span>
          </AnimatePresence>
        </button>
      ))}
    </div>
  )
}

export function CardSistemas() {
  const raiz = useRef(null)
  const enVista = useInView(raiz, { amount: 0.5 })
  const reducir = useReducedMotion()
  const [modulo, setModulo] = useState(0)
  const ultimaAccion = useRef(0)

  useEffect(() => {
    if (!enVista || reducir) return
    const id = setInterval(() => {
      if (performance.now() - ultimaAccion.current < 6000) return
      setModulo((m) => (m + 1) % MODULOS.length)
    }, 4500)
    return () => clearInterval(id)
  }, [enVista, reducir])

  return (
    <div
      ref={raiz}
      onPointerDown={() => {
        ultimaAccion.current = performance.now()
      }}
      className={`${BASE} p-5 flex flex-col`}
      style={{ backgroundColor: 'var(--color-pastel-green)' }}
    >
      <div className="flex h-7 items-center gap-1 rounded-lg bg-white/70 p-[3px] ring-1 ring-black/[0.06]" role="tablist" aria-label="Módulos de ejemplo">
        {MODULOS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === modulo}
            onClick={() => setModulo(i)}
            className={
              'relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-md font-body text-[10.5px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink ' +
              (i === modulo ? 'text-white' : 'text-ink/65 hover:text-ink')
            }
          >
            {i === modulo && <motion.span layoutId="modulo-activo" transition={RESORTE} className="absolute inset-0 rounded-md bg-ink" />}
            <span className="relative">{m.etiqueta}</span>
          </button>
        ))}
      </div>

      <div className="relative mt-2 min-h-[78px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={modulo}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {modulo === 0 && <Turnos />}
            {modulo === 1 && <Stock />}
            {modulo === 2 && <Pedidos />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-2">
        <p className="font-display text-[15px] font-bold uppercase leading-tight text-ink/90">Sistemas personalizados</p>
        <p className="mt-1 font-body text-[12px] leading-snug text-ink/60">Turnos, stock, pedidos. Hecho a medida.</p>
      </div>
    </div>
  )
}
