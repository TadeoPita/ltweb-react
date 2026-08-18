import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

/* Firebase Auth pesa unos 130 KB y lo único que lo necesita es el panel.
   Como este provider envuelve toda la app, antes se descargaba en la primera
   visita a cualquier página. Ahora el módulo se pide recién cuando la ruta lo
   pide: en el sitio público no se baja nunca. La promesa se guarda para que
   varias llamadas compartan la misma carga. */
let firebasePromise
function loadFirebase() {
  firebasePromise ??= Promise.all([import('firebase/auth'), import('../lib/firebase')]).then(
    ([mod, { auth }]) => ({ ...mod, auth }),
  )
  return firebasePromise
}

export function AuthProvider({ children }) {
  const { pathname } = useLocation()
  const needsAuth = pathname.startsWith('/admin') || pathname.startsWith('/login')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fuera de /admin y /login no hay sesión que observar: cortamos el estado
    // de carga sin tocar Firebase.
    if (!needsAuth) {
      setLoading(false)
      return
    }

    let cancelled = false
    let unsubscribe = () => {}

    loadFirebase().then(({ onAuthStateChanged, auth }) => {
      if (cancelled) return
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setLoading(false)
      })
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [needsAuth])

  async function signIn(email, password) {
    setError(null)
    try {
      const { signInWithEmailAndPassword, auth } = await loadFirebase()
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err) {
      const errorMsg = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuario deshabilitado',
      }[err.code] || err.message

      setError(errorMsg)
      return false
    }
  }

  async function logout() {
    setError(null)
    try {
      const { signOut, auth } = await loadFirebase()
      await signOut(auth)
    } catch (err) {
      setError(err.message)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
