/**
 * OCXP API Zod Schemas
 *
 * Central export for all API response validation schemas.
 */

// Common schemas
export {
  MetaSchema,
  ErrorResponseSchema,
  OCXPResponseSchema,
  PaginationSchema,
  ContentTypeSchema,
  createResponseSchema,
} from './common';
export type {
  Meta,
  ErrorResponse,
  OCXPResponse,
  Pagination,
  ContentType,
} from './common';

// Content CRUD schemas
export {
  ListEntrySchema,
  ListDataSchema,
  ListResponseSchema,
  ReadDataSchema,
  ReadResponseSchema,
  WriteDataSchema,
  WriteResponseSchema,
  DeleteDataSchema,
  DeleteResponseSchema,
  QueryFilterSchema,
  QueryDataSchema,
  QueryResponseSchema,
  SearchDataSchema,
  SearchResponseSchema,
  TreeNodeSchema,
  TreeDataSchema,
  TreeResponseSchema,
  StatsDataSchema,
  StatsResponseSchema,
  ContentTypeInfoSchema,
  ContentTypesDataSchema,
  ContentTypesResponseSchema,
  PresignedUrlDataSchema,
  PresignedUrlResponseSchema,
} from './content';
export type {
  ListEntry,
  ListData,
  ListResponse,
  ReadData,
  ReadResponse,
  WriteData,
  WriteResponse,
  DeleteData,
  DeleteResponse,
  QueryFilter,
  QueryData,
  QueryResponse,
  SearchData,
  SearchResponse,
  TreeNode,
  TreeData,
  TreeResponse,
  StatsData,
  StatsResponse,
  ContentTypeInfo,
  ContentTypesData,
  ContentTypesResponse,
  PresignedUrlData,
  PresignedUrlResponse,
} from './content';

// Session schemas
export {
  SessionMessageSchema,
  SessionSchema,
  ListSessionsDataSchema,
  ListSessionsResponseSchema,
  CreateSessionDataSchema,
  CreateSessionResponseSchema,
  GetSessionMessagesDataSchema,
  GetSessionMessagesResponseSchema,
  UpdateSessionMetadataDataSchema,
  UpdateSessionMetadataResponseSchema,
  ForkSessionDataSchema,
  ForkSessionResponseSchema,
} from './session';
export type {
  SessionMessage,
  Session,
  ListSessionsData,
  ListSessionsResponse,
  CreateSessionData,
  CreateSessionResponse,
  GetSessionMessagesData,
  GetSessionMessagesResponse,
  UpdateSessionMetadataData,
  UpdateSessionMetadataResponse,
  ForkSessionData,
  ForkSessionResponse,
} from './session';

// Project schemas
export {
  ProjectRepoSchema,
  ProjectMissionSchema,
  ProjectSchema,
  ListProjectsDataSchema,
  ListProjectsResponseSchema,
  CreateProjectDataSchema,
  CreateProjectResponseSchema,
  GetProjectDataSchema,
  GetProjectResponseSchema,
  UpdateProjectDataSchema,
  UpdateProjectResponseSchema,
  DeleteProjectDataSchema,
  DeleteProjectResponseSchema,
  AddProjectRepoDataSchema,
  AddProjectRepoResponseSchema,
  ContextReposDataSchema,
  ContextReposResponseSchema,
} from './project';
export type {
  ProjectRepo,
  ProjectMission,
  Project,
  ListProjectsData,
  ListProjectsResponse,
  CreateProjectData,
  CreateProjectResponse,
  GetProjectData,
  GetProjectResponse,
  UpdateProjectData,
  UpdateProjectResponse,
  DeleteProjectData,
  DeleteProjectResponse,
  AddProjectRepoData,
  AddProjectRepoResponse,
  ContextReposData,
  ContextReposResponse,
} from './project';

// Repository schemas
export {
  RepoStatusEnum,
  RepoDownloadRequestSchema,
  RepoDownloadDataSchema,
  RepoDownloadResponseSchema,
  RepoStatusDataSchema,
  RepoStatusResponseSchema,
  RepoListItemSchema,
  RepoListDataSchema,
  RepoListResponseSchema,
  RepoExistsDataSchema,
  RepoExistsResponseSchema,
  RepoDeleteDataSchema,
  RepoDeleteResponseSchema,
} from './repository';
export type {
  RepoStatus,
  RepoDownloadRequest,
  RepoDownloadData,
  RepoDownloadResponse,
  RepoStatusData,
  RepoStatusResponse,
  RepoListItem,
  RepoListData,
  RepoListResponse,
  RepoExistsData,
  RepoExistsResponse,
  RepoDeleteData,
  RepoDeleteResponse,
} from './repository';

// Auth schemas
export {
  AuthTokenDataSchema,
  AuthTokenResponseSchema,
  AuthUserInfoSchema,
  AuthUserInfoResponseSchema,
  AuthValidateDataSchema,
  AuthValidateResponseSchema,
} from './auth';
export type {
  AuthTokenData,
  AuthTokenResponse,
  AuthUserInfo,
  AuthUserInfoResponse,
  AuthValidateData,
  AuthValidateResponse,
} from './auth';

// Discovery & KB schemas
export {
  SearchResultItemSchema,
  VectorSearchDataSchema,
  VectorSearchResponseSchema,
  KBDocumentSchema,
  KBListDataSchema,
  KBListResponseSchema,
  KBIngestDataSchema,
  KBIngestResponseSchema,
  DiscoveryEndpointSchema,
  DiscoveryDataSchema,
  DiscoveryResponseSchema,
  IngestionJobSchema,
  IngestionJobResponseSchema,
} from './discovery';
export type {
  SearchResultItem,
  VectorSearchData,
  VectorSearchResponse,
  KBDocument,
  KBListData,
  KBListResponse,
  KBIngestData,
  KBIngestResponse,
  DiscoveryEndpoint,
  DiscoveryData,
  DiscoveryResponse,
  IngestionJob,
  IngestionJobResponse,
} from './discovery';

// WebSocket schemas
export {
  WSMessageTypeSchema,
  WSBaseMessageSchema,
  WSChatMessageSchema,
  WSChatResponseSchema,
  WSStreamStartSchema,
  WSStreamChunkSchema,
  WSStreamEndSchema,
  WSErrorMessageSchema,
  WSPingPongSchema,
  WSConnectedSchema,
  WSStatusSchema,
  WSMessageSchema,
  parseWSMessage,
  safeParseWSMessage,
} from './websocket';
export type {
  WSMessageType,
  WSBaseMessage,
  WSChatMessage,
  WSChatResponse,
  WSStreamStart,
  WSStreamChunk,
  WSStreamEnd,
  WSErrorMessage,
  WSPingPong,
  WSConnected,
  WSStatus,
  WSMessage,
  WSParseResult,
} from './websocket';

// GitHub proxy schemas
export {
  GithubFileInfoSchema,
  GithubRepoInfoSchema,
  GithubBranchInfoSchema,
  GithubCommitInfoSchema,
  GithubFileDataSchema,
  GithubFileResponseSchema,
  GithubDirectoryDataSchema,
  GithubDirectoryResponseSchema,
  GithubRepoDataSchema,
  GithubRepoResponseSchema,
  GithubBranchesDataSchema,
  GithubBranchesResponseSchema,
  GithubCommitsDataSchema,
  GithubCommitsResponseSchema,
} from './github';
export type {
  GithubFileInfo,
  GithubRepoInfo,
  GithubBranchInfo,
  GithubCommitInfo,
  GithubFileData,
  GithubFileResponse,
  GithubDirectoryData,
  GithubDirectoryResponse,
  GithubRepoData,
  GithubRepoResponse,
  GithubBranchesData,
  GithubBranchesResponse,
  GithubCommitsData,
  GithubCommitsResponse,
} from './github';
