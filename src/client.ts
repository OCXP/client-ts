/**
 * OCXPClient - Custom wrapper for the generated OCXP SDK
 * Provides workspace injection and auth token management
 */

import { createClient, createConfig, type Client, type ClientOptions } from './generated/client';
import * as sdk from './generated/sdk.gen';
import type {
  WriteRequest,
  QueryFilter,
  KbQueryRequest,
  MissionCreate,
  MissionResponse,
  MissionListResponse,
  RegenerateMissionResponse,
  ProjectListResponse,
  ProjectResponse,
  ProjectCreate,
  ProjectUpdate,
  AddRepoRequest,
  AddMissionRequest,
  SetDefaultRepoRequest,
  SessionListResponse,
  SessionResponse,
  SessionMessagesResponse,
  SessionMetadataUpdate,
  SessionForkResponse,
  ForkRequest,
  RepoDownloadResponse,
  RepoStatusResponse,
  RepoListResponse,
  RepoDeleteResponse,
  AuthConfig,
  UserResponse,
  WorkspacesResponse,
  LinkedRepoResponse,
  TokenResponse,
  RefreshResponse,
  ContentTreeResponse,
  // Database types
  DatabaseCreate,
  DatabaseUpdate,
  DatabaseConfigResponse,
  DatabaseListResponse,
  DatabaseSchemaResponse,
  DatabaseSampleResponse,
  // Prototype types
  PrototypeChatListResponse,
  PrototypeChatPreviewResponse,
  PrototypeChatLinkRequest,
  PrototypeChatLinkResponse,
  PrototypeChatSyncRequest,
  PrototypeChatSyncResponse,
  PrototypeChatGetResponse,
  PrototypeChatSyncAsyncRequest,
  PrototypeChatSyncAsyncResponse,
  PrototypeSyncJobStatusResponse,
} from './generated/types.gen';

// Clean return types for SDK methods
export interface ListEntry {
  name: string;
  type: string;
  path: string;
  size?: number;
  mtime?: string;
}

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
  types: Array<{ name: string; description: string }>;
  total: number;
}

// Type for SDK response wrapper
type SdkResponse<T> = { data: T; error: undefined } | { data: undefined; error: unknown };

// Helper to extract data from SDK response
function extractData<T>(response: SdkResponse<T>): T {
  if (response.error) {
    throw new Error(
      typeof response.error === 'object' && response.error !== null
        ? (response.error as { message?: string }).message || JSON.stringify(response.error)
        : String(response.error)
    );
  }
  return response.data as T;
}

export interface OCXPClientOptions {
  /** Base URL of the OCXP server */
  endpoint: string;
  /** Default workspace for all operations */
  workspace?: string;
  /** Static token or async function to get token */
  token?: string | (() => Promise<string>);
}

export type ContentTypeValue = 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';

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
      throwOnError: true,
    });

    this.client = createClient(config);
  }

  /**
   * Get headers including workspace and auth
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'X-Workspace': this.workspace,
    };

    if (this.tokenProvider) {
      const token =
        typeof this.tokenProvider === 'function' ? await this.tokenProvider() : this.tokenProvider;

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
   * Get the underlying client for SDK function calls
   */
  getClient(): Client {
    return this.client;
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
      query: { counts },
      headers,
    });
    const data = extractData(response) as { types: Array<{ name: string; description: string }>; total: number };
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
      path: { content_type: type },
      query: { path, limit },
      headers,
    });
    const data = extractData(response) as { entries: ListEntry[]; cursor?: string; has_more?: boolean; total: number };
    return {
      entries: data.entries || [],
      cursor: data.cursor,
      hasMore: data.has_more || false,
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
      path: { content_type: type, content_id: id },
      headers,
    });
    const data = extractData(response) as { content: string; size?: number; mtime?: string; encoding?: string; metadata?: Record<string, unknown> };
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
      etag?: string;
      ifNotExists?: boolean;
    }
  ): Promise<WriteResult> {
    const headers = await this.getHeaders();
    const body: WriteRequest = {
      content,
      encoding: options?.encoding || 'utf-8',
      etag: options?.etag,
      ifNotExists: options?.ifNotExists,
    };

    const response = await sdk.writeContent({
      client: this.client,
      path: { content_type: type, content_id: id },
      body,
      headers,
    });
    const data = extractData(response) as { path: string; etag?: string };
    return {
      path: data.path || `${type}/${id}`,
      etag: data.etag,
    };
  }

  /**
   * Delete content
   */
  async delete(
    type: ContentTypeValue,
    id: string,
    recursive = false,
    confirm = false
  ): Promise<DeleteResult> {
    const headers = await this.getHeaders();
    const response = await sdk.deleteContent({
      client: this.client,
      path: { content_type: type, content_id: id },
      query: { recursive, confirm },
      headers,
    });
    const data = extractData(response) as { path: string; deleted: boolean };
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
      path: { content_type: type },
      body: { filters: filters || [], limit: limit || 100 },
      headers,
    });
  }

  /**
   * Full-text search
   */
  async search(type: ContentTypeValue, q: string, limit?: number) {
    const headers = await this.getHeaders();
    return sdk.searchContent({
      client: this.client,
      path: { content_type: type },
      query: { q, limit },
      headers,
    });
  }

  // ============== Tree & Stats ==============

  /**
   * Get hierarchical tree structure from S3 context
   * @param includeVersions - If true, includes S3 version IDs for files
   */
  async tree(type: ContentTypeValue, path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getContentTree({
      client: this.client,
      path: { content_type: type },
      query: { path, depth, includeVersions },
      headers,
    });
    return extractData(response) as ContentTreeResponse;
  }

  /**
   * Get content statistics
   */
  async stats(type: ContentTypeValue, path?: string) {
    const headers = await this.getHeaders();
    return sdk.getContentStats({
      client: this.client,
      path: { content_type: type },
      query: { path },
      headers,
    });
  }

  // ============== Bulk Operations ==============

  /**
   * Read multiple items at once
   */
  async bulkRead(type: ContentTypeValue, ids: string[]) {
    const headers = await this.getHeaders();
    return sdk.bulkReadContent({
      client: this.client,
      path: { content_type: type },
      body: { ids },
      headers,
    });
  }

  /**
   * Write multiple items at once
   */
  async bulkWrite(type: ContentTypeValue, items: Array<{ id: string; content: string }>) {
    const headers = await this.getHeaders();
    return sdk.bulkWriteContent({
      client: this.client,
      path: { content_type: type },
      body: { items },
      headers,
    });
  }

  /**
   * Delete multiple items at once
   */
  async bulkDelete(type: ContentTypeValue, ids: string[]) {
    const headers = await this.getHeaders();
    return sdk.bulkDeleteContent({
      client: this.client,
      path: { content_type: type },
      body: { ids },
      headers,
    });
  }

  // ============== Knowledge Base ==============

  /**
   * Semantic search in Knowledge Base with optional external docs fallback
   */
  async kbQuery(
    query: string,
    options?: {
      searchType?: 'SEMANTIC' | 'HYBRID';
      maxResults?: number;
      docId?: string;
      repoIds?: string[];
      projectId?: string;
      missionId?: string;
      /** Enable external docs fallback (Context7, AWS Docs) when KB has no/low results. Default: true */
      enableFallback?: boolean;
      /** Score threshold (0-1) below which fallback triggers. Default: 0.5 */
      fallbackThreshold?: number;
      /** Save external docs to S3 for future KB queries. Default: true */
      persistExternalDocs?: boolean;
    }
  ) {
    const headers = await this.getHeaders();
    const body: KbQueryRequest = {
      query,
      search_type: options?.searchType || 'SEMANTIC',
      max_results: options?.maxResults || 5,
      doc_id: options?.docId,
      repo_ids: options?.repoIds,
      project_id: options?.projectId,
      mission_id: options?.missionId,
      enable_fallback: options?.enableFallback ?? true,
      fallback_threshold: options?.fallbackThreshold ?? 0.5,
      persist_external_docs: options?.persistExternalDocs ?? true,
    };

    const response = await sdk.queryKnowledgeBase({
      client: this.client,
      body,
      headers,
    });
    return extractData(response);
  }

  /**
   * RAG with citations
   */
  async kbRag(query: string, sessionId?: string) {
    const headers = await this.getHeaders();
    const response = await sdk.ragKnowledgeBase({
      client: this.client,
      body: { query, session_id: sessionId },
      headers,
    });
    return extractData(response);
  }

  // ============== Mission Operations ==============

  /**
   * List all missions in workspace
   */
  async listMissions(options?: { projectId?: string; status?: string; limit?: number }): Promise<MissionListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listMissions({
      client: this.client,
      query: {
        project_id: options?.projectId,
        status: options?.status,
        limit: options?.limit,
      },
      headers,
    });
    return extractData(response) as MissionListResponse;
  }

  /**
   * Create a new mission with auto-generated UUID
   */
  async createMission(title: string, description?: string, projectId?: string, goals?: string[]): Promise<MissionResponse> {
    const headers = await this.getHeaders();
    const body: MissionCreate = {
      title,
      description,
      project_id: projectId,
      goals,
    };

    const response = await sdk.createMission({
      client: this.client,
      body,
      headers,
    });
    return extractData(response) as MissionResponse;
  }

  /**
   * Get mission by ID
   */
  async getMission(missionId: string): Promise<MissionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getMission({
      client: this.client,
      path: { mission_id: missionId },
      headers,
    });
    return extractData(response) as MissionResponse;
  }

  /**
   * Update mission
   */
  async updateMission(missionId: string, updates: { title?: string; description?: string; status?: string; progress?: number; notes?: string }): Promise<MissionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.updateMission({
      client: this.client,
      path: { mission_id: missionId },
      body: updates,
      headers,
    });
    return extractData(response) as MissionResponse;
  }

  /**
   * Delete mission
   */
  async deleteMission(missionId: string): Promise<void> {
    const headers = await this.getHeaders();
    await sdk.deleteMission({
      client: this.client,
      path: { mission_id: missionId },
      headers,
    });
  }

  /**
   * Add session to mission
   */
  async addMissionSession(missionId: string, sessionId: string): Promise<MissionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.addSession({
      client: this.client,
      path: { mission_id: missionId },
      body: { session_id: sessionId },
      headers,
    });
    return extractData(response) as MissionResponse;
  }

  /**
   * Remove session from mission
   */
  async removeMissionSession(missionId: string, sessionId: string): Promise<MissionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.removeSession({
      client: this.client,
      path: { mission_id: missionId, session_id: sessionId },
      headers,
    });
    return extractData(response) as MissionResponse;
  }

  /**
   * Regenerate mission - archives old docs and triggers AgentCore
   */
  async regenerateMission(
    missionId: string,
    options?: {
      ticket_id?: string;
      ticket_summary?: string;
      ticket_description?: string;
      archive_old_docs?: boolean;
      auto_increment_version?: boolean;
    }
  ): Promise<RegenerateMissionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.regenerateMission({
      client: this.client,
      path: { mission_id: missionId },
      body: {
        ticket_id: options?.ticket_id,
        ticket_summary: options?.ticket_summary,
        ticket_description: options?.ticket_description,
        archive_old_docs: options?.archive_old_docs ?? true,
        auto_increment_version: options?.auto_increment_version ?? true,
      },
      headers,
    });
    return extractData(response) as RegenerateMissionResponse;
  }

  /**
   * Download mission pack as ZIP file
   * @param missionId - Mission ID
   * @returns Blob containing ZIP file
   */
  async downloadMissionPack(missionId: string): Promise<Blob> {
    const headers = await this.getHeaders();
    const config = this.client.getConfig();
    const baseUrl = config.baseUrl || '';

    // Use fetch directly for blob response
    const response = await fetch(`${baseUrl}/ocxp/mission/${missionId}/download`, {
      method: 'GET',
      headers: {
        ...headers,
        'X-Workspace': this.workspace,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download mission: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
  }

  // ============== Tools ==============

  /**
   * Get mission context for agents
   */
  async getMissionContext(missionId: string) {
    const headers = await this.getHeaders();
    return sdk.getMissionContext({
      client: this.client,
      path: { mission_id: missionId },
      headers,
    });
  }

  // ============== Locking ==============

  /**
   * Acquire exclusive lock on content
   * @param contentType - Content type (e.g., "mission")
   * @param contentId - Content ID (e.g., "my-mission")
   * @param ttl - Lock time-to-live in seconds
   */
  async lock(contentType: string, contentId: string, ttl?: number) {
    const headers = await this.getHeaders();
    return sdk.lockContent({
      client: this.client,
      body: {
        content_type: contentType,
        content_id: contentId,
        ttl,
      },
      headers,
    });
  }

  /**
   * Release exclusive lock
   * @param contentType - Content type
   * @param contentId - Content ID
   */
  async unlock(contentType: string, contentId: string) {
    const headers = await this.getHeaders();
    return sdk.unlockContent({
      client: this.client,
      body: {
        content_type: contentType,
        content_id: contentId,
      },
      headers,
    });
  }

  /**
   * Move/rename content
   * @param source - Source path (e.g., "mission/old-id")
   * @param destination - Destination path (e.g., "mission/new-id")
   * @param overwrite - Whether to overwrite existing content at destination
   */
  async move(source: string, destination: string, overwrite = false) {
    const headers = await this.getHeaders();
    const response = await sdk.moveContent({
      client: this.client,
      body: { source, destination, overwrite },
      headers,
    });
    return extractData(response);
  }

  // ============== GitHub API Proxy ==============

  /**
   * Check if a repository is accessible
   * @param repoUrl - Full GitHub repository URL
   */
  async githubCheckAccess(repoUrl: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubCheckAccess({
      client: this.client,
      body: { repo_url: repoUrl },
      headers,
    });
    return extractData(response);
  }

  /**
   * List branches for a repository
   * @param repoUrl - Full GitHub repository URL
   */
  async githubListBranches(repoUrl: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubListBranches({
      client: this.client,
      body: { repo_url: repoUrl },
      headers,
    });
    return extractData(response);
  }

  /**
   * Get repository contents at a path
   * @param repoUrl - Full GitHub repository URL
   * @param path - Path within the repository
   * @param ref - Git ref (branch, tag, or commit)
   */
  async githubGetContents(repoUrl: string, path = '', ref?: string) {
    const headers = await this.getHeaders();
    const response = await sdk.githubGetContents({
      client: this.client,
      body: { repo_url: repoUrl, path, ref },
      headers,
    });
    return extractData(response);
  }

  // ============== Repository Management ==============

  /**
   * Download repository and trigger vectorization
   * @param repoUrl - Full GitHub repository URL
   * @param branch - Optional branch (default: main)
   * @param options - Download options (mode, repo_type, path)
   */
  async downloadRepository(
    repoUrl: string,
    branch?: string,
    options?: {
      mode?: string;
      repo_type?: 'code' | 'docs' | 'auto' | 'prototype';
      path?: string;
    }
  ): Promise<RepoDownloadResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.downloadRepository({
      client: this.client,
      body: {
        repo_url: repoUrl,
        branch,
        mode: options?.mode,
        repo_type: options?.repo_type,
        path: options?.path,
      },
      headers,
    });
    return extractData(response) as RepoDownloadResponse;
  }

  /**
   * Get repository download status
   */
  async getRepoStatus(jobId: string): Promise<RepoStatusResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getRepoDownloadStatus({
      client: this.client,
      path: { job_id: jobId },
      headers,
    });
    return extractData(response) as RepoStatusResponse;
  }

  /**
   * List all downloaded repositories in workspace
   */
  async listRepos(): Promise<RepoListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listDownloadedRepos({
      client: this.client,
      headers,
    });
    return extractData(response) as RepoListResponse;
  }

  /**
   * Delete a downloaded repository by its UUID
   */
  async deleteRepo(repoId: string): Promise<RepoDeleteResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.deleteRepo({
      client: this.client,
      path: { repo_id: repoId },
      headers,
    });
    return extractData(response) as RepoDeleteResponse;
  }

  // ============== Database Operations ==============

  /**
   * List all database configurations in workspace
   */
  async listDatabases(): Promise<DatabaseListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listDatabases({
      client: this.client,
      headers,
    });
    return extractData(response) as DatabaseListResponse;
  }

  /**
   * Create a new database configuration
   */
  async createDatabase(config: DatabaseCreate): Promise<DatabaseConfigResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.createDatabase({
      client: this.client,
      body: config,
      headers,
    });
    return extractData(response) as DatabaseConfigResponse;
  }

  /**
   * Get database configuration by ID
   */
  async getDatabase(databaseId: string): Promise<DatabaseConfigResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getDatabase({
      client: this.client,
      path: { database_id: databaseId },
      headers,
    });
    return extractData(response) as DatabaseConfigResponse;
  }

  /**
   * Update database configuration
   */
  async updateDatabase(databaseId: string, updates: DatabaseUpdate): Promise<DatabaseConfigResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.updateDatabase({
      client: this.client,
      path: { database_id: databaseId },
      body: updates,
      headers,
    });
    return extractData(response) as DatabaseConfigResponse;
  }

  /**
   * Delete database configuration
   */
  async deleteDatabase(databaseId: string): Promise<void> {
    const headers = await this.getHeaders();
    await sdk.deleteDatabase({
      client: this.client,
      path: { database_id: databaseId },
      headers,
    });
  }

  /**
   * Test database connection
   */
  async testDatabaseConnection(databaseId: string): Promise<{ success: boolean; message: string; latency_ms?: number }> {
    const headers = await this.getHeaders();
    const response = await sdk.testDatabaseConnection({
      client: this.client,
      path: { database_id: databaseId },
      headers,
    });
    return extractData(response) as { success: boolean; message: string; latency_ms?: number };
  }

  /**
   * Get database schema (tables and columns)
   */
  async getDatabaseSchema(databaseId?: string): Promise<DatabaseSchemaResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getSchema({
      client: this.client,
      query: { database_id: databaseId },
      headers,
    });
    return extractData(response) as DatabaseSchemaResponse;
  }

  /**
   * Get sample data from a table
   */
  async getDatabaseSample(tableName: string, databaseId?: string, limit?: number): Promise<DatabaseSampleResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getSample({
      client: this.client,
      path: { table_name: tableName },
      query: { database_id: databaseId, limit },
      headers,
    });
    return extractData(response) as DatabaseSampleResponse;
  }

  /**
   * List all tables in database
   */
  async listDatabaseTables(databaseId?: string): Promise<{ tables: string[] }> {
    const headers = await this.getHeaders();
    const response = await sdk.listTables({
      client: this.client,
      query: { database_id: databaseId },
      headers,
    });
    return extractData(response) as { tables: string[] };
  }

  // ============== Project Operations ==============

  /**
   * List all projects in workspace
   */
  async listProjects(limit?: number): Promise<ProjectListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listProjects({
      client: this.client,
      query: { limit },
      headers,
    });
    return extractData(response) as ProjectListResponse;
  }

  /**
   * Create a new project with auto-generated UUID
   */
  async createProject(name: string, description?: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const body: ProjectCreate = {
      name,
      description,
    };
    const response = await sdk.createProject({
      client: this.client,
      body,
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Get project by ID
   */
  async getProject(projectId: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getProject({
      client: this.client,
      path: { project_id: projectId },
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.updateProject({
      client: this.client,
      path: { project_id: projectId },
      body: updates,
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    const headers = await this.getHeaders();
    await sdk.deleteProject({
      client: this.client,
      path: { project_id: projectId },
      headers,
    });
  }

  /**
   * Add repository to project
   */
  async addProjectRepo(
    projectId: string,
    repoId: string,
    options?: { category?: string; priority?: number; autoInclude?: boolean; branch?: string }
  ): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const body: AddRepoRequest = {
      repo_id: repoId,
      category: options?.category,
      priority: options?.priority,
      auto_include: options?.autoInclude,
      branch: options?.branch,
    };
    const response = await sdk.addLinkedRepo({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Remove repository from project
   */
  async removeProjectRepo(projectId: string, repoId: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.removeLinkedRepo({
      client: this.client,
      path: { project_id: projectId, repo_id: repoId },
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Set default repository for project
   */
  async setDefaultRepo(projectId: string, repoId: string | null): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const body: SetDefaultRepoRequest = { repo_id: repoId };
    const response = await sdk.setDefaultRepo({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Get context repositories for project (auto-include enabled)
   */
  async getContextRepos(projectId: string): Promise<LinkedRepoResponse[]> {
    const headers = await this.getHeaders();
    const response = await sdk.getContextRepos({
      client: this.client,
      path: { project_id: projectId },
      headers,
    });
    const data = extractData(response) as { repos?: LinkedRepoResponse[] };
    return data.repos || [];
  }

  /**
   * Add mission to project
   */
  async addProjectMission(projectId: string, missionId: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const body: AddMissionRequest = { mission_id: missionId };
    const response = await sdk.addMission({
      client: this.client,
      path: { project_id: projectId },
      body,
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  /**
   * Remove mission from project
   */
  async removeProjectMission(projectId: string, missionId: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.removeMission({
      client: this.client,
      path: { project_id: projectId, mission_id: missionId },
      headers,
    });
    return extractData(response) as ProjectResponse;
  }

  // ============== Session Operations ==============

  /**
   * List all sessions in workspace
   */
  async listSessions(limit?: number, status?: string): Promise<SessionListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listSessions({
      client: this.client,
      query: { limit, status },
      headers,
    });
    return extractData(response) as SessionListResponse;
  }

  /**
   * Get session messages
   */
  async getSessionMessages(sessionId: string, limit?: number): Promise<SessionMessagesResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getSessionMessages({
      client: this.client,
      path: { session_id: sessionId },
      query: { limit },
      headers,
    });
    return extractData(response) as SessionMessagesResponse;
  }

  /**
   * Update session metadata
   */
  async updateSessionMetadata(sessionId: string, updates: SessionMetadataUpdate): Promise<SessionResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.updateSessionMetadata({
      client: this.client,
      path: { session_id: sessionId },
      body: updates,
      headers,
    });
    return extractData(response) as SessionResponse;
  }

  /**
   * Fork session
   */
  async forkSession(sessionId: string, missionId: string, forkPoint?: number): Promise<SessionForkResponse> {
    const headers = await this.getHeaders();
    const body: ForkRequest = { mission_id: missionId, fork_point: forkPoint };
    const response = await sdk.forkSession({
      client: this.client,
      path: { session_id: sessionId },
      body,
      headers,
    });
    return extractData(response) as SessionForkResponse;
  }

  /**
   * Archive session
   */
  async archiveSession(sessionId: string): Promise<void> {
    const headers = await this.getHeaders();
    await sdk.archiveSession({
      client: this.client,
      path: { session_id: sessionId },
      headers,
    });
  }

  // ============== Prototype Operations ==============

  /**
   * List all accessible prototype chats from a provider
   * @param provider - Filter by provider (v0, lovable, bolt)
   */
  async listPrototypeChats(provider?: 'v0' | 'lovable' | 'bolt'): Promise<PrototypeChatListResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listPrototypeChats({
      client: this.client,
      query: { provider },
      headers,
    });
    return extractData(response) as PrototypeChatListResponse;
  }

  /**
   * Preview a prototype chat (fetch metadata without linking)
   * @param chatUrl - Chat URL to preview
   * @param provider - Prototype provider (optional, auto-detected from URL)
   */
  async previewPrototypeChat(chatUrl: string, provider?: 'v0' | 'lovable' | 'bolt'): Promise<PrototypeChatPreviewResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.previewPrototypeChat({
      client: this.client,
      body: { chat_url: chatUrl, provider },
      headers,
    });
    return extractData(response) as PrototypeChatPreviewResponse;
  }

  /**
   * Link a prototype chat to a mission
   * @param data - Link request data
   */
  async linkPrototypeChat(data: PrototypeChatLinkRequest): Promise<PrototypeChatLinkResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.linkPrototypeChat({
      client: this.client,
      body: data,
      headers,
    });
    return extractData(response) as PrototypeChatLinkResponse;
  }

  /**
   * Sync/refresh a linked prototype chat
   * @param data - Sync request data
   */
  async syncPrototypeChat(data: PrototypeChatSyncRequest): Promise<PrototypeChatSyncResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.syncPrototypeChat({
      client: this.client,
      body: data,
      headers,
    });
    return extractData(response) as PrototypeChatSyncResponse;
  }

  /**
   * Get stored prototype chat data
   * @param provider - Provider name (v0, lovable, bolt)
   * @param chatId - Chat ID
   * @param options - Optional query parameters
   */
  async getPrototypeChat(
    provider: string,
    chatId: string,
    options?: { projectId?: string; versionId?: string }
  ): Promise<PrototypeChatGetResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getPrototypeChat({
      client: this.client,
      path: { provider, chat_id: chatId },
      query: { project_id: options?.projectId, version_id: options?.versionId },
      headers,
    });
    return extractData(response) as PrototypeChatGetResponse;
  }

  /**
   * Start async prototype chat sync job
   * @param data - Async sync request data
   */
  async syncPrototypeChatAsync(data: PrototypeChatSyncAsyncRequest): Promise<PrototypeChatSyncAsyncResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.syncPrototypeChatAsync({
      client: this.client,
      body: data,
      headers,
    });
    return extractData(response) as PrototypeChatSyncAsyncResponse;
  }

  /**
   * Get sync job status
   * @param jobId - Job ID from async sync response
   */
  async getPrototypeSyncStatus(jobId: string): Promise<PrototypeSyncJobStatusResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getSyncStatus({
      client: this.client,
      path: { job_id: jobId },
      headers,
    });
    return extractData(response) as PrototypeSyncJobStatusResponse;
  }

  // ============== Auth Operations ==============

  /**
   * Get auth configuration (public endpoint)
   */
  async getAuthConfig(): Promise<AuthConfig> {
    const response = await sdk.getAuthConfig({
      client: this.client,
    });
    return extractData(response) as AuthConfig;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.getCurrentUser({
      client: this.client,
      headers,
    });
    return extractData(response) as UserResponse;
  }

  /**
   * List workspaces for authenticated user
   */
  async listWorkspaces(): Promise<WorkspacesResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.listWorkspaces({
      client: this.client,
      headers,
    });
    return extractData(response) as WorkspacesResponse;
  }

  /**
   * Login with username and password (JSON endpoint for programmatic clients)
   * @param username - Cognito username
   * @param password - User password
   * @returns Token response with access_token, refresh_token, and expires_in
   */
  async login(username: string, password: string): Promise<TokenResponse> {
    const response = await sdk.login({
      client: this.client,
      body: { username, password },
    });
    return extractData(response) as TokenResponse;
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - The refresh token from login
   * @returns New access token (refresh token remains the same)
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await sdk.refreshTokens({
      client: this.client,
      body: { refreshToken },
    });
    return extractData(response) as RefreshResponse;
  }

  /**
   * Set GitHub token for the authenticated user
   * Stores the token server-side linked to the Cognito identity
   * @param token - GitHub Personal Access Token
   * @returns Success response
   */
  async setGitHubToken(token: string): Promise<{ success: boolean }> {
    const headers = await this.getHeaders();
    const response = await this.client.request<{ success: boolean } | true, unknown>({
      method: 'PUT',
      url: '/auth/github-token',
      headers,
      body: { github_token: token },
    });
    if (response.error) {
      throw new Error(`Failed to set GitHub token: ${typeof response.error === 'object' ? JSON.stringify(response.error) : response.error}`);
    }
    // Handle case where response.data might be true (boolean) or object
    if (response.data === true) {
      return { success: true };
    }
    return response.data || { success: true };
  }

  /**
   * Get GitHub token status for the authenticated user
   * @returns Token status (configured or not)
   */
  async getGitHubTokenStatus(): Promise<{ configured: boolean; username?: string }> {
    const headers = await this.getHeaders();
    const response = await this.client.request<{ configured: boolean; username?: string }, unknown>({
      method: 'GET',
      url: '/auth/github-token',
      headers,
    });
    if (response.error) {
      throw new Error(`Failed to get GitHub token status: ${typeof response.error === 'object' ? JSON.stringify(response.error) : response.error}`);
    }
    const data = response.data;
    if (data && typeof data === 'object' && 'configured' in data) {
      return data as { configured: boolean; username?: string };
    }
    return { configured: false };
  }

  /**
   * Delete GitHub token for the authenticated user
   * @returns Success response
   */
  async deleteGitHubToken(): Promise<{ success: boolean }> {
    const headers = await this.getHeaders();
    const response = await this.client.request<{ success: boolean } | true, unknown>({
      method: 'DELETE',
      url: '/auth/github-token',
      headers,
    });
    if (response.error) {
      throw new Error(`Failed to delete GitHub token: ${typeof response.error === 'object' ? JSON.stringify(response.error) : response.error}`);
    }
    // Handle case where response.data might be true (boolean) or object
    if (response.data === true) {
      return { success: true };
    }
    return response.data || { success: true };
  }

  // ============== Namespaced Accessors ==============

  private _mission?: MissionNamespace;
  private _project?: ProjectNamespace;
  private _session?: SessionNamespace;
  private _kb?: KBNamespace;
  private _prototype?: PrototypeNamespace;

  /**
   * Mission namespace for convenient mission operations
   * @example ocxp.mission.list({ status: 'pending' })
   */
  get mission(): MissionNamespace {
    if (!this._mission) {
      this._mission = new MissionNamespace(this);
    }
    return this._mission;
  }

  /**
   * Project namespace for convenient project operations
   * @example ocxp.project.list()
   */
  get project(): ProjectNamespace {
    if (!this._project) {
      this._project = new ProjectNamespace(this);
    }
    return this._project;
  }

  /**
   * Session namespace for convenient session operations
   * @example ocxp.session.list({ status: 'active' })
   */
  get session(): SessionNamespace {
    if (!this._session) {
      this._session = new SessionNamespace(this);
    }
    return this._session;
  }

  /**
   * KB namespace for convenient knowledge base operations
   * @example ocxp.kb.query('search term')
   */
  get kb(): KBNamespace {
    if (!this._kb) {
      this._kb = new KBNamespace(this);
    }
    return this._kb;
  }

  /**
   * Prototype namespace for convenient prototype chat operations
   * @example ocxp.prototype.list('v0')
   */
  get prototype(): PrototypeNamespace {
    if (!this._prototype) {
      this._prototype = new PrototypeNamespace(this);
    }
    return this._prototype;
  }
}

// ============== Namespace Classes ==============

/**
 * Mission namespace for convenient mission operations
 */
export class MissionNamespace {
  constructor(private client: OCXPClient) {}

  /**
   * List missions with optional filtering
   * @example ocxp.mission.list({ status: 'active', limit: 10 })
   */
  async list(options?: { projectId?: string; status?: string; limit?: number }): Promise<MissionListResponse> {
    return this.client.listMissions(options);
  }

  /**
   * Get a mission by ID
   * @example ocxp.mission.get('uuid')
   */
  async get(missionId: string): Promise<MissionResponse> {
    return this.client.getMission(missionId);
  }

  /**
   * Create a new mission with auto-generated UUID
   * @example ocxp.mission.create({ title: 'My Mission', description: 'Description' })
   */
  async create(data: { title: string; description?: string; projectId?: string; goals?: string[] }): Promise<MissionResponse> {
    return this.client.createMission(data.title, data.description, data.projectId, data.goals);
  }

  /**
   * Update mission
   */
  async update(missionId: string, updates: { title?: string; description?: string; status?: string; progress?: number; notes?: string }): Promise<MissionResponse> {
    return this.client.updateMission(missionId, updates);
  }

  /**
   * Delete mission
   */
  async delete(missionId: string): Promise<void> {
    return this.client.deleteMission(missionId);
  }

  /**
   * Add session to mission
   */
  async addSession(missionId: string, sessionId: string): Promise<MissionResponse> {
    return this.client.addMissionSession(missionId, sessionId);
  }

  /**
   * Remove session from mission
   */
  async removeSession(missionId: string, sessionId: string): Promise<MissionResponse> {
    return this.client.removeMissionSession(missionId, sessionId);
  }

  /**
   * Regenerate mission - archives old docs and triggers AgentCore
   * @example ocxp.mission.regenerate('uuid', { ticket_id: 'AMC-123' })
   */
  async regenerate(
    missionId: string,
    options?: {
      ticket_id?: string;
      ticket_summary?: string;
      ticket_description?: string;
      archive_old_docs?: boolean;
      auto_increment_version?: boolean;
    }
  ): Promise<RegenerateMissionResponse> {
    return this.client.regenerateMission(missionId, options);
  }

  /**
   * Download mission pack as ZIP
   * @example await ocxp.mission.download('mission-id')
   */
  async download(missionId: string): Promise<Blob> {
    return this.client.downloadMissionPack(missionId);
  }

  /**
   * Get mission context for agents
   * @example ocxp.mission.getContext('uuid')
   */
  async getContext(missionId: string) {
    return this.client.getMissionContext(missionId);
  }

  /**
   * Get mission content tree structure from S3
   * @param includeVersions - If true, includes S3 version IDs for files
   * @example ocxp.mission.tree('mission-id', 5, true)
   */
  async tree(path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse> {
    return this.client.tree('mission', path, depth, includeVersions);
  }
}

/**
 * Project namespace for convenient project operations
 */
export class ProjectNamespace {
  constructor(private client: OCXPClient) {}

  /**
   * List all projects
   * @example ocxp.project.list()
   */
  async list(limit?: number): Promise<ProjectListResponse> {
    return this.client.listProjects(limit);
  }

  /**
   * Get a project by ID
   * @example ocxp.project.get('my-project')
   */
  async get(projectId: string): Promise<ProjectResponse> {
    return this.client.getProject(projectId);
  }

  /**
   * Create a new project with auto-generated UUID
   * @example ocxp.project.create({ name: 'My Project', description: 'Optional description' })
   */
  async create(data: { name: string; description?: string }): Promise<ProjectResponse> {
    return this.client.createProject(data.name, data.description);
  }

  /**
   * Update a project
   */
  async update(projectId: string, data: ProjectUpdate): Promise<ProjectResponse> {
    return this.client.updateProject(projectId, data);
  }

  /**
   * Delete a project
   */
  async delete(projectId: string): Promise<void> {
    return this.client.deleteProject(projectId);
  }

  /**
   * Add a repository to a project
   */
  async addRepo(projectId: string, repoId: string, options?: { category?: string; priority?: number; autoInclude?: boolean; branch?: string }): Promise<ProjectResponse> {
    return this.client.addProjectRepo(projectId, repoId, options);
  }

  /**
   * Remove a repository from a project
   */
  async removeRepo(projectId: string, repoId: string): Promise<ProjectResponse> {
    return this.client.removeProjectRepo(projectId, repoId);
  }

  /**
   * Set the default repository for a project
   */
  async setDefaultRepo(projectId: string, repoId: string | null): Promise<ProjectResponse> {
    return this.client.setDefaultRepo(projectId, repoId);
  }

  /**
   * Get context repositories for a project
   */
  async getContextRepos(projectId: string): Promise<LinkedRepoResponse[]> {
    return this.client.getContextRepos(projectId);
  }

  /**
   * Add a mission to a project
   */
  async addMission(projectId: string, missionId: string): Promise<ProjectResponse> {
    return this.client.addProjectMission(projectId, missionId);
  }

  /**
   * Remove a mission from a project
   */
  async removeMission(projectId: string, missionId: string): Promise<ProjectResponse> {
    return this.client.removeProjectMission(projectId, missionId);
  }

  /**
   * Get project content tree structure from S3
   * @param includeVersions - If true, includes S3 version IDs for files
   * @example ocxp.project.tree('subfolder', 5, true)
   */
  async tree(path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse> {
    return this.client.tree('project', path, depth, includeVersions);
  }
}

/**
 * Session namespace for convenient session operations
 */
export class SessionNamespace {
  constructor(private client: OCXPClient) {}

  /**
   * List sessions with optional filtering
   * @example ocxp.session.list({ status: 'active', limit: 10 })
   */
  async list(options?: { status?: string; limit?: number }): Promise<SessionListResponse> {
    return this.client.listSessions(options?.limit, options?.status);
  }

  /**
   * Get session messages
   * @example ocxp.session.getMessages('session-id')
   */
  async getMessages(sessionId: string): Promise<SessionMessagesResponse> {
    return this.client.getSessionMessages(sessionId);
  }

  /**
   * Update session metadata
   */
  async updateMetadata(sessionId: string, data: SessionMetadataUpdate): Promise<SessionResponse> {
    return this.client.updateSessionMetadata(sessionId, data);
  }

  /**
   * Fork a session
   */
  async fork(sessionId: string, missionId: string, forkPoint?: number): Promise<SessionForkResponse> {
    return this.client.forkSession(sessionId, missionId, forkPoint);
  }

  /**
   * Archive a session
   */
  async archive(sessionId: string): Promise<void> {
    return this.client.archiveSession(sessionId);
  }
}

/**
 * KB namespace for convenient knowledge base operations
 */
export class KBNamespace {
  constructor(private client: OCXPClient) {}

  /**
   * Query the knowledge base with optional filtering and external docs fallback
   * @example ocxp.kb.query('search term', { searchType: 'HYBRID', maxResults: 10 })
   * @example ocxp.kb.query('authentication', { projectId: 'my-project', missionId: 'CTX-123' })
   * @example ocxp.kb.query('strands agent', { enableFallback: true, persistExternalDocs: true })
   */
  async query(query: string, options?: {
    searchType?: 'SEMANTIC' | 'HYBRID';
    maxResults?: number;
    docId?: string;
    repoIds?: string[];
    projectId?: string;
    missionId?: string;
    /** Enable external docs fallback (Context7, AWS Docs) when KB has no/low results. Default: true */
    enableFallback?: boolean;
    /** Score threshold (0-1) below which fallback triggers. Default: 0.5 */
    fallbackThreshold?: number;
    /** Save external docs to S3 for future KB queries. Default: true */
    persistExternalDocs?: boolean;
  }) {
    return this.client.kbQuery(query, options);
  }

  /**
   * RAG query with LLM response and citations
   * @example ocxp.kb.rag('What is OCXP?')
   */
  async rag(query: string, sessionId?: string) {
    return this.client.kbRag(query, sessionId);
  }
}

/**
 * Prototype namespace for convenient prototype chat operations
 */
export class PrototypeNamespace {
  constructor(private client: OCXPClient) {}

  /**
   * List all accessible prototype chats
   * @example ocxp.prototype.list('v0')
   */
  async list(provider?: 'v0' | 'lovable' | 'bolt'): Promise<PrototypeChatListResponse> {
    return this.client.listPrototypeChats(provider);
  }

  /**
   * Preview a prototype chat (fetch metadata without linking)
   * @example ocxp.prototype.preview('https://v0.dev/chat/abc123')
   */
  async preview(chatUrl: string, provider?: 'v0' | 'lovable' | 'bolt'): Promise<PrototypeChatPreviewResponse> {
    return this.client.previewPrototypeChat(chatUrl, provider);
  }

  /**
   * Link a prototype chat to a mission
   * @example ocxp.prototype.link({ mission_id: 'xyz', chat_url: 'https://v0.dev/chat/abc123' })
   */
  async link(data: PrototypeChatLinkRequest): Promise<PrototypeChatLinkResponse> {
    return this.client.linkPrototypeChat(data);
  }

  /**
   * Sync/refresh a linked prototype chat
   * @example ocxp.prototype.sync({ chat_id: 'abc123', mission_id: 'xyz' })
   */
  async sync(data: PrototypeChatSyncRequest): Promise<PrototypeChatSyncResponse> {
    return this.client.syncPrototypeChat(data);
  }

  /**
   * Get stored prototype chat data
   * @example ocxp.prototype.get('v0', 'abc123')
   */
  async get(
    provider: string,
    chatId: string,
    options?: { projectId?: string; versionId?: string }
  ): Promise<PrototypeChatGetResponse> {
    return this.client.getPrototypeChat(provider, chatId, options);
  }

  /**
   * Start async prototype chat sync job
   * @example ocxp.prototype.syncAsync({ chat_id: 'abc123', mission_id: 'xyz', download_files: true })
   */
  async syncAsync(data: PrototypeChatSyncAsyncRequest): Promise<PrototypeChatSyncAsyncResponse> {
    return this.client.syncPrototypeChatAsync(data);
  }

  /**
   * Get sync job status
   * @example ocxp.prototype.getSyncStatus('job-id')
   */
  async getSyncStatus(jobId: string): Promise<PrototypeSyncJobStatusResponse> {
    return this.client.getPrototypeSyncStatus(jobId);
  }
}

/**
 * Create a new OCXP client instance
 */
export function createOCXPClient(options: OCXPClientOptions): OCXPClient {
  return new OCXPClient(options);
}
