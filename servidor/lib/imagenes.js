import { mkdir, unlink } from 'node:fs/promises'
import { resolve, basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'

/* Subida y redimensionado de imágenes.
 *
 * POR QUE SE GENERAN TRES TAMAÑOS Y NO UNO
 *
 * Esta es la causa del tirón al scrollear, y conviene dejarla escrita porque
 * no es obvia: el problema no es cuánto pesa la imagen sino cuánto ocupa
 * DESCOMPRIMIDA. Una captura de 1600x2844 son 250 KB en disco, pero al
 * dibujarla el navegador la expande a 1600 × 2844 × 4 bytes ≈ 18 MB de
 * memoria. Y eso pasa aunque en pantalla se vea en un recuadro de 268 px.
 *
 * Con veintipico de proyectos en la página, eso es medio giga de mapas de bits
 * y una tanda de decodificaciones que le come cuadros al scroll. Bajar la
 * calidad del WebP no arregla nada: el peso baja, los píxeles siguen siendo
 * los mismos.
 *
 * La única solución real es mandar menos píxeles. Por eso cada imagen se
 * guarda en tres medidas y cada lugar del sitio pide la que necesita:
 *
 *   muro    672 px   el fondo del inicio, que dibuja a 268-336
 *   tarjeta 900 px   la grilla del portfolio
 *   (base) 1600 px   la ficha del proyecto, que se ve grande
 *
 * El muro pasa de 18 MB a 1 MB por imagen. Eso es lo que saca el tirón.
 *
 * SEGURIDAD
 *
 * La imagen se recodifica siempre: se redibuja desde los píxeles con sharp, lo
 * que descarta cualquier cosa escondida en los metadatos. Y el nombre lo pone
 * el servidor al azar, nunca el que traía el archivo — ahí es donde viajan los
 * "../.." y las extensiones dobles.
 */

export const MEDIDAS = [
  { sufijo: '', ancho: 1600, calidad: 82 },
  { sufijo: '-900', ancho: 900, calidad: 80 },
  /* La chica además se recorta arriba.
  
     Muchas portadas son capturas de página entera: hay una de 1920x9562. Con
     solo achicar el ancho a 672 quedaba de 3347 de alto, o sea 2,2 megapíxeles
     para un recuadro que en pantalla mide 268x168. Como el muro las dibuja con
     object-cover y object-top —o sea que muestra la franja de arriba y descarta
     el resto—, guardar el largo completo es peso que nunca se ve.
  
     Recortada a 672x420 (la misma proporción que el recuadro) son 0,28
     megapíxeles: ocho veces menos que descomprimir. */
  { sufijo: '-672', ancho: 672, calidad: 76, altoMaximo: 420 },
]

const CARPETA = 'subidas'

export function rutaSubidas(raizPublica) {
  return resolve(raizPublica, CARPETA)
}

export const URL_SUBIDAS = '/' + CARPETA

/* Aplica una medida a la imagen. Se exporta porque el script que trae las
   imágenes de afuera tiene que hacer exactamente lo mismo. */
export function procesar(buffer, meta, m) {
  const ancho = Math.min(meta.width, m.ancho)
  const img = sharp(buffer)

  if (m.altoMaximo) {
    /* position: top recorta desde arriba en vez de por el centro, que es lo
       que hace object-position: top en el sitio. */
    const alto = Math.round((meta.height * ancho) / meta.width)
    if (alto > m.altoMaximo) {
      return img
        .resize({ width: ancho, height: m.altoMaximo, fit: 'cover', position: 'top' })
        .webp({ quality: m.calidad })
    }
  }

  return img.resize({ width: ancho, withoutEnlargement: true }).webp({ quality: m.calidad })
}

/* Guarda las tres medidas y devuelve la URL de la grande. Las otras dos se
   deducen del nombre, así que no hace falta guardarlas en el JSON. */
export async function guardarImagen(raizPublica, buffer) {
  const dir = rutaSubidas(raizPublica)
  await mkdir(dir, { recursive: true })

  const meta = await sharp(buffer).metadata()
  if (!meta.width || !meta.height) {
    throw new Error('El archivo no es una imagen válida.')
  }

  const base = randomUUID()

  for (const m of MEDIDAS) {
    await procesar(buffer, meta, m).toFile(resolve(dir, `${base}${m.sufijo}.webp`))
  }

  return `${URL_SUBIDAS}/${base}.webp`
}

/* Borra las tres medidas de una imagen subida.
 *
 * Solo toca archivos de la carpeta de subidas: las portadas que apuntan a
 * /images/ (las que vinieron con el proyecto) o a un dominio externo no son
 * nuestras. basename corta cualquier intento de salir de la carpeta. */
export async function borrarImagen(raizPublica, url) {
  if (typeof url !== 'string' || !url.startsWith(URL_SUBIDAS + '/')) return

  const archivo = basename(url)
  if (!archivo.endsWith('.webp')) return
  const base = archivo.slice(0, -'.webp'.length)

  for (const m of MEDIDAS) {
    try {
      await unlink(resolve(rutaSubidas(raizPublica), `${base}${m.sufijo}.webp`))
    } catch {
      /* Ya no estaba: no es un problema. */
    }
  }
}
