import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/* Link de React Router con las props de animación de Framer Motion.
   Se usa en las cards del portfolio para navegar a /proyecto/:id sin
   recargar la página, manteniendo las transiciones. */
const MotionLink = motion.create(Link)

export default MotionLink

/* Ruta de la ficha de un proyecto. Centralizado acá para que las cinco
   variantes del portfolio construyan la URL igual. */
export function projectPath(project) {
  return `/proyecto/${project.id}`
}
