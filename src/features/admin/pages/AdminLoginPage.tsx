import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-headline-lg text-[200px] text-surface-container-highest/10 font-black select-none tracking-tighter">
          OK
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-surface-container px-3 py-1 mb-4">
            <span className="w-2 h-2 bg-primary-container"></span>
            <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
              RESTRICTED ACCESS // ADMIN ONLY
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface uppercase tracking-tighter">
            CONTROL MATRIX
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-xl">shield_lock</span>
            <span className="font-label-mono text-label-mono text-on-surface uppercase font-bold tracking-wider">
              // AUTENTICACIÓN SEGURA
            </span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">
              01 // EMAIL:
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@wantedlodge.com"
              required
              className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className="font-label-mono text-label-mono uppercase text-on-surface font-bold tracking-wider">
              02 // PASSWORD:
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              className="bg-surface-container font-label-mono text-body-sm px-4 py-3 text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary-container transition-all placeholder:text-secondary-container"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-container p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
              <span className="font-label-mono text-body-sm text-on-error-container">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-primary-container hover:bg-surface-bright text-on-primary-container hover:text-on-surface font-headline-sm text-headline-sm font-extrabold uppercase tracking-tight transition-all duration-200 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-2xl animate-spin">autorenew</span>
                <span>VERIFICANDO...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl">login</span>
                <span>INICIAR SESIÓN</span>
              </>
            )}
          </button>

          {/* Security note */}
          <div className="flex items-center gap-2 pt-2">
            <span className="material-symbols-outlined text-outline text-sm">encrypted</span>
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              CONEXIÓN CIFRADA 256-BIT // SESIÓN SEGURA
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
