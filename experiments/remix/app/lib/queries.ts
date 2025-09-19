// lib/queries.ts
import { queryOptions } from "@tanstack/react-query"
import { api } from "./api/index" // ✅ Expliziter Pfad zur index.ts
import type { ProductsQueryParams } from "./api/products"

// ✅ Query Factory Pattern
export const medusaQueries = {
  all: () => ['medusa'] as const,

  // Products
  products: () => [...medusaQueries.all(), 'products'] as const,
  productsList: (params?: ProductsQueryParams) => [...medusaQueries.products(), 'list', params] as const,
  product: (id: string) => [...medusaQueries.products(), 'detail', id] as const,
  productByHandle: (handle: string) => [...medusaQueries.products(), 'handle', handle] as const,
  productsSearch: (query: string) => [...medusaQueries.products(), 'search', query] as const,
  productsByCategory: (categoryId: string) => [...medusaQueries.products(), 'category', categoryId] as const,
  productsByCollection: (collectionId: string) => [...medusaQueries.products(), 'collection', collectionId] as const,
  featuredProducts: () => [...medusaQueries.products(), 'featured'] as const,

  // Cart
  cart: (id: string) => [...medusaQueries.all(), 'cart', id] as const,
  cartSummary: (id: string) => [...medusaQueries.cart(id), 'summary'] as const,

  // Auth
  auth: () => [...medusaQueries.all(), 'auth'] as const,
  currentUser: () => [...medusaQueries.auth(), 'current'] as const,
}

// ✅ Products Query Options
export const productsQueryOptions = (params?: ProductsQueryParams) =>
  queryOptions({
    queryKey: medusaQueries.productsList(params),
    queryFn: () => api.products.getProducts(params),
    staleTime: 1000 * 60 * 10, // 10 Minuten
  })

export const productByHandleQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: medusaQueries.productByHandle(handle),
    queryFn: () => api.products.getProductByHandle(handle),
    staleTime: 1000 * 60 * 15, // 15 Minuten
    enabled: !!handle,
  })

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: medusaQueries.product(id),
    queryFn: () => api.products.getProduct(id),
    staleTime: 1000 * 60 * 15, // 15 Minuten
    enabled: !!id,
  })

export const productsSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: medusaQueries.productsSearch(query),
    queryFn: () => api.products.searchProducts(query),
    staleTime: 1000 * 60 * 2, // 2 Minuten für Search
    enabled: !!query && query.length >= 2,
  })

export const featuredProductsQueryOptions = (limit: number = 8) =>
  queryOptions({
    queryKey: [...medusaQueries.featuredProducts(), limit],
    queryFn: () => api.products.getFeaturedProducts(limit),
    staleTime: 1000 * 60 * 30, // 30 Minuten für Featured Products
  })

// ✅ Cart Query Options
export const cartQueryOptions = (cartId: string) =>
  queryOptions({
    queryKey: medusaQueries.cart(cartId),
    queryFn: () => api.cart.getCart(cartId),
    staleTime: 1000 * 30, // 30 Sekunden
    enabled: !!cartId,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (cart not found)
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  })

export const cartSummaryQueryOptions = (cartId: string) =>
  queryOptions({
    queryKey: medusaQueries.cartSummary(cartId),
    queryFn: () => api.cart.getCartSummary(cartId),
    staleTime: 1000 * 15, // 15 Sekunden
    enabled: !!cartId,
  })

// ✅ Auth Query Options
export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: medusaQueries.currentUser(),
    queryFn: () => api.auth.getCurrentCustomer(),
    staleTime: 1000 * 60 * 5, // 5 Minuten
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (not authenticated)
      if (error?.status === 401) return false;
      return failureCount < 1;
    },
  })

// ✅ Category & Collection Query Options (falls du diese APIs hast)
export const productsByCategoryQueryOptions = (categoryId: string, params?: ProductsQueryParams) =>
  queryOptions({
    queryKey: medusaQueries.productsByCategory(categoryId),
    queryFn: () => api.products.getProductsByCategory(categoryId, params),
    staleTime: 1000 * 60 * 10, // 10 Minuten
    enabled: !!categoryId,
  })

export const productsByCollectionQueryOptions = (collectionId: string, params?: ProductsQueryParams) =>
  queryOptions({
    queryKey: medusaQueries.productsByCollection(collectionId),
    queryFn: () => api.products.getProductsByCollection(collectionId, params),
    staleTime: 1000 * 60 * 10, // 10 Minuten
    enabled: !!collectionId,
  })

// ✅ Utility für Query Key-Invalidation
export const invalidateQueries = {
  products: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: medusaQueries.products() });
  },

  cart: (queryClient: any, cartId: string) => {
    queryClient.invalidateQueries({ queryKey: medusaQueries.cart(cartId) });
  },

  currentUser: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: medusaQueries.currentUser() });
  },

  all: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: medusaQueries.all() });
  },
};
