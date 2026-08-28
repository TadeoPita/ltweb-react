import { useRef } from 'react'

/* Distingue un clic de un arrastre dentro del bento.

   Con la tarjeta entera arrastrable, Swapy se queda con los eventos de
   puntero y el clic del enlace no llega a dispararse: las tarjetas que llevan
   a un proyecto dejaban de abrirse.

   La solución no es sacarle el arrastre, sino resolver el clic nosotros:
   guardamos dónde bajó el puntero y, al soltarlo, medimos cuánto se movió. Si
   se movió menos que el umbral fue un clic; si se movió más, era un arrastre y
   no se hace nada. Seis píxeles alcanzan para tolerar el temblor de la mano
   sin confundir un arrastre corto con un clic.

   El enlace se sigue renderizando como <a href>, así que el botón derecho,
   "abrir en pestaña nueva" y los buscadores lo siguen viendo como un enlace
   normal. Lo único que cambia es quién dispara la navegación. */

const UMBRAL = 6

export function usarClicSinArrastre(alHacerClic) {
  const inicio = useRef(null)

  return {
    onPointerDown: (e) => {
      inicio.current = { x: e.clientX, y: e.clientY }
    },
    onPointerUp: (e) => {
      const p = inicio.current
      inicio.current = null
      if (!p) return
      const recorrido = Math.hypot(e.clientX - p.x, e.clientY - p.y)
      if (recorrido < UMBRAL) alHacerClic(e)
    },
    /* El clic nativo se anula para no navegar dos veces: la navegación ya la
       dispara onPointerUp. Se deja pasar cuando hay una tecla modificadora,
       que es como se abre en otra pestaña o ventana. */
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
    },
  }
}
