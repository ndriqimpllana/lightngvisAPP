import { Routes, Route, useSearchParams } from 'react-router-dom'
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

function ShopWithSuccess() {
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (params.get('order') === 'success') {
      // clear the query param after a moment
      const t = setTimeout(() => setParams({}, { replace: true }), 5000)
      return () => clearTimeout(t)
    }
  }, [params, setParams])

  return (
    <>
      {params.get('order') === 'success' && (
        <div className="order-success-banner">
          Order placed — thank you! You'll receive a confirmation email shortly.
        </div>
      )}
      <Shop />
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <Toaster richColors position="bottom-right" duration={1000} />
      <Routes>
        <Route path="/" element={<><Hero /><Gallery /><About /></>} />
        <Route path="/shop" element={<ShopWithSuccess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </CartProvider>
  )
}

export default App
