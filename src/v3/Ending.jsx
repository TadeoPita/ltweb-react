import {
  INSTAGRAM_URL,
  TIKTOK_URL,
  WHATSAPP_URL,
  CONTACT_PHONE,
  CONTACT_EMAIL,
} from '../data/content'

/* Pie de la v3.

   Vuelve a la composición del sitio original: tres columnas —secciones, redes
   y contacto— y a la derecha la tarjeta con el llamado a la acción, después
   una línea y el copyright.

   La versión anterior de este bloque era un cierre grande con el correo y el
   teléfono como titulares a todo el ancho. Quedaba pesado justo después de
   "Seguinos en nuestras redes", que ya empuja al contacto, y encima repetía
   los mismos datos dos veces seguidas.

   Los enlaces de secciones apuntan a las anclas de esta página y no a las del
   sitio actual: acá no existen #servicios ni #proceso. */

const SECCIONES = [
  { label: 'Inicio', href: '#inicio-v3' },
  { label: 'El estudio', href: '#bento-v3' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'FAQ', href: '#faq' },
]

export default function Ending() {
  return (
    <footer id="contacto-v3" className="bg-[#08080a] pt-20 pb-16 text-white">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr_1.2fr_1.6fr]">
          {/* Secciones */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Secciones</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              {SECCIONES.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Redes Sociales</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-white/70 transition-colors duration-300 hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-white/70 transition-colors duration-300 hover:text-white"
                >
                  Tiktok
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Contacto</h3>
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                Teléfono
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 block font-alt font-semibold text-lg transition-colors hover:text-white/80"
              >
                {CONTACT_PHONE}
              </a>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
                Correo electrónico
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1.5 block font-alt font-semibold text-lg transition-colors hover:text-white/80"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Tarjeta con el llamado a la acción */}
          <div className="self-start rounded-2xl border border-white/12 p-8 text-center sm:p-10">
            <h3 className="font-alt font-semibold text-xl">Transformá tu web hoy</h3>
            <p className="mt-4 font-body leading-relaxed text-white/60">
              Potenciá tu negocio con un diseño profesional y estratégico.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-block rounded-xl border border-white/15 bg-white/8 px-7 py-3.5 font-alt font-semibold transition-colors duration-300 hover:bg-white/15"
            >
              ¡Contactanos ahora!
            </a>
          </div>
        </div>

        <div className="mt-16 h-px bg-white/15" />

        <div className="mt-8 flex justify-center sm:justify-end">
          <p className="font-body text-white/70">
            © Copyright {new Date().getFullYear()} by LT WEB 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}
