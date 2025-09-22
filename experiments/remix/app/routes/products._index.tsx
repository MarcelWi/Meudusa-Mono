// routes/products._index.tsx
import { useLoaderData } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router";
import { productsQueryOptions } from '~/lib/queries';
import { fetchProducts } from '~/lib/api';
import { getErrorMessage } from '~/lib/error-handling';
import { ProductGrid } from '~/components/products/ProductGrid';
import { ProductError } from '~/components/products/ProductError';
import { Container } from "~/components/layout/Container";


// ✅ Server lädt Daten vor
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await fetchProducts();
    return { ...data, error: null };
  } catch (error) {
    console.error('Products loader error:', error);
    return {
      products: [],
      count: 0,
      error: getErrorMessage(error)
    };
  }
}

export default function ProductsPage() {
  const loaderData = useLoaderData<typeof loader>();

  // ✅ Query mit Server-Daten als initialData
  const { data } = useQuery({
    ...productsQueryOptions(),
    initialData: loaderData.error ? undefined : {
      products: loaderData.products,
      count: loaderData.count
    },
    staleTime: 1000 * 60 * 5,
  });

  const { products, count } = data || { products: [], count: 0 };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">
        Produkte ({count})
      </h1>

      {loaderData.error ? (
        <ProductError error={loaderData.error} />
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}
