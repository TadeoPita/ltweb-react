import { NAV_LINKS, INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL, LOCATION } from '../data/content'

/* Lleva id="contacto" porque el menú apunta ahí: la sección que tenía ese
   ancla se sacó de la home, y sin esto el enlace quedaba roto. */
export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#111113] text-white pt-20 pb-28">
      {/* En mobile todo el footer va centrado; desde md vuelve a alinearse
          a la izquierda como una grilla de columnas. */}
      <div className="mx-auto max-w-[1280px] px-6 text-center md:text-left">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Marca */}
          <div>
            {/* Antes tenía h-24, pero con el margen transparente del archivo el
                logo se veía de solo 10px. Recortado el archivo, esta altura es
                la real. */}
            <img src="/images/logo-blanco.webp" alt="LT WEB" className="h-9 w-auto mx-auto md:mx-0" />
            <p className="mt-5 font-body text-white/60 text-[13.5px] leading-relaxed max-w-xs mx-auto md:mx-0">
              Estudio de diseño y desarrollo web. Trabajamos con empresas que quieren comunicar mejor y generar nuevas oportunidades.
            </p>
            <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/45">Ubicación</p>
            <p className="mt-1.5 font-alt font-semibold text-sm">{LOCATION}</p>
          </div>

          {/* Secciones */}
          <div>
            <h3 className="font-alt font-semibold text-[15px]">Secciones</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={'/' + l.href} className="font-body text-[13.5px] text-white/70 hover:text-white transition-colors duration-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="font-alt font-semibold text-[15px]">Seguinos</h3>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="font-body text-[13.5px] text-white/70 hover:text-white transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="font-body text-[13.5px] text-white/70 hover:text-white transition-colors duration-300">
                  Tiktok
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-body text-[13.5px] text-white/70 hover:text-white transition-colors duration-300">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-alt font-semibold text-[15px]">Contacto</h3>
            <div className="mt-5">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/45">Teléfono</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-1.5 block font-alt font-semibold text-[14.5px] hover:text-white/80 transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>
            <div className="mt-5">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/45">Correo electrónico</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1.5 block font-alt font-semibold text-[14.5px] hover:text-white/80 transition-colors">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 h-px bg-white/15" />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/50 text-[12.5px]">© {new Date().getFullYear()} LTWEB. Todos los derechos reservados.</p>
          <p className="font-body text-white/50 text-[12.5px]">Diseño y desarrollo por LTWEB</p>
        </div>
      </div>
    </footer>
  )
}
