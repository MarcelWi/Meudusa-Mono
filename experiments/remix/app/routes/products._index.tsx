// app/routes/products._index.tsx
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import Medusa from "@medusajs/js-sdk";
import type { HttpTypes } from "@medusajs/types";

// Environment variables
const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

// Medusa Client initialisieren
const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
});

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("Loading products using Medusa JS SDK...");

    // ✅ KORREKT FÜR REMIX: Ohne next-Option
    const { products, count } = await medusaClient.store.product.list();

    // ✅ REMIX CACHING: Statt next.tags verwenden wir HTTP Headers
    // Du könntest hier Custom Headers für Caching setzen
    // responseHeaders.set("Cache-Control", "public, max-age=60, s-maxage=120");

    console.log("Products loaded successfully:", products.length);

    return {
      products: products || [],
      count: count || 0
    };
  } catch (error) {
    console.error("Failed to load products:", error);
    return {
      products: [],
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Typen
interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface LoaderData {
  products: Product[];
  count: number;
  error?: string;
}

export default function ProductsPage() {
  const { products, error, count } = useLoaderData<LoaderData>();

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Produkteee</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Fehler beim Laden: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produkte ({count})</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              {product.description && (
                <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              )}
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded mb-3"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Keine Produkte gefunden.</p>
      )}
    </div>
  );
}