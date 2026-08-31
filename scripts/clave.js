import { writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { randomBytes } from 'node:crypto'
import { hashearClave } from '../servidor/lib/auth.js'

/* Define o cambia el acceso al panel.
 *
 *   npm run clave          elegís vos el usuario y la contraseña
 *   npm run clave -- azar  la genera al azar (más segura, imposible de recordar)
 *
 * El resultado va a un archivo y NO a la pantalla, a propósito: lo que se
 * imprime en una terminal queda en su historial, y si esa ventana la ve otra
 * persona —o el texto termina pegado en un chat— la contraseña deja de ser
 * secreta.
 *
 * En el servidor solo se guarda el hash, que no se puede revertir. Por eso una
 * contraseña perdida no se recupera: se genera otra y listo.
 */

const ARCHIVO = 'MI-CLAVE-DEL-PANEL.txt'
const LARGO_MINIMO = 12

/* Alfabeto sin l, I, 1, O ni 0: son los que se confunden al leerlos. */
const ALFABETO = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const LARGO_AZAR = 24

/* randomBytes y no Math.random, que es predecible y no sirve para nada
   secreto. El módulo se toma sobre un rango múltiplo del alfabeto para que
   ningún carácter salga más seguido que otro. */
function claveAlAzar() {
  const limite = 256 - (256 % ALFABETO.length)
  let salida = ''
  while (salida.length < LARGO_AZAR) {
    for (const b of randomBytes(LARGO_AZAR * 2)) {
      if (b >= limite) continue
      salida += ALFABETO[b % ALFABETO.length]
      if (salida.length === LARGO_AZAR) break
    }
  }
  return salida
}

/* Se aceptan las tres formas porque npm se come los guiones: `npm run clave --
   azar` le llega al script como "azar" pelado, mientras que ejecutarlo directo
   con node deja "--azar". Exigir guiones hacía que la opción se ignorara en
   silencio y el script pidiera una contraseña que nadie quería escribir. */
const alAzar = process.argv.slice(2).some((a) => /^--?azar$/.test(a) || a === 'azar')

const rl = createInterface({ input: process.stdin, output: process.stdout })

const usuario = (await rl.question('Usuario (enter para "admin"): ')).trim() || 'admin'

if (!/^[a-zA-Z0-9._-]{3,64}$/.test(usuario)) {
  console.error('\n  El usuario admite letras, números, punto, guion y guion bajo (3 a 64).\n')
  rl.close()
  process.exit(1)
}

let clave

if (alAzar) {
  clave = claveAlAzar()
  console.log('\n  Contraseña generada al azar: 24 caracteres.')
} else {
  clave = (await rl.question(`Contraseña (mínimo ${LARGO_MINIMO} caracteres): `)).trim()

  if (clave.length < LARGO_MINIMO) {
    /* Doce y no ocho: con ocho, una contraseña sin símbolos se rompe por
       fuerza bruta en tiempo razonable aunque esté hasheada. */
    console.error(`\n  Muy corta. Con ${LARGO_MINIMO} o más, probarla a ciegas deja de ser viable.`)
    console.error('  Si no querés inventar una, corré:  npm run clave -- azar\n')
    rl.close()
    process.exit(1)
  }

  const repetir = (await rl.question('Repetir contraseña: ')).trim()
  if (clave !== repetir) {
    console.error('\n  No coinciden.\n')
    rl.close()
    process.exit(1)
  }
}

rl.close()

const hash = await hashearClave(clave)

await writeFile(
  ARCHIVO,
  `ACCESO AL PANEL DE LTWEB
========================

Entrás por:  https://ltweb.com.ar/admin

  Usuario:     ${usuario}
  Contraseña:  ${clave}

Guardala en tu gestor de contraseñas AHORA. No se puede recuperar: en el
servidor solo queda el hash, que no se puede revertir.


EN HOSTINGER
------------
hPanel -> tu app -> Variables de entorno. Son dos, una por fila.
Si ya existían, editá el valor en vez de agregarlas de nuevo:

  Clave: PANEL_USUARIO
  Valor: ${usuario}

  Clave: PANEL_CLAVE_HASH
  Valor: ${hash}

Después de guardarlas: Redistribuir.

El cambio tarda lo que tarde el despliegue. Al reiniciarse el servidor se
cierran todas las sesiones abiertas, así que si alguien había entrado con la
contraseña vieja, queda afuera.


CUANDO TERMINES
---------------
Borrá este archivo. La contraseña ya la tenés en el gestor y acá está en
texto plano.
`,
  'utf8',
)

console.log(`\n  Listo. Está todo en:  ${ARCHIVO}`)
console.log('  Abrilo, copiá los dos valores a Hostinger y después borralo.')
console.log('  (No se imprime acá a propósito: la terminal guarda historial.)\n')
