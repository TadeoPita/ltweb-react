import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

/* Sesión del panel.
 *
 * Antes esto era Firebase Auth: 154 KB de SDK y una cuenta en un servicio
 * externo, para autenticar las escrituras contra Supabase. Sin Supabase, no
 * queda nada que justifique esa dependencia — el panel ahora escribe contra
 * nuestro propio servidor, así que la sesión también la lleva él.
 *
 * La sesión vive en una cookie httponly que pone el servidor. Este componente
 * nunca ve el identificador: solo pregunta "¿hay sesión?" y muestra una cosa u
 * otra. Que JavaScript no pueda leer la cookie es justamente el punto — si
 * algún día se cuela un XSS, no alcanza para robarse la sesión.
 */
export function AuthProvider({ children }) {
  const { pathname } = useLocation()
  const necesitaSesion = pathname.startsWith('/admin') || pathname.startsWith('/login')

  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    /* Fuera de /admin y /login no hay nada que consultar: se corta el estado de
       carga sin hacer ningún pedido. */
    if (!necesitaSesion) {
      setLoading(false)
      return
    }

    let cancelado = false

    fetch('/api/sesion')
      .then((r) => r.json())
      .then((d) => {
        if (cancelado) return
        /* pideClave en false es el modo desarrollo: el panel corre en tu
           máquina y entra directo. */
        setCurrentUser(d.activa ? { usuario: 'panel' } : null)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [necesitaSesion])

  async function signIn(usuario, clave) {
    setError(null)
    try {
      const res = await fetch('/api/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave }),
      })
      const d = await res.json()

      if (!res.ok) {
        setError(d.error || 'No se pudo entrar.')
        return false
      }

      setCurrentUser({ usuario })
      return true
    } catch {
      setError('No se pudo contactar al servidor.')
      return false
    }
  }

  async function logout() {
    setError(null)
    try {
      await fetch('/api/salir', { method: 'POST' })
    } catch {
      /* Si el pedido falla igual se cierra del lado del navegador. */
    }
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
