// components/products/AddToCartButton.tsx
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { useCartStore } from "~/stores/cartStore";
import { useCartSheet } from "~/context/CartSheetContext";

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  showCartAfterAdd?: boolean;
}

export default function AddToCartButton({
                                          variantId,
                                          quantity = 1,
                                          disabled = false,
                                          className,
                                          children,
                                          showCartAfterAdd = true,
                                        }: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = useState(false);

  // ✅ Zustand Cart Store
  const {
    addItem,
    isAddingToCart,
    error,
    clearError,
    getItemByVariantId
  } = useCartStore();

  // ✅ Cart Sheet Context
  const { openCart } = useCartSheet();

  // Check if item is already in cart
  const existingItem = getItemByVariantId(variantId);
  const currentQuantity = existingItem?.quantity || 0;

  const handleClick = async () => {
    if (disabled || isAddingToCart) return;

    clearError();

    try {
      await addItem(variantId, quantity);

      // Visual feedback
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      // Show cart after add
      if (showCartAfterAdd) {
        setTimeout(() => openCart(), 300);
      }
    } catch (err) {
      console.error('AddToCartButton error:', err);
    }
  };

  // Button state and styling
  const isDisabled = disabled || isAddingToCart;
  const buttonText = isAddingToCart
    ? 'Wird hinzugefügt...'
    : justAdded
      ? '✓ Hinzugefügt!'
      : currentQuantity > 0
        ? `In Warenkorb (${currentQuantity + quantity})`
        : children || 'In den Warenkorb';

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${className} ${
          justAdded ? 'bg-green-600 hover:bg-green-700' : ''
        } transition-colors duration-200`}
      >
        <span className="flex items-center justify-center space-x-2">
          {isAddingToCart ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>{buttonText}</span>
            </>
          ) : justAdded ? (
            <>
              <span className="text-white">✓</span>
              <span>{buttonText}</span>
            </>
          ) : (
            <>
              <span>🛒</span>
              <span>{buttonText}</span>
            </>
          )}
        </span>
      </Button>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded p-2 border border-red-200">
          {error}
        </div>
      )}

      {/* Current cart status */}
      {currentQuantity > 0 && !isAddingToCart && !justAdded && (
        <div className="text-sm text-green-600 text-center">
          {currentQuantity} bereits im Warenkorb
        </div>
      )}
    </div>
  );
}
