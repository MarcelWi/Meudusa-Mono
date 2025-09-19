// lib/api.ts

// Type-only imports um das Vite-Problem zu lösen
import type { Product, ProductsResponse, ApiError, Cart, LineItem } from './types';

// Configuration
const CONFIG = {
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
} as const;

// Error types
export class MedusaError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = 'MedusaError';
  }
}

export class TimeoutError extends MedusaError {
  constructor(endpoint?: string) {
    super('Request timeout: Backend took too long to respond', undefined, 'TIMEOUT', endpoint);
    this.name = 'TimeoutError';
  }
}

// Request configuration interface
interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  params?: Record<string, string | number>;
}

// Enhanced API client class
class MedusaApiClient {
  private readonly baseUrl: string;
  private readonly headers: HeadersInit;

  constructor(baseUrl: string, publishableKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = {
      'x-publishable-api-key': publishableKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Generic fetch method with retry logic
  private async fetchWithRetry<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = CONFIG.timeout,
      retries = CONFIG.retries,
      retryDelay = CONFIG.retryDelay,
      signal,
      params,
    } = config;

    const url = this.buildUrl(endpoint, params);
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.executeFetch<T>(url, { timeout, signal });
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or aborts
        if (error instanceof MedusaError) {
          if (error.status && error.status >= 400 && error.status < 500) {
            throw error;
          }
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new MedusaError('Request was aborted', undefined, 'ABORTED', endpoint);
        }

        // Wait before retry (except on last attempt)
        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  // Execute single fetch attempt
  private async executeFetch<T>(url: string, config: { timeout: number; signal?: AbortSignal }): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    // Combine external signal with timeout signal
    const combinedSignal = config.signal ? this.combineSignals([config.signal, controller.signal]) : controller.signal;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.createErrorFromResponse(response, url);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError(url);
      }

      throw error;
    }
  }

  // POST method for Cart operations
  private async executeFetchWithMethod<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    config: { timeout: number; signal?: AbortSignal; body?: any }
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const combinedSignal = config.signal ? this.combineSignals([config.signal, controller.signal]) : controller.signal;

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        signal: combinedSignal,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.createErrorFromResponse(response, url);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError(url);
      }

      throw error;
    }
  }

  // Build URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = `${this.baseUrl}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `${url}?${searchParams.toString()}`;
  }

  // Combine multiple abort signals
  private combineSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    signals.forEach(signal => {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort(), { once: true });
      }
    });

    return controller.signal;
  }

  // Create detailed error from response
  private async createErrorFromResponse(response: Response, url: string): Promise<MedusaError> {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage += ` - ${errorText}`;
      } catch {
        // Ignore text parsing errors
      }
    }

    return new MedusaError(
      errorMessage,
      response.status,
      response.statusText,
      url
    );
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  public async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.fetchWithRetry<T>(endpoint, config);
  }

  // POST method
  private async post<T>(endpoint: string, body: any, config?: RequestConfig): Promise<T> {
    const {
      timeout = CONFIG.timeout,
      retries = CONFIG.retries,
      retryDelay = CONFIG.retryDelay,
      signal,
      params,
    } = config || {};

    const url = this.buildUrl(endpoint, params);
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.executeFetchWithMethod<T>(url, 'POST', { timeout, signal, body });
      } catch (error) {
        lastError = error as Error;

        if (error instanceof MedusaError) {
          if (error.status && error.status >= 400 && error.status < 500) {
            throw error;
          }
        }

        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  // Product methods
  public async getProducts(config?: RequestConfig): Promise<{ products: Product[]; count: number }> {
    const data = await this.get<ProductsResponse>('/store/products', config);

    return {
      products: data.products || [],
      count: data.count || 0,
    };
  }

  public async getProductById(id: string, config?: RequestConfig): Promise<Product> {
    const data = await this.get<{ product: Product }>(`/store/products/${encodeURIComponent(id)}`, config);
    return data.product;
  }

// lib/api.ts - Debug hinzufügen
// lib/api.ts - getProductByHandle mit Region-Support
  public async getProductByHandle(handle: string, config?: RequestConfig): Promise<Product> {
    let regionId: string | undefined;

    // ✅ Erste verfügbare Region laden
    try {
      const regionsResponse = await this.get<{ regions: any[] }>('/store/regions', config);
      regionId = regionsResponse.regions?.[0]?.id;
      console.log('Found regions:', regionsResponse.regions);
      console.log('Using region ID:', regionId);
    } catch (error) {
      console.warn('Could not fetch regions:', error);
    }

    const params: Record<string, string> = {
      handle: encodeURIComponent(handle),
      fields: '+variants,+variants.prices,+collection,+images,+variants.inventory_quantity'
    };

    // ✅ Region hinzufügen wenn verfügbar
    if (regionId) {
      params.region_id = regionId;
    }


    const data = await this.get<{ products: Product[] }>(
      '/store/products',
      {
        ...config,
        params
      }
    );

    if (!data.products || data.products.length === 0) {
      throw new MedusaError(
        `Product with handle "${handle}" not found`,
        404,
        'NOT_FOUND',
        `/store/products?handle=${handle}`
      );
    }

    const product = data.products[0];

    // console.log('=== PRODUCT DEBUG WITH REGION ===');
    // console.log('Used region ID:', regionId);
    // console.log('Product variants count:', product.variants?.length);
    // if (product.variants?.[0]) {
    //   console.log('First variant with region:', product.variants[0]);
    //   console.log('First variant prices with region:', product.variants[0].prices);
    // }
    // console.log('=================================');

    return product;
  }



  // Cart methods
  public async createCart(config?: RequestConfig): Promise<Cart> {
    const data = await this.post<{ cart: Cart }>('/store/carts', {}, config);
    return data.cart;
  }

  public async getCart(cartId: string, config?: RequestConfig): Promise<Cart> {
    const data = await this.get<{ cart: Cart }>(`/store/carts/${encodeURIComponent(cartId)}`, config);
    return data.cart;
  }

  public async addToCart(
    cartId: string,
    variantId: string,
    quantity: number = 1,
    config?: RequestConfig
  ): Promise<Cart> {
    const data = await this.post<{ cart: Cart }>(
      `/store/carts/${encodeURIComponent(cartId)}/line-items`,
      { variant_id: variantId, quantity },
      config
    );
    return data.cart;
  }

  public async updateCartItem(
    cartId: string,
    lineItemId: string,
    quantity: number,
    config?: RequestConfig
  ): Promise<Cart> {
    const data = await this.post<{ cart: Cart }>(
      `/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineItemId)}`,
      { quantity },
      config
    );
    return data.cart;
  }

  public async removeFromCart(
    cartId: string,
    lineItemId: string,
    config?: RequestConfig
  ): Promise<Cart> {
    const url = this.buildUrl(`/store/carts/${encodeURIComponent(cartId)}/line-items/${encodeURIComponent(lineItemId)}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.createErrorFromResponse(response, url);
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// Singleton instance
const apiClient = new MedusaApiClient(CONFIG.baseUrl, CONFIG.publishableKey);

// Exported functions - Product APIs
export const fetchProducts = (config?: RequestConfig) =>
  apiClient.getProducts(config);

export const fetchProductById = (id: string, config?: RequestConfig) =>
  apiClient.getProductById(id, config);

export const fetchProductByHandle = (handle: string, config?: RequestConfig) =>
  apiClient.getProductByHandle(handle, config);

// Exported functions - Cart APIs
export const createCart = (config?: RequestConfig) =>
  apiClient.createCart(config);

export const getCart = (cartId: string, config?: RequestConfig) =>
  apiClient.getCart(cartId, config);

export const addToCart = (cartId: string, variantId: string, quantity?: number, config?: RequestConfig) =>
  apiClient.addToCart(cartId, variantId, quantity, config);

export const updateCartItem = (cartId: string, lineItemId: string, quantity: number, config?: RequestConfig) =>
  apiClient.updateCartItem(cartId, lineItemId, quantity, config);

export const removeFromCart = (cartId: string, lineItemId: string, config?: RequestConfig) =>
  apiClient.removeFromCart(cartId, lineItemId, config);

// Export the client for advanced usage
export { apiClient };

// Export types
export type { RequestConfig };
