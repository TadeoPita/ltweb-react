import { NAV_LINKS, INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL, LOCATION } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-[#111113] text-white pt-20 pb-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Marca */}
          <div>
            <img src="/images/logo-blanco.png" alt="LT WEB" className="h-10 w-auto" />
            <p className="mt-5 font-body text-white/60 text-[15px] leading-relaxed max-w-xs">
              Estudio de diseño y desarrollo web. Trabajamos con empresas que quieren comunicar mejor y generar nuevas oportunidades.
            </p>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.15em] uppercase text-white/45">Ubicación</p>
            <p className="mt-1.5 font-alt font-semibold text-base">{LOCATION}</p>
          </div>

          {/* Secciones */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Secciones</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={'/' + l.href} className="font-body text-white/70 hover:text-white transition-colors duration-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Seguinos</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="font-body text-white/70 hover:text-white transition-colors duration-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="font-body text-white/70 hover:text-white transition-colors duration-300">
                  Tiktok
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-body text-white/70 hover:text-white transition-colors duration-300">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Contacto</h3>
            <div className="mt-6">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/45">Teléfono</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-1.5 block font-alt font-semibold text-lg hover:text-white/80 transition-colors">
                {CONTACT_PHONE}
              </a>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/45">Correo electrónico</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1.5 block font-alt font-semibold text-lg hover:text-white/80 transition-colors">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 h-px bg-white/15" />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/50 text-sm">© {new Date().getFullYear()} LTWEB. Todos los derechos reservados.</p>
          <p className="font-body text-white/50 text-sm">Diseño y desarrollo por LTWEB</p>
        </div>
      </div>
    </footer>
  )
}
