import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  useSearch,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import './App.css'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Shop from './components/Shop'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import { Toaster } from 'sonner'

// Shared layout — wraps every page
function RootLayout() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <Toaster richColors position="bottom-right" duration={1000} />
      <Outlet />
      <Footer />
    </CartProvider>
  )
}

// Home page — adds scroll-snap class while mounted
function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('snap-home')
    return () => document.documentElement.classList.remove('snap-home')
  }, [])
  return <><Hero /><Gallery /><About /></>
}

// Shop page — reads validated search params from the route
function ShopPage() {
  const { order } = useSearch({ from: '/shop' })
  const navigate = useNavigate()

  useEffect(() => {
    if (order === 'success') {
      const t = setTimeout(() => navigate({ to: '/shop', search: {}, replace: true }), 5000)
      return () => clearTimeout(t)
    }
  }, [order, navigate])

  return (
    <>
      {order === 'success' && (
        <div className="order-success-banner">
          Order placed — thank you! You'll receive a confirmation email shortly.
        </div>
      )}
      <Shop />
    </>
  )
}

// ── Route tree ──────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
  // Declare search params so useSearch() knows what to expect
  validateSearch: (search) => ({
    order: typeof search.order === 'string' ? search.order : undefined,
    highlight: typeof search.highlight === 'string' ? search.highlight : undefined,
  }),
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
})

const routeTree = rootRoute.addChildren([indexRoute, shopRoute, contactRoute, checkoutRoute])

export const router = createRouter({ routeTree })
