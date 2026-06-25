import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { type Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export const TEST_PROJECT_ID = 'demo-hotel-dashboard';

export interface TestFirebaseEnv {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

let instanceCount = 0;

export function createTestFirebaseEnv(): TestFirebaseEnv {
  instanceCount += 1;
  const app = initializeApp(
    { projectId: TEST_PROJECT_ID, apiKey: 'test-api-key' },
    `test-app-${instanceCount}`,
  );
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

  return { app, firestore, auth };
}

export async function clearFirestoreEmulatorData(): Promise<void> {
  await fetch(
    `http://localhost:8080/emulator/v1/projects/${TEST_PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  );
}
