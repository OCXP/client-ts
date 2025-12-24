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
  DiscoverRequest,
  MissionCreateRequest,
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
   * Get hierarchical tree structure
   */
  async tree(type: ContentTypeValue, path?: string, depth?: number) {
    const headers = await this.getHeaders();
    return sdk.getContentTree({
      client: this.client,
      path: { content_type: type },
      query: { path, depth },
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
   * Semantic search in Knowledge Base
   */
  async kbQuery(
    query: string,
    searchType: 'SEMANTIC' | 'HYBRID' = 'SEMANTIC',
    maxResults?: number
  ) {
    const headers = await this.getHeaders();
    const body: KbQueryRequest = {
      query,
      search_type: searchType,
      max_results: maxResults || 5,
    };

    return sdk.queryKnowledgeBase({
      client: this.client,
      body,
      headers,
    });
  }

  /**
   * RAG with citations
   */
  async kbRag(query: string, sessionId?: string) {
    const headers = await this.getHeaders();
    return sdk.ragKnowledgeBase({
      client: this.client,
      body: { query, session_id: sessionId },
      headers,
    });
  }

  // ============== Tools ==============

  /**
   * Create a new mission
   */
  async createMission(name: string, description?: string, projectId?: string, goals?: string[]) {
    const headers = await this.getHeaders();
    const body: MissionCreateRequest = {
      name,
      description,
      project_id: projectId,
      goals,
    };

    return sdk.createMission({
      client: this.client,
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
      path: { mission_id: missionId },
      body: updates as { status?: string; progress?: number; context?: Record<string, unknown> },
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
      path: { mission_id: missionId },
      headers,
    });
  }

  /**
   * Discover similar content across types
   */
  async discover(query: string, contentTypes?: string[], limit?: number) {
    const headers = await this.getHeaders();
    const body: DiscoverRequest = {
      query,
      content_types: contentTypes,
      limit,
    };

    return sdk.discoverSimilar({
      client: this.client,
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
      body: { ticket_id: ticketId },
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

  // ============== GitHub API Proxy ==============

  /**
   * Check if a repository is accessible
   * @param repoUrl - Full GitHub repository URL
   */
  async githubCheckAccess(repoUrl: string) {
    const headers = await this.getHeaders();
    return sdk.githubCheckAccess({
      client: this.client,
      body: { repo_url: repoUrl },
      headers,
    });
  }

  /**
   * List branches for a repository
   * @param repoUrl - Full GitHub repository URL
   */
  async githubListBranches(repoUrl: string) {
    const headers = await this.getHeaders();
    return sdk.githubListBranches({
      client: this.client,
      body: { repo_url: repoUrl },
      headers,
    });
  }

  /**
   * Get repository contents at a path
   * @param repoUrl - Full GitHub repository URL
   * @param path - Path within the repository
   * @param ref - Git ref (branch, tag, or commit)
   */
  async githubGetContents(repoUrl: string, path = '', ref?: string) {
    const headers = await this.getHeaders();
    return sdk.githubGetContents({
      client: this.client,
      body: { repo_url: repoUrl, path, ref },
      headers,
    });
  }

  // ============== Repository Management ==============

  /**
   * Download repository and trigger vectorization
   * @param repoUrl - Full GitHub repository URL
   * @param branch - Optional branch (default: main)
   * @param mode - Download mode: full or docs_only
   */
  async downloadRepository(repoUrl: string, branch?: string, mode?: string): Promise<RepoDownloadResponse> {
    const headers = await this.getHeaders();
    const response = await sdk.downloadRepository({
      client: this.client,
      body: { repo_url: repoUrl, branch, mode },
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
   * Delete a downloaded repository
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
   * Create a new project
   */
  async createProject(projectId: string, name: string, description?: string): Promise<ProjectResponse> {
    const headers = await this.getHeaders();
    const body: ProjectCreate = {
      project_id: projectId,
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

  // ============== Documentation Snapshots ==============

  /**
   * Create documentation snapshot
   */
  async createSnapshot(sourceUrl: string, targetPath?: string): Promise<unknown> {
    const headers = await this.getHeaders();
    const response = await sdk.createSnapshot({
      client: this.client,
      body: { source_url: sourceUrl, target_path: targetPath },
      headers,
    });
    return extractData(response);
  }

  /**
   * List documentation snapshots
   */
  async listDocs(): Promise<unknown> {
    const headers = await this.getHeaders();
    const response = await sdk.listDocs({
      client: this.client,
      headers,
    });
    return extractData(response);
  }

  /**
   * Get snapshot status
   */
  async getSnapshotStatus(jobId: string): Promise<unknown> {
    const headers = await this.getHeaders();
    const response = await sdk.getSnapshotStatus({
      client: this.client,
      path: { job_id: jobId },
      headers,
    });
    return extractData(response);
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
}

/**
 * Create a new OCXP client instance
 */
export function createOCXPClient(options: OCXPClientOptions): OCXPClient {
  return new OCXPClient(options);
}
