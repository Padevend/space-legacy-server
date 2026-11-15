import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 20000,
    fileParallelism: false,
    include: ['tests/**/*.{test,spec}.ts', 'app/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/legacy/**'],
  },
});
