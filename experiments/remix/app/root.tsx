// root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { Route } from "../.react-router/types/app/+types/root";
import "./app.css";
import { Page } from "~/components/layout/Page";
import { CartSheet } from "~/components/cart/CartSheet";
import { CartSheetProvider } from "~/context/CartSheetContext";
import { useCartStore } from "~/stores/cartStore";
import { useAuthStore } from "~/stores/authStore";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// ✅ QueryClient Provider Component
function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 Minuten
          refetchOnWindowFocus: false,
          retry: 2,
          retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 1,
          onError: (error) => {
            console.error('Mutation error:', error);
          },
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Development Tools nur in Dev-Modus */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// ✅ Auth Initialization Component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    // Check auth status on app start
    console.log('🔐 Initializing auth...');
    checkAuth().catch((err) => {
      console.error('🔐 Auth check failed:', err);
    });
  }, [checkAuth]);

  // ✅ Debug auth status (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔐 Auth Status:', {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        userId: user?.id
      });
    }
  }, [isAuthenticated, user, token]);

  return <>{children}</>;
}

// ✅ Cart Initialization Component
function CartInitializer({ children }: { children: React.ReactNode }) {
  const { initializeCart, cartId, isLoading, error } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // ✅ Initialize cart on app start
  useEffect(() => {
    // Only initialize if we don't have a cart yet
    if (!cartId && !isLoading) {
      console.log('🛒 Initializing cart on app start...');
      initializeCart().catch((err) => {
        console.error('🛒 Cart initialization failed:', err);
      });
    }
  }, [cartId, isLoading, initializeCart]);

  // ✅ Re-initialize cart when user logs in/out
  useEffect(() => {
    if (isAuthenticated && cartId) {
      console.log('🛒 User logged in, refreshing cart...');
      initializeCart().catch((err) => {
        console.error('🛒 Cart refresh after login failed:', err);
      });
    }
  }, [isAuthenticated, initializeCart, cartId]);

  // ✅ Debug cart status (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🛒 Cart Status:', {
        cartId,
        isLoading,
        error,
        isAuthenticated
      });
    }
  }, [cartId, isLoading, error, isAuthenticated]);

  return <>{children}</>;
}

// ✅ Error Recovery Component
function ErrorRecoveryProvider({ children }: { children: React.ReactNode }) {
  const { error: cartError, clearError: clearCartError } = useCartStore();
  const { error: authError, clearError: clearAuthError } = useAuthStore();

  // ✅ Auto-clear errors after timeout
  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => {
        clearCartError();
      }, 10000); // Auto-clear after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [cartError, clearCartError]);

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        clearAuthError();
      }, 8000); // Auto-clear after 8 seconds

      return () => clearTimeout(timer);
    }
  }, [authError, clearAuthError]);

  return <>{children}</>;
}

// ✅ App Initialization Wrapper
function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // App initialization sequence
    const initializeApp = async () => {
      try {
        console.log('🚀 App initialization started');

        // Add any additional initialization here
        // - Theme detection
        // - Feature flags
        // - Analytics setup

        console.log('🚀 App initialization completed');
        setIsAppReady(true);
      } catch (error) {
        console.error('🚀 App initialization failed:', error);
        setIsAppReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">App wird geladen...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ✅ Main Layout Component
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Moderner E-Commerce Shop mit Medusa" />
      <meta name="theme-color" content="#3B82F6" />

      {/* ✅ SEO Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Loogo Shop" />
      <meta name="twitter:card" content="summary_large_image" />

      {/* ✅ Preload critical resources */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      <Meta />
      <Links />
    </head>
    <body>
    {/* ✅ Nested Provider Structure */}
    <QueryProvider>
      <CartSheetProvider>
        <AppInitializer>
          <ErrorRecoveryProvider>
            <AuthInitializer>
              <CartInitializer>
                <Page>
                  {children}
                  {/* ✅ Global Components */}
                  <CartSheet />
                </Page>
              </CartInitializer>
            </AuthInitializer>
          </ErrorRecoveryProvider>
        </AppInitializer>
      </CartSheetProvider>
    </QueryProvider>

    <ScrollRestoration />
    <Scripts />

    {/* ✅ Development Scripts */}
    {import.meta.env.DEV && (
      <script
        dangerouslySetInnerHTML={{
          __html: `
                console.log('🎉 App loaded in development mode');
                console.log('🔧 Available stores:', {
                  cart: window.useCartStore?.getState?.(),
                  auth: window.useAuthStore?.getState?.()
                });
              `,
        }}
      />
    )}
    </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// ✅ Enhanced Error Boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ein unerwarteter Fehler ist aufgetreten.";
  let stack: string | undefined;
  let showDetails = false;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Seite nicht gefunden" : "Fehler";
    details =
      error.status === 404
        ? "Die angeforderte Seite konnte nicht gefunden werden."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
    showDetails = true;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    // TODO: Implement error reporting
    console.error('Error reported:', { message, details, stack });

    // Example: Send to error tracking service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: details,
        fatal: true,
      });
    }
  };

  return (
    <html lang="de">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Fehler - Loogo Shop</title>
      <Meta />
      <Links />
    </head>
    <body>
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* ✅ Error Icon */}
        <div className="text-6xl mb-4">
          {message.includes('404') ? '🔍' : '💥'}
        </div>

        {/* ✅ Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{message}</h1>
        <p className="text-gray-600 mb-6">{details}</p>

        {/* ✅ Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              🏠 Zur Startseite
            </button>

            <button
              onClick={handleRetry}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              🔄 Seite neu laden
            </button>
          </div>

          {/* ✅ Report Error Button */}
          <button
            onClick={handleReportError}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Fehler melden
          </button>
        </div>

        {/* ✅ Stack Trace (Development) */}
        {showDetails && stack && (
          <details className="mt-8 bg-gray-100 rounded-lg p-4 text-left">
            <summary className="cursor-pointer font-semibold mb-2 text-gray-700">
              🔧 Technical Details (Development)
            </summary>
            <pre className="text-xs bg-white rounded border p-3 overflow-x-auto text-gray-800 font-mono">
                  <code>{stack}</code>
                </pre>
          </details>
        )}

        {/* ✅ Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Brauchst du Hilfe? Kontaktiere uns:
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              📧 Support
            </a>
            <a
              href="tel:+49123456789"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              📞 Hotline
            </a>
            <a
              href="/faq"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              ❓ FAQ
            </a>
          </div>
        </div>
      </div>
    </main>

    <ScrollRestoration />
    <Scripts />
    </body>
    </html>
  );
}
