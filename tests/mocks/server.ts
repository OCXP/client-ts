/**
 * MSW Server Setup
 *
 * Sets up the Mock Service Worker for Node.js tests.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the server with default handlers
export const server = setupServer(...handlers);
