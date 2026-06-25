import { User } from '../../domain/entities/User';
import type { AuthStateUnsubscribe, IAuthService } from '../../domain/repositories/IAuthService';

export class InMemoryAuthService implements IAuthService {
  private currentUser: User | null = null;
  private readonly listeners = new Set<(user: User | null) => void>();

  constructor(private readonly googleUser: User = InMemoryAuthService.defaultGoogleUser()) {}

  async signInWithGoogle(): Promise<User> {
    this.currentUser = this.googleUser;
    this.notify();
    return this.currentUser;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): AuthStateUnsubscribe {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  private static defaultGoogleUser(): User {
    return User.create({
      id: 'user-1',
      email: 'clara@hotel-dashboard.test',
      displayName: 'Clara',
    });
  }
}
