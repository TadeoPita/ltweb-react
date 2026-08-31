import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { MEDIDAS, procesar } from '../servidor/lib/imagenes.js'

/* Trae al proyecto las imágenes que todavía viven afuera.
 *
 * Se corre una vez, para cortar del todo con Supabase. Mientras las portadas
 * apunten a supabase.co el sitio sigue dependiendo de ese servicio: si el plan
 * gratis se termina o el proyecto se pausa, las imágenes desaparecen de la web
 * aunque el resto esté hosteado en otro lado.
 *
 * De paso arregla el tirón al scrollear. Cada imagen se guarda en tres
 * medidas, y la razón es la que está explicada en servidor/lib/imagenes.js:
 * lo que traba el scroll no es cuánto pesa el archivo sino cuántos píxeles
 * tiene que descomprimir el navegador. Una captura de 1600x2844 ocupa unos
 * 18 MB de memoria al dibujarse, aunque en pantalla se vea en un recuadro de
 * 268 px. Con veintipico así, el scroll pierde cuadros.
 *
 * Uso:  node scripts/traer-imagenes.js
 */

const ARCHIVO = 'datos/proyectos.json'
const DESTINO = 'public/subidas'
const URL_BASE = '/subidas'

const datos = JSON.parse(await readFile(ARCHIVO, 'utf8'))
await mkdir(resolve(DESTINO), { recursive: true })

/* Las que ya están en el proyecto no se tocan. */
const esExterna = (u) => typeof u === 'string' && /^https?:\/\//i.test(u)

async function traer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  const meta = await sharp(buffer).metadata()
  const base = randomUUID()

  for (const m of MEDIDAS) {
    await procesar(buffer, meta, m).toFile(resolve(DESTINO, `${base}${m.sufijo}.webp`))
  }

  return { url: `${URL_BASE}/${base}.webp`, antes: `${meta.width}x${meta.height}`, bytes: buffer.length }
}

let traidas = 0
let fallidas = 0
let ahorro = 0

for (const p of datos.proyectos) {
  // Portada
  if (esExterna(p.image)) {
    try {
      const r = await traer(p.image)
      console.log(`  ${p.id.padEnd(22)} ${r.antes.padStart(11)}  ${Math.round(r.bytes / 1024)} KB  ->  ${basename(r.url)}`)
      p.image = r.url
      traidas++
      ahorro += r.bytes
    } catch (err) {
      console.log(`  ${p.id.padEnd(22)} FALLO: ${err.message}`)
      fallidas++
    }
  }

  // "Antes"
  if (esExterna(p.beforeImage)) {
    try {
      p.beforeImage = (await traer(p.beforeImage)).url
      traidas++
    } catch {
      fallidas++
    }
  }

  // Galería
  if (Array.isArray(p.gallery)) {
    for (let i = 0; i < p.gallery.length; i++) {
      const g = p.gallery[i]
      const u = typeof g === 'string' ? g : g?.url
      if (!esExterna(u)) continue
      try {
        p.gallery[i] = { url: (await traer(u)).url }
        traidas++
      } catch {
        fallidas++
      }
    }
  }
}

await writeFile(ARCHIVO, JSON.stringify(datos, null, 2), 'utf8')

console.log(`\n  Traídas: ${traidas}${fallidas ? `   Fallidas: ${fallidas}` : ''}`)
console.log(`  Originales: ${(ahorro / 1024 / 1024).toFixed(1)} MB descargados y reescritos en tres medidas.`)
console.log('\n  Acordate de publicar desde el panel para que el sitio use las nuevas rutas.\n')
