// app/context/CartSheetContext.tsx
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react" // Type-only import

interface CartSheetContextType {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartSheetContext = createContext<CartSheetContextType | null>(null)

export function CartSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(!isOpen)

  return (
    <CartSheetContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartSheetContext.Provider>
  )
}

export const useCartSheet = () => {
  const context = useContext(CartSheetContext)
  if (!context) {
    throw new Error("useCartSheet must be used within CartSheetProvider")
  }
  return context
}
