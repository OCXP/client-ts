import { z } from 'zod';

/**
 * WriteRequestBody
 *
 * Request body for POST /ocxp/{type}/{id}.
 *
 * Path parameters (type, id) come from URL, not body.
 */
type WriteRequestBody = {
    /**
     * Content
     *
     * Content to write
     */
    content: string;
    /**
     * Encoding
     *
     * Content encoding
     */
    encoding?: string;
    /**
     * Metadata
     *
     * Optional metadata key-value pairs
     */
    metadata?: {
        [key: string]: unknown;
    };
    /**
     * Ifnotexists
     *
     * Only create if not exists
     */
    ifNotExists?: boolean;
    /**
     * Etag
     *
     * ETag for optimistic locking
     */
    etag?: string | unknown;
};
/**
 * BulkReadRequestBody
 *
 * Request body for POST /ocxp/{type}/bulk/read.
 *
 * Path parameter (type) comes from URL, not body.
 */
type BulkReadRequestBody = {
    /**
     * Ids
     *
     * List of content IDs to read (1-100 items)
     */
    ids: Array<string>;
    /**
     * Options
     *
     * Bulk operation options (concurrency, continueOnError)
     */
    options?: {
        [key: string]: unknown;
    };
};
/**
 * BulkWriteRequestBody
 *
 * Request body for POST /ocxp/{type}/bulk/write.
 *
 * Path parameter (type) comes from URL, not body.
 */
type BulkWriteRequestBody = {
    /**
     * Items
     *
     * List of items to write (1-100 items)
     */
    items: Array<{
        [key: string]: unknown;
    }>;
    /**
     * Options
     *
     * Bulk operation options (concurrency, continueOnError)
     */
    options?: {
        [key: string]: unknown;
    };
};
/**
 * BulkDeleteRequestBody
 *
 * Request body for POST /ocxp/{type}/bulk/delete.
 *
 * Path parameter (type) comes from URL, not body.
 */
type BulkDeleteRequestBody = {
    /**
     * Ids
     *
     * List of content IDs to delete (1-100 items)
     */
    ids: Array<string>;
    /**
     * Options
     *
     * Bulk operation options (concurrency, continueOnError)
     */
    options?: {
        [key: string]: unknown;
    };
};
/**
 * TypedListRequest
 *
 * Request for typed list operations.
 */
type TypedListRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Path
     *
     * Subpath to list
     */
    path?: string;
    /**
     * Limit
     *
     * Maximum entries to return
     */
    limit?: number;
    /**
     * Cursor
     *
     * Pagination cursor
     */
    cursor?: string | unknown;
};
/**
 * TypedQueryRequest
 *
 * Request for typed query operations.
 */
type TypedQueryRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Filters
     *
     * Query filters
     */
    filters?: Array<{
        [key: string]: unknown;
    }>;
    /**
     * Limit
     *
     * Maximum entries to return
     */
    limit?: number;
};
/**
 * TypedSearchRequest
 *
 * Request for typed search operations.
 */
type TypedSearchRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Q
     *
     * Search query
     */
    q: string;
    /**
     * Fuzzy
     *
     * Enable fuzzy matching
     */
    fuzzy?: string;
    /**
     * Limit
     *
     * Maximum entries to return
     */
    limit?: number;
};
/**
 * TypedFindByRequest
 *
 * Request for typed findBy operations.
 */
type TypedFindByRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Field
     *
     * Field to search
     */
    field: string;
    /**
     * Value
     *
     * Value to match
     */
    value: string;
};
/**
 * TypedTreeRequest
 *
 * Request for tree operations.
 */
type TypedTreeRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Path
     *
     * Root path for tree
     */
    path?: string;
    /**
     * Depth
     *
     * Maximum tree depth
     */
    depth?: number;
};
/**
 * TypedStatsRequest
 *
 * Request for stats operations.
 */
type TypedStatsRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Path
     *
     * Path to calculate stats for
     */
    path?: string;
};
/**
 * TypedDeleteRequest
 *
 * Request for typed delete operations.
 */
type TypedDeleteRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Id
     *
     * Content identifier
     */
    id: string;
    /**
     * Recursive
     *
     * Delete recursively
     */
    recursive?: string;
    /**
     * Confirm
     *
     * Confirm recursive delete
     */
    confirm?: string;
};
/**
 * DownloadRequest
 *
 * Request for bulk download operations.
 */
type DownloadRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Id
     *
     * Content identifier
     */
    id: string;
    /**
     * Options
     *
     * Download options (skipPatterns, maxFiles, maxSize)
     */
    options?: {
        [key: string]: unknown;
    };
};
/**
 * PresignedUrlRequest
 *
 * Request for presigned URL generation.
 */
type PresignedUrlRequest = {
    /**
     * Type
     *
     * Content type (mission, project, context, sop, repo, artifact)
     */
    type: string;
    /**
     * Id
     *
     * Content identifier
     */
    id: string;
    /**
     * Operation
     *
     * Operation type (get or put)
     */
    operation?: string;
    /**
     * Expiresin
     *
     * URL expiry in seconds
     */
    expiresIn?: number;
};
/**
 * RepoDownloadRequest
 *
 * Request model for repository download operation.
 *
 * Supports both full repo and docs-only download modes with
 * configurable file filtering and visibility routing.
 */
type RepoDownloadRequest$1 = {
    /**
     * Github Url
     *
     * GitHub repository URL (https://github.com/org/repo)
     */
    github_url: string;
    /**
     * Branch
     *
     * Branch to download
     */
    branch?: string;
    /**
     * Path
     *
     * Subdirectory path to filter (e.g., 'src/components'). If set, only files under this path are indexed.
     */
    path?: string | unknown;
    /**
     * Repo Id
     *
     * Repository identifier (lowercase alphanumeric with hyphens)
     */
    repo_id: string;
    mode?: DownloadMode;
    /**
     * Include Extensions
     *
     * File extensions to include
     */
    include_extensions?: Array<string>;
    /**
     * Exclude Patterns
     *
     * Patterns to exclude
     */
    exclude_patterns?: Array<string>;
    /**
     * Max File Size Kb
     *
     * Maximum file size in KB to process
     */
    max_file_size_kb?: number;
    visibility?: RepoVisibility;
    /**
     * Trigger Vectorization
     *
     * Trigger Bedrock KB sync after upload
     */
    trigger_vectorization?: boolean;
    /**
     * Generate Metadata
     *
     * Generate Bedrock-compatible metadata.json sidecars
     */
    generate_metadata?: boolean;
    /**
     * Is Private
     *
     * Private repo requiring GitHub token
     */
    is_private?: boolean;
};
/**
 * DownloadMode
 *
 * Repository download mode.
 */
type DownloadMode = 'full' | 'docs_only';
/**
 * RepoVisibility
 *
 * Repository visibility for storage routing.
 */
type RepoVisibility = 'private' | 'public';
/**
 * GitHubCheckAccessRequest
 *
 * Request to check repository access.
 *
 * Used to verify if the user can access a repository
 * before attempting to download it.
 */
type GitHubCheckAccessRequest = {
    /**
     * Owner
     *
     * Repository owner (user or org)
     */
    owner: string;
    /**
     * Repo
     *
     * Repository name
     */
    repo: string;
    /**
     * Github Token
     *
     * Personal Access Token for private repos
     */
    github_token?: string | unknown;
};
/**
 * GitHubCheckAccessResponse
 *
 * Response from repository access check.
 */
type GitHubCheckAccessResponse = {
    /**
     * Accessible
     *
     * Whether the repo is accessible
     */
    accessible: boolean;
    /**
     * Private
     *
     * Whether the repo is private
     */
    private?: boolean | unknown;
    /**
     * Default Branch
     *
     * Default branch name
     */
    default_branch?: string | unknown;
    /**
     * Error
     *
     * Error type: not_found, invalid_token, access_denied, rate_limited, unknown
     */
    error?: string | unknown;
    /**
     * Rate Limit
     *
     * Rate limit info when rate_limited
     */
    rate_limit?: {
        [key: string]: unknown;
    } | unknown;
};
/**
 * GitHubListBranchesRequest
 *
 * Request to list repository branches.
 *
 * Used to populate branch dropdown in the UI.
 */
type GitHubListBranchesRequest = {
    /**
     * Owner
     *
     * Repository owner (user or org)
     */
    owner: string;
    /**
     * Repo
     *
     * Repository name
     */
    repo: string;
    /**
     * Github Token
     *
     * Personal Access Token for private repos
     */
    github_token?: string | unknown;
};
/**
 * GitHubListBranchesResponse
 *
 * Response from branch listing.
 */
type GitHubListBranchesResponse = {
    /**
     * Branches
     *
     * List of branch names
     */
    branches?: Array<string> | unknown;
    /**
     * Error
     *
     * Error details if failed
     */
    error?: {
        [key: string]: unknown;
    } | unknown;
};
/**
 * GitHubGetContentsRequest
 *
 * Request to get repository contents.
 *
 * Used to browse repository files and folders.
 */
type GitHubGetContentsRequest = {
    /**
     * Owner
     *
     * Repository owner (user or org)
     */
    owner: string;
    /**
     * Repo
     *
     * Repository name
     */
    repo: string;
    /**
     * Path
     *
     * Path within repository
     */
    path?: string;
    /**
     * Ref
     *
     * Branch, tag, or commit SHA
     */
    ref?: string;
    /**
     * Github Token
     *
     * Personal Access Token for private repos
     */
    github_token?: string | unknown;
};
/**
 * GitHubGetContentsResponse
 *
 * Response from contents request.
 */
type GitHubGetContentsResponse = {
    /**
     * Contents
     *
     * File content or directory listing
     */
    contents?: unknown;
    /**
     * Error
     *
     * Error details if failed
     */
    error?: {
        [key: string]: unknown;
    } | unknown;
};
/**
 * Standard OCXP response wrapper
 */
type OcxpResponse = {
    success?: boolean;
    data?: {
        [key: string]: unknown;
    };
    error?: {
        [key: string]: unknown;
    } | null;
    notifications?: Array<{
        [key: string]: unknown;
    }>;
    meta?: {
        requestId?: string;
        timestamp?: string;
        durationMs?: number;
        operation?: string;
    };
};
/**
 * Content type metadata from /ocxp/types
 */
type ContentType = {
    name?: string;
    description?: string;
    prefix?: string | null;
    isVirtual?: boolean;
    isGlobal?: boolean;
    count?: number | null;
    endpoints?: {
        [key: string]: unknown;
    };
};
/**
 * Entry from list operations
 */
type ListEntry = {
    name?: string;
    type?: 'file' | 'directory';
    path?: string;
    size?: number;
    mtime?: string;
};
/**
 * Filter for query operations
 */
type QueryFilter = {
    field?: string;
    operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith';
    value?: unknown;
};
/**
 * Knowledge Base query request
 */
type KbQueryRequest = {
    query: string;
    searchType?: 'SEMANTIC' | 'HYBRID';
    maxResults?: number;
    filters?: {
        [key: string]: unknown;
    };
};
/**
 * Discovery request for finding similar content
 */
type DiscoverRequest = {
    query: string;
    content_type?: string;
    include_related?: boolean;
    max_results?: number;
};
/**
 * Create mission from Jira ticket
 */
type MissionCreateRequest = {
    ticket_id: string;
    ticket_summary?: string;
    ticket_description?: string;
    workspace?: string;
};
/**
 * Response from repo download operation
 */
type RepoDownloadResponse$1 = {
    repo_id?: string;
    job_id?: string;
    s3_path?: string;
    status?: 'queued' | 'processing' | 'uploading' | 'vectorizing' | 'complete' | 'failed';
    files_processed?: number;
    metadata_files_created?: number;
    ingestion_job_id?: string | null;
};
/**
 * Response from repo status check
 */
type RepoStatusResponse$1 = {
    job_id?: string;
    status?: 'queued' | 'processing' | 'uploading' | 'vectorizing' | 'complete' | 'failed';
    progress?: number;
    files_processed?: number;
    total_files?: number;
    error?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
};
/**
 * Repository list entry
 */
type RepoListItem$1 = {
    repo_id?: string;
    github_url?: string;
    branch?: string;
    visibility?: 'private' | 'public';
    mode?: 'full' | 'docs_only';
    files_count?: number;
    last_synced?: string;
    s3_path?: string;
};
/**
 * Content type
 */
type ContentType2 = 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
type GetContentTypesData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        counts?: boolean;
    };
    url: '/ocxp/types';
};
type GetContentTypesResponses = {
    /**
     * List of content types
     */
    200: OcxpResponse & {
        data?: {
            types?: Array<ContentType>;
            total?: number;
        };
    };
};
type GetContentTypesResponse = GetContentTypesResponses[keyof GetContentTypesResponses];
type ListContentData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        path?: string;
        limit?: number;
    };
    url: '/ocxp/{type}/list';
};
type ListContentResponses = {
    /**
     * List of entries
     */
    200: OcxpResponse;
};
type ListContentResponse = ListContentResponses[keyof ListContentResponses];
type DeleteContentData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
        /**
         * Content identifier
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        recursive?: boolean;
        confirm?: boolean;
    };
    url: '/ocxp/{type}/{id}';
};
type DeleteContentResponses = {
    /**
     * Delete result
     */
    200: OcxpResponse;
};
type DeleteContentResponse = DeleteContentResponses[keyof DeleteContentResponses];
type ReadContentData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
        /**
         * Content identifier
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/{id}';
};
type ReadContentResponses = {
    /**
     * Content data
     */
    200: OcxpResponse;
};
type ReadContentResponse = ReadContentResponses[keyof ReadContentResponses];
type WriteContentData = {
    body: WriteRequestBody;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
        /**
         * Content identifier
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/{id}';
};
type WriteContentResponses = {
    /**
     * Write result
     */
    200: OcxpResponse;
};
type WriteContentResponse = WriteContentResponses[keyof WriteContentResponses];
type QueryContentData = {
    body?: {
        filters?: Array<QueryFilter>;
        limit?: number;
    };
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/query';
};
type QueryContentResponses = {
    /**
     * Query results
     */
    200: OcxpResponse;
};
type QueryContentResponse = QueryContentResponses[keyof QueryContentResponses];
type SearchContentData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query: {
        /**
         * Workspace ID
         */
        workspace?: string;
        q: string;
        fuzzy?: boolean;
        limit?: number;
    };
    url: '/ocxp/{type}/search';
};
type SearchContentResponses = {
    /**
     * Search results
     */
    200: OcxpResponse;
};
type SearchContentResponse = SearchContentResponses[keyof SearchContentResponses];
type GetContentTreeData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        path?: string;
        depth?: number;
    };
    url: '/ocxp/{type}/tree';
};
type GetContentTreeResponses = {
    /**
     * Tree structure
     */
    200: OcxpResponse;
};
type GetContentTreeResponse = GetContentTreeResponses[keyof GetContentTreeResponses];
type GetContentStatsData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        path?: string;
    };
    url: '/ocxp/{type}/stats';
};
type GetContentStatsResponses = {
    /**
     * Statistics
     */
    200: OcxpResponse;
};
type GetContentStatsResponse = GetContentStatsResponses[keyof GetContentStatsResponses];
type BulkReadContentData = {
    body: BulkReadRequestBody;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/bulk/read';
};
type BulkReadContentResponses = {
    /**
     * Bulk read results
     */
    200: OcxpResponse;
};
type BulkReadContentResponse = BulkReadContentResponses[keyof BulkReadContentResponses];
type BulkWriteContentData = {
    body: BulkWriteRequestBody;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/bulk/write';
};
type BulkWriteContentResponses = {
    /**
     * Bulk write results
     */
    200: OcxpResponse;
};
type BulkWriteContentResponse = BulkWriteContentResponses[keyof BulkWriteContentResponses];
type BulkDeleteContentData = {
    body: BulkDeleteRequestBody;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/bulk/delete';
};
type BulkDeleteContentResponses = {
    /**
     * Bulk delete results
     */
    200: OcxpResponse;
};
type BulkDeleteContentResponse = BulkDeleteContentResponses[keyof BulkDeleteContentResponses];
type QueryKnowledgeBaseData = {
    body: KbQueryRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/kb/query';
};
type QueryKnowledgeBaseResponses = {
    /**
     * KB query results
     */
    200: OcxpResponse;
};
type QueryKnowledgeBaseResponse = QueryKnowledgeBaseResponses[keyof QueryKnowledgeBaseResponses];
type RagKnowledgeBaseData = {
    body: {
        query: string;
        sessionId?: string;
        systemPrompt?: string;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/kb/rag';
};
type RagKnowledgeBaseResponses = {
    /**
     * RAG response with citations
     */
    200: OcxpResponse;
};
type RagKnowledgeBaseResponse = RagKnowledgeBaseResponses[keyof RagKnowledgeBaseResponses];
type DownloadRepositoryData = {
    body: RepoDownloadRequest$1;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/repo/download';
};
type DownloadRepositoryResponses = {
    /**
     * Download job started
     */
    200: OcxpResponse & {
        data?: RepoDownloadResponse$1;
    };
};
type DownloadRepositoryResponse = DownloadRepositoryResponses[keyof DownloadRepositoryResponses];
type GetRepoDownloadStatusData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Job ID from download request
         */
        job_id: string;
    };
    url: '/ocxp/repo/status';
};
type GetRepoDownloadStatusResponses = {
    /**
     * Job status
     */
    200: OcxpResponse & {
        data?: RepoStatusResponse$1;
    };
};
type GetRepoDownloadStatusResponse = GetRepoDownloadStatusResponses[keyof GetRepoDownloadStatusResponses];
type ListDownloadedReposData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Filter by repo ID
         */
        repo_id?: string;
        /**
         * Filter by visibility
         */
        visibility?: 'private' | 'public';
    };
    url: '/ocxp/repo/list';
};
type ListDownloadedReposResponses = {
    /**
     * List of repos
     */
    200: OcxpResponse & {
        data?: {
            repos?: Array<RepoListItem$1>;
            count?: number;
        };
    };
};
type ListDownloadedReposResponse = ListDownloadedReposResponses[keyof ListDownloadedReposResponses];
type GithubCheckAccessData = {
    body: GitHubCheckAccessRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/github/check_access';
};
type GithubCheckAccessResponses = {
    /**
     * Access check result
     */
    200: OcxpResponse & {
        data?: GitHubCheckAccessResponse;
    };
};
type GithubCheckAccessResponse = GithubCheckAccessResponses[keyof GithubCheckAccessResponses];
type GithubListBranchesData = {
    body: GitHubListBranchesRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/github/list_branches';
};
type GithubListBranchesResponses = {
    /**
     * Branch list
     */
    200: OcxpResponse & {
        data?: GitHubListBranchesResponse;
    };
};
type GithubListBranchesResponse = GithubListBranchesResponses[keyof GithubListBranchesResponses];
type GithubGetContentsData = {
    body: GitHubGetContentsRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/github/get_contents';
};
type GithubGetContentsResponses = {
    /**
     * Repository contents
     */
    200: OcxpResponse & {
        data?: GitHubGetContentsResponse;
    };
};
type GithubGetContentsResponse = GithubGetContentsResponses[keyof GithubGetContentsResponses];
type CreateMissionData = {
    body: MissionCreateRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/mission/create';
};
type CreateMissionResponses = {
    /**
     * Created mission
     */
    200: OcxpResponse;
};
type CreateMissionResponse = CreateMissionResponses[keyof CreateMissionResponses];
type UpdateMissionData = {
    body?: {
        [key: string]: unknown;
    };
    path: {
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/mission/{id}/update';
};
type UpdateMissionResponses = {
    /**
     * Updated mission
     */
    200: OcxpResponse;
};
type UpdateMissionResponse = UpdateMissionResponses[keyof UpdateMissionResponses];
type GetMissionContextData = {
    body?: never;
    path: {
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/mission/{id}/context';
};
type GetMissionContextResponses = {
    /**
     * Mission context
     */
    200: OcxpResponse;
};
type GetMissionContextResponse = GetMissionContextResponses[keyof GetMissionContextResponses];
type DiscoverSimilarData = {
    body: DiscoverRequest;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/discover';
};
type DiscoverSimilarResponses = {
    /**
     * Discovery results
     */
    200: OcxpResponse;
};
type DiscoverSimilarResponse = DiscoverSimilarResponses[keyof DiscoverSimilarResponses];
type FindByTicketData = {
    body: {
        ticket_id: string;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/discover/ticket';
};
type FindByTicketResponses = {
    /**
     * Ticket-related content
     */
    200: OcxpResponse;
};
type FindByTicketResponse = FindByTicketResponses[keyof FindByTicketResponses];
type DeleteRepositoryData = {
    body: {
        /**
         * Repository identifier to delete
         */
        repo_id: string;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/repo/delete';
};
type DeleteRepositoryResponses = {
    /**
     * Repository deleted
     */
    200: OcxpResponse;
};
type DeleteRepositoryResponse = DeleteRepositoryResponses[keyof DeleteRepositoryResponses];
type CheckRepoExistsData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Repository identifier to check
         */
        repo_id: string;
    };
    url: '/ocxp/repo/exists';
};
type CheckRepoExistsResponses = {
    /**
     * Existence check result
     */
    200: OcxpResponse & {
        data?: {
            exists?: boolean;
            repo_id?: string;
        };
    };
};
type CheckRepoExistsResponse = CheckRepoExistsResponses[keyof CheckRepoExistsResponses];
type MoveContentData = {
    body: {
        /**
         * Source path
         */
        from_path: string;
        /**
         * Destination path
         */
        to_path: string;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/move';
};
type MoveContentResponses = {
    /**
     * Move result
     */
    200: OcxpResponse;
};
type MoveContentResponse = MoveContentResponses[keyof MoveContentResponses];
type LockContentData = {
    body?: {
        path: string;
        ttl?: number;
    };
    path?: never;
    query?: never;
    url: '/ocxp/lock';
};
type LockContentResponses = {
    /**
     * Lock acquired
     */
    200: OcxpResponse;
};
type LockContentResponse = LockContentResponses[keyof LockContentResponses];
type UnlockContentData = {
    body?: {
        path: string;
        lockToken: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/unlock';
};
type UnlockContentResponses = {
    /**
     * Lock released
     */
    200: OcxpResponse;
};
type UnlockContentResponse = UnlockContentResponses[keyof UnlockContentResponses];
type CheckConflictsData = {
    body: {
        /**
         * Paths to check for conflicts
         */
        paths: Array<string>;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/conflicts';
};
type CheckConflictsResponses = {
    /**
     * Conflict check result
     */
    200: OcxpResponse;
};
type CheckConflictsResponse = CheckConflictsResponses[keyof CheckConflictsResponses];
type GetPresignedUrlData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
        /**
         * Content identifier
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Operation type (get or put)
         */
        operation?: 'get' | 'put';
        /**
         * URL expiry in seconds
         */
        expiresIn?: number;
    };
    url: '/ocxp/{type}/{id}/url';
};
type GetPresignedUrlResponses = {
    /**
     * Presigned URL
     */
    200: OcxpResponse & {
        data?: {
            url?: string;
            expiresAt?: string;
        };
    };
};
type GetPresignedUrlResponse = GetPresignedUrlResponses[keyof GetPresignedUrlResponses];
type DownloadContentData = {
    body: {
        /**
         * Content identifier to download
         */
        id: string;
        /**
         * Download options (skipPatterns, maxFiles, maxSize)
         */
        options?: {
            [key: string]: unknown;
        };
    };
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/{type}/download';
};
type DownloadContentResponses = {
    /**
     * Download URL or stream
     */
    200: OcxpResponse;
};
type DownloadContentResponse = DownloadContentResponses[keyof DownloadContentResponses];
type FindContentByData = {
    body?: never;
    path: {
        /**
         * Content type
         */
        type: 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
    };
    query: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Field to search
         */
        field: string;
        /**
         * Value to match
         */
        value: string;
    };
    url: '/ocxp/{type}/find';
};
type FindContentByResponses = {
    /**
     * Found content
     */
    200: OcxpResponse;
};
type FindContentByResponse = FindContentByResponses[keyof FindContentByResponses];
type AuthLoginData = {
    body: {
        /**
         * User email or username
         */
        username: string;
        /**
         * User password
         */
        password: string;
    };
    path?: never;
    query?: never;
    url: '/auth/login';
};
type AuthLoginResponses = {
    /**
     * Authentication successful
     */
    200: OcxpResponse & {
        data?: {
            idToken?: string;
            accessToken?: string;
            refreshToken?: string;
            expiresIn?: number;
        };
    };
};
type AuthLoginResponse = AuthLoginResponses[keyof AuthLoginResponses];
type AuthRefreshData = {
    body: {
        /**
         * Cognito refresh token
         */
        refreshToken: string;
    };
    path?: never;
    query?: never;
    url: '/auth/refresh';
};
type AuthRefreshResponses = {
    /**
     * Tokens refreshed
     */
    200: OcxpResponse & {
        data?: {
            idToken?: string;
            accessToken?: string;
            expiresIn?: number;
        };
    };
};
type AuthRefreshResponse = AuthRefreshResponses[keyof AuthRefreshResponses];
type AuthGetConfigData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/config';
};
type AuthGetConfigResponses = {
    /**
     * Auth configuration
     */
    200: OcxpResponse & {
        data?: {
            userPoolId?: string;
            clientId?: string;
            region?: string;
            websocketEndpoint?: string;
        };
    };
};
type AuthGetConfigResponse = AuthGetConfigResponses[keyof AuthGetConfigResponses];
type AuthListWorkspacesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/workspaces';
};
type AuthListWorkspacesResponses = {
    /**
     * Workspace list
     */
    200: OcxpResponse & {
        data?: {
            workspaces?: Array<{
                id?: string;
                name?: string;
                role?: string;
            }>;
        };
    };
};
type AuthListWorkspacesResponse = AuthListWorkspacesResponses[keyof AuthListWorkspacesResponses];
type ListSessionsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Maximum sessions to return
         */
        limit?: number;
    };
    url: '/ocxp/session';
};
type ListSessionsResponses = {
    /**
     * Session list
     */
    200: OcxpResponse;
};
type ListSessionsResponse = ListSessionsResponses[keyof ListSessionsResponses];
type CreateSessionData = {
    body?: {
        /**
         * Session title
         */
        title?: string;
        /**
         * Optional session metadata
         */
        metadata?: {
            [key: string]: unknown;
        };
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/session';
};
type CreateSessionResponses = {
    /**
     * Session created
     */
    200: OcxpResponse;
};
type CreateSessionResponse = CreateSessionResponses[keyof CreateSessionResponses];
type GetSessionMessagesData = {
    body?: never;
    path: {
        /**
         * Session ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Maximum messages to return
         */
        limit?: number;
    };
    url: '/ocxp/session/{id}/messages';
};
type GetSessionMessagesResponses = {
    /**
     * Session messages
     */
    200: OcxpResponse;
};
type GetSessionMessagesResponse = GetSessionMessagesResponses[keyof GetSessionMessagesResponses];
type UpdateSessionMetadataData = {
    body: {
        title?: string;
        metadata?: {
            [key: string]: unknown;
        };
    };
    path: {
        /**
         * Session ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/session/{id}/metadata';
};
type UpdateSessionMetadataResponses = {
    /**
     * Metadata updated
     */
    200: OcxpResponse;
};
type UpdateSessionMetadataResponse = UpdateSessionMetadataResponses[keyof UpdateSessionMetadataResponses];
type ForkSessionData = {
    body?: {
        /**
         * Fork from this message onwards
         */
        fromMessageId?: string;
        /**
         * New session title
         */
        title?: string;
    };
    path: {
        /**
         * Source session ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/session/{id}/fork';
};
type ForkSessionResponses = {
    /**
     * Session forked
     */
    200: OcxpResponse;
};
type ForkSessionResponse = ForkSessionResponses[keyof ForkSessionResponses];
type ListMissionSessionsData = {
    body?: never;
    path: {
        /**
         * Mission ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/mission/{id}/session';
};
type ListMissionSessionsResponses = {
    /**
     * Mission sessions
     */
    200: OcxpResponse;
};
type ListMissionSessionsResponse = ListMissionSessionsResponses[keyof ListMissionSessionsResponses];
type CreateMissionSessionData = {
    body?: {
        /**
         * Session title
         */
        title?: string;
    };
    path: {
        /**
         * Mission ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/mission/{id}/session';
};
type CreateMissionSessionResponses = {
    /**
     * Mission session created
     */
    200: OcxpResponse;
};
type CreateMissionSessionResponse = CreateMissionSessionResponses[keyof CreateMissionSessionResponses];
type ListProjectsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Filter by status
         */
        status?: 'active' | 'archived' | 'paused';
    };
    url: '/ocxp/project';
};
type ListProjectsResponses = {
    /**
     * Project list
     */
    200: OcxpResponse;
};
type ListProjectsResponse = ListProjectsResponses[keyof ListProjectsResponses];
type CreateProjectData = {
    body: {
        /**
         * Project name
         */
        name: string;
        /**
         * Project description
         */
        description?: string;
        /**
         * Project metadata
         */
        metadata?: {
            [key: string]: unknown;
        };
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project';
};
type CreateProjectResponses = {
    /**
     * Project created
     */
    200: OcxpResponse;
};
type CreateProjectResponse = CreateProjectResponses[keyof CreateProjectResponses];
type DeleteProjectData = {
    body?: never;
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}';
};
type DeleteProjectResponses = {
    /**
     * Project deleted
     */
    200: OcxpResponse;
};
type DeleteProjectResponse = DeleteProjectResponses[keyof DeleteProjectResponses];
type GetProjectData = {
    body?: never;
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}';
};
type GetProjectResponses = {
    /**
     * Project details
     */
    200: OcxpResponse;
};
type GetProjectResponse = GetProjectResponses[keyof GetProjectResponses];
type UpdateProjectData = {
    body: {
        name?: string;
        description?: string;
        status?: 'active' | 'archived' | 'paused';
        metadata?: {
            [key: string]: unknown;
        };
    };
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}';
};
type UpdateProjectResponses = {
    /**
     * Project updated
     */
    200: OcxpResponse;
};
type UpdateProjectResponse = UpdateProjectResponses[keyof UpdateProjectResponses];
type AddProjectRepoData = {
    body: {
        /**
         * Repository ID to add
         */
        repo_id: string;
    };
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/repos';
};
type AddProjectRepoResponses = {
    /**
     * Repository added
     */
    200: OcxpResponse;
};
type AddProjectRepoResponse = AddProjectRepoResponses[keyof AddProjectRepoResponses];
type RemoveProjectRepoData = {
    body?: never;
    path: {
        /**
         * Project ID
         */
        id: string;
        /**
         * Repository ID to remove
         */
        repo_id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/repos/{repo_id}';
};
type RemoveProjectRepoResponses = {
    /**
     * Repository removed
     */
    200: OcxpResponse;
};
type RemoveProjectRepoResponse = RemoveProjectRepoResponses[keyof RemoveProjectRepoResponses];
type SetProjectDefaultRepoData = {
    body: {
        /**
         * Repository ID to set as default
         */
        repo_id: string;
    };
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/default-repo';
};
type SetProjectDefaultRepoResponses = {
    /**
     * Default repository set
     */
    200: OcxpResponse;
};
type SetProjectDefaultRepoResponse = SetProjectDefaultRepoResponses[keyof SetProjectDefaultRepoResponses];
type GetProjectContextReposData = {
    body?: never;
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/context-repos';
};
type GetProjectContextReposResponses = {
    /**
     * Context repositories
     */
    200: OcxpResponse;
};
type GetProjectContextReposResponse = GetProjectContextReposResponses[keyof GetProjectContextReposResponses];
type AddProjectMissionData = {
    body: {
        /**
         * Mission ID to add
         */
        mission_id: string;
    };
    path: {
        /**
         * Project ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/missions';
};
type AddProjectMissionResponses = {
    /**
     * Mission added
     */
    200: OcxpResponse;
};
type AddProjectMissionResponse = AddProjectMissionResponses[keyof AddProjectMissionResponses];
type RemoveProjectMissionData = {
    body?: never;
    path: {
        /**
         * Project ID
         */
        id: string;
        /**
         * Mission ID to remove
         */
        mission_id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/project/{id}/missions/{mission_id}';
};
type RemoveProjectMissionResponses = {
    /**
     * Mission removed
     */
    200: OcxpResponse;
};
type RemoveProjectMissionResponse = RemoveProjectMissionResponses[keyof RemoveProjectMissionResponses];
type CreateDocsSnapshotData = {
    body: {
        /**
         * Documentation URL to snapshot
         */
        url: string;
        /**
         * Snapshot name
         */
        name?: string;
        /**
         * Snapshot options
         */
        options?: {
            [key: string]: unknown;
        };
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/docs/snapshot';
};
type CreateDocsSnapshotResponses = {
    /**
     * Snapshot created
     */
    200: OcxpResponse;
};
type CreateDocsSnapshotResponse = CreateDocsSnapshotResponses[keyof CreateDocsSnapshotResponses];
type ListDocsSnapshotsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/ocxp/docs/list';
};
type ListDocsSnapshotsResponses = {
    /**
     * Snapshot list
     */
    200: OcxpResponse;
};
type ListDocsSnapshotsResponse = ListDocsSnapshotsResponses[keyof ListDocsSnapshotsResponses];
type GetDocsSnapshotStatusData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Workspace ID
         */
        workspace?: string;
        /**
         * Snapshot job ID
         */
        job_id: string;
    };
    url: '/ocxp/docs/status';
};
type GetDocsSnapshotStatusResponses = {
    /**
     * Job status
     */
    200: OcxpResponse;
};
type GetDocsSnapshotStatusResponse = GetDocsSnapshotStatusResponses[keyof GetDocsSnapshotStatusResponses];
type RefreshIndexData = {
    body?: {
        /**
         * Content type to refresh (or all if not specified)
         */
        contentType?: string;
        /**
         * Force full reindex
         */
        force?: boolean;
    };
    path?: never;
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/index/refresh';
};
type RefreshIndexResponses = {
    /**
     * Index refresh started
     */
    200: OcxpResponse;
};
type RefreshIndexResponse = RefreshIndexResponses[keyof RefreshIndexResponses];
type LearnFromMissionData = {
    body?: {
        /**
         * Learning categories to extract
         */
        categories?: Array<string>;
    };
    path: {
        /**
         * Mission ID
         */
        id: string;
    };
    query?: {
        /**
         * Workspace ID
         */
        workspace?: string;
    };
    url: '/tools/mission/{id}/learn';
};
type LearnFromMissionResponses = {
    /**
     * Learnings extracted
     */
    200: OcxpResponse;
};
type LearnFromMissionResponse = LearnFromMissionResponses[keyof LearnFromMissionResponses];

/**
 * OCXPClient - Custom wrapper for the generated OCXP SDK
 * Provides workspace injection and auth token management
 */

interface ListResult {
    entries: ListEntry[];
    cursor?: string | null;
    hasMore: boolean;
    total: number;
}
interface ReadResult {
    content: string;
    size?: number;
    mtime?: string;
    encoding?: string;
    metadata?: Record<string, unknown>;
}
interface WriteResult {
    path: string;
    etag?: string;
}
interface DeleteResult {
    deleted: boolean;
    path: string;
}
interface ContentTypesResult {
    types: ContentType[];
    total: number;
}
interface OCXPClientOptions {
    /** Base URL of the OCXP server */
    endpoint: string;
    /** Default workspace for all operations */
    workspace?: string;
    /** Static token or async function to get token */
    token?: string | (() => Promise<string>);
}
type ContentTypeValue = ContentType2;
/**
 * OCXPClient provides a high-level interface to the OCXP API
 */
declare class OCXPClient {
    private client;
    private workspace;
    private tokenProvider?;
    constructor(options: OCXPClientOptions);
    /**
     * Get authorization headers
     */
    private getHeaders;
    /**
     * Set the workspace for subsequent operations
     */
    setWorkspace(workspace: string): void;
    /**
     * Get current workspace
     */
    getWorkspace(): string;
    /**
     * Set the auth token or token provider
     */
    setToken(token: string | (() => Promise<string>)): void;
    /**
     * Get available content types with metadata
     */
    getContentTypes(counts?: boolean): Promise<ContentTypesResult>;
    /**
     * List content of a specific type
     */
    list(type: ContentTypeValue, path?: string, limit?: number): Promise<ListResult>;
    /**
     * Read content by ID
     */
    read(type: ContentTypeValue, id: string): Promise<ReadResult>;
    /**
     * Write content
     */
    write(type: ContentTypeValue, id: string, content: string, options?: {
        encoding?: string;
        metadata?: Record<string, unknown>;
        ifNotExists?: boolean;
        etag?: string;
    }): Promise<WriteResult>;
    /**
     * Delete content
     */
    delete(type: ContentTypeValue, id: string, recursive?: boolean, confirm?: boolean): Promise<DeleteResult>;
    /**
     * Query content with filters
     */
    query(type: ContentTypeValue, filters?: QueryFilter[], limit?: number): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Full-text search
     */
    search(type: ContentTypeValue, q: string, fuzzy?: boolean, limit?: number): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Get hierarchical tree structure
     */
    tree(type: ContentTypeValue, path?: string, depth?: number): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Get content statistics
     */
    stats(type: ContentTypeValue, path?: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Read multiple items at once
     */
    bulkRead(type: ContentTypeValue, ids: string[], options?: {
        concurrency?: number;
        continueOnError?: boolean;
    }): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Write multiple items at once
     */
    bulkWrite(type: ContentTypeValue, items: Array<{
        id: string;
        content: string;
        metadata?: Record<string, unknown>;
    }>, options?: {
        concurrency?: number;
        continueOnError?: boolean;
    }): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Delete multiple items at once
     */
    bulkDelete(type: ContentTypeValue, ids: string[], options?: {
        concurrency?: number;
        continueOnError?: boolean;
    }): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Semantic search in Knowledge Base
     */
    kbQuery(query: string, searchType?: 'SEMANTIC' | 'HYBRID', maxResults?: number): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * RAG with citations
     */
    kbRag(query: string, sessionId?: string, systemPrompt?: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Create a new mission from ticket
     */
    createMission(ticketId: string, ticketSummary?: string, ticketDescription?: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Update mission progress
     */
    updateMission(missionId: string, updates: Record<string, unknown>): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Get mission context for agents
     */
    getMissionContext(missionId: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Discover similar content across types
     */
    discover(query: string, contentType?: string, maxResults?: number, includeRelated?: boolean): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Find content by Jira ticket ID
     */
    findByTicket(ticketId: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Acquire exclusive lock on content
     */
    lock(path: string, ttl?: number): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Release exclusive lock
     */
    unlock(path: string, lockToken: string): Promise<({
        data: undefined;
        error: unknown;
    } | {
        data: OcxpResponse;
        error: undefined;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Check if a repository is accessible
     */
    githubCheckAccess(owner: string, repo: string, githubToken?: string): Promise<{
        accessible: boolean;
        private?: boolean;
        default_branch?: string;
        error?: string;
        rate_limit?: Record<string, unknown>;
    }>;
    /**
     * List branches for a repository
     */
    githubListBranches(owner: string, repo: string, githubToken?: string): Promise<{
        branches?: string[];
        error?: Record<string, unknown>;
    }>;
    /**
     * Get repository contents at a path
     */
    githubGetContents(owner: string, repo: string, path?: string, ref?: string, githubToken?: string): Promise<{
        contents?: unknown;
        error?: Record<string, unknown>;
    }>;
    /**
     * Download repository and trigger vectorization
     * Uses tarball download for efficiency (single GitHub request)
     */
    downloadRepository(request: {
        github_url: string;
        repo_id: string;
        branch?: string;
        path?: string;
        visibility?: 'public' | 'private';
        trigger_vectorization?: boolean;
        is_private?: boolean;
    }): Promise<{
        job_id: string;
        status: string;
        repo_id: string;
    }>;
    /**
     * Get repository download/vectorization status
     */
    getRepoStatus(jobId: string): Promise<{
        job_id: string;
        status: string;
        progress?: number;
        files_processed?: number;
        total_files?: number;
        error?: string;
    }>;
    /**
     * List all downloaded repositories in workspace
     */
    listRepos(options?: {
        visibility?: 'public' | 'private';
        repoId?: string;
    }): Promise<{
        repos: Array<{
            repo_id: string;
            github_url: string;
            branch: string;
            visibility: "public" | "private";
            s3_path: string;
            files_count: number;
            total_size_bytes: number;
            indexed_at: string;
            kb_synced: boolean;
        }>;
        count: number;
    }>;
    /**
     * Delete a repository and all associated data
     * Removes S3 files, job records, and project references
     */
    deleteRepository(repoId: string): Promise<{
        repo_id: string;
        success: boolean;
        s3_files_deleted: number;
        projects_updated: number;
        error?: string;
    }>;
    /**
     * Check if a repository already exists in the system
     */
    checkRepoExists(repoId: string): Promise<{
        repo_id: string;
        exists: boolean;
        indexed_at: string | null;
        files_count: number;
    }>;
}
/**
 * Create a new OCXP client instance
 */
declare function createOCXPClient(options: OCXPClientOptions): OCXPClient;

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

/**
 * Valid content types for OCXP API
 */
declare const VALID_CONTENT_TYPES: ContentTypeValue[];
/**
 * Parsed path result
 */
interface ParsedPath {
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
declare function parsePath(path: string): ParsedPath;
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
declare function normalizePath(path: string): string;
/**
 * Check if a content type string is valid
 *
 * @param type - Type string to validate
 * @returns true if valid content type
 */
declare function isValidContentType(type: string): type is ContentTypeValue;
/**
 * Get the canonical content type for a type string (handles aliases)
 *
 * @param type - Type string (may be plural or alias)
 * @returns Canonical content type or undefined if invalid
 */
declare function getCanonicalType(type: string): ContentTypeValue | undefined;
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
declare function buildPath(type: ContentTypeValue, id?: string): string;

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

/**
 * Entry from list operations
 */
interface PathEntry {
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
interface PathReadResult {
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
interface PathWriteOptions {
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
interface PathWriteResult {
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
interface PathMoveResult {
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
interface PathFileInfo {
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
interface PathListResult {
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
interface OCXPPathServiceOptions extends OCXPClientOptions {
    /** Request timeout in milliseconds */
    timeout?: number;
}
/**
 * Token provider function type
 */
type TokenProvider = () => Promise<string | null>;
/**
 * OCXPPathService - Path-based file operations via OCXP protocol
 *
 * This service wraps OCXPClient and provides a simpler interface using
 * path strings like 'mission/id/file.md' instead of separate type and id.
 */
declare class OCXPPathService {
    private client;
    private readonly endpoint;
    private readonly workspace;
    constructor(options: OCXPPathServiceOptions);
    /**
     * List directory contents
     *
     * @param path - Path like 'mission/' or 'project/'
     * @param limit - Maximum entries to return
     * @returns List result with entries
     */
    list(path: string, limit?: number): Promise<PathListResult>;
    /**
     * Read file content
     *
     * @param path - Path like 'mission/CTX-123/PHASES.md'
     * @returns Read result with content
     */
    read(path: string): Promise<PathReadResult>;
    /**
     * Check if path exists
     *
     * @param path - Path to check
     * @returns true if exists
     */
    exists(path: string): Promise<boolean>;
    /**
     * Get file metadata
     *
     * @param path - Path to get info for
     * @returns File info
     */
    info(path: string): Promise<PathFileInfo>;
    /**
     * Write/update file content
     *
     * @param path - Path like 'mission/CTX-123/PHASES.md'
     * @param content - File content
     * @param options - Write options
     * @returns Write result
     */
    write(path: string, content: string, options?: PathWriteOptions): Promise<PathWriteResult>;
    /**
     * Delete a file
     *
     * @param path - Path like 'mission/CTX-123/PHASES.md'
     * @returns Write result
     */
    delete(path: string): Promise<PathWriteResult>;
    /**
     * Move/rename a file
     *
     * Implemented as read + write + delete
     *
     * @param sourcePath - Source path
     * @param destPath - Destination path
     * @returns Move result
     */
    move(sourcePath: string, destPath: string): Promise<PathMoveResult>;
    /**
     * Get the underlying OCXPClient
     */
    getClient(): OCXPClient;
    /**
     * Get the API endpoint
     */
    getEndpoint(): string;
    /**
     * Get the workspace ID
     */
    getWorkspace(): string;
    /**
     * Update the workspace
     */
    setWorkspace(workspace: string): void;
    /**
     * Update the auth token
     */
    setToken(token: string | (() => Promise<string>)): void;
}
/**
 * Create a new OCXPPathService instance
 */
declare function createPathService(options: OCXPPathServiceOptions): OCXPPathService;

type AuthToken = string | undefined;
interface Auth {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query' | 'cookie';
    /**
     * Header or query parameter name.
     *
     * @default 'Authorization'
     */
    name?: string;
    scheme?: 'basic' | 'bearer';
    type: 'apiKey' | 'http';
}

interface SerializerOptions<T> {
    /**
     * @default true
     */
    explode: boolean;
    style: T;
}
type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';

type QuerySerializer = (query: Record<string, unknown>) => string;
type BodySerializer = (body: any) => any;
type QuerySerializerOptionsObject = {
    allowReserved?: boolean;
    array?: Partial<SerializerOptions<ArrayStyle>>;
    object?: Partial<SerializerOptions<ObjectStyle>>;
};
type QuerySerializerOptions = QuerySerializerOptionsObject & {
    /**
     * Per-parameter serialization overrides. When provided, these settings
     * override the global array/object settings for specific parameter names.
     */
    parameters?: Record<string, QuerySerializerOptionsObject>;
};

type HttpMethod = 'connect' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';
type Client$1<RequestFn = never, Config = unknown, MethodFn = never, BuildUrlFn = never, SseFn = never> = {
    /**
     * Returns the final request URL.
     */
    buildUrl: BuildUrlFn;
    getConfig: () => Config;
    request: RequestFn;
    setConfig: (config: Config) => Config;
} & {
    [K in HttpMethod]: MethodFn;
} & ([SseFn] extends [never] ? {
    sse?: never;
} : {
    sse: {
        [K in HttpMethod]: SseFn;
    };
});
interface Config$1 {
    /**
     * Auth token or a function returning auth token. The resolved value will be
     * added to the request payload as defined by its `security` array.
     */
    auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
    /**
     * A function for serializing request body parameter. By default,
     * {@link JSON.stringify()} will be used.
     */
    bodySerializer?: BodySerializer | null;
    /**
     * An object containing any HTTP headers that you want to pre-populate your
     * `Headers` object with.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
     */
    headers?: RequestInit['headers'] | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
    /**
     * The request method.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
     */
    method?: Uppercase<HttpMethod>;
    /**
     * A function for serializing request query parameters. By default, arrays
     * will be exploded in form style, objects will be exploded in deepObject
     * style, and reserved characters are percent-encoded.
     *
     * This method will have no effect if the native `paramsSerializer()` Axios
     * API function is used.
     *
     * {@link https://swagger.io/docs/specification/serialization/#query View examples}
     */
    querySerializer?: QuerySerializer | QuerySerializerOptions;
    /**
     * A function validating request data. This is useful if you want to ensure
     * the request conforms to the desired shape, so it can be safely sent to
     * the server.
     */
    requestValidator?: (data: unknown) => Promise<unknown>;
    /**
     * A function transforming response data before it's returned. This is useful
     * for post-processing data, e.g. converting ISO strings into Date objects.
     */
    responseTransformer?: (data: unknown) => Promise<unknown>;
    /**
     * A function validating response data. This is useful if you want to ensure
     * the response conforms to the desired shape, so it can be safely passed to
     * the transformers and returned to the user.
     */
    responseValidator?: (data: unknown) => Promise<unknown>;
}

type ServerSentEventsOptions<TData = unknown> = Omit<RequestInit, 'method'> & Pick<Config$1, 'method' | 'responseTransformer' | 'responseValidator'> & {
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Implementing clients can call request interceptors inside this hook.
     */
    onRequest?: (url: string, init: RequestInit) => Promise<Request>;
    /**
     * Callback invoked when a network or parsing error occurs during streaming.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param error The error that occurred.
     */
    onSseError?: (error: unknown) => void;
    /**
     * Callback invoked when an event is streamed from the server.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param event Event streamed from the server.
     * @returns Nothing (void).
     */
    onSseEvent?: (event: StreamEvent<TData>) => void;
    serializedBody?: RequestInit['body'];
    /**
     * Default retry delay in milliseconds.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 3000
     */
    sseDefaultRetryDelay?: number;
    /**
     * Maximum number of retry attempts before giving up.
     */
    sseMaxRetryAttempts?: number;
    /**
     * Maximum retry delay in milliseconds.
     *
     * Applies only when exponential backoff is used.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 30000
     */
    sseMaxRetryDelay?: number;
    /**
     * Optional sleep function for retry backoff.
     *
     * Defaults to using `setTimeout`.
     */
    sseSleepFn?: (ms: number) => Promise<void>;
    url: string;
};
interface StreamEvent<TData = unknown> {
    data: TData;
    event?: string;
    id?: string;
    retry?: number;
}
type ServerSentEventsResult<TData = unknown, TReturn = void, TNext = unknown> = {
    stream: AsyncGenerator<TData extends Record<string, unknown> ? TData[keyof TData] : TData, TReturn, TNext>;
};

type ErrInterceptor<Err, Res, Req, Options> = (error: Err, response: Res, request: Req, options: Options) => Err | Promise<Err>;
type ReqInterceptor<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>;
type ResInterceptor<Res, Req, Options> = (response: Res, request: Req, options: Options) => Res | Promise<Res>;
declare class Interceptors<Interceptor> {
    fns: Array<Interceptor | null>;
    clear(): void;
    eject(id: number | Interceptor): void;
    exists(id: number | Interceptor): boolean;
    getInterceptorIndex(id: number | Interceptor): number;
    update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
    use(fn: Interceptor): number;
}
interface Middleware<Req, Res, Err, Options> {
    error: Interceptors<ErrInterceptor<Err, Res, Req, Options>>;
    request: Interceptors<ReqInterceptor<Req, Options>>;
    response: Interceptors<ResInterceptor<Res, Req, Options>>;
}
declare const createConfig: <T extends ClientOptions = ClientOptions>(override?: Config<Omit<ClientOptions, keyof T> & T>) => Config<Omit<ClientOptions, keyof T> & T>;

type ResponseStyle = 'data' | 'fields';
interface Config<T extends ClientOptions = ClientOptions> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config$1 {
    /**
     * Base URL for all requests made by this client.
     */
    baseUrl?: T['baseUrl'];
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Please don't use the Fetch client for Next.js applications. The `next`
     * options won't have any effect.
     *
     * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
     */
    next?: never;
    /**
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
    /**
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle?: ResponseStyle;
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}
interface RequestOptions<TData = unknown, TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends Config<{
    responseStyle: TResponseStyle;
    throwOnError: ThrowOnError;
}>, Pick<ServerSentEventsOptions<TData>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
    /**
     * Any body that you want to add to your request.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
     */
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    /**
     * Security mechanism(s) to use for the request.
     */
    security?: ReadonlyArray<Auth>;
    url: Url;
}
interface ResolvedRequestOptions<TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends RequestOptions<unknown, TResponseStyle, ThrowOnError, Url> {
    serializedBody?: string;
}
type RequestResult<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean, TResponseStyle extends ResponseStyle = 'fields'> = ThrowOnError extends true ? Promise<TResponseStyle extends 'data' ? TData extends Record<string, unknown> ? TData[keyof TData] : TData : {
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    request: Request;
    response: Response;
}> : Promise<TResponseStyle extends 'data' ? (TData extends Record<string, unknown> ? TData[keyof TData] : TData) | undefined : ({
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    error: undefined;
} | {
    data: undefined;
    error: TError extends Record<string, unknown> ? TError[keyof TError] : TError;
}) & {
    request: Request;
    response: Response;
}>;
interface ClientOptions {
    baseUrl?: string;
    responseStyle?: ResponseStyle;
    throwOnError?: boolean;
}
type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type SseFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type BuildUrlFn = <TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
}>(options: TData & Options$1<TData>) => string;
type Client = Client$1<RequestFn, Config, MethodFn, BuildUrlFn, SseFn> & {
    interceptors: Middleware<Request, Response, unknown, ResolvedRequestOptions>;
};
interface TDataShape {
    body?: unknown;
    headers?: unknown;
    path?: unknown;
    query?: unknown;
    url: string;
}
type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;
type Options$1<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponse = unknown, TResponseStyle extends ResponseStyle = 'fields'> = OmitKeys<RequestOptions<TResponse, TResponseStyle, ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & ([TData] extends [never] ? unknown : Omit<TData, 'url'>);

declare const createClient: (config?: Config) => Client;

type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = Options$1<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};
/**
 * List available content types
 *
 * Returns all content types with metadata, endpoints, and optional counts.
 */
declare const getContentTypes: <ThrowOnError extends boolean = false>(options?: Options<GetContentTypesData, ThrowOnError>) => RequestResult<GetContentTypesResponses, unknown, ThrowOnError, "fields">;
/**
 * List content of a type
 */
declare const listContent: <ThrowOnError extends boolean = false>(options: Options<ListContentData, ThrowOnError>) => RequestResult<ListContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Delete content
 */
declare const deleteContent: <ThrowOnError extends boolean = false>(options: Options<DeleteContentData, ThrowOnError>) => RequestResult<DeleteContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Read content by ID
 */
declare const readContent: <ThrowOnError extends boolean = false>(options: Options<ReadContentData, ThrowOnError>) => RequestResult<ReadContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Create or update content
 */
declare const writeContent: <ThrowOnError extends boolean = false>(options: Options<WriteContentData, ThrowOnError>) => RequestResult<WriteContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Query content with filters
 */
declare const queryContent: <ThrowOnError extends boolean = false>(options: Options<QueryContentData, ThrowOnError>) => RequestResult<QueryContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Full-text search
 */
declare const searchContent: <ThrowOnError extends boolean = false>(options: Options<SearchContentData, ThrowOnError>) => RequestResult<SearchContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Get hierarchical tree structure
 */
declare const getContentTree: <ThrowOnError extends boolean = false>(options: Options<GetContentTreeData, ThrowOnError>) => RequestResult<GetContentTreeResponses, unknown, ThrowOnError, "fields">;
/**
 * Get content statistics
 */
declare const getContentStats: <ThrowOnError extends boolean = false>(options: Options<GetContentStatsData, ThrowOnError>) => RequestResult<GetContentStatsResponses, unknown, ThrowOnError, "fields">;
/**
 * Read multiple items
 */
declare const bulkReadContent: <ThrowOnError extends boolean = false>(options: Options<BulkReadContentData, ThrowOnError>) => RequestResult<BulkReadContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Write multiple items
 */
declare const bulkWriteContent: <ThrowOnError extends boolean = false>(options: Options<BulkWriteContentData, ThrowOnError>) => RequestResult<BulkWriteContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Delete multiple items
 */
declare const bulkDeleteContent: <ThrowOnError extends boolean = false>(options: Options<BulkDeleteContentData, ThrowOnError>) => RequestResult<BulkDeleteContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Semantic search in Knowledge Base
 */
declare const queryKnowledgeBase: <ThrowOnError extends boolean = false>(options: Options<QueryKnowledgeBaseData, ThrowOnError>) => RequestResult<QueryKnowledgeBaseResponses, unknown, ThrowOnError, "fields">;
/**
 * RAG with citations
 */
declare const ragKnowledgeBase: <ThrowOnError extends boolean = false>(options: Options<RagKnowledgeBaseData, ThrowOnError>) => RequestResult<RagKnowledgeBaseResponses, unknown, ThrowOnError, "fields">;
/**
 * Download GitHub repo and vectorize
 *
 * Download repo from GitHub, upload to S3 with metadata sidecars, and trigger Bedrock KB vectorization.
 */
declare const downloadRepository: <ThrowOnError extends boolean = false>(options: Options<DownloadRepositoryData, ThrowOnError>) => RequestResult<DownloadRepositoryResponses, unknown, ThrowOnError, "fields">;
/**
 * Check repo download job status
 */
declare const getRepoDownloadStatus: <ThrowOnError extends boolean = false>(options: Options<GetRepoDownloadStatusData, ThrowOnError>) => RequestResult<GetRepoDownloadStatusResponses, unknown, ThrowOnError, "fields">;
/**
 * List downloaded repositories
 */
declare const listDownloadedRepos: <ThrowOnError extends boolean = false>(options?: Options<ListDownloadedReposData, ThrowOnError>) => RequestResult<ListDownloadedReposResponses, unknown, ThrowOnError, "fields">;
/**
 * Check repository access
 *
 * Verify if the user can access a GitHub repository before downloading.
 */
declare const githubCheckAccess: <ThrowOnError extends boolean = false>(options: Options<GithubCheckAccessData, ThrowOnError>) => RequestResult<GithubCheckAccessResponses, unknown, ThrowOnError, "fields">;
/**
 * List repository branches
 *
 * Get list of branches for a GitHub repository.
 */
declare const githubListBranches: <ThrowOnError extends boolean = false>(options: Options<GithubListBranchesData, ThrowOnError>) => RequestResult<GithubListBranchesResponses, unknown, ThrowOnError, "fields">;
/**
 * Get repository contents
 *
 * Browse repository files and folders.
 */
declare const githubGetContents: <ThrowOnError extends boolean = false>(options: Options<GithubGetContentsData, ThrowOnError>) => RequestResult<GithubGetContentsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create a new mission from ticket
 */
declare const createMission: <ThrowOnError extends boolean = false>(options: Options<CreateMissionData, ThrowOnError>) => RequestResult<CreateMissionResponses, unknown, ThrowOnError, "fields">;
/**
 * Update mission progress
 */
declare const updateMission: <ThrowOnError extends boolean = false>(options: Options<UpdateMissionData, ThrowOnError>) => RequestResult<UpdateMissionResponses, unknown, ThrowOnError, "fields">;
/**
 * Get mission context for agents
 */
declare const getMissionContext: <ThrowOnError extends boolean = false>(options: Options<GetMissionContextData, ThrowOnError>) => RequestResult<GetMissionContextResponses, unknown, ThrowOnError, "fields">;
/**
 * Discover similar content across types
 */
declare const discoverSimilar: <ThrowOnError extends boolean = false>(options: Options<DiscoverSimilarData, ThrowOnError>) => RequestResult<DiscoverSimilarResponses, unknown, ThrowOnError, "fields">;
/**
 * Find content by Jira ticket ID
 */
declare const findByTicket: <ThrowOnError extends boolean = false>(options: Options<FindByTicketData, ThrowOnError>) => RequestResult<FindByTicketResponses, unknown, ThrowOnError, "fields">;
/**
 * Delete a downloaded repository
 *
 * Delete a repository and its associated S3 files.
 */
declare const deleteRepository: <ThrowOnError extends boolean = false>(options: Options<DeleteRepositoryData, ThrowOnError>) => RequestResult<DeleteRepositoryResponses, unknown, ThrowOnError, "fields">;
/**
 * Check if repository exists
 *
 * Check if a repository has already been indexed.
 */
declare const checkRepoExists: <ThrowOnError extends boolean = false>(options: Options<CheckRepoExistsData, ThrowOnError>) => RequestResult<CheckRepoExistsResponses, unknown, ThrowOnError, "fields">;
/**
 * Move or rename content
 *
 * Move content from one path to another.
 */
declare const moveContent: <ThrowOnError extends boolean = false>(options: Options<MoveContentData, ThrowOnError>) => RequestResult<MoveContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Acquire exclusive lock
 */
declare const lockContent: <ThrowOnError extends boolean = false>(options?: Options<LockContentData, ThrowOnError>) => RequestResult<LockContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Release exclusive lock
 */
declare const unlockContent: <ThrowOnError extends boolean = false>(options?: Options<UnlockContentData, ThrowOnError>) => RequestResult<UnlockContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Check for content conflicts
 *
 * Check if content has conflicts before writing.
 */
declare const checkConflicts: <ThrowOnError extends boolean = false>(options: Options<CheckConflictsData, ThrowOnError>) => RequestResult<CheckConflictsResponses, unknown, ThrowOnError, "fields">;
/**
 * Get presigned URL for content
 *
 * Generate a presigned URL for direct S3 access.
 */
declare const getPresignedUrl: <ThrowOnError extends boolean = false>(options: Options<GetPresignedUrlData, ThrowOnError>) => RequestResult<GetPresignedUrlResponses, unknown, ThrowOnError, "fields">;
/**
 * Download content as archive
 *
 * Download multiple files as a single archive.
 */
declare const downloadContent: <ThrowOnError extends boolean = false>(options: Options<DownloadContentData, ThrowOnError>) => RequestResult<DownloadContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Find content by field value
 *
 * Find content by a specific field and value.
 */
declare const findContentBy: <ThrowOnError extends boolean = false>(options: Options<FindContentByData, ThrowOnError>) => RequestResult<FindContentByResponses, unknown, ThrowOnError, "fields">;
/**
 * Login with Cognito credentials
 *
 * Authenticate user and return JWT tokens.
 */
declare const authLogin: <ThrowOnError extends boolean = false>(options: Options<AuthLoginData, ThrowOnError>) => RequestResult<AuthLoginResponses, unknown, ThrowOnError, "fields">;
/**
 * Refresh authentication tokens
 *
 * Use refresh token to get new access and ID tokens.
 */
declare const authRefresh: <ThrowOnError extends boolean = false>(options: Options<AuthRefreshData, ThrowOnError>) => RequestResult<AuthRefreshResponses, unknown, ThrowOnError, "fields">;
/**
 * Get authentication configuration
 *
 * Get Cognito User Pool IDs and other auth config.
 */
declare const authGetConfig: <ThrowOnError extends boolean = false>(options?: Options<AuthGetConfigData, ThrowOnError>) => RequestResult<AuthGetConfigResponses, unknown, ThrowOnError, "fields">;
/**
 * List available workspaces
 *
 * Get list of workspaces the user has access to.
 */
declare const authListWorkspaces: <ThrowOnError extends boolean = false>(options?: Options<AuthListWorkspacesData, ThrowOnError>) => RequestResult<AuthListWorkspacesResponses, unknown, ThrowOnError, "fields">;
/**
 * List chat sessions
 *
 * Get list of user's chat sessions.
 */
declare const listSessions: <ThrowOnError extends boolean = false>(options?: Options<ListSessionsData, ThrowOnError>) => RequestResult<ListSessionsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create a new chat session
 *
 * Create a new session for chat conversations.
 */
declare const createSession: <ThrowOnError extends boolean = false>(options?: Options<CreateSessionData, ThrowOnError>) => RequestResult<CreateSessionResponses, unknown, ThrowOnError, "fields">;
/**
 * Get session messages
 *
 * Get all messages in a chat session.
 */
declare const getSessionMessages: <ThrowOnError extends boolean = false>(options: Options<GetSessionMessagesData, ThrowOnError>) => RequestResult<GetSessionMessagesResponses, unknown, ThrowOnError, "fields">;
/**
 * Update session metadata
 *
 * Update metadata for a chat session.
 */
declare const updateSessionMetadata: <ThrowOnError extends boolean = false>(options: Options<UpdateSessionMetadataData, ThrowOnError>) => RequestResult<UpdateSessionMetadataResponses, unknown, ThrowOnError, "fields">;
/**
 * Fork a session
 *
 * Create a new session from an existing one.
 */
declare const forkSession: <ThrowOnError extends boolean = false>(options: Options<ForkSessionData, ThrowOnError>) => RequestResult<ForkSessionResponses, unknown, ThrowOnError, "fields">;
/**
 * List sessions for a mission
 *
 * Get all chat sessions associated with a mission.
 */
declare const listMissionSessions: <ThrowOnError extends boolean = false>(options: Options<ListMissionSessionsData, ThrowOnError>) => RequestResult<ListMissionSessionsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create a session for a mission
 *
 * Create a new chat session linked to a mission.
 */
declare const createMissionSession: <ThrowOnError extends boolean = false>(options: Options<CreateMissionSessionData, ThrowOnError>) => RequestResult<CreateMissionSessionResponses, unknown, ThrowOnError, "fields">;
/**
 * List all projects
 *
 * Get list of user's projects.
 */
declare const listProjects: <ThrowOnError extends boolean = false>(options?: Options<ListProjectsData, ThrowOnError>) => RequestResult<ListProjectsResponses, unknown, ThrowOnError, "fields">;
/**
 * Create a new project
 *
 * Create a new project for organizing missions and repos.
 */
declare const createProject: <ThrowOnError extends boolean = false>(options: Options<CreateProjectData, ThrowOnError>) => RequestResult<CreateProjectResponses, unknown, ThrowOnError, "fields">;
/**
 * Delete a project
 *
 * Delete a project (soft delete or archive).
 */
declare const deleteProject: <ThrowOnError extends boolean = false>(options: Options<DeleteProjectData, ThrowOnError>) => RequestResult<DeleteProjectResponses, unknown, ThrowOnError, "fields">;
/**
 * Get project details
 *
 * Get a project by ID with all its details.
 */
declare const getProject: <ThrowOnError extends boolean = false>(options: Options<GetProjectData, ThrowOnError>) => RequestResult<GetProjectResponses, unknown, ThrowOnError, "fields">;
/**
 * Update a project
 *
 * Update project details.
 */
declare const updateProject: <ThrowOnError extends boolean = false>(options: Options<UpdateProjectData, ThrowOnError>) => RequestResult<UpdateProjectResponses, unknown, ThrowOnError, "fields">;
/**
 * Add repository to project
 *
 * Link a repository to a project.
 */
declare const addProjectRepo: <ThrowOnError extends boolean = false>(options: Options<AddProjectRepoData, ThrowOnError>) => RequestResult<AddProjectRepoResponses, unknown, ThrowOnError, "fields">;
/**
 * Remove repository from project
 *
 * Unlink a repository from a project.
 */
declare const removeProjectRepo: <ThrowOnError extends boolean = false>(options: Options<RemoveProjectRepoData, ThrowOnError>) => RequestResult<RemoveProjectRepoResponses, unknown, ThrowOnError, "fields">;
/**
 * Set default repository
 *
 * Set the default repository for a project.
 */
declare const setProjectDefaultRepo: <ThrowOnError extends boolean = false>(options: Options<SetProjectDefaultRepoData, ThrowOnError>) => RequestResult<SetProjectDefaultRepoResponses, unknown, ThrowOnError, "fields">;
/**
 * Get project context repositories
 *
 * Get repositories providing context for this project.
 */
declare const getProjectContextRepos: <ThrowOnError extends boolean = false>(options: Options<GetProjectContextReposData, ThrowOnError>) => RequestResult<GetProjectContextReposResponses, unknown, ThrowOnError, "fields">;
/**
 * Add mission to project
 *
 * Link a mission to a project.
 */
declare const addProjectMission: <ThrowOnError extends boolean = false>(options: Options<AddProjectMissionData, ThrowOnError>) => RequestResult<AddProjectMissionResponses, unknown, ThrowOnError, "fields">;
/**
 * Remove mission from project
 *
 * Unlink a mission from a project.
 */
declare const removeProjectMission: <ThrowOnError extends boolean = false>(options: Options<RemoveProjectMissionData, ThrowOnError>) => RequestResult<RemoveProjectMissionResponses, unknown, ThrowOnError, "fields">;
/**
 * Create documentation snapshot
 *
 * Create a snapshot of documentation from a URL.
 */
declare const createDocsSnapshot: <ThrowOnError extends boolean = false>(options: Options<CreateDocsSnapshotData, ThrowOnError>) => RequestResult<CreateDocsSnapshotResponses, unknown, ThrowOnError, "fields">;
/**
 * List documentation snapshots
 *
 * Get list of all documentation snapshots.
 */
declare const listDocsSnapshots: <ThrowOnError extends boolean = false>(options?: Options<ListDocsSnapshotsData, ThrowOnError>) => RequestResult<ListDocsSnapshotsResponses, unknown, ThrowOnError, "fields">;
/**
 * Get snapshot job status
 *
 * Check status of a documentation snapshot job.
 */
declare const getDocsSnapshotStatus: <ThrowOnError extends boolean = false>(options: Options<GetDocsSnapshotStatusData, ThrowOnError>) => RequestResult<GetDocsSnapshotStatusResponses, unknown, ThrowOnError, "fields">;
/**
 * Refresh content index
 *
 * Trigger a refresh of the content index.
 */
declare const refreshIndex: <ThrowOnError extends boolean = false>(options?: Options<RefreshIndexData, ThrowOnError>) => RequestResult<RefreshIndexResponses, unknown, ThrowOnError, "fields">;
/**
 * Learn from completed mission
 *
 * Extract learnings and patterns from a completed mission.
 */
declare const learnFromMission: <ThrowOnError extends boolean = false>(options: Options<LearnFromMissionData, ThrowOnError>) => RequestResult<LearnFromMissionResponses, unknown, ThrowOnError, "fields">;

/**
 * WebSocket service for OCXP real-time communication
 * Provides push notifications for job progress, sync events, etc.
 */
type WebSocketMessageType = 'job_progress' | 'repo_status' | 'notification' | 'sync_event';
interface WebSocketMessage {
    type: WebSocketMessageType;
    [key: string]: unknown;
}
interface JobProgressMessage extends WebSocketMessage {
    type: 'job_progress';
    job_id: string;
    status: string;
    progress: number;
    files_processed: number;
    total_files: number;
    error?: string;
}
interface RepoStatusMessage extends WebSocketMessage {
    type: 'repo_status';
    repo_id: string;
    status: string;
    kb_synced: boolean;
    s3_path?: string;
    files_count?: number;
}
interface NotificationMessage extends WebSocketMessage {
    type: 'notification';
    title: string;
    message: string;
    level: 'info' | 'warning' | 'error' | 'success';
    action?: {
        label: string;
        url: string;
    };
}
interface SyncEventMessage extends WebSocketMessage {
    type: 'sync_event';
    event: string;
    path?: string;
    content_type?: string;
}
interface WebSocketServiceOptions {
    /** WebSocket endpoint (wss://...) */
    endpoint: string;
    /** Workspace for scoping */
    workspace: string;
    /** Optional user ID */
    userId?: string;
    /** Token provider (same as OCXPClient) */
    token?: string | (() => Promise<string>);
    /** Max reconnection attempts (default: 5) */
    maxReconnectAttempts?: number;
    /** Reconnection delay base in ms (default: 1000) */
    reconnectDelayMs?: number;
    /** Connection timeout in ms (default: 10000) */
    connectionTimeoutMs?: number;
}
type WebSocketEventHandler<T extends WebSocketMessage = WebSocketMessage> = (message: T) => void;
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
declare class WebSocketService {
    private options;
    private ws;
    private reconnectAttempts;
    private reconnectTimeout;
    private eventHandlers;
    private connectionStateHandlers;
    private connectionPromise;
    private _connectionState;
    private shouldReconnect;
    constructor(options: WebSocketServiceOptions);
    /**
     * Get current connection state
     */
    get connectionState(): ConnectionState;
    /**
     * Check if connected
     */
    get connected(): boolean;
    /**
     * Connect to WebSocket server
     */
    connect(): Promise<void>;
    private setConnectionState;
    private doConnect;
    private handleReconnect;
    private dispatchMessage;
    /**
     * Subscribe to message types
     * @returns Unsubscribe function
     */
    on<T extends WebSocketMessage = WebSocketMessage>(type: WebSocketMessageType | '*', handler: WebSocketEventHandler<T>): () => void;
    /**
     * Subscribe to job progress updates
     */
    onJobProgress(handler: WebSocketEventHandler<JobProgressMessage>): () => void;
    /**
     * Subscribe to repository status updates
     */
    onRepoStatus(handler: WebSocketEventHandler<RepoStatusMessage>): () => void;
    /**
     * Subscribe to notifications
     */
    onNotification(handler: WebSocketEventHandler<NotificationMessage>): () => void;
    /**
     * Subscribe to sync events
     */
    onSyncEvent(handler: WebSocketEventHandler<SyncEventMessage>): () => void;
    /**
     * Subscribe to connection state changes
     */
    onConnectionStateChange(handler: (state: ConnectionState) => void): () => void;
    /**
     * Subscribe to specific job updates
     */
    subscribeToJob(jobId: string): void;
    /**
     * Subscribe to repository updates
     */
    subscribeToRepo(repoId: string): void;
    /**
     * Send message to server
     */
    send(data: object): void;
    /**
     * Send ping to keep connection alive
     */
    ping(): void;
    /**
     * Disconnect and cleanup
     */
    disconnect(): void;
    /**
     * Clear all event handlers
     */
    clearHandlers(): void;
}
/**
 * Create WebSocket service with same options pattern as OCXPClient
 */
declare function createWebSocketService(options: WebSocketServiceOptions): WebSocketService;

/**
 * OCXP Error Types
 *
 * Typed error classes for the OCXP SDK providing structured error handling
 * with error codes, HTTP status codes, and detailed context.
 */
/**
 * Error codes for OCXP operations
 */
declare enum OCXPErrorCode {
    /** Network-level error (connection failed, timeout, etc.) */
    NETWORK_ERROR = "NETWORK_ERROR",
    /** Request or response validation failed */
    VALIDATION_ERROR = "VALIDATION_ERROR",
    /** Authentication or authorization failed */
    AUTH_ERROR = "AUTH_ERROR",
    /** Resource not found */
    NOT_FOUND = "NOT_FOUND",
    /** Rate limit exceeded */
    RATE_LIMITED = "RATE_LIMITED",
    /** Conflict (e.g., etag mismatch) */
    CONFLICT = "CONFLICT",
    /** Operation timed out */
    TIMEOUT = "TIMEOUT",
    /** Server-side error */
    SERVER_ERROR = "SERVER_ERROR",
    /** Unknown error */
    UNKNOWN = "UNKNOWN"
}
/**
 * Base error class for all OCXP errors
 */
declare class OCXPError extends Error {
    /** Error code for programmatic handling */
    readonly code: OCXPErrorCode;
    /** HTTP status code if applicable */
    readonly statusCode: number;
    /** Additional error details */
    readonly details?: Record<string, unknown>;
    /** Request ID for debugging */
    readonly requestId?: string;
    /** Original cause of the error */
    readonly cause?: Error;
    constructor(message: string, code?: OCXPErrorCode, statusCode?: number, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
    /**
     * Convert error to JSON for logging/serialization
     */
    toJSON(): Record<string, unknown>;
}
/**
 * Network-level error (connection failed, DNS resolution, etc.)
 */
declare class OCXPNetworkError extends OCXPError {
    constructor(message: string, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Validation error (request or response validation failed)
 */
declare class OCXPValidationError extends OCXPError {
    /** Field-level validation errors */
    readonly validationErrors?: Record<string, string[]>;
    constructor(message: string, validationErrors?: Record<string, string[]>, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Authentication or authorization error
 */
declare class OCXPAuthError extends OCXPError {
    constructor(message: string, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Resource not found error
 */
declare class OCXPNotFoundError extends OCXPError {
    /** The resource path that was not found */
    readonly path?: string;
    constructor(message: string, path?: string, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Rate limit exceeded error
 */
declare class OCXPRateLimitError extends OCXPError {
    /** Seconds until rate limit resets */
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Conflict error (e.g., etag mismatch, concurrent modification)
 */
declare class OCXPConflictError extends OCXPError {
    /** Expected etag value */
    readonly expectedEtag?: string;
    /** Actual etag value */
    readonly actualEtag?: string;
    constructor(message: string, options?: {
        expectedEtag?: string;
        actualEtag?: string;
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Operation timeout error
 */
declare class OCXPTimeoutError extends OCXPError {
    /** Timeout duration in milliseconds */
    readonly timeoutMs?: number;
    constructor(message?: string, timeoutMs?: number, options?: {
        details?: Record<string, unknown>;
        requestId?: string;
        cause?: Error;
    });
}
/**
 * Type guard to check if an error is an OCXPError
 */
declare function isOCXPError(error: unknown): error is OCXPError;
/**
 * Type guard for specific error types
 */
declare function isOCXPNetworkError(error: unknown): error is OCXPNetworkError;
declare function isOCXPValidationError(error: unknown): error is OCXPValidationError;
declare function isOCXPAuthError(error: unknown): error is OCXPAuthError;
declare function isOCXPNotFoundError(error: unknown): error is OCXPNotFoundError;
declare function isOCXPRateLimitError(error: unknown): error is OCXPRateLimitError;
declare function isOCXPConflictError(error: unknown): error is OCXPConflictError;
declare function isOCXPTimeoutError(error: unknown): error is OCXPTimeoutError;
/**
 * Map HTTP status code to appropriate OCXP error
 */
declare function mapHttpError(statusCode: number, message: string, options?: {
    details?: Record<string, unknown>;
    requestId?: string;
    path?: string;
    retryAfter?: number;
}): OCXPError;

/**
 * Common Zod Schemas for OCXP API
 *
 * Shared schemas used across all API responses.
 */

/**
 * Response metadata schema
 */
declare const MetaSchema: z.ZodObject<{
    requestId: z.ZodString;
    timestamp: z.ZodString;
    durationMs: z.ZodNumber;
    operation: z.ZodString;
}, z.core.$strip>;
type Meta = z.infer<typeof MetaSchema>;
/**
 * Error response schema
 */
declare const ErrorResponseSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
/**
 * Base OCXP Response wrapper schema
 * All API responses follow this structure
 */
declare const OCXPResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type OCXPResponse = z.infer<typeof OCXPResponseSchema>;
/**
 * Pagination schema for list responses
 */
declare const PaginationSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hasMore: z.ZodBoolean;
    total: z.ZodNumber;
}, z.core.$strip>;
type Pagination = z.infer<typeof PaginationSchema>;
/**
 * Content type enum - the 8 valid content types
 */
declare const ContentTypeSchema: z.ZodEnum<{
    mission: "mission";
    project: "project";
    context: "context";
    sop: "sop";
    repo: "repo";
    artifact: "artifact";
    kb: "kb";
    docs: "docs";
}>;
/**
 * Helper to create typed OCXP response schema
 */
declare function createResponseSchema<T extends z.ZodTypeAny>(dataSchema: T): z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;

/**
 * Content CRUD Zod Schemas
 *
 * Schemas for content operations: list, read, write, delete, query, search, etc.
 */

/**
 * List entry schema - represents a file or directory in a list response
 */
declare const ListEntrySchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        file: "file";
        directory: "directory";
    }>;
    path: z.ZodString;
    size: z.ZodOptional<z.ZodNumber>;
    mtime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * List response data schema
 */
declare const ListDataSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            file: "file";
            directory: "directory";
        }>;
        path: z.ZodString;
        size: z.ZodOptional<z.ZodNumber>;
        mtime: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hasMore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
type ListData = z.infer<typeof ListDataSchema>;
/**
 * List response schema
 */
declare const ListResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        entries: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                file: "file";
                directory: "directory";
            }>;
            path: z.ZodString;
            size: z.ZodOptional<z.ZodNumber>;
            mtime: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        hasMore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ListResponse = z.infer<typeof ListResponseSchema>;
/**
 * Read response data schema
 */
declare const ReadDataSchema: z.ZodObject<{
    content: z.ZodString;
    size: z.ZodOptional<z.ZodNumber>;
    mtime: z.ZodOptional<z.ZodString>;
    encoding: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    etag: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ReadData = z.infer<typeof ReadDataSchema>;
/**
 * Read response schema
 */
declare const ReadResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        content: z.ZodString;
        size: z.ZodOptional<z.ZodNumber>;
        mtime: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        etag: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ReadResponse = z.infer<typeof ReadResponseSchema>;
/**
 * Write response data schema
 */
declare const WriteDataSchema: z.ZodObject<{
    path: z.ZodString;
    etag: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type WriteData = z.infer<typeof WriteDataSchema>;
/**
 * Write response schema
 */
declare const WriteResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        etag: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type WriteResponse = z.infer<typeof WriteResponseSchema>;
/**
 * Delete response data schema
 */
declare const DeleteDataSchema: z.ZodObject<{
    path: z.ZodString;
    deleted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
type DeleteData = z.infer<typeof DeleteDataSchema>;
/**
 * Delete response schema
 */
declare const DeleteResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        deleted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type DeleteResponse = z.infer<typeof DeleteResponseSchema>;
/**
 * Query filter schema
 */
declare const QueryFilterSchema: z.ZodObject<{
    field: z.ZodString;
    operator: z.ZodEnum<{
        startsWith: "startsWith";
        eq: "eq";
        ne: "ne";
        gt: "gt";
        lt: "lt";
        gte: "gte";
        lte: "lte";
        contains: "contains";
    }>;
    value: z.ZodUnknown;
}, z.core.$strip>;
/**
 * Query response data schema
 */
declare const QueryDataSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hasMore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
type QueryData = z.infer<typeof QueryDataSchema>;
/**
 * Query response schema
 */
declare const QueryResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        items: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        hasMore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type QueryResponse = z.infer<typeof QueryResponseSchema>;
/**
 * Search response data schema
 */
declare const SearchDataSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        score: z.ZodOptional<z.ZodNumber>;
        highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
        content: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
type SearchData = z.infer<typeof SearchDataSchema>;
/**
 * Search response schema
 */
declare const SearchResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
            content: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        total: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type SearchResponse = z.infer<typeof SearchResponseSchema>;
/**
 * Tree node schema
 */
declare const TreeNodeSchema: z.ZodType<TreeNode>;
interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    children?: TreeNode[];
}
/**
 * Tree response data schema
 */
declare const TreeDataSchema: z.ZodObject<{
    root: z.ZodType<TreeNode, unknown, z.core.$ZodTypeInternals<TreeNode, unknown>>;
    depth: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type TreeData = z.infer<typeof TreeDataSchema>;
/**
 * Tree response schema
 */
declare const TreeResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        root: z.ZodType<TreeNode, unknown, z.core.$ZodTypeInternals<TreeNode, unknown>>;
        depth: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type TreeResponse = z.infer<typeof TreeResponseSchema>;
/**
 * Stats response data schema
 */
declare const StatsDataSchema: z.ZodObject<{
    totalFiles: z.ZodNumber;
    totalSize: z.ZodNumber;
    lastModified: z.ZodOptional<z.ZodString>;
    fileTypes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, z.core.$strip>;
type StatsData = z.infer<typeof StatsDataSchema>;
/**
 * Stats response schema
 */
declare const StatsResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        totalFiles: z.ZodNumber;
        totalSize: z.ZodNumber;
        lastModified: z.ZodOptional<z.ZodString>;
        fileTypes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type StatsResponse = z.infer<typeof StatsResponseSchema>;
/**
 * Content type info schema
 */
declare const ContentTypeInfoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    prefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isVirtual: z.ZodOptional<z.ZodBoolean>;
    isGlobal: z.ZodOptional<z.ZodBoolean>;
    count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    endpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
type ContentTypeInfo = z.infer<typeof ContentTypeInfoSchema>;
/**
 * Get content types response data schema
 */
declare const ContentTypesDataSchema: z.ZodObject<{
    types: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        prefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isVirtual: z.ZodOptional<z.ZodBoolean>;
        isGlobal: z.ZodOptional<z.ZodBoolean>;
        count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        endpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ContentTypesData = z.infer<typeof ContentTypesDataSchema>;
/**
 * Content types response schema
 */
declare const ContentTypesResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        types: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            prefix: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isVirtual: z.ZodOptional<z.ZodBoolean>;
            isGlobal: z.ZodOptional<z.ZodBoolean>;
            count: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            endpoints: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ContentTypesResponse = z.infer<typeof ContentTypesResponseSchema>;
/**
 * Presigned URL response data schema
 */
declare const PresignedUrlDataSchema: z.ZodObject<{
    url: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<{
        GET: "GET";
        PUT: "PUT";
    }>>;
}, z.core.$strip>;
type PresignedUrlData = z.infer<typeof PresignedUrlDataSchema>;
/**
 * Presigned URL response schema
 */
declare const PresignedUrlResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        expiresAt: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodEnum<{
            GET: "GET";
            PUT: "PUT";
        }>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type PresignedUrlResponse = z.infer<typeof PresignedUrlResponseSchema>;

/**
 * Session Zod Schemas
 *
 * Schemas for session management operations.
 */

/**
 * Session message schema
 */
declare const SessionMessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
        system: "system";
    }>;
    content: z.ZodString;
    timestamp: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type SessionMessage = z.infer<typeof SessionMessageSchema>;
/**
 * Session schema
 */
declare const SessionSchema: z.ZodObject<{
    id: z.ZodString;
    missionId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    messageCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type Session = z.infer<typeof SessionSchema>;
/**
 * List sessions response data schema
 */
declare const ListSessionsDataSchema: z.ZodObject<{
    sessions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        missionId: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        messageCount: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * List sessions response schema
 */
declare const ListSessionsResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        sessions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            missionId: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            messageCount: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Create session response data schema
 */
declare const CreateSessionDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    missionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Create session response schema
 */
declare const CreateSessionResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        missionId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Get session messages response data schema
 */
declare const GetSessionMessagesDataSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
            system: "system";
        }>;
        content: z.ZodString;
        timestamp: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Get session messages response schema
 */
declare const GetSessionMessagesResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            role: z.ZodEnum<{
                user: "user";
                assistant: "assistant";
                system: "system";
            }>;
            content: z.ZodString;
            timestamp: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        sessionId: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Update session metadata response data schema
 */
declare const UpdateSessionMetadataDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
/**
 * Update session metadata response schema
 */
declare const UpdateSessionMetadataResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Fork session response data schema
 */
declare const ForkSessionDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    forkedFromId: z.ZodString;
}, z.core.$strip>;
/**
 * Fork session response schema
 */
declare const ForkSessionResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        sessionId: z.ZodString;
        forkedFromId: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;

/**
 * Project Zod Schemas
 *
 * Schemas for project management operations.
 */

/**
 * Project repo reference schema
 */
declare const ProjectRepoSchema: z.ZodObject<{
    repoId: z.ZodString;
    isDefault: z.ZodOptional<z.ZodBoolean>;
    addedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ProjectRepo = z.infer<typeof ProjectRepoSchema>;
/**
 * Project mission reference schema
 */
declare const ProjectMissionSchema: z.ZodObject<{
    missionId: z.ZodString;
    addedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ProjectMission = z.infer<typeof ProjectMissionSchema>;
/**
 * Project schema
 */
declare const ProjectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
        repoId: z.ZodString;
        isDefault: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        missionId: z.ZodString;
        addedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    defaultRepoId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type Project = z.infer<typeof ProjectSchema>;
/**
 * List projects response data schema
 */
declare const ListProjectsDataSchema: z.ZodObject<{
    projects: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            repoId: z.ZodString;
            isDefault: z.ZodOptional<z.ZodBoolean>;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            missionId: z.ZodString;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        defaultRepoId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * List projects response schema
 */
declare const ListProjectsResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        projects: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodOptional<z.ZodString>;
            repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
                repoId: z.ZodString;
                isDefault: z.ZodOptional<z.ZodBoolean>;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                missionId: z.ZodString;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            defaultRepoId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Create project response data schema
 */
declare const CreateProjectDataSchema: z.ZodObject<{
    projectId: z.ZodString;
    project: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            repoId: z.ZodString;
            isDefault: z.ZodOptional<z.ZodBoolean>;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            missionId: z.ZodString;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        defaultRepoId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Create project response schema
 */
declare const CreateProjectResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        projectId: z.ZodString;
        project: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodOptional<z.ZodString>;
            repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
                repoId: z.ZodString;
                isDefault: z.ZodOptional<z.ZodBoolean>;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                missionId: z.ZodString;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            defaultRepoId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Get project response data schema
 */
declare const GetProjectDataSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodString>;
    repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
        repoId: z.ZodString;
        isDefault: z.ZodOptional<z.ZodBoolean>;
        addedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        missionId: z.ZodString;
        addedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    defaultRepoId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Get project response schema
 */
declare const GetProjectResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            repoId: z.ZodString;
            isDefault: z.ZodOptional<z.ZodBoolean>;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            missionId: z.ZodString;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        defaultRepoId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Update project response data schema
 */
declare const UpdateProjectDataSchema: z.ZodObject<{
    projectId: z.ZodString;
    project: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
        repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            repoId: z.ZodString;
            isDefault: z.ZodOptional<z.ZodBoolean>;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            missionId: z.ZodString;
            addedAt: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        defaultRepoId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Update project response schema
 */
declare const UpdateProjectResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        projectId: z.ZodString;
        project: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodOptional<z.ZodString>;
            repos: z.ZodOptional<z.ZodArray<z.ZodObject<{
                repoId: z.ZodString;
                isDefault: z.ZodOptional<z.ZodBoolean>;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            missions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                missionId: z.ZodString;
                addedAt: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            defaultRepoId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Delete project response data schema
 */
declare const DeleteProjectDataSchema: z.ZodObject<{
    projectId: z.ZodString;
    deleted: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Delete project response schema
 */
declare const DeleteProjectResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        projectId: z.ZodString;
        deleted: z.ZodBoolean;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Add project repo response data schema
 */
declare const AddProjectRepoDataSchema: z.ZodObject<{
    projectId: z.ZodString;
    repoId: z.ZodString;
}, z.core.$strip>;
/**
 * Add project repo response schema
 */
declare const AddProjectRepoResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        projectId: z.ZodString;
        repoId: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Context repos response data schema
 */
declare const ContextReposDataSchema: z.ZodObject<{
    repos: z.ZodArray<z.ZodObject<{
        repoId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ContextReposData = z.infer<typeof ContextReposDataSchema>;
/**
 * Context repos response schema
 */
declare const ContextReposResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repos: z.ZodArray<z.ZodObject<{
            repoId: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            isDefault: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ContextReposResponse = z.infer<typeof ContextReposResponseSchema>;

/**
 * Repository Zod Schemas
 *
 * Schemas for repository management operations.
 */

/**
 * Repository download status enum
 */
declare const RepoStatusEnum: z.ZodEnum<{
    queued: "queued";
    processing: "processing";
    uploading: "uploading";
    vectorizing: "vectorizing";
    complete: "complete";
    failed: "failed";
}>;
type RepoStatus = z.infer<typeof RepoStatusEnum>;
/**
 * Repository download request schema
 */
declare const RepoDownloadRequestSchema: z.ZodObject<{
    github_url: z.ZodString;
    repo_id: z.ZodString;
    branch: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        full: "full";
        docs_only: "docs_only";
    }>>>;
    include_extensions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exclude_patterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    max_file_size_kb: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    visibility: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        private: "private";
        public: "public";
    }>>>;
    trigger_vectorization: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    generate_metadata: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    is_private: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
type RepoDownloadRequest = z.infer<typeof RepoDownloadRequestSchema>;
/**
 * Repository download response data schema
 */
declare const RepoDownloadDataSchema: z.ZodObject<{
    repo_id: z.ZodString;
    job_id: z.ZodString;
    s3_path: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        queued: "queued";
        processing: "processing";
        uploading: "uploading";
        vectorizing: "vectorizing";
        complete: "complete";
        failed: "failed";
    }>;
    files_processed: z.ZodOptional<z.ZodNumber>;
    metadata_files_created: z.ZodOptional<z.ZodNumber>;
    ingestion_job_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type RepoDownloadData = z.infer<typeof RepoDownloadDataSchema>;
/**
 * Repository download response schema
 */
declare const RepoDownloadResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repo_id: z.ZodString;
        job_id: z.ZodString;
        s3_path: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            queued: "queued";
            processing: "processing";
            uploading: "uploading";
            vectorizing: "vectorizing";
            complete: "complete";
            failed: "failed";
        }>;
        files_processed: z.ZodOptional<z.ZodNumber>;
        metadata_files_created: z.ZodOptional<z.ZodNumber>;
        ingestion_job_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type RepoDownloadResponse = z.infer<typeof RepoDownloadResponseSchema>;
/**
 * Repository status response data schema
 */
declare const RepoStatusDataSchema: z.ZodObject<{
    job_id: z.ZodString;
    status: z.ZodEnum<{
        queued: "queued";
        processing: "processing";
        uploading: "uploading";
        vectorizing: "vectorizing";
        complete: "complete";
        failed: "failed";
    }>;
    progress: z.ZodOptional<z.ZodNumber>;
    files_processed: z.ZodOptional<z.ZodNumber>;
    total_files: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type RepoStatusData = z.infer<typeof RepoStatusDataSchema>;
/**
 * Repository status response schema
 */
declare const RepoStatusResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        job_id: z.ZodString;
        status: z.ZodEnum<{
            queued: "queued";
            processing: "processing";
            uploading: "uploading";
            vectorizing: "vectorizing";
            complete: "complete";
            failed: "failed";
        }>;
        progress: z.ZodOptional<z.ZodNumber>;
        files_processed: z.ZodOptional<z.ZodNumber>;
        total_files: z.ZodOptional<z.ZodNumber>;
        error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type RepoStatusResponse = z.infer<typeof RepoStatusResponseSchema>;
/**
 * Repository list item schema
 */
declare const RepoListItemSchema: z.ZodObject<{
    repo_id: z.ZodString;
    github_url: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<{
        private: "private";
        public: "public";
    }>>;
    mode: z.ZodOptional<z.ZodEnum<{
        full: "full";
        docs_only: "docs_only";
    }>>;
    files_count: z.ZodOptional<z.ZodNumber>;
    last_synced: z.ZodOptional<z.ZodString>;
    s3_path: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type RepoListItem = z.infer<typeof RepoListItemSchema>;
/**
 * Repository list response data schema
 */
declare const RepoListDataSchema: z.ZodObject<{
    repos: z.ZodArray<z.ZodObject<{
        repo_id: z.ZodString;
        github_url: z.ZodOptional<z.ZodString>;
        branch: z.ZodOptional<z.ZodString>;
        visibility: z.ZodOptional<z.ZodEnum<{
            private: "private";
            public: "public";
        }>>;
        mode: z.ZodOptional<z.ZodEnum<{
            full: "full";
            docs_only: "docs_only";
        }>>;
        files_count: z.ZodOptional<z.ZodNumber>;
        last_synced: z.ZodOptional<z.ZodString>;
        s3_path: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type RepoListData = z.infer<typeof RepoListDataSchema>;
/**
 * Repository list response schema
 */
declare const RepoListResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repos: z.ZodArray<z.ZodObject<{
            repo_id: z.ZodString;
            github_url: z.ZodOptional<z.ZodString>;
            branch: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodEnum<{
                private: "private";
                public: "public";
            }>>;
            mode: z.ZodOptional<z.ZodEnum<{
                full: "full";
                docs_only: "docs_only";
            }>>;
            files_count: z.ZodOptional<z.ZodNumber>;
            last_synced: z.ZodOptional<z.ZodString>;
            s3_path: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        total: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type RepoListResponse = z.infer<typeof RepoListResponseSchema>;
/**
 * Repository exists response data schema
 */
declare const RepoExistsDataSchema: z.ZodObject<{
    repo_id: z.ZodString;
    exists: z.ZodBoolean;
    indexed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    files_count: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type RepoExistsData = z.infer<typeof RepoExistsDataSchema>;
/**
 * Repository exists response schema
 */
declare const RepoExistsResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repo_id: z.ZodString;
        exists: z.ZodBoolean;
        indexed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        files_count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type RepoExistsResponse = z.infer<typeof RepoExistsResponseSchema>;
/**
 * Repository delete response data schema
 */
declare const RepoDeleteDataSchema: z.ZodObject<{
    repo_id: z.ZodString;
    success: z.ZodBoolean;
    s3_files_deleted: z.ZodOptional<z.ZodNumber>;
    projects_updated: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type RepoDeleteData = z.infer<typeof RepoDeleteDataSchema>;
/**
 * Repository delete response schema
 */
declare const RepoDeleteResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repo_id: z.ZodString;
        success: z.ZodBoolean;
        s3_files_deleted: z.ZodOptional<z.ZodNumber>;
        projects_updated: z.ZodOptional<z.ZodNumber>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type RepoDeleteResponse = z.infer<typeof RepoDeleteResponseSchema>;

/**
 * Auth Zod Schemas
 *
 * Schemas for authentication and authorization operations.
 */

/**
 * Auth token response data schema
 */
declare const AuthTokenDataSchema: z.ZodObject<{
    accessToken: z.ZodString;
    tokenType: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    expiresIn: z.ZodOptional<z.ZodNumber>;
    expiresAt: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type AuthTokenData = z.infer<typeof AuthTokenDataSchema>;
/**
 * Auth token response schema
 */
declare const AuthTokenResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        accessToken: z.ZodString;
        tokenType: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        expiresIn: z.ZodOptional<z.ZodNumber>;
        expiresAt: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
/**
 * Auth user info schema
 */
declare const AuthUserInfoSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type AuthUserInfo = z.infer<typeof AuthUserInfoSchema>;
/**
 * Auth user info response schema
 */
declare const AuthUserInfoResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        userId: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AuthUserInfoResponse = z.infer<typeof AuthUserInfoResponseSchema>;
/**
 * Auth validate response data schema
 */
declare const AuthValidateDataSchema: z.ZodObject<{
    valid: z.ZodBoolean;
    userId: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type AuthValidateData = z.infer<typeof AuthValidateDataSchema>;
/**
 * Auth validate response schema
 */
declare const AuthValidateResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        valid: z.ZodBoolean;
        userId: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type AuthValidateResponse = z.infer<typeof AuthValidateResponseSchema>;

/**
 * Discovery & Knowledge Base Zod Schemas
 *
 * Schemas for discovery, search, and knowledge base operations.
 */

/**
 * Search result item schema
 */
declare const SearchResultItemSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    score: z.ZodOptional<z.ZodNumber>;
    highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    source: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type SearchResultItem = z.infer<typeof SearchResultItemSchema>;
/**
 * Vector search response data schema
 */
declare const VectorSearchDataSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodNumber>;
        highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        source: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
    processingTimeMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type VectorSearchData = z.infer<typeof VectorSearchDataSchema>;
/**
 * Vector search response schema
 */
declare const VectorSearchResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            score: z.ZodOptional<z.ZodNumber>;
            highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            source: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        total: z.ZodOptional<z.ZodNumber>;
        query: z.ZodOptional<z.ZodString>;
        processingTimeMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type VectorSearchResponse = z.infer<typeof VectorSearchResponseSchema>;
/**
 * KB document schema
 */
declare const KBDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    vectorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type KBDocument = z.infer<typeof KBDocumentSchema>;
/**
 * KB list response data schema
 */
declare const KBListDataSchema: z.ZodObject<{
    documents: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        vectorId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    hasMore: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type KBListData = z.infer<typeof KBListDataSchema>;
/**
 * KB list response schema
 */
declare const KBListResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        documents: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodOptional<z.ZodString>;
            updatedAt: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            vectorId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        total: z.ZodOptional<z.ZodNumber>;
        cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type KBListResponse = z.infer<typeof KBListResponseSchema>;
/**
 * KB ingest response data schema
 */
declare const KBIngestDataSchema: z.ZodObject<{
    documentId: z.ZodString;
    vectorId: z.ZodOptional<z.ZodString>;
    chunksCreated: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        processing: "processing";
        complete: "complete";
        failed: "failed";
        pending: "pending";
    }>>;
}, z.core.$strip>;
type KBIngestData = z.infer<typeof KBIngestDataSchema>;
/**
 * KB ingest response schema
 */
declare const KBIngestResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        documentId: z.ZodString;
        vectorId: z.ZodOptional<z.ZodString>;
        chunksCreated: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<{
            processing: "processing";
            complete: "complete";
            failed: "failed";
            pending: "pending";
        }>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type KBIngestResponse = z.infer<typeof KBIngestResponseSchema>;
/**
 * Discovery endpoint schema
 */
declare const DiscoveryEndpointSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    methods: z.ZodArray<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    parameters: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
type DiscoveryEndpoint = z.infer<typeof DiscoveryEndpointSchema>;
/**
 * Discovery response data schema
 */
declare const DiscoveryDataSchema: z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    endpoints: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        methods: z.ZodArray<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parameters: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>;
    contentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type DiscoveryData = z.infer<typeof DiscoveryDataSchema>;
/**
 * Discovery response schema
 */
declare const DiscoveryResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        version: z.ZodOptional<z.ZodString>;
        endpoints: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            path: z.ZodString;
            methods: z.ZodArray<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            parameters: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>;
        contentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type DiscoveryResponse = z.infer<typeof DiscoveryResponseSchema>;
/**
 * Ingestion job schema
 */
declare const IngestionJobSchema: z.ZodObject<{
    jobId: z.ZodString;
    status: z.ZodEnum<{
        queued: "queued";
        processing: "processing";
        complete: "complete";
        failed: "failed";
    }>;
    progress: z.ZodOptional<z.ZodNumber>;
    documentsProcessed: z.ZodOptional<z.ZodNumber>;
    totalDocuments: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    completedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
type IngestionJob = z.infer<typeof IngestionJobSchema>;
/**
 * Ingestion job response schema
 */
declare const IngestionJobResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        jobId: z.ZodString;
        status: z.ZodEnum<{
            queued: "queued";
            processing: "processing";
            complete: "complete";
            failed: "failed";
        }>;
        progress: z.ZodOptional<z.ZodNumber>;
        documentsProcessed: z.ZodOptional<z.ZodNumber>;
        totalDocuments: z.ZodOptional<z.ZodNumber>;
        error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        startedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        completedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type IngestionJobResponse = z.infer<typeof IngestionJobResponseSchema>;

/**
 * WebSocket Message Zod Schemas
 *
 * Schemas for WebSocket communication messages.
 */

/**
 * WebSocket message types
 */
declare const WSMessageTypeSchema: z.ZodEnum<{
    error: "error";
    status: "status";
    disconnected: "disconnected";
    connected: "connected";
    ping: "ping";
    chat: "chat";
    chat_response: "chat_response";
    stream_start: "stream_start";
    stream_chunk: "stream_chunk";
    stream_end: "stream_end";
    pong: "pong";
    session_start: "session_start";
    session_end: "session_end";
    typing: "typing";
}>;
type WSMessageType = z.infer<typeof WSMessageTypeSchema>;
/**
 * Base WebSocket message schema
 */
declare const WSBaseMessageSchema: z.ZodObject<{
    type: z.ZodEnum<{
        error: "error";
        status: "status";
        disconnected: "disconnected";
        connected: "connected";
        ping: "ping";
        chat: "chat";
        chat_response: "chat_response";
        stream_start: "stream_start";
        stream_chunk: "stream_chunk";
        stream_end: "stream_end";
        pong: "pong";
        session_start: "session_start";
        session_end: "session_end";
        typing: "typing";
    }>;
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type WSBaseMessage = z.infer<typeof WSBaseMessageSchema>;
/**
 * Chat message schema (user -> server)
 */
declare const WSChatMessageSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"chat">;
    content: z.ZodString;
    missionId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type WSChatMessage = z.infer<typeof WSChatMessageSchema>;
/**
 * Chat response schema (server -> client)
 */
declare const WSChatResponseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"chat_response">;
    content: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        assistant: "assistant";
        system: "system";
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    usage: z.ZodOptional<z.ZodObject<{
        promptTokens: z.ZodOptional<z.ZodNumber>;
        completionTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type WSChatResponse = z.infer<typeof WSChatResponseSchema>;
/**
 * Stream start message schema
 */
declare const WSStreamStartSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_start">;
    streamId: z.ZodString;
}, z.core.$strip>;
type WSStreamStart = z.infer<typeof WSStreamStartSchema>;
/**
 * Stream chunk message schema
 */
declare const WSStreamChunkSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_chunk">;
    streamId: z.ZodString;
    content: z.ZodString;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type WSStreamChunk = z.infer<typeof WSStreamChunkSchema>;
/**
 * Stream end message schema
 */
declare const WSStreamEndSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_end">;
    streamId: z.ZodString;
    usage: z.ZodOptional<z.ZodObject<{
        promptTokens: z.ZodOptional<z.ZodNumber>;
        completionTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type WSStreamEnd = z.infer<typeof WSStreamEndSchema>;
/**
 * Error message schema
 */
declare const WSErrorMessageSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
type WSErrorMessage = z.infer<typeof WSErrorMessageSchema>;
/**
 * Ping/Pong message schema
 */
declare const WSPingPongSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        ping: "ping";
        pong: "pong";
    }>;
}, z.core.$strip>;
type WSPingPong = z.infer<typeof WSPingPongSchema>;
/**
 * Connected message schema
 */
declare const WSConnectedSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"connected">;
    connectionId: z.ZodOptional<z.ZodString>;
    serverVersion: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type WSConnected = z.infer<typeof WSConnectedSchema>;
/**
 * Status message schema
 */
declare const WSStatusSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"status">;
    status: z.ZodEnum<{
        processing: "processing";
        ready: "ready";
        busy: "busy";
        idle: "idle";
    }>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type WSStatus = z.infer<typeof WSStatusSchema>;
/**
 * Union of all WebSocket message types
 */
declare const WSMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"chat">;
    content: z.ZodString;
    missionId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"chat_response">;
    content: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        assistant: "assistant";
        system: "system";
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    usage: z.ZodOptional<z.ZodObject<{
        promptTokens: z.ZodOptional<z.ZodNumber>;
        completionTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_start">;
    streamId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_chunk">;
    streamId: z.ZodString;
    content: z.ZodString;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"stream_end">;
    streamId: z.ZodString;
    usage: z.ZodOptional<z.ZodObject<{
        promptTokens: z.ZodOptional<z.ZodNumber>;
        completionTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"error">;
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"ping">;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"pong">;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"connected">;
    connectionId: z.ZodOptional<z.ZodString>;
    serverVersion: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"status">;
    status: z.ZodEnum<{
        processing: "processing";
        ready: "ready";
        busy: "busy";
        idle: "idle";
    }>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
type WSMessage = z.infer<typeof WSMessageSchema>;
/**
 * Safe parse result type
 */
type WSParseResult = {
    success: true;
    data: WSMessage;
} | {
    success: false;
    error: z.ZodError;
};
/**
 * Parse and validate a WebSocket message
 */
declare function parseWSMessage(data: string): WSMessage;
/**
 * Safe parse for WebSocket messages (returns result object)
 */
declare function safeParseWSMessage(data: string): WSParseResult;

/**
 * GitHub Proxy Zod Schemas
 *
 * Schemas for GitHub proxy operations.
 */

/**
 * GitHub file info schema
 */
declare const GithubFileInfoSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    sha: z.ZodString;
    size: z.ZodNumber;
    type: z.ZodEnum<{
        file: "file";
        dir: "dir";
        symlink: "symlink";
        submodule: "submodule";
    }>;
    url: z.ZodOptional<z.ZodString>;
    html_url: z.ZodOptional<z.ZodString>;
    git_url: z.ZodOptional<z.ZodString>;
    download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    encoding: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type GithubFileInfo = z.infer<typeof GithubFileInfoSchema>;
/**
 * GitHub repository info schema
 */
declare const GithubRepoInfoSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    full_name: z.ZodString;
    private: z.ZodBoolean;
    owner: z.ZodObject<{
        login: z.ZodString;
        id: z.ZodNumber;
        avatar_url: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    html_url: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fork: z.ZodOptional<z.ZodBoolean>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    pushed_at: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    stargazers_count: z.ZodOptional<z.ZodNumber>;
    watchers_count: z.ZodOptional<z.ZodNumber>;
    language: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    default_branch: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type GithubRepoInfo = z.infer<typeof GithubRepoInfoSchema>;
/**
 * GitHub branch info schema
 */
declare const GithubBranchInfoSchema: z.ZodObject<{
    name: z.ZodString;
    commit: z.ZodObject<{
        sha: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    protected: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type GithubBranchInfo = z.infer<typeof GithubBranchInfoSchema>;
/**
 * GitHub commit info schema
 */
declare const GithubCommitInfoSchema: z.ZodObject<{
    sha: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    committer: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    url: z.ZodOptional<z.ZodString>;
    html_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type GithubCommitInfo = z.infer<typeof GithubCommitInfoSchema>;
/**
 * GitHub proxy file response data schema
 */
declare const GithubFileDataSchema: z.ZodObject<{
    file: z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        sha: z.ZodString;
        size: z.ZodNumber;
        type: z.ZodEnum<{
            file: "file";
            dir: "dir";
            symlink: "symlink";
            submodule: "submodule";
        }>;
        url: z.ZodOptional<z.ZodString>;
        html_url: z.ZodOptional<z.ZodString>;
        git_url: z.ZodOptional<z.ZodString>;
        download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        content: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    content: z.ZodOptional<z.ZodString>;
    encoding: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type GithubFileData = z.infer<typeof GithubFileDataSchema>;
/**
 * GitHub proxy file response schema
 */
declare const GithubFileResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        file: z.ZodObject<{
            name: z.ZodString;
            path: z.ZodString;
            sha: z.ZodString;
            size: z.ZodNumber;
            type: z.ZodEnum<{
                file: "file";
                dir: "dir";
                symlink: "symlink";
                submodule: "submodule";
            }>;
            url: z.ZodOptional<z.ZodString>;
            html_url: z.ZodOptional<z.ZodString>;
            git_url: z.ZodOptional<z.ZodString>;
            download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodString>;
            encoding: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        content: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubFileResponse = z.infer<typeof GithubFileResponseSchema>;
/**
 * GitHub proxy directory response data schema
 */
declare const GithubDirectoryDataSchema: z.ZodObject<{
    entries: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        sha: z.ZodString;
        size: z.ZodNumber;
        type: z.ZodEnum<{
            file: "file";
            dir: "dir";
            symlink: "symlink";
            submodule: "submodule";
        }>;
        url: z.ZodOptional<z.ZodString>;
        html_url: z.ZodOptional<z.ZodString>;
        git_url: z.ZodOptional<z.ZodString>;
        download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        content: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    path: z.ZodString;
}, z.core.$strip>;
type GithubDirectoryData = z.infer<typeof GithubDirectoryDataSchema>;
/**
 * GitHub proxy directory response schema
 */
declare const GithubDirectoryResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        entries: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            path: z.ZodString;
            sha: z.ZodString;
            size: z.ZodNumber;
            type: z.ZodEnum<{
                file: "file";
                dir: "dir";
                symlink: "symlink";
                submodule: "submodule";
            }>;
            url: z.ZodOptional<z.ZodString>;
            html_url: z.ZodOptional<z.ZodString>;
            git_url: z.ZodOptional<z.ZodString>;
            download_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodString>;
            encoding: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        path: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubDirectoryResponse = z.infer<typeof GithubDirectoryResponseSchema>;
/**
 * GitHub proxy repo info response data schema
 */
declare const GithubRepoDataSchema: z.ZodObject<{
    repository: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        full_name: z.ZodString;
        private: z.ZodBoolean;
        owner: z.ZodObject<{
            login: z.ZodString;
            id: z.ZodNumber;
            avatar_url: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        html_url: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fork: z.ZodOptional<z.ZodBoolean>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
        pushed_at: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        stargazers_count: z.ZodOptional<z.ZodNumber>;
        watchers_count: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        default_branch: z.ZodOptional<z.ZodString>;
        visibility: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
type GithubRepoData = z.infer<typeof GithubRepoDataSchema>;
/**
 * GitHub proxy repo info response schema
 */
declare const GithubRepoResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        repository: z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
            full_name: z.ZodString;
            private: z.ZodBoolean;
            owner: z.ZodObject<{
                login: z.ZodString;
                id: z.ZodNumber;
                avatar_url: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            html_url: z.ZodString;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fork: z.ZodOptional<z.ZodBoolean>;
            created_at: z.ZodOptional<z.ZodString>;
            updated_at: z.ZodOptional<z.ZodString>;
            pushed_at: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
            stargazers_count: z.ZodOptional<z.ZodNumber>;
            watchers_count: z.ZodOptional<z.ZodNumber>;
            language: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            default_branch: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubRepoResponse = z.infer<typeof GithubRepoResponseSchema>;
/**
 * GitHub proxy branches response data schema
 */
declare const GithubBranchesDataSchema: z.ZodObject<{
    branches: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        commit: z.ZodObject<{
            sha: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        protected: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubBranchesData = z.infer<typeof GithubBranchesDataSchema>;
/**
 * GitHub proxy branches response schema
 */
declare const GithubBranchesResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        branches: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            commit: z.ZodObject<{
                sha: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            protected: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubBranchesResponse = z.infer<typeof GithubBranchesResponseSchema>;
/**
 * GitHub proxy commits response data schema
 */
declare const GithubCommitsDataSchema: z.ZodObject<{
    commits: z.ZodArray<z.ZodObject<{
        sha: z.ZodString;
        message: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            date: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        committer: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            date: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        url: z.ZodOptional<z.ZodString>;
        html_url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubCommitsData = z.infer<typeof GithubCommitsDataSchema>;
/**
 * GitHub proxy commits response schema
 */
declare const GithubCommitsResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        commits: z.ZodArray<z.ZodObject<{
            sha: z.ZodString;
            message: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                email: z.ZodOptional<z.ZodString>;
                date: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            committer: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                email: z.ZodOptional<z.ZodString>;
                date: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            url: z.ZodOptional<z.ZodString>;
            html_url: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    notifications: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    meta: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodString;
        timestamp: z.ZodString;
        durationMs: z.ZodNumber;
        operation: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GithubCommitsResponse = z.infer<typeof GithubCommitsResponseSchema>;

export { type AddProjectMissionData, type AddProjectMissionResponse, type AddProjectRepoData, AddProjectRepoDataSchema, type AddProjectRepoResponse, AddProjectRepoResponseSchema, type AuthGetConfigData, type AuthGetConfigResponse, type AuthListWorkspacesData, type AuthListWorkspacesResponse, type AuthLoginData, type AuthLoginResponse, type AuthRefreshData, type AuthRefreshResponse, type AuthTokenData, AuthTokenDataSchema, type AuthTokenResponse, AuthTokenResponseSchema, type AuthUserInfo, type AuthUserInfoResponse, AuthUserInfoResponseSchema, AuthUserInfoSchema, type AuthValidateData, AuthValidateDataSchema, type AuthValidateResponse, AuthValidateResponseSchema, type BulkDeleteContentData, type BulkDeleteContentResponse, type BulkDeleteRequestBody, type BulkReadContentData, type BulkReadContentResponse, type BulkReadRequestBody, type BulkWriteContentData, type BulkWriteContentResponse, type BulkWriteRequestBody, type CheckConflictsData, type CheckConflictsResponse, type CheckRepoExistsData, type CheckRepoExistsResponse, type Client, type ClientOptions, type Config, type ConnectionState, type ContentType, type ContentType2, type ContentTypeInfo, ContentTypeInfoSchema, ContentTypeSchema, type ContentTypeValue, type ContentTypesData, ContentTypesDataSchema, type ContentTypesResponse, ContentTypesResponseSchema, type ContentTypesResult, type ContextReposData, ContextReposDataSchema, type ContextReposResponse, ContextReposResponseSchema, type CreateDocsSnapshotData, type CreateDocsSnapshotResponse, type CreateMissionData, type CreateMissionResponse, type CreateMissionSessionData, type CreateMissionSessionResponse, type CreateProjectData, CreateProjectDataSchema, type CreateProjectResponse, CreateProjectResponseSchema, type CreateSessionData, CreateSessionDataSchema, type CreateSessionResponse, CreateSessionResponseSchema, type DeleteContentData, type DeleteContentResponse, type DeleteData, DeleteDataSchema, type DeleteProjectData, DeleteProjectDataSchema, type DeleteProjectResponse, DeleteProjectResponseSchema, type DeleteRepositoryData, type DeleteRepositoryResponse, type DeleteResponse, DeleteResponseSchema, type DeleteResult, type DiscoverRequest, type DiscoverSimilarData, type DiscoverSimilarResponse, type DiscoveryData, DiscoveryDataSchema, type DiscoveryEndpoint, DiscoveryEndpointSchema, type DiscoveryResponse, DiscoveryResponseSchema, type DownloadContentData, type DownloadContentResponse, type DownloadRepositoryData, type DownloadRepositoryResponse, type DownloadRequest, type ErrorResponse, ErrorResponseSchema, type FindByTicketData, type FindByTicketResponse, type FindContentByData, type FindContentByResponse, type ForkSessionData, ForkSessionDataSchema, type ForkSessionResponse, ForkSessionResponseSchema, type GetContentStatsData, type GetContentStatsResponse, type GetContentTreeData, type GetContentTreeResponse, type GetContentTypesData, type GetContentTypesResponse, type GetDocsSnapshotStatusData, type GetDocsSnapshotStatusResponse, type GetMissionContextData, type GetMissionContextResponse, type GetPresignedUrlData, type GetPresignedUrlResponse, type GetProjectContextReposData, type GetProjectContextReposResponse, type GetProjectData, GetProjectDataSchema, type GetProjectResponse, GetProjectResponseSchema, type GetRepoDownloadStatusData, type GetRepoDownloadStatusResponse, type GetSessionMessagesData, GetSessionMessagesDataSchema, type GetSessionMessagesResponse, GetSessionMessagesResponseSchema, type GithubBranchInfo, GithubBranchInfoSchema, type GithubBranchesData, GithubBranchesDataSchema, type GithubBranchesResponse, GithubBranchesResponseSchema, type GithubCheckAccessData, type GithubCheckAccessResponse, type GithubCommitInfo, GithubCommitInfoSchema, type GithubCommitsData, GithubCommitsDataSchema, type GithubCommitsResponse, GithubCommitsResponseSchema, type GithubDirectoryData, GithubDirectoryDataSchema, type GithubDirectoryResponse, GithubDirectoryResponseSchema, type GithubFileData, GithubFileDataSchema, type GithubFileInfo, GithubFileInfoSchema, type GithubFileResponse, GithubFileResponseSchema, type GithubGetContentsData, type GithubGetContentsResponse, type GithubListBranchesData, type GithubListBranchesResponse, type GithubRepoData, GithubRepoDataSchema, type GithubRepoInfo, GithubRepoInfoSchema, type GithubRepoResponse, GithubRepoResponseSchema, type IngestionJob, type IngestionJobResponse, IngestionJobResponseSchema, IngestionJobSchema, type JobProgressMessage, type KBDocument, KBDocumentSchema, type KBIngestData, KBIngestDataSchema, type KBIngestResponse, KBIngestResponseSchema, type KBListData, KBListDataSchema, type KBListResponse, KBListResponseSchema, type KbQueryRequest, type LearnFromMissionData, type LearnFromMissionResponse, type ListContentData, type ListContentResponse, type ListData, ListDataSchema, type ListDocsSnapshotsData, type ListDocsSnapshotsResponse, type ListDownloadedReposData, type ListDownloadedReposResponse, type ListEntry, ListEntrySchema, type ListMissionSessionsData, type ListMissionSessionsResponse, type ListProjectsData, ListProjectsDataSchema, type ListProjectsResponse, ListProjectsResponseSchema, type ListResponse, ListResponseSchema, type ListResult, type ListSessionsData, ListSessionsDataSchema, type ListSessionsResponse, ListSessionsResponseSchema, type LockContentData, type LockContentResponse, type Meta, MetaSchema, type MissionCreateRequest, type MoveContentData, type MoveContentResponse, type NotificationMessage, OCXPAuthError, OCXPClient, type OCXPClientOptions, OCXPConflictError, OCXPError, OCXPErrorCode, OCXPNetworkError, OCXPNotFoundError, OCXPPathService, type OCXPPathServiceOptions, OCXPRateLimitError, type OCXPResponse, OCXPResponseSchema, OCXPTimeoutError, OCXPValidationError, type OcxpResponse, type Options, type Pagination, PaginationSchema, type ParsedPath, type PathEntry, type PathFileInfo, type PathListResult, type PathMoveResult, type PathReadResult, type PathWriteOptions, type PathWriteResult, type PresignedUrlData, PresignedUrlDataSchema, type PresignedUrlRequest, type PresignedUrlResponse, PresignedUrlResponseSchema, type Project, type ProjectMission, ProjectMissionSchema, type ProjectRepo, ProjectRepoSchema, ProjectSchema, type QueryContentData, type QueryContentResponse, type QueryData, QueryDataSchema, type QueryFilter, QueryFilterSchema, type QueryKnowledgeBaseData, type QueryKnowledgeBaseResponse, type QueryResponse, QueryResponseSchema, type RagKnowledgeBaseData, type RagKnowledgeBaseResponse, type ReadContentData, type ReadContentResponse, type ReadData, ReadDataSchema, type ReadResponse, ReadResponseSchema, type ReadResult, type RefreshIndexData, type RefreshIndexResponse, type RemoveProjectMissionData, type RemoveProjectMissionResponse, type RemoveProjectRepoData, type RemoveProjectRepoResponse, type RepoDeleteData, RepoDeleteDataSchema, type RepoDeleteResponse, RepoDeleteResponseSchema, type RepoDownloadData, RepoDownloadDataSchema, type RepoDownloadRequest, RepoDownloadRequestSchema, type RepoDownloadResponse, RepoDownloadResponseSchema, type RepoExistsData, RepoExistsDataSchema, type RepoExistsResponse, RepoExistsResponseSchema, type RepoListData, RepoListDataSchema, type RepoListItem, RepoListItemSchema, type RepoListResponse, RepoListResponseSchema, type RepoStatus, type RepoStatusData, RepoStatusDataSchema, RepoStatusEnum, type RepoStatusMessage, type RepoStatusResponse, RepoStatusResponseSchema, type SearchContentData, type SearchContentResponse, type SearchData, SearchDataSchema, type SearchResponse, SearchResponseSchema, type SearchResultItem, SearchResultItemSchema, type Session, type SessionMessage, SessionMessageSchema, SessionSchema, type SetProjectDefaultRepoData, type SetProjectDefaultRepoResponse, type StatsData, StatsDataSchema, type StatsResponse, StatsResponseSchema, type SyncEventMessage, type TokenProvider, type TreeData, TreeDataSchema, type TreeNode, TreeNodeSchema, type TreeResponse, TreeResponseSchema, type TypedDeleteRequest, type TypedFindByRequest, type TypedListRequest, type TypedQueryRequest, type TypedSearchRequest, type TypedStatsRequest, type TypedTreeRequest, type UnlockContentData, type UnlockContentResponse, type UpdateMissionData, type UpdateMissionResponse, type UpdateProjectData, UpdateProjectDataSchema, type UpdateProjectResponse, UpdateProjectResponseSchema, type UpdateSessionMetadataData, UpdateSessionMetadataDataSchema, type UpdateSessionMetadataResponse, UpdateSessionMetadataResponseSchema, VALID_CONTENT_TYPES, type VectorSearchData, VectorSearchDataSchema, type VectorSearchResponse, VectorSearchResponseSchema, type WSBaseMessage, WSBaseMessageSchema, type WSChatMessage, WSChatMessageSchema, type WSChatResponse, WSChatResponseSchema, type WSConnected, WSConnectedSchema, type WSErrorMessage, WSErrorMessageSchema, type WSMessage, WSMessageSchema, type WSMessageType, WSMessageTypeSchema, type WSParseResult, type WSPingPong, WSPingPongSchema, type WSStatus, WSStatusSchema, type WSStreamChunk, WSStreamChunkSchema, type WSStreamEnd, WSStreamEndSchema, type WSStreamStart, WSStreamStartSchema, type WebSocketEventHandler, type WebSocketMessage, type WebSocketMessageType, WebSocketService, type WebSocketServiceOptions, type WriteContentData, type WriteContentResponse, type WriteData, WriteDataSchema, type WriteRequestBody, type WriteResponse, WriteResponseSchema, type WriteResult, addProjectMission, addProjectRepo, authGetConfig, authListWorkspaces, authLogin, authRefresh, buildPath, bulkDeleteContent, bulkReadContent, bulkWriteContent, checkConflicts, checkRepoExists, createClient, createConfig, createDocsSnapshot, createMission, createMissionSession, createOCXPClient, createPathService, createProject, createResponseSchema, createSession, createWebSocketService, deleteContent, deleteProject, deleteRepository, discoverSimilar, downloadContent, downloadRepository, findByTicket, findContentBy, forkSession, getCanonicalType, getContentStats, getContentTree, getContentTypes, getDocsSnapshotStatus, getMissionContext, getPresignedUrl, getProject, getProjectContextRepos, getRepoDownloadStatus, getSessionMessages, githubCheckAccess, githubGetContents, githubListBranches, isOCXPAuthError, isOCXPConflictError, isOCXPError, isOCXPNetworkError, isOCXPNotFoundError, isOCXPRateLimitError, isOCXPTimeoutError, isOCXPValidationError, isValidContentType, learnFromMission, listContent, listDocsSnapshots, listDownloadedRepos, listMissionSessions, listProjects, listSessions, lockContent, mapHttpError, moveContent, normalizePath, parsePath, parseWSMessage, queryContent, queryKnowledgeBase, ragKnowledgeBase, readContent, refreshIndex, removeProjectMission, removeProjectRepo, safeParseWSMessage, searchContent, setProjectDefaultRepo, unlockContent, updateMission, updateProject, updateSessionMetadata, writeContent };
