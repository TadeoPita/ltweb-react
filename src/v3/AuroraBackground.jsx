import { cn } from '../lib/utils'

/* Fondo Aurora.

   Adaptado del componente original, que venía escrito para Next.js con
   TypeScript. Sin "use client", que es una directiva de Next, y con el
   degradado resuelto en index.css.

   `desde` decide dónde se concentra el color. En el hero conviene arriba,
   porque es donde entra la vista. En el cierre, arriba deja un borde duro
   justo contra la sección anterior: ahí se manda abajo y el borde superior
   queda limpio para poder empalmar con lo que viene antes. */
export default function AuroraBackground({ className, children, desde = 'arriba', ...props }) {
  const mascara =
    desde === 'abajo'
      ? '[mask-image:radial-gradient(ellipse_at_50%_100%,black_15%,transparent_80%)]'
      : '[mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_75%)]'

  return (
    <div
      className={cn('relative flex flex-col items-center justify-center overflow-hidden', className)}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className={cn(
            'aurora absolute -inset-[80px] opacity-70 will-change-[background-position]',
            mascara,
          )}
        />
      </div>

      <div className="relative w-full">{children}</div>
    </div>
  )
}
