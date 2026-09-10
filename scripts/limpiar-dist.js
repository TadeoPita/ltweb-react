import { rmSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const destino = resolve(process.cwd(), 'dist')

if (existsSync(destino)) {
  rmSync(destino, { recursive: true, force: true })
  console.log('[limpiar] dist borrado antes de construir')
}
