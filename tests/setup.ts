/**
 * Vitest Test Setup
 *
 * Global setup for all tests.
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
