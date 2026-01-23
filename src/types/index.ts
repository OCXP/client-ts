/**
 * OCXP Type Exports
 */

export * from './errors';

/**
 * Project Credentials for frontend authentication
 */
export interface ProjectCredentials {
  url?: string;
  username?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
