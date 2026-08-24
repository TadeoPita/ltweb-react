import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../data/content'

/* Tarjetas del bento de la v3.

   El ejemplo de la librería venía con métricas inventadas ("4.875 project
   views", "$12.457 de saldo"). Acá cada tarjeta muestra algo real del
   estudio: proyectos que ya están en el portfolio, las áreas de trabajo y los
   rubros con los que trabajamos. Un bento lleno de números falsos es
   exactamente lo que hace que una página se lea como una maqueta. */

/* Marca. Usa el cohete del logo, el mismo que está en el favicon. */
export function CardMarca() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-[#111113] p-6 flex flex-col justify-between">
      <img src="/images/logo-blanco.webp" alt="LT WEB" className="h-7 w-auto self-start" />
      <div>
        <p className="font-display font-bold uppercase text-white leading-[0.95] text-2xl">
          Estudio de
          <br />
          diseño y código
        </p>
        <p className="mt-2 font-body text-[13px] text-white/50">Buenos Aires, Argentina</p>
      </div>
      <img
        src="/images/sparkle.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-6 w-28 opacity-20"
      />
    </div>
  )
}

/* Proyecto con la captura de fondo. */
export function CardProyecto({ id, nombre, tipo, imagen }) {
  return (
    <Link
      to={`/proyecto/${id}`}
      className="group relative block h-full overflow-hidden rounded-2xl bg-black"
    >
      <img
        src={imagen}
        alt={nombre}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top opacity-70 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {tipo}
        </p>
        <p className="mt-1 font-display font-bold uppercase text-white text-xl leading-tight">
          {nombre}
        </p>
      </div>
      <ArrowUpRight className="absolute top-5 right-5 h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

/* Dato duro del estudio. */
export function CardDato({ valor, etiqueta, detalle, tint }) {
  return (
    <div
      className="h-full rounded-2xl p-6 flex flex-col justify-center"
      style={{ backgroundColor: tint }}
    >
      <p className="font-display font-bold text-ink leading-none text-5xl">{valor}</p>
      <p className="mt-3 font-display font-bold uppercase text-ink text-[15px] leading-tight">
        {etiqueta}
      </p>
      {detalle && <p className="mt-1 font-body text-[13px] text-ink/60">{detalle}</p>}
    </div>
  )
}

/* Las tres áreas de trabajo, en lista. */
export function CardAreas({ areas }) {
  return (
    <div className="h-full rounded-2xl border border-black/[0.07] bg-white p-6 flex flex-col">
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Qué hacemos
      </p>
      <ul className="mt-5 flex flex-col gap-px bg-black/[0.07] rounded-xl overflow-hidden">
        {areas.map((a, i) => (
          <li key={a} className="flex items-baseline gap-3 bg-white py-3 px-1">
            <span className="font-body text-[11px] font-semibold tracking-[0.16em] text-ink/25">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display font-bold uppercase text-ink text-[15px] leading-tight">
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
    <div className="h-full rounded-2xl border border-black/[0.07] bg-white p-6 flex flex-col justify-between">
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
        Dónde ya trabajamos
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {rubros.map((r) => (
          <li
            key={r}
            className="rounded-full border border-black/[0.09] px-3 py-1 font-body text-[13px] text-ink/70"
          >
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Cierre: la acción. */
export function CardContacto() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-lilac p-6"
    >
      <MessageCircle className="h-6 w-6 text-ink/70" strokeWidth={1.8} />
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
