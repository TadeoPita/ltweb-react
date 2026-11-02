import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play } from 'lucide-react'
import { usePortfolio } from '../data/portfolioStore'
import { SERVICIOS, whatsappCon } from '../data/servicios'
import { TESTIMONIOS } from '../data/testimonios'
import { useJsonLd, useSeo } from '../lib/seo'
import { esquemaServicio } from '../lib/esquemas'
import { proyectoConFicha } from '../lib/titulos'
import { BotonWhatsapp, Preguntas, TarjetasProyectos, Titulo, Volanta, alVer, aparecer } from '../components/Bloques'

export default function ServicioPage({ servicio: s }) {
  const { items } = usePortfolio()
  const whatsapp = whatsappCon(s.mensaje)
  const proyectos = s.proyectos
    .map((id) => items.find((p) => p.id === id))
    .filter((p) => p && !p.blurred && proyectoConFicha(p))
  const resena = s.resena && TESTIMONIOS.find((t) => t.id === s.resena)
  const otros = SERVICIOS.filter((o) => o.slug !== s.slug)

  useSeo({ title: s.titulo, description: s.descripcion, path: `/${s.slug}` })
  useJsonLd(esquemaServicio(s))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [s.slug])

  return (
    <main className="bg-ink-2 min-h-screen pt-36 pb-32 text-white">
      <div className="mx-auto max-w-[1140px] px-6">
        <motion.div {...aparecer(0)}>
          <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </motion.div>

        <header className="mt-10 max-w-4xl">
          <motion.div {...aparecer(0.05)}>
            <Volanta>{s.volanta}</Volanta>
          </motion.div>
          <motion.h1
            {...aparecer(0.1)}
            className="mt-3 font-display font-bold uppercase leading-[0.95] text-4xl sm:text-6xl lg:text-7xl"
          >
            {s.h1}
          </motion.h1>
          <motion.p {...aparecer(0.18)} className="mt-6 max-w-3xl font-body text-base leading-relaxed text-white/65 sm:text-lg">
            {s.intro}
          </motion.p>
          <motion.div {...aparecer(0.25)} className="mt-8 flex flex-wrap gap-3">
            <BotonWhatsapp href={whatsapp}>Consultar por WhatsApp</BotonWhatsapp>
          </motion.div>
        </header>

        <section className="mt-24">
          <Volanta>Qué incluye</Volanta>
          <Titulo>Todo lo que resolvemos</Titulo>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.incluye.map((x, i) => (
              <motion.li
                key={x.t}
                {...alVer(Math.min(i * 0.05, 0.25))}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="font-alt text-[17px] font-semibold">{x.t}</p>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-white/60">{x.d}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="mt-24">
          <Volanta>Cómo trabajamos</Volanta>
          <Titulo>Paso a paso</Titulo>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.proceso.map((p, i) => (
              <motion.li key={p.t} {...alVer(i * 0.06)} className="border-t border-white/15 pt-5">
                <p className="font-display text-sm font-bold tabular-nums text-[#7db6e8]">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-alt text-[17px] font-semibold">{p.t}</p>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-white/60">{p.d}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {(proyectos.length > 0 || resena) && (
          <section className="mt-24">
            <Volanta>Casos reales</Volanta>
            <Titulo>Proyectos de {s.nombre.toLowerCase()}</Titulo>
            {resena && (
              <Link
                to={`/resenas/${resena.id}`}
                className="group mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06] sm:max-w-xl"
              >
                <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                  <img src={resena.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </span>
                </span>
                <span>
                  <span className="block font-alt text-[15px] font-semibold">Mirá la reseña de {resena.nombre}</span>
                  <span className="mt-1 block font-body text-sm text-white/55">{resena.detalle}</span>
                </span>
              </Link>
            )}
            {proyectos.length > 0 && <TarjetasProyectos proyectos={proyectos} />}
          </section>
        )}

        <section className="mt-24">
          <Volanta>Preguntas frecuentes</Volanta>
          <Titulo>Lo que más nos preguntan</Titulo>
          <Preguntas faqs={s.faqs} />
        </section>

        <motion.section
          {...alVer(0)}
          className="mt-24 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center sm:px-12"
        >
          <h2 className="font-display text-3xl font-bold uppercase leading-[0.95] sm:text-5xl">Contanos qué necesitás</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/60">
            Hablás directo con quien diseña y desarrolla tu proyecto. Te respondemos con una propuesta de alcance y plazos.
          </p>
          <div className="mt-8 flex justify-center">
            <BotonWhatsapp href={whatsapp}>Escribinos por WhatsApp</BotonWhatsapp>
          </div>
        </motion.section>

        <nav aria-label="Otros servicios" className="mt-20">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-white/40">Otros servicios</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {otros.map((o) => (
              <li key={o.slug}>
                <Link
                  to={`/${o.slug}`}
                  className="inline-block rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-body text-sm text-white/75 transition-colors hover:border-white/30 hover:text-white"
                >
                  {o.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}
