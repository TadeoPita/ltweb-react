import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* Párrafo con palabras clave que se "descifran" al pasar el cursor.

   Adaptado al lenguaje del sitio: nada de monoespaciada, pastillas negras ni
   puntitos de colores. Las palabras clave ya se ven en negrita como el resto
   de los destacados; al apuntarlas se revuelven un instante, se subrayan en
   lila y el resto del párrafo baja de opacidad para que el ojo vaya ahí.

   El texto revuelto se dibuja encima de una copia invisible de la palabra
   original, así el ancho nunca cambia y el párrafo no salta mientras corre
   la animación. */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const STEP_MS = 28
const CYCLES_PER_LETTER = 2

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function Keyword({ word, dimmed, onEnter, onLeave }) {
  const [display, setDisplay] = useState(word)
  const [hovered, setHovered] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  const scramble = useCallback(() => {
    if (prefersReducedMotion()) return
    let pos = 0
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setDisplay(
        word
          .split('')
          .map((char, i) => {
            // Las letras se van fijando de izquierda a derecha; los signos
            // de puntuación nunca se revuelven.
            if (pos / CYCLES_PER_LETTER > i) return char
            if (!/[a-záéíóúñ]/i.test(char)) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )
      pos++
      if (pos >= word.length * CYCLES_PER_LETTER) {
        clearInterval(timer.current)
        setDisplay(word)
      }
    }, STEP_MS)
  }, [word])

  function enter() {
    setHovered(true)
    onEnter()
    scramble()
  }

  function leave() {
    setHovered(false)
    onLeave()
    clearInterval(timer.current)
    setDisplay(word)
  }

  return (
    <motion.span
      onMouseEnter={enter}
      onMouseLeave={leave}
      animate={{ y: hovered ? -2 : 0, opacity: dimmed && !hovered ? 0.35 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="relative inline-block cursor-default font-semibold text-ink"
    >
      {/* Copia invisible: fija el ancho para que no salte el párrafo */}
      <span aria-hidden className="invisible">
        {word}
      </span>
      <span className="absolute inset-0 whitespace-pre">{display}</span>
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

export default function ScrambleText({ text, highlight = [], className = '', as: Tag = 'p' }) {
  const [anyHovered, setAnyHovered] = useState(false)
  const norm = (w) => w.toLowerCase().replace(/[^0-9a-záéíóúüñ]/gi, '')
  const keys = highlight.map(norm)

  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, i) => {
        const isKey = keys.includes(norm(word))
        return (
          <span key={i}>
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
