// app/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { cartQueryOptions, medusaQueries } from "~/lib/queries"
import { createCart, getCart, addToCart, updateCartItem, removeFromCart } from "~/lib/api"

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      const existingCartId = localStorage.getItem("cart_id")

      if (existingCartId) {
        try {
          await getCart(existingCartId)
          setCartId(existingCartId)
        } catch {
          const cart = await createCart()
          localStorage.setItem("cart_id", cart.id)
          setCartId(cart.id)
        }
      } else {
        const cart = await createCart()
        localStorage.setItem("cart_id", cart.id)
        setCartId(cart.id)
      }
    }

    initCart().catch(console.error)
  }, [])

  // Cart query
  const { data: cart, isLoading: isCartLoading } = useQuery({
    ...cartQueryOptions(cartId || ""),
    enabled: !!cartId,
  })

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!cartId) throw new Error("No cart available")
      return await addToCart(cartId, variantId, quantity)
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(medusaQueries.cart(cartId!), updatedCart)
    },
  })

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      if (!cartId) throw new Error("No cart available")
      return await updateCartItem(cartId, lineItemId, quantity)
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(medusaQueries.cart(cartId!), updatedCart)
    },
  })

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      if (!cartId) throw new Error("No cart available")
      return await removeFromCart(cartId, lineItemId)
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(medusaQueries.cart(cartId!), updatedCart)
    },
  })

  const totalItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return {
    cart,
    cartId,
    isLoading: isCartLoading,
    totalItems,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateQuantityMutation.isPending || removeFromCartMutation.isPending,
  }
}
