import { useState, useEffect } from "react";
import type { Product, ExtendedProductVariant } from '~/lib/types'; // ✅ Import aus types.ts
import { Button } from '~/components/ui/Button';
import { Container } from "~/components/layout/Container";
import AddToCartButton from "~/components/products/AddToCartButton";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  // ✅ State für Client-Server Hydration
  const [isClient, setIsClient] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ExtendedProductVariant | undefined>(
    product.variants?.[0] as ExtendedProductVariant
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ✅ Client-only Aktivierung nach Hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || { url: product.thumbnail };

  // ✅ Typisierte Preis-Logik
  const getVariantPrice = (variant: ExtendedProductVariant | undefined): number | null => {
    if (!variant) return null;

    // Option 1: Neue calculated_price Struktur (bereits in EUR)
    if (variant.calculated_price?.calculated_amount) {
      return variant.calculated_price.calculated_amount;
    }

    // Option 2: Alte prices Array Struktur (in Cents)
    if (variant.prices?.[0]?.amount) {
      return variant.prices[0].amount / 100;
    }

    return null;
  };

  const getOriginalPrice = (variant: ExtendedProductVariant | undefined): number | null => {
    if (!variant?.calculated_price) return null;

    const original = variant.calculated_price.original_amount;
    const current = variant.calculated_price.calculated_amount;

    return original && original > current ? original : null;
  };

  // ✅ Server-safe Zahlenformatierung
  const formatNumber = (num: number): string => {
    if (!isClient) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
      }
      return num.toString();
    }
    return num.toLocaleString('de-DE');
  };

  const price = getVariantPrice(selectedVariant);
  const originalPrice = getOriginalPrice(selectedVariant);
  const hasValidPrice = price && price > 0;
  const inventoryQuantity = selectedVariant?.inventory_quantity ?? 99;
  const isOutOfStock = inventoryQuantity === 0;
  const isLowStock = inventoryQuantity > 0 && inventoryQuantity <= 5;

  return (
    <section className="py-8">
      <Container>
        {/* Debug Info - nur in Development */}
        {/*{import.meta.env.DEV && (*/}
        {/*  <div className="mb-4 p-4 bg-yellow-100 rounded border">*/}
        {/*    <h3 className="font-bold text-yellow-800">Debug Info (Development):</h3>*/}
        {/*    <div className="text-sm mt-2 text-yellow-700 space-y-1">*/}
        {/*      <p><strong>Is Client:</strong> {isClient.toString()}</p>*/}
        {/*      <p><strong>Product title:</strong> {product.title}</p>*/}
        {/*      <p><strong>Selected variant:</strong> {selectedVariant?.title}</p>*/}
        {/*      <p><strong>calculated_amount:</strong> {selectedVariant?.calculated_price?.calculated_amount}</p>*/}
        {/*      <p><strong>original_amount:</strong> {selectedVariant?.calculated_price?.original_amount}</p>*/}
        {/*      <p><strong>Extracted price (EUR):</strong> {price}</p>*/}
        {/*      <p><strong>Original price (EUR):</strong> {originalPrice}</p>*/}
        {/*      <p><strong>Inventory (raw):</strong> {inventoryQuantity}</p>*/}
        {/*      <p><strong>Inventory (formatted):</strong> {formatNumber(inventoryQuantity)}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Produktbilder */}
          <div>
            {/* Haupt-Bild */}
            <div className="relative">
              <img
                src={currentImage.url || product.thumbnail}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
                loading="lazy"
              />

              {/* Stock Badges */}
              {selectedVariant?.inventory_quantity !== undefined && (
                <>
                  {isLowStock && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      Nur noch {formatNumber(inventoryQuantity)} verfügbar
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      Ausverkauft
                    </div>
                  )}
                </>
              )}

              {/* Rabatt-Badge */}
              {originalPrice && price && originalPrice > price && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-full h-20 object-cover rounded cursor-pointer transition-all border-2 ${
                      selectedImageIndex === index
                        ? 'border-blue-500 opacity-100'
                        : 'border-transparent opacity-80 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Produktinformationen */}
          <div className="space-y-6">
            {/* Titel & Untertitel */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-gray-600">{product.subtitle}</p>
              )}
            </div>

            {/* Preis */}
            <div className="flex items-baseline space-x-3">
              {hasValidPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    €{price.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        €{originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                        -{Math.round(((originalPrice - price) / originalPrice) * 100)}% Rabatt
                      </span>
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-gray-600">
                    Preis wird geladen...
                  </span>
                  <p className="text-sm text-gray-500">
                    Region wird konfiguriert
                  </p>
                </div>
              )}
            </div>

            {/* Beschreibung */}
            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Beschreibung</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {/* Varianten Auswahl */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Größe auswählen
                  {selectedVariant && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      (Aktuell: {selectedVariant.title})
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant) => {
                    const extendedVariant = variant as ExtendedProductVariant;
                    const variantPrice = getVariantPrice(extendedVariant);
                    const variantOriginalPrice = getOriginalPrice(extendedVariant);
                    const variantStock = extendedVariant.inventory_quantity ?? 99;
                    const isSelected = selectedVariant?.id === extendedVariant.id;
                    const isVariantOutOfStock = variantStock === 0;

                    return (
                      <button
                        key={extendedVariant.id}
                        onClick={() => setSelectedVariant(extendedVariant)}
                        disabled={isVariantOutOfStock}
                        className={`relative border rounded-lg p-4 text-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : isVariantOutOfStock
                              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}

                        <div className="font-medium text-gray-900 mb-1">
                          {extendedVariant.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          SKU: {extendedVariant.sku}
                        </div>

                        {extendedVariant.inventory_quantity !== undefined && (
                          <div className={`text-xs mb-2 ${
                            variantStock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {variantStock > 0 ?
                              `${formatNumber(variantStock)} verfügbar` :
                              'Ausverkauft'
                            }
                          </div>
                        )}

                        {variantPrice && (
                          <div className="space-y-1">
                            <div className="font-bold text-blue-600">
                              €{variantPrice.toFixed(2)}
                            </div>
                            {variantOriginalPrice && variantOriginalPrice > variantPrice && (
                              <div className="text-xs text-gray-500 line-through">
                                €{variantOriginalPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Collection Info */}
            {product.collection && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📁</span>
                  <div>
                    <p className="text-sm text-gray-600">Aus der Kollektion</p>
                    <p className="font-medium text-gray-900">{product.collection.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full border transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                {selectedVariant && !isOutOfStock && hasValidPrice ? (
                  <AddToCartButton
                    variantId={selectedVariant.id}
                    className="flex-1 h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    showCartAfterAdd={true}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🛒</span>
                      <span>In den Warenkorb - €{price.toFixed(2)}</span>
                    </span>
                  </AddToCartButton>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled
                    className="flex-1 h-12"
                  >
                    {!hasValidPrice ? 'Preis wird geladen...' :
                      isOutOfStock ? 'Ausverkauft' : 'Nicht verfügbar'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 hover:bg-gray-50"
                  onClick={() => {
                    console.log('Add to wishlist:', product.id);
                  }}
                  title="Zur Wunschliste hinzufügen"
                >
                  ♡
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-800 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Kostenloser Versand ab €50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>30 Tage Rückgaberecht</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>2 Jahre Herstellergarantie</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Sichere Zahlung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produktspezifikationen */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Produktinformationen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>📋</span>
                <span>Details</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="text-gray-900 font-mono">{selectedVariant?.sku || 'N/A'}</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gewicht:</span>
                    <span className="text-gray-900">{product.weight}g</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="text-gray-900">{product.material}</span>
                  </div>
                )}
                {product.origin_country && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Herkunftsland:</span>
                    <span className="text-gray-900">{product.origin_country}</span>
                  </div>
                )}
                {selectedVariant?.calculated_price?.currency_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Währung:</span>
                    <span className="text-gray-900 uppercase">
                      {selectedVariant.calculated_price.currency_code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>📦</span>
                <span>Verfügbarkeit</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lagerbestand:</span>
                  <span className={`font-medium ${
                    inventoryQuantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {inventoryQuantity > 0 ?
                      `${formatNumber(inventoryQuantity)} verfügbar` :
                      'Ausverkauft'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bestand verwaltet:</span>
                  <span className="text-gray-900">
                    {selectedVariant?.manage_inventory ? '✓ Ja' : '✗ Nein'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nachbestellung:</span>
                  <span className="text-gray-900">
                    {selectedVariant?.allow_backorder ? '✓ Möglich' : '✗ Nicht möglich'}
                  </span>
                </div>
                {isLowStock && (
                  <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded text-center">
                    ⚠️ Nur noch wenige Exemplare verfügbar!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Erweiterte Produktdetails */}
        {product.metadata && Object.keys(product.metadata).length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2">
              <span>🔧</span>
              <span>Technische Details</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.metadata).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-6 border hover:shadow-sm transition-shadow">
                  <dt className="font-semibold text-gray-900 mb-2 capitalize">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </dt>
                  <dd className="text-gray-700 break-words">{String(value)}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ähnliche Produkte Sektion */}
        {product.collection && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2">
              <span>🔗</span>
              <span>Aus der gleichen Kollektion</span>
            </h2>
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-8 text-center border border-blue-200">
              <div className="mb-4 text-4xl">🛍️</div>
              <p className="text-gray-700 mb-2 font-medium">
                Weitere Produkte aus "{product.collection.title}"
              </p>
              <p className="text-sm text-gray-600">
                Entdecke ähnliche Artikel aus dieser Kollektion
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-white hover:bg-gray-50"
                onClick={() => {
                  console.log('Navigate to collection:', product.collection?.handle);
                }}
              >
                Kollektion ansehen
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
