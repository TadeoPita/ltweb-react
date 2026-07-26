import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../lib/motion'

/* Párrafo con palabras clave que se vuelven a escribir al pasar el cursor.

   Las letras son siempre las correctas: no se reemplazan por caracteres
   raros. Lo que se anima es el foco — cada letra entra desenfocada y se
   asienta, una detrás de otra, con el mismo lenguaje de blur que usa el
   resto del sitio. Mientras tanto el resto del párrafo baja de opacidad y
   aparece un subrayado lila.

   Como los caracteres nunca cambian, el ancho es estable y no hace falta
   ninguna copia fantasma para evitar saltos de layout. */

function Keyword({ word, dimmed, onEnter, onLeave }) {
  const [hovered, setHovered] = useState(false)
  // Cada hover incrementa el contador: al cambiar la key, las letras se
  // vuelven a montar y la animación se reproduce de nuevo.
  const [run, setRun] = useState(0)

  function enter() {
    setHovered(true)
    setRun((n) => n + 1)
    onEnter()
  }

  function leave() {
    setHovered(false)
    onLeave()
  }

  return (
    <motion.span
      onMouseEnter={enter}
      onMouseLeave={leave}
      animate={{ y: hovered ? -2 : 0, opacity: dimmed && !hovered ? 0.35 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="relative inline-block cursor-default font-semibold text-ink"
    >
      <span key={run} className="inline-block">
        {word.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={run === 0 ? false : { filter: 'blur(7px)', opacity: 0.25 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.45, delay: i * 0.035, ease: EASE }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </span>
      {/* Subrayado lila que crece de izquierda a derecha */}
      <span
        aria-hidden
        className={
          'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-lilac transition-transform duration-400 ease-out ' +
          (hovered ? 'scale-x-100' : 'scale-x-0')
        }
      />
    </motion.span>
  )
}

export default function RevealText({ text, highlight = [], className = '', as: Tag = 'p' }) {
  const [anyHovered, setAnyHovered] = useState(false)
  const norm = (w) => w.toLowerCase().replace(/[^0-9a-záéíóúüñ]/gi, '')
  const keys = highlight.map(norm)

  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, i) => {
        const isKey = keys.includes(norm(word))
        return (
          <span key={i} aria-hidden>
            {isKey ? (
              <Keyword
                word={word}
                dimmed={anyHovered}
                onEnter={() => setAnyHovered(true)}
                onLeave={() => setAnyHovered(false)}
              />
            ) : (
              <motion.span
                animate={{ opacity: anyHovered ? 0.4 : 1 }}
                transition={{ duration: 0.35 }}
                className="inline-block"
              >
                {word}
              </motion.span>
            )}{' '}
          </span>
        )
      })}
    </Tag>
  )
}
