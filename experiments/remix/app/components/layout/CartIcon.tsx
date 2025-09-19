// components/CartIcon.tsx
import { useCartStore } from '~/stores/cartStore';
import { useCartSheet } from '~/context/CartSheetContext';

export function CartIcon() {
  const { getItemCount } = useCartStore();
  const { openCart } = useCartSheet();

  const itemCount = getItemCount();

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <span className="text-2xl">🛒</span>

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
