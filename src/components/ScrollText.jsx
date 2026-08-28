import { useEffect, useRef } from 'react'

/* Texto que se pinta siguiendo el scroll.

   La diferencia con TextReveal, que ya existía: aquel arranca cuando el texto
   entra en pantalla y se pinta solo, a su ritmo. Acá el avance lo manda el
   scroll — si frenás, el pintado frena; si volvés para arriba, se despinta.
   Eso es lo que hace que se sienta como que uno lo va escribiendo al bajar, en
   vez de como una animación que se dispara y ya.

   El avance se calcula a mano en vez de con useScroll de Framer. En este
   proyecto ese hook devolvía siempre 0: se probó con distintos `offset` y
   sacando el overflow de las secciones y del body, y no se movía. Antes que
   seguir peleándolo, un listener de scroll y tres cuentas hacen exactamente lo
   mismo, se pueden verificar y no dependen de cómo el hook resuelva cuál es el
   contenedor de scroll.

   El pintado corre dentro de requestAnimationFrame y con el listener en
   passive: no bloquea el scroll ni se ejecuta más de una vez por cuadro por
   más eventos que lleguen.

   A cada palabra le toca un tramo del recorrido, y los tramos se solapan:
   siempre hay dos o tres a medio pintar, que es lo que da la sensación de
   barrido continuo en vez de palabras encendiéndose de a una.

   El texto completo va en aria-label y las palabras en aria-hidden, para que
   un lector de pantalla lea la frase de corrido. */

const SOLAPADO = 1.8

export default function ScrollText({ text, className = '', as: Tag = 'p', apagado = 0.18 }) {
  const ref = useRef(null)
  const palabras = text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const spans = [...el.querySelectorAll('[data-palabra]')]
    if (!spans.length) return

    /* Quien pidió menos movimiento ve el texto entero, sin barrido. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => {
        s.style.opacity = '1'
      })
      return
    }

    let pendiente = false

    function pintar() {
      pendiente = false
      const alto = window.innerHeight
      const arriba = el.getBoundingClientRect().top

      /* Arranca cuando el bloque asoma por abajo y termina cuando subió al
         primer tercio: el pintado ocurre mientras el texto viaja hacia el
         centro, que es donde se lo está leyendo. */
      const desde = alto * 0.92
      const hasta = alto * 0.3
      const avance = Math.min(1, Math.max(0, (desde - arriba) / (desde - hasta)))

      const paso = 1 / spans.length
      spans.forEach((s, i) => {
        const a = i * paso
        const b = Math.min(1, a + paso * SOLAPADO)
        const t = Math.min(1, Math.max(0, (avance - a) / (b - a)))
        s.style.opacity = String(apagado + (1 - apagado) * t)
      })
    }

    function alMoverse() {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(pintar)
    }

    pintar()
    window.addEventListener('scroll', alMoverse, { passive: true })
    window.addEventListener('resize', alMoverse)
    return () => {
      window.removeEventListener('scroll', alMoverse)
      window.removeEventListener('resize', alMoverse)
    }
  }, [text, apagado])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden>
        {palabras.map((p, i) => (
          <span
            key={i}
            data-palabra
            className="inline-block whitespace-pre"
            style={{ opacity: apagado }}
          >
            {p + (i < palabras.length - 1 ? ' ' : '')}
          </span>
        ))}
      </span>
    </Tag>
  )
}
