import { writeFile, mkdir } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { resolve } from 'node:path'
import { hashearClave } from '../servidor/lib/auth.js'

/* Define la contraseña del panel.
 *
 * Guarda solo el hash, nunca la contraseña. Aunque alguien se lleve el archivo
 * no puede leerla ni reusarla en otro lado.
 *
 * Uso:  npm run clave
 */

const rl = createInterface({ input: process.stdin, output: process.stdout })

const usuario = (await rl.question('Usuario (enter para "admin"): ')).trim() || 'admin'
const clave = (await rl.question('Contraseña (mínimo 12 caracteres): ')).trim()

if (clave.length < 12) {
  console.error('\n  Muy corta. Con doce caracteres o más, probarla a ciegas deja de ser viable.\n')
  rl.close()
  process.exit(1)
}

const repetir = (await rl.question('Repetir contraseña: ')).trim()
rl.close()

if (clave !== repetir) {
  console.error('\n  No coinciden.\n')
  process.exit(1)
}

const hash = await hashearClave(clave)
await mkdir(resolve('datos'), { recursive: true })
await writeFile(resolve('datos/acceso.json'), JSON.stringify({ usuario, hash }, null, 2), 'utf8')

console.log('\n  Listo. Guardado en datos/acceso.json')
console.log('\n  En el hosting conviene cargarlo como variable de entorno en vez de subir')
console.log('  el archivo. En hPanel, en la configuración de la app Node:')
console.log(`\n    PANEL_USUARIO=${usuario}`)
console.log(`    PANEL_CLAVE_HASH=${hash}\n`)
