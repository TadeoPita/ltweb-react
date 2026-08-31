import { leerDatos, guardarDatos, publicar, idLibre, comoId } from './datos.js'
import { guardarImagen, borrarImagen } from './imagenes.js'
import { entrar, salir, sesionValida, leerCookieSesion, cookieSesion, cookieBorrada, ipDe, hayClaveConfigurada } from './auth.js'

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
  'name', 'type', 'url', 'size', 'label', 'category',
  'problem', 'solution', 'description', 'services',
]

const LIMITE_IMAGEN = 25 * 1024 * 1024

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
    if (total > 2 * 1024 * 1024) throw new Error('El cuerpo del pedido es demasiado grande.')
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
    if (total > LIMITE_IMAGEN) throw new Error('La imagen supera los 25 MB.')
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
  const { raiz, raizPublica, rutas: r, produccion, pedirSesion } = ctx

  try {
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
      return responder(res, 200, {
        activa: !pedirSesion || sesionValida(leerCookieSesion(req)),
        configurada: await hayClaveConfigurada(raiz),
        pideClave: pedirSesion,
      }), true
    }

    // -----------------------------------------------------------------------
    // Lectura: abierta. Es el mismo contenido que ya está publicado.
    // -----------------------------------------------------------------------

    if (ruta === '/proyectos' && metodo === 'GET') {
      return responder(res, 200, await leerDatos(r)), true
    }

    // -----------------------------------------------------------------------
    // De acá para abajo hace falta sesión.
    // -----------------------------------------------------------------------

    if (pedirSesion && !sesionValida(leerCookieSesion(req))) {
      return responder(res, 401, { error: 'Sesión vencida. Volvé a entrar.' }), true
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
      if (!Array.isArray(lista)) throw new Error('No se encontró la lista de proyectos.')
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
        await borrarImagen(raizPublica, proyecto.image)
        await borrarImagen(raizPublica, proyecto.beforeImage)
        for (const g of proyecto.gallery ?? []) await borrarImagen(raizPublica, g?.url ?? g)
        datos.proyectos.splice(i, 1)
        await guardarDatos(r, datos)
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
        await borrarImagen(raizPublica, proyecto.image)
        proyecto.image = urlNueva
        await guardarDatos(r, datos)
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/antes' && metodo === 'POST') {
        const urlNueva = await guardarImagen(raizPublica, await cuerpoBinario(req))
        await borrarImagen(raizPublica, proyecto.beforeImage)
        proyecto.beforeImage = urlNueva
        await guardarDatos(r, datos)
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/antes' && metodo === 'DELETE') {
        await borrarImagen(raizPublica, proyecto.beforeImage)
        proyecto.beforeImage = ''
        await guardarDatos(r, datos)
        return responder(res, 200, { ok: true }), true
      }

      if (sub === '/galeria' && metodo === 'POST') {
        const urlNueva = await guardarImagen(raizPublica, await cuerpoBinario(req))
        proyecto.gallery = [...(proyecto.gallery ?? []), { url: urlNueva }]
        await guardarDatos(r, datos)
        return responder(res, 200, { url: urlNueva }), true
      }

      if (sub === '/galeria' && metodo === 'DELETE') {
        const indice = Number(url.searchParams.get('i'))
        const lista = proyecto.gallery ?? []
        if (Number.isInteger(indice) && lista[indice]) {
          await borrarImagen(raizPublica, lista[indice]?.url ?? lista[indice])
          lista.splice(indice, 1)
          await guardarDatos(r, datos)
        }
        return responder(res, 200, { ok: true }), true
      }
    }

    responder(res, 404, { error: 'Ruta desconocida: ' + ruta })
    return true
  } catch (err) {
    console.error('[api]', err)
    responder(res, 400, { error: err.message })
    return true
  }
}
