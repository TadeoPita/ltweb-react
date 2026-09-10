export function limpiarHtml() {
  return {
    name: 'ltweb-limpiar-html',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      let quitados = 0
      const limpio = html.replace(/[ \t]*<!--(?!\[if)[\s\S]*?-->[ \t]*\n?/g, (m) => {
        quitados += 1
        return ''
      })
      if (quitados) console.log(`[html] ${quitados} comentarios quitados del HTML publicado`)
      return limpio
    },
  }
}
