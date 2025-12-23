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
 * Acquire exclusive lock
 */
declare const lockContent: <ThrowOnError extends boolean = false>(options?: Options<LockContentData, ThrowOnError>) => RequestResult<LockContentResponses, unknown, ThrowOnError, "fields">;
/**
 * Release exclusive lock
 */
declare const unlockContent: <ThrowOnError extends boolean = false>(options?: Options<UnlockContentData, ThrowOnError>) => RequestResult<UnlockContentResponses, unknown, ThrowOnError, "fields">;

export { type BulkDeleteContentData, type BulkDeleteContentResponse, type BulkDeleteRequestBody, type BulkReadContentData, type BulkReadContentResponse, type BulkReadRequestBody, type BulkWriteContentData, type BulkWriteContentResponse, type BulkWriteRequestBody, type Client, type ClientOptions, type Config, type ContentType, type ContentType2, type ContentTypeValue, type ContentTypesResult, type CreateMissionData, type CreateMissionResponse, type DeleteContentData, type DeleteContentResponse, type DeleteResult, type DiscoverRequest, type DiscoverSimilarData, type DiscoverSimilarResponse, type DownloadRequest, type FindByTicketData, type FindByTicketResponse, type GetContentStatsData, type GetContentStatsResponse, type GetContentTreeData, type GetContentTreeResponse, type GetContentTypesData, type GetContentTypesResponse, type GetMissionContextData, type GetMissionContextResponse, type KbQueryRequest, type ListContentData, type ListContentResponse, type ListEntry, type ListResult, type LockContentData, type LockContentResponse, type MissionCreateRequest, OCXPClient, type OCXPClientOptions, OCXPPathService, type OCXPPathServiceOptions, type OcxpResponse, type Options, type ParsedPath, type PathEntry, type PathFileInfo, type PathListResult, type PathMoveResult, type PathReadResult, type PathWriteOptions, type PathWriteResult, type PresignedUrlRequest, type QueryContentData, type QueryContentResponse, type QueryFilter, type QueryKnowledgeBaseData, type QueryKnowledgeBaseResponse, type RagKnowledgeBaseData, type RagKnowledgeBaseResponse, type ReadContentData, type ReadContentResponse, type ReadResult, type SearchContentData, type SearchContentResponse, type TokenProvider, type TypedDeleteRequest, type TypedFindByRequest, type TypedListRequest, type TypedQueryRequest, type TypedSearchRequest, type TypedStatsRequest, type TypedTreeRequest, type UnlockContentData, type UnlockContentResponse, type UpdateMissionData, type UpdateMissionResponse, VALID_CONTENT_TYPES, type WriteContentData, type WriteContentResponse, type WriteRequestBody, type WriteResult, buildPath, bulkDeleteContent, bulkReadContent, bulkWriteContent, createClient, createConfig, createMission, createOCXPClient, createPathService, deleteContent, discoverSimilar, findByTicket, getCanonicalType, getContentStats, getContentTree, getContentTypes, getMissionContext, isValidContentType, listContent, lockContent, normalizePath, parsePath, queryContent, queryKnowledgeBase, ragKnowledgeBase, readContent, searchContent, unlockContent, updateMission, writeContent };
