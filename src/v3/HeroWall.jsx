import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'
import { usePortfolio } from '../data/portfolioStore'

/* Hero.

   Antes se leía como una sección más y no como el arranque del sitio. Ahora
   ocupa la pantalla entera y el fondo es el trabajo: tres filas de proyectos
   cruzando en horizontal, en sentidos alternados y a velocidades distintas,
   por debajo de una capa negra. Se ve movimiento y se ve obra desde el primer
   segundo, sin que nada le compita al título, que va centrado encima.

   Las filas van al 45% de opacidad y con un velo negro por arriba. Sin eso el
   texto queda ilegible sobre las capturas, que son claras casi todas.

   La capa oscura lleva pointer-events-none a propósito: así el cursor
   atraviesa el velo y las tarjetas siguen respondiendo al hover, que es lo
   que hace que el fondo se sienta vivo en vez de un video pegado atrás. Cada
   tarjeta se levanta unos píxeles y sube su brillo al pasarle por encima.

   El desplazamiento es CSS: cada fila se duplica y se mueve la mitad de su
   ancho, así el reinicio cae donde arranca la copia y el bucle no salta. Se
   frena entero al pasar el cursor por el hero, para poder mirar una captura
   sin perseguirla. */

/* El levantarse al pasar el cursor va en CSS propio (.muro-tarjeta) y no con
   las utilidades hover:-translate-y de Tailwind: en la v4 esas escriben la
   propiedad `translate`, que acá no llegaba a aplicarse. Con `transform` en
   una regla nuestra el comportamiento es el mismo y no depende de eso. */
/* El muro dibuja recuadros de 268x168 pero las portadas del portfolio son de
   1536 de ancho para arriba, y una llegaba a 1600x2844. El navegador igual las
   descomprime enteras: una imagen asi ocupa cerca de 18 MB en memoria ya
   decodificada, y habia veintipico en pantalla al mismo tiempo. Eso era el
   tiron al entrar — no la animacion, que va por transform y no cuesta nada.

   Para las portadas que viven en el repo hay una copia de 672 de ancho en
   /images/muro, que es el doble de lo que se dibuja (suficiente para pantallas
   densas). Las que vienen de la base se dejan como estan: no se pueden
   redimensionar de este lado, y por eso el muro las usa ultimas. */
function miniatura(url) {
  if (!url) return url
  return url.startsWith('/images/pf-') ? url.replace('/images/', '/images/muro/') : url
}

function Tarjeta({ p }) {
  return (
    <div className="muro-tarjeta relative h-[168px] w-[268px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:h-[210px] sm:w-[336px]">
      <img
        draggable={false}
        src={miniatura(p.image)}
        alt=""
        aria-hidden
        loading="lazy"
        /* async saca el decodificado del hilo principal: sin esto el navegador
           frena todo mientras descomprime cada imagen. */
        decoding="async"
        width="336"
        height="210"
        className="h-full w-full object-cover object-top"
      />
    </div>
  )
}

function Fila({ proyectos, invertida, duracion }) {
  if (!proyectos.length) return null
  return (
    <div
      className="muro-fila flex w-max gap-4"
      style={{ animationDuration: `${duracion}s`, animationDirection: invertida ? 'reverse' : 'normal' }}
    >
      {[0, 1].map((copia) => (
        <div key={copia} className="flex shrink-0 gap-4" aria-hidden={copia === 1 || undefined}>
          {proyectos.map((p) => (
            <Tarjeta key={copia + p.id} p={p} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function HeroWall() {
  const { items } = usePortfolio()

  /* Tres filas de cuatro. Antes entraban todos los proyectos con imagen: 27,
     y como cada fila se duplica para que el bucle no salte, eran 54 imagenes
     dibujadas a la vez detras del titulo. El fondo se ve igual con doce —
     nadie las cuenta— y el navegador descomprime menos de la mitad.

     Van primero las que tienen miniatura, que son las del repo. Asi las que
     vienen de la base, que pesan mucho mas y no se pueden achicar de este
     lado, quedan afuera mientras haya locales suficientes. */
  const filas = useMemo(() => {
    const conImagen = items
      .filter((p) => p.image)
      .slice()
      .sort((a, b) => Number(b.image.startsWith('/images/pf-')) - Number(a.image.startsWith('/images/pf-')))
      .slice(0, 12)
    if (!conImagen.length) return [[], [], []]
    const porFila = Math.ceil(conImagen.length / 3)
    return [
      conImagen.slice(0, porFila),
      conImagen.slice(porFila, porFila * 2),
      conImagen.slice(porFila * 2),
    ].map((f) => (f.length ? f : conImagen.slice(0, 4)))
  }, [items])

  return (
    <section
      id="inicio-v3"
      className="muro relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080a]"
    >
      {/* El muro de proyectos */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 opacity-70">
        <Fila proyectos={filas[0]} duracion={64} />
        <Fila proyectos={filas[1]} duracion={82} invertida />
        <Fila proyectos={filas[2]} duracion={72} />
      </div>

      {/* Velo. No intercepta el cursor: las tarjetas de atrás siguen vivas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,10,0.62)_0%,rgba(8,8,10,0.86)_58%,#08080a_100%)]"
      />

      {/* Contenido, centrado */}
      <div className="pointer-events-none relative mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ce69a]" />
          <span className="font-body text-[12px] font-medium text-white/70">
            Estudio de diseño y desarrollo · Buenos Aires
          </span>
        </motion.span>

        {/* Sin blur animado. El titulo ocupa 12vw: desenfocarlo obliga al
            navegador a recalcular ese filtro sobre media pantalla en cada
            cuadro, y justo mientras entra la pagina y se estan decodificando
            las imagenes del muro. Con opacidad y desplazamiento la entrada se
            ve practicamente igual y la maneja el compositor. */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 font-display font-bold uppercase text-white leading-[0.9] text-[12vw] sm:text-[9vw] lg:text-[88px]"
        >
          La web que tu negocio
          <br />
          <span className="text-white/55">merece.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-lg font-body text-[15px] leading-relaxed text-white/55 sm:text-base"
        >
          Diseñamos y programamos webs, tiendas online y sistemas a medida. Cada proyecto se piensa
          desde cero sobre el negocio que tiene atrás.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-body text-[15px] font-semibold text-[#08080a] transition-colors hover:bg-white/90"
          >
            Contanos tu proyecto
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </a>

          <a
            href="#bento-v3"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-body text-[15px] font-semibold text-white/85 transition-colors hover:border-white/45 hover:text-white"
          >
            Ver el estudio
          </a>
        </motion.div>
      </div>

      {/* Datos al pie, como en las referencias: aterrizan la marca. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-between px-6 font-body text-[11px] tracking-[0.12em] text-white/25">
        <span>[ Buenos Aires, Argentina ]</span>
        <span>[ {items.length}+ proyectos entregados ]</span>
      </div>
    </section>
  )
}
