/**
 * OCXP Type Exports
 */

export * from './errors';

/**
 * Project Credentials for frontend authentication
 */
export interface ProjectCredentials {
  url?: string | null;
  username?: string | null;
  password?: string | null;
  login_instructions?: string | null;
  workspace?: string | null;
  project_id?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
