import { User } from '../entities/User';

export type AuthStateUnsubscribe = () => void;

export interface IAuthService {
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): AuthStateUnsubscribe;
}
