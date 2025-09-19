export interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  variants?: any[];
  price?: number;
}

export interface ProductsResponse {
  products: Product[];
  count: number;
  offset: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface LoaderData {
  products: Product[];
  count?: number;
  error?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  prices: ProductPrice[];
  inventory_quantity: number;
  sku: string;
}

export interface ProductPrice {
  id: string;
  currency_code: string;
  amount: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  price?: number;
  original_price?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
}