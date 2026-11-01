import { GA_ID } from '../data/content'

const PRIVADAS = /^\/(admin|login)(\/|$)/
const WHATSAPP = /wa\.me|whatsapp\.com/i

let iniciada = false

function seccionDe(el) {
  const contenedor = el.closest('section[id], header, footer, nav, [role="dialog"]')
  if (!contenedor) return 'pagina'
  return contenedor.id || contenedor.getAttribute('role') || contenedor.tagName.toLowerCase()
}

export function iniciarAnalitica() {
  if (iniciada || !GA_ID || import.meta.env.DEV || typeof window === 'undefined') return
  if (PRIVADAS.test(window.location.pathname)) return
  iniciada = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  const cargar = () => {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
    document.head.appendChild(s)
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(cargar, { timeout: 4000 })
  else window.setTimeout(cargar, 2000)

  document.addEventListener(
    'click',
    (e) => {
      const enlace = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!enlace || !WHATSAPP.test(enlace.getAttribute('href') || '')) return
      window.gtag('event', 'contacto_whatsapp', {
        ubicacion: seccionDe(enlace),
        pagina: window.location.pathname,
      })
    },
    { capture: true },
  )
}
