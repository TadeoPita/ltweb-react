import { Fragment } from 'react'

/* Marquesina a todo el ancho.

   Corta entre dos bloques densos —el bento y el proceso— y le da respiro y
   ritmo a la página. Repite lo que hacemos a tamaño de titular, que además
   funciona como recordatorio sin gastar una sección entera.

   El desplazamiento es CSS puro, sin JavaScript: la cinta se duplica y se
   mueve exactamente la mitad de su ancho, así el punto de reinicio cae justo
   donde arranca la copia y el bucle es invisible. Al pasar el cursor se
   frena, porque una cinta que no para molesta cuando alguien quiere leerla.

   `aria-hidden` en la copia: para un lector de pantalla el texto está una
   sola vez, no dos. */

const PALABRAS = [
  'Diseño web',
  'Tiendas online',
  'Sistemas a medida',
  'Rediseños',
  'Autoadministrable',
  'Soporte',
]

function Cinta({ oculta }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {PALABRAS.map((p) => (
        <Fragment key={p}>
          <span className="px-8 font-display font-bold uppercase text-[#26262b] text-4xl sm:text-6xl leading-none">
            {p}
          </span>
          <img
            draggable={false}
            src="/images/sparkle.svg"
            alt=""
            aria-hidden
            className="h-6 w-6 shrink-0 sm:h-8 sm:w-8"
          />
        </Fragment>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-black/[0.07] bg-white py-10 sm:py-14">
      {/* Los bordes se desvanecen para que las palabras no aparezcan y
          desaparezcan de golpe contra el filo de la pantalla. */}
      <div className="marquesina flex w-max">
        <Cinta />
        <Cinta oculta />
      </div>
    </section>
  )
}
