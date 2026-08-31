import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

/* Acceso al panel.
 *
 * Sin dependencias: Node ya trae scrypt, que es una función de derivación de
 * clave pensada justamente para esto. Es deliberadamente lenta y usa mucha
 * memoria, así que probar contraseñas a lo bruto sale carísimo. Guardar la
 * contraseña con SHA-256 a secas sería lo contrario: rapidísimo de calcular y
 * por lo tanto rapidísimo de romper.
 *
 * Las sesiones viven en memoria. Si el servidor se reinicia hay que volver a
 * entrar, lo cual para un panel que usa una persona es perfectamente
 * razonable y evita tener que persistir y limpiar sesiones.
 */

const DOS_HORAS = 2 * 60 * 60 * 1000
const INTENTOS_MAXIMOS = 8
const BLOQUEO_MS = 15 * 60 * 1000

const sesiones = new Map() // id -> { creada, vista }
const intentos = new Map() // ip -> [tiempos]

// ---------------------------------------------------------------------------
// Contraseña
// ---------------------------------------------------------------------------

/** Formato: scrypt$<sal en hex>$<hash en hex> */
export async function hashearClave(clave) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(clave, sal, 64)
  return `scrypt$${sal.toString('hex')}$${hash.toString('hex')}`
}

/* timingSafeEqual y no ===: compara en tiempo constante. Con === se puede
   deducir el hash byte por byte midiendo cuánto tarda en fallar. */
async function verificarClave(clave, guardado) {
  const partes = String(guardado ?? '').split('$')
  if (partes.length !== 3 || partes[0] !== 'scrypt') return false

  try {
    const sal = Buffer.from(partes[1], 'hex')
    const esperado = Buffer.from(partes[2], 'hex')
    const calculado = await scryptAsync(clave, sal, esperado.length)
    return timingSafeEqual(esperado, calculado)
  } catch {
    return false
  }
}

/* El hash sale de la variable de entorno o del archivo. La variable gana:
   en el hosting se carga desde el panel y así no queda escrita en ningún
   archivo del proyecto. */
async function claveGuardada(raiz) {
  if (process.env.PANEL_CLAVE_HASH) {
    return { usuario: process.env.PANEL_USUARIO || 'admin', hash: process.env.PANEL_CLAVE_HASH }
  }

  const ruta = resolve(raiz, 'datos/acceso.json')
  if (!existsSync(ruta)) return null

  try {
    const d = JSON.parse(await readFile(ruta, 'utf8'))
    return { usuario: d.usuario ?? 'admin', hash: d.hash }
  } catch {
    return null
  }
}

export async function hayClaveConfigurada(raiz) {
  return (await claveGuardada(raiz)) !== null
}

// ---------------------------------------------------------------------------
// Freno a la fuerza bruta
// ---------------------------------------------------------------------------

function estaBloqueado(ip) {
  const lista = (intentos.get(ip) ?? []).filter((t) => Date.now() - t < BLOQUEO_MS)
  intentos.set(ip, lista)
  return lista.length >= INTENTOS_MAXIMOS
}

function anotarFallo(ip) {
  const lista = intentos.get(ip) ?? []
  lista.push(Date.now())
  intentos.set(ip, lista)
}

// ---------------------------------------------------------------------------
// Sesiones
// ---------------------------------------------------------------------------

export async function entrar(raiz, ip, usuario, clave) {
  if (estaBloqueado(ip)) {
    return { ok: false, error: 'Demasiados intentos. Esperá 15 minutos.' }
  }

  const guardado = await claveGuardada(raiz)
  if (!guardado) {
    return { ok: false, error: 'No hay contraseña configurada. Corré: npm run clave' }
  }

  /* Se verifica la clave aunque el usuario no coincida, para que responder a
     un usuario inexistente lleve el mismo tiempo que a una clave equivocada.
     Si no, midiendo el tiempo se puede averiguar qué usuarios existen. */
  const claveOk = await verificarClave(clave, guardado.hash)
  if (!claveOk || usuario !== guardado.usuario) {
    anotarFallo(ip)
    return { ok: false, error: 'Usuario o contraseña incorrectos.' }
  }

  intentos.delete(ip)
  const id = randomBytes(32).toString('hex')
  sesiones.set(id, { creada: Date.now(), vista: Date.now() })
  return { ok: true, id }
}

export function salir(id) {
  sesiones.delete(id)
}

export function sesionValida(id) {
  const s = sesiones.get(id)
  if (!s) return false
  if (Date.now() - s.vista > DOS_HORAS) {
    sesiones.delete(id)
    return false
  }
  s.vista = Date.now()
  return true
}

// ---------------------------------------------------------------------------
// Cookie
// ---------------------------------------------------------------------------

const NOMBRE_COOKIE = 'ltweb_panel'

export function leerCookieSesion(req) {
  const crudo = req.headers.cookie
  if (!crudo) return null
  for (const parte of crudo.split(';')) {
    const [k, ...v] = parte.trim().split('=')
    if (k === NOMBRE_COOKIE) return v.join('=')
  }
  return null
}

/* httponly: JavaScript no la puede leer, así que un XSS no alcanza para
   robarse la sesión. SameSite=Strict: no viaja en pedidos que vengan de otro
   sitio, que es la primera defensa contra CSRF. Secure solo en producción,
   porque en localhost no hay HTTPS y la cookie no llegaría. */
export function cookieSesion(id, produccion) {
  const partes = [
    `${NOMBRE_COOKIE}=${id}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=' + DOS_HORAS / 1000,
  ]
  if (produccion) partes.push('Secure')
  return partes.join('; ')
}

export function cookieBorrada(produccion) {
  const partes = [`${NOMBRE_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0']
  if (produccion) partes.push('Secure')
  return partes.join('; ')
}

export function ipDe(req) {
  /* Detrás del proxy de Hostinger, REMOTE_ADDR es el proxy y no el visitante.
     El primer valor de X-Forwarded-For es la IP real. */
  const reenviada = req.headers['x-forwarded-for']
  if (typeof reenviada === 'string' && reenviada.length) {
    return reenviada.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'desconocida'
}
