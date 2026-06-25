import { useCallback, useEffect, useState } from 'react';
import { authService as defaultAuthService } from '../composition/container';
import type { User } from '../../domain/entities/User';
import type { IAuthService } from '../../domain/repositories/IAuthService';

export type AuthStatus = 'idle' | 'loading' | 'error';

export interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(authService: IAuthService = defaultAuthService): UseAuthResult {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => authService.onAuthStateChanged(setUser), [authService]);

  const signInWithGoogle = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      await authService.signInWithGoogle();
      setStatus('idle');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to sign in.');
      setStatus('error');
    }
  }, [authService]);

  const signOut = useCallback(async () => {
    await authService.signOut();
  }, [authService]);

  return { user, isAuthenticated: user !== null, status, error, signInWithGoogle, signOut };
}
