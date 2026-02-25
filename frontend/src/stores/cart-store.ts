import { create } from 'zustand'
import type { CartItem, Pack } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (pack: Pack) => void
  removeItem: (packId: number) => void
  updateQuantity: (packId: number, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
  hydrate: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (pack) => {
    const items = get().items
    const existing = items.find((item) => item.pack.id === pack.id)

    if (existing) {
      const updated = items.map((item) =>
        item.pack.id === pack.id ? { ...item, quantity: item.quantity + 1 } : item
      )
      localStorage.setItem('cart', JSON.stringify(updated))
      set({ items: updated })
    } else {
      const updated = [...items, { pack, quantity: 1 }]
      localStorage.setItem('cart', JSON.stringify(updated))
      set({ items: updated })
    }
  },

  removeItem: (packId) => {
    const updated = get().items.filter((item) => item.pack.id !== packId)
    localStorage.setItem('cart', JSON.stringify(updated))
    set({ items: updated })
  },

  updateQuantity: (packId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(packId)
      return
    }
    const updated = get().items.map((item) =>
      item.pack.id === packId ? { ...item, quantity } : item
    )
    localStorage.setItem('cart', JSON.stringify(updated))
    set({ items: updated })
  },

  clearCart: () => {
    localStorage.removeItem('cart')
    set({ items: [] })
  },

  total: () => get().items.reduce((sum, item) => sum + item.pack.price * item.quantity, 0),

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  hydrate: () => {
    const cartJson = localStorage.getItem('cart')
    if (cartJson) {
      try {
        const items = JSON.parse(cartJson) as CartItem[]
        set({ items })
      } catch {
        localStorage.removeItem('cart')
      }
    }
  },
}))
