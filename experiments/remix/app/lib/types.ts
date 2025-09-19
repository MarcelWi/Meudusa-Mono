// lib/types.ts
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
  weight?: string;
  material?: string;
  origin_country?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  inventory_quantity?: number;
  prices?: ProductPrice[];
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

// ✅ Neue Medusa v2 Types hinzufügen
export interface CalculatedPrice {
  id: string;
  is_calculated_price_price_list: boolean;
  is_calculated_price_tax_inclusive: boolean;
  calculated_amount: number;
  raw_calculated_amount: {
    value: string;
    precision: number;
  };
  is_original_price_price_list: boolean;
  is_original_price_tax_inclusive: boolean;
  original_amount: number;
  raw_original_amount: {
    value: string;
    precision: number;
  };
  currency_code: string;
  calculated_price: {
    id: string;
    price_list_id: string | null;
    price_list_type: string | null;
    min_quantity: number | null;
    max_quantity: number | null;
  };
  original_price: {
    id: string;
    price_list_id: string | null;
    price_list_type: string | null;
    min_quantity: number | null;
    max_quantity: number | null;
  };
}

// ✅ Extended ProductVariant für Medusa v2
export interface ExtendedProductVariant extends ProductVariant {
  calculated_price?: CalculatedPrice;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
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

// NEUE CART TYPES hinzufügen
export interface Cart {
  id: string;
  items: LineItem[];
  subtotal: number;
  total: number;
  tax_total?: number;
  shipping_total?: number;
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
  variant_id: string;
  variant?: {
    id: string;
    title: string;
  };
  thumbnail?: string;
}

// Type Guards für Runtime-Checking
export const isProduct = (obj: any): obj is Product => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
};

export const isCart = (obj: any): obj is Cart => {
  return obj && typeof obj.id === 'string' && Array.isArray(obj.items);
};

// Debug-Funktion (nur in Development)
export const debugTypes = () => {
  if (import.meta.env.DEV) {
    console.log('Type guards available:', { isProduct, isCart });
  }
};
