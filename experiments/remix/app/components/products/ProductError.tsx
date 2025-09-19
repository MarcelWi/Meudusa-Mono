interface ProductErrorProps {
  error: string;
}

export function ProductError({ error }: ProductErrorProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p className="font-semibold">Fehler beim Laden der Produkte:</p>
      <p>{error}</p>
    </div>
  );
}