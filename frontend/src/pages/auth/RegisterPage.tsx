import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, CheckCircle2, AlertCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRegister } from '@/hooks/useAuth'
import type { AxiosError } from 'axios'
import { useLanguageStore } from '@/stores/language-store'

export default function RegisterPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' })
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const register = useRegister()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate(form, {
      onSuccess: () => {
        setShowSuccessScreen(true)
      },
    })
  }

  const axiosError = register.error as AxiosError<{ message?: string; errors?: Record<string, string[]> }> | null
  const fieldErrors = axiosError?.response?.data?.errors
  const generalError = axiosError
    ? axiosError.response?.status === 422
      ? (isFr ? 'Veuillez corriger les erreurs ci-dessous.' : 'Please fix the errors below.')
      : axiosError.response?.data?.message || (isFr ? "L'inscription a échoué. Veuillez réessayer." : 'Registration failed. Please try again.')
    : null

  if (showSuccessScreen) {
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isFr ? 'Compte créé avec succès !' : 'Account created successfully!'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isFr
              ? 'Votre compte client est prêt. Vous pouvez maintenant accéder à votre espace.'
              : 'Your client account is ready. You can now access your dashboard.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard')}>
              {isFr ? 'Accéder à mon espace' : 'Go to dashboard'}
            </Button>
            <Button variant="outline" onClick={() => setShowSuccessScreen(false)}>
              {isFr ? 'Créer un autre compte' : 'Create another account'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isFr ? 'Inscription' : 'Sign up'}</CardTitle>
            <CardDescription>{isFr ? 'Créez votre compte Atlas Solutions' : 'Create your Atlas Solutions account'}</CardDescription>
          </CardHeader>
          <CardContent>
            {generalError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Nom complet *' : 'Full name *'}</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className={fieldErrors?.name ? 'border-red-400 focus:ring-red-500' : ''}
                />
                {fieldErrors?.name && (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className={fieldErrors?.email ? 'border-red-400 focus:ring-red-500' : ''}
                />
                {fieldErrors?.email && (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.email[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Téléphone' : 'Phone'}</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Mot de passe *' : 'Password *'}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    className={fieldErrors?.password ? 'border-red-400 focus:ring-red-500 pr-11' : 'pr-11'}
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
                {fieldErrors?.password && (
                  <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.password[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Confirmer le mot de passe *' : 'Confirm password *'}</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    required
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-300"
                    aria-label={showConfirmPassword ? (isFr ? 'Masquer la confirmation du mot de passe' : 'Hide confirm password') : (isFr ? 'Afficher la confirmation du mot de passe' : 'Show confirm password')}
                    title={showConfirmPassword ? (isFr ? 'Masquer la confirmation du mot de passe' : 'Hide confirm password') : (isFr ? 'Afficher la confirmation du mot de passe' : 'Show confirm password')}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={register.isPending}>
                {register.isPending ? (isFr ? 'Inscription...' : 'Signing up...') : (isFr ? "S'inscrire" : 'Sign up')} <UserPlus className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isFr ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:underline">
                {isFr ? 'Se connecter' : 'Sign in'}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
