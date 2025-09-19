// routes/account._index.tsx
import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';
import { Container } from '~/components/layout/Container';
import { Button } from '~/components/ui/Button';
import { Link } from 'react-router';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const cartItemCount = getItemCount();

  if (!user) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Anmeldung erforderlich
            </h1>
            <p className="text-gray-600 mb-6">
              Bitte melde dich an, um auf dein Konto zuzugreifen.
            </p>
            <Link
              to="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <section className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* ✅ Account Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Willkommen, {user.first_name}!
            </h1>
            <p className="text-gray-600">
              Verwalte dein Konto und verfolge deine Bestellungen
            </p>
          </div>

          {/* ✅ Account Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-medium">
                  {user.first_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Profil</h3>
                  <p className="text-sm text-gray-600">Persönliche Daten</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>E-Mail:</strong> {user.email}</p>
                {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
              </div>
              <Link
                to="/account/profile"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Profil bearbeiten →
              </Link>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">📦</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bestellungen</h3>
                  <p className="text-sm text-gray-600">Bestellhistorie</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Letzte Bestellung:</strong> Keine Bestellungen</p>
                <p><strong>Gesamt-Bestellungen:</strong> 0</p>
              </div>
              <Link
                to="/account/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bestellungen ansehen →
              </Link>
            </div>

            {/* Cart Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🛒</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Warenkorb</h3>
                  <p className="text-sm text-gray-600">Aktuelle Artikel</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Artikel:</strong> {cartItemCount}</p>
                <p><strong>Status:</strong> {cartItemCount > 0 ? 'Bereit für Checkout' : 'Leer'}</p>
              </div>
              <Link
                to="/store/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {cartItemCount > 0 ? 'Warenkorb ansehen →' : 'Einkaufen gehen →'}
              </Link>
            </div>
          </div>

          {/* ✅ Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Schnellzugriff</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/account/profile"
                className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <span className="text-2xl mb-2">👤</span>
                <span className="text-sm font-medium">Profil</span>
              </Link>

              <Link
                to="/account/orders"
                className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <span className="text-2xl mb-2">📦</span>
                <span className="text-sm font-medium">Bestellungen</span>
              </Link>

              <Link
                to="/account/addresses"
                className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <span className="text-2xl mb-2">📍</span>
                <span className="text-sm font-medium">Adressen</span>
              </Link>

              <button
                onClick={() => {
                  if (confirm('Möchtest du dich wirklich abmelden?')) {
                    logout();
                  }
                }}
                className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-center text-red-600"
              >
                <span className="text-2xl mb-2">🚪</span>
                <span className="text-sm font-medium">Abmelden</span>
              </button>
            </div>
          </div>

          {/* ✅ Recent Activity Placeholder */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Letzte Aktivität</h2>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📈</div>
              <p>Keine Aktivität vorhanden</p>
              <Link
                to="/store/products"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Jetzt einkaufen →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
