// stores/productStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ExtendedProductVariant } from '~/lib/types';

interface ProductState {
  selectedVariant: ExtendedProductVariant | undefined
  selectedImageIndex: number
  isClient: boolean

  // Actions
  setSelectedVariant: (variant: ExtendedProductVariant) => void
  setSelectedImageIndex: (index: number) => void
  setIsClient: (isClient: boolean) => void

  // Computed values
  getVariantPrice: (variant?: ExtendedProductVariant) => number | null
  getOriginalPrice: (variant?: ExtendedProductVariant) => number | null
  formatNumber: (num: number) => string
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      selectedVariant: undefined,
      selectedImageIndex: 0,
      isClient: false,

      setSelectedVariant: (variant) => set({ selectedVariant: variant }),
      setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),
      setIsClient: (isClient) => set({ isClient }),

      // ✅ Computed values im Store
      getVariantPrice: (variant) => {
        if (!variant) return null;

        if (variant.calculated_price?.calculated_amount) {
          return variant.calculated_price.calculated_amount;
        }

        if (variant.prices?.[0]?.amount) {
          return variant.prices[0].amount / 100;
        }

        return null;
      },

      getOriginalPrice: (variant) => {
        if (!variant?.calculated_price) return null;

        const original = variant.calculated_price.original_amount;
        const current = variant.calculated_price.calculated_amount;

        return original && original > current ? original : null;
      },

      formatNumber: (num) => {
        const { isClient } = get();

        if (!isClient) {
          if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
          if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
          return num.toString();
        }

        return num.toLocaleString('de-DE');
      },
    }),
    { name: 'product-store' }
  )
)
