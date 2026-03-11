import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] }
    catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems(prev => {
      const idx = prev.findIndex(i =>
        i.title    === item.title    &&
        i.size     === item.size     &&
        i.material === item.material &&
        i.frame    === item.frame    &&
        i.mat      === item.mat
      )
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 }
        return updated
      }
      return [...prev, { ...item, qty: 1 }]
    })
    toast.success(`${item.title} added to cart`, {
      description: `${item.size} · ${item.material}`,
    })
    setIsOpen(true)
  }

  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  const updateQty = (index, qty) => {
    if (qty < 1) { removeItem(index); return }
    setItems(prev => prev.map((item, i) => i === index ? { ...item, qty } : item))
  }

  const clearCart = () => setItems([])

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalCount, totalPrice, isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
