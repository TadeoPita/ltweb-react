import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { currentUser, signIn, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Acceder - LTWEB Admin'
    if (currentUser) {
      navigate('/admin')
    }
    return () => {
      document.title = 'Diseño y Desarrollo Web En Argentina - LTWEB'
    }
  }, [currentUser, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    const success = await signIn(email, password)
    if (success) {
      navigate('/admin')
    } else {
      setError(authError || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-paper to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-black/8 p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <a href="/" className="inline-block mb-6">
              <img src="/images/logo-negro.png" alt="LT WEB" className="h-8 w-auto" />
            </a>
            <h1 className="font-display font-bold text-2xl text-ink mb-2">Acceder al Panel</h1>
            <p className="text-sm text-ink/60 font-body">Ingresa tus credenciales de administrador</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-body focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/10 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-body focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/10 transition-all"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3.5 text-sm text-red-700 font-body"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 rounded-lg bg-ink text-white font-semibold py-3 text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Accediendo...
                </span>
              ) : (
                'Acceder'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black/8">
            <p className="text-center text-xs text-ink/50 font-body">
              ¿Necesitas ayuda?{' '}
              <a href="https://wa.me/5491159532487" target="_blank" rel="noreferrer" className="text-ink hover:underline font-semibold">
                Contacta al equipo
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
