import { z } from 'zod';

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

/**
 * AddDatabaseRequest
 */
type AddDatabaseRequest = {
    /**
     * Database Id
     *
     * Database config ID (UUID or 'amc-default')
     */
    database_id: string;
    /**
     * Priority
     *
     * Priority weight for database selection
     */
    priority?: number;
    /**
     * Auto Include
     *
     * Automatically include in agent context
     */
    auto_include?: boolean;
};
/**
 * AddMissionRequest
 */
type AddMissionRequest = {
    /**
     * Mission Id
     */
    mission_id: string;
};
/**
 * AddRepoRequest
 */
type AddRepoRequest = {
    /**
     * Repo Id
     */
    repo_id: string;
    /**
     * Category
     *
     * project|framework|tool|reference
     */
    category?: string;
    /**
     * Priority
     */
    priority?: number;
    /**
     * Auto Include
     */
    auto_include?: boolean;
    /**
     * Branch
     */
    branch?: string;
};
/**
 * AuthConfig
 */
type AuthConfig = {
    /**
     * Region
     */
    region: string;
    /**
     * User Pool Id
     */
    user_pool_id: string;
    /**
     * Client Id
     */
    client_id: string;
};
/**
 * Body_loginForAccessToken
 */
type BodyLoginForAccessToken = {
    /**
     * Grant Type
     */
    grant_type?: string | null;
    /**
     * Username
     */
    username: string;
    /**
     * Password
     */
    password: string;
    /**
     * Scope
     */
    scope?: string;
    /**
     * Client Id
     */
    client_id?: string | null;
    /**
     * Client Secret
     */
    client_secret?: string | null;
};
/**
 * BulkDeleteRequest
 */
type BulkDeleteRequest = {
    /**
     * Ids
     */
    ids: Array<string>;
};
/**
 * BulkDeleteResponse
 *
 * Response for POST /ocxp/{type}/bulk/delete.
 */
type BulkDeleteResponse = {
    /**
     * Results
     */
    results: Array<BulkItemResult>;
    /**
     * Count
     */
    count: number;
};
/**
 * BulkItemResult
 *
 * Result for a single item in bulk operation.
 */
type BulkItemResult = {
    /**
     * Id
     */
    id: string;
    /**
     * Success
     */
    success: boolean;
    /**
     * Content
     */
    content?: string | null;
    /**
     * Error
     */
    error?: string | null;
};
/**
 * BulkReadRequest
 */
type BulkReadRequest = {
    /**
     * Ids
     */
    ids: Array<string>;
};
/**
 * BulkReadResponse
 *
 * Response for POST /ocxp/{type}/bulk/read.
 */
type BulkReadResponse = {
    /**
     * Results
     */
    results: Array<BulkItemResult>;
    /**
     * Count
     */
    count: number;
};
/**
 * BulkWriteItem
 */
type BulkWriteItem = {
    /**
     * Id
     */
    id: string;
    /**
     * Content
     */
    content: string;
};
/**
 * BulkWriteRequest
 */
type BulkWriteRequest = {
    /**
     * Items
     */
    items: Array<BulkWriteItem>;
};
/**
 * BulkWriteResponse
 *
 * Response for POST /ocxp/{type}/bulk/write.
 */
type BulkWriteResponse = {
    /**
     * Results
     */
    results: Array<BulkItemResult>;
    /**
     * Count
     */
    count: number;
};
/**
 * CheckAccessRequest
 */
type CheckAccessRequest = {
    /**
     * Repo Url
     */
    repo_url: string;
};
/**
 * ContentDeleteResponse
 *
 * Response for DELETE /ocxp/{type}/{id}.
 */
type ContentDeleteResponse = {
    /**
     * Path
     */
    path: string;
    /**
     * Deleted
     */
    deleted?: boolean;
    /**
     * Files Count
     */
    files_count?: number | null;
};
/**
 * ContentEntry
 *
 * Single entry in a content listing.
 */
type ContentEntry = {
    /**
     * Name
     */
    name: string;
    /**
     * Type
     *
     * file or directory
     */
    type: string;
    /**
     * Path
     */
    path: string;
    /**
     * Size
     */
    size?: number | null;
    /**
     * Mtime
     */
    mtime?: string | null;
};
/**
 * ContentListResponse
 *
 * Response for GET /ocxp/{type}/list.
 */
type ContentListResponse = {
    /**
     * Entries
     */
    entries: Array<ContentEntry>;
    /**
     * Cursor
     */
    cursor?: string | null;
    /**
     * Has More
     */
    has_more?: boolean;
    /**
     * Total
     */
    total: number;
};
/**
 * ContentReadResponse
 *
 * Response for GET /ocxp/{type}/{id}.
 */
type ContentReadResponse = {
    /**
     * Path
     */
    path: string;
    /**
     * Content
     */
    content: string;
    /**
     * Encoding
     */
    encoding?: string;
    /**
     * Size
     */
    size?: number | null;
    /**
     * Mtime
     */
    mtime?: string | null;
    /**
     * Metadata
     */
    metadata?: {
        [key: string]: unknown;
    } | null;
    /**
     * Version Id
     *
     * S3 version ID
     */
    version_id?: string | null;
    /**
     * Is Latest
     *
     * Whether this is the latest version
     */
    is_latest?: boolean | null;
};
/**
 * ContentStatsResponse
 *
 * Response for GET /ocxp/{type}/stats.
 */
type ContentStatsResponse = {
    /**
     * Total Files
     */
    total_files: number;
    /**
     * Total Size
     */
    total_size: number;
    /**
     * By Extension
     */
    by_extension: {
        [key: string]: {
            [key: string]: number;
        };
    };
};
/**
 * ContentTreeNode
 *
 * Tree node for hierarchical content view.
 */
type ContentTreeNode = {
    /**
     * Name
     */
    name: string;
    /**
     * Path
     */
    path: string;
    /**
     * Type
     */
    type: string;
    /**
     * Size
     */
    size?: number | null;
    /**
     * Version Id
     */
    version_id?: string | null;
    /**
     * Children
     */
    children?: Array<ContentTreeNode> | null;
    /**
     * Truncated
     */
    truncated?: boolean;
};
/**
 * ContentTreeResponse
 *
 * Response for GET /ocxp/{type}/tree.
 */
type ContentTreeResponse = {
    tree: ContentTreeNode;
};
/**
 * ContentTypeInfo
 *
 * Content type metadata.
 */
type ContentTypeInfo$1 = {
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description: string;
};
/**
 * ContentTypesResponse
 *
 * Response for GET /ocxp/types.
 */
type ContentTypesResponse$1 = {
    /**
     * Types
     */
    types: Array<ContentTypeInfo$1>;
    /**
     * Total
     */
    total: number;
};
/**
 * ContentWriteResponse
 *
 * Response for POST /ocxp/{type}/{id}.
 */
type ContentWriteResponse = {
    /**
     * Path
     */
    path: string;
    /**
     * Type
     */
    type?: string;
    /**
     * Size
     */
    size?: number | null;
    /**
     * Etag
     */
    etag?: string | null;
    /**
     * Version Id
     *
     * S3 version ID of the written object
     */
    version_id?: string | null;
};
/**
 * CreateMemoRequest
 *
 * Request body for creating a new memo.
 */
type CreateMemoRequest = {
    source_type: SourceType;
    /**
     * Source Id
     *
     * Format: {mission_id}:v{version}:{file_path} for missions
     */
    source_id: string;
    /**
     * Workspace
     */
    workspace: string;
    /**
     * Content
     */
    content?: string | null;
    category?: MemoCategory | null;
    /**
     * Metadata
     */
    metadata?: {
        [key: string]: unknown;
    } | null;
    /**
     * Findings
     */
    findings?: Array<SecurityFinding> | null;
    severity?: MemoSeverity;
};
/**
 * DatabaseConfigResponse
 *
 * Full database configuration response.
 */
type DatabaseConfigResponse = {
    /**
     * Database Id
     */
    database_id: string;
    /**
     * Workspace
     */
    workspace: string;
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Db Type
     *
     * postgres|postgres_lambda|mysql|mariadb
     */
    db_type: string;
    /**
     * Lambda Function Name
     */
    lambda_function_name?: string | null;
    /**
     * Lambda Region
     */
    lambda_region?: string;
    /**
     * Host
     */
    host?: string | null;
    /**
     * Port
     */
    port?: number | null;
    /**
     * Database Name
     */
    database_name?: string | null;
    /**
     * Allowed Tables
     */
    allowed_tables?: Array<string>;
    /**
     * Read Only
     */
    read_only?: boolean;
    /**
     * Max Rows
     */
    max_rows?: number;
    /**
     * Status
     *
     * active|inactive|error
     */
    status?: string;
    /**
     * Last Used
     */
    last_used?: string | null;
    /**
     * Error Message
     */
    error_message?: string | null;
    /**
     * Created At
     */
    created_at?: string | null;
    /**
     * Updated At
     */
    updated_at?: string | null;
};
/**
 * DatabaseCreate
 *
 * Request body for creating a database config.
 */
type DatabaseCreate = {
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Db Type
     *
     * postgres|postgres_lambda|supabase|mysql|mariadb
     */
    db_type?: string;
    /**
     * Lambda Function Name
     *
     * Lambda function name for postgres_lambda type
     */
    lambda_function_name?: string | null;
    /**
     * Lambda Region
     */
    lambda_region?: string;
    /**
     * Secret Arn
     *
     * AWS Secrets Manager ARN for credentials
     */
    secret_arn?: string | null;
    /**
     * Allowed Tables
     */
    allowed_tables?: Array<string>;
    /**
     * Read Only
     */
    read_only?: boolean;
    /**
     * Max Rows
     */
    max_rows?: number;
};
/**
 * DatabaseListResponse
 *
 * Response for GET /ocxp/database.
 */
type DatabaseListResponse = {
    /**
     * Databases
     */
    databases: Array<DatabaseConfigResponse>;
    /**
     * Count
     */
    count: number;
};
/**
 * DatabaseSampleResponse
 *
 * Response for GET /ocxp/context/database/sample/{table}.
 */
type DatabaseSampleResponse = {
    /**
     * Table Name
     */
    table_name: string;
    /**
     * Rows
     */
    rows?: Array<{
        [key: string]: unknown;
    }>;
    /**
     * Columns
     */
    columns?: Array<string>;
    /**
     * Row Count
     */
    row_count?: number;
    /**
     * Database Id
     */
    database_id?: string | null;
};
/**
 * DatabaseSchemaResponse
 *
 * Response for GET /ocxp/context/database/schema.
 */
type DatabaseSchemaResponse = {
    /**
     * Tables
     */
    tables?: Array<{
        [key: string]: unknown;
    }>;
    /**
     * Table Count
     */
    table_count?: number;
    /**
     * Database Id
     */
    database_id?: string | null;
};
/**
 * DatabaseUpdate
 *
 * Request body for updating a database config.
 */
type DatabaseUpdate = {
    /**
     * Name
     */
    name?: string | null;
    /**
     * Description
     */
    description?: string | null;
    /**
     * Lambda Function Name
     */
    lambda_function_name?: string | null;
    /**
     * Lambda Region
     */
    lambda_region?: string | null;
    /**
     * Secret Arn
     *
     * AWS Secrets Manager ARN for credentials
     */
    secret_arn?: string | null;
    /**
     * Allowed Tables
     */
    allowed_tables?: Array<string> | null;
    /**
     * Read Only
     */
    read_only?: boolean | null;
    /**
     * Max Rows
     */
    max_rows?: number | null;
    /**
     * Status
     *
     * active|inactive|error
     */
    status?: string | null;
};
/**
 * DownloadRequest
 */
type DownloadRequest = {
    /**
     * Repo Url
     */
    repo_url: string;
    /**
     * Branch
     */
    branch?: string | null;
    /**
     * Mode
     */
    mode?: string;
    /**
     * Path
     */
    path?: string | null;
    /**
     * Repo Type
     */
    repo_type?: string;
};
/**
 * ForkRequest
 */
type ForkRequest = {
    /**
     * Mission Id
     */
    mission_id: string;
    /**
     * Fork Point
     */
    fork_point?: number | null;
};
/**
 * GetContentsRequest
 */
type GetContentsRequest = {
    /**
     * Repo Url
     */
    repo_url: string;
    /**
     * Path
     */
    path?: string;
    /**
     * Ref
     */
    ref?: string | null;
};
/**
 * HTTPValidationError
 */
type HttpValidationError = {
    /**
     * Detail
     */
    detail?: Array<ValidationError>;
};
/**
 * KBQueryRequest
 */
type KbQueryRequest = {
    /**
     * Query
     */
    query: string;
    /**
     * Max Results
     */
    max_results?: number;
    /**
     * Search Type
     */
    search_type?: string;
    /**
     * Content Type
     *
     * Knowledge base to query: 'code' for source files, 'docs' for documentation, 'all' for both (merged by score)
     */
    content_type?: string;
    /**
     * Doc Id
     *
     * Filter to specific doc_id
     */
    doc_id?: string | null;
    /**
     * Repo Ids
     *
     * Filter to specific repo IDs
     */
    repo_ids?: Array<string> | null;
    /**
     * Project Id
     *
     * Filter to specific project
     */
    project_id?: string | null;
    /**
     * Mission Id
     *
     * Filter to specific mission
     */
    mission_id?: string | null;
    /**
     * Enable Fallback
     *
     * Enable external docs fallback when KB has no/low results
     */
    enable_fallback?: boolean;
    /**
     * Fallback Threshold
     *
     * Score threshold below which fallback triggers
     */
    fallback_threshold?: number;
    /**
     * Persist External Docs
     *
     * Save external docs to S3 for future KB queries
     */
    persist_external_docs?: boolean;
};
/**
 * KBQueryResponse
 *
 * Response for POST /ocxp/kb/query.
 */
type KbQueryResponse = {
    /**
     * Results
     */
    results: Array<KbResultItem>;
    /**
     * Count
     */
    count: number;
    /**
     * Fallback Triggered
     *
     * Whether external docs fallback was triggered
     */
    fallback_triggered?: boolean;
    /**
     * Fallback Source
     *
     * External source used for fallback
     */
    fallback_source?: string | null;
};
/**
 * KBRagResponse
 *
 * Response for POST /ocxp/kb/rag.
 */
type KbRagResponse = {
    /**
     * Answer
     */
    answer: string;
    /**
     * Citations
     */
    citations?: Array<{
        [key: string]: unknown;
    }>;
    /**
     * Session Id
     */
    session_id?: string | null;
};
/**
 * KBResultItem
 *
 * Single KB search result.
 */
type KbResultItem = {
    /**
     * Content
     */
    content: string;
    /**
     * Score
     */
    score: number;
    /**
     * Source
     */
    source?: string | null;
    /**
     * Metadata
     */
    metadata?: {
        [key: string]: unknown;
    } | null;
    /**
     * Source Type
     *
     * Source type: kb, context7, aws_docs
     */
    source_type?: string;
    /**
     * Kb Source
     *
     * Which KB returned this result: 'code' or 'docs'
     */
    kb_source?: string | null;
};
/**
 * LinkedRepoResponse
 *
 * Linked repository in a project.
 */
type LinkedRepoResponse = {
    /**
     * Repo Id
     */
    repo_id: string;
    /**
     * Category
     *
     * project|framework|tool|reference
     */
    category: string;
    /**
     * Priority
     */
    priority: number;
    /**
     * Auto Include
     */
    auto_include: boolean;
    /**
     * Branch
     */
    branch: string;
};
/**
 * ListBranchesRequest
 */
type ListBranchesRequest = {
    /**
     * Repo Url
     */
    repo_url: string;
};
/**
 * LockRequest
 */
type LockRequest = {
    /**
     * Content Type
     */
    content_type: string;
    /**
     * Content Id
     */
    content_id: string;
    /**
     * Ttl
     */
    ttl?: number;
};
/**
 * LoginRequest
 *
 * JSON login request for programmatic clients.
 */
type LoginRequest = {
    /**
     * Username
     */
    username: string;
    /**
     * Password
     */
    password: string;
};
/**
 * Memo
 *
 * Memo linked to a source entity.
 *
 * Memos aggregate findings for a specific source (repo, project, mission)
 * and track their resolution status.
 */
type Memo = {
    /**
     * Memo Id
     *
     * Unique memo identifier
     */
    memo_id?: string;
    /**
     * Type of source entity
     */
    source_type: SourceType;
    /**
     * Source Id
     *
     * ID of the source entity (mission format: {mission_id}:v{version}:{file_path})
     */
    source_id: string;
    /**
     * Workspace
     *
     * Workspace this memo belongs to
     */
    workspace: string;
    /**
     * Content
     *
     * Free-form memo content (for general memos)
     */
    content?: string | null;
    /**
     * Category of memo (optional for security findings)
     */
    category?: MemoCategory | null;
    /**
     * Metadata
     *
     * Flexible metadata (line numbers, suggested fixes, etc.)
     */
    metadata?: {
        [key: string]: unknown;
    } | null;
    /**
     * Findings
     *
     * List of security findings
     */
    findings?: Array<SecurityFinding>;
    /**
     * Total Findings
     *
     * Total number of findings
     */
    total_findings?: number;
    /**
     * Highest severity among all findings
     */
    highest_severity?: MemoSeverity;
    /**
     * Current status of the memo
     */
    status?: MemoStatus;
    /**
     * Resolved By
     *
     * User who resolved the memo
     */
    resolved_by?: string | null;
    /**
     * Resolved At
     *
     * When the memo was resolved
     */
    resolved_at?: string | null;
    /**
     * Created At
     *
     * When the memo was created
     */
    created_at?: string;
    /**
     * Updated At
     *
     * When the memo was last updated
     */
    updated_at?: string;
    /**
     * Ttl
     *
     * TTL for DynamoDB auto-expiration
     */
    ttl?: number | null;
};
/**
 * MemoActionResponse
 *
 * Response from memo action endpoints.
 */
type MemoActionResponse = {
    /**
     * Success
     */
    success: boolean;
    /**
     * Message
     *
     * Action result message
     */
    message: string;
    memo: Memo;
};
/**
 * MemoCategory
 *
 * Category of memo feedback.
 */
type MemoCategory = 'agent_error' | 'agent_warning' | 'agent_hitl' | 'user_comment' | 'user_edit' | 'user_delete' | 'security_finding';
/**
 * MemoListResponse
 *
 * Response for memo list.
 */
type MemoListResponse = {
    /**
     * Memos
     */
    memos: Array<Memo>;
    /**
     * Count
     */
    count: number;
};
/**
 * MemoResolveRequest
 *
 * Request to resolve a memo.
 */
type MemoResolveRequest = {
    /**
     * Resolved By
     *
     * User resolving the memo
     */
    resolved_by: string;
    /**
     * Ttl Days
     */
    ttl_days?: number;
};
/**
 * MemoSeverity
 *
 * Severity levels for security findings.
 */
type MemoSeverity = 'low' | 'medium' | 'high' | 'critical';
/**
 * MemoStatus
 *
 * Status of a memo.
 */
type MemoStatus = 'open' | 'acknowledged' | 'resolved' | 'ignored';
/**
 * MessageResponse
 *
 * Single message in a session.
 */
type MessageResponse = {
    /**
     * Message Id
     */
    message_id: number;
    /**
     * Role
     *
     * user|assistant|system
     */
    role: string;
    /**
     * Content
     */
    content: string;
    /**
     * Created At
     */
    created_at?: string | null;
};
/**
 * MissionContextResponse
 *
 * Response for GET /tools/mission/{id}/context.
 */
type MissionContextResponse = {
    /**
     * Mission Id
     */
    mission_id: string;
    /**
     * Context
     */
    context: {
        [key: string]: unknown;
    };
};
/**
 * MissionCreateRequest
 */
type MissionCreateRequest = {
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description?: string | null;
    /**
     * Project Id
     */
    project_id?: string | null;
    /**
     * Goals
     */
    goals?: Array<string> | null;
};
/**
 * MissionCreateResponse
 *
 * Response for POST /tools/mission/create.
 */
type MissionCreateResponse = {
    /**
     * Mission Id
     */
    mission_id: string;
    /**
     * Path
     */
    path: string;
};
/**
 * MissionListResponse
 *
 * Response for GET /ocxp/mission.
 */
type MissionListResponse = {
    /**
     * Missions
     */
    missions: Array<MissionResponse>;
    /**
     * Count
     */
    count: number;
};
/**
 * MissionResponse
 *
 * Full mission response.
 */
type MissionResponse = {
    /**
     * Mission Id
     */
    mission_id: string;
    /**
     * Workspace
     */
    workspace: string;
    /**
     * Ticket Id
     *
     * External ticket ID (e.g., JIRA ticket)
     */
    ticket_id?: string | null;
    /**
     * Title
     */
    title: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Context Path
     */
    context_path?: string | null;
    /**
     * Project Id
     *
     * Project UUID this mission belongs to
     */
    project_id?: string | null;
    /**
     * Status
     *
     * draft|active|completed|archived
     */
    status?: string;
    /**
     * Progress
     */
    progress?: number;
    /**
     * Goals
     */
    goals?: Array<string>;
    /**
     * Notes
     */
    notes?: string;
    /**
     * Session Ids
     */
    session_ids?: Array<string>;
    /**
     * Version
     *
     * Regeneration version number
     */
    version?: number;
    /**
     * Last Regenerated At
     *
     * ISO timestamp of last regeneration
     */
    last_regenerated_at?: string | null;
    /**
     * Created At
     */
    created_at?: string | null;
    /**
     * Updated At
     */
    updated_at?: string | null;
    /**
     * Created By
     */
    created_by?: string | null;
};
/**
 * MissionUpdateRequest
 */
type MissionUpdateRequest = {
    /**
     * Status
     */
    status?: string | null;
    /**
     * Progress
     */
    progress?: number | null;
    /**
     * Notes
     */
    notes?: string | null;
};
/**
 * MissionUpdateResponse
 *
 * Response for POST /tools/mission/{id}/update.
 */
type MissionUpdateResponse = {
    /**
     * Mission Id
     */
    mission_id: string;
    /**
     * Status
     */
    status?: string | null;
    /**
     * Progress
     */
    progress?: number | null;
};
/**
 * MoveRequest
 */
type MoveRequest = {
    /**
     * Source
     */
    source: string;
    /**
     * Destination
     */
    destination: string;
    /**
     * Overwrite
     */
    overwrite?: boolean;
};
/**
 * OAuth2TokenResponse
 *
 * OAuth2 standard token response for Swagger UI compatibility (snake_case).
 */
type OAuth2TokenResponse = {
    /**
     * Access Token
     */
    access_token: string;
    /**
     * Token Type
     */
    token_type?: string;
    /**
     * Expires In
     */
    expires_in?: number;
    /**
     * Id Token
     */
    id_token: string;
    /**
     * Refresh Token
     */
    refresh_token: string;
};
/**
 * ProjectCreate
 */
type ProjectCreate = {
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description?: string;
};
/**
 * ProjectListResponse
 *
 * Response for GET /ocxp/project.
 */
type ProjectListResponse = {
    /**
     * Projects
     */
    projects: Array<ProjectResponse>;
    /**
     * Count
     */
    count: number;
};
/**
 * ProjectResponse
 *
 * Full project response.
 */
type ProjectResponse = {
    /**
     * Project Id
     *
     * Project UUID identifier
     */
    project_id: string;
    /**
     * Workspace
     */
    workspace: string;
    /**
     * Name
     */
    name: string;
    /**
     * Description
     */
    description: string;
    /**
     * Context Path
     */
    context_path?: string | null;
    /**
     * Linked Repos
     */
    linked_repos?: Array<LinkedRepoResponse>;
    /**
     * Mission Ids
     */
    mission_ids?: Array<string>;
    /**
     * Default Repo Id
     */
    default_repo_id?: string | null;
    /**
     * Created At
     */
    created_at?: string | null;
    /**
     * Updated At
     */
    updated_at?: string | null;
    /**
     * Created By
     */
    created_by?: string | null;
};
/**
 * ProjectUpdate
 */
type ProjectUpdate = {
    /**
     * Name
     */
    name?: string | null;
    /**
     * Description
     */
    description?: string | null;
};
/**
 * QueryFilter
 */
type QueryFilter = {
    /**
     * Field
     */
    field: string;
    /**
     * Operator
     */
    operator?: string;
    /**
     * Value
     */
    value: unknown;
};
/**
 * QueryRequest
 */
type QueryRequest = {
    /**
     * Filters
     */
    filters?: Array<QueryFilter>;
    /**
     * Limit
     */
    limit?: number;
};
/**
 * RAGRequest
 */
type RagRequest = {
    /**
     * Query
     */
    query: string;
    /**
     * Content Type
     *
     * Knowledge base to query: 'code' for source files, 'docs' for documentation, 'all' for both
     */
    content_type?: string;
    /**
     * Session Id
     *
     * Session ID for conversation
     */
    session_id?: string | null;
};
/**
 * RefreshRequest
 *
 * Token refresh request - accepts both camelCase and snake_case.
 */
type RefreshRequest = {
    /**
     * Refreshtoken
     */
    refreshToken: string;
};
/**
 * RefreshResponse
 *
 * Token refresh response with camelCase output (no new refresh_token).
 */
type RefreshResponse = {
    /**
     * Accesstoken
     */
    accessToken: string;
    /**
     * Tokentype
     */
    tokenType?: string;
    /**
     * Expiresin
     */
    expiresIn?: number;
    /**
     * Idtoken
     */
    idToken: string;
};
/**
 * RegenerateMissionRequest
 *
 * Request body for mission regeneration.
 */
type RegenerateMissionRequest = {
    /**
     * Ticket Id
     *
     * Updated ticket ID
     */
    ticket_id?: string | null;
    /**
     * Ticket Summary
     *
     * Updated ticket summary
     */
    ticket_summary?: string | null;
    /**
     * Ticket Description
     *
     * Updated ticket description
     */
    ticket_description?: string | null;
    /**
     * Project Id
     *
     * Project ID to preserve/set
     */
    project_id?: string | null;
    /**
     * Archive Old Docs
     *
     * Archive old docs before regenerating
     */
    archive_old_docs?: boolean;
    /**
     * Auto Increment Version
     *
     * Auto-increment archive version
     */
    auto_increment_version?: boolean;
};
/**
 * RegenerateMissionResponse
 *
 * Response for mission regeneration.
 */
type RegenerateMissionResponse = {
    /**
     * Success
     */
    success: boolean;
    /**
     * Job Id
     */
    job_id?: string | null;
    /**
     * Archive Version
     */
    archive_version: number;
    /**
     * Status
     *
     * started|completed|failed
     */
    status: string;
    /**
     * Archived Files
     */
    archived_files?: Array<string>;
    /**
     * Error
     */
    error?: string | null;
};
/**
 * RepoDeleteResponse
 *
 * Response for DELETE /ocxp/repo/{id}.
 */
type RepoDeleteResponse = {
    /**
     * Id
     *
     * Deleted repository UUID
     */
    id: string;
    /**
     * Repo Id
     *
     * Deleted repository identifier (owner/repo)
     */
    repo_id: string;
    /**
     * Deleted
     */
    deleted?: boolean;
};
/**
 * RepoDownloadResponse
 *
 * Response for POST /ocxp/repo/download.
 */
type RepoDownloadResponse = {
    /**
     * Id
     *
     * Unique UUID for API operations (available when linked or complete)
     */
    id?: string | null;
    /**
     * Job Id
     */
    job_id: string;
    /**
     * Status
     *
     * started|linked|downloading|indexing|complete|failed
     */
    status: string;
    /**
     * Message
     */
    message?: string | null;
    /**
     * Deduplicated
     *
     * True if repo already exists and was linked instead of downloaded
     */
    deduplicated?: boolean;
    /**
     * S3 Path
     *
     * S3 storage path
     */
    s3_path?: string | null;
    /**
     * Detected Type
     *
     * Auto-detected repo content type (code, docs, or mixed)
     */
    detected_type?: string | null;
    /**
     * Detection Method
     *
     * How repo type was detected: path_heuristic (from folder name) or github_api (from language analysis)
     */
    detection_method?: string | null;
};
/**
 * RepoInfo
 *
 * Repository information.
 */
type RepoInfo = {
    /**
     * Id
     *
     * Unique UUID for API operations
     */
    id: string;
    /**
     * Repo Id
     *
     * Repository identifier (owner/repo) for display
     */
    repo_id: string;
    /**
     * Name
     */
    name: string;
    /**
     * Url
     */
    url?: string | null;
    /**
     * Branch
     *
     * Git branch
     */
    branch?: string;
    /**
     * Path
     *
     * Subpath within repository (if partial download)
     */
    path?: string | null;
    /**
     * Visibility
     *
     * Repository visibility: public or private
     */
    visibility?: string;
    /**
     * Status
     *
     * pending|downloading|indexed|failed
     */
    status?: string | null;
    /**
     * Last Synced
     */
    last_synced?: string | null;
    /**
     * Files Count
     *
     * Number of files indexed
     */
    files_count?: number;
    /**
     * Total Size Bytes
     *
     * Total storage size in bytes
     */
    total_size_bytes?: number;
    /**
     * S3 Path
     *
     * S3 storage location
     */
    s3_path?: string | null;
    /**
     * Repo Type
     *
     * Content type: code, docs, or mixed
     */
    repo_type?: string | null;
};
/**
 * RepoListResponse
 *
 * Response for GET /ocxp/repo/list.
 */
type RepoListResponse = {
    /**
     * Repos
     */
    repos: Array<RepoInfo>;
    /**
     * Count
     */
    count: number;
};
/**
 * RepoStatusResponse
 *
 * Response for GET /ocxp/repo/status/{job_id}.
 */
type RepoStatusResponse = {
    /**
     * Job Id
     */
    job_id: string;
    /**
     * Status
     */
    status: string;
    /**
     * Progress
     */
    progress?: number | null;
    /**
     * Message
     */
    message?: string | null;
    /**
     * Repo Id
     */
    repo_id?: string | null;
    /**
     * Files Processed
     */
    files_processed?: number | null;
    /**
     * Total Files
     */
    total_files?: number | null;
};
/**
 * SecurityFinding
 *
 * Single sensitive data finding within a memo.
 */
type SecurityFinding = {
    /**
     * Pattern Type
     *
     * Type of pattern detected: password, api_key, aws_secret, etc.
     */
    pattern_type: string;
    /**
     * Severity level of this finding
     */
    severity: MemoSeverity;
    /**
     * Location
     *
     * File path where finding was detected
     */
    location: string;
    /**
     * Match Count
     *
     * Number of matches found
     */
    match_count?: number;
    /**
     * First Detected
     *
     * When this finding was first detected
     */
    first_detected?: string;
};
/**
 * SessionForkResponse
 *
 * Response for POST /ocxp/session/{id}/fork.
 */
type SessionForkResponse = {
    /**
     * Session Id
     */
    session_id: string;
    /**
     * Parent Session Id
     */
    parent_session_id: string;
    /**
     * Fork Depth
     */
    fork_depth: number;
    /**
     * Message Count
     */
    message_count: number;
};
/**
 * SessionListResponse
 *
 * Response for GET /ocxp/session.
 */
type SessionListResponse = {
    /**
     * Sessions
     */
    sessions: Array<SessionResponse>;
    /**
     * Count
     */
    count: number;
};
/**
 * SessionMessagesResponse
 *
 * Response for GET /ocxp/session/{id}/messages.
 */
type SessionMessagesResponse = {
    /**
     * Session Id
     */
    session_id: string;
    /**
     * Messages
     */
    messages: Array<MessageResponse>;
    /**
     * Count
     */
    count: number;
};
/**
 * SessionMetadataUpdate
 */
type SessionMetadataUpdate = {
    /**
     * Title
     */
    title?: string | null;
    /**
     * Message Count
     */
    message_count?: number | null;
};
/**
 * SessionResponse
 *
 * Session metadata response.
 */
type SessionResponse = {
    /**
     * Session Id
     */
    session_id: string;
    /**
     * Workspace
     */
    workspace: string;
    /**
     * Title
     */
    title?: string | null;
    /**
     * Message Count
     */
    message_count?: number;
    /**
     * Created At
     */
    created_at?: string | null;
    /**
     * Updated At
     */
    updated_at?: string | null;
    /**
     * Created By
     */
    created_by?: string | null;
    /**
     * Status
     *
     * active|archived
     */
    status?: string;
    /**
     * Mission Id
     */
    mission_id?: string | null;
    /**
     * Parent Session Id
     */
    parent_session_id?: string | null;
    /**
     * Fork Depth
     */
    fork_depth?: number;
};
/**
 * SetDefaultDatabaseRequest
 */
type SetDefaultDatabaseRequest = {
    /**
     * Database Id
     *
     * Database ID to set as default (None to clear)
     */
    database_id?: string | null;
};
/**
 * SetDefaultRepoRequest
 */
type SetDefaultRepoRequest = {
    /**
     * Repo Id
     */
    repo_id?: string | null;
};
/**
 * SourceType
 *
 * Type of entity the memo is associated with.
 */
type SourceType = 'repo' | 'project' | 'mission' | 'doc';
/**
 * TokenResponse
 *
 * Token response with camelCase output for plugin compatibility.
 */
type TokenResponse = {
    /**
     * Accesstoken
     */
    accessToken: string;
    /**
     * Tokentype
     */
    tokenType?: string;
    /**
     * Expiresin
     */
    expiresIn?: number;
    /**
     * Idtoken
     */
    idToken: string;
    /**
     * Refreshtoken
     */
    refreshToken: string;
};
/**
 * UserResponse
 *
 * User info response.
 */
type UserResponse = {
    /**
     * Id
     */
    id: string;
    /**
     * Email
     */
    email: string;
    /**
     * Username
     */
    username: string;
};
/**
 * ValidationError
 */
type ValidationError = {
    /**
     * Location
     */
    loc: Array<string | number>;
    /**
     * Message
     */
    msg: string;
    /**
     * Error Type
     */
    type: string;
};
/**
 * WorkspaceItem
 *
 * Workspace item.
 */
type WorkspaceItem = {
    /**
     * Id
     */
    id: string;
    /**
     * Name
     */
    name: string;
};
/**
 * WorkspacesResponse
 *
 * Workspaces list response.
 */
type WorkspacesResponse = {
    /**
     * Workspaces
     */
    workspaces: Array<WorkspaceItem>;
};
/**
 * WriteRequest
 */
type WriteRequest = {
    /**
     * Content
     */
    content: string;
    /**
     * Encoding
     */
    encoding?: string;
    /**
     * Etag
     */
    etag?: string | null;
    /**
     * Ifnotexists
     */
    ifNotExists?: boolean;
    /**
     * Manage Metadata
     */
    manage_metadata?: boolean;
    /**
     * Project Id
     */
    project_id?: string | null;
    /**
     * Mission Id
     */
    mission_id?: string | null;
};
type BulkReadContentData = {
    body: BulkReadRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: never;
    url: '/ocxp/context/{content_type}/bulk/read';
};
type BulkReadContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type BulkReadContentResponses = {
    /**
     * Successful Response
     */
    200: BulkReadResponse;
};
type BulkWriteContentData = {
    body: BulkWriteRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: never;
    url: '/ocxp/context/{content_type}/bulk/write';
};
type BulkWriteContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type BulkWriteContentResponses = {
    /**
     * Successful Response
     */
    200: BulkWriteResponse;
};
type BulkDeleteContentData = {
    body: BulkDeleteRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: never;
    url: '/ocxp/context/{content_type}/bulk/delete';
};
type BulkDeleteContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type BulkDeleteContentResponses = {
    /**
     * Successful Response
     */
    200: BulkDeleteResponse;
};
type ListSessionsData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Limit
         *
         * Maximum number of sessions to return
         */
        limit?: number;
        /**
         * Status
         *
         * Filter by status: active, archived
         */
        status?: string;
    };
    url: '/ocxp/session';
};
type ListSessionsErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListSessionsResponses = {
    /**
     * List of sessions returned successfully
     */
    200: SessionListResponse;
};
type GetSessionMessagesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Session Id
         */
        session_id: string;
    };
    query?: {
        /**
         * Limit
         *
         * Maximum number of messages to return
         */
        limit?: number;
    };
    url: '/ocxp/session/{session_id}/messages';
};
type GetSessionMessagesErrors = {
    /**
     * Session not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetSessionMessagesResponses = {
    /**
     * Messages returned successfully
     */
    200: SessionMessagesResponse;
};
type UpdateSessionMetadataData = {
    body: SessionMetadataUpdate;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Session Id
         */
        session_id: string;
    };
    query?: never;
    url: '/ocxp/session/{session_id}/metadata';
};
type UpdateSessionMetadataErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type UpdateSessionMetadataResponses = {
    /**
     * Session metadata updated successfully
     */
    200: SessionResponse;
};
type ForkSessionData = {
    body: ForkRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Session Id
         */
        session_id: string;
    };
    query?: never;
    url: '/ocxp/session/{session_id}/fork';
};
type ForkSessionErrors = {
    /**
     * Parent session not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ForkSessionResponses = {
    /**
     * Session forked successfully
     */
    201: SessionForkResponse;
};
type ArchiveSessionData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Session Id
         */
        session_id: string;
    };
    query?: never;
    url: '/ocxp/session/{session_id}/archive';
};
type ArchiveSessionErrors = {
    /**
     * Session not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ArchiveSessionResponses = {
    /**
     * Session archived successfully
     */
    200: unknown;
};
type ListProjectsData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Project Ids
         *
         * Filter by specific project IDs
         */
        project_ids?: Array<string> | null;
        /**
         * Include Metadata
         *
         * Include full metadata (description, repos, databases)
         */
        include_metadata?: boolean;
        /**
         * Limit
         *
         * Maximum number of projects to return
         */
        limit?: number;
    };
    url: '/ocxp/project';
};
type ListProjectsErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListProjectsResponses = {
    /**
     * List of projects returned successfully
     */
    200: ProjectListResponse;
};
type CreateProjectData = {
    body: ProjectCreate;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/project';
};
type CreateProjectErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type CreateProjectResponses = {
    /**
     * Project created successfully
     */
    201: ProjectResponse;
};
type DeleteProjectData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}';
};
type DeleteProjectErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DeleteProjectResponses = {
    /**
     * Project deleted successfully
     */
    200: unknown;
};
type GetProjectData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}';
};
type GetProjectErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetProjectResponses = {
    /**
     * Project found and returned
     */
    200: ProjectResponse;
};
type UpdateProjectData = {
    body: ProjectUpdate;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}';
};
type UpdateProjectErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type UpdateProjectResponses = {
    /**
     * Project updated successfully
     */
    200: ProjectResponse;
};
type AddLinkedRepoData = {
    body: AddRepoRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/repos';
};
type AddLinkedRepoErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type AddLinkedRepoResponses = {
    /**
     * Repository linked successfully
     */
    200: ProjectResponse;
};
type RemoveLinkedRepoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Repo Id
         */
        repo_id: string;
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/repos/{repo_id}';
};
type RemoveLinkedRepoErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type RemoveLinkedRepoResponses = {
    /**
     * Repository unlinked successfully
     */
    200: ProjectResponse;
};
type SetDefaultRepoData = {
    body: SetDefaultRepoRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/default-repo';
};
type SetDefaultRepoErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type SetDefaultRepoResponses = {
    /**
     * Default repository set successfully
     */
    200: ProjectResponse;
};
type GetContextReposData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/context-repos';
};
type GetContextReposErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetContextReposResponses = {
    /**
     * Context repositories returned
     */
    200: unknown;
};
type AddMissionData = {
    body: AddMissionRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/missions';
};
type AddMissionErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type AddMissionResponses = {
    /**
     * Mission added successfully
     */
    200: ProjectResponse;
};
type RemoveMissionData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Mission Id
         */
        mission_id: string;
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/missions/{mission_id}';
};
type RemoveMissionErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type RemoveMissionResponses = {
    /**
     * Mission removed successfully
     */
    200: ProjectResponse;
};
type GetProjectDatabasesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/databases';
};
type GetProjectDatabasesErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetProjectDatabasesResponses = {
    /**
     * Database list returned
     */
    200: unknown;
};
type AddDatabaseData = {
    body: AddDatabaseRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/databases';
};
type AddDatabaseErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type AddDatabaseResponses = {
    /**
     * Database linked successfully
     */
    200: ProjectResponse;
};
type RemoveDatabaseData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Database Id
         */
        database_id: string;
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/databases/{database_id}';
};
type RemoveDatabaseErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type RemoveDatabaseResponses = {
    /**
     * Database unlinked successfully
     */
    200: ProjectResponse;
};
type SetDefaultDatabaseData = {
    body: SetDefaultDatabaseRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Project Id
         *
         * Project ID
         */
        project_id: string;
    };
    query?: never;
    url: '/ocxp/project/{project_id}/default-database';
};
type SetDefaultDatabaseErrors = {
    /**
     * Project not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type SetDefaultDatabaseResponses = {
    /**
     * Default database set successfully
     */
    200: ProjectResponse;
};
type RegenerateMissionData = {
    body: RegenerateMissionRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Mission Id
         *
         * Mission ID
         */
        mission_id: string;
    };
    query?: never;
    url: '/ocxp/mission/{mission_id}/regenerate';
};
type RegenerateMissionErrors = {
    /**
     * Mission not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
    /**
     * Archive or regeneration failed
     */
    500: unknown;
};
type RegenerateMissionResponses = {
    /**
     * Regeneration started successfully
     */
    200: RegenerateMissionResponse;
};
type QueryKnowledgeBaseData = {
    body: KbQueryRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/kb/query';
};
type QueryKnowledgeBaseErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type QueryKnowledgeBaseResponses = {
    /**
     * Successful Response
     */
    200: KbQueryResponse;
};
type RagKnowledgeBaseData = {
    body: RagRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/kb/rag';
};
type RagKnowledgeBaseErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type RagKnowledgeBaseResponses = {
    /**
     * Successful Response
     */
    200: KbRagResponse;
};
type ListMemosData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Status
         *
         * Filter by status (open, acknowledged, resolved, ignored)
         */
        status?: MemoStatus | null;
        /**
         * Source Type
         *
         * Filter by source type (repo, project, mission, doc)
         */
        source_type?: SourceType | null;
        /**
         * Category
         *
         * Filter by category
         */
        category?: MemoCategory | null;
        /**
         * Severity
         *
         * Filter by minimum severity
         */
        severity?: MemoSeverity | null;
        /**
         * Mission Id
         *
         * Filter by mission ID (extracts from mission source_id)
         */
        mission_id?: string | null;
        /**
         * Project Id
         *
         * Filter by project ID (matches project source_id)
         */
        project_id?: string | null;
        /**
         * Limit
         *
         * Maximum results
         */
        limit?: number;
    };
    url: '/ocxp/memo';
};
type ListMemosErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListMemosResponses = {
    /**
     * List of memos returned successfully
     */
    200: MemoListResponse;
};
type ListMemosResponse = ListMemosResponses[keyof ListMemosResponses];
type CreateMemoData = {
    body: CreateMemoRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/memo';
};
type CreateMemoErrors = {
    /**
     * Invalid request
     */
    400: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type CreateMemoResponses = {
    /**
     * Memo created successfully
     */
    201: Memo;
};
type CreateMemoResponse = CreateMemoResponses[keyof CreateMemoResponses];
type DeleteMemoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Memo Id
         *
         * Memo ID
         */
        memo_id: string;
    };
    query?: never;
    url: '/ocxp/memo/{memo_id}';
};
type DeleteMemoErrors = {
    /**
     * Memo not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DeleteMemoResponses = {
    /**
     * Memo deleted successfully
     */
    200: MemoActionResponse;
};
type DeleteMemoResponse = DeleteMemoResponses[keyof DeleteMemoResponses];
type GetMemoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Memo Id
         *
         * Memo ID
         */
        memo_id: string;
    };
    query?: never;
    url: '/ocxp/memo/{memo_id}';
};
type GetMemoErrors = {
    /**
     * Memo not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetMemoResponses = {
    /**
     * Memo returned successfully
     */
    200: Memo;
};
type GetMemoResponse = GetMemoResponses[keyof GetMemoResponses];
type GetMemoForSourceData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Source Type
         *
         * Source type (repo, project, mission, doc)
         */
        source_type: string;
        /**
         * Source Id
         *
         * Source entity ID
         */
        source_id: string;
    };
    query?: never;
    url: '/ocxp/memo/source/{source_type}/{source_id}';
};
type GetMemoForSourceErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetMemoForSourceResponses = {
    /**
     * Response Getmemoforsource
     *
     * Memo returned or null if none exists
     */
    200: Memo | null;
};
type GetMemoForSourceResponse = GetMemoForSourceResponses[keyof GetMemoForSourceResponses];
type ResolveMemoData = {
    body: MemoResolveRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Memo Id
         *
         * Memo ID
         */
        memo_id: string;
    };
    query?: never;
    url: '/ocxp/memo/{memo_id}/resolve';
};
type ResolveMemoErrors = {
    /**
     * Memo not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ResolveMemoResponses = {
    /**
     * Memo resolved successfully
     */
    200: MemoActionResponse;
};
type AcknowledgeMemoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Memo Id
         *
         * Memo ID
         */
        memo_id: string;
    };
    query?: never;
    url: '/ocxp/memo/{memo_id}/acknowledge';
};
type AcknowledgeMemoErrors = {
    /**
     * Memo not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type AcknowledgeMemoResponses = {
    /**
     * Memo acknowledged successfully
     */
    200: MemoActionResponse;
};
type IgnoreMemoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Memo Id
         *
         * Memo ID
         */
        memo_id: string;
    };
    query?: never;
    url: '/ocxp/memo/{memo_id}/ignore';
};
type IgnoreMemoErrors = {
    /**
     * Memo not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type IgnoreMemoResponses = {
    /**
     * Memo ignored successfully
     */
    200: MemoActionResponse;
};
type DownloadRepositoryData = {
    body: DownloadRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/repo/download';
};
type DownloadRepositoryErrors = {
    /**
     * Invalid repository URL
     */
    400: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DownloadRepositoryResponses = {
    /**
     * Download job started or linked to existing
     */
    202: RepoDownloadResponse;
};
type GetRepoDownloadStatusData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Job Id
         */
        job_id: string;
    };
    query?: never;
    url: '/ocxp/repo/status/{job_id}';
};
type GetRepoDownloadStatusErrors = {
    /**
     * Job not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetRepoDownloadStatusResponses = {
    /**
     * Job status returned
     */
    200: RepoStatusResponse;
};
type ListDownloadedReposData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/repo/list';
};
type ListDownloadedReposErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListDownloadedReposResponses = {
    /**
     * List of repositories returned
     */
    200: RepoListResponse;
};
type DeleteRepoData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Repo Id
         */
        repo_id: string;
    };
    query?: never;
    url: '/ocxp/repo/{repo_id}';
};
type DeleteRepoErrors = {
    /**
     * Repository not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DeleteRepoResponses = {
    /**
     * Repository deleted successfully
     */
    200: RepoDeleteResponse;
};
type GithubCheckAccessData = {
    body: CheckAccessRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/github/check-access';
};
type GithubCheckAccessErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GithubCheckAccessResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};
type GithubListBranchesData = {
    body: ListBranchesRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/github/branches';
};
type GithubListBranchesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GithubListBranchesResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};
type GithubGetContentsData = {
    body: GetContentsRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/github/contents';
};
type GithubGetContentsErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GithubGetContentsResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};
type ListDatabasesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Limit
         *
         * Maximum number of databases to return
         */
        limit?: number;
    };
    url: '/ocxp/database';
};
type ListDatabasesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListDatabasesResponses = {
    /**
     * List of databases returned successfully
     */
    200: DatabaseListResponse;
};
type CreateDatabaseData = {
    body: DatabaseCreate;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/database';
};
type CreateDatabaseErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type CreateDatabaseResponses = {
    /**
     * Database created successfully
     */
    201: DatabaseConfigResponse;
};
type DeleteDatabaseData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Database Id
         */
        database_id: string;
    };
    query?: never;
    url: '/ocxp/database/{database_id}';
};
type DeleteDatabaseErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DeleteDatabaseResponses = {
    /**
     * Database deleted successfully
     */
    200: unknown;
};
type GetDatabaseData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Database Id
         */
        database_id: string;
    };
    query?: never;
    url: '/ocxp/database/{database_id}';
};
type GetDatabaseErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetDatabaseResponses = {
    /**
     * Database found and returned
     */
    200: DatabaseConfigResponse;
};
type UpdateDatabaseData = {
    body: DatabaseUpdate;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Database Id
         */
        database_id: string;
    };
    query?: never;
    url: '/ocxp/database/{database_id}';
};
type UpdateDatabaseErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type UpdateDatabaseResponses = {
    /**
     * Database updated successfully
     */
    200: DatabaseConfigResponse;
};
type TestDatabaseConnectionData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Database Id
         */
        database_id: string;
    };
    query?: never;
    url: '/ocxp/database/{database_id}/test';
};
type TestDatabaseConnectionErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type TestDatabaseConnectionResponses = {
    /**
     * Connection test completed
     */
    200: unknown;
};
type GetSchemaData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Pattern
         *
         * Filter tables by name pattern
         */
        pattern?: string | null;
        /**
         * Database Id
         *
         * Database ID (default: amc-default)
         */
        database_id?: string | null;
    };
    url: '/ocxp/context/database/schema';
};
type GetSchemaErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetSchemaResponses = {
    /**
     * Schema returned successfully
     */
    200: DatabaseSchemaResponse;
};
type GetSampleData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Table Name
         */
        table_name: string;
    };
    query?: {
        /**
         * Limit
         *
         * Number of sample rows
         */
        limit?: number;
        /**
         * Database Id
         *
         * Database ID (default: amc-default)
         */
        database_id?: string | null;
    };
    url: '/ocxp/context/database/sample/{table_name}';
};
type GetSampleErrors = {
    /**
     * Invalid table name
     */
    400: unknown;
    /**
     * Database or table not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetSampleResponses = {
    /**
     * Sample data returned successfully
     */
    200: DatabaseSampleResponse;
};
type ListTablesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Database Id
         *
         * Database ID (default: amc-default)
         */
        database_id?: string | null;
        /**
         * Cache Ttl
         *
         * Cache TTL in seconds (0=no cache)
         */
        cache_ttl?: number;
    };
    url: '/ocxp/context/database/tables';
};
type ListTablesErrors = {
    /**
     * Database not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListTablesResponses = {
    /**
     * Table list returned successfully
     */
    200: unknown;
};
type ListContextDatabasesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/context/database/databases';
};
type ListContextDatabasesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListContextDatabasesResponses = {
    /**
     * Database list returned successfully
     */
    200: unknown;
};
type GetContentTypesData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: {
        /**
         * Counts
         *
         * Include item counts per type
         */
        counts?: boolean;
    };
    url: '/ocxp/context/types';
};
type GetContentTypesErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetContentTypesResponses = {
    /**
     * List of content types returned
     */
    200: ContentTypesResponse$1;
};
type ListContentData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: {
        /**
         * Path
         *
         * Filter by path prefix
         */
        path?: string | null;
        /**
         * Limit
         *
         * Maximum items to return
         */
        limit?: number;
    };
    url: '/ocxp/context/{content_type}/list';
};
type ListContentErrors = {
    /**
     * Invalid content type
     */
    400: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ListContentResponses = {
    /**
     * Content list returned
     */
    200: ContentListResponse;
};
type QueryContentData = {
    body: QueryRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: never;
    url: '/ocxp/context/{content_type}/query';
};
type QueryContentErrors = {
    /**
     * Invalid filter or content type
     */
    400: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type QueryContentResponses = {
    /**
     * Query results returned
     */
    200: ContentListResponse;
};
type SearchContentData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query: {
        /**
         * Q
         *
         * Search query string
         */
        q: string;
        /**
         * Limit
         *
         * Maximum results to return
         */
        limit?: number;
    };
    url: '/ocxp/context/{content_type}/search';
};
type SearchContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type SearchContentResponses = {
    /**
     * Search results returned
     */
    200: ContentListResponse;
};
type GetContentTreeData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: {
        /**
         * Path
         *
         * Root path for tree
         */
        path?: string | null;
        /**
         * Depth
         *
         * Maximum tree depth
         */
        depth?: number;
        /**
         * Includeversions
         *
         * Include S3 version IDs for files
         */
        includeVersions?: boolean;
    };
    url: '/ocxp/context/{content_type}/tree';
};
type GetContentTreeErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetContentTreeResponses = {
    /**
     * Tree structure returned
     */
    200: ContentTreeResponse;
};
type GetContentStatsData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
    };
    query?: {
        /**
         * Path
         *
         * Path to analyze
         */
        path?: string | null;
    };
    url: '/ocxp/context/{content_type}/stats';
};
type GetContentStatsErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetContentStatsResponses = {
    /**
     * Statistics returned
     */
    200: ContentStatsResponse;
};
type DeleteContentData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
        /**
         * Content Id
         */
        content_id: string;
    };
    query?: {
        /**
         * Recursive
         *
         * Delete directory recursively
         */
        recursive?: boolean;
        /**
         * Confirm
         *
         * Confirm recursive deletion
         */
        confirm?: boolean;
        /**
         * Manage Metadata
         *
         * Also delete .metadata.json sidecars
         */
        manage_metadata?: boolean;
    };
    url: '/ocxp/context/{content_type}/{content_id}';
};
type DeleteContentErrors = {
    /**
     * Recursive delete requires confirmation
     */
    400: unknown;
    /**
     * Content not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type DeleteContentResponses = {
    /**
     * Content deleted
     */
    200: ContentDeleteResponse;
};
type ReadContentData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
        /**
         * Content Id
         */
        content_id: string;
    };
    query?: {
        /**
         * Versionid
         *
         * S3 version ID to read a specific version
         */
        versionId?: string | null;
    };
    url: '/ocxp/context/{content_type}/{content_id}';
};
type ReadContentErrors = {
    /**
     * Content not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ReadContentResponses = {
    /**
     * Content returned
     */
    200: ContentReadResponse;
};
type WriteContentData = {
    body: WriteRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Content Type
         *
         * Content type (mission, project, context, code, etc.)
         */
        content_type: string;
        /**
         * Content Id
         */
        content_id: string;
    };
    query?: never;
    url: '/ocxp/context/{content_type}/{content_id}';
};
type WriteContentErrors = {
    /**
     * Content already exists or ETag mismatch
     */
    409: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type WriteContentResponses = {
    /**
     * Content written successfully
     */
    201: ContentWriteResponse;
};
type MoveContentData = {
    body: MoveRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/context/move';
};
type MoveContentErrors = {
    /**
     * Source not found
     */
    404: unknown;
    /**
     * Destination exists
     */
    409: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type MoveContentResponses = {
    /**
     * Content moved successfully
     */
    200: unknown;
};
type LockContentData = {
    body: LockRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/context/lock';
};
type LockContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type LockContentResponses = {
    /**
     * Lock acquired
     */
    200: unknown;
};
type UnlockContentData = {
    body: LockRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/ocxp/context/unlock';
};
type UnlockContentErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type UnlockContentResponses = {
    /**
     * Lock released
     */
    200: unknown;
};
type ToolCreateMissionData = {
    body: MissionCreateRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path?: never;
    query?: never;
    url: '/tools/mission/create';
};
type ToolCreateMissionErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ToolCreateMissionResponses = {
    /**
     * Mission created successfully
     */
    201: MissionCreateResponse;
};
type ToolUpdateMissionData = {
    body: MissionUpdateRequest;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Mission Id
         */
        mission_id: string;
    };
    query?: never;
    url: '/tools/mission/{mission_id}/update';
};
type ToolUpdateMissionErrors = {
    /**
     * Mission not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type ToolUpdateMissionResponses = {
    /**
     * Mission updated successfully
     */
    200: MissionUpdateResponse;
};
type GetMissionContextData = {
    body?: never;
    headers?: {
        /**
         * X-Workspace
         */
        'X-Workspace'?: string;
    };
    path: {
        /**
         * Mission Id
         */
        mission_id: string;
    };
    query?: never;
    url: '/tools/mission/{mission_id}/context';
};
type GetMissionContextErrors = {
    /**
     * Mission not found
     */
    404: unknown;
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type GetMissionContextResponses = {
    /**
     * Context returned successfully
     */
    200: MissionContextResponse;
};
type LoginForAccessTokenData = {
    body: BodyLoginForAccessToken;
    path?: never;
    query?: never;
    url: '/auth/token';
};
type LoginForAccessTokenErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type LoginForAccessTokenResponses = {
    /**
     * Successful Response
     */
    200: OAuth2TokenResponse;
};
type LoginData = {
    body: LoginRequest;
    path?: never;
    query?: never;
    url: '/auth/login';
};
type LoginErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type LoginResponses = {
    /**
     * Successful Response
     */
    200: TokenResponse;
};
type RefreshTokensData = {
    body: RefreshRequest;
    path?: never;
    query?: never;
    url: '/auth/refresh';
};
type RefreshTokensErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};
type RefreshTokensResponses = {
    /**
     * Successful Response
     */
    200: RefreshResponse;
};
type GetAuthConfigData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/config';
};
type GetAuthConfigResponses = {
    /**
     * Successful Response
     */
    200: AuthConfig;
};
type GetCurrentUserData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/me';
};
type GetCurrentUserResponses = {
    /**
     * Successful Response
     */
    200: UserResponse;
};
type ListWorkspacesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/workspaces';
};
type ListWorkspacesResponses = {
    /**
     * Successful Response
     */
    200: WorkspacesResponse;
};

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
 * Bulk Read Content
 *
 * Bulk read content.
 */
declare const bulkReadContent: <ThrowOnError extends boolean = false>(options: Options<BulkReadContentData, ThrowOnError>) => RequestResult<BulkReadContentResponses, BulkReadContentErrors, ThrowOnError, "fields">;
/**
 * Bulk Write Content
 *
 * Bulk write content.
 */
declare const bulkWriteContent: <ThrowOnError extends boolean = false>(options: Options<BulkWriteContentData, ThrowOnError>) => RequestResult<BulkWriteContentResponses, BulkWriteContentErrors, ThrowOnError, "fields">;
/**
 * Bulk Delete Content
 *
 * Bulk delete content using batch operations.
 */
declare const bulkDeleteContent: <ThrowOnError extends boolean = false>(options: Options<BulkDeleteContentData, ThrowOnError>) => RequestResult<BulkDeleteContentResponses, BulkDeleteContentErrors, ThrowOnError, "fields">;
/**
 * List all sessions
 *
 * Returns sessions for the workspace filtered by status. Uses AgentCore Memory when available for fast retrieval. Ordered by most recently updated.
 */
declare const listSessions: <ThrowOnError extends boolean = false>(options?: Options<ListSessionsData, ThrowOnError>) => RequestResult<ListSessionsResponses, ListSessionsErrors, ThrowOnError, "fields">;
/**
 * Get session messages
 *
 * Loads message history for a session from S3 storage.
 */
declare const getSessionMessages: <ThrowOnError extends boolean = false>(options: Options<GetSessionMessagesData, ThrowOnError>) => RequestResult<GetSessionMessagesResponses, GetSessionMessagesErrors, ThrowOnError, "fields">;
/**
 * Update session metadata
 *
 * Updates session title and message count. Creates session if it does not exist.
 */
declare const updateSessionMetadata: <ThrowOnError extends boolean = false>(options: Options<UpdateSessionMetadataData, ThrowOnError>) => RequestResult<UpdateSessionMetadataResponses, UpdateSessionMetadataErrors, ThrowOnError, "fields">;
/**
 * Fork session
 *
 * Creates a new session branched from an existing one at a specified message point.
 */
declare const forkSession: <ThrowOnError extends boolean = false>(options: Options<ForkSessionData, ThrowOnError>) => RequestResult<ForkSessionResponses, ForkSessionErrors, ThrowOnError, "fields">;
/**
 * Archive session
 *
 * Soft deletes a session by changing its status to archived.
 */
declare const archiveSession: <ThrowOnError extends boolean = false>(options: Options<ArchiveSessionData, ThrowOnError>) => RequestResult<ArchiveSessionResponses, ArchiveSessionErrors, ThrowOnError, "fields">;
/**
 * List all projects
 *
 * Returns all projects in the workspace with their linked repos and missions.
 */
declare const listProjects: <ThrowOnError extends boolean = false>(options?: Options<ListProjectsData, ThrowOnError>) => RequestResult<ListProjectsResponses, ListProjectsErrors, ThrowOnError, "fields">;
/**
 * Create a new project
 *
 * Creates a project with auto-generated UUID. Projects link repos, missions, and sessions for context scoping.
 */
declare const createProject: <ThrowOnError extends boolean = false>(options: Options<CreateProjectData, ThrowOnError>) => RequestResult<CreateProjectResponses, CreateProjectErrors, ThrowOnError, "fields">;
/**
 * Delete project
 *
 * Permanently deletes a project and its metadata. Linked repos are not deleted.
 */
declare const deleteProject: <ThrowOnError extends boolean = false>(options: Options<DeleteProjectData, ThrowOnError>) => RequestResult<DeleteProjectResponses, DeleteProjectErrors, ThrowOnError, "fields">;
/**
 * Get project details
 *
 * Returns full project details including linked repos, missions, and metadata.
 */
declare const getProject: <ThrowOnError extends boolean = false>(options: Options<GetProjectData, ThrowOnError>) => RequestResult<GetProjectResponses, GetProjectErrors, ThrowOnError, "fields">;
/**
 * Update project
 *
 * Updates project name and/or description. Only provided fields are updated.
 */
declare const updateProject: <ThrowOnError extends boolean = false>(options: Options<UpdateProjectData, ThrowOnError>) => RequestResult<UpdateProjectResponses, UpdateProjectErrors, ThrowOnError, "fields">;
/**
 * Link repository to project
 *
 * Links a repository to the project with category, priority, and auto-include settings for KB queries.
 */
declare const addLinkedRepo: <ThrowOnError extends boolean = false>(options: Options<AddLinkedRepoData, ThrowOnError>) => RequestResult<AddLinkedRepoResponses, AddLinkedRepoErrors, ThrowOnError, "fields">;
/**
 * Unlink repository from project
 *
 * Removes a repository link from the project. The repository itself is not deleted.
 */
declare const removeLinkedRepo: <ThrowOnError extends boolean = false>(options: Options<RemoveLinkedRepoData, ThrowOnError>) => RequestResult<RemoveLinkedRepoResponses, RemoveLinkedRepoErrors, ThrowOnError, "fields">;
/**
 * Set default repository
 *
 * Sets the default repository for the project. Used for integration and primary context.
 */
declare const setDefaultRepo: <ThrowOnError extends boolean = false>(options: Options<SetDefaultRepoData, ThrowOnError>) => RequestResult<SetDefaultRepoResponses, SetDefaultRepoErrors, ThrowOnError, "fields">;
/**
 * Get context repositories
 *
 * Returns all repositories marked for auto-include in KB queries.
 */
declare const getContextRepos: <ThrowOnError extends boolean = false>(options: Options<GetContextReposData, ThrowOnError>) => RequestResult<GetContextReposResponses, GetContextReposErrors, ThrowOnError, "fields">;
/**
 * Add mission to project
 *
 * Associates a mission with the project for context grouping.
 */
declare const addMission: <ThrowOnError extends boolean = false>(options: Options<AddMissionData, ThrowOnError>) => RequestResult<AddMissionResponses, AddMissionErrors, ThrowOnError, "fields">;
/**
 * Remove mission from project
 *
 * Removes the mission association from the project. The mission itself is not deleted.
 */
declare const removeMission: <ThrowOnError extends boolean = false>(options: Options<RemoveMissionData, ThrowOnError>) => RequestResult<RemoveMissionResponses, RemoveMissionErrors, ThrowOnError, "fields">;
/**
 * Get project databases
 *
 * Returns all databases linked to the project.
 */
declare const getProjectDatabases: <ThrowOnError extends boolean = false>(options: Options<GetProjectDatabasesData, ThrowOnError>) => RequestResult<GetProjectDatabasesResponses, GetProjectDatabasesErrors, ThrowOnError, "fields">;
/**
 * Link database to project
 *
 * Links a database configuration to the project for agent context.
 */
declare const addDatabase: <ThrowOnError extends boolean = false>(options: Options<AddDatabaseData, ThrowOnError>) => RequestResult<AddDatabaseResponses, AddDatabaseErrors, ThrowOnError, "fields">;
/**
 * Unlink database from project
 *
 * Removes a database link from the project. The database config is not deleted.
 */
declare const removeDatabase: <ThrowOnError extends boolean = false>(options: Options<RemoveDatabaseData, ThrowOnError>) => RequestResult<RemoveDatabaseResponses, RemoveDatabaseErrors, ThrowOnError, "fields">;
/**
 * Set default database
 *
 * Sets the default database for the project. Used when no specific database_id is provided.
 */
declare const setDefaultDatabase: <ThrowOnError extends boolean = false>(options: Options<SetDefaultDatabaseData, ThrowOnError>) => RequestResult<SetDefaultDatabaseResponses, SetDefaultDatabaseErrors, ThrowOnError, "fields">;
/**
 * Regenerate mission
 *
 * Archives old generated docs and triggers AgentCore regeneration with updated ticket info.
 */
declare const regenerateMission: <ThrowOnError extends boolean = false>(options: Options<RegenerateMissionData, ThrowOnError>) => RequestResult<RegenerateMissionResponses, RegenerateMissionErrors, ThrowOnError, "fields">;
/**
 * Query Knowledge Base
 *
 * DEPRECATED: Use POST /ocxp/context/discover instead.
 *
 * This endpoint will be removed in v2.0. Migrate to the new unified interface.
 *
 * Semantic search with optional project scoping and external docs fallback.
 *
 * @deprecated
 */
declare const queryKnowledgeBase: <ThrowOnError extends boolean = false>(options: Options<QueryKnowledgeBaseData, ThrowOnError>) => RequestResult<QueryKnowledgeBaseResponses, QueryKnowledgeBaseErrors, ThrowOnError, "fields">;
/**
 * Rag Knowledge Base
 *
 * DEPRECATED: Use POST /ocxp/context/discover with include_answer=true instead.
 *
 * This endpoint will be removed in v2.0. Migrate to the new unified interface.
 *
 * RAG query with LLM response and citations.
 *
 * @deprecated
 */
declare const ragKnowledgeBase: <ThrowOnError extends boolean = false>(options: Options<RagKnowledgeBaseData, ThrowOnError>) => RequestResult<RagKnowledgeBaseResponses, RagKnowledgeBaseErrors, ThrowOnError, "fields">;
/**
 * List memos
 *
 * List memos for the workspace with optional filters.
 */
declare const listMemos: <ThrowOnError extends boolean = false>(options?: Options<ListMemosData, ThrowOnError>) => RequestResult<ListMemosResponses, ListMemosErrors, ThrowOnError, "fields">;
/**
 * Create memo
 *
 * Create a new memo (general or security finding).
 */
declare const createMemo: <ThrowOnError extends boolean = false>(options: Options<CreateMemoData, ThrowOnError>) => RequestResult<CreateMemoResponses, CreateMemoErrors, ThrowOnError, "fields">;
/**
 * Delete memo
 *
 * Delete a memo permanently.
 */
declare const deleteMemo: <ThrowOnError extends boolean = false>(options: Options<DeleteMemoData, ThrowOnError>) => RequestResult<DeleteMemoResponses, DeleteMemoErrors, ThrowOnError, "fields">;
/**
 * Get memo by ID
 *
 * Get a specific memo by its ID.
 */
declare const getMemo: <ThrowOnError extends boolean = false>(options: Options<GetMemoData, ThrowOnError>) => RequestResult<GetMemoResponses, GetMemoErrors, ThrowOnError, "fields">;
/**
 * Get memo for source
 *
 * Get memo for a specific source entity (repo, project, mission, doc).
 */
declare const getMemoForSource: <ThrowOnError extends boolean = false>(options: Options<GetMemoForSourceData, ThrowOnError>) => RequestResult<GetMemoForSourceResponses, GetMemoForSourceErrors, ThrowOnError, "fields">;
/**
 * Resolve memo
 *
 * Mark a memo as resolved. Sets TTL for auto-deletion.
 */
declare const resolveMemo: <ThrowOnError extends boolean = false>(options: Options<ResolveMemoData, ThrowOnError>) => RequestResult<ResolveMemoResponses, ResolveMemoErrors, ThrowOnError, "fields">;
/**
 * Acknowledge memo
 *
 * Mark a memo as acknowledged (developer has seen it).
 */
declare const acknowledgeMemo: <ThrowOnError extends boolean = false>(options: Options<AcknowledgeMemoData, ThrowOnError>) => RequestResult<AcknowledgeMemoResponses, AcknowledgeMemoErrors, ThrowOnError, "fields">;
/**
 * Ignore memo
 *
 * Mark a memo as ignored (false positive or accepted risk).
 */
declare const ignoreMemo: <ThrowOnError extends boolean = false>(options: Options<IgnoreMemoData, ThrowOnError>) => RequestResult<IgnoreMemoResponses, IgnoreMemoErrors, ThrowOnError, "fields">;
/**
 * Start repository download
 *
 * Initiates an async download of a Git repository. Returns a job ID for status tracking. If the repository already exists (deduplicated), returns immediately with status='linked'.
 */
declare const downloadRepository: <ThrowOnError extends boolean = false>(options: Options<DownloadRepositoryData, ThrowOnError>) => RequestResult<DownloadRepositoryResponses, DownloadRepositoryErrors, ThrowOnError, "fields">;
/**
 * Get download status
 *
 * Returns the current status and progress of a repository download job.
 */
declare const getRepoDownloadStatus: <ThrowOnError extends boolean = false>(options: Options<GetRepoDownloadStatusData, ThrowOnError>) => RequestResult<GetRepoDownloadStatusResponses, GetRepoDownloadStatusErrors, ThrowOnError, "fields">;
/**
 * List downloaded repositories
 *
 * Returns all repositories that have been downloaded for the workspace.
 */
declare const listDownloadedRepos: <ThrowOnError extends boolean = false>(options?: Options<ListDownloadedReposData, ThrowOnError>) => RequestResult<ListDownloadedReposResponses, ListDownloadedReposErrors, ThrowOnError, "fields">;
/**
 * Delete repository
 *
 * Permanently deletes a downloaded repository. Uses repo_id (owner/repo format).
 */
declare const deleteRepo: <ThrowOnError extends boolean = false>(options: Options<DeleteRepoData, ThrowOnError>) => RequestResult<DeleteRepoResponses, DeleteRepoErrors, ThrowOnError, "fields">;
/**
 * Github Check Access
 *
 * Check GitHub repository access.
 *
 * Uses the user's stored GitHub token for private repository access.
 * Public repositories are accessible without a token.
 */
declare const githubCheckAccess: <ThrowOnError extends boolean = false>(options: Options<GithubCheckAccessData, ThrowOnError>) => RequestResult<GithubCheckAccessResponses, GithubCheckAccessErrors, ThrowOnError, "fields">;
/**
 * Github List Branches
 *
 * List repository branches.
 *
 * Uses the user's stored GitHub token for private repository access.
 */
declare const githubListBranches: <ThrowOnError extends boolean = false>(options: Options<GithubListBranchesData, ThrowOnError>) => RequestResult<GithubListBranchesResponses, GithubListBranchesErrors, ThrowOnError, "fields">;
/**
 * Github Get Contents
 *
 * Get repository contents.
 *
 * Uses the user's stored GitHub token for private repository access.
 */
declare const githubGetContents: <ThrowOnError extends boolean = false>(options: Options<GithubGetContentsData, ThrowOnError>) => RequestResult<GithubGetContentsResponses, GithubGetContentsErrors, ThrowOnError, "fields">;
/**
 * List all database configurations
 *
 * Returns all database configurations in the workspace.
 */
declare const listDatabases: <ThrowOnError extends boolean = false>(options?: Options<ListDatabasesData, ThrowOnError>) => RequestResult<ListDatabasesResponses, ListDatabasesErrors, ThrowOnError, "fields">;
/**
 * Create a new database configuration
 *
 * Creates a database configuration with auto-generated UUID. Use postgres_lambda for Lambda-proxied connections.
 */
declare const createDatabase: <ThrowOnError extends boolean = false>(options: Options<CreateDatabaseData, ThrowOnError>) => RequestResult<CreateDatabaseResponses, CreateDatabaseErrors, ThrowOnError, "fields">;
/**
 * Delete database configuration
 *
 * Permanently deletes a database configuration.
 */
declare const deleteDatabase: <ThrowOnError extends boolean = false>(options: Options<DeleteDatabaseData, ThrowOnError>) => RequestResult<DeleteDatabaseResponses, DeleteDatabaseErrors, ThrowOnError, "fields">;
/**
 * Get database configuration details
 *
 * Returns full database configuration including connection settings and allowed tables.
 */
declare const getDatabase: <ThrowOnError extends boolean = false>(options: Options<GetDatabaseData, ThrowOnError>) => RequestResult<GetDatabaseResponses, GetDatabaseErrors, ThrowOnError, "fields">;
/**
 * Update database configuration
 *
 * Updates database configuration. Only provided fields are updated.
 */
declare const updateDatabase: <ThrowOnError extends boolean = false>(options: Options<UpdateDatabaseData, ThrowOnError>) => RequestResult<UpdateDatabaseResponses, UpdateDatabaseErrors, ThrowOnError, "fields">;
/**
 * Test database connection
 *
 * Tests the database connection and returns status.
 */
declare const testDatabaseConnection: <ThrowOnError extends boolean = false>(options: Options<TestDatabaseConnectionData, ThrowOnError>) => RequestResult<TestDatabaseConnectionResponses, TestDatabaseConnectionErrors, ThrowOnError, "fields">;
/**
 * Get database schema
 *
 * Returns database schema information including tables and their metadata.
 */
declare const getSchema: <ThrowOnError extends boolean = false>(options?: Options<GetSchemaData, ThrowOnError>) => RequestResult<GetSchemaResponses, GetSchemaErrors, ThrowOnError, "fields">;
/**
 * Get sample data from table
 *
 * Returns sample rows from a specified table.
 */
declare const getSample: <ThrowOnError extends boolean = false>(options: Options<GetSampleData, ThrowOnError>) => RequestResult<GetSampleResponses, GetSampleErrors, ThrowOnError, "fields">;
/**
 * List available tables
 *
 * Returns list of tables available in the database. Supports caching.
 */
declare const listTables: <ThrowOnError extends boolean = false>(options?: Options<ListTablesData, ThrowOnError>) => RequestResult<ListTablesResponses, ListTablesErrors, ThrowOnError, "fields">;
/**
 * List configured databases
 *
 * Returns list of database configurations available in the workspace.
 */
declare const listContextDatabases: <ThrowOnError extends boolean = false>(options?: Options<ListContextDatabasesData, ThrowOnError>) => RequestResult<ListContextDatabasesResponses, ListContextDatabasesErrors, ThrowOnError, "fields">;
/**
 * Get content types
 *
 * Returns all available content types (mission, context, repo, etc.) with optional item counts.
 */
declare const getContentTypes: <ThrowOnError extends boolean = false>(options?: Options<GetContentTypesData, ThrowOnError>) => RequestResult<GetContentTypesResponses, GetContentTypesErrors, ThrowOnError, "fields">;
/**
 * List content
 *
 * Lists all content items of a specific type, optionally filtered by path.
 */
declare const listContent: <ThrowOnError extends boolean = false>(options: Options<ListContentData, ThrowOnError>) => RequestResult<ListContentResponses, ListContentErrors, ThrowOnError, "fields">;
/**
 * Query content
 *
 * Advanced query with filters on name, path, size, etc. Supports eq, ne, contains, startsWith, gt, lt operators.
 */
declare const queryContent: <ThrowOnError extends boolean = false>(options: Options<QueryContentData, ThrowOnError>) => RequestResult<QueryContentResponses, QueryContentErrors, ThrowOnError, "fields">;
/**
 * Search content
 *
 * Full-text search in content names and paths. Case-insensitive.
 */
declare const searchContent: <ThrowOnError extends boolean = false>(options: Options<SearchContentData, ThrowOnError>) => RequestResult<SearchContentResponses, SearchContentErrors, ThrowOnError, "fields">;
/**
 * Get content tree
 *
 * Returns hierarchical tree structure of content with configurable depth.
 */
declare const getContentTree: <ThrowOnError extends boolean = false>(options: Options<GetContentTreeData, ThrowOnError>) => RequestResult<GetContentTreeResponses, GetContentTreeErrors, ThrowOnError, "fields">;
/**
 * Get content statistics
 *
 * Returns file counts and sizes grouped by extension for a content path.
 */
declare const getContentStats: <ThrowOnError extends boolean = false>(options: Options<GetContentStatsData, ThrowOnError>) => RequestResult<GetContentStatsResponses, GetContentStatsErrors, ThrowOnError, "fields">;
/**
 * Delete content
 *
 * Deletes content. Use recursive=true with confirm=true to delete directories.
 */
declare const deleteContent: <ThrowOnError extends boolean = false>(options: Options<DeleteContentData, ThrowOnError>) => RequestResult<DeleteContentResponses, DeleteContentErrors, ThrowOnError, "fields">;
/**
 * Read content
 *
 * Reads content by type and path. Binary files are base64-encoded. Use versionId param to read a specific version.
 */
declare const readContent: <ThrowOnError extends boolean = false>(options: Options<ReadContentData, ThrowOnError>) => RequestResult<ReadContentResponses, ReadContentErrors, ThrowOnError, "fields">;
/**
 * Write content
 *
 * Writes content to storage. Supports ETag for optimistic locking and ifNotExists for creation-only.
 */
declare const writeContent: <ThrowOnError extends boolean = false>(options: Options<WriteContentData, ThrowOnError>) => RequestResult<WriteContentResponses, WriteContentErrors, ThrowOnError, "fields">;
/**
 * Move content
 *
 * Moves content from source to destination path. Use overwrite=true to replace existing.
 */
declare const moveContent: <ThrowOnError extends boolean = false>(options: Options<MoveContentData, ThrowOnError>) => RequestResult<MoveContentResponses, MoveContentErrors, ThrowOnError, "fields">;
/**
 * Lock content
 *
 * Acquires an exclusive lock on content for the specified TTL (seconds). Stub endpoint for SDK compatibility.
 */
declare const lockContent: <ThrowOnError extends boolean = false>(options: Options<LockContentData, ThrowOnError>) => RequestResult<LockContentResponses, LockContentErrors, ThrowOnError, "fields">;
/**
 * Unlock content
 *
 * Releases an exclusive lock on content. Stub endpoint for SDK compatibility.
 */
declare const unlockContent: <ThrowOnError extends boolean = false>(options: Options<UnlockContentData, ThrowOnError>) => RequestResult<UnlockContentResponses, UnlockContentErrors, ThrowOnError, "fields">;
/**
 * Create a new mission
 *
 * Creates a mission with optional project association and goals list.
 */
declare const toolCreateMission: <ThrowOnError extends boolean = false>(options: Options<ToolCreateMissionData, ThrowOnError>) => RequestResult<ToolCreateMissionResponses, ToolCreateMissionErrors, ThrowOnError, "fields">;
/**
 * Update mission status
 *
 * Updates mission status, progress percentage, and/or notes.
 */
declare const toolUpdateMission: <ThrowOnError extends boolean = false>(options: Options<ToolUpdateMissionData, ThrowOnError>) => RequestResult<ToolUpdateMissionResponses, ToolUpdateMissionErrors, ThrowOnError, "fields">;
/**
 * Get mission context
 *
 * Returns mission context data optimized for AI consumption.
 */
declare const getMissionContext: <ThrowOnError extends boolean = false>(options: Options<GetMissionContextData, ThrowOnError>) => RequestResult<GetMissionContextResponses, GetMissionContextErrors, ThrowOnError, "fields">;
/**
 * Login For Access Token
 *
 * OAuth2 compatible login endpoint for Swagger UI.
 *
 * Authenticates with Cognito using username/password and returns JWT tokens.
 * Use this endpoint to get a token for testing other endpoints in Swagger.
 * Returns snake_case fields per OAuth2 spec for Swagger compatibility.
 */
declare const loginForAccessToken: <ThrowOnError extends boolean = false>(options: Options<LoginForAccessTokenData, ThrowOnError>) => RequestResult<LoginForAccessTokenResponses, LoginForAccessTokenErrors, ThrowOnError, "fields">;
/**
 * Login
 *
 * JSON login endpoint for programmatic clients.
 *
 * Authenticates with Cognito using username/password and returns JWT tokens.
 * Use /auth/token for OAuth2 form-based login (Swagger UI).
 */
declare const login: <ThrowOnError extends boolean = false>(options: Options<LoginData, ThrowOnError>) => RequestResult<LoginResponses, LoginErrors, ThrowOnError, "fields">;
/**
 * Refresh Tokens
 *
 * Refresh access token using refresh token.
 *
 * Returns new access and ID tokens. The refresh token remains valid
 * until it expires (configured in Cognito).
 */
declare const refreshTokens: <ThrowOnError extends boolean = false>(options: Options<RefreshTokensData, ThrowOnError>) => RequestResult<RefreshTokensResponses, RefreshTokensErrors, ThrowOnError, "fields">;
/**
 * Get Auth Config
 *
 * Get Cognito configuration for frontend.
 */
declare const getAuthConfig: <ThrowOnError extends boolean = false>(options?: Options<GetAuthConfigData, ThrowOnError>) => RequestResult<GetAuthConfigResponses, unknown, ThrowOnError, "fields">;
/**
 * Get Current User
 *
 * Get current authenticated user info.
 */
declare const getCurrentUser: <ThrowOnError extends boolean = false>(options?: Options<GetCurrentUserData, ThrowOnError>) => RequestResult<GetCurrentUserResponses, unknown, ThrowOnError, "fields">;
/**
 * List Workspaces
 *
 * List workspaces for authenticated user.
 */
declare const listWorkspaces: <ThrowOnError extends boolean = false>(options?: Options<ListWorkspacesData, ThrowOnError>) => RequestResult<ListWorkspacesResponses, unknown, ThrowOnError, "fields">;

interface ListEntry$1 {
    name: string;
    type: string;
    path: string;
    size?: number;
    mtime?: string;
}
interface ListResult {
    entries: ListEntry$1[];
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
    types: Array<{
        name: string;
        description: string;
    }>;
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
type ContentTypeValue = 'mission' | 'project' | 'context' | 'sop' | 'repo' | 'artifact' | 'kb' | 'docs';
/**
 * OCXPClient provides a high-level interface to the OCXP API
 */
declare class OCXPClient {
    private client;
    private workspace;
    private tokenProvider?;
    constructor(options: OCXPClientOptions);
    /**
     * Get headers including workspace and auth
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
     * Get the underlying client for SDK function calls
     */
    getClient(): Client;
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
        etag?: string;
        ifNotExists?: boolean;
    }): Promise<WriteResult>;
    /**
     * Delete content
     */
    delete(type: ContentTypeValue, id: string, recursive?: boolean, confirm?: boolean): Promise<DeleteResult>;
    /**
     * Query content with filters
     */
    query(type: ContentTypeValue, filters?: QueryFilter[], limit?: number): Promise<({
        data: ContentListResponse;
        error: undefined;
    } | {
        data: undefined;
        error: unknown;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Full-text search
     */
    search(type: ContentTypeValue, q: string, limit?: number): Promise<({
        data: ContentListResponse;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Get hierarchical tree structure from S3 context
     * @param includeVersions - If true, includes S3 version IDs for files
     */
    tree(type: ContentTypeValue, path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse>;
    /**
     * Get content statistics
     */
    stats(type: ContentTypeValue, path?: string): Promise<({
        data: ContentStatsResponse;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Read multiple items at once
     */
    bulkRead(type: ContentTypeValue, ids: string[]): Promise<({
        data: BulkReadResponse;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
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
    }>): Promise<({
        data: BulkWriteResponse;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Delete multiple items at once
     */
    bulkDelete(type: ContentTypeValue, ids: string[]): Promise<({
        data: BulkDeleteResponse;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Semantic search in Knowledge Base with optional external docs fallback
     */
    kbQuery(query: string, options?: {
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
    }): Promise<KbQueryResponse>;
    /**
     * RAG with citations
     */
    kbRag(query: string, sessionId?: string): Promise<KbRagResponse>;
    /**
     * List all missions in workspace
     */
    listMissions(options?: {
        projectId?: string;
        status?: string;
        limit?: number;
    }): Promise<MissionListResponse>;
    /**
     * Create a new mission with auto-generated UUID
     */
    createMission(title: string, description?: string, projectId?: string, goals?: string[]): Promise<MissionResponse>;
    /**
     * Get mission by ID
     */
    getMission(missionId: string): Promise<MissionResponse>;
    /**
     * Update mission
     */
    updateMission(missionId: string, updates: {
        title?: string;
        description?: string;
        status?: string;
        progress?: number;
        notes?: string;
    }): Promise<MissionResponse>;
    /**
     * Delete mission
     */
    deleteMission(missionId: string): Promise<void>;
    /**
     * Add session to mission
     */
    addMissionSession(missionId: string, sessionId: string): Promise<MissionResponse>;
    /**
     * Remove session from mission
     */
    removeMissionSession(missionId: string, sessionId: string): Promise<MissionResponse>;
    /**
     * Regenerate mission - archives old docs and triggers AgentCore
     */
    regenerateMission(missionId: string, options?: {
        ticket_id?: string;
        ticket_summary?: string;
        ticket_description?: string;
        archive_old_docs?: boolean;
        auto_increment_version?: boolean;
    }): Promise<RegenerateMissionResponse>;
    /**
     * Download mission pack as ZIP file
     * @param missionId - Mission ID
     * @returns Blob containing ZIP file
     */
    downloadMissionPack(missionId: string): Promise<Blob>;
    /**
     * Get mission context for agents
     */
    getMissionContext(missionId: string): Promise<({
        data: MissionContextResponse;
        error: undefined;
    } | {
        data: undefined;
        error: unknown;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Acquire exclusive lock on content
     * @param contentType - Content type (e.g., "mission")
     * @param contentId - Content ID (e.g., "my-mission")
     * @param ttl - Lock time-to-live in seconds
     */
    lock(contentType: string, contentId: string, ttl?: number): Promise<({
        data: unknown;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Release exclusive lock
     * @param contentType - Content type
     * @param contentId - Content ID
     */
    unlock(contentType: string, contentId: string): Promise<({
        data: unknown;
        error: undefined;
    } | {
        data: undefined;
        error: HttpValidationError;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Move/rename content
     * @param source - Source path (e.g., "mission/old-id")
     * @param destination - Destination path (e.g., "mission/new-id")
     * @param overwrite - Whether to overwrite existing content at destination
     */
    move(source: string, destination: string, overwrite?: boolean): Promise<unknown>;
    /**
     * Check if a repository is accessible
     * @param repoUrl - Full GitHub repository URL
     */
    githubCheckAccess(repoUrl: string): Promise<unknown>;
    /**
     * List branches for a repository
     * @param repoUrl - Full GitHub repository URL
     */
    githubListBranches(repoUrl: string): Promise<unknown>;
    /**
     * Get repository contents at a path
     * @param repoUrl - Full GitHub repository URL
     * @param path - Path within the repository
     * @param ref - Git ref (branch, tag, or commit)
     */
    githubGetContents(repoUrl: string, path?: string, ref?: string): Promise<unknown>;
    /**
     * Download repository and trigger vectorization
     * @param repoUrl - Full GitHub repository URL
     * @param branch - Optional branch (default: main)
     * @param options - Download options (mode, repo_type, path)
     */
    downloadRepository(repoUrl: string, branch?: string, options?: {
        mode?: string;
        repo_type?: 'code' | 'docs' | 'auto';
        path?: string;
    }): Promise<RepoDownloadResponse>;
    /**
     * Get repository download status
     */
    getRepoStatus(jobId: string): Promise<RepoStatusResponse>;
    /**
     * List all downloaded repositories in workspace
     */
    listRepos(): Promise<RepoListResponse>;
    /**
     * Delete a downloaded repository by its UUID
     */
    deleteRepo(repoId: string): Promise<RepoDeleteResponse>;
    /**
     * List all database configurations in workspace
     */
    listDatabases(): Promise<DatabaseListResponse>;
    /**
     * Create a new database configuration
     */
    createDatabase(config: DatabaseCreate): Promise<DatabaseConfigResponse>;
    /**
     * Get database configuration by ID
     */
    getDatabase(databaseId: string): Promise<DatabaseConfigResponse>;
    /**
     * Update database configuration
     */
    updateDatabase(databaseId: string, updates: DatabaseUpdate): Promise<DatabaseConfigResponse>;
    /**
     * Delete database configuration
     */
    deleteDatabase(databaseId: string): Promise<void>;
    /**
     * Test database connection
     */
    testDatabaseConnection(databaseId: string): Promise<{
        success: boolean;
        message: string;
        latency_ms?: number;
    }>;
    /**
     * Get database schema (tables and columns)
     */
    getDatabaseSchema(databaseId?: string): Promise<DatabaseSchemaResponse>;
    /**
     * Get sample data from a table
     */
    getDatabaseSample(tableName: string, databaseId?: string, limit?: number): Promise<DatabaseSampleResponse>;
    /**
     * List all tables in database
     */
    listDatabaseTables(databaseId?: string): Promise<{
        tables: string[];
    }>;
    /**
     * List all projects in workspace
     */
    listProjects(limit?: number): Promise<ProjectListResponse>;
    /**
     * Create a new project with auto-generated UUID
     */
    createProject(name: string, description?: string): Promise<ProjectResponse>;
    /**
     * Get project by ID
     */
    getProject(projectId: string): Promise<ProjectResponse>;
    /**
     * Update project
     */
    updateProject(projectId: string, updates: ProjectUpdate): Promise<ProjectResponse>;
    /**
     * Delete project
     */
    deleteProject(projectId: string): Promise<void>;
    /**
     * Add repository to project
     */
    addProjectRepo(projectId: string, repoId: string, options?: {
        category?: string;
        priority?: number;
        autoInclude?: boolean;
        branch?: string;
    }): Promise<ProjectResponse>;
    /**
     * Remove repository from project
     */
    removeProjectRepo(projectId: string, repoId: string): Promise<ProjectResponse>;
    /**
     * Set default repository for project
     */
    setDefaultRepo(projectId: string, repoId: string | null): Promise<ProjectResponse>;
    /**
     * Get context repositories for project (auto-include enabled)
     */
    getContextRepos(projectId: string): Promise<LinkedRepoResponse[]>;
    /**
     * Add mission to project
     */
    addProjectMission(projectId: string, missionId: string): Promise<ProjectResponse>;
    /**
     * Remove mission from project
     */
    removeProjectMission(projectId: string, missionId: string): Promise<ProjectResponse>;
    /**
     * List all sessions in workspace
     */
    listSessions(limit?: number, status?: string): Promise<SessionListResponse>;
    /**
     * Get session messages
     */
    getSessionMessages(sessionId: string, limit?: number): Promise<SessionMessagesResponse>;
    /**
     * Update session metadata
     */
    updateSessionMetadata(sessionId: string, updates: SessionMetadataUpdate): Promise<SessionResponse>;
    /**
     * Fork session
     */
    forkSession(sessionId: string, missionId: string, forkPoint?: number): Promise<SessionForkResponse>;
    /**
     * Archive session
     */
    archiveSession(sessionId: string): Promise<void>;
    /**
     * Get auth configuration (public endpoint)
     */
    getAuthConfig(): Promise<AuthConfig>;
    /**
     * Get current authenticated user
     */
    getCurrentUser(): Promise<UserResponse>;
    /**
     * List workspaces for authenticated user
     */
    listWorkspaces(): Promise<WorkspacesResponse>;
    /**
     * Login with username and password (JSON endpoint for programmatic clients)
     * @param username - Cognito username
     * @param password - User password
     * @returns Token response with access_token, refresh_token, and expires_in
     */
    login(username: string, password: string): Promise<TokenResponse>;
    /**
     * Refresh access token using refresh token
     * @param refreshToken - The refresh token from login
     * @returns New access token (refresh token remains the same)
     */
    refreshToken(refreshToken: string): Promise<RefreshResponse>;
    /**
     * Set GitHub token for the authenticated user
     * Stores the token server-side linked to the Cognito identity
     * @param token - GitHub Personal Access Token
     * @returns Success response
     */
    setGitHubToken(token: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get GitHub token status for the authenticated user
     * @returns Token status (configured or not)
     */
    getGitHubTokenStatus(): Promise<{
        configured: boolean;
        username?: string;
    }>;
    /**
     * Delete GitHub token for the authenticated user
     * @returns Success response
     */
    deleteGitHubToken(): Promise<{
        success: boolean;
    }>;
    private _mission?;
    private _project?;
    private _session?;
    private _kb?;
    /**
     * Mission namespace for convenient mission operations
     * @example ocxp.mission.list({ status: 'pending' })
     */
    get mission(): MissionNamespace;
    /**
     * Project namespace for convenient project operations
     * @example ocxp.project.list()
     */
    get project(): ProjectNamespace;
    /**
     * Session namespace for convenient session operations
     * @example ocxp.session.list({ status: 'active' })
     */
    get session(): SessionNamespace;
    /**
     * KB namespace for convenient knowledge base operations
     * @example ocxp.kb.query('search term')
     */
    get kb(): KBNamespace;
}
/**
 * Mission namespace for convenient mission operations
 */
declare class MissionNamespace {
    private client;
    constructor(client: OCXPClient);
    /**
     * List missions with optional filtering
     * @example ocxp.mission.list({ status: 'active', limit: 10 })
     */
    list(options?: {
        projectId?: string;
        status?: string;
        limit?: number;
    }): Promise<MissionListResponse>;
    /**
     * Get a mission by ID
     * @example ocxp.mission.get('uuid')
     */
    get(missionId: string): Promise<MissionResponse>;
    /**
     * Create a new mission with auto-generated UUID
     * @example ocxp.mission.create({ title: 'My Mission', description: 'Description' })
     */
    create(data: {
        title: string;
        description?: string;
        projectId?: string;
        goals?: string[];
    }): Promise<MissionResponse>;
    /**
     * Update mission
     */
    update(missionId: string, updates: {
        title?: string;
        description?: string;
        status?: string;
        progress?: number;
        notes?: string;
    }): Promise<MissionResponse>;
    /**
     * Delete mission
     */
    delete(missionId: string): Promise<void>;
    /**
     * Add session to mission
     */
    addSession(missionId: string, sessionId: string): Promise<MissionResponse>;
    /**
     * Remove session from mission
     */
    removeSession(missionId: string, sessionId: string): Promise<MissionResponse>;
    /**
     * Regenerate mission - archives old docs and triggers AgentCore
     * @example ocxp.mission.regenerate('uuid', { ticket_id: 'AMC-123' })
     */
    regenerate(missionId: string, options?: {
        ticket_id?: string;
        ticket_summary?: string;
        ticket_description?: string;
        archive_old_docs?: boolean;
        auto_increment_version?: boolean;
    }): Promise<RegenerateMissionResponse>;
    /**
     * Download mission pack as ZIP
     * @example await ocxp.mission.download('mission-id')
     */
    download(missionId: string): Promise<Blob>;
    /**
     * Get mission context for agents
     * @example ocxp.mission.getContext('uuid')
     */
    getContext(missionId: string): Promise<({
        data: MissionContextResponse;
        error: undefined;
    } | {
        data: undefined;
        error: unknown;
    }) & {
        request: Request;
        response: Response;
    }>;
    /**
     * Get mission content tree structure from S3
     * @param includeVersions - If true, includes S3 version IDs for files
     * @example ocxp.mission.tree('mission-id', 5, true)
     */
    tree(path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse>;
}
/**
 * Project namespace for convenient project operations
 */
declare class ProjectNamespace {
    private client;
    constructor(client: OCXPClient);
    /**
     * List all projects
     * @example ocxp.project.list()
     */
    list(limit?: number): Promise<ProjectListResponse>;
    /**
     * Get a project by ID
     * @example ocxp.project.get('my-project')
     */
    get(projectId: string): Promise<ProjectResponse>;
    /**
     * Create a new project with auto-generated UUID
     * @example ocxp.project.create({ name: 'My Project', description: 'Optional description' })
     */
    create(data: {
        name: string;
        description?: string;
    }): Promise<ProjectResponse>;
    /**
     * Update a project
     */
    update(projectId: string, data: ProjectUpdate): Promise<ProjectResponse>;
    /**
     * Delete a project
     */
    delete(projectId: string): Promise<void>;
    /**
     * Add a repository to a project
     */
    addRepo(projectId: string, repoId: string, options?: {
        category?: string;
        priority?: number;
        autoInclude?: boolean;
        branch?: string;
    }): Promise<ProjectResponse>;
    /**
     * Remove a repository from a project
     */
    removeRepo(projectId: string, repoId: string): Promise<ProjectResponse>;
    /**
     * Set the default repository for a project
     */
    setDefaultRepo(projectId: string, repoId: string | null): Promise<ProjectResponse>;
    /**
     * Get context repositories for a project
     */
    getContextRepos(projectId: string): Promise<LinkedRepoResponse[]>;
    /**
     * Add a mission to a project
     */
    addMission(projectId: string, missionId: string): Promise<ProjectResponse>;
    /**
     * Remove a mission from a project
     */
    removeMission(projectId: string, missionId: string): Promise<ProjectResponse>;
    /**
     * Get project content tree structure from S3
     * @param includeVersions - If true, includes S3 version IDs for files
     * @example ocxp.project.tree('subfolder', 5, true)
     */
    tree(path?: string, depth?: number, includeVersions?: boolean): Promise<ContentTreeResponse>;
}
/**
 * Session namespace for convenient session operations
 */
declare class SessionNamespace {
    private client;
    constructor(client: OCXPClient);
    /**
     * List sessions with optional filtering
     * @example ocxp.session.list({ status: 'active', limit: 10 })
     */
    list(options?: {
        status?: string;
        limit?: number;
    }): Promise<SessionListResponse>;
    /**
     * Get session messages
     * @example ocxp.session.getMessages('session-id')
     */
    getMessages(sessionId: string): Promise<SessionMessagesResponse>;
    /**
     * Update session metadata
     */
    updateMetadata(sessionId: string, data: SessionMetadataUpdate): Promise<SessionResponse>;
    /**
     * Fork a session
     */
    fork(sessionId: string, missionId: string, forkPoint?: number): Promise<SessionForkResponse>;
    /**
     * Archive a session
     */
    archive(sessionId: string): Promise<void>;
}
/**
 * KB namespace for convenient knowledge base operations
 */
declare class KBNamespace {
    private client;
    constructor(client: OCXPClient);
    /**
     * Query the knowledge base with optional filtering and external docs fallback
     * @example ocxp.kb.query('search term', { searchType: 'HYBRID', maxResults: 10 })
     * @example ocxp.kb.query('authentication', { projectId: 'my-project', missionId: 'CTX-123' })
     * @example ocxp.kb.query('strands agent', { enableFallback: true, persistExternalDocs: true })
     */
    query(query: string, options?: {
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
    }): Promise<KbQueryResponse>;
    /**
     * RAG query with LLM response and citations
     * @example ocxp.kb.rag('What is OCXP?')
     */
    rag(query: string, sessionId?: string): Promise<KbRagResponse>;
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
    repo: "repo";
    project: "project";
    mission: "mission";
    context: "context";
    sop: "sop";
    artifact: "artifact";
    kb: "kb";
    docs: "docs";
}>;
type ContentType = z.infer<typeof ContentTypeSchema>;
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
type ListEntry = z.infer<typeof ListEntrySchema>;
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
    version_id?: string;
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
type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;
/**
 * Create session response data schema
 */
declare const CreateSessionDataSchema: z.ZodObject<{
    sessionId: z.ZodString;
    missionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type CreateSessionData = z.infer<typeof CreateSessionDataSchema>;
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
type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;
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
type GetSessionMessagesResponse = z.infer<typeof GetSessionMessagesResponseSchema>;
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
type UpdateSessionMetadataResponse = z.infer<typeof UpdateSessionMetadataResponseSchema>;
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
type ForkSessionResponse = z.infer<typeof ForkSessionResponseSchema>;

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
type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;
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
type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;
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
type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;
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
type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;
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
type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;
/**
 * Add project repo response data schema
 */
declare const AddProjectRepoDataSchema: z.ZodObject<{
    projectId: z.ZodString;
    repoId: z.ZodString;
}, z.core.$strip>;
type AddProjectRepoData = z.infer<typeof AddProjectRepoDataSchema>;
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
type AddProjectRepoResponse = z.infer<typeof AddProjectRepoResponseSchema>;
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
    failed: "failed";
    queued: "queued";
    processing: "processing";
    uploading: "uploading";
    vectorizing: "vectorizing";
    complete: "complete";
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
        failed: "failed";
        queued: "queued";
        processing: "processing";
        uploading: "uploading";
        vectorizing: "vectorizing";
        complete: "complete";
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
            failed: "failed";
            queued: "queued";
            processing: "processing";
            uploading: "uploading";
            vectorizing: "vectorizing";
            complete: "complete";
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
/**
 * Repository status response data schema
 */
declare const RepoStatusDataSchema: z.ZodObject<{
    job_id: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        queued: "queued";
        processing: "processing";
        uploading: "uploading";
        vectorizing: "vectorizing";
        complete: "complete";
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
            failed: "failed";
            queued: "queued";
            processing: "processing";
            uploading: "uploading";
            vectorizing: "vectorizing";
            complete: "complete";
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
        failed: "failed";
        processing: "processing";
        complete: "complete";
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
            failed: "failed";
            processing: "processing";
            complete: "complete";
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
        failed: "failed";
        queued: "queued";
        processing: "processing";
        complete: "complete";
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
            failed: "failed";
            queued: "queued";
            processing: "processing";
            complete: "complete";
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

export { type AcknowledgeMemoData, type AcknowledgeMemoResponses, type AddDatabaseData, type AddDatabaseResponses, type AddLinkedRepoData, type AddLinkedRepoResponses, type AddMissionData, type AddMissionRequest, type AddMissionResponses, type AddProjectRepoData, AddProjectRepoDataSchema, type AddProjectRepoResponse, AddProjectRepoResponseSchema, type AddRepoRequest, type ArchiveSessionData, type ArchiveSessionResponses, type AuthConfig, type AuthTokenData, AuthTokenDataSchema, type AuthTokenResponse, AuthTokenResponseSchema, type AuthUserInfo, type AuthUserInfoResponse, AuthUserInfoResponseSchema, AuthUserInfoSchema, type AuthValidateData, AuthValidateDataSchema, type AuthValidateResponse, AuthValidateResponseSchema, type BulkDeleteContentData, type BulkDeleteContentResponses, type BulkDeleteRequest, type BulkReadContentData, type BulkReadContentResponses, type BulkReadRequest, type BulkWriteContentData, type BulkWriteContentResponses, type BulkWriteRequest, type CheckAccessRequest, type Client, type ClientOptions, type Config, type ConnectionState, type ContentType, type ContentTypeInfo, ContentTypeInfoSchema, ContentTypeSchema, type ContentTypeValue, type ContentTypesData, ContentTypesDataSchema, type ContentTypesResponse, ContentTypesResponseSchema, type ContentTypesResult, type ContextReposData, ContextReposDataSchema, type ContextReposResponse, ContextReposResponseSchema, type CreateDatabaseData, type CreateDatabaseResponses, type CreateMemoData, type CreateMemoRequest, type CreateMemoResponse, type CreateMemoResponses, type CreateProjectData, CreateProjectDataSchema, type CreateProjectResponse, CreateProjectResponseSchema, type CreateProjectResponses, type CreateSessionData, CreateSessionDataSchema, type CreateSessionResponse, CreateSessionResponseSchema, type DatabaseConfigResponse, type DatabaseCreate, type DatabaseListResponse, type DatabaseSampleResponse, type DatabaseSchemaResponse, type DatabaseUpdate, type DeleteContentData, type DeleteContentResponses, type DeleteData, DeleteDataSchema, type DeleteDatabaseData, type DeleteDatabaseResponses, type DeleteMemoData, type DeleteMemoResponse, type DeleteMemoResponses, type DeleteProjectData, DeleteProjectDataSchema, type DeleteProjectResponse, DeleteProjectResponseSchema, type DeleteProjectResponses, type DeleteRepoData, type DeleteRepoResponses, type DeleteResponse, DeleteResponseSchema, type DeleteResult, type DiscoveryData, DiscoveryDataSchema, type DiscoveryEndpoint, DiscoveryEndpointSchema, type DiscoveryResponse, DiscoveryResponseSchema, type DownloadRepositoryData, type DownloadRepositoryResponses, type DownloadRequest, type ErrorResponse, ErrorResponseSchema, type ForkRequest, type ForkSessionData, ForkSessionDataSchema, type ForkSessionResponse, ForkSessionResponseSchema, type ForkSessionResponses, type GetAuthConfigData, type GetAuthConfigResponses, type GetContentStatsData, type GetContentStatsResponses, type GetContentTreeData, type GetContentTreeResponses, type GetContentTypesData, type GetContentTypesResponses, type GetContentsRequest, type GetContextReposData, type GetContextReposResponses, type GetCurrentUserData, type GetCurrentUserResponses, type GetDatabaseData, type GetDatabaseResponses, type GetMemoData, type GetMemoForSourceData, type GetMemoForSourceResponse, type GetMemoForSourceResponses, type GetMemoResponse, type GetMemoResponses, type GetMissionContextData, type GetMissionContextResponses, type GetProjectData, GetProjectDataSchema, type GetProjectDatabasesData, type GetProjectDatabasesResponses, type GetProjectResponse, GetProjectResponseSchema, type GetProjectResponses, type GetRepoDownloadStatusData, type GetRepoDownloadStatusResponses, type GetSampleData, type GetSampleResponses, type GetSchemaData, type GetSchemaResponses, type GetSessionMessagesData, GetSessionMessagesDataSchema, type GetSessionMessagesResponse, GetSessionMessagesResponseSchema, type GetSessionMessagesResponses, type GithubBranchInfo, GithubBranchInfoSchema, type GithubBranchesData, GithubBranchesDataSchema, type GithubBranchesResponse, GithubBranchesResponseSchema, type GithubCheckAccessData, type GithubCheckAccessResponses, type GithubCommitInfo, GithubCommitInfoSchema, type GithubCommitsData, GithubCommitsDataSchema, type GithubCommitsResponse, GithubCommitsResponseSchema, type GithubDirectoryData, GithubDirectoryDataSchema, type GithubDirectoryResponse, GithubDirectoryResponseSchema, type GithubFileData, GithubFileDataSchema, type GithubFileInfo, GithubFileInfoSchema, type GithubFileResponse, GithubFileResponseSchema, type GithubGetContentsData, type GithubGetContentsResponses, type GithubListBranchesData, type GithubListBranchesResponses, type GithubRepoData, GithubRepoDataSchema, type GithubRepoInfo, GithubRepoInfoSchema, type GithubRepoResponse, GithubRepoResponseSchema, type IgnoreMemoData, type IgnoreMemoResponses, type IngestionJob, type IngestionJobResponse, IngestionJobResponseSchema, IngestionJobSchema, type JobProgressMessage, type KBDocument, KBDocumentSchema, type KBIngestData, KBIngestDataSchema, type KBIngestResponse, KBIngestResponseSchema, type KBListData, KBListDataSchema, type KBListResponse, KBListResponseSchema, KBNamespace, type KbQueryRequest, type LinkedRepoResponse, type ListBranchesRequest, type ListContentData, type ListContentResponses, type ListData, ListDataSchema, type ListDatabasesData, type ListDatabasesResponses, type ListDownloadedReposData, type ListDownloadedReposResponses, type ListEntry, ListEntrySchema, type ListMemosData, type ListMemosResponse, type ListMemosResponses, type ListProjectsData, ListProjectsDataSchema, type ListProjectsResponse, ListProjectsResponseSchema, type ListProjectsResponses, type ListResponse, ListResponseSchema, type ListResult, type ListSessionsData, ListSessionsDataSchema, type ListSessionsResponse, ListSessionsResponseSchema, type ListSessionsResponses, type ListTablesData, type ListTablesResponses, type ListWorkspacesData, type ListWorkspacesResponses, type LockContentData, type LockContentResponses, type LoginData, type LoginForAccessTokenData, type LoginForAccessTokenResponses, type LoginRequest, type LoginResponses, type Memo, type MemoActionResponse, type MemoCategory, type MemoSeverity, type MemoStatus, type MessageResponse, type Meta, MetaSchema, type MissionCreateRequest, MissionNamespace, type MoveContentData, type MoveContentResponses, type MoveRequest, type NotificationMessage, OCXPAuthError, OCXPClient, type OCXPClientOptions, OCXPConflictError, OCXPError, OCXPErrorCode, OCXPNetworkError, OCXPNotFoundError, OCXPPathService, type OCXPPathServiceOptions, OCXPRateLimitError, type OCXPResponse, OCXPResponseSchema, OCXPTimeoutError, OCXPValidationError, type Options, type Pagination, PaginationSchema, type ParsedPath, type PathEntry, type PathFileInfo, type PathListResult, type PathMoveResult, type PathReadResult, type PathWriteOptions, type PathWriteResult, type PresignedUrlData, PresignedUrlDataSchema, type PresignedUrlResponse, PresignedUrlResponseSchema, type Project, type ProjectCreate, type ProjectListResponse, type ProjectMission, ProjectMissionSchema, ProjectNamespace, type ProjectRepo, ProjectRepoSchema, type ProjectResponse, ProjectSchema, type ProjectUpdate, type QueryContentData, type QueryContentResponses, type QueryData, QueryDataSchema, type QueryFilter, QueryFilterSchema, type QueryKnowledgeBaseData, type QueryKnowledgeBaseResponses, type QueryResponse, QueryResponseSchema, type RagKnowledgeBaseData, type RagKnowledgeBaseResponses, type ReadContentData, type ReadContentResponses, type ReadData, ReadDataSchema, type ReadResponse, ReadResponseSchema, type ReadResult, type RefreshRequest, type RefreshResponse, type RefreshTokensData, type RefreshTokensResponses, type RegenerateMissionData, type RegenerateMissionRequest, type RegenerateMissionResponse, type RegenerateMissionResponses, type RemoveDatabaseData, type RemoveDatabaseResponses, type RemoveLinkedRepoData, type RemoveLinkedRepoResponses, type RemoveMissionData, type RemoveMissionResponses, type RepoDeleteData, RepoDeleteDataSchema, type RepoDeleteResponse, RepoDeleteResponseSchema, type RepoDownloadData, RepoDownloadDataSchema, type RepoDownloadRequest, RepoDownloadRequestSchema, type RepoDownloadResponse, RepoDownloadResponseSchema, type RepoExistsData, RepoExistsDataSchema, type RepoExistsResponse, RepoExistsResponseSchema, type RepoInfo, type RepoListData, RepoListDataSchema, type RepoListItem, RepoListItemSchema, type RepoListResponse, RepoListResponseSchema, type RepoStatus, type RepoStatusData, RepoStatusDataSchema, RepoStatusEnum, type RepoStatusMessage, type RepoStatusResponse, RepoStatusResponseSchema, type ResolveMemoData, type ResolveMemoResponses, type SearchContentData, type SearchContentResponses, type SearchData, SearchDataSchema, type SearchResponse, SearchResponseSchema, type SearchResultItem, SearchResultItemSchema, type Session, type SessionForkResponse, type SessionListResponse, type SessionMessage, SessionMessageSchema, type SessionMessagesResponse, type SessionMetadataUpdate, SessionNamespace, type SessionResponse, SessionSchema, type SetDefaultDatabaseData, type SetDefaultDatabaseResponses, type SetDefaultRepoData, type SetDefaultRepoRequest, type SetDefaultRepoResponses, type SourceType, type StatsData, StatsDataSchema, type StatsResponse, StatsResponseSchema, type SyncEventMessage, type TestDatabaseConnectionData, type TestDatabaseConnectionResponses, type TokenProvider, type TokenResponse, type ToolCreateMissionData, type ToolCreateMissionResponses, type ToolUpdateMissionData, type ToolUpdateMissionResponses, type TreeData, TreeDataSchema, type TreeNode, TreeNodeSchema, type TreeResponse, TreeResponseSchema, type UnlockContentData, type UnlockContentResponses, type UpdateDatabaseData, type UpdateDatabaseResponses, type UpdateProjectData, UpdateProjectDataSchema, type UpdateProjectResponse, UpdateProjectResponseSchema, type UpdateProjectResponses, type UpdateSessionMetadataData, UpdateSessionMetadataDataSchema, type UpdateSessionMetadataResponse, UpdateSessionMetadataResponseSchema, type UpdateSessionMetadataResponses, type UserResponse, VALID_CONTENT_TYPES, type VectorSearchData, VectorSearchDataSchema, type VectorSearchResponse, VectorSearchResponseSchema, type WSBaseMessage, WSBaseMessageSchema, type WSChatMessage, WSChatMessageSchema, type WSChatResponse, WSChatResponseSchema, type WSConnected, WSConnectedSchema, type WSErrorMessage, WSErrorMessageSchema, type WSMessage, WSMessageSchema, type WSMessageType, WSMessageTypeSchema, type WSParseResult, type WSPingPong, WSPingPongSchema, type WSStatus, WSStatusSchema, type WSStreamChunk, WSStreamChunkSchema, type WSStreamEnd, WSStreamEndSchema, type WSStreamStart, WSStreamStartSchema, type WebSocketEventHandler, type WebSocketMessage, type WebSocketMessageType, WebSocketService, type WebSocketServiceOptions, type WorkspacesResponse, type WriteContentData, type WriteContentResponses, type WriteData, WriteDataSchema, type WriteRequest, type WriteResponse, WriteResponseSchema, type WriteResult, acknowledgeMemo, addDatabase, addLinkedRepo, addMission, archiveSession, buildPath, bulkDeleteContent, bulkReadContent, bulkWriteContent, createClient, createConfig, createDatabase, createMemo, createOCXPClient, createPathService, createProject, createResponseSchema, createWebSocketService, deleteContent, deleteDatabase, deleteMemo, deleteProject, deleteRepo, downloadRepository, forkSession, getAuthConfig, getCanonicalType, getContentStats, getContentTree, getContentTypes, getContextRepos, getCurrentUser, getDatabase, getMemo, getMemoForSource, getMissionContext, getProject, getProjectDatabases, getRepoDownloadStatus, getSample, getSchema, getSessionMessages, githubCheckAccess, githubGetContents, githubListBranches, ignoreMemo, isOCXPAuthError, isOCXPConflictError, isOCXPError, isOCXPNetworkError, isOCXPNotFoundError, isOCXPRateLimitError, isOCXPTimeoutError, isOCXPValidationError, isValidContentType, listContent, listContextDatabases, listDatabases, listDownloadedRepos, listMemos, listProjects, listSessions, listTables, listWorkspaces, lockContent, login, loginForAccessToken, mapHttpError, moveContent, normalizePath, parsePath, parseWSMessage, queryContent, queryKnowledgeBase, ragKnowledgeBase, readContent, refreshTokens, regenerateMission, removeDatabase, removeLinkedRepo, removeMission, resolveMemo, safeParseWSMessage, searchContent, setDefaultDatabase, setDefaultRepo, testDatabaseConnection, toolCreateMission, toolUpdateMission, unlockContent, updateDatabase, updateProject, updateSessionMetadata, writeContent };
