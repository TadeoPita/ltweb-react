/* Piezas de la identidad visual 2026.

   El logo en sus versiones. En el sitio va en blanco sobre los fondos
   oscuros, como iba el anterior.

   Los logos son SVG en /public/marca. Los originales simulaban el degradé con
   unas 150 franjas recortadas; acá son un linearGradient con los mismos
   colores de punta a punta, así que pesan la mitad y no dejan rayitas al
   escalarse. */

/* Proporción del imagotipo horizontal (751.62 × 242.29). */
const PROPORCION = 751.62 / 242.29

/* Versiones del imagotipo horizontal:
   - pastel: isotipo en degradé + texto celeste pastel. Para fondos oscuros.
   - brillante: isotipo en degradé + texto azul. Para fondos claros.
   - blanco: todo en blanco frío. Sobre fotos o fondos de color.
   - noche: todo en azul noche. Monocromo sobre claro. */
export function Logo({ variante = 'blanco', alto = 40, className = '', ...resto }) {
  return (
    <img
      draggable={false}
      src={`/marca/imagotipo-${variante}.svg`}
      alt="LTWEB desarrollo digital"
      width={Math.round(alto * PROPORCION)}
      height={alto}
      className={className}
      {...resto}
    />
  )
}

/* El isotipo solo: la estrella. */
export function Isotipo({ variante = 'degrade', className = '', ...resto }) {
  const archivo = variante === 'degrade' ? 'isotipo' : `isotipo-${variante}`
  return <img draggable={false} src={`/marca/${archivo}.svg`} alt="" aria-hidden className={className} {...resto} />
}
