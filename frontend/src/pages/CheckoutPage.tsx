import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart-store'
import { ordersApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language-store'

export default function CheckoutPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const { items, total, clearCart } = useCartStore()
  const [notes, setNotes] = useState('')
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (res) => {
      setOrderRef(res.data.data.reference)
      clearCart()
    },
  })

  if (items.length === 0 && !orderRef) {
    navigate('/cart')
    return null
  }

  if (orderRef) {
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isFr ? 'Commande confirmée !' : 'Order confirmed!'}</h2>
          <p className="text-gray-600 mb-2">{isFr ? 'Votre commande a bien été enregistrée.' : 'Your order has been successfully created.'}</p>
          <p className="text-lg font-semibold text-primary-600 mb-6">{isFr ? 'Référence' : 'Reference'}: {orderRef}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard"><Button>{isFr ? 'Voir mes commandes' : 'View my orders'}</Button></Link>
            <Link to="/"><Button variant="outline">{isFr ? "Retour à l'accueil" : 'Back to home'}</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      items: items.map((item) => ({ pack_id: item.pack.id, quantity: item.quantity })),
      notes: notes || undefined,
    })
  }

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{isFr ? 'Finaliser la commande' : 'Complete your order'}</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{isFr ? 'Récapitulatif' : 'Order summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.pack.id} className="flex justify-between">
                    <span>{item.pack.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.pack.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(total())}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{isFr ? 'Notes (optionnel)' : 'Notes (optional)'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={isFr ? 'Ajoutez des précisions sur votre commande...' : 'Add any additional details for your order...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {mutation.error && (
            <p className="text-sm text-red-600 mb-4">{isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.'}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (isFr ? 'Traitement en cours...' : 'Processing...') : (isFr ? 'Confirmer la commande' : 'Confirm order')}
          </Button>
        </form>
      </div>
    </div>
  )
}
