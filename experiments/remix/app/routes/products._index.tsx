import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { fetchProducts } from '~/lib/api';
import { logError, getErrorMessage } from '~/lib/error-handling';
import { ProductGrid } from '~/components/products/ProductGrid';
import { ProductError } from '~/components/products/ProductError';
import type { LoaderData } from '~/lib/types';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("Loading products from Medusa backend...");

    const { products, count } = await fetchProducts();
    console.log(`✅ Successfully loaded ${products.length} products`);

    return {
      products,
      count
    };
  } catch (error) {
    logError("ProductsLoader", error);

    return {
      products: [],
      count: 0,
      error: getErrorMessage(error)
    };
  }
}

export default function ProductsPage() {
  const { products, error, count } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Produkte ({count || products.length})</h1>

      {error ? (
        <ProductError error={error} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}