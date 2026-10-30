/* Reseñas en video de clientes reales.

   Cada video es vertical (9:16) y lleva los subtítulos quemados abajo, así que
   la tarjeta respeta esa proporción para no cortarlos. Para sumar otro cliente
   alcanza con agregar un objeto acá: el carrusel se arma solo y las flechas
   aparecen recién cuando hay más de uno.

   vistaPrevia es el tramo (en segundos) que se repite sin sonido mientras
   nadie toca la tarjeta. Conviene un tramo sin subtítulos: abajo de la tarjeta
   va el nombre del cliente y se pisarían. Sin este dato se repite el video
   entero. */
export const TESTIMONIOS = [
  {
    id: 'mutisia',
    nombre: 'Mutisia Cervecería',
    detalle: 'Cervecería artesanal · Neuquén',
    video: '/testimonios/mutisia.mp4',
    poster: '/testimonios/mutisia.jpg',
    frase: 'Súper recomendable',
    /* El inicio tiene el mismo diseño que las demás (la web arriba y él
       abajo); el tramo arranca en 0,6 s para no repetir la entrada. */
    vistaPrevia: [0.6, 3.9],
  },
  {
    id: 'fonodiazvelez',
    nombre: 'Fono Díaz Vélez',
    detalle: 'Centro fonoaudiológico · Buenos Aires',
    video: '/testimonios/fonodiazvelez.mp4',
    poster: '/testimonios/fonodiazvelez.jpg',
    frase: 'Súper valioso',
    /* En este video los subtítulos van al medio, no abajo: el nombre no los
       pisa, así que el tramo puede arrancar con ella hablando. */
    vistaPrevia: [0, 4.5],
  },
  {
    id: 'mundalma',
    nombre: 'Mundalma',
    detalle: 'Astrología y tarot',
    video: '/testimonios/mundalma.mp4',
    poster: '/testimonios/mundalma.jpg',
    frase: 'Otro nivel',
    /* Subtítulos al medio, como en Fono Díaz Vélez. Arranca en 0,7 s para
       que la entrada animada del principio no se repita en cada vuelta. */
    vistaPrevia: [0.7, 4.4],
  },
  {
    id: 'micaelarodera',
    nombre: 'Micaela Rodera',
    detalle: 'Abogada · Derecho migratorio',
    video: '/testimonios/micaelarodera.mp4',
    poster: '/testimonios/micaelarodera.jpg',
    frase: 'Muy conforme',
    /* Subtítulos al medio. El tramo muestra su web y la placa de Meta Ads
       entera, y vuelve antes de que la placa se cierre. */
    vistaPrevia: [0.6, 7.1],
  },
]
