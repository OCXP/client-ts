/**
 * OCXPClient - Custom wrapper for the generated OCXP SDK
 * Provides workspace injection and auth token management
 */

import { createClient, createConfig, type Client, type Config, type ClientOptions } from './generated/client';
import * as sdk from './generated/sdk.gen';
import type {
  ContentType2,
  OcxpResponse,
  WriteRequestBody,
  QueryFilter,
  KbQueryRequest,
  DiscoverRequest,
  MissionCreateRequest,
  ListEntry,
  ContentType,
} from './generated/types.gen';

// Clean return types for SDK methods
export interface ListResult {
  entries: ListEntry[];
  cursor?: string | null;
  hasMore: boolean;
  total: number;
}

export interface ReadResult {
  content: string;
  size?: number;
  mtime?: string;
  encoding?: string;
  metadata?: Record<string, unknown>;
}

export interface WriteResult {
  path: string;
  etag?: string;
}

export interface DeleteResult {
  deleted: boolean;
  path: string;
}

export interface ContentTypesResult {
  types: ContentType[];
  total: number;
}

// Type for SDK response wrapper
type SdkResponse<T> = { data: T; error: undefined } | { data: undefined; error: unknown };

// Helper to extract data from SDK response wrapper
function extractData<T, D>(response: SdkResponse<T>): D {
  if (response.error) {
    throw new Error(typeof response.error === 'object' && response.error !== null
      ? (response.error as { message?: string }).message || JSON.stringify(response.error)
      : String(response.error));
  }
  // Response.data is the OcxpResponse, which contains .data with actual payload
  const ocxpResponse = response.data as OcxpResponse;
  if (ocxpResponse?.error) {
    throw new Error(typeof ocxpResponse.error === 'object' && ocxpResponse.error !== null
      ? (ocxpResponse.error as { message?: string }).message || JSON.stringify(ocxpResponse.error)
      : String(ocxpResponse.error));
  }
  return (ocxpResponse?.data || {}) as D;
}

export interface OCXPClientOptions {
  /** Base URL of the OCXP server */
  endpoint: string;
  /** Default workspace for all operations */
  workspace?: string;
  /** Static token or async function to get token */
  token?: string | (() => Promise<string>);
}

export type ContentTypeValue = ContentType2;

/**
 * OCXPClient provides a high-level interface to the OCXP API
 */
export class OCXPClient {
  private client: Client;
  private workspace: string;
  private tokenProvider?: string | (() => Promise<string>);

  constructor(options: OCXPClientOptions) {
    this.workspace = options.workspace || 'dev';
    this.tokenProvider = options.token;

    const config = createConfig<ClientOptions>({
      baseUrl: options.endpoint.replace(/\/$/, ''),
    });

    this.client = createClient(config);
  }

  /**
   * Get authorization headers
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    if (this.tokenProvider) {
      const token = typeof this.tokenProvider === 'function'
        ? await this.tokenProvider()
        : this.tokenProvider;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Set the workspace for subsequent operations
   */
  setWorkspace(workspace: string): void {
    this.workspace = workspace;
  }

  /**
   * Get current workspace
   */
  getWorkspace(): string {
    return this.workspace;
  }

  /**
   * Set the auth token or token provider
   */
  setToken(token: string | (() => Promise<string>)): void {
    this.tokenProvider = token;
  }

  // ============== Content Types ==============

  /**
   * Get available content types with metadata
   */
  async getContentTypes(counts = false): Promise<ContentTypesResult> {
    const headers = await this.getHeaders();
    const response = await sdk.getContentTypes({
      client: this.client,
      query: { workspace: this.workspace, counts },
      headers,
    });
    const data = extractData<unknown, { types?: ContentType[]; total?: number }>(response);
    return {
      types: data.types || [],
      total: data.total || 0,
    };
  }

  // ============== CRUD Operations ==============

  /**
   * List content of a specific type
   */
  async list(type: ContentTypeValue, path?: string, limit?: number): Promise<ListResult> {
    const headers = await this.getHeaders();
    const response = await sdk.listContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path, limit },
      headers,
    });
    const data = extractData<unknown, { entries?: ListEntry[]; cursor?: string | null; hasMore?: boolean; total?: number }>(response);
    return {
      entries: data.entries || [],
      cursor: data.cursor,
      hasMore: data.hasMore || false,
      total: data.total || 0,
    };
  }

  /**
   * Read content by ID
   */
  async read(type: ContentTypeValue, id: string): Promise<ReadResult> {
    const headers = await this.getHeaders();
    const response = await sdk.readContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace },
      headers,
    });
    const data = extractData<unknown, ReadResult>(response);
    return {
      content: data.content || '',
      size: data.size,
      mtime: data.mtime,
      encoding: data.encoding,
      metadata: data.metadata,
    };
  }

  /**
   * Write content
   */
  async write(
    type: ContentTypeValue,
    id: string,
    content: string,
    options?: {
      encoding?: string;
      metadata?: Record<string, unknown>;
      ifNotExists?: boolean;
      etag?: string;
    }
  ): Promise<WriteResult> {
    const headers = await this.getHeaders();
    const body: WriteRequestBody = {
      content,
      ...options,
    };

    const response = await sdk.writeContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace },
      body,
      headers,
    });
    const data = extractData<unknown, WriteResult>(response);
    return {
      path: data.path || `${type}/${id}`,
      etag: data.etag,
    };
  }

  /**
   * Delete content
   */
  async delete(type: ContentTypeValue, id: string, recursive = false, confirm = false): Promise<DeleteResult> {
    const headers = await this.getHeaders();
    const response = await sdk.deleteContent({
      client: this.client,
      path: { type, id },
      query: { workspace: this.workspace, recursive, confirm },
      headers,
    });
    const data = extractData<unknown, DeleteResult>(response);
    return {
      deleted: data.deleted ?? true,
      path: data.path || `${type}/${id}`,
    };
  }

  // ============== Query & Search ==============

  /**
   * Query content with filters
   */
  async query(type: ContentTypeValue, filters?: QueryFilter[], limit?: number) {
    const headers = await this.getHeaders();
    return sdk.queryContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { filters, limit },
      headers,
    });
  }

  /**
   * Full-text search
   */
  async search(type: ContentTypeValue, q: string, fuzzy = false, limit?: number) {
    const headers = await this.getHeaders();
    return sdk.searchContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, q, fuzzy, limit },
      headers,
    });
  }

  // ============== Tree & Stats ==============

  /**
   * Get hierarchical tree structure
   */
  async tree(type: ContentTypeValue, path?: string, depth?: number) {
    const headers = await this.getHeaders();
    return sdk.getContentTree({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path, depth },
      headers,
    });
  }

  /**
   * Get content statistics
   */
  async stats(type: ContentTypeValue, path?: string) {
    const headers = await this.getHeaders();
    return sdk.getContentStats({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace, path },
      headers,
    });
  }

  // ============== Bulk Operations ==============

  /**
   * Read multiple items at once
   */
  async bulkRead(type: ContentTypeValue, ids: string[], options?: { concurrency?: number; continueOnError?: boolean }) {
    const headers = await this.getHeaders();
    return sdk.bulkReadContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { ids, options },
      headers,
    });
  }

  /**
   * Write multiple items at once
   */
  async bulkWrite(
    type: ContentTypeValue,
    items: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>,
    options?: { concurrency?: number; continueOnError?: boolean }
  ) {
    const headers = await this.getHeaders();
    return sdk.bulkWriteContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { items, options },
      headers,
    });
  }

  /**
   * Delete multiple items at once
   */
  async bulkDelete(type: ContentTypeValue, ids: string[], options?: { concurrency?: number; continueOnError?: boolean }) {
    const headers = await this.getHeaders();
    return sdk.bulkDeleteContent({
      client: this.client,
      path: { type },
      query: { workspace: this.workspace },
      body: { ids, options },
      headers,
    });
  }

  // ============== Knowledge Base ==============

  /**
   * Semantic search in Knowledge Base
   */
  async kbQuery(query: string, searchType: 'SEMANTIC' | 'HYBRID' = 'SEMANTIC', maxResults?: number) {
    const headers = await this.getHeaders();
    const body: KbQueryRequest = {
      query,
      searchType,
      maxResults,
    };

    return sdk.queryKnowledgeBase({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers,
    });
  }

  /**
   * RAG with citations
   */
  async kbRag(query: string, sessionId?: string, systemPrompt?: string) {
    const headers = await this.getHeaders();
    return sdk.ragKnowledgeBase({
      client: this.client,
      query: { workspace: this.workspace },
      body: { query, sessionId, systemPrompt },
      headers,
    });
  }

  // ============== Tools ==============

  /**
   * Create a new mission from ticket
   */
  async createMission(ticketId: string, ticketSummary?: string, ticketDescription?: string) {
    const headers = await this.getHeaders();
    const body: MissionCreateRequest = {
      ticket_id: ticketId,
      ticket_summary: ticketSummary,
      ticket_description: ticketDescription,
      workspace: this.workspace,
    };

    return sdk.createMission({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers,
    });
  }

  /**
   * Update mission progress
   */
  async updateMission(missionId: string, updates: Record<string, unknown>) {
    const headers = await this.getHeaders();
    return sdk.updateMission({
      client: this.client,
      path: { id: missionId },
      query: { workspace: this.workspace },
      body: updates,
      headers,
    });
  }

  /**
   * Get mission context for agents
   */
  async getMissionContext(missionId: string) {
    const headers = await this.getHeaders();
    return sdk.getMissionContext({
      client: this.client,
      path: { id: missionId },
      query: { workspace: this.workspace },
      headers,
    });
  }

  /**
   * Discover similar content across types
   */
  async discover(query: string, contentType?: string, maxResults?: number, includeRelated = true) {
    const headers = await this.getHeaders();
    const body: DiscoverRequest = {
      query,
      content_type: contentType,
      max_results: maxResults,
      include_related: includeRelated,
    };

    return sdk.discoverSimilar({
      client: this.client,
      query: { workspace: this.workspace },
      body,
      headers,
    });
  }

  /**
   * Find content by Jira ticket ID
   */
  async findByTicket(ticketId: string) {
    const headers = await this.getHeaders();
    return sdk.findByTicket({
      client: this.client,
      query: { workspace: this.workspace },
      body: { ticket_id: ticketId },
      headers,
    });
  }

  // ============== Locking ==============

  /**
   * Acquire exclusive lock on content
   */
  async lock(path: string, ttl?: number) {
    const headers = await this.getHeaders();
    return sdk.lockContent({
      client: this.client,
      body: { path, ttl },
      headers,
    });
  }

  /**
   * Release exclusive lock
   */
  async unlock(path: string, lockToken: string) {
    const headers = await this.getHeaders();
    return sdk.unlockContent({
      client: this.client,
      body: { path, lockToken },
      headers,
    });
  }

  // ============== GitHub API Proxy ==============

  /**
   * Check if a repository is accessible
   */
  async githubCheckAccess(owner: string, repo: string, githubToken?: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubCheckAccess({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, github_token: githubToken },
      headers,
    });
    return extractData<unknown, {
      accessible: boolean;
      private?: boolean;
      default_branch?: string;
      error?: string;
      rate_limit?: Record<string, unknown>;
    }>(response);
  }

  /**
   * List branches for a repository
   */
  async githubListBranches(owner: string, repo: string, githubToken?: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubListBranches({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, github_token: githubToken },
      headers,
    });
    return extractData<unknown, {
      branches?: string[];
      error?: Record<string, unknown>;
    }>(response);
  }

  /**
   * Get repository contents at a path
   */
  async githubGetContents(owner: string, repo: string, path = '', ref = 'main', githubToken?: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubGetContents({
      client: this.client,
      query: { workspace: this.workspace },
      body: { owner, repo, path, ref, github_token: githubToken },
      headers,
    });
    return extractData<unknown, {
      contents?: unknown;
      error?: Record<string, unknown>;
    }>(response);
  }

  // ============== Repository Management ==============

  /**
   * Download repository and trigger vectorization
   * Uses tarball download for efficiency (single GitHub request)
   */
  async downloadRepository(request: {
    github_url: string;
    repo_id: string;
    branch?: string;
    path?: string; // Filter to subdirectory (e.g., "src/components")
    visibility?: 'public' | 'private';
    trigger_vectorization?: boolean;
    is_private?: boolean;
  }) {
    const headers = await this.getHeaders();
    const response = await sdk.downloadRepository({
      client: this.client,
      query: { workspace: this.workspace },
      body: request,
      headers,
    });
    return extractData<unknown, {
      job_id: string;
      status: string;
      repo_id: string;
    }>(response);
  }

  /**
   * Get repository download/vectorization status
   */
  async getRepoStatus(jobId: string) {
    const headers = await this.getHeaders();
    const response = await sdk.getRepoDownloadStatus({
      client: this.client,
      query: { workspace: this.workspace, job_id: jobId },
      headers,
    });
    return extractData<unknown, {
      job_id: string;
      status: string;
      progress?: number;
      files_processed?: number;
      total_files?: number;
      error?: string;
    }>(response);
  }

  /**
   * List all downloaded repositories in workspace
   */
  async listRepos(options?: { visibility?: 'public' | 'private'; repoId?: string }) {
    const headers = await this.getHeaders();
    const response = await sdk.listDownloadedRepos({
      client: this.client,
      query: {
        workspace: this.workspace,
        visibility: options?.visibility,
        repo_id: options?.repoId,
      },
      headers,
    });
    return extractData<unknown, {
      repos: Array<{
        repo_id: string;
        github_url: string;
        branch: string;
        visibility: 'public' | 'private';
        s3_path: string;
        files_count: number;
        total_size_bytes: number;
        indexed_at: string;
        kb_synced: boolean;
      }>;
      count: number;
    }>(response);
  }
}

/**
 * Create a new OCXP client instance
 */
export function createOCXPClient(options: OCXPClientOptions): OCXPClient {
  return new OCXPClient(options);
}
