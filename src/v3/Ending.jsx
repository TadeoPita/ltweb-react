import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import {
  WHATSAPP_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LOCATION,
} from '../data/content'
import { EASE } from '../lib/motion'

/* Cierre y pie, en un solo bloque.

   Antes eran dos cosas separadas: una sección clara de contacto y, debajo, el
   footer negro del sitio viejo. Entre una y otra quedaba un corte horizontal
   seco, y encima el pie hablaba otro idioma visual que el resto de la página.

   Acá es un único bloque oscuro. La transición desde lo claro se resuelve con
   un degradado en el borde de arriba, así no hay línea: la página se va
   apagando hasta el negro. El aurora vuelve a aparecer pero atenuado y por
   detrás, para que el cierre tenga algo de la luz del encabezado sin
   competirle al texto.

   El correo es el elemento más grande de la sección a propósito: si alguien
   llegó hasta acá, lo que tiene que encontrar es cómo escribirnos. */

const SECCIONES = [
  { label: 'Inicio', href: '#inicio-v3' },
  { label: 'El estudio', href: '#bento-v3' },
  { label: 'Proceso', href: '#proceso-v3' },
  { label: 'Preguntas', href: '#faq-v3' },
]

const REDES = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'TikTok', href: TIKTOK_URL },
  { label: 'WhatsApp', href: WHATSAPP_URL },
]

export default function Ending() {
  return (
    <section id="contacto-v3" className="relative overflow-hidden bg-[#08080a]">
      {/* Puente desde la sección clara de arriba: sin esto queda una línea. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.04] to-transparent"
      />

      {/* Aurora atenuada, por detrás del contenido. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora absolute -inset-x-40 -bottom-60 h-[560px] opacity-25 [mask-image:radial-gradient(ellipse_at_50%_100%,black_20%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pt-32 pb-14 sm:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40"
        >
          Hablemos
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          className="mt-6 max-w-4xl font-display font-bold uppercase leading-[0.88] text-white text-5xl sm:text-7xl lg:text-[88px]"
        >
          Contanos qué necesitás
        </motion.h2>

        {/* El correo, en grande: es la acción de la sección. */}
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="group mt-14 flex w-full items-center justify-between gap-6 border-y border-white/12 py-7 transition-colors duration-300 hover:border-white/35"
        >
          <span className="font-display font-bold uppercase text-white/85 text-xl sm:text-4xl leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">
            {CONTACT_EMAIL}
          </span>
          <ArrowUpRight className="h-7 w-7 shrink-0 text-white/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.a>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          className="group flex w-full items-center justify-between gap-6 border-b border-white/12 py-7 transition-colors duration-300 hover:border-white/35"
        >
          <span className="font-display font-bold uppercase text-white/85 text-xl sm:text-4xl leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">
            {CONTACT_PHONE}
          </span>
          <ArrowUpRight className="h-7 w-7 shrink-0 text-white/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.a>

        {/* Pie, dentro del mismo bloque */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <img
              draggable={false}
              src="/images/logo-blanco.webp"
              alt="LT WEB"
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-xs font-body text-[14px] leading-relaxed text-white/45">
              Estudio de diseño y desarrollo web. Webs, tiendas online y sistemas a la medida de
              cada negocio.
            </p>
            <p className="mt-5 font-body text-[13px] text-white/35">{LOCATION}</p>
          </div>

          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Secciones
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {SECCIONES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="font-body text-[14px] text-white/60 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/portfolio"
                  className="font-body text-[14px] text-white/60 transition-colors hover:text-white"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Seguinos
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {REDES.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-body text-[14px] text-white/60 transition-colors hover:text-white"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Escribinos
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 block font-body text-[14px] text-white/60 transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="font-body text-[13px] text-white/30">
            © {new Date().getFullYear()} LTWEB. Todos los derechos reservados.
          </p>
          <p className="font-body text-[13px] text-white/30">Diseño y desarrollo por LTWEB</p>
        </div>
      </div>
    </section>
  )
}
