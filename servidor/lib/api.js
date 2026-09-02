import { readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { leerDatos, guardarDatos, publicar, idLibre, comoId } from './datos.js'
import { guardarImagen, borrarImagen } from './imagenes.js'
import { entrar, salir, sesionValida, leerCookieSesion, cookieSesion, cookieBorrada, ipDe, estadoDeLaClave } from './auth.js'

/* ¿carpeta cae dentro de raiz? Mismo criterio que servidor/index.js: comparar
   contra raiz + separador, no solo con startsWith(raiz), porque una carpeta
   hermana con el mismo prefijo ("app" y "app-datos") pasaría el chequeo. */
function dentroDe(raiz, carpeta) {
  const a = resolve(raiz)
  const b = resolve(carpeta)
  return b === a || b.startsWith(a + sep)
}

/* Las rutas del panel.
 *
 * Este módulo lo usan los dos lados: el plugin de Vite mientras se desarrolla
 * y el servidor de producción. Una sola implementación, así no se pueden ir
 * separando con el tiempo y terminar comportándose distinto en cada lado —que
 * es la peor clase de bug, porque anda en tu máquina y falla en el servidor.
 */

/* Solo estos campos se pueden escribir. Aunque llegue algo de más en el
   cuerpo, no puede tocar una propiedad que no corresponde. */
const CAMPOS = [
  'name', 'type', 'image', 'url', 'size', 'label', 'category',
  'problem', 'solution', 'description', 'services',
]

const LIMITE_IMAGEN = 25 * 1024 * 1024
const ERRORES_STORAGE = new Set(['EACCES', 'EPERM', 'EROFS', 'ENOSPC', 'ENOTDIR', 'EISDIR'])

let colaContenido = Promise.resolve()

function errorHttp(statusCode, mensaje) {
  const error = new Error(mensaje)
  error.statusCode = statusCode
  error.expose = true
  return error
}

function encolarContenido(tarea) {
  const actual = colaContenido.then(tarea, tarea)
  /* La cola tiene que continuar aunque un pedido falle. La promesa que se
     devuelve conserva el rechazo para que lo responda el catch de la API. */
  colaContenido = actual.catch(() => {})
  return actual
}

function mutaContenido(ruta, metodo) {
  return metodo !== 'GET' && ruta !== '/entrar' && ruta !== '/salir'
}

function respuestaDeError(err) {
  if (ERRORES_STORAGE.has(err?.code)) {
    return {
      codigo: err.code === 'ENOSPC' ? 507 : 500,
      error:
        err.code === 'ENOSPC'
          ? 'El servidor se quedó sin espacio para guardar los cambios.'
          : 'El servidor no puede escribir en el almacenamiento. Revisá STORAGE_DIR en Hostinger.',
    }
  }

  if (err instanceof SyntaxError) return { codigo: 400, error: 'El JSON enviado no es válido.' }
  if (err?.statusCode) {
    return {
      codigo: err.statusCode,
      error: err.expose ? err.message : 'Error interno del servidor.',
    }
  }
  return { codigo: 500, error: 'Error interno del servidor.' }
}

/* Comprueba de dónde viene un pedido que modifica algo.
 *
 * La cookie ya va con SameSite=Strict, que es la defensa principal contra que
 * otra página abierta en el mismo navegador mande formularios usando tu
 * sesión. Esto es la segunda capa, por dos motivos concretos: hay navegadores
 * viejos que no respetan SameSite, y basta un error de configuración futuro
 * para que esa bandera se pierda. Comprobar el origen no depende de ninguna de
 * las dos cosas.
 *
 * Un pedido sin Origin ni Referer se deja pasar a propósito: así los mandan
 * curl y las herramientas de línea de comandos, que no son un vector de CSRF
 * —el ataque necesita el navegador de la víctima, y el navegador siempre manda
 * uno de los dos. */
function origenValido(req) {
  const origen = req.headers.origin || req.headers.referer
  if (!origen) return true

  const host = req.headers.host
  if (!host) return false

  try {
    return new URL(origen).host === host
  } catch {
    return false
  }
}

function responder(res, codigo, datos, cabeceras = {}) {
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...cabeceras,
  })
  res.end(JSON.stringify(datos))
}

async function cuerpoJson(req) {
  const trozos = []
  let total = 0
  for await (const t of req) {
    total += t.length
    if (total > 2 * 1024 * 1024) throw errorHttp(413, 'El cuerpo del pedido es demasiado grande.')
    trozos.push(t)
  }
  const texto = Buffer.concat(trozos).toString('utf8')
  return texto ? JSON.parse(texto) : {}
}

async function cuerpoBinario(req) {
  const trozos = []
  let total = 0
  for await (const t of req) {
    total += t.length
    if (total > LIMITE_IMAGEN) throw errorHttp(413, 'La imagen supera los 25 MB.')
    trozos.push(t)
  }
  return Buffer.concat(trozos)
}

/**
 * Atiende un pedido a /api. Devuelve true si lo manejó.
 *
 * ctx = { raiz, raizPublica, rutas, produccion, pedirSesion }
 *
 * pedirSesion en false es para desarrollo: el panel corre en localhost contra
 * el propio Vite y pedir contraseña cada vez solo estorba. En producción va
 * en true y sin sesión no se escribe nada.
 */
export async function manejarApi(req, res, ctx) {
  const url = new URL(req.url, 'http://localhost')
  if (!url.pathname.startsWith('/api/') && url.pathname !== '/api') return false

  const ruta = url.pathname.replace(/^\/api/, '').replace(/\/+$/, '') || '/'
  const metodo = req.method

  if (mutaContenido(ruta, metodo)) {
    return encolarContenido(() => manejarApiInterna(req, res, ctx, url, ruta, metodo))
  }

  return manejarApiInterna(req, res, ctx, url, ruta, metodo)
}

async function manejarApiInterna(req, res, ctx, url, ruta, metodo) {
  const { raiz, raizPublica, rutas: r, produccion, pedirSesion } = ctx

  try {
    if (metodo !== 'GET' && !origenValido(req)) {
      return responder(res, 403, { error: 'Origen no permitido.' }), true
    }
    // -----------------------------------------------------------------------
    // Contenido publicado, público (sin sesión) — la usa el sitio entero.
    //
    // Vivía en /data/projects.js, servido como archivo estático desde index.js.
    // El problema: en Hostinger, cualquier ruta que coincide con un archivo
    // real en el disco la sirve el servidor web de la plataforma DIRECTO desde
    // ahí, sin pasar nunca por nuestro proceso Node. Como el build siempre deja
    // un dist/data/projects.js (la copia que vino con ese despliegue), esa era
    // la que se servía siempre — nunca lo último publicado desde el panel, sin
    // importar cuántas veces se publicara después.
    //
    // Se confirma comparando cabeceras: /api/sesion sale con las que pone
    // nuestro código (Cache-Control: no-store). /data/projects.js salía con
    // max-age=14400 y un Last-Modified que nuestro código nunca escribe —
    // cabeceras de un servidor de archivos, no las nuestras.
    //
    // /api/publicado.js no tiene ese problema porque nunca existe un archivo
    // en el disco con ese nombre: no hay nada que la plataforma pueda
    // interceptar, así que el pedido llega siempre a este código. -----------

    if (ruta === '/publicado.js' && metodo === 'GET') {
      let contenido
      try {
        contenido = await readFile(r.publicado, 'utf8')
      } catch {
        /* Todavía no se publicó nada. La página sigue andando igual: el
           front cae solo a /api/proyectos cuando este script no define
           window.__LTWEB_DATOS__. */
        contenido = '/* Todavía no se publicó nada desde el panel. */\n'
      }
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        /* Es justo lo contrario de lo que se cachearía por defecto: cada
           publicación tiene que verse al instante, no dentro de 4 horas. */
        'Cache-Control': 'no-cache, must-revalidate',
      })
      res.end(contenido)
      return true
    }

    // -----------------------------------------------------------------------
    // Acceso
    // -----------------------------------------------------------------------

    if (ruta === '/entrar' && metodo === 'POST') {
      const { usuario, clave } = await cuerpoJson(req)
      const resultado = await entrar(raiz, ipDe(req), String(usuario ?? ''), String(clave ?? ''))
      if (!resultado.ok) {
        return responder(res, 401, { error: resultado.error }), true
      }
      return responder(res, 200, { ok: true }, { 'Set-Cookie': cookieSesion(resultado.id, produccion) }), true
    }

    if (ruta === '/salir' && metodo === 'POST') {
      salir(leerCookieSesion(req))
      return responder(res, 200, { ok: true }, { 'Set-Cookie': cookieBorrada(produccion) }), true
    }

    if (ruta === '/sesion' && metodo === 'GET') {
      const clave = await estadoDeLaClave(raiz)
      return responder(res, 200, {
        activa: !pedirSesion || sesionValida(leerCookieSesion(req)),
        configurada: clave.configurada,
        /* completa en false significa que la variable llegó cortada. Suele ser
           la shell comiéndose lo que va después de un "$". Sin este dato, el
           sintoma era "usuario o contraseña incorrectos" sin ninguna pista. */
        completa: clave.completa,
        pideClave: pedirSesion,
      }), true
    }

    // -----------------------------------------------------------------------
    // De acá para abajo hace falta sesión, la lectura incluida.
    //
    // Leer también, aunque parezca de más: este archivo no es lo publicado
    // sino el borrador. Un proyecto a medio cargar, con el nombre de un
    // cliente que todavía no salió al aire, estaba a la vista de cualquiera
    // que pidiera /api/proyectos. El sitio no lo necesita —lee
    // data/projects.js, que es estático—, así que cerrarlo no cuesta nada.
    // -----------------------------------------------------------------------

    if (pedirSesion && !sesionValida(leerCookieSesion(req))) {
      return responder(res, 401, { error: 'Sesión vencida. Volvé a entrar.' }), true
    }

    if (ruta === '/proyectos' && metodo === 'GET') {
      return responder(res, 200, await leerDatos(r)), true
    }

    /* Diagnóstico del almacenamiento.
     *
     * Existe porque el síntoma "cargo un proyecto y no queda guardado" no se
     * puede depurar mirando el sitio: hay que saber DÓNDE está escribiendo el
     * servidor, y eso no se ve desde afuera. Sin acceso SSH a Hostinger, esta
     * es la única forma de confirmar si carpetaDatos cayó dentro de la carpeta
     * que el despliegue reemplaza.
     *
     * Pide sesión como todo lo de acá abajo: revela una ruta del servidor y
     * cuántos proyectos hay, que no es para cualquiera. */
    if (ruta === '/diagnostico' && metodo === 'GET') {
      let proyectos = null
      let publicadoExiste = false
      try {
        proyectos = (await leerDatos(r)).proyectos.length
      } catch {
        /* Si leerDatos falla, el resto del diagnóstico igual sirve. */
      }
      try {
        await stat(r.publicado)
        publicadoExiste = true
      } catch {
        /* No se publicó todavía, o el archivo no está donde se lo busca. */
      }
      return responder(res, 200, {
        carpetaDatos: r.carpetaDatos,
        dentroDelDespliegue: dentroDe(raiz, r.carpetaDatos),
        proyectosGuardados: proyectos,
        rutaPublicado: r.publicado,
        publicadoExiste,
      }), true
    }

    if (ruta === '/proyectos' && metodo === 'POST') {
      const cuerpo = await cuerpoJson(req)
      const datos = await leerDatos(r)
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
      await guardarDatos(r, datos)
      return responder(res, 200, nuevo), true
    }

    if (ruta === '/ajustes' && metodo === 'PUT') {
      const cuerpo = await cuerpoJson(req)
      const datos = await leerDatos(r)
      datos.ajustes = { ...datos.ajustes, ...cuerpo }
      await guardarDatos(r, datos)
      return responder(res, 200, datos.ajustes), true
    }

    if (ruta === '/publicar' && metodo === 'POST') {
      return responder(res, 200, { publicados: await publicar(r) }), true
    }

    if (ruta === '/importar' && metodo === 'POST') {
      const cuerpo = await cuerpoJson(req)
      const lista = cuerpo.proyectos ?? cuerpo.items ?? (Array.isArray(cuerpo) ? cuerpo : null)
      if (!Array.isArray(lista)) throw errorHttp(400, 'No se encontró la lista de proyectos.')
      const datos = await leerDatos(r)
      datos.proyectos = lista.map((p, n) => ({
        ...p,
        id: comoId(p.id || p.name || `proyecto-${n}`),
        home: p.home !== false,
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
      }))
      if (cuerpo.ajustes) datos.ajustes = { ...datos.ajustes, ...cuerpo.ajustes }
      await guardarDatos(r, datos)
      return responder(res, 200, { importados: datos.proyectos.length }), true
    }

    // -----------------------------------------------------------------------
    // Un proyecto puntual
    // -----------------------------------------------------------------------

    const m = ruta.match(/^\/proyectos\/([^/]+)(\/[^/]+)?$/)
    if (m) {
      const id = decodeURIComponent(m[1])
      const sub = m[2]
      const datos = await leerDatos(r)
      const i = datos.proyectos.findIndex((p) => p.id === id)
      if (i === -1) return responder(res, 404, { error: 'No existe ese proyecto.' }), true
      const proyecto = datos.proyectos[i]

      if (!sub && metodo === 'PATCH') {
        const cuerpo = await cuerpoJson(req)
        for (const campo of CAMPOS) if (campo in cuerpo) proyecto[campo] = cuerpo[campo]
        for (const campo of ['home', 'blurred']) {
          if (campo in cuerpo) proyecto[campo] = Boolean(cuerpo[campo])
        }
        await guardarDatos(r, datos)
        return responder(res, 200, proyecto), true
      }

      if (!sub && metodo === 'DELETE') {
        const imagenes = [
          proyecto.image,
          proyecto.beforeImage,
          ...(proyecto.gallery ?? []).map((g) => g?.url ?? g),
        ]
        datos.proyectos.splice(i, 1)
        await guardarDatos(r, datos)
        for (const imagen of imagenes) await borrarImagen(raizPublica, imagen)
        return responder(res, 200, { ok: true }), true
      }

      if (sub === '/mover' && metodo === 'POST') {
        const { dir } = await cuerpoJson(req)
        const j = i + (dir < 0 ? -1 : 1)
        if (j >= 0 && j < datos.proyectos.length) {
          ;[datos.proyectos[i], datos.proyectos[j]] = [datos.proyectos[j], datos.proyectos[i]]
          await guardarDatos(r, datos)
        }
        return responder(res, 200, { ok: true }), true
      }

      if (sub === '/portada' && metodo === 'POST') {
        const urlNueva = await guardarImagen(raizPublica, await cuerpoBinario(req))
        const anterior = proyecto.image
        proyecto.image = urlNueva
        try {
          await guardarDatos(r, datos)
        } catch (err) {
          await borrarImagen(raizPublica, urlNueva)
          throw err
        }
        await borrarImagen(raizPublica, anterior)
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/antes' && metodo === 'POST') {
        const urlNueva = await guardarImagen(raizPublica, await cuerpoBinario(req))
        const anterior = proyecto.beforeImage
        proyecto.beforeImage = urlNueva
        try {
          await guardarDatos(r, datos)
        } catch (err) {
          await borrarImagen(raizPublica, urlNueva)
          throw err
        }
        await borrarImagen(raizPublica, anterior)
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/antes' && metodo === 'DELETE') {
        const anterior = proyecto.beforeImage
        proyecto.beforeImage = ''
        await guardarDatos(r, datos)
        await borrarImagen(raizPublica, anterior)
        return responder(res, 200, { ok: true }), true
      }

      if (sub === '/galeria' && metodo === 'POST') {
        const urlNueva = await guardarImagen(raizPublica, await cuerpoBinario(req))
        proyecto.gallery = [...(proyecto.gallery ?? []), { url: urlNueva }]
        try {
          await guardarDatos(r, datos)
        } catch (err) {
          await borrarImagen(raizPublica, urlNueva)
          throw err
        }
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/galeria' && metodo === 'DELETE') {
        const indice = Number(url.searchParams.get('i'))
        const lista = proyecto.gallery ?? []
        if (Number.isInteger(indice) && lista[indice]) {
          const anterior = lista[indice]?.url ?? lista[indice]
          lista.splice(indice, 1)
          await guardarDatos(r, datos)
          await borrarImagen(raizPublica, anterior)
        }
        return responder(res, 200, { ok: true }), true
      }
    }

    responder(res, 404, { error: 'Ruta desconocida: ' + ruta })
    return true
  } catch (err) {
    console.error('[api]', err)
    const respuesta = respuestaDeError(err)
    responder(res, respuesta.codigo, { error: respuesta.error })
    return true
  }
}
