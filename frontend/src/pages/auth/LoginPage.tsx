import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useLogin } from '@/hooks/useAuth'
import type { AxiosError } from 'axios'
import { useLanguageStore } from '@/stores/language-store'

export default function LoginPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const [form, setForm] = useState({ email: '', password: '' })
  const [successMsg, setSuccessMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    login.mutate(form, {
      onSuccess: () => {
        setSuccessMsg(isFr ? 'Connexion réussie ! Redirection en cours...' : 'Login successful! Redirecting...')
      },
    })
  }

  const axiosError = login.error as AxiosError<{ message?: string }> | null
  const errorMessage = axiosError
    ? axiosError.response?.status === 401
      ? (isFr ? 'Email ou mot de passe incorrect. Veuillez réessayer.' : 'Incorrect email or password. Please try again.')
      : axiosError.response?.status === 422
        ? (isFr ? 'Veuillez remplir tous les champs correctement.' : 'Please fill in all fields correctly.')
        : axiosError.response?.data?.message || (isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.')
    : null

  return (
    <div className="py-20">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isFr ? 'Connexion' : 'Sign in'}</CardTitle>
            <CardDescription>{isFr ? 'Accédez à votre espace client' : 'Access your client dashboard'}</CardDescription>
          </CardHeader>
          <CardContent>
            {successMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                {successMsg}
              </div>
            )}

            {errorMessage && !successMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className={errorMessage ? 'border-red-400 focus:ring-red-500' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Mot de passe' : 'Password'}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className={errorMessage ? 'border-red-400 focus:ring-red-500 pr-11' : 'pr-11'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-300"
                    aria-label={showPassword ? (isFr ? 'Masquer le mot de passe' : 'Hide password') : (isFr ? 'Afficher le mot de passe' : 'Show password')}
                    title={showPassword ? (isFr ? 'Masquer le mot de passe' : 'Hide password') : (isFr ? 'Afficher le mot de passe' : 'Show password')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? (isFr ? 'Connexion...' : 'Signing in...') : (isFr ? 'Se connecter' : 'Sign in')} <LogIn className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isFr ? "Pas encore de compte ?" : "Don't have an account yet?"}{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:underline">
                {isFr ? "S'inscrire" : 'Sign up'}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
