/**
 * OCXPPathService - Path-based wrapper for OCXPClient
 *
 * Provides a simplified interface for file operations using path strings
 * instead of separate type and id parameters.
 *
 * @example
 * ```typescript
 * const service = new OCXPPathService({
 *   endpoint: 'https://api.example.com',
 *   workspace: 'prod',
 *   token: () => authManager.getAccessToken(),
 * });
 *
 * // List operations
 * const entries = await service.list('mission/');
 *
 * // Read operations
 * const file = await service.read('mission/my-mission/PHASES.md');
 *
 * // Write operations
 * await service.write('mission/my-mission/PHASES.md', content);
 * await service.delete('mission/old-mission/README.md');
 * ```
 */

import { OCXPClient, type OCXPClientOptions, type ListResult, type ReadResult, type WriteResult, type DeleteResult } from './client';
import { parsePath, normalizePath } from './path';

/**
 * Entry from list operations
 */
export interface PathEntry {
  /** File or directory name */
  name: string;
  /** Full path */
  path: string;
  /** Entry type */
  type: 'file' | 'directory';
  /** File size in bytes */
  size?: number;
  /** Last modified time (ISO string) */
  mtime?: string;
  /** Content hash */
  hash?: string;
}

/**
 * Read result with path context
 */
export interface PathReadResult {
  /** Original path */
  path: string;
  /** Content type */
  type: string;
  /** File content */
  content: string;
  /** Content encoding */
  encoding: string;
  /** File info */
  info?: {
    path: string;
    size?: number;
    mtime?: string;
  };
}

/**
 * Write options
 */
export interface PathWriteOptions {
  /** Content encoding */
  encoding?: string;
  /** Content type */
  contentType?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
  /** Only write if file doesn't exist */
  ifNotExists?: boolean;
  /** ETag for conditional writes */
  etag?: string;
}

/**
 * Write result
 */
export interface PathWriteResult {
  /** Operation success */
  success: boolean;
  /** Path that was written */
  path: string;
  /** File size after write */
  size?: number;
}

/**
 * Move result
 */
export interface PathMoveResult {
  /** Operation success */
  success: boolean;
  /** Source path */
  sourcePath: string;
  /** Destination path */
  destPath: string;
}

/**
 * File info
 */
export interface PathFileInfo {
  /** File path */
  path: string;
  /** File size in bytes */
  size?: number;
  /** Last modified time (ISO string) */
  mtime?: string;
  /** Content hash */
  hash?: string;
  /** MIME content type */
  contentType?: string;
}

/**
 * List result with path context
 */
export interface PathListResult {
  /** Original path */
  path: string;
  /** List entries */
  entries: PathEntry[];
  /** Pagination cursor */
  cursor?: string | null;
  /** More entries available */
  hasMore?: boolean;
  /** Total count */
  total?: number;
}

/**
 * Path service options (extends client options)
 */
export interface OCXPPathServiceOptions extends OCXPClientOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Token provider function type
 */
export type TokenProvider = () => Promise<string | null>;

/**
 * OCXPPathService - Path-based file operations via OCXP protocol
 *
 * This service wraps OCXPClient and provides a simpler interface using
 * path strings like 'mission/id/file.md' instead of separate type and id.
 */
export class OCXPPathService {
  private client: OCXPClient;
  private readonly endpoint: string;
  private readonly workspace: string;

  constructor(options: OCXPPathServiceOptions) {
    this.endpoint = options.endpoint;
    this.workspace = options.workspace || 'dev';

    this.client = new OCXPClient({
      endpoint: options.endpoint,
      workspace: this.workspace,
      token: options.token,
    });
  }

  // ===========================================================================
  // Read Operations
  // ===========================================================================

  /**
   * List directory contents
   *
   * @param path - Path like 'mission/' or 'project/'
   * @param limit - Maximum entries to return
   * @returns List result with entries
   */
  async list(path: string, limit?: number): Promise<PathListResult> {
    const { type, id } = parsePath(path);

    const result = await this.client.list(type, id, limit);

    return {
      path,
      entries: result.entries.map((entry): PathEntry => ({
        name: entry.name ?? '',
        path: normalizePath(entry.path ?? ''),
        type: entry.type ?? 'file',
        size: entry.size,
        mtime: entry.mtime,
      })),
      cursor: result.cursor,
      hasMore: result.hasMore,
      total: result.total,
    };
  }

  /**
   * Read file content
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @returns Read result with content
   */
  async read(path: string): Promise<PathReadResult> {
    const { type, id } = parsePath(path);

    if (!id) {
      throw new Error(`Cannot read directory path: ${path}`);
    }

    const result = await this.client.read(type, id);

    return {
      path,
      type: 'text',
      content: result.content,
      encoding: result.encoding ?? 'utf-8',
      info: {
        path,
        size: result.size,
        mtime: result.mtime,
      },
    };
  }

  /**
   * Check if path exists
   *
   * @param path - Path to check
   * @returns true if exists
   */
  async exists(path: string): Promise<boolean> {
    try {
      const { type, id } = parsePath(path);

      if (!id) {
        // For directory paths, try list instead
        await this.client.list(type);
        return true;
      }

      await this.client.read(type, id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   *
   * @param path - Path to get info for
   * @returns File info
   */
  async info(path: string): Promise<PathFileInfo> {
    const { type, id } = parsePath(path);

    const result = await this.client.stats(type, id) as unknown as {
      data?: {
        size?: number;
        mtime?: string;
        hash?: string;
        contentType?: string;
      };
    };

    const data = result?.data || {};

    return {
      path,
      size: data.size,
      mtime: data.mtime,
      hash: data.hash,
      contentType: data.contentType,
    };
  }

  // ===========================================================================
  // Write Operations
  // ===========================================================================

  /**
   * Write/update file content
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @param content - File content
   * @param options - Write options
   * @returns Write result
   */
  async write(
    path: string,
    content: string,
    options?: PathWriteOptions
  ): Promise<PathWriteResult> {
    const { type, id } = parsePath(path);

    if (!id) {
      throw new Error(`Cannot write to directory path: ${path}`);
    }

    await this.client.write(type, id, content, {
      encoding: options?.encoding,
      metadata: options?.metadata,
      ifNotExists: options?.ifNotExists,
      etag: options?.etag,
    });

    return {
      success: true,
      path,
    };
  }

  /**
   * Delete a file
   *
   * @param path - Path like 'mission/CTX-123/PHASES.md'
   * @returns Write result
   */
  async delete(path: string): Promise<PathWriteResult> {
    const { type, id } = parsePath(path);

    if (!id) {
      throw new Error(`Cannot delete directory path without id: ${path}`);
    }

    await this.client.delete(type, id);

    return {
      success: true,
      path,
    };
  }

  /**
   * Move/rename a file
   *
   * Implemented as read + write + delete
   *
   * @param sourcePath - Source path
   * @param destPath - Destination path
   * @returns Move result
   */
  async move(sourcePath: string, destPath: string): Promise<PathMoveResult> {
    // Read source content
    const content = await this.read(sourcePath);

    // Write to destination
    await this.write(destPath, content.content);

    // Delete source
    await this.delete(sourcePath);

    return {
      success: true,
      sourcePath,
      destPath,
    };
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  /**
   * Get the underlying OCXPClient
   */
  getClient(): OCXPClient {
    return this.client;
  }

  /**
   * Get the API endpoint
   */
  getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * Get the workspace ID
   */
  getWorkspace(): string {
    return this.workspace;
  }

  /**
   * Update the workspace
   */
  setWorkspace(workspace: string): void {
    this.client.setWorkspace(workspace);
  }

  /**
   * Update the auth token
   */
  setToken(token: string | (() => Promise<string>)): void {
    this.client.setToken(token);
  }
}

/**
 * Create a new OCXPPathService instance
 */
export function createPathService(options: OCXPPathServiceOptions): OCXPPathService {
  return new OCXPPathService(options);
}
