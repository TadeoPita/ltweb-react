import { createWriteStream } from 'node:fs'
import { readdir, stat, readFile, rm } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { deflateRaw } from 'node:zlib'
import { promisify } from 'node:util'
import { crc32 } from 'node:zlib'

const comprimir = promisify(deflateRaw)

/* Arma ltweb-sitio.zip con el contenido de dist/.
 *
 * Se escribe el ZIP a mano en vez de sumar una dependencia: el formato tiene
 * dos partes (un encabezado por archivo y un índice al final) y para lo que
 * hace falta acá alcanza con eso. Una librería más en package.json para
 * generar un zip cada tanto no se justifica.
 *
 * Lo importante es que los archivos van en la RAIZ del zip, no dentro de una
 * carpeta "dist". Así se extrae directo en public_html y el sitio queda
 * andando, sin tener que mover nada de lugar.
 */

const SALIDA = 'ltweb-sitio.zip'

async function archivosDe(dir, base = dir) {
  const salida = []
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name)
    if (entrada.isDirectory()) {
      salida.push(...(await archivosDe(ruta, base)))
    } else {
      salida.push({ ruta, nombre: relative(base, ruta).split(sep).join('/') })
    }
  }
  return salida
}

function fechaDos(d = new Date()) {
  const hora = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff
  const fecha = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff
  return { hora, fecha }
}

async function main() {
  let archivos
  try {
    archivos = await archivosDe('dist')
  } catch {
    console.error('No existe dist/. Corré primero:  npm run build')
    process.exit(1)
  }

  await rm(SALIDA, { force: true })
  const salida = createWriteStream(SALIDA)
  const indice = []
  let offset = 0
  const { hora, fecha } = fechaDos()

  const escribir = (buf) =>
    new Promise((res) => {
      if (!salida.write(buf)) salida.once('drain', res)
      else res()
    })

  for (const a of archivos) {
    const crudo = await readFile(a.ruta)
    const comprimido = await comprimir(crudo)
    const suma = crc32(crudo)
    const nombre = Buffer.from(a.nombre, 'utf8')

    const cabecera = Buffer.alloc(30)
    cabecera.writeUInt32LE(0x04034b50, 0)
    cabecera.writeUInt16LE(20, 4) // versión necesaria
    cabecera.writeUInt16LE(0x800, 6) // nombres en UTF-8
    cabecera.writeUInt16LE(8, 8) // deflate
    cabecera.writeUInt16LE(hora, 10)
    cabecera.writeUInt16LE(fecha, 12)
    cabecera.writeUInt32LE(suma, 14)
    cabecera.writeUInt32LE(comprimido.length, 18)
    cabecera.writeUInt32LE(crudo.length, 22)
    cabecera.writeUInt16LE(nombre.length, 26)
    cabecera.writeUInt16LE(0, 28)

    await escribir(cabecera)
    await escribir(nombre)
    await escribir(comprimido)

    indice.push({ nombre, suma, comp: comprimido.length, crudo: crudo.length, offset })
    offset += 30 + nombre.length + comprimido.length
  }

  const inicioIndice = offset
  for (const e of indice) {
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0)
    c.writeUInt16LE(20, 4)
    c.writeUInt16LE(20, 6)
    c.writeUInt16LE(0x800, 8)
    c.writeUInt16LE(8, 10)
    c.writeUInt16LE(hora, 12)
    c.writeUInt16LE(fecha, 14)
    c.writeUInt32LE(e.suma, 16)
    c.writeUInt32LE(e.comp, 20)
    c.writeUInt32LE(e.crudo, 24)
    c.writeUInt16LE(e.nombre.length, 28)
    c.writeUInt32LE(e.offset, 42)
    await escribir(c)
    await escribir(e.nombre)
    offset += 46 + e.nombre.length
  }

  const fin = Buffer.alloc(22)
  fin.writeUInt32LE(0x06054b50, 0)
  fin.writeUInt16LE(indice.length, 8)
  fin.writeUInt16LE(indice.length, 10)
  fin.writeUInt32LE(offset - inicioIndice, 12)
  fin.writeUInt32LE(inicioIndice, 16)
  await escribir(fin)

  await new Promise((res) => salida.end(res))

  const { size } = await stat(SALIDA)
  console.log(`\n  ${SALIDA} — ${archivos.length} archivos, ${(size / 1024 / 1024).toFixed(2)} MB`)
  console.log('  Subilo a public_html y extraelo ahí.\n')
}

main()
