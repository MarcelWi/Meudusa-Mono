// components/CartSheet.tsx
import { useCartStore } from '~/stores/cartStore';
import { useCartSheet } from '~/context/CartSheetContext';
import { Button } from '~/components/ui/Button';

export function CartSheet() {
  const { isOpen, closeCart } = useCartSheet();

  // ✅ Zustand Cart Store
  const {
    cart,
    isLoading,
    error,
    updateItem,
    removeItem,
    getItemCount,
    getSubtotal
  } = useCartStore();

  if (!isOpen) return null;

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Sheet */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">
              Warenkorb {itemCount > 0 && `(${itemCount})`}
            </h2>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
                <span className="ml-2">Lade Warenkorb...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {cart && cart.items && cart.items.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      {item.variant?.title && (
                        <p className="text-xs text-gray-500">{item.variant.title}</p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        €{(item.unit_price / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        title="Entfernen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500">Dein Warenkorb ist leer</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Zwischensumme:</span>
                <span className="font-bold text-lg">
                  €{(subtotal / 100).toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    console.log('Navigate to checkout');
                    // TODO: Navigate to checkout
                  }}
                >
                  Zur Kasse ({itemCount})
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Weiter einkaufen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
