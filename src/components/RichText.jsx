/* Resalta palabras clave dentro de un texto plano.

   Los textos viven en content.js como strings comunes; marcar ahí una frase
   con **dobles asteriscos** evita tener que partir cada párrafo en JSX y
   deja el copy legible para editarlo. Se usa con moderación: una o dos
   frases por párrafo, si no el recurso pierde efecto. */
export default function RichText({ text, as: Tag = 'span', className = '', strongClassName = '' }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)

  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className={'font-semibold ' + strongClassName}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </Tag>
  )
}
