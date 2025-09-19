// lib/api/index.ts - Zentrale API-Exports
export * from './products';
export * from './cart';
export * from './auth';
export * from './errors';
export * from './config';

// ✅ Convenience-Objekt für strukturierte Verwendung
import { productsApi } from './products';
import { cartApi } from './cart';
import { authApi } from './auth';

export const api = {
  products: productsApi,
  cart: cartApi,
  auth: authApi,
};

// ✅ TypeScript-Namespaces für bessere IntelliSense
export namespace API {
  export type Products = typeof productsApi;
  export type Cart = typeof cartApi;
  export type Auth = typeof authApi;
}

// ✅ Utility-Funktionen
export const createApiError = (message: string, status?: number) => {
  return new MedusaError(message, status);
};

export const isApiError = (error: any): error is MedusaError => {
  return error instanceof MedusaError;
};

// ✅ Default Export
export default api;
