// lib/api/products.ts
import { medusaClient } from '~/lib/medusa.client';
import { MedusaError } from './errors';

export interface ProductsQueryParams {
  limit?: number;
  offset?: number;
  category_id?: string;
  collection_id?: string;
  q?: string; // search query
  handle?: string;
  tags?: string[];
  region_id?: string;
}

export const productsApi = {
  /**
   * Get list of products with optional filters
   */
  async getProducts(params: ProductsQueryParams = {}) {
    try {
      console.log('🔍 Fetching products with params:', params);

      const { products, count } = await medusaClient.store.product.list({
        limit: params.limit || 20,
        offset: params.offset || 0,
        category_id: params.category_id,
        collection_id: params.collection_id,
        q: params.q,
        handle: params.handle,
        tags: params.tags,
        region_id: params.region_id,
        // ✅ Fields für vollständige Daten
        fields: '*variants,*variants.prices,*collection,*images,*variants.inventory_quantity,*tags,*categories',
      });

      console.log(`✅ Fetched ${products.length} products (total: ${count})`);
      return { products, count };
    } catch (error: any) {
      console.error('❌ Failed to fetch products:', error);
      throw new MedusaError(
        error?.message || 'Failed to fetch products',
        error?.status,
        'PRODUCTS_FETCH_ERROR',
        'store.product.list'
      );
    }
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string) {
    try {
      console.log('🔍 Fetching product by ID:', id);

      const { product } = await medusaClient.store.product.retrieve(id, {
        fields: '*variants,*variants.prices,*collection,*images,*variants.inventory_quantity,*tags,*categories,*metadata',
      });

      console.log('✅ Product fetched successfully:', product.title);
      return product;
    } catch (error: any) {
      console.error('❌ Failed to fetch product:', error);

      if (error?.status === 404) {
        throw new MedusaError(
          `Product with ID "${id}" not found`,
          404,
          'PRODUCT_NOT_FOUND',
          `store.product.retrieve(${id})`
        );
      }

      throw new MedusaError(
        error?.message || 'Product not found',
        error?.status || 500,
        'PRODUCT_FETCH_ERROR',
        `store.product.retrieve(${id})`
      );
    }
  },

  /**
   * Get single product by handle (URL-friendly identifier)
   */
  async getProductByHandle(handle: string) {
    try {
      console.log('🔍 Fetching product by handle:', handle);

      // ✅ Search by handle with SDK
      const { products } = await medusaClient.store.product.list({
        handle,
        limit: 1,
        fields: '*variants,*variants.prices,*collection,*images,*variants.inventory_quantity,*tags,*categories,*metadata',
      });

      if (!products || products.length === 0) {
        throw new MedusaError(
          `Product with handle "${handle}" not found`,
          404,
          'PRODUCT_NOT_FOUND',
          `store.product.list(handle: ${handle})`
        );
      }

      const product = products[0];
      console.log('✅ Product fetched by handle successfully:', product.title);
      return product;
    } catch (error: any) {
      console.error('❌ Failed to fetch product by handle:', error);

      if (error instanceof MedusaError) {
        throw error;
      }

      throw new MedusaError(
        error?.message || `Product with handle "${handle}" not found`,
        error?.status || 404,
        'PRODUCT_HANDLE_ERROR',
        `store.product.list(handle: ${handle})`
      );
    }
  },

  /**
   * Search products by query
   */
  async searchProducts(query: string, limit: number = 10) {
    try {
      console.log('🔍 Searching products with query:', query);

      const { products } = await medusaClient.store.product.list({
        q: query,
        limit,
        fields: '*variants,*variants.prices,*images',
      });

      console.log(`✅ Found ${products.length} products for query: "${query}"`);
      return products;
    } catch (error: any) {
      console.error('❌ Failed to search products:', error);
      throw new MedusaError(
        error?.message || 'Failed to search products',
        error?.status,
        'PRODUCT_SEARCH_ERROR',
        `store.product.list(q: ${query})`
      );
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, params: Omit<ProductsQueryParams, 'category_id'> = {}) {
    return this.getProducts({
      ...params,
      category_id: categoryId,
    });
  },

  /**
   * Get products by collection
   */
  async getProductsByCollection(collectionId: string, params: Omit<ProductsQueryParams, 'collection_id'> = {}) {
    return this.getProducts({
      ...params,
      collection_id: collectionId,
    });
  },

  /**
   * Get featured/popular products
   */
  async getFeaturedProducts(limit: number = 8) {
    try {
      console.log('🔍 Fetching featured products');

      // This would depend on how you mark products as featured
      // Could be a tag, metadata, or collection
      const { products } = await medusaClient.store.product.list({
        tags: ['featured'], // Example: products tagged as "featured"
        limit,
        fields: '*variants,*variants.prices,*images',
      });

      console.log(`✅ Found ${products.length} featured products`);
      return products;
    } catch (error: any) {
      console.error('❌ Failed to fetch featured products:', error);
      // Fallback to regular products if featured tag doesn't exist
      const { products } = await this.getProducts({ limit });
      return products;
    }
  },
};
