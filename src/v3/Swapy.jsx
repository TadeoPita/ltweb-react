import { useEffect, useRef } from 'react'
import { createSwapy } from 'swapy'
import { cn } from '../lib/utils'

/* Grilla con tarjetas que se pueden arrastrar e intercambiar.

   Port a JSX del componente original, que venía en TypeScript y para Next.
   Además del tipado, se corrigió un problema real que traía: el efecto que
   crea la instancia declaraba `[config, onSwap]` como dependencias, y como
   ambas se pasan casi siempre como literales, cambian de identidad en cada
   render. Eso destruía y volvía a crear Swapy continuamente, lo que corta un
   arrastre en curso. Acá la instancia se crea una sola vez al montar y las
   opciones y el callback viven en refs, que se actualizan sin recrear nada. */

/* `clave` tiene que cambiar cuando cambia el juego de tarjetas.

   Swapy escanea el DOM una sola vez, al crearse. Las tarjetas de proyecto no
   existen en ese momento: salen del portfolio, que llega por red unos
   instantes después. Cuando aparecen, Swapy sigue apuntando a los huecos que
   habia al montar y el arrastre deja de funcionar por completo.

   Por eso, cada vez que cambia `clave`, se le avisa que vuelva a escanear. */
/* En pantallas tactiles no se crea Swapy. Ni apagado: directamente no existe.
   
   El primer intento fue crearlo con `enabled: false`, y no alcanzo. Mirando la
   libreria se ve por que: al construirse engancha
   
     document.body.addEventListener("touchmove", M, { passive: false })
     function M(m) { if (!l) return true; m.preventDefault() }
   
   o sea un listener NO pasivo sobre el body entero que corta el gesto cuando
   esta arrastrando. Y `enabled` se consulta solo en los callbacks de
   intercambio: el manejador de pointerdown, que es el que prende esa bandera,
   no lo mira. Resultado: con el arrastre "apagado" igual entraba en modo
   arrastre al apoyar el dedo, y el touchmove siguiente se cancelaba. Por eso
   el scroll se trababa sobre las tarjetas y solo respondia en los bordes de la
   pantalla, que es donde no hay grilla.
   
   Como el listener se engancha al construir y no al arrastrar, la unica forma
   de que no exista es no construir la instancia.
   
   La condicion es (pointer: coarse) y no un ancho: lo que importa no es el
   tamano de la pantalla sino si hay un puntero fino con el que apuntar. */
const SIN_MOUSE = '(pointer: coarse)'

export function SwapyLayout({ id, onSwap, config = {}, className, clave, children }) {
  const contenedor = useRef(null)
  const swapy = useRef(null)
  const configRef = useRef(config)
  const onSwapRef = useRef(onSwap)

  configRef.current = config
  onSwapRef.current = onSwap

  useEffect(() => {
    if (!contenedor.current) return

    const tactil = window.matchMedia(SIN_MOUSE)

    function crear() {
      if (swapy.current || !contenedor.current) return
      swapy.current = createSwapy(contenedor.current, configRef.current)
      swapy.current.onSwap((evento) => onSwapRef.current?.(evento))
    }

    function destruir() {
      swapy.current?.destroy()
      swapy.current = null
    }

    if (!tactil.matches) crear()

    /* Se escucha el cambio porque el valor no es fijo para toda la sesion: se
       puede enchufar un mouse, o abrir las herramientas de desarrollo. */
    const alCambiar = (e) => (e.matches ? destruir() : crear())
    tactil.addEventListener('change', alCambiar)

    return () => {
      tactil.removeEventListener('change', alCambiar)
      destruir()
    }
  }, [])

  useEffect(() => {
    if (!swapy.current) return
    /* update() vuelve a leer los huecos y las tarjetas del DOM. Se llama en un
       microtask para que corra después de que React haya pintado las nuevas. */
    const t = setTimeout(() => swapy.current?.update(), 0)
    return () => clearTimeout(t)
  }, [clave])

  return (
    <div id={id} ref={contenedor} className={className}>
      {children}
    </div>
  )
}

/* El hueco fijo de la grilla: no se mueve, recibe a la tarjeta que se suelta. */
export function SwapySlot({ id, className, children }) {
  return (
    <div
      data-swapy-slot={id}
      className={cn('rounded-2xl data-[swapy-highlighted]:bg-black/[0.04]', className)}
    >
      {children}
    </div>
  )
}

/* La tarjeta que efectivamente se arrastra. */
export function SwapyItem({ id, className, children }) {
  return (
    <div
      data-swapy-item={id}
      className={cn('h-full w-full data-[swapy-dragging]:opacity-60', className)}
    >
      {children}
    </div>
  )
}

/* Manija de arrastre. Aparece al pasar el cursor por la tarjeta: si estuviera
   siempre visible, ocho manijas repartidas por la grilla ensucian la lectura. */
export function DragHandle({ className }) {
  return (
    <div
      data-swapy-handle
      aria-hidden
      className={cn(
        'absolute top-3 right-3 z-10 cursor-grab active:cursor-grabbing rounded-lg p-1',
        'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    </div>
  )
}
