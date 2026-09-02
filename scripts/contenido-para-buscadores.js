import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/* Contenido legible para buscadores y asistentes de IA.
 *
 * EL PROBLEMA QUE RESUELVE
 *
 * Este sitio es una app de React: todo el contenido lo dibuja JavaScript. El
 * HTML que sale del servidor es, literalmente, un <div id="root"></div> vacío.
 * Medido sobre el sitio publicado: 50 caracteres de texto, o sea el título y
 * nada más.
 *
 * Google ejecuta JavaScript y llega a ver la página completa. Pero los
 * crawlers de los asistentes de IA en general NO lo ejecutan: piden el HTML,
 * leen lo que hay y se van. Con la página vacía, lo único que encontraban era
 * el título y los datos estructurados; el resto lo completaban con lo que
 * hubiera afuera (Instagram, restos del sitio anterior en WordPress). De ahí
 * que las descripciones de LTWEB salieran incompletas y con datos viejos.
 *
 * COMO LO RESUELVE
 *
 * En cada build se arma acá una versión en HTML plano del contenido real del
 * sitio —los mismos textos que ve el visitante, sacados de las mismas fuentes—
 * y se inyecta dentro de #root.
 *
 * Cuando React monta, createRoot() vacía ese contenedor y lo reemplaza por la
 * app. O sea: el visitante ve la aplicación de siempre, y quien no ejecuta
 * JavaScript lee el contenido. Es la misma información en los dos casos, que
 * es lo que diferencia esto de un cloaking: no se le muestra a los buscadores
 * nada que el usuario no vea.
 *
 * DE DONDE SALE EL TEXTO
 *
 * De content.js y de datos/semilla.json, las mismas fuentes que usa la app. No
 * hay una copia paralela que se pueda desincronizar: si cambia el contenido,
 * cambia esto en el próximo build.
 */

/** Escapa lo que se mete en el HTML. Los textos los escribe una persona. */
function esc(t) {
  return String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Los textos del sitio marcan énfasis con **dobles asteriscos**. */
function sinMarcas(t) {
  return String(t ?? '').replace(/\*\*/g, '')
}

async function leerProyectos(raiz) {
  /* La semilla es lo que viaja con el código. Lo que se cargue después desde
     el panel no está disponible en build time, y no hace falta: para que un
     buscador entienda a qué se dedica el estudio alcanza con la muestra. */
  const ruta = resolve(raiz, 'datos/semilla.json')
  if (!existsSync(ruta)) return []
  try {
    const d = JSON.parse(await readFile(ruta, 'utf8'))
    return Array.isArray(d.proyectos) ? d.proyectos : []
  } catch {
    return []
  }
}

export async function generarContenido(raiz) {
  const contenido = await import('../src/data/content.js')
  const { SERVICES, DIFFERENTIATORS, FAQS, STARTING_POINTS, EXTRA_CAPABILITIES, LOCATION } = contenido

  const proyectos = await leerProyectos(raiz)

  const servicios = SERVICES.map(
    (s) => `<article>
        <h3>${esc(s.title)}</h3>
        <p>${esc(sinMarcas(s.text))}</p>
        ${s.items?.length ? `<ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      </article>`,
  ).join('\n      ')

  const diferenciales = DIFFERENTIATORS.map(
    (d) => `<li><strong>${esc(d.title)}:</strong> ${esc(sinMarcas(d.text))}</li>`,
  ).join('\n        ')

  const situaciones = STARTING_POINTS.map(
    (p) => `<article>
        <h3>${esc(p.title)}</h3>
        <p>${esc(sinMarcas(p.text))}</p>
      </article>`,
  ).join('\n      ')

  const preguntas = FAQS.map(
    (f) => `<article>
        <h3>${esc(f.q)}</h3>
        <p>${esc(sinMarcas(f.a).replace(/<[^>]+>/g, ''))}</p>
      </article>`,
  ).join('\n      ')

  /* Solo los que tienen ficha escrita: los vacíos no aportan nada que leer y
     ya están fuera del índice por la misma razón. */
  const conFicha = proyectos.filter(
    (p) => (p.problem || '').trim() || (p.solution || '').trim() || (p.description || '').trim(),
  )

  const listaProyectos = conFicha
    .map(
      (p) => `<li>
          <a href="/proyecto/${esc(p.id)}">${esc(p.name)}</a>
          ${p.category ? ` — ${esc(p.category)}` : ''}
          ${p.solution ? `<p>${esc(sinMarcas(p.solution))}</p>` : ''}
        </li>`,
    )
    .join('\n        ')

  /* Estilo minimo, en linea.

     No es decorativo: en una conexion lenta el navegador puede pintar este
     bloque antes de que React alcance a reemplazarlo. Sin estilo eso seria un
     destello de texto negro sobre blanco, o sea el sitio pareciendo roto por
     un segundo. Con los colores de la marca, si llega a verse, parece la
     pagina cargando.

     Va en linea y no en la hoja de estilos porque la hoja se carga sin
     bloquear el render: cuando esto se pinta, puede no haber llegado todavia.

     Importante: se estiliza, NO se esconde. Ocultarlo con display:none seria
     mostrarle a los buscadores algo que el usuario no puede ver, y ademas
     Google le da menos peso al texto oculto. */
  const estilo = [
    'max-width:52rem',
    'margin:0 auto',
    'padding:4rem 1.5rem',
    'background:#08080a',
    'color:#f4f4f5',
    /* Sin comillas en los nombres de fuente: esto viaja adentro de un
       atributo style="" y una comilla de más lo cortaría a la mitad. */
    'font-family:system-ui,-apple-system,sans-serif',
    'line-height:1.6',
  ].join(';')

  return `<div id="contenido-inicial" style="${estilo}">
      <h1>LTWEB — Diseño y desarrollo web en ${esc(LOCATION)}</h1>
      <p>
        LTWEB es un <strong>equipo argentino de desarrollo web</strong> que
        trabaja con empresas, instituciones y profesionales. Desarrollamos
        <strong>webs empresariales</strong>, <strong>sistemas personalizados
        profesionales</strong> y tiendas online. Programamos a medida, no sobre
        plantillas: cada proyecto se construye sobre el negocio que tiene atrás.
      </p>
      <p>
        Como equipo cubrimos el proceso completo: arquitectura de contenido,
        diseño de interfaz, desarrollo, optimización de rendimiento y
        posicionamiento en buscadores. Desarrollamos además sistemas de gestión,
        paneles de administración e integraciones con las herramientas que cada
        empresa ya usa.
      </p>

      <h2>Qué hacemos</h2>
      ${servicios}
      <p>También trabajamos: ${EXTRA_CAPABILITIES.map(esc).join(', ')}.</p>

      <h2>Cómo trabajamos</h2>
      <ul>
        ${diferenciales}
      </ul>

      <h2>¿Por dónde empezamos?</h2>
      ${situaciones}

      ${
        listaProyectos
          ? `<h2>Proyectos</h2>
      <ul>
        ${listaProyectos}
      </ul>
      <p><a href="/portfolio">Ver el portfolio completo</a></p>`
          : ''
      }

      <h2>Preguntas frecuentes</h2>
      ${preguntas}

      <h2>Contacto</h2>
      <p>
        LTWEB — ${esc(LOCATION)}.
        Escribinos a <a href="mailto:${esc(contenido.CONTACT_EMAIL)}">${esc(contenido.CONTACT_EMAIL)}</a>
        o al ${esc(contenido.CONTACT_PHONE)}.
      </p>
    </div>`
}

/**
 * Plugin de Vite: pone el contenido en el HTML del build.
 *
 * VA DENTRO DE <noscript>, Y ESO SE PROBÓ POR LAS MALAS.
 *
 * La primera versión lo inyectaba adentro de #root, contando con que React lo
 * reemplazara al montar. En pruebas locales funcionaba: el JavaScript
 * terminaba de cargar en 253 ms y el primer pintado era a los 276 ms, así que
 * el bloque nunca llegaba a verse.
 *
 * En el sitio publicado no. Ahí el JavaScript son ~470 KB por una conexión
 * real, y el navegador pinta mucho antes de que React alcance a montar: el
 * visitante veía varios segundos de texto plano sobre fondo negro antes de que
 * apareciera el sitio. Parecía roto.
 *
 * Dentro de <noscript>, un navegador con JavaScript no lo dibuja nunca —cero
 * parpadeo— y sigue estando en el HTML crudo para cualquiera que lo lea sin
 * ejecutar nada, que es exactamente el caso de los crawlers de IA.
 *
 * Es además lo que <noscript> significa: esto es lo que se ve sin JavaScript.
 * No es esconder nada para mostrarle otra cosa a los buscadores.
 *
 * Solo en build. En desarrollo no hay ningún buscador leyendo.
 */
export function contenidoParaBuscadores() {
  return {
    name: 'ltweb-contenido-buscadores',
    apply: 'build',
    async transformIndexHtml(html) {
      try {
        const bloque = await generarContenido(process.cwd())
        const marcado = html.replace(
          '<div id="root"></div>',
          `<div id="root"></div>\n    <noscript>\n      ${bloque}\n    </noscript>`,
        )
        if (marcado === html) {
          console.warn('[buscadores] no se encontró <div id="root"></div>; no se inyectó nada')
        }
        return marcado
      } catch (err) {
        /* Que falle esto no puede romper el build: el sitio funciona igual,
           solo pierde el contenido para quien no ejecuta JavaScript. */
        console.error('[buscadores] no se pudo generar el contenido:', err.message)
        return html
      }
    },
  }
}
