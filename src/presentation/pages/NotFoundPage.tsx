import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Página não encontrada</h1>
      <Link to="/" className="text-sm font-medium text-brand underline">
        Voltar para o painel
      </Link>
    </main>
  );
}
