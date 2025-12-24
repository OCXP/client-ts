/**
 * OCXP Path Utilities
 *
 * Provides path parsing and normalization for OCXP content paths.
 * Paths follow the format: {type}/{id}/{subpath}
 *
 * All content types use singular form:
 * - mission, project, context, sop, repo, artifact, kb, docs
 *
 * Examples:
 * - 'mission/CTX-123/PHASES.md' -> { type: 'mission', id: 'CTX-123/PHASES.md' }
 * - 'mission/' -> { type: 'mission', id: undefined }
 * - 'project/my-project' -> { type: 'project', id: 'my-project' }
 */

import type { ContentTypeValue } from './client';

/**
 * Valid content types for OCXP API
 */
export const VALID_CONTENT_TYPES: ContentTypeValue[] = [
  'mission',
  'project',
  'context',
  'sop',
  'repo',
  'artifact',
  'kb',
  'docs',
];

/**
 * Mapping from plural/alternate forms to canonical singular form
 */
const TYPE_ALIASES: Record<string, ContentTypeValue> = {
  mission: 'mission',
  missions: 'mission',
  project: 'project',
  projects: 'project',
  context: 'context',
  contexts: 'context',
  sop: 'sop',
  sops: 'sop',
  repo: 'repo',
  repos: 'repo',
  artifact: 'artifact',
  artifacts: 'artifact',
  kb: 'kb',
  kbs: 'kb',
  docs: 'docs',
};

/**
 * Parsed path result
 */
export interface ParsedPath {
  /** Content type (mission, project, etc.) */
  type: ContentTypeValue;
  /** Content ID (everything after the type) */
  id: string | undefined;
}

/**
 * Parse a path into content type and id
 *
 * @example
 * parsePath('mission/CTX-123/PHASES.md') // { type: 'mission', id: 'CTX-123/PHASES.md' }
 * parsePath('mission/') // { type: 'mission', id: undefined }
 * parsePath('project/my-project') // { type: 'project', id: 'my-project' }
 * parsePath('context/shared/utils') // { type: 'context', id: 'shared/utils' }
 *
 * Note: Also handles legacy plural forms (missions/, projects/) for backward compatibility.
 *
 * @param path - Path string like 'mission/id/file.md'
 * @returns Parsed path with type and id
 * @throws Error if path is invalid or type is not recognized
 */
export function parsePath(path: string): ParsedPath {
  // Remove leading/trailing slashes for parsing
  const normalized = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const parts = normalized.split('/');

  if (parts.length === 0 || !parts[0]) {
    throw new Error(`Invalid path: ${path}`);
  }

  const typeKey = parts[0].toLowerCase();
  const type = TYPE_ALIASES[typeKey];

  if (!type) {
    throw new Error(
      `Invalid content type: ${parts[0]}. Valid types: ${VALID_CONTENT_TYPES.join(', ')}`
    );
  }

  // Get the id (everything after the type)
  const id = parts.length > 1 ? parts.slice(1).join('/') : undefined;

  return { type, id };
}

/**
 * Normalize path to use singular content type prefixes
 *
 * Legacy S3 storage used plural folders (missions/) but OCXP API uses
 * singular form (mission/). This function converts plural to singular
 * for backward compatibility with legacy data.
 *
 * @example
 * normalizePath('missions/id/file.md') // 'mission/id/file.md'
 * normalizePath('projects/my-project') // 'project/my-project'
 * normalizePath('mission/id/file.md') // 'mission/id/file.md' (already normalized)
 *
 * @param path - Path string to normalize
 * @returns Normalized path with singular type prefix
 */
export function normalizePath(path: string): string {
  return (
    path
      // S3 plural to OCXP singular
      .replace(/^missions\//, 'mission/')
      .replace(/^projects\//, 'project/')
      .replace(/^contexts\//, 'context/')
      .replace(/^sops\//, 'sop/')
      .replace(/^repos\//, 'repo/')
      .replace(/^artifacts\//, 'artifact/')
      .replace(/^kbs\//, 'kb/')
  );
}

/**
 * Check if a content type string is valid
 *
 * @param type - Type string to validate
 * @returns true if valid content type
 */
export function isValidContentType(type: string): type is ContentTypeValue {
  return VALID_CONTENT_TYPES.includes(type as ContentTypeValue);
}

/**
 * Get the canonical content type for a type string (handles aliases)
 *
 * @param type - Type string (may be plural or alias)
 * @returns Canonical content type or undefined if invalid
 */
export function getCanonicalType(type: string): ContentTypeValue | undefined {
  return TYPE_ALIASES[type.toLowerCase()];
}

/**
 * Build a path from type and id
 *
 * @example
 * buildPath('mission', 'CTX-123/PHASES.md') // 'mission/CTX-123/PHASES.md'
 * buildPath('mission') // 'mission/'
 *
 * @param type - Content type
 * @param id - Optional content ID
 * @returns Combined path string
 */
export function buildPath(type: ContentTypeValue, id?: string): string {
  if (id) {
    return `${type}/${id}`;
  }
  return `${type}/`;
}
