// routes/account.orders.tsx
import { Container } from '~/components/layout/Container';
import { Link } from 'react-router';

export default function OrdersPage() {
  // TODO: Implement orders fetching
  const orders = []; // Placeholder

  return (
    <section className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Meine Bestellungen</h1>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {/* Orders will be displayed here */}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Bestellungen gefunden
              </h2>
              <p className="text-gray-600 mb-6">
                Du hast noch keine Bestellungen aufgegeben.
              </p>
              <Link
                to="/store/products"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Jetzt einkaufen
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
