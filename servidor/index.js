import { createServer } from 'node:http'
import { createReadStream, mkdirSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve, join, normalize, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { manejarApi } from './lib/api.js'
import { rutasProduccion } from './lib/datos.js'

/* El servidor.
 *
 * Hace tres cosas y nada más: sirve el sitio ya construido, sirve las imágenes
 * que se suben desde el panel, y atiende /api.
 *
 * Sin framework. Un Express acá serían 60 paquetes de dependencia para lo que
 * el módulo http de Node ya hace: leer una ruta, mandar un archivo y parsear
 * un cuerpo JSON. Menos dependencias es menos superficie que actualizar y
 * menos cosas que se pueden romper solas.
 */

const RAIZ = resolve(fileURLToPath(import.meta.url), '../..')
const DIST = join(RAIZ, 'dist')
const SUBIDAS = join(RAIZ, 'subidas')

const PUERTO = Number(process.env.PORT) || 3000

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

/* Los archivos de assets/ llevan un hash en el nombre: si cambia el contenido
   cambia la URL, así que se pueden cachear un año sin riesgo.
 *
 * projects.js es la excepción importante: lo pisa cada publicación y siempre
 * se llama igual, así que si se cachea, publicar no se ve nunca. Y el HTML
 * tampoco, porque es el que apunta a los assets nuevos. */
function cacheDe(ruta) {
  if (ruta.includes('/assets/')) return 'public, max-age=31536000, immutable'
  if (ruta.endsWith('/data/projects.js') || ruta.endsWith('.html')) return 'no-cache, must-revalidate'
  if (ruta.startsWith('/subidas/')) return 'public, max-age=31536000, immutable'
  return 'public, max-age=86400'
}

/* Evita que un pedido con ".." se lleve archivos de fuera de la carpeta.
   Se normaliza y después se comprueba que el resultado siga adentro: comparar
   contra la cadena original no alcanza, porque hay muchas formas de escribir
   lo mismo (%2e%2e, barras dobles, etc). */
function rutaSegura(base, pedida) {
  let limpia
  try {
    limpia = normalize(decodeURIComponent(pedida)).replace(/^(\.\.[/\\])+/, '')
  } catch {
    /* decodeURIComponent revienta con un %ZZ mal formado. Antes eso tiraba el
       pedido con un 500 en vez de responder "no encontrado". */
    return null
  }

  const completa = join(base, limpia)

  /* Se compara contra base + separador, no solo contra base. Con startsWith a
     secas, una carpeta hermana que empiece igual —dist y dist-privado— pasaba
     la comprobación. Acá no llega a ser explotable porque join siempre resuelve
     dentro de base, pero la comprobación tiene que ser correcta por sí sola y
     no depender de lo que hace la línea de arriba. */
  return completa === base || completa.startsWith(base + sep) ? completa : null
}

async function servirArchivo(res, ruta, urlOriginal) {
  try {
    const info = await stat(ruta)
    if (!info.isFile()) return false

    res.writeHead(200, {
      'Content-Type': TIPOS[extname(ruta).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': cacheDe(urlOriginal),
      'X-Content-Type-Options': 'nosniff',
    })
    createReadStream(ruta).pipe(res)
    return true
  } catch {
    return false
  }
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const camino = url.pathname

  // Cabeceras de seguridad para todo lo que salga de acá.
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  try {
    // --- La API ---
    const manejada = await manejarApi(req, res, {
      raiz: RAIZ,
      raizPublica: RAIZ,
      rutas: rutasProduccion(RAIZ),
      produccion: true,
      pedirSesion: true,
    })
    if (manejada) return

    // --- Imágenes subidas desde el panel ---
    //
    // Se busca en dos lados. Las que se suben en el servidor van a subidas/,
    // que queda fuera de dist y por lo tanto sobrevive a cada despliegue. Las
    // que se cargaron en desarrollo viajan dentro del build, en dist/subidas.
    // Sin este segundo intento, una imagen cargada desde la compu daba 404 al
    // subir el sitio.
    if (camino.startsWith('/subidas/')) {
      const relativa = camino.slice('/subidas'.length)
      for (const base of [SUBIDAS, join(DIST, 'subidas')]) {
        const ruta = rutaSegura(base, relativa)
        if (ruta && (await servirArchivo(res, ruta, camino))) return
      }
      res.writeHead(404).end('No encontrado')
      return
    }

    // --- El sitio ---
    const ruta = rutaSegura(DIST, camino)
    if (ruta && (await servirArchivo(res, ruta, camino))) return

    /* Cualquier otra cosa la resuelve React. Es lo que hace que entrar directo
       a /portfolio o recargar una ficha funcione en vez de dar 404. */
    if (await servirArchivo(res, join(DIST, 'index.html'), '/index.html')) return

    res.writeHead(404).end('No encontrado')
  } catch (err) {
    console.error('[servidor]', err)
    if (!res.headersSent) res.writeHead(500).end('Error del servidor')
  }
})

/* Versión sincrónica a propósito, aunque el resto del archivo sea asíncrono.
 *
 * Acá había `await mkdir(...)` y eso tiraba el sitio entero con 503. Hostinger
 * corre las apps Node sobre LiteSpeed, que carga el archivo de entrada con
 * require(). Node sabe hacer require() de un módulo ESM, pero NO si tiene await
 * en el nivel superior: ahí devuelve ERR_REQUIRE_ASYNC_MODULE y el proceso ni
 * arranca.
 *
 * mkdirSync hace lo mismo sin volver asíncrono el módulo. Son dos carpetas que
 * se crean una vez al arrancar; que sea sincrónico no le cuesta nada a nadie.
 *
 * Regla para lo que venga: en este archivo no puede haber await fuera de una
 * función. */
mkdirSync(SUBIDAS, { recursive: true })
mkdirSync(join(RAIZ, 'datos'), { recursive: true })

/* Sin esto, el puerto ocupado tira un volcado de pila de veinte lineas que no
   dice que hacer. Pasa al probar en local con otra instancia levantada. */
servidor.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`
  El puerto ${PUERTO} ya esta en uso. Cerra el otro proceso o usa: PORT=otro npm start
`)
    process.exit(1)
  }
  throw err
})

servidor.listen(PUERTO, () => {
  console.log(`\n  LTWEB en http://localhost:${PUERTO}`)
  console.log(`  Panel:   http://localhost:${PUERTO}/admin\n`)
})

/* El hosting manda SIGTERM al reiniciar. Cerrar ordenado evita cortar un
   pedido a la mitad —por ejemplo una publicación a medio escribir. */
for (const senal of ['SIGTERM', 'SIGINT']) {
  process.on(senal, () => {
    console.log('\n  Cerrando…')
    servidor.close(() => process.exit(0))
  })
}
