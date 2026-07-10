import { NAV_LINKS, INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL, CONTACT_PHONE, CONTACT_EMAIL } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-[#111113] text-white pt-20 pb-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr_1.2fr_1.6fr]">
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

          {/* Redes Sociales */}
          <div>
            <h3 className="font-alt font-semibold text-xl">Redes Sociales</h3>
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

          {/* Card CTA */}
          <div className="rounded-2xl border border-white/12 p-8 sm:p-10 text-center self-start">
            <h3 className="font-alt font-semibold text-xl">Transforma tu web hoy</h3>
            <p className="mt-4 font-body text-white/60 leading-relaxed">
              Potencia tu negocio con un diseño profesional y estratégico.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-block rounded-xl bg-white/8 border border-white/15 px-7 py-3.5 font-alt font-semibold hover:bg-white/15 transition-colors duration-300"
            >
              ¡Contáctanos Ahora!
            </a>
          </div>
        </div>

        <div className="mt-16 h-px bg-white/15" />

        <div className="mt-8 flex justify-center sm:justify-end">
          <p className="font-body text-white/70">© Copyright {new Date().getFullYear()} by LT WEB 🚀</p>
        </div>
      </div>
    </footer>
  )
}
