import { cn } from '../lib/utils'

/* Fondo Aurora.

   Adaptado del componente original, que venía escrito para Next.js con
   TypeScript. Tres cambios de fondo, no cosméticos:

   1. Sin "use client": eso es una directiva de Next y acá no existe.
   2. El original pinta con la escala azul/índigo/violeta por defecto de
      Tailwind, que es la que se ve en todos los sitios que copian este
      efecto. Usa en cambio los colores de la marca (lila y los pasteles del
      theme), así el fondo se lee como nuestro y no como una demo.
   3. En Tailwind v4 las variables de color son --color-*, y las que el
      original da por sentadas (--white, --transparent, --blue-500) no
      existen. Se declaran acá abajo.

   La animación está en index.css, con @keyframes aurora. */
export default function AuroraBackground({ className, children, radial = true, ...props }) {
  return (
    <div
      className={cn('relative flex flex-col items-center justify-center overflow-hidden', className)}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className={cn(
            'aurora absolute -inset-[80px] opacity-70 will-change-[background-position]',
            radial &&
              '[mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_75%)]',
          )}
        />
      </div>

      <div className="relative w-full">{children}</div>
    </div>
  )
}
