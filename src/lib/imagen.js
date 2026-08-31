/* Elige la medida de imagen que corresponde a cada lugar del sitio.
 *
 * Las portadas se guardan en tres tamaños (ver servidor/lib/imagenes.js). Este
 * helper traduce la ruta de la grande a la de la que hace falta.
 *
 * Existe porque lo que traba el scroll no es el peso del archivo sino la
 * cantidad de pixeles que el navegador tiene que descomprimir: una captura de
 * 1600x2844 ocupa unos 18 MB de memoria al dibujarse, aunque en pantalla se
 * vea en un recuadro de 268 px. Mandar la version chica no es una optimizacion
 * de bytes, es no hacer ese trabajo.
 *
 * Si no hay version chica —una imagen vieja, una ruta externa— devuelve la
 * original y no rompe nada.
 */

/* Las que vinieron con el proyecto tienen su copia en /images/muro/. */
const MURO = '/images/muro/'

export function chica(url) {
  if (typeof url !== 'string' || !url) return url
  if (url.startsWith('/images/pf-')) return url.replace('/images/', MURO)
  if (url.startsWith('/subidas/') && url.endsWith('.webp')) return url.slice(0, -5) + '-672.webp'
  return url
}

export function mediana(url) {
  if (typeof url !== 'string' || !url) return url
  /* Las del repositorio tambien tienen su version de 900 en /images/muro/.
     Sin esto la grilla las pedia a 1536 de ancho, que era el ultimo caso que
     seguia mandando imagenes gigantes a tarjetas chicas. */
  if (url.startsWith('/images/pf-') && url.endsWith('.webp')) {
    return url.replace('/images/', MURO).slice(0, -5) + '-900.webp'
  }
  if (url.startsWith('/subidas/') && url.endsWith('.webp')) return url.slice(0, -5) + '-900.webp'
  return url
}
