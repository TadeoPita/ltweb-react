/* Une clases descartando las vacías.

   Los componentes que se copian de librerías tipo shadcn esperan un `cn` que
   además resuelva conflictos de Tailwind con tailwind-merge. Acá no hace
   falta: no armamos clases desde props sueltas de terceros, controlamos
   nosotros lo que entra, así que un join alcanza y evita sumar dos
   dependencias más al bundle. Si algún día se pasan clases que se pisan entre
   sí, ahí sí conviene traer tailwind-merge. */
export function cn(...clases) {
  return clases.filter(Boolean).join(' ')
}
