import { Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, status, error, signInWithGoogle } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-4">
      <h1 className="font-display text-3xl font-semibold text-ink">Hotel Dashboard</h1>
      <p className="text-sm text-muted">Acesse o painel administrativo com sua conta Google.</p>
      <Button type="button" onClick={() => void signInWithGoogle()} disabled={status === 'loading'}>
        {status === 'loading' ? 'Entrando...' : 'Entrar com o Google'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </main>
  );
}
