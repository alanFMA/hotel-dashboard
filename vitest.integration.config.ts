import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/infrastructure/**/*.integration.spec.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
