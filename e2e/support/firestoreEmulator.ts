export const E2E_PROJECT_ID = 'demo-hotel-dashboard';

export async function clearFirestoreEmulatorData(): Promise<void> {
  await fetch(
    `http://localhost:8080/emulator/v1/projects/${E2E_PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  );
}
