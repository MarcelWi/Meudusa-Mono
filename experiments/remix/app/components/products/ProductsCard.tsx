import type { Product } from '~/lib/types';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/store/products/shorts`} className="block">
        <div className="p-4">
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-3"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>

          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">#{product.id.slice(-6)}</span>
            <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}