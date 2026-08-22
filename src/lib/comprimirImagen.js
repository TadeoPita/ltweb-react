/* Comprime una imagen en el navegador antes de subirla al Storage.

   Las capturas que subimos desde /admin salen del editor o de FireShot y pesan
   entre 4 y 6 MB cada una. Eso trae tres problemas a la vez: llena el plan
   gratuito de Supabase (1 GB), consume el limite de trafico (5 GB al mes, o
   sea que ~850 visitas que vean una portada de 6 MB ya lo agotan) y sobre todo
   hace lenta la pagina para el visitante, que se baja 6 MB por una imagen que
   se muestra a 800 px de ancho.

   Redimensiona a MAX_ANCHO y reencoda a WebP, que es el mismo tratamiento que
   se le dio a las imagenes del repo (ahi la reduccion fue del 85%).

   Si algo no sale como se espera se devuelve el archivo original: es preferible
   subir una imagen pesada a que el panel tire error y no se pueda cargar. */

const MAX_ANCHO = 1600
const CALIDAD = 0.82

export async function comprimirImagen(file) {
  // Los vectores no se tocan: pasarlos por canvas los convierte en mapa de bits.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  // Los GIF perderian la animacion.
  if (file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const escala = Math.min(1, MAX_ANCHO / bitmap.width)
    const ancho = Math.round(bitmap.width * escala)
    const alto = Math.round(bitmap.height * escala)

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, ancho, alto)
    bitmap.close()

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', CALIDAD))

    // Si el resultado no es mas chico (imagenes ya optimizadas, o muy chicas),
    // no ganamos nada y encima perderiamos calidad: queda el original.
    if (!blob || blob.size >= file.size) return file

    const nombre = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], nombre, { type: 'image/webp' })
  } catch {
    return file
  }
}
