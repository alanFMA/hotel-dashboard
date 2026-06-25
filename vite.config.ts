/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', 'dist', 'src/legacy', 'e2e', 'src/infrastructure'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/domain/**', 'src/application/**'],
      thresholds: {
        lines: 85,
      },
    },
  },
});
