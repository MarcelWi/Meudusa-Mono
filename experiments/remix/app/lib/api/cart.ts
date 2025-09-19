// lib/api/cart.ts - Mit direkten Fetch-Calls (funktioniert garantiert)
import { CONFIG } from './config';
import { MedusaError } from './errors';

export interface AddToCartParams {
  variant_id: string;
  quantity: number;
  metadata?: Record<string, any>;
}

export interface UpdateCartItemParams {
  quantity: number;
  metadata?: Record<string, any>;
}

// ✅ Direkte Fetch-Implementierung (ohne SDK)
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'x-publishable-api-key': CONFIG.api.publishableKey,
});

export const cartApi = {
  /**
   * Create a new cart
   */
  async createCart(regionId?: string) {
    try {
      console.log('🛒 Creating new cart with direct API...');

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(regionId ? { region_id: regionId } : {}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Cart created successfully:', data.cart.id);
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to create cart:', error);
      throw new MedusaError(
        error?.message || 'Failed to create cart',
        error?.status,
        'CART_CREATE_ERROR',
        'store/carts'
      );
    }
  },

  /**
   * Get cart by ID
   */
  async getCart(cartId: string) {
    try {
      console.log('🛒 Fetching cart:', cartId);

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts/${cartId}`, {
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new MedusaError(
            `Cart with ID "${cartId}" not found`,
            404,
            'CART_NOT_FOUND',
            `store/carts/${cartId}`
          );
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Cart fetched successfully');
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to fetch cart:', error);

      if (error instanceof MedusaError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Cart not found',
        error?.status || 500,
        'CART_FETCH_ERROR',
        `store/carts/${cartId}`
      );
    }
  },

  /**
   * Add item to cart
   */
  async addToCart(cartId: string, params: AddToCartParams) {
    try {
      console.log('🛒 Adding to cart with direct API:', { cartId, ...params });

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          variant_id: params.variant_id,
          quantity: params.quantity,
          metadata: params.metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error cases
        if (response.status === 400) {
          if (errorData.message?.includes('variant')) {
            throw new MedusaError(
              'Product variant not found or unavailable',
              400,
              'VARIANT_NOT_FOUND',
              `store/carts/${cartId}/line-items`
            );
          }

          if (errorData.message?.includes('inventory')) {
            throw new MedusaError(
              'Not enough items in stock',
              400,
              'INSUFFICIENT_INVENTORY',
              `store/carts/${cartId}/line-items`
            );
          }
        }

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Item added to cart successfully');
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to add item to cart:', error);

      if (error instanceof MedusaError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Failed to add item to cart',
        error?.status,
        'CART_ADD_ERROR',
        `store/carts/${cartId}/line-items`
      );
    }
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartId: string, lineItemId: string, params: UpdateCartItemParams) {
    try {
      console.log('🛒 Updating cart item with direct API:', { cartId, lineItemId, ...params });

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          quantity: params.quantity,
          metadata: params.metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 404) {
          throw new MedusaError(
            'Cart item not found',
            404,
            'LINE_ITEM_NOT_FOUND',
            `store/carts/${cartId}/line-items/${lineItemId}`
          );
        }

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Cart item updated successfully');
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to update cart item:', error);

      if (error instanceof MedusaError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Failed to update cart item',
        error?.status,
        'CART_UPDATE_ERROR',
        `store/carts/${cartId}/line-items/${lineItemId}`
      );
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: string, lineItemId: string) {
    try {
      console.log('🛒 Removing from cart with direct API:', { cartId, lineItemId });

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 404) {
          throw new MedusaError(
            'Cart item not found',
            404,
            'LINE_ITEM_NOT_FOUND',
            `store/carts/${cartId}/line-items/${lineItemId}`
          );
        }

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Item removed from cart successfully');
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to remove item from cart:', error);

      if (error instanceof MedusaError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || 'Failed to remove item from cart',
        error?.status,
        'CART_REMOVE_ERROR',
        `store/carts/${cartId}/line-items/${lineItemId}`
      );
    }
  },

  /**
   * Clear all items from cart
   */
  async clearCart(cartId: string) {
    try {
      console.log('🛒 Clearing cart with direct API:', cartId);

      const cart = await this.getCart(cartId);

      if (cart.items && cart.items.length > 0) {
        // Remove all items one by one
        let updatedCart = cart;
        for (const item of cart.items) {
          updatedCart = await this.removeFromCart(cartId, item.id);
        }
        return updatedCart;
      }

      return cart;
    } catch (error: any) {
      console.error('❌ Failed to clear cart:', error);
      throw new MedusaError(
        error?.message || 'Failed to clear cart',
        error?.status,
        'CART_CLEAR_ERROR',
        `clearCart(${cartId})`
      );
    }
  },

  /**
   * Get cart totals and summary
   */
  async getCartSummary(cartId: string) {
    try {
      const cart = await this.getCart(cartId);

      return {
        itemCount: cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
        subtotal: cart.subtotal || 0,
        total: cart.total || 0,
        tax_total: cart.tax_total || 0,
        shipping_total: cart.shipping_total || 0,
        discount_total: cart.discount_total || 0,
        currency_code: cart.region?.currency_code || 'EUR',
        items: cart.items || [],
      };
    } catch (error: any) {
      throw new MedusaError(
        error?.message || 'Failed to get cart summary',
        error?.status,
        'CART_SUMMARY_ERROR',
        `getCartSummary(${cartId})`
      );
    }
  },

  /**
   * Update cart region (for currency/tax calculation)
   */
  async updateCartRegion(cartId: string, regionId: string) {
    try {
      console.log('🛒 Updating cart region with direct API:', { cartId, regionId });

      const response = await fetch(`${CONFIG.api.baseUrl}/store/carts/${cartId}`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          region_id: regionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Cart region updated successfully');
      return data.cart;
    } catch (error: any) {
      console.error('❌ Failed to update cart region:', error);
      throw new MedusaError(
        error?.message || 'Failed to update cart region',
        error?.status,
        'CART_REGION_UPDATE_ERROR',
        `store/carts/${cartId}`
      );
    }
  },
};
