/* Variantes de entrada compartidas.

   Todas las secciones usan estas mismas, así el sitio entero se mueve con un
   solo criterio en vez de que cada bloque invente el suyo.

   Qué cambió respecto de la versión anterior, y por qué:

   - La curva pasa a una salida más larga (0.16, 1, 0.3, 1). Arranca más
     rápido y frena más despacio, que es lo que hace que un movimiento se
     sienta "pesado" y no lineal. Es la diferencia entre algo que aparece y
     algo que se asienta.

   - El desplazamiento sube de 22 a 34px y se le suma una escala mínima
     (0.985 → 1). El elemento no solo sube: crece un pelo mientras llega, que
     es lo que da la sensación de que se acerca en vez de deslizarse.

   - El desenfoque baja de 10 a 6px. Diez era tanto que el texto llegaba
     ilegible y se leía como un defecto de carga.

   - El escalonado entre hijos baja a 0.07s. Con 0.09 la última tarjeta de una
     fila de ocho entraba casi un segundo después que la primera, y la espera
     se notaba.

   - `viewport.amount: 0.15` hace que la animación arranque cuando entró un
     15% del bloque, no apenas asoma el borde: así el movimiento ocurre
     mientras se está mirando y no antes de llegar. */

export const EASE = [0.16, 1, 0.3, 1]

const VISTA = { once: true, margin: '-60px', amount: 0.15 }

/* Elemento suelto: título, párrafo, botón. */
export const blurUp = (delay = 0, y = 34) => ({
  initial: { opacity: 0, y, scale: 0.985, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  viewport: VISTA,
  transition: { duration: 1, delay, ease: EASE },
})

/* Igual que blurUp pero para lo que ya está en pantalla al cargar (hero). */
export const blurIn = (delay = 0, y = 34) => ({
  initial: { opacity: 0, y, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 1, delay, ease: EASE },
})

/* Contenedor que escalona a sus hijos: usar junto a blurChild. */
export const blurStagger = (stagger = 0.07, delayChildren = 0.05) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: VISTA,
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  },
})

export const blurChild = {
  hidden: { opacity: 0, y: 34, scale: 0.985, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: EASE },
  },
}
