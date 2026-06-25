import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <span className="font-display text-xl font-semibold text-ink">Hotel Dashboard</span>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <>
            <span className="text-sm text-muted">{user.displayName ?? user.email}</span>
            <Button type="button" variant="ghost" onClick={() => void signOut()}>
              Sair
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
