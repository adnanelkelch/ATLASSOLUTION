import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { contactApi } from '@/services/api'
import { useLanguageStore } from '@/stores/language-store'

export default function ContactPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: contactApi.send,
    onSuccess: () => {
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (success) {
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isFr ? 'Message envoyé !' : 'Message sent!'}</h2>
          <p className="text-gray-600 mb-6">{isFr ? 'Nous vous répondrons dans les plus brefs délais.' : "We'll get back to you as soon as possible."}</p>
          <Button onClick={() => setSuccess(false)}>{isFr ? 'Envoyer un autre message' : 'Send another message'}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isFr ? 'Contactez-nous' : 'Contact us'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isFr ? "Une question ou un projet ? Envoyez-nous un message." : 'Have a question or project in mind? Send us a message.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{isFr ? 'Envoyez-nous un message' : 'Send us a message'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Nom *' : 'Name *'}</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Téléphone' : 'Phone'}</label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Sujet' : 'Subject'}</label>
                      <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isFr ? 'Message *' : 'Message *'}</label>
                    <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  {mutation.error && (
                    <p className="text-sm text-red-600">{isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.'}</p>
                  )}
                  <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                    {mutation.isPending ? (isFr ? 'Envoi...' : 'Sending...') : (isFr ? 'Envoyer' : 'Send')} <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{isFr ? 'Informations' : 'Information'}</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>contact@pmo-expert.com</p>
                  <p>+212-612-345-678</p>
                  <p>Maroc, Marrakech</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{isFr ? 'Horaires' : 'Working hours'}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{isFr ? 'Lundi - Vendredi : 9h - 18h' : 'Monday - Friday: 9am - 6pm'}</p>
                  <p>{isFr ? 'Samedi : 10h - 15h' : 'Saturday: 10am - 3pm'}</p>
                  <p>{isFr ? 'Dimanche : Fermé' : 'Sunday: Closed'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
