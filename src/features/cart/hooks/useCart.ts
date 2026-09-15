import { useState, useEffect, useCallback } from 'react'
import type { CartItem } from '../../../types'

const STORAGE_KEY = 'overkap_cart'

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  // Sync with localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(i => i.variant_id === item.variant_id)
      if (existingIndex !== -1) {
        // Same variant_id (same product + size + color) → sum quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        }
        return updated
      }
      // Different variant → new item
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((variant_id: string) => {
    setItems(prev => prev.filter(i => i.variant_id !== variant_id))
  }, [])

  const updateQuantity = useCallback((variant_id: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(i =>
        i.variant_id === variant_id ? { ...i, quantity } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const totalAmount = useCallback(() => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }, [items])

  const totalItems = useCallback(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0)
  }, [items])

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  }
}
