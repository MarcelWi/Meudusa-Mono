import { create } from 'zustand'

interface CartSheetStore {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartSheet = create<CartSheetStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}))
