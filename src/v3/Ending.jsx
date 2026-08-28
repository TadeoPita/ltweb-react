import { Link } from 'react-router-dom'
import {
  INSTAGRAM_URL,
  TIKTOK_URL,
  WHATSAPP_URL,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  LOCATION,
} from '../data/content'

/* Pie del sitio.

   Vuelve a la composición del sitio original: tres columnas —secciones, redes
   y contacto— y a la derecha la tarjeta con el llamado a la acción, después
   una línea y el copyright.

   La versión anterior de este bloque era un cierre grande con el correo y el
   teléfono como titulares a todo el ancho. Quedaba pesado justo después de
   "Seguinos en nuestras redes", que ya empuja al contacto, y encima repetía
   los mismos datos dos veces seguidas.

   Los enlaces arrancan con "/" y no con "#" a secas: este pie ya no es solo
   de la home, aparece también en el portfolio y en cada ficha de proyecto, y
   desde ahí un "#faq" pelado no lleva a ningún lado. */

const SECCIONES = [
  { label: 'Inicio', href: '/#inicio-v3' },
  { label: 'El estudio', href: '/#bento-v3' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'FAQ', href: '/#faq' },
]

const enlace =
  'font-body text-[13.5px] text-white/70 transition-colors duration-300 hover:text-white'
const titulo = 'font-alt font-semibold text-[15px]'
const volanta = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45'
const dato =
  'mt-1.5 block font-alt font-semibold text-[14.5px] transition-colors hover:text-white/80'

export default function Ending() {
  return (
    /* En mobile va todo centrado; desde md vuelve a la grilla alineada a la
       izquierda. */
    <footer id="contacto-v3" className="bg-[#08080a] pt-20 pb-16 text-white">
      <div className="mx-auto max-w-[1140px] px-6 text-center md:text-left">
        {/* La marca. Faltaba por completo: el pie arrancaba directo con la
            columna de secciones y el sitio terminaba sin firmar. */}
        <div className="flex flex-col items-center gap-4 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between md:gap-8">
          <Link to="/" aria-label="LT WEB" className="shrink-0">
            <img
              src="/images/logo-blanco.webp"
              alt="LT WEB"
              className="h-9 w-auto"
              width="220"
              height="36"
            />
          </Link>
          <p className="max-w-sm font-body text-[13.5px] leading-relaxed text-white/55">
            Estudio de diseño y desarrollo web en {LOCATION}. Trabajamos con empresas que
            quieren comunicar mejor y generar nuevas oportunidades.
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1fr_1.2fr_1.6fr]">
          {/* Secciones */}
          <div>
            <h3 className={titulo}>Secciones</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {SECCIONES.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={enlace}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className={titulo}>Redes Sociales</h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={enlace}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className={enlace}>
                  Tiktok
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className={titulo}>Contacto</h3>
            <div className="mt-5">
              <p className={volanta}>Teléfono</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={dato}>
                {CONTACT_PHONE}
              </a>
            </div>
            <div className="mt-5">
              <p className={volanta}>Correo electrónico</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={dato}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Tarjeta con el llamado a la acción */}
          <div className="self-start rounded-2xl border border-white/12 p-7 text-center sm:p-8">
            <h3 className={titulo}>Transformá tu web hoy</h3>
            <p className="mt-3.5 font-body text-[13.5px] leading-relaxed text-white/60">
              Potenciá tu negocio con un diseño profesional y estratégico.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-xl border border-white/15 bg-white/8 px-6 py-3 font-alt text-[13.5px] font-semibold transition-colors duration-300 hover:bg-white/15"
            >
              ¡Contactanos ahora!
            </a>
          </div>
        </div>

        <div className="mt-14 h-px bg-white/15" />

        <div className="mt-8 flex justify-center sm:justify-end">
          <p className="font-body text-[12.5px] text-white/70">
            © Copyright {new Date().getFullYear()} by LT WEB 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}
