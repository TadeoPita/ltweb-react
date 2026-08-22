/* Lectura pública de Supabase por HTTP, sin el SDK.

   El sitio público solo necesita leer dos tablas. Traer `@supabase/supabase-js`
   para eso costaba 213 KB, y como el cliente pide el token de Firebase en cada
   request (Third-Party Auth) se arrastraban otros ~130 KB de Firebase Auth: casi
   la mitad del JS de la primera visita, para dos SELECT que la API REST responde
   igual con la clave anónima.

   El SDK completo se sigue usando para escribir, subir archivos y escuchar
   cambios en vivo, pero se importa recién en /admin. Ver portfolioStore.js. */

const URL_BASE = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

/* Devuelve las filas de una tabla. `query` son parámetros de PostgREST
   (order, filtros, etc.). Lanza si la respuesta no es 2xx. */
export async function restSelect(table, query = '') {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=*${query}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
  })
  if (!res.ok) {
    throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`)
  }
  return res.json()
}
