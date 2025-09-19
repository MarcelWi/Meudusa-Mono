// stores/cartStore.ts - Mit API-Wrapper statt direktem SDK
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartApi, MedusaError } from '~/lib/api/index' // ✅ Neue API verwenden

interface CartState {
  cart: any | null;
  cartId: string | null;
  isLoading: boolean;
  error: string | null;
  isAddingToCart: boolean;

  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  clearError: () => void;
  clearCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemByVariantId: (variantId: string) => any;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get): CartState => ({
      cart: null,
      cartId: null,
      isLoading: false,
      error: null,
      isAddingToCart: false,

      // ✅ Initialize Cart mit API-Wrapper
      initializeCart: async () => {
        const { cartId } = get();
        set({ isLoading: true, error: null });

        try {
          let currentCartId = cartId;

          if (!currentCartId) {
            console.log('🛒 Creating new cart with API...');

            // ✅ API-Wrapper verwenden
            const cart = await cartApi.createCart();
            currentCartId = cart.id;
            set({ cartId: currentCartId, cart });
            console.log('✅ New cart created:', currentCartId);
          } else {
            console.log('🛒 Loading existing cart:', currentCartId);

            try {
              // ✅ API-Wrapper verwenden
              const cart = await cartApi.getCart(currentCartId);
              set({ cart });
              console.log('✅ Existing cart loaded');
            } catch (error) {
              console.log('❌ Cart not found, creating new one');

              // Create new cart if existing one is invalid
              const cart = await cartApi.createCart();
              currentCartId = cart.id;
              set({ cartId: currentCartId, cart });
            }
          }
        } catch (error: any) {
          console.error('❌ Cart initialization failed:', error);
          const errorMessage = error instanceof MedusaError
            ? error.message
            : 'Warenkorb konnte nicht initialisiert werden';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Add Item mit API-Wrapper
      addItem: async (variantId: string, quantity = 1) => {
        const { cartId, initializeCart } = get();
        set({ isAddingToCart: true, error: null });

        try {
          // Ensure cart exists
          if (!cartId) {
            await initializeCart();
            const newState = get();
            if (!newState.cartId) {
              throw new Error('Warenkorb konnte nicht erstellt werden');
            }
          }

          const currentCartId = get().cartId!;
          console.log('🛒 Adding to cart:', { cartId: currentCartId, variantId, quantity });

          // ✅ API-Wrapper verwenden
          const cart = await cartApi.addToCart(currentCartId, {
            variant_id: variantId,
            quantity,
          });

          set({ cart });
          console.log('✅ Item added successfully');
        } catch (error: any) {
          console.error('❌ Add to cart failed:', error);

          const errorMessage = error instanceof MedusaError
            ? error.message
            : 'Artikel konnte nicht hinzugefügt werden';
          set({ error: errorMessage });
        } finally {
          set({ isAddingToCart: false });
        }
      },

      // ✅ Update Item mit API-Wrapper
      updateItem: async (lineItemId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true, error: null });

        try {
          if (quantity === 0) {
            await get().removeItem(lineItemId);
          } else {
            // ✅ API-Wrapper verwenden
            const cart = await cartApi.updateCartItem(cartId, lineItemId, {
              quantity,
            });

            set({ cart });
            console.log('✅ Item updated successfully');
          }
        } catch (error: any) {
          console.error('❌ Update item failed:', error);

          const errorMessage = error instanceof MedusaError
            ? error.message
            : 'Artikel konnte nicht aktualisiert werden';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Remove Item mit API-Wrapper
      removeItem: async (lineItemId: string) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true, error: null });

        try {
          // ✅ API-Wrapper verwenden
          const cart = await cartApi.removeFromCart(cartId, lineItemId);
          set({ cart });
          console.log('✅ Item removed successfully');
        } catch (error: any) {
          console.error('❌ Remove item failed:', error);

          const errorMessage = error instanceof MedusaError
            ? error.message
            : 'Artikel konnte nicht entfernt werden';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Clear Error
      clearError: () => set({ error: null }),

      // ✅ Clear Cart
      clearCart: () => set({
        cart: null,
        cartId: null,
        error: null
      }),

      // ✅ Computed Values
      getItemCount: () => {
        const { cart } = get();
        return cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
      },

      getSubtotal: () => {
        const { cart } = get();
        return cart?.subtotal || 0;
      },

      getItemByVariantId: (variantId: string) => {
        const { cart } = get();
        return cart?.items?.find((item: any) => item.variant_id === variantId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartId: state.cartId,
      }),
    }
  )
);
