// components/layout/Page.tsx
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Header } from '~/components/layout/Header';
import { useCartStore } from "~/stores/cartStore";

export interface PageProps {
  className?: string;
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ className, children }) => {
  // ✅ Cart Error Handling
  const { error: cartError, clearError } = useCartStore();

  return (
    <div className={clsx('page-layout flex min-h-screen flex-col bg-highlight-50', className)}>
      {/* ✅ Global Cart Error Banner */}
      {cartError && (
        <div className="bg-red-50 border-b border-red-200 p-3 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-red-800 text-sm font-medium">{cartError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      <Header />

      <main className="flex-auto">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};
