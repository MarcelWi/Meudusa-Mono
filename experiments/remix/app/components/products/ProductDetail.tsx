import type { Product } from '~/lib/types';
import { Button } from '~/components/ui/Button';
import { Container } from "~/components/layout/Container";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const mainImage = product.images?.[0];
  const imageUrl = mainImage?.url || product.thumbnail;
  const price = product.variants?.[0]?.prices?.[0]?.amount;

  return (
    <section className={"py-8"}>
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Produktbilder */}
        <div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          )}

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.slice(0, 4).map((image, index) => (
                <img
                  key={image.id || index}
                  src={image.url}
                  alt={image.alt || `${product.title} ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          )}
        </div>

        {/* Produktinformationen */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          {product.subtitle && (
            <p className="text-lg text-gray-600 mb-4">{product.subtitle}</p>
          )}

          {price && (
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">
                €{(price / 100).toFixed(2)}
              </span>
              {product.original_price && product.original_price > price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  €{(product.original_price / 100).toFixed(2)}
                </span>
              )}
            </div>
          )}

          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Varianten Auswahl */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Varianten</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 cursor-pointer"
                  >
                    <p className="font-medium">{variant.title}</p>
                    <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                    <p className="text-sm text-gray-600">
                      Lager: {variant.inventory_quantity} Stück
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button variant={"default"} size="lg">
              Test
            </Button>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              In den Warenkorb
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Merken
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      {product.metadata && Object.keys(product.metadata).length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Produktdetails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.metadata).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <dt className="font-semibold text-gray-900">{key}</dt>
                <dd className="mt-1 text-gray-700">{String(value)}</dd>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
    </section>
  );
}