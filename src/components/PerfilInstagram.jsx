import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import IconoMarca from './IconoMarca'
import { usePortfolio } from '../data/portfolioStore'
import { SERVICIOS } from '../data/servicios'
import { TESTIMONIOS } from '../data/testimonios'
import { ALCANCE, DIFFERENTIATORS, INSTAGRAM_URL, LOCATION, WHATSAPP_URL } from '../data/content'
import { chica, mediana } from '../lib/imagen'
import { nombreProyecto, proyectoConFicha } from '../lib/titulos'

/* El perfil de Instagram de LTWEB dentro de un teléfono, para "Seguinos en
   redes".

   Antes era una captura fija. Ahora es la pantalla de verdad: se scrollea,
   las destacadas se abren como historias, la grilla son los proyectos del
   portfolio y cada uno lleva a su ficha. En compu el teléfono además se
   inclina siguiendo al cursor.

   Todo se dibuja en puntos de iPhone (393 de ancho) y se escala con zoom al
   ancho real de la pantalla, así las medidas copian las de la app y el
   teléfono se ve igual en cualquier tamaño. */

const USUARIO = 'ltweb.ar'
/* Seguidores y seguidos se escriben a mano: Instagram no los da sin una
   cuenta de la API. Cambiarlos acá cuando haga falta. */
const SEGUIDORES = 1284
const SEGUIDOS = 16
const ANCHO_IOS = 393
const MENSAJE_IG = `https://ig.me/m/${USUARIO}`

/* Medidas del teléfono sobre un dibujo de 580 de ancho dentro de una
   tarjeta de 800 x 1050. Todo lo demás se calcula a partir de estas. */
const BASE = 580
const TARJETA = { ancho: 800, alto: 1050 }
const TELEFONO = { izquierda: 110, arriba: 58 }
const MARCO = 10
const BISEL = 13

const fmt = (n) => n.toLocaleString('es-AR')
const horaActual = () => {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function useHora() {
  const [hora, setHora] = useState(horaActual)
  useEffect(() => {
    const t = setInterval(() => setHora(horaActual()), 15000)
    return () => clearInterval(t)
  }, [])
  return hora
}

/* ---------------------------------------------------------------- íconos */

const T = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }

function BarraEstado({ hora }) {
  return (
    <div className="relative flex items-center justify-between" style={{ height: 54, padding: '6px 30px 0 52px' }}>
      <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{hora}</span>
      <i className="absolute bg-black" style={{ left: '50%', top: 11, width: 124, height: 36, marginLeft: -62, borderRadius: 20 }} />
      <span className="flex items-center" style={{ gap: 6 }}>
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.7} y={9 - i * 2.9} width="3.2" height={3 + i * 2.9} rx="1" fill="currentColor" />
          ))}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 11.2 L5.4 8.6 a3.7 3.7 0 0 1 5.2 0 Z" fill="currentColor" />
          <path d="M2.9 6.1 a7.3 7.3 0 0 1 10.2 0 M0.6 3.6 a10.6 10.6 0 0 1 14.8 0" {...T} />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.6" y="0.6" width="22.6" height="11.8" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.1" />
          <rect x="2.3" y="2.3" width="16.6" height="8.4" rx="2" fill="currentColor" />
          <path d="M24.6 4.4 v4.2 a2.2 2.2 0 0 0 0 -4.2 Z" fill="currentColor" fillOpacity=".45" />
        </svg>
      </span>
    </div>
  )
}

const IcoAtras = () => <svg width="26" height="26" viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20" {...T} strokeWidth="2.4" /></svg>
const IcoCampana = () => <svg width="25" height="25" viewBox="0 0 24 24"><path d="M6 16.5 V11 a6 6 0 0 1 12 0 v5.5 l1.5 1.6 H4.5 Z M10 20.5 a2.2 2.2 0 0 0 4 0" {...T} /></svg>
const IcoMas = () => (
  <svg width="26" height="26" viewBox="0 0 24 24">
    {[5, 12, 19].map((x) => <circle key={x} cx={x} cy="12" r="1.7" fill="currentColor" />)}
  </svg>
)
const IcoCadena = () => <svg width="15" height="15" viewBox="0 0 24 24"><path d="M10 14 a4 4 0 0 0 5.7 0 l3-3 a4 4 0 0 0 -5.7 -5.7 l-1.2 1.2 M14 10 a4 4 0 0 0 -5.7 0 l-3 3 a4 4 0 0 0 5.7 5.7 l1.2 -1.2" {...T} /></svg>
const IcoAgregar = () => <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="10" cy="8" r="3.8" {...T} /><path d="M3.5 19.5 a6.5 6.5 0 0 1 13 0 M19 8 v6 M16 11 h6" {...T} /></svg>
const IcoFlechita = () => <svg width="13" height="13" viewBox="0 0 24 24"><path d="M6 9 l6 6 6-6" {...T} strokeWidth="2.6" /></svg>
const IcoGrilla = () => <svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1.5" {...T} /><path d="M9 3 v18 M15 3 v18 M3 9 h18 M3 15 h18" {...T} /></svg>
const IcoReels = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="4.5" {...T} />
    <path d="M3 8.5 h18 M8.5 3 l2.8 5.5 M14 3 l2.8 5.5" {...T} />
    <path d="M10 12 v5.4 l4.6 -2.7 Z" fill="currentColor" />
  </svg>
)
const IcoEtiquetas = () => <svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" {...T} /><circle cx="12" cy="10" r="3.2" {...T} /><path d="M6.6 20.6 a5.6 5.6 0 0 1 10.8 0" {...T} /></svg>
const IcoFijado = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.45))' }}>
    <path d="M15.6 2.8 l5.6 5.6 -2.3 1.1 -3.6 4.6 .4 4 -1.6 1.6 -3.6 -3.6 -5 5 -.9 -.9 5 -5 -3.6 -3.6 1.6 -1.6 4 .4 4.6 -3.6 Z" fill="#fff" />
  </svg>
)
/* El tilde azul de cuenta verificada: un círculo con ocho ondas y la tilde
   blanca adentro. */
const IcoVerificado = ({ tam = 18 }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" aria-label="Verificado" role="img" className="shrink-0">
    <circle cx="12" cy="12" r="8.8" fill="#0095f6" />
    {Array.from({ length: 8 }, (_, n) => {
      const a = (n * Math.PI) / 4
      return <circle key={n} cx={12 + 7.4 * Math.cos(a)} cy={12 + 7.4 * Math.sin(a)} r="3.4" fill="#0095f6" />
    })}
    <path d="M8.1 12.3 l2.7 2.7 l5.1-5.4" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IcoPlay = () =><svg width="18" height="18" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.5))' }}><path d="M7 4.5 v15 l12-7.5 Z" fill="#fff" /></svg>

/* --------------------------------------------------------------- historia */

/* El aro de historia nueva, con el degradé de Instagram. */
const ARO_HISTORIA = 'linear-gradient(45deg,#ffd600 0%,#ff7a00 28%,#ff0069 60%,#d300c5 100%)'

/* La historia que se abre al tocar la foto de perfil. */
const HISTORIA = {
  id: 'historia',
  nombre: 'Ahora',
  slides: [
    { titulo: 'Diseño claro. Desarrollo sólido.', texto: 'Webs, tiendas online y sistemas a medida, pensados desde cero.', icono: 'logo' },
    { titulo: 'Nuevo: asesoría de negocio', texto: 'Te ayudamos a ordenar y hacer crecer tu negocio.', enlace: '/asesoria-de-negocio', accion: 'Ver más', icono: 'anillos' },
    {
      titulo: '¿Hacemos tu web?',
      texto: 'Hablás directo con quien diseña y desarrolla tu proyecto.',
      enlace: WHATSAPP_URL,
      externo: true,
      accion: 'Escribinos por WhatsApp',
      icono: 'chat',
    },
  ],
}

/* ------------------------------------------------------------ destacadas */

/* Las portadas usan los íconos del manual de identidad, cada uno en su
   color, sobre blanco frío. */
function armarDestacadas(proyectos) {
  return [
    {
      id: 'servicios',
      nombre: 'Servicios',
      icono: 'checklist',
      slides: SERVICIOS.map((s) => ({ titulo: s.nombre, texto: s.h1, enlace: `/${s.slug}`, accion: 'Ver servicio', icono: 'checklist' })),
    },
    {
      id: 'proyectos',
      nombre: 'Proyectos',
      icono: 'capas',
      slides: proyectos
        .filter((p) => proyectoConFicha(p))
        .slice(0, 6)
        .map((p) => ({ imagen: mediana(p.image), titulo: nombreProyecto(p), texto: p.type, enlace: `/proyecto/${p.id}`, accion: 'Ver proyecto' })),
    },
    {
      id: 'nosotros',
      nombre: 'Nosotros',
      icono: 'anillos',
      slides: DIFFERENTIATORS.slice(0, 4).map((d) => ({ titulo: d.title, texto: d.text, icono: 'anillos' })),
    },
    {
      id: 'donde',
      nombre: 'Dónde',
      icono: 'ubicacion',
      slides: [{ titulo: LOCATION, texto: ALCANCE, icono: 'ubicacion' }],
    },
    {
      id: 'contacto',
      nombre: 'Contacto',
      icono: 'chat',
      slides: [
        {
          titulo: '¿Hacemos tu web?',
          texto: 'Hablás directo con quien diseña y desarrolla tu proyecto. Te respondemos con una propuesta de alcance y plazos.',
          enlace: WHATSAPP_URL,
          externo: true,
          accion: 'Escribinos por WhatsApp',
          icono: 'chat',
        },
      ],
    },
  ].filter((d) => d.slides.length)
}

function Accion({ s }) {
  if (!s.enlace) return null
  const clase =
    'relative z-20 mt-7 inline-flex items-center gap-2 rounded-full bg-[#f3f5ff] font-semibold text-[#28253d] transition-transform active:scale-95'
  const estilo = { padding: '11px 20px', fontSize: 15 }
  const contenido = (
    <>
      {s.accion}
      <IconoMarca nombre="flecha" color="#28253d" style={{ width: 12, height: 12, transform: 'rotate(-90deg)' }} />
    </>
  )
  return s.externo ? (
    <a href={s.enlace} target="_blank" rel="noreferrer" className={clase} style={estilo}>{contenido}</a>
  ) : (
    <Link to={s.enlace} className={clase} style={estilo}>{contenido}</Link>
  )
}

function Slide({ s }) {
  if (s.imagen) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'radial-gradient(120% 80% at 50% 0%, #26306b 0%, #14132a 60%, #0b0b16 100%)', padding: '96px 28px 40px' }}>
        <div className="overflow-hidden" style={{ width: '100%', aspectRatio: '4 / 4.6', borderRadius: 18, boxShadow: '0 30px 60px -30px rgba(0,0,0,.8)' }}>
          <img src={s.imagen} alt="" className="h-full w-full object-cover object-top" />
        </div>
        <p className="mt-5 font-display font-bold uppercase leading-none text-white" style={{ fontSize: 30 }}>{s.titulo}</p>
        <p className="mt-1.5 text-white/60" style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.texto}</p>
        <Accion s={s} />
      </div>
    )
  }
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{
        padding: '96px 34px 40px',
        backgroundColor: '#0c4fe4',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(165deg,#3e87fa 0%,#0c4fe4 50%,#223498 100%)',
        backgroundSize: '28px 28px,28px 28px,100% 100%',
      }}
    >
      <span className="flex items-center justify-center rounded-full bg-[#f3f5ff]" style={{ width: 96, height: 96, boxShadow: '0 20px 40px -20px rgba(10,20,80,.8)' }}>
        {s.icono === 'logo' ? (
          <img src="/marca/isotipo.svg" alt="" style={{ width: 50, height: 54 }} />
        ) : (
          <IconoMarca nombre={s.icono} style={{ width: 48, height: 48 }} />
        )}
      </span>
      <p className="mt-7 font-display font-bold uppercase leading-[0.95] text-white" style={{ fontSize: 34 }}>{s.titulo}</p>
      <p className="mt-3 text-white/80" style={{ fontSize: 16, lineHeight: 1.4 }}>{s.texto}</p>
      <Accion s={s} />
    </div>
  )
}

const DURACION = 5000

function Historia({ destacada, onCerrar, hora, zoom, alto }) {
  const [i, setI] = useState(0)
  const [pausa, setPausa] = useState(false)
  const slides = destacada.slides
  const s = slides[i]

  const siguiente = () => (i < slides.length - 1 ? setI(i + 1) : onCerrar())
  const anterior = () => setI((n) => Math.max(0, n - 1))

  /* Con teclado: Escape cierra y las flechas pasan. */
  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowRight') siguiente()
      if (e.key === 'ArrowLeft') anterior()
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  const mantener = {
    onPointerDown: () => setPausa(true),
    onPointerUp: () => setPausa(false),
    onPointerLeave: () => setPausa(false),
  }

  return (
    <motion.div
      role="dialog"
      aria-label={`Destacada ${destacada.nombre}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-0 z-30"
      style={{ transformOrigin: '50% 30%' }}
    >
      <div className="ig relative overflow-hidden bg-black text-[#f5f5f5]" style={{ zoom, width: ANCHO_IOS, height: alto }}>
        {/* Sin transición entre historias: en la app el cambio es seco, y un
            fundido dejaba un instante en negro. */}
        <Slide key={i} s={s} />

        {/* Toques: el tercio izquierdo vuelve, el resto avanza. Mantener
            apretado pausa, como en la app. */}
        <button type="button" aria-label="Anterior" onClick={anterior} {...mantener} className="absolute left-0 top-0 z-10 h-full w-1/3 cursor-w-resize" />
        <button type="button" aria-label="Siguiente" onClick={siguiente} {...mantener} className="absolute right-0 top-0 z-10 h-full w-2/3 cursor-e-resize" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20" style={{ background: 'linear-gradient(rgba(0,0,0,.45), transparent)' }}>
          <BarraEstado hora={hora} />
          <div className="flex" style={{ gap: 3, padding: '2px 8px 0' }}>
            {slides.map((_, j) => (
              <span key={j} className="relative flex-1 overflow-hidden rounded-full bg-white/35" style={{ height: 2.5 }}>
                {j < i && <span className="absolute inset-0 bg-white" />}
                {j === i && (
                  <span
                    key={`${destacada.id}-${i}`}
                    className="absolute inset-0 origin-left bg-white"
                    onAnimationEnd={siguiente}
                    style={{ animation: `ig-progreso ${DURACION}ms linear forwards`, animationPlayState: pausa ? 'paused' : 'running' }}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center" style={{ gap: 9, padding: '10px 12px' }}>
            <img src="/marca/isotipo-blanco.svg" alt="" className="rounded-full" style={{ width: 32, height: 32, padding: 7, background: 'linear-gradient(90deg,#9cd9ff,#3e87fa)' }} />
            <span className="flex items-center" style={{ fontSize: 14, fontWeight: 600, gap: 4 }}>
              {USUARIO}
              <IcoVerificado tam={13} />
            </span>
            <span className="text-white/60" style={{ fontSize: 14 }}>{destacada.nombre}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onCerrar}
          className="absolute z-30 flex items-center justify-center"
          style={{ right: 10, top: 66, width: 36, height: 36 }}
        >
          <IconoMarca nombre="cerrar" color="#fff" style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </motion.div>
  )
}

/* --------------------------------------------------------------- perfil */

export default function PerfilInstagram() {
  const { items } = usePortfolio()
  const hora = useHora()
  const marco = useRef(null)
  const [tam, setTam] = useState({ ancho: 0, alto: 0 })
  const [siguiendo, setSiguiendo] = useState(false)
  const [pestana, setPestana] = useState('grilla')
  const [abierta, setAbierta] = useState(null)

  /* La tarjeta cambia de ancho con la pantalla: todo se recalcula desde ahí. */
  useLayoutEffect(() => {
    const el = marco.current
    if (!el) return
    const medir = () => setTam({ ancho: el.offsetWidth, alto: el.offsetHeight })
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const proyectos = items.filter((p) => p.image && !p.blurred)
  const destacadas = armarDestacadas(proyectos)
  const destacada = abierta === HISTORIA.id ? HISTORIA : destacadas.find((d) => d.id === abierta)

  const escala = tam.ancho / TARJETA.ancho
  const k = (tam.ancho * (BASE / TARJETA.ancho)) / BASE
  const W = BASE * k
  const arriba = TELEFONO.arriba * escala
  const zoom = (W - 2 * (MARCO + BISEL) * k) / ANCHO_IOS
  const visible = tam.alto - arriba - (MARCO + BISEL) * k
  const altoIos = zoom ? visible / zoom : 0

  return (
    <div
      ref={marco}
      className="relative w-full overflow-hidden rounded-[22px]"
      style={{ aspectRatio: `${TARJETA.ancho} / ${TARJETA.alto}` }}
    >
      {/* El degradé de la marca, de celeste a índigo, con una luz arriba. */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(150deg,#9cd9ff 0%,#63c9ff 22%,#4da2fc 46%,#3e87fa 64%,#2a5fd6 82%,#223498 100%)' }} />
      <div aria-hidden className="absolute rounded-full bg-[#d6f0ff] opacity-55 blur-[90px]" style={{ left: '-20%', top: '-19%', width: '88%', height: '59%' }} />

      {tam.ancho > 0 && (
        <div
          className="absolute"
          style={{
            left: TELEFONO.izquierda * escala,
            top: arriba,
            width: W,
            height: tam.alto - arriba + 200 * k,
          }}
        >
          {/* Botones laterales */}
          {[
            [-5, 192, 42],
            [-5, 267, 80],
            [-5, 362, 80],
            [BASE, 282, 120],
          ].map(([x, y, h], n) => (
            <i
              key={n}
              aria-hidden
              className="absolute rounded-[3px]"
              style={{ left: x * k, top: y * k, width: 5 * k, height: h * k, background: 'linear-gradient(90deg,#9fa3ad,#e6e8ec)' }}
            />
          ))}

          <div
            className="h-full w-full"
            style={{
              borderRadius: 92 * k,
              padding: MARCO * k,
              background: 'linear-gradient(135deg,#f4f5f8 0%,#c9ccd4 18%,#eef0f4 40%,#b4b8c2 70%,#e3e5ea 100%)',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,.6), 0 50px 90px -30px rgba(10,25,90,.65), 0 10px 30px -10px rgba(10,25,90,.35)',
            }}
          >
            <div className="h-full w-full bg-black" style={{ borderRadius: 82 * k, padding: BISEL * k }}>
              <div className="relative h-full w-full overflow-hidden bg-black" style={{ borderRadius: 70 * k }}>
                <div
                  className="ig sin-barra overflow-y-auto overflow-x-hidden bg-black text-[#f5f5f5]"
                  style={{ zoom, width: ANCHO_IOS, height: altoIos }}
                >
                  {/* Arriba fija, como en la app */}
                  <div className="sticky top-0 z-10 bg-black">
                    <BarraEstado hora={hora} />
                    <div className="flex items-center" style={{ height: 46, padding: '0 12px 0 10px', gap: 10 }}>
                      <IcoAtras />
                      <b className="flex items-center" style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.015em', gap: 5 }}>
                        {USUARIO}
                        <IcoVerificado tam={17} />
                      </b>
                      <span className="ml-auto flex items-center" style={{ gap: 18 }}>
                        <IcoCampana />
                        <IcoMas />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center" style={{ gap: 22, padding: '8px 16px 0' }}>
                    {/* La foto con el aro de historia: al tocarla se abre,
                        como en la app. */}
                    <button
                      type="button"
                      onClick={() => setAbierta(HISTORIA.id)}
                      aria-label={`Ver la historia de ${USUARIO}`}
                      className="shrink-0 rounded-full transition-transform active:scale-95"
                      style={{ width: 92, height: 92, padding: 3, background: ARO_HISTORIA }}
                    >
                      <span className="block h-full w-full rounded-full bg-black" style={{ padding: 3 }}>
                        <img
                          src="/marca/isotipo-blanco.svg"
                          alt=""
                          className="h-full w-full rounded-full"
                          style={{ padding: 19, background: 'linear-gradient(90deg,#9cd9ff 0%,#63c9ff 36%,#4da2fc 74%,#3e87fa 100%)' }}
                        />
                      </span>
                    </button>
                    <div>
                      <p className="flex items-center" style={{ fontSize: 15, fontWeight: 600, marginBottom: 9, gap: 4 }}>
                        LTWEB
                        <IcoVerificado tam={14} />
                      </p>
                      <div className="flex" style={{ gap: 22, fontSize: 14, letterSpacing: '-0.01em' }}>
                        <div><b className="block" style={{ fontSize: 16.5, fontWeight: 600 }}>{proyectos.length}</b>publicaciones</div>
                        <div><b className="block" style={{ fontSize: 16.5, fontWeight: 600 }}>{fmt(SEGUIDORES + (siguiendo ? 1 : 0))}</b>seguidores</div>
                        <div><b className="block" style={{ fontSize: 16.5, fontWeight: 600 }}>{SEGUIDOS}</b>seguidos</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px 0', fontSize: 14, lineHeight: '18.5px' }}>
                    <p className="text-[#a8a8a8]">Diseñador web</p>
                    <p>Diseño claro. Desarrollo sólido.</p>
                    <p>Webs, tiendas online y sistemas a medida.</p>
                    <p>Buenos Aires · Clientes de todo el mundo</p>
                    <p className="flex items-center text-[#e0f1ff]" style={{ gap: 5, marginTop: 2, fontWeight: 600 }}>
                      <IcoCadena />
                      ltweb.com.ar
                    </p>
                  </div>

                  <div className="flex" style={{ gap: 6, padding: '14px 16px 0' }}>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setSiguiendo(true)}
                      className="flex flex-1 items-center justify-center transition-colors"
                      style={{ height: 33, borderRadius: 9, fontSize: 14.5, fontWeight: 600, gap: 4, background: siguiendo ? '#363636' : '#0095f6', color: '#fff' }}
                    >
                      {siguiendo ? (
                        <>
                          Siguiendo <IcoFlechita />
                        </>
                      ) : (
                        'Seguir'
                      )}
                    </a>
                    <a
                      href={MENSAJE_IG}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center bg-[#363636] transition-colors hover:bg-[#404040]"
                      style={{ height: 33, borderRadius: 9, fontSize: 14.5, fontWeight: 600 }}
                    >
                      Mensaje
                    </a>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Abrir el perfil en Instagram"
                      className="flex shrink-0 items-center justify-center bg-[#363636]"
                      style={{ width: 33, height: 33, borderRadius: 9 }}
                    >
                      <IcoAgregar />
                    </a>
                  </div>

                  {/* Destacadas: se abren como historias */}
                  <div className="sin-barra flex overflow-x-auto" style={{ gap: 14, padding: '20px 16px 0' }}>
                    {destacadas.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setAbierta(d.id)}
                        aria-label={`Ver la destacada ${d.nombre}`}
                        className="shrink-0 text-center transition-transform active:scale-95"
                        style={{ width: 66 }}
                      >
                        <span className="block rounded-full" style={{ width: 66, height: 66, padding: 3, border: '1px solid #3a3a3a' }}>
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-[#f3f5ff]">
                            <IconoMarca nombre={d.icono} style={{ width: 28, height: 28 }} />
                          </span>
                        </span>
                        <span className="block" style={{ marginTop: 6, fontSize: 12 }}>{d.nombre}</span>
                      </button>
                    ))}
                  </div>

                  {/* Pestañas */}
                  <div className="flex" style={{ marginTop: 22, height: 46 }}>
                    {[
                      ['grilla', IcoGrilla, 'Publicaciones'],
                      ['reels', IcoReels, 'Reels'],
                      ['etiquetas', IcoEtiquetas, 'Etiquetadas'],
                    ].map(([id, Ico, nombre]) => (
                      <button
                        key={id}
                        type="button"
                        aria-label={nombre}
                        onClick={() => setPestana(id)}
                        className="flex flex-1 items-center justify-center transition-colors"
                        style={{ color: pestana === id ? '#f5f5f5' : '#a8a8a8', borderBottom: pestana === id ? '1.5px solid #f5f5f5' : '1px solid #262626' }}
                      >
                        <Ico />
                      </button>
                    ))}
                  </div>

                  {pestana === 'grilla' && (
                    <div className="grid grid-cols-3" style={{ gap: 2 }}>
                      {proyectos.map((p, n) => (
                        <Link key={p.id} to={`/proyecto/${p.id}`} className="group relative block overflow-hidden bg-[#111]" style={{ aspectRatio: '3 / 4' }}>
                          <img src={chica(p.image)} alt={nombreProyecto(p)} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                          {n < 2 && (
                            <span className="absolute" style={{ right: 7, top: 7 }}>
                              <IcoFijado />
                            </span>
                          )}
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ padding: 8, fontSize: 12, fontWeight: 600 }}>
                            {nombreProyecto(p)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {pestana === 'reels' && (
                    <div className="grid grid-cols-3" style={{ gap: 2 }}>
                      {TESTIMONIOS.map((t) => (
                        <Link key={t.id} to={`/resenas/${t.id}`} className="relative block overflow-hidden bg-[#111]" style={{ aspectRatio: '9 / 16' }}>
                          <img src={t.poster} alt={`Reseña de ${t.nombre}`} loading="lazy" className="h-full w-full object-cover" />
                          <span className="absolute" style={{ left: 6, bottom: 6 }}>
                            <IcoPlay />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {pestana === 'etiquetas' && (
                    <div className="flex flex-col items-center text-center" style={{ padding: '48px 40px' }}>
                      <span className="flex items-center justify-center rounded-full" style={{ width: 62, height: 62, border: '2px solid #f5f5f5' }}>
                        <IcoEtiquetas />
                      </span>
                      <p style={{ marginTop: 14, fontSize: 20, fontWeight: 700 }}>Fotos y videos</p>
                      <p className="text-[#a8a8a8]" style={{ marginTop: 6, fontSize: 14 }}>Cuando etiqueten a LTWEB, las publicaciones van a aparecer acá.</p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {destacada && (
                    <Historia key={destacada.id} destacada={destacada} onCerrar={() => setAbierta(null)} hora={hora} zoom={zoom} alto={altoIos} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
