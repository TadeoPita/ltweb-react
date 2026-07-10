import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* Réplica del ld_text_reveal del theme Hub:
   cuando el texto entra al viewport se "pinta" palabra por palabra de forma
   autónoma (no depende del avance del scroll), y al salir se despinta
   en reversa. Sutil y fluido. */
export default function TextReveal({
  text,
  className = '',
  dim = 0.12,
  as = 'p',
  stagger = 0.09,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const words = text.split(' ')
  const Tag = motion[as] ?? motion.p

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
        hidden: { transition: { staggerChildren: stagger * 0.6, staggerDirection: -1 } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: dim, transition: { duration: 0.4, ease: 'easeOut' } },
            visible: { opacity: 1, transition: { duration: 0.75, ease: 'easeOut' } },
          }}
        >
          {word + (i < words.length - 1 ? ' ' : '')}
        </motion.span>
      ))}
    </Tag>
  )
}
