import { defineConfig } from 'cypress';

export default defineConfig({
  pageLoadTimeout: 10000,
  retries: 1,
  viewportHeight: 600,
  viewportWidth: 800,

  e2e: {
    baseUrl: 'http://localhost:9002',
    specPattern: 'cypress/**/*.spec.ts',
  },
});
