import {
  type Auth,
  type User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { User } from '../../domain/entities/User';
import type { AuthStateUnsubscribe, IAuthService } from '../../domain/repositories/IAuthService';

export class FirebaseAuthService implements IAuthService {
  private readonly provider = new GoogleAuthProvider();

  constructor(private readonly auth: Auth) {}

  async signInWithGoogle(): Promise<User> {
    const credential = await signInWithPopup(this.auth, this.provider);
    const user = this.toDomainUser(credential.user);
    if (!user) {
      throw new Error('Google account did not provide a valid email address.');
    }

    return user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.toDomainUser(this.auth.currentUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): AuthStateUnsubscribe {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      callback(this.toDomainUser(firebaseUser));
    });
  }

  private toDomainUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser?.email) {
      return null;
    }

    return User.create({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    });
  }
}
