import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Save, ShieldCheck, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '@/services/api'
import { useLanguageStore } from '@/stores/language-store'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const isFr = useLanguageStore((s) => s.lang) === 'fr'
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saved, setSaved] = useState(false)

  const isAdmin = user?.role === 'admin'

  const mutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      updateUser(res.data.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <div>
      <div className="flex items-center gap-5 mb-8">
        <div
          className={`flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold text-white shadow-lg ${
            isAdmin
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
              : 'bg-gradient-to-br from-sky-500 to-cyan-600'
          }`}
        >
          {getInitials(user?.name || '?')}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              isAdmin
                ? 'bg-violet-100 text-violet-700'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
            {isAdmin ? (isFr ? 'Administrateur' : 'Administrator') : (isFr ? 'Client' : 'Client')}
          </span>
        </div>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{isFr ? 'Informations personnelles' : 'Personal information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input value={user?.email || ''} disabled className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Nom' : 'Name'}</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Téléphone' : 'Phone'}</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            {saved && (
              <p className="text-sm text-green-600">
                {isFr ? 'Profil mis à jour avec succès !' : 'Profile updated successfully!'}
              </p>
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? (isFr ? 'Enregistrement...' : 'Saving...')
                : (isFr ? 'Enregistrer' : 'Save')}{' '}
              <Save className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
