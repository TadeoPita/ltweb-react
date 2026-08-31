import { readFile, writeFile, mkdir, rename, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/* Persistencia del contenido.
 *
 * Reemplaza a Supabase. Los proyectos viven en datos/proyectos.json, un
 * archivo del servidor, y no en una base en la nube. Para el volumen que
 * maneja esto —decenas de proyectos, una persona editando— una base de datos
 * es infraestructura de más: un archivo se lee entero en un milisegundo, se
 * versiona con git, se respalda copiándolo y no tiene plan gratis que se pueda
 * terminar.
 *
 * El archivo NUNCA lo lee el visitante. Lo lee el panel. Lo que ve el sitio es
 * data/projects.js, que se genera al publicar.
 */

const AJUSTES_POR_DEFECTO = { variant: 'gallery', pageVariant: 'classic', heroVariant: 'centered' }

/* Dónde se guarda el contenido.
 *
 * Por defecto va en <app>/datos, pero se puede mover con la variable de
 * entorno DATOS_DIR, y esa opción existe por una razón concreta:
 *
 * Algunos hostings hacen un clon limpio del repositorio en cada despliegue.
 * Si lo hacen, cualquier archivo escrito en tiempo de ejecución —o sea todo lo
 * que cargues desde el panel— desaparece al desplegar. Apuntando DATOS_DIR a
 * una carpeta FUERA del directorio de la app, el contenido queda a salvo pase
 * lo que pase, porque el despliegue ni la toca.
 *
 * Se puede comprobar en dos minutos: cargá un proyecto, desplegá, y fijate si
 * sigue. Si no está, poné DATOS_DIR y listo. */
function carpetaDeDatos(raiz) {
  return process.env.DATOS_DIR ? resolve(process.env.DATOS_DIR) : resolve(raiz, 'datos')
}

export function rutas(raiz) {
  const carpeta = carpetaDeDatos(raiz)
  return {
    datos: resolve(carpeta, 'proyectos.json'),
    /* La semilla se busca siempre en la app, no en DATOS_DIR: viaja con el
       codigo y es de solo lectura. */
    semilla: resolve(raiz, 'datos/semilla.json'),
    carpetaDatos: carpeta,
    publicado: resolve(raiz, 'public/data/projects.js'),
    carpetaPublicado: resolve(raiz, 'public/data'),
  }
}

/* En producción el sitio ya está construido, así que publicar tiene que
   escribir dentro de dist/ y no de public/, que ahí no lo lee nadie. */
export function rutasProduccion(raiz) {
  const carpeta = carpetaDeDatos(raiz)
  return {
    datos: resolve(carpeta, 'proyectos.json'),
    semilla: resolve(raiz, 'datos/semilla.json'),
    carpetaDatos: carpeta,
    publicado: resolve(raiz, 'dist/data/projects.js'),
    carpetaPublicado: resolve(raiz, 'dist/data'),
  }
}

/* La semilla y el archivo de trabajo son dos cosas distintas, y la diferencia
   es la que evita perder contenido.
 *
 * datos/semilla.json viaja en el repositorio: es el punto de partida, los
 * proyectos que ya estaban cargados. datos/proyectos.json es con lo que
 * trabaja el panel, y NO esta versionado.
 *
 * Si estuvieran en el mismo archivo, cada despliegue clonaria el repositorio
 * encima y se llevaria puesto todo lo cargado desde el panel desde el
 * despliegue anterior. Asi, la semilla solo se usa cuando todavia no hay nada.
 */
export async function leerDatos(r) {
  if (!existsSync(r.datos)) {
    if (r.semilla && existsSync(r.semilla)) {
      try {
        const crudo = JSON.parse(await readFile(r.semilla, 'utf8'))
        const inicial = {
          ajustes: { ...AJUSTES_POR_DEFECTO, ...(crudo.ajustes ?? {}) },
          proyectos: Array.isArray(crudo.proyectos) ? crudo.proyectos : [],
        }
        await guardarDatos(r, inicial)
        console.log(`[datos] primer arranque: sembrados ${inicial.proyectos.length} proyectos`)
        return inicial
      } catch (err) {
        console.error('[datos] semilla ilegible:', err.message)
      }
    }
    return { ajustes: { ...AJUSTES_POR_DEFECTO }, proyectos: [] }
  }
  try {
    const crudo = JSON.parse(await readFile(r.datos, 'utf8'))
    return {
      ajustes: { ...AJUSTES_POR_DEFECTO, ...(crudo.ajustes ?? {}) },
      proyectos: Array.isArray(crudo.proyectos) ? crudo.proyectos : [],
    }
  } catch (err) {
    console.error('[datos] proyectos.json ilegible:', err.message)
    return { ajustes: { ...AJUSTES_POR_DEFECTO }, proyectos: [] }
  }
}

export async function guardarDatos(r, datos) {
  await mkdir(r.carpetaDatos, { recursive: true })

  /* Antes de pisar el archivo se guarda la version anterior.
  
     Son tres copias rotativas: respaldo-1 es la mas reciente. Ocupan unos
     pocos KB cada una y cubren el caso de "borre un proyecto sin querer" o
     "importe un JSON equivocado y se fue todo", que con un solo archivo no
     tiene vuelta atras. */
  if (existsSync(r.datos)) {
    try {
      for (let i = 3; i > 1; i--) {
        const viejo = resolve(r.carpetaDatos, `respaldo-${i - 1}.json`)
        if (existsSync(viejo)) await copyFile(viejo, resolve(r.carpetaDatos, `respaldo-${i}.json`))
      }
      await copyFile(r.datos, resolve(r.carpetaDatos, 'respaldo-1.json'))
    } catch (err) {
      /* Que falle el respaldo no puede impedir guardar. */
      console.error('[datos] no se pudo respaldar:', err.message)
    }
  }

  /* Se escribe en un temporal y recien al final se renombra. rename dentro del
     mismo disco es atomico: o queda el archivo viejo entero o el nuevo entero,
     nunca la mitad de cada uno. */
  const tmp = r.datos + '.tmp'
  await writeFile(tmp, JSON.stringify(datos, null, 2), 'utf8')
  await rename(tmp, r.datos)
}

/* Convierte un texto en algo que sirva como URL: /proyecto/lo-que-sea.
   Los puntos y las barras importan especialmente: un id como "../algo" no
   sería una ficha sino una ruta hacia otro lado. */
export function comoId(texto) {
  const base = String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return base || 'proyecto-' + Math.random().toString(36).slice(2, 8)
}

export function idLibre(proyectos, base) {
  const id = comoId(base)
  if (!proyectos.some((p) => p.id === id)) return id
  let n = 2
  while (proyectos.some((p) => p.id === `${id}-${n}`)) n++
  return `${id}-${n}`
}

/* Escribe el archivo que lee el sitio.
 *
 * Sale como .js y no como .json para que entre con una etiqueta <script> en el
 * <head>: así los proyectos ya están en memoria cuando React arranca, y no hay
 * pedido de red, ni pantalla de carga, ni salto de maqueta. Con JSON habría
 * que ir a buscarlo después de que la página cargó, que es exactamente lo que
 * hacía la versión con Supabase. */
export async function publicar(r) {
  const datos = await leerDatos(r)

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

  /* < y > salen escapados para que un texto que contenga "</script>" no pueda
     cerrar la etiqueta y colar HTML en la página. */
  const json = JSON.stringify(salida).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')

  const contenido =
    `/* Generado por el panel el ${new Date().toLocaleString('es-AR')}.\n` +
    `   No editar a mano: se pisa entero en la próxima publicación. */\n` +
    `window.__LTWEB_DATOS__ = ${json};\n`

  await mkdir(r.carpetaPublicado, { recursive: true })
  const tmp = r.publicado + '.tmp'
  await writeFile(tmp, contenido, 'utf8')
  await rename(tmp, r.publicado)

  return salida.proyectos.length
}
