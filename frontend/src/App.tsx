import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useLanguageStore } from '@/stores/language-store'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicLayout from '@/components/layouts/PublicLayout'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AdminLayout from '@/components/layouts/AdminLayout'

import HomePage from '@/pages/HomePage'
import ServicesPage from '@/pages/ServicesPage'
import ServiceDetailPage from '@/pages/ServiceDetailPage'
import PacksPage from '@/pages/PacksPage'
import ContactPage from '@/pages/ContactPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'

import DashboardOrdersPage from '@/pages/dashboard/OrdersPage'
import DashboardProfilePage from '@/pages/dashboard/ProfilePage'

import AdminDashboardPage from '@/pages/admin/DashboardPage'
import AdminServicesPage from '@/pages/admin/ServicesPage'
import AdminPacksPage from '@/pages/admin/PacksPage'
import AdminOrdersPage from '@/pages/admin/OrdersPage'
import AdminContactsPage from '@/pages/admin/ContactsPage'

export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate)
  const hydrateCart = useCartStore((s) => s.hydrate)
  const hydrateLang = useLanguageStore((s) => s.hydrate)

  useEffect(() => {
    hydrateAuth()
    hydrateCart()
    hydrateLang()
  }, [hydrateAuth, hydrateCart, hydrateLang])

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="packs" element={<PacksPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardOrdersPage />} />
          <Route path="dashboard/profile" element={<DashboardProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute requireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/services" element={<AdminServicesPage />} />
          <Route path="admin/packs" element={<AdminPacksPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/contacts" element={<AdminContactsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
