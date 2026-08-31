import { readFile, writeFile, mkdir, unlink, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'

/* El panel, servido por el propio Vite.
 *
 * POR QUE ES UN PLUGIN Y NO UN SERVIDOR APARTE
 *
 * Un servidor suelto obliga a levantar dos procesos, a configurar un proxy y a
 * acordarse de arrancar los dos. Como plugin, el panel vive adentro de
 * `npm run dev`: se abre localhost, se entra a /admin y ya está. Un comando.
 *
 * QUE REEMPLAZA
 *
 * Todo lo que hacía Supabase: guardar los proyectos, subir las imágenes y
 * llevar los ajustes. La diferencia es dónde vive el dato: antes en una base
 * en la nube, ahora en datos/proyectos.json, un archivo del proyecto. Eso
 * significa que el contenido viaja con el repositorio, se versiona con git y
 * no depende de ningún servicio que pueda cortar el plan gratis.
 *
 * COMO SE PUBLICA
 *
 * El botón Publicar escribe public/data/projects.js, que es lo que lee el
 * sitio. De ahí en más el sitio es archivos estáticos: el visitante no habla
 * con ningún servidor.
 *
 * LIMITE A TENER EN CUENTA
 *
 * Esto corre en tu computadora, no en el hosting. O sea que se edita desde acá
 * y no desde el celular. A cambio no hay servidor que mantener, ni base de
 * datos, ni contraseñas que se puedan filtrar: el panel solo existe mientras
 * `npm run dev` está corriendo.
 */

const ARCHIVO_DATOS = 'datos/proyectos.json'
const CARPETA_SUBIDAS = 'public/images/subidas'
const URL_SUBIDAS = '/images/subidas'
const ARCHIVO_PUBLICADO = 'public/data/projects.js'

/* El ancho al que se guardan las portadas. Las capturas de pantalla llegan a
   2500 px y en el sitio nunca se ven a más de 1600. */
const ANCHO_MAXIMO = 1600

const AJUSTES_POR_DEFECTO = { variant: 'gallery', pageVariant: 'classic', heroVariant: 'centered' }

const CAMPOS = [
  'name', 'type', 'url', 'size', 'label', 'category',
  'problem', 'solution', 'description', 'services',
]

// ---------------------------------------------------------------------------
// Lectura y escritura del archivo de datos
// ---------------------------------------------------------------------------

async function leerDatos(raiz) {
  const ruta = resolve(raiz, ARCHIVO_DATOS)
  if (!existsSync(ruta)) {
    return { ajustes: { ...AJUSTES_POR_DEFECTO }, proyectos: [] }
  }
  try {
    const crudo = JSON.parse(await readFile(ruta, 'utf8'))
    return {
      ajustes: { ...AJUSTES_POR_DEFECTO, ...(crudo.ajustes ?? {}) },
      proyectos: Array.isArray(crudo.proyectos) ? crudo.proyectos : [],
    }
  } catch (err) {
    /* Si el archivo quedó roto se avisa y se sigue con lo que había, en vez de
       tumbar el servidor de desarrollo entero. */
    console.error('[panel] datos/proyectos.json ilegible:', err.message)
    return { ajustes: { ...AJUSTES_POR_DEFECTO }, proyectos: [] }
  }
}

/* Se escribe en un temporal y recién al final se renombra. Si el proceso muere
   a mitad de la escritura, el archivo original queda intacto en vez de quedar
   cortado por la mitad — que con el contenido de todo el portfolio adentro
   sería una pérdida seria. */
async function guardarDatos(raiz, datos) {
  const ruta = resolve(raiz, ARCHIVO_DATOS)
  await mkdir(resolve(raiz, 'datos'), { recursive: true })
  const tmp = ruta + '.tmp'
  await writeFile(tmp, JSON.stringify(datos, null, 2), 'utf8')
  const { rename } = await import('node:fs/promises')
  await rename(tmp, ruta)
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/* Convierte un texto en algo que sirva como URL: /proyecto/lo-que-sea.
   Se acota a letras, números y guiones; los puntos y las barras importan
   especialmente, porque un id como "../algo" no sería una ficha sino una ruta
   hacia otro lado. */
function comoId(texto) {
  const base = String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return base || 'proyecto-' + randomUUID().slice(0, 6)
}

function idLibre(proyectos, base) {
  const id = comoId(base)
  if (!proyectos.some((p) => p.id === id)) return id
  let n = 2
  while (proyectos.some((p) => p.id === `${id}-${n}`)) n++
  return `${id}-${n}`
}

async function cuerpoJson(req) {
  const trozos = []
  for await (const t of req) trozos.push(t)
  const texto = Buffer.concat(trozos).toString('utf8')
  return texto ? JSON.parse(texto) : {}
}

async function cuerpoBinario(req) {
  const trozos = []
  for await (const t of req) trozos.push(t)
  return Buffer.concat(trozos)
}

function responder(res, codigo, datos) {
  res.statusCode = codigo
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(datos))
}

// ---------------------------------------------------------------------------
// Imágenes
// ---------------------------------------------------------------------------

/* Se recodifica siempre a WebP y se achica. Además de bajar el peso, redibujar
   la imagen desde los píxeles descarta cualquier cosa que viniera pegada en
   los metadatos. */
async function guardarImagen(raiz, buffer) {
  const dir = resolve(raiz, CARPETA_SUBIDAS)
  await mkdir(dir, { recursive: true })

  const meta = await sharp(buffer).metadata()
  if (!meta.width || !meta.height) {
    throw new Error('El archivo no es una imagen válida.')
  }

  const nombre = randomUUID() + '.webp'
  await sharp(buffer)
    .resize({ width: Math.min(meta.width, ANCHO_MAXIMO), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(resolve(dir, nombre))

  return `${URL_SUBIDAS}/${nombre}`
}

/* Solo borra archivos de la carpeta de subidas. Las portadas que apuntan a
   /images/ (las que vinieron con el proyecto) o a un dominio externo no son
   nuestras y no se tocan. */
async function borrarImagen(raiz, url) {
  if (typeof url !== 'string' || !url.startsWith(URL_SUBIDAS + '/')) return
  const nombre = url.slice(URL_SUBIDAS.length + 1)
  if (nombre.includes('/') || nombre.includes('..')) return
  try {
    await unlink(resolve(raiz, CARPETA_SUBIDAS, nombre))
  } catch {
    /* Ya no estaba: no es un problema. */
  }
}

// ---------------------------------------------------------------------------
// Publicar
// ---------------------------------------------------------------------------

async function publicar(raiz) {
  const datos = await leerDatos(raiz)

  const salida = {
    generado: new Date().toISOString(),
    ajustes: datos.ajustes,
    proyectos: datos.proyectos.map((p) => ({
      id: p.id,
      name: p.name ?? '',
      type: p.type ?? '',
      image: p.image ?? '',
      url: p.url ?? '',
      size: p.size ?? 'normal',
      home: p.home !== false,
      label: p.label || null,
      blurred: Boolean(p.blurred),
      category: p.category ?? '',
      problem: p.problem ?? '',
      solution: p.solution ?? '',
      description: p.description ?? '',
      services: p.services ?? '',
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      beforeImage: p.beforeImage ?? '',
    })),
  }

  /* Los < y > se escapan como \u003c y \u003e para que un texto que contenga
     "</script>" no pueda cerrar la etiqueta y colar HTML en la página. */
  const json = JSON.stringify(salida).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')

  const fecha = new Date().toLocaleString('es-AR')
  const contenido =
    `/* Generado por el panel el ${fecha}.\n` +
    `   No editar a mano: se pisa entero en la próxima publicación. */\n` +
    `window.__LTWEB_DATOS__ = ${json};\n`

  const ruta = resolve(raiz, ARCHIVO_PUBLICADO)
  await mkdir(resolve(raiz, 'public/data'), { recursive: true })
  await writeFile(ruta, contenido, 'utf8')

  return salida.proyectos.length
}

// ---------------------------------------------------------------------------
// El plugin
// ---------------------------------------------------------------------------

export function panelPlugin() {
  return {
    name: 'ltweb-panel',
    /* Solo en desarrollo. En el build no existe: el sitio publicado no tiene
       —ni debe tener— ninguna forma de escribir. */
    apply: 'serve',

    configureServer(server) {
      const raiz = server.config.root

      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const ruta = url.pathname.replace(/\/+$/, '') || '/'
        const metodo = req.method

        try {
          // --- Leer todo ---
          if (ruta === '/proyectos' && metodo === 'GET') {
            return responder(res, 200, await leerDatos(raiz))
          }

          // --- Crear ---
          if (ruta === '/proyectos' && metodo === 'POST') {
            const cuerpo = await cuerpoJson(req)
            const datos = await leerDatos(raiz)
            const nuevo = {
              id: idLibre(datos.proyectos, cuerpo.name || 'nuevo proyecto'),
              name: cuerpo.name ?? 'NUEVO PROYECTO',
              type: cuerpo.type ?? 'LANDING PAGE',
              image: cuerpo.image ?? '',
              url: '', size: 'normal', home: true, label: null, blurred: false,
              category: '', problem: '', solution: '', description: '', services: '',
              gallery: [], beforeImage: '',
            }
            datos.proyectos.push(nuevo)
            await guardarDatos(raiz, datos)
            return responder(res, 200, nuevo)
          }

          // --- Ajustes ---
          if (ruta === '/ajustes' && metodo === 'PUT') {
            const cuerpo = await cuerpoJson(req)
            const datos = await leerDatos(raiz)
            datos.ajustes = { ...datos.ajustes, ...cuerpo }
            await guardarDatos(raiz, datos)
            return responder(res, 200, datos.ajustes)
          }

          // --- Publicar ---
          if (ruta === '/publicar' && metodo === 'POST') {
            const n = await publicar(raiz)
            return responder(res, 200, { publicados: n })
          }

          // --- Subir una imagen ---
          // Llega el binario crudo; el nombre lo pone el servidor.
          if (ruta === '/imagen' && metodo === 'POST') {
            const buffer = await cuerpoBinario(req)
            const urlImagen = await guardarImagen(raiz, buffer)
            return responder(res, 200, { url: urlImagen })
          }

          // --- Todo lo de un proyecto puntual ---
          const m = ruta.match(/^\/proyectos\/([^/]+)(\/[^/]+)?$/)
          if (m) {
            const id = decodeURIComponent(m[1])
            const sub = m[2]
            const datos = await leerDatos(raiz)
            const i = datos.proyectos.findIndex((p) => p.id === id)
            if (i === -1) return responder(res, 404, { error: 'No existe ese proyecto.' })
            const proyecto = datos.proyectos[i]

            if (!sub && metodo === 'PATCH') {
              const cuerpo = await cuerpoJson(req)
              /* Solo se copian los campos conocidos: aunque llegue algo de
                 más en el cuerpo, no puede escribir una propiedad que no
                 corresponde. */
              for (const campo of CAMPOS) {
                if (campo in cuerpo) proyecto[campo] = cuerpo[campo]
              }
              for (const campo of ['home', 'blurred']) {
                if (campo in cuerpo) proyecto[campo] = Boolean(cuerpo[campo])
              }
              await guardarDatos(raiz, datos)
              return responder(res, 200, proyecto)
            }

            if (!sub && metodo === 'DELETE') {
              await borrarImagen(raiz, proyecto.image)
              await borrarImagen(raiz, proyecto.beforeImage)
              for (const g of proyecto.gallery ?? []) await borrarImagen(raiz, g?.url ?? g)
              datos.proyectos.splice(i, 1)
              await guardarDatos(raiz, datos)
              return responder(res, 200, { ok: true })
            }

            if (sub === '/mover' && metodo === 'POST') {
              const { dir } = await cuerpoJson(req)
              const j = i + (dir < 0 ? -1 : 1)
              if (j >= 0 && j < datos.proyectos.length) {
                ;[datos.proyectos[i], datos.proyectos[j]] = [datos.proyectos[j], datos.proyectos[i]]
                await guardarDatos(raiz, datos)
              }
              return responder(res, 200, { ok: true })
            }

            /* Portada, "antes" y galería comparten el mismo camino: sube la
               imagen y guarda la ruta donde corresponda. */
            if (sub === '/portada' && metodo === 'POST') {
              const urlNueva = await guardarImagen(raiz, await cuerpoBinario(req))
              await borrarImagen(raiz, proyecto.image)
              proyecto.image = urlNueva
              await guardarDatos(raiz, datos)
              return responder(res, 200, { url: urlNueva })
            }

            if (sub === '/antes' && metodo === 'POST') {
              const urlNueva = await guardarImagen(raiz, await cuerpoBinario(req))
              await borrarImagen(raiz, proyecto.beforeImage)
              proyecto.beforeImage = urlNueva
              await guardarDatos(raiz, datos)
              return responder(res, 200, { url: urlNueva })
            }

            if (sub === '/antes' && metodo === 'DELETE') {
              await borrarImagen(raiz, proyecto.beforeImage)
              proyecto.beforeImage = ''
              await guardarDatos(raiz, datos)
              return responder(res, 200, { ok: true })
            }

            if (sub === '/galeria' && metodo === 'POST') {
              const urlNueva = await guardarImagen(raiz, await cuerpoBinario(req))
              proyecto.gallery = [...(proyecto.gallery ?? []), { url: urlNueva }]
              await guardarDatos(raiz, datos)
              return responder(res, 200, { url: urlNueva })
            }

            if (sub === '/galeria' && metodo === 'DELETE') {
              const indice = Number(url.searchParams.get('i'))
              const lista = proyecto.gallery ?? []
              if (Number.isInteger(indice) && lista[indice]) {
                await borrarImagen(raiz, lista[indice]?.url ?? lista[indice])
                lista.splice(indice, 1)
                await guardarDatos(raiz, datos)
              }
              return responder(res, 200, { ok: true })
            }
          }

          // --- Reemplazar todo (importar) ---
          if (ruta === '/importar' && metodo === 'POST') {
            const cuerpo = await cuerpoJson(req)
            const lista = cuerpo.proyectos ?? cuerpo.items ?? (Array.isArray(cuerpo) ? cuerpo : null)
            if (!Array.isArray(lista)) throw new Error('No se encontró la lista de proyectos.')
            const datos = await leerDatos(raiz)
            datos.proyectos = lista.map((p, n) => ({
              ...p,
              id: comoId(p.id || p.name || `proyecto-${n}`),
              home: p.home !== false,
              gallery: Array.isArray(p.gallery) ? p.gallery : [],
            }))
            if (cuerpo.ajustes) datos.ajustes = { ...datos.ajustes, ...cuerpo.ajustes }
            await guardarDatos(raiz, datos)
            return responder(res, 200, { importados: datos.proyectos.length })
          }

          next()
        } catch (err) {
          console.error('[panel]', err)
          responder(res, 400, { error: err.message })
        }
      })

      const puerto = server.config.server.port ?? 5173
      console.log(`\n  [panel]  http://localhost:${puerto}/admin  — sin Supabase, datos en ${ARCHIVO_DATOS}\n`)
    },
  }
}
