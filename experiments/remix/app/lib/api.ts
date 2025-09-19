import { Product, ProductsResponse, ApiError } from './types';

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

// Basis fetch Funktion
async function medusaFetch<T>(endpoint: string): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${MEDUSA_BACKEND_URL}${endpoint}`, {
      method: "GET",
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    throw handleFetchError(error);
  }
}

export async function fetchProducts(): Promise<{
  products: Product[];
  count: number;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
      method: "GET",
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data: ProductsResponse = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0
    };
  } catch (error) {
    throw handleFetchError(error);
  }
}

// Einzelnes Produkt by ID
export async function fetchProductById(id: string): Promise<Product> {
  const data: { product: Product } = await medusaFetch(`/store/products/${id}`);
  return data.product;
}

// Einzelnes Produkt by Handle (SEO-friendly)
export async function fetchProductByHandle(handle: string): Promise<Product> {
  const data: { products: Product[] } = await medusaFetch(
    `/store/products?handle=${encodeURIComponent(handle)}`
  );

  if (!data.products || data.products.length === 0) {
    throw new Error(`Product with handle "${handle}" not found`);
  }

  return data.products[0];
}


async function handleApiError(response: Response): Promise<{ message: string; status: number; code: string }> {
  let errorMessage = `API Error: ${response.status} ${response.statusText}`;

  try {
    const errorData = await response.json();
    errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
  } catch {
    const errorText = await response.text();
    errorMessage += ` - ${errorText}`;
  }

  return {
    message: errorMessage,
    status: response.status,
    code: response.statusText
  };
}

function handleFetchError(error: unknown): { message: string; code: string } {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { message: "Request timeout: Backend took too long to respond", code: "TIMEOUT" };
    }
    return { message: error.message, code: "FETCH_ERROR" };
  }
  return { message: "Unknown error occurred", code: "UNKNOWN_ERROR" };
}