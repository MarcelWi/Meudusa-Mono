// routes/account.addresses.tsx
import { Container } from '~/components/layout/Container';
import { Button } from '~/components/ui/Button';

export default function AddressesPage() {
  // TODO: Implement address management
  const addresses = []; // Placeholder

  return (
    <section className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Meine Adressen</h1>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Neue Adresse
            </Button>
          </div>

          {addresses.length > 0 ? (
            <div className="space-y-4">
              {/* Addresses will be displayed here */}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📍</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Adressen gespeichert
              </h2>
              <p className="text-gray-600 mb-6">
                Füge deine Lieferadressen hinzu für schnelleren Checkout.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Erste Adresse hinzufügen
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
