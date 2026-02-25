import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language-store'

export default function CartPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isFr ? 'Votre panier est vide' : 'Your cart is empty'}</h2>
          <p className="text-gray-600 mb-6">{isFr ? 'Découvrez nos packs et ajoutez-en à votre panier.' : 'Discover our packs and add one to your cart.'}</p>
          <Link to="/packs">
            <Button>{isFr ? 'Voir nos packs' : 'View packs'}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{isFr ? 'Votre Panier' : 'Your Cart'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.pack.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.pack.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(item.pack.price)} / {isFr ? 'unité' : 'unit'}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.pack.id, item.quantity - 1)} className="p-1 rounded hover:bg-gray-100">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.pack.id, item.quantity + 1)} className="p-1 rounded hover:bg-gray-100">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 w-24 text-right">
                      {formatPrice(item.pack.price * item.quantity)}
                    </span>
                    <button onClick={() => removeItem(item.pack.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{isFr ? 'Résumé' : 'Summary'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.pack.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.pack.name} x{item.quantity}</span>
                      <span>{formatPrice(item.pack.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total())}</span>
                </div>
                <div className="mt-6">
                  {isAuthenticated ? (
                    <Link to="/checkout">
                      <Button className="w-full">{isFr ? 'Commander' : 'Checkout'} <ArrowRight className="h-4 w-4" /></Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button className="w-full">{isFr ? 'Se connecter pour commander' : 'Sign in to checkout'}</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
