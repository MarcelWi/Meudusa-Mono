import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { fetchProductByHandle } from '~/lib/api';
import { logError, getErrorMessage } from '~/lib/error-handling';
import { ProductDetail } from '~/components/products/ProductDetail';
import { ProductError } from '~/components/products/ProductError';
import { ProductSkeleton } from '~/components/products/ProductSkeleton';
import type { Product } from '~/lib/types';

interface LoaderData {
  product?: Product;
  error?: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { handle } = params;

    if (!handle) {
      throw new Error("Product handle is required");
    }

    console.log(`Loading product with handle: ${handle}`);

    const product = await fetchProductByHandle(handle);
    console.log(`✅ Successfully loaded product: ${product.title}`);

    return { product };
  } catch (error) {
    logError("ProductDetailLoader", error);

    return {
      error: getErrorMessage(error)
    };
  }
}

export default function ProductDetailPage() {
  const { product, error } = useLoaderData<LoaderData>();

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ProductError error={error} />
      </div>
    );
  }

  if (!product) {
    return <ProductSkeleton />;
  }

  return <ProductDetail product={product} />;
}