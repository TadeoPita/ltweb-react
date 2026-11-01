function limpiar(t) {
  return String(t ?? '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function enFrase(t) {
  const s = limpiar(t).toLowerCase()
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

export function nombreProyecto(p) {
  const s = limpiar(p?.name)
  if (s && s === s.toLowerCase()) return s.replace(/(^|\s)(\p{L})/gu, (_, espacio, letra) => espacio + letra.toUpperCase())
  return s
}

export function proyectoConFicha(p) {
  return [p?.problem, p?.solution, p?.description].some((v) => limpiar(v))
}

export function tituloProyecto(p) {
  const tipo = enFrase(p?.type) || 'Sitio web'
  const rubro = limpiar(p?.category).split(',')[0].trim().toLowerCase()
  return `${nombreProyecto(p)} — ${tipo}${rubro ? ` para ${rubro}` : ''} | LTWEB`
}

export function descripcionProyecto(p) {
  const base = [p?.solution, p?.problem, p?.description].map(limpiar).find(Boolean)
  const texto = base || `${enFrase(p?.type) || 'Sitio web'} diseñado y desarrollado por LTWEB para ${nombreProyecto(p)}.`
  return texto.length <= 158 ? texto : texto.slice(0, 157).replace(/\s+\S*$/, '') + '…'
}
