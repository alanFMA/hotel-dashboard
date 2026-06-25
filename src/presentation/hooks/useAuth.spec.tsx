import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InMemoryAuthService } from '../../test/doubles/InMemoryAuthService';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('starts unauthenticated when no user is signed in', () => {
    const authService = new InMemoryAuthService();
    const { result } = renderHook(() => useAuth(authService));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('becomes authenticated after a successful Google sign-in', async () => {
    const authService = new InMemoryAuthService();
    const { result } = renderHook(() => useAuth(authService));

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('clara@hotel-dashboard.test');
    expect(result.current.error).toBeNull();
  });

  it('exposes the error from a failed sign-in attempt', async () => {
    const authService = new InMemoryAuthService();
    authService.signInWithGoogle = () => Promise.reject(new Error('Popup closed by user.'));
    const { result } = renderHook(() => useAuth(authService));

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Popup closed by user.');
  });

  it('clears the user after signing out', async () => {
    const authService = new InMemoryAuthService();
    await authService.signInWithGoogle();
    const { result } = renderHook(() => useAuth(authService));

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
