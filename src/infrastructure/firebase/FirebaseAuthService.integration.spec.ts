import { beforeAll, describe, expect, it } from 'vitest';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseAuthService } from './FirebaseAuthService';
import { createTestFirebaseEnv } from '../../test/integration/firebaseTestEnv';

describe('FirebaseAuthService (integration)', () => {
  let env: ReturnType<typeof createTestFirebaseEnv>;
  let authService: FirebaseAuthService;

  beforeAll(() => {
    env = createTestFirebaseEnv();
    authService = new FirebaseAuthService(env.auth);
  });

  it('returns null when there is no signed-in user', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('maps the signed-in Firebase user to a domain User', async () => {
    await createUserWithEmailAndPassword(
      env.auth,
      'clara@hotel-dashboard.test',
      'super-secret-1',
    );

    const current = authService.getCurrentUser();

    expect(current?.email).toBe('clara@hotel-dashboard.test');
  });

  it('clears the current user after signing out', async () => {
    await signInWithEmailAndPassword(env.auth, 'clara@hotel-dashboard.test', 'super-secret-1');

    await authService.signOut();

    expect(authService.getCurrentUser()).toBeNull();
  });
});
