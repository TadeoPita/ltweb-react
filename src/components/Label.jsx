/* Volanta de sección.

   Reemplaza al texto celeste que encabezaba cada bloque. Ese celeste sobre
   blanco quedaba débil y, sobre todo, era el mismo recurso repetido diez
   veces: un color de acento puesto para "dar color", no para ordenar nada.

   Acá el peso lo llevan la escala y el espaciado, no el color: una regla de
   1px seguida de una etiqueta chica en mayúsculas con el tracking abierto.
   Es el recurso de siempre de la composición editorial y es lo que hace que
   el ojo lea "acá empieza una sección" sin necesidad de gritar. */
export default function Label({ children, tone = 'dark', className = '' }) {
  const sobreOscuro = tone === 'light'

  return (
    <span className={'inline-flex items-center gap-3 ' + className}>
      <span aria-hidden className={'h-px w-8 ' + (sobreOscuro ? 'bg-white/25' : 'bg-black/15')} />
      <span
        className={
          'font-body font-semibold uppercase text-[11px] tracking-[0.18em] ' +
          (sobreOscuro ? 'text-white/55' : 'text-ink/45')
        }
      >
        {children}
      </span>
    </span>
  )
}
