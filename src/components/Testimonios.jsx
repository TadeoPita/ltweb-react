import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, VolumeX } from 'lucide-react'
import { TESTIMONIOS } from '../data/testimonios'
import { EASE } from '../lib/motion'

const DISPOSICION = {
  escritorio: {
    x: [0, 0.82, 1.5, 2, 2.3],
    y: [0, 0.15, 0.4, 0.66, 0.8],
    giro: [0, 7, 13, 17, 19],
    escala: [1, 0.86, 0.74, 0.64, 0.6],
    visible: [1, 1, 0.55, 0, 0],
    sombra: [0, 0.32, 0.5, 0.6, 0.6],
  },
  movil: {
    x: [0, 0.62, 1.05, 1.3, 1.4],
    y: [0, 0.12, 0.3, 0.5, 0.6],
    giro: [0, 6, 11, 14, 15],
    escala: [1, 0.84, 0.7, 0.6, 0.55],
    visible: [1, 1, 0, 0, 0],
    sombra: [0, 0.38, 0.5, 0.6, 0.6],
  },
}

/* Los videos son verticales (9:16) con los subtítulos quemados abajo. Con una
   tarjeta más baja el recorte se comía justo esa franja. */
const PROPORCION = 16 / 9
const RESORTE = { type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }

const ES_IOS =
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

function tramo(v, valores) {
  const ultimo = valores.length - 1
  const a = Math.min(Math.abs(v), ultimo)
  const k = Math.min(Math.floor(a), ultimo - 1)
  return valores[k] + (valores[k + 1] - valores[k]) * (a - k)
}

function envolver(v, n) {
  return ((((v + n / 2) % n) + n) % n) - n / 2
}

function modulo(v, n) {
  return ((v % n) + n) % n
}

function medir() {
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth
  const movil = vw < 640
  const ancho = movil
    ? Math.round(Math.min(280, vw * 0.72))
    : Math.round(Math.min(340, Math.max(240, vw * 0.24)))
  return { ancho, movil }
}

function Segmentos({ n, activo, progreso }) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex gap-1">
      {Array.from({ length: n }, (_, k) => (
        <span key={k} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
          {k < activo && <span className="absolute inset-0 bg-white/90" />}
          {k === activo && (
            <motion.span style={{ scaleX: progreso }} className="absolute inset-0 origin-left bg-white" />
          )}
        </span>
      ))}
    </div>
  )
}

function Indicador({ sonando, barrasRef }) {
  return (
    <div className="pointer-events-none absolute right-3 top-6 z-10 flex h-7 min-w-7 items-center justify-center gap-[3px] rounded-full bg-black/35 px-2 backdrop-blur-md">
      {sonando ? (
        [0, 1, 2, 3].map((k) => (
          <span
            key={k}
            ref={(el) => {
              barrasRef.current[k] = el
            }}
            className="block h-3.5 w-[3px] origin-bottom rounded-full bg-white"
            style={{ transform: 'scaleY(0.25)' }}
          />
        ))
      ) : (
        <VolumeX className="h-3.5 w-3.5 text-white/85" strokeWidth={2.2} />
      )}
    </div>
  )
}

function BotonCentral({ sonando, pausado, reducir }) {
  const reproduciendo = sonando && !pausado
  return (
    <span
      className={
        'pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-300 ' +
        (reproduciendo ? 'opacity-0 group-hover:opacity-100' : 'opacity-100')
      }
    >
      <span className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] ring-[7px] ring-white/25 transition-transform duration-300 group-hover:scale-105">
        {!sonando && !reducir && (
          <motion.span
            className="absolute -inset-[7px] rounded-full border-2 border-white/50"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        {reproduciendo ? (
          <Pause className="h-6 w-6 fill-ink text-ink" />
        ) : (
          <Play className="ml-1 h-6 w-6 fill-ink text-ink" />
        )}
      </span>
      {!sonando && (
        <span className="mt-4 rounded-full bg-black/40 px-3 py-1 font-alt text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Escuchar
        </span>
      )}
    </span>
  )
}

function BotonLateral() {
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/55 ring-1 ring-white/40 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
      <Play className="ml-0.5 h-5 w-5 fill-ink/75 text-ink/75" />
    </span>
  )
}

function Tarjeta({
  t,
  i,
  n,
  pos,
  medidaMV,
  medida,
  activo,
  sonando,
  pausado,
  reducir,
  progreso,
  videoRef,
  previaRef,
  barrasRef,
  alTocar,
  alTerminar,
  cerca,
}) {
  const disposicion = (m) => DISPOSICION[m.movil ? 'movil' : 'escritorio']
  const x = useTransform([pos, medidaMV], ([p, m]) => {
    const o = envolver(i - p, n)
    return Math.sign(o) * tramo(o, disposicion(m).x) * m.ancho
  })
  const y = useTransform([pos, medidaMV], ([p, m]) => tramo(envolver(i - p, n), disposicion(m).y) * m.ancho)
  const rotate = useTransform([pos, medidaMV], ([p, m]) => {
    const o = envolver(i - p, n)
    return Math.sign(o) * tramo(o, disposicion(m).giro)
  })
  const scale = useTransform([pos, medidaMV], ([p, m]) => tramo(envolver(i - p, n), disposicion(m).escala))
  const opacity = useTransform([pos, medidaMV], ([p, m]) => tramo(envolver(i - p, n), disposicion(m).visible))
  const sombra = useTransform([pos, medidaMV], ([p, m]) => tramo(envolver(i - p, n), disposicion(m).sombra))
  const zIndex = useTransform(pos, (p) => 100 - Math.round(Math.abs(envolver(i - p, n)) * 10))

  const esActivo = i === activo
  const distancia = Math.abs(envolver(i - activo, n))
  const visible = medida.movil ? distancia <= 1 : distancia <= 2

  const etiqueta = esActivo
    ? sonando
      ? `${pausado ? 'Reanudar' : 'Pausar'} el testimonio de ${t.nombre}`
      : `Escuchar el testimonio de ${t.nombre}`
    : `Escuchar el testimonio de ${t.nombre}`

  return (
    <motion.button
      type="button"
      onClick={() => alTocar(i)}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label={etiqueta}
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex,
        width: medida.ancho,
        height: medida.ancho * PROPORCION,
        marginLeft: -medida.ancho / 2,
      }}
      className="group absolute left-1/2 top-0 cursor-pointer overflow-hidden rounded-[20px] bg-ink text-left shadow-[0_32px_60px_-26px_rgba(18,18,30,0.6)] outline-none ring-1 ring-black/5 focus-visible:ring-[3px] focus-visible:ring-lilac"
    >
      <img
        src={t.poster}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {esActivo && (
        <video
          ref={videoRef}
          src={t.video}
          poster={t.poster}
          muted
          playsInline
          /* Recién se baja cuando la sección está a la vista: son varios MB y
             la mayoría de las visitas no llega hasta acá. Antes de eso se ve
             el poster. */
          preload={cerca ? 'auto' : 'none'}
          onEnded={alTerminar}
          onTimeUpdate={(e) => {
            /* Sin sonido se repite solo el tramo de vista previa. timeupdate
               llega cada ~250 ms, por eso el corte va un poco antes del final
               real del tramo. */
            const previa = t.vistaPrevia
            if (!sonando && previa && e.currentTarget.currentTime >= previa[1]) e.currentTarget.currentTime = previa[0]
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {esActivo && t.previa && (
        /* Vista previa aparte: un clip corto y mudo que se repite mientras
           nadie toca la tarjeta. Al tocarla se oculta y suena el video real
           desde el principio, que no se modifica. */
        <video
          ref={previaRef}
          src={t.previa}
          muted
          loop
          playsInline
          preload={cerca ? 'auto' : 'none'}
          aria-hidden
          className={
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ' +
            (sonando ? 'opacity-0' : 'opacity-100')
          }
        />
      )}

      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-40">
        <motion.div style={{ opacity: sombra }} className="absolute inset-0 bg-[#0b0b12]" />
      </div>
      <div
        className={
          'pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 ' +
          (esActivo && sonando && !pausado ? 'opacity-0' : 'opacity-100')
        }
      />

      {esActivo && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/15 to-transparent" />
      )}
      {esActivo && <Segmentos n={n} activo={activo} progreso={progreso} />}
      {esActivo && <Indicador sonando={sonando} barrasRef={barrasRef} />}

      {esActivo ? <BotonCentral sonando={sonando} pausado={pausado} reducir={reducir} /> : <BotonLateral />}

      {/* Mientras suena se apaga: los subtítulos del video viven en esa franja. */}
      <div
        className={
          'pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-5 text-center transition-opacity duration-500 ' +
          (esActivo && sonando && !pausado ? 'opacity-0' : 'opacity-100')
        }
      >
        <p className="font-alt text-[15px] font-semibold leading-tight text-white">{t.nombre}</p>
        <p className="mt-1 font-alt text-[11.5px] text-white/60">{t.detalle}</p>
      </div>
    </motion.button>
  )
}

function BotonFlecha({ direccion, alTocar, className = '' }) {
  const Icono = direccion === 'anterior' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={alTocar}
      aria-label={direccion === 'anterior' ? 'Testimonio anterior' : 'Testimonio siguiente'}
      className={
        'flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/60 text-ink/70 backdrop-blur-md transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac ' +
        className
      }
    >
      <Icono className="h-5 w-5" strokeWidth={1.8} />
    </button>
  )
}

export default function Testimonios() {
  if (!TESTIMONIOS.length) return null
  return <Carrusel lista={TESTIMONIOS} />
}

function Carrusel({ lista }) {
  const n = lista.length
  const varios = n > 1

  const seccionRef = useRef(null)
  const enVista = useInView(seccionRef, { amount: 0.35 })
  /* Una vez que la sección se acercó, el video queda habilitado para bajar
     aunque después se scrollee para otro lado. */
  const cerca = useInView(seccionRef, { once: true, margin: '400px 0px' })
  const reducir = useReducedMotion()

  const [medida, setMedida] = useState(medir)
  const medidaMV = useMotionValue(medida)
  const pos = useMotionValue(0)
  const progreso = useMotionValue(0)

  const [activo, setActivo] = useState(0)
  const [sonando, setSonando] = useState(false)
  const [pausado, setPausado] = useState(false)

  const videoRef = useRef(null)
  const previaRef = useRef(null)
  const barrasRef = useRef([])
  const halo = useRef(null)
  const control = useRef(null)
  const bloqueado = useRef(false)
  const inicioPan = useRef(0)
  const inicioCadena = useRef(0)
  const audio = useRef({ ctx: null, analizador: null, anterior: null, fuentes: new WeakMap() })
  const vivo = useRef(false)
  vivo.current = sonando && !pausado

  useEffect(() => {
    const alCambiar = () => {
      const m = medir()
      setMedida(m)
      medidaMV.set(m)
    }
    window.addEventListener('resize', alCambiar)
    return () => window.removeEventListener('resize', alCambiar)
  }, [medidaMV])

  const animarA = useCallback(
    (destino) => {
      control.current?.stop()
      control.current = animate(pos, destino, reducir ? { duration: 0 } : RESORTE)
      setActivo(modulo(destino, n))
      progreso.set(0)
      setPausado(false)
    },
    [pos, progreso, reducir, n],
  )

  const mover = (delta) => animarA(Math.round(pos.get()) + delta)

  const irA = (k) => {
    const actual = Math.round(pos.get())
    let destino = actual - modulo(actual, n) + k
    if (destino - actual > n / 2) destino -= n
    if (actual - destino > n / 2) destino += n
    animarA(destino)
  }

  const prepararAudio = () => {
    if (ES_IOS) return
    const a = audio.current
    if (a.ctx) {
      if (a.ctx.state === 'suspended') a.ctx.resume()
      return
    }
    const Contexto = window.AudioContext || window.webkitAudioContext
    if (!Contexto) return
    try {
      const ctx = new Contexto()
      const analizador = ctx.createAnalyser()
      analizador.fftSize = 64
      analizador.smoothingTimeConstant = 0.72
      analizador.connect(ctx.destination)
      a.ctx = ctx
      a.analizador = analizador
    } catch {
      a.ctx = null
    }
  }

  const conectar = (video) => {
    const a = audio.current
    if (!a.ctx || !video || a.fuentes.has(video)) return
    try {
      const fuente = a.ctx.createMediaElementSource(video)
      fuente.connect(a.analizador)
      if (a.anterior) a.anterior.disconnect()
      a.anterior = fuente
      a.fuentes.set(video, fuente)
    } catch {
      a.fuentes.set(video, null)
    }
  }

  const escuchar = (i) => {
    prepararAudio()
    inicioCadena.current = i
    setPausado(false)
    if (i === activo) {
      progreso.set(0)
      /* Es el mismo video que ya se ve en la vista previa: se rebobina y se
         le saca el mute acá, dentro del toque, porque Safari solo deja sonar
         un video en respuesta directa a un gesto. Así arranca al instante, sin
         volver a pedir el archivo. */
      const v = videoRef.current
      if (v) {
        v.currentTime = 0
        v.loop = false
        v.muted = false
        const p = v.play()
        if (p) p.catch(() => {})
      }
      setSonando(true)
    } else {
      setSonando(true)
      irA(i)
    }
  }

  const alTocar = (i) => {
    if (bloqueado.current) return
    if (i === activo && sonando) {
      setPausado((p) => !p)
      return
    }
    escuchar(i)
  }

  const alTerminar = () => {
    if (!sonando) return
    if (!varios) {
      setSonando(false)
      progreso.set(0)
      return
    }
    if (modulo(activo + 1, n) === inicioCadena.current) setSonando(false)
    mover(1)
  }

  useEffect(() => {
    if (!enVista && sonando) setSonando(false)
  }, [enVista, sonando])

  /* Con vista previa aparte, el video real espera quieto (y ya cargado) hasta
     que tocan la tarjeta; mientras tanto se repite el clip corto. */
  const conPrevia = Boolean(lista[activo].previa)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !sonando
    v.loop = !sonando
    if (!enVista || pausado || (!sonando && (reducir || conPrevia))) {
      v.pause()
      return
    }
    if (sonando) conectar(v)
    const p = v.play()
    if (p) p.catch(() => {})
  }, [activo, sonando, pausado, enVista, reducir, conPrevia])

  useEffect(() => {
    const v = previaRef.current
    if (!v) return
    if (!enVista || sonando || reducir) {
      v.pause()
      return
    }
    const p = v.play()
    if (p) p.catch(() => {})
  }, [activo, sonando, enVista, reducir])

  useEffect(() => {
    if (!enVista) return
    let id
    let suave = 0
    const datos = new Uint8Array(32)
    const paso = (tiempo) => {
      const v = videoRef.current
      if (v && v.duration) progreso.set(v.currentTime / v.duration)

      const sonandoAhora = vivo.current && v && !v.paused
      const analizador = audio.current.analizador
      let bandas = [0, 0, 0, 0]
      if (sonandoAhora && analizador) {
        analizador.getByteFrequencyData(datos)
        bandas = [datos[1], datos[2], (datos[3] + datos[4]) / 2, (datos[5] + datos[6] + datos[7]) / 3].map(
          (b) => Math.pow(b / 255, 2.6),
        )
      } else if (sonandoAhora) {
        bandas = [0, 1, 2, 3].map((k) => 0.35 + 0.25 * Math.sin(tiempo / (130 + k * 41) + k * 1.7))
      }

      const nivel = (bandas[0] + bandas[1] + bandas[2] + bandas[3]) / 4
      suave += (nivel - suave) * 0.16

      barrasRef.current.forEach((el, k) => {
        if (el) el.style.transform = `scaleY(${Math.min(1, 0.2 + bandas[k] * 1.05)})`
      })
      if (halo.current) {
        halo.current.style.opacity = String(Math.min(0.9, suave * 1.7))
        halo.current.style.transform = `scale(${0.8 + suave * 0.6})`
      }
      id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [enVista, progreso])

  useEffect(() => {
    const a = audio.current
    return () => {
      if (a.ctx) a.ctx.close().catch(() => {})
    }
  }, [])

  const pasoDeArrastre = medida.ancho * DISPOSICION[medida.movil ? 'movil' : 'escritorio'].x[1]

  const alEmpezarArrastre = () => {
    bloqueado.current = true
    control.current?.stop()
    inicioPan.current = pos.get()
  }

  const alArrastrar = (_, info) => {
    pos.set(inicioPan.current - info.offset.x / pasoDeArrastre)
  }

  const alSoltar = (_, info) => {
    const proyectado = pos.get() - (info.velocity.x / pasoDeArrastre) * 0.1
    const limite = inicioPan.current
    animarA(Math.round(Math.max(limite - 3, Math.min(limite + 3, proyectado))))
    setTimeout(() => {
      bloqueado.current = false
    }, 80)
  }

  const alTeclear = (e) => {
    if (!varios) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      mover(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      mover(1)
    }
  }

  const actual = lista[activo]
  /* Lo que sobra debajo de la tarjeta es para las laterales, que bajan al
     alejarse. Con un solo video no hay laterales y alcanza con un respiro. */
  const alto = medida.ancho * (PROPORCION + (varios ? (medida.movil ? 0.12 : 0.34) : 0.04))

  return (
    /* isolate encierra los zIndex de las tarjetas (hasta 100) dentro de la
       sección. Sin eso competían con la barra fija y el menú del celular y
       les pasaban por encima. */
    <section
      ref={seccionRef}
      id="testimonios"
      className="relative isolate overflow-hidden bg-[#eceeed] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_60%,#ffffff_0%,rgba(255,255,255,0.55)_38%,rgba(255,255,255,0)_72%)]"
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.9] text-ink sm:text-6xl">
              Lo cuentan ellos
            </h2>
          </div>
          <p className="max-w-sm font-body text-[15px] leading-relaxed text-ink/55">
            {varios
              ? 'Clientes reales contando cómo fue trabajar con nosotros. Tocá uno para escucharlo con sonido.'
              : 'Clientes reales contando cómo fue trabajar con nosotros. Tocá el video para escucharlo con sonido.'}
          </p>
        </div>
      </div>

      <div className="relative mt-14 sm:mt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{ top: -medida.ancho * 0.1 }}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={actual.id}
              initial={{ opacity: 0, y: 26, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -26, filter: 'blur(14px)' }}
              transition={{ duration: reducir ? 0 : 0.7, ease: EASE }}
              className="absolute whitespace-nowrap font-serif italic leading-none tracking-tight text-ink/[0.085]"
              style={{ fontSize: medida.movil ? '5.25rem' : 'clamp(6.5rem, 15.5vw, 13.5rem)' }}
            >
              “{actual.frase ?? actual.nombre}”
            </motion.span>
          </AnimatePresence>
        </div>

        <div
          ref={halo}
          aria-hidden
          className="pointer-events-none absolute left-1/2 rounded-full blur-3xl"
          style={{
            width: medida.ancho * 2,
            height: medida.ancho * 2,
            top: medida.ancho * (PROPORCION / 2 - 1),
            marginLeft: -medida.ancho,
            background: 'radial-gradient(circle, rgba(167,150,240,0.95) 0%, rgba(167,150,240,0.45) 38%, rgba(167,150,240,0) 66%)',
            opacity: 0,
            transform: 'scale(0.85)',
          }}
        />

        <motion.div
          role="group"
          aria-roledescription="carrusel"
          aria-label="Testimonios en video. Usá las flechas del teclado para recorrerlos."
          tabIndex={0}
          onKeyDown={alTeclear}
          onPanStart={varios ? alEmpezarArrastre : undefined}
          onPan={varios ? alArrastrar : undefined}
          onPanEnd={varios ? alSoltar : undefined}
          className="relative mx-auto select-none outline-none [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-lilac/50"
          style={{ height: alto }}
        >
          {lista.map((t, i) => (
            <Tarjeta
              key={t.id}
              t={t}
              i={i}
              n={n}
              pos={pos}
              medidaMV={medidaMV}
              medida={medida}
              activo={activo}
              sonando={sonando}
              pausado={pausado}
              reducir={reducir}
              progreso={progreso}
              videoRef={videoRef}
              previaRef={previaRef}
              barrasRef={barrasRef}
              alTocar={alTocar}
              alTerminar={alTerminar}
              cerca={cerca}
            />
          ))}
        </motion.div>
      </div>

      {varios && (
        <div className="relative mt-8 flex items-center justify-center gap-6">
          <BotonFlecha direccion="anterior" alTocar={() => mover(-1)} />
          <p className="font-display text-sm tabular-nums tracking-[0.22em] text-ink/45">
            {String(activo + 1).padStart(2, '0')}
            <span className="mx-2 text-ink/20">/</span>
            {String(n).padStart(2, '0')}
          </p>
          <BotonFlecha direccion="siguiente" alTocar={() => mover(1)} />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {`Testimonio ${activo + 1} de ${n}: ${actual.nombre}`}
      </p>
    </section>
  )
}
