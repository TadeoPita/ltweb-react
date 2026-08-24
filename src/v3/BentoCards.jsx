import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, SlidersHorizontal, Zap } from 'lucide-react'
import { WHATSAPP_URL, INSTAGRAM_URL } from '../data/content'

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

/* Marca. Usa el cohete del logo, el mismo que está en el favicon. */
export function CardMarca() {
  return (
    <div className={`${BASE} group bg-[#1c1c20] p-6 flex flex-col justify-between`}>
      <img src="/images/logo-blanco.webp" alt="LT WEB" className="h-7 w-auto self-start" />
      <div>
        <p className="font-display font-bold uppercase text-white/95 leading-[0.95] text-2xl">
          Estudio de
          <br />
          diseño y código
        </p>
        <p className="mt-2 font-body text-[13px] text-white/45">Buenos Aires, Argentina</p>
      </div>
      <img
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
  return (
    <Link to={`/proyecto/${id}`} className={`${BASE} group block bg-black`}>
      <img
        src={imagen}
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
  return (
    <Link
      to="/portfolio"
      className={`${BASE} group block p-6 flex flex-col justify-center`}
      style={{ backgroundColor: 'var(--color-pastel-blue)' }}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display font-bold text-ink/90 leading-none text-6xl transition-transform duration-500 ease-out group-hover:-translate-y-1">
          {cantidad}
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
    </Link>
  )
}

/* Las tres áreas de trabajo, en lista. */
export function CardAreas({ areas }) {
  return (
    <div className={`${BASE} border border-black/[0.07] bg-white p-6 flex flex-col`}>
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Qué hacemos
      </p>
      <ul className="mt-5 flex flex-col gap-px overflow-hidden rounded-xl bg-black/[0.07]">
        {areas.map((a, i) => (
          <li key={a} className="group/fila flex items-baseline gap-3 bg-white px-1 py-3">
            <span className="font-body text-[11px] font-semibold tracking-[0.16em] text-ink/25">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display font-bold uppercase text-ink/85 text-[15px] leading-tight transition-transform duration-300 ease-out group-hover/fila:translate-x-1">
              {a}
            </span>
          </li>
        ))}
      </ul>
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
      <ul className="mt-4 flex flex-wrap gap-2">
        {rubros.map((r) => (
          <li
            key={r}
            className="cursor-default rounded-full border border-black/[0.09] px-3 py-1 font-body text-[13px] text-ink/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25 hover:text-ink/90"
          >
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Autoadministrable: el panel es parte del producto, no un extra. */
export function CardPanel() {
  return (
    <div className={`${BASE} group border border-black/[0.07] bg-white p-6 flex flex-col justify-between`}>
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl text-ink/80 transition-transform duration-500 ease-out group-hover:-rotate-6"
        style={{ backgroundColor: 'var(--color-pastel-green)' }}
      >
        <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div>
        <p className="font-display font-bold uppercase text-ink/90 text-[15px] leading-tight">
          Lo editás vos
        </p>
        <p className="mt-2 font-body text-[13.5px] leading-relaxed text-ink/55">
          Textos, fotos y publicaciones desde un panel, sin depender de nosotros ni pagar por cada
          cambio.
        </p>
      </div>
    </div>
  )
}

/* Trato directo: el diferencial que más repiten los clientes. */
export function CardDirecto() {
  return (
    <div className={`${BASE} group p-6 flex flex-col justify-between`} style={{ backgroundColor: 'var(--color-pastel-orange)' }}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-ink/80 transition-transform duration-500 ease-out group-hover:-rotate-6">
        <Zap className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div>
        <p className="font-display font-bold uppercase text-ink/90 text-[15px] leading-tight">
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
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} group border border-black/[0.07] bg-white p-6 flex flex-col justify-between`}
    >
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        En Instagram
      </p>
      <div>
        <p className="font-display font-bold uppercase text-ink/90 text-2xl leading-none transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          @ltweb__
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 font-body text-[13px] text-ink/55">
          Procesos y detrás de escena
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}

/* Cierre: la acción. */
export function CardContacto() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className={`${BASE} group bg-lilac p-6 flex flex-col justify-between`}
    >
      <MessageCircle
        className="h-6 w-6 text-ink/60 transition-transform duration-500 ease-out group-hover:-rotate-6"
        strokeWidth={1.8}
      />
      <div>
        <p className="font-display font-bold uppercase text-ink/90 leading-[0.95] text-2xl">
          Contanos
          <br />
          tu proyecto
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-body text-[13.5px] font-semibold text-ink/65">
          Escribinos por WhatsApp
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  )
}
