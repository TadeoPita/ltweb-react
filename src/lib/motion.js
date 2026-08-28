/* Variantes de entrada compartidas.
   Toman prestado el lenguaje del hero (que ya entraba con blur) para que
   todas las secciones se sientan parte del mismo sistema: el contenido
   aparece desenfocado y se asienta, sin rebotes ni desplazamientos largos. */

export const EASE = [0.22, 1, 0.36, 1]

/* Elemento suelto: título, párrafo, botón. */
export const blurUp = (delay = 0, y = 22) => ({
  initial: { opacity: 0, y, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.85, delay, ease: EASE },
})

/* Igual que blurUp pero para lo que ya está en pantalla al cargar (hero). */
export const blurIn = (delay = 0, y = 22) => ({
  initial: { opacity: 0, y, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.85, delay, ease: EASE },
})

/* Contenedor que escalona a sus hijos: usar junto a blurChild. */
export const blurStagger = (stagger = 0.09, delayChildren = 0.05) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-70px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  },
})

export const blurChild = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
}
