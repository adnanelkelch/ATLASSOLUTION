import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/stores/language-store'
import LanguageToggle from '@/components/LanguageToggle'

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())
  const logout = useLogout()
  const location = useLocation()
  const lang = useLanguageStore((s) => s.lang)

  const t = {
    home: lang === 'fr' ? 'Accueil' : 'Home',
    services: lang === 'fr' ? 'Services' : 'Services',
    packs: lang === 'fr' ? 'Nos Packs' : 'Our Packs',
    contact: lang === 'fr' ? 'Contact' : 'Contact',
    signIn: lang === 'fr' ? 'Connexion' : 'Sign in',
    signUp: lang === 'fr' ? 'Inscription' : 'Sign up',
    signOut: lang === 'fr' ? 'Déconnexion' : 'Sign out',
    myAccount: lang === 'fr' ? 'Mon Compte' : 'My Account',
    nav: lang === 'fr' ? 'Navigation' : 'Navigation',
    rights: lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.',
    brandDesc: lang === 'fr'
      ? "Votre partenaire digital pour des sites web et applications sur mesure."
      : 'Your digital partner for custom websites and web applications.',
  }

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/services', label: t.services },
    { href: '/packs', label: t.packs },
    { href: '/contact', label: t.contact },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b0b12]/95 backdrop-blur border-b border-gray-100 dark:border-[#26263a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Atlas <span className="text-gray-900 dark:text-violet-100">Solutions</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageToggle />

              <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-violet-100">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                      {user?.name}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => logout.mutate()} title={t.signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">{t.signIn}</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">{t.signUp}</Button>
                  </Link>
                </div>
              )}

              <button
                className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-[#26263a] bg-white dark:bg-[#0d0d15]">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    location.pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-[#26263a] space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600">{t.myAccount}</Link>
                    <button onClick={() => { logout.mutate(); setMobileOpen(false); }} className="block px-3 py-2 text-sm font-medium text-red-600">{t.signOut}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600">{t.signIn}</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary-600">{t.signUp}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 dark:text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white dark:text-violet-100 font-bold text-lg mb-3">Atlas <span className="text-primary-400 dark:text-violet-400">Solutions</span></h3>
              <p className="text-sm">{t.brandDesc}</p>
            </div>
            <div>
              <h4 className="text-white dark:text-violet-100 font-semibold mb-3">{t.nav}</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}><Link to={link.href} className="hover:text-white dark:hover:text-violet-200 transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white dark:text-violet-100 font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>contact@pmo-expert.com</li>
                <li>+212-612-345-678</li>
                <li>Maroc, Marrakech</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 dark:border-[#2b2b43] text-sm text-center">
            &copy; {new Date().getFullYear()} Atlas Solutions. {t.rights}
          </div>
        </div>
      </footer>
    </div>
  )
}
