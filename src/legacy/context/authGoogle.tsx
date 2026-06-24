import React, { useState, createContext, useEffect, ReactNode } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import app from '../lib/firebase';

interface AuthGoogleContextType {
  signed: boolean;
  user: User | null;
  signInGoogle: (callback: () => void) => void;
  signOut: (callback: () => void) => void;
}

interface AuthGoogleProviderProps {
  children: ReactNode;
}

const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext<
  AuthGoogleContextType | undefined
>(undefined);

export const AuthGoogleProvider: React.FC<AuthGoogleProviderProps> = ({
  children,
}) => {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadStorageData = () => {
      const storageUser = sessionStorage.getItem('@AuthFirebase:user');
      const storageToken = sessionStorage.getItem('@AuthFirebase:token');
      if (storageToken && storageUser) {
        setUser(JSON.parse(storageUser));
      }
    };
    loadStorageData();
  }, []);

  const signInGoogle = (callback: () => void) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        setUser(user);
        sessionStorage.setItem('@AuthFirebase:token', token || '');
        sessionStorage.setItem('@AuthFirebase:user', JSON.stringify(user));
        callback(); // Chama o callback após o login bem-sucedido
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  };

  const signOut = (callback: () => void) => {
    firebaseSignOut(auth)
      .then(() => {
        sessionStorage.clear();
        setUser(null);
        callback(); // Chama o callback após o logout bem-sucedido
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  return (
    <AuthGoogleContext.Provider
      value={{
        signed: !!user,
        user,
        signInGoogle,
        signOut,
      }}
    >
      {children}
    </AuthGoogleContext.Provider>
  );
};
