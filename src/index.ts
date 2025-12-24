/**
 * @ocxp/client - TypeScript client for OCXP protocol
 * Auto-generated from OpenAPI spec with custom wrapper
 */

// Custom client wrapper
export {
  OCXPClient,
  createOCXPClient,
  type OCXPClientOptions,
  type ContentTypeValue,
  type ListResult,
  type ReadResult,
  type WriteResult,
  type DeleteResult,
  type ContentTypesResult,
} from './client';

// Path utilities
export {
  parsePath,
  normalizePath,
  isValidContentType,
  getCanonicalType,
  buildPath,
  VALID_CONTENT_TYPES,
  type ParsedPath,
} from './path';

// Path-based service (simplified interface)
export {
  OCXPPathService,
  createPathService,
  type OCXPPathServiceOptions,
  type PathEntry,
  type PathReadResult,
  type PathWriteOptions,
  type PathWriteResult,
  type PathMoveResult,
  type PathFileInfo,
  type PathListResult,
  type TokenProvider,
} from './path-service';

// Re-export generated SDK functions for direct use
export {
  // Content CRUD (11)
  getContentTypes,
  listContent,
  readContent,
  writeContent,
  deleteContent,
  queryContent,
  searchContent,
  findContentBy,
  getContentTree,
  getContentStats,
  getPresignedUrl,

  // Bulk Operations (4)
  bulkReadContent,
  bulkWriteContent,
  bulkDeleteContent,
  downloadContent,

  // Auth (4)
  authLogin,
  authRefresh,
  authGetConfig,
  authListWorkspaces,

  // Session (7)
  listSessions,
  createSession,
  getSessionMessages,
  updateSessionMetadata,
  forkSession,
  listMissionSessions,
  createMissionSession,

  // Project (11)
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addProjectRepo,
  removeProjectRepo,
  setProjectDefaultRepo,
  getProjectContextRepos,
  addProjectMission,
  removeProjectMission,

  // Repository (5)
  downloadRepository,
  getRepoDownloadStatus,
  listDownloadedRepos,
  deleteRepository,
  checkRepoExists,

  // Knowledge Base (2)
  queryKnowledgeBase,
  ragKnowledgeBase,

  // Documentation (3)
  createDocsSnapshot,
  listDocsSnapshots,
  getDocsSnapshotStatus,

  // GitHub (3)
  githubCheckAccess,
  githubListBranches,
  githubGetContents,

  // Tools (6)
  createMission,
  updateMission,
  getMissionContext,
  learnFromMission,
  discoverSimilar,
  findByTicket,

  // Utility (4)
  lockContent,
  unlockContent,
  checkConflicts,
  moveContent,

  // Index (1)
  refreshIndex,

  type Options,
} from './generated';

// Re-export types
export type {
  // Response wrapper
  OcxpResponse,

  // Content types
  ContentType,
  ContentType2,
  ListEntry,
  QueryFilter,

  // Request types
  WriteRequestBody,
  TypedListRequest,
  TypedQueryRequest,
  TypedSearchRequest,
  TypedDeleteRequest,
  TypedFindByRequest,
  TypedTreeRequest,
  TypedStatsRequest,
  BulkReadRequestBody,
  BulkWriteRequestBody,
  BulkDeleteRequestBody,
  DownloadRequest,
  PresignedUrlRequest,
  KbQueryRequest,
  DiscoverRequest,
  MissionCreateRequest,

  // Data types for SDK functions - Content CRUD
  GetContentTypesData,
  GetContentTypesResponse,
  ListContentData,
  ListContentResponse,
  ReadContentData,
  ReadContentResponse,
  WriteContentData,
  WriteContentResponse,
  DeleteContentData,
  DeleteContentResponse,
  QueryContentData,
  QueryContentResponse,
  SearchContentData,
  SearchContentResponse,
  FindContentByData,
  FindContentByResponse,
  GetContentTreeData,
  GetContentTreeResponse,
  GetContentStatsData,
  GetContentStatsResponse,
  GetPresignedUrlData,
  GetPresignedUrlResponse,

  // Bulk operations
  BulkReadContentData,
  BulkReadContentResponse,
  BulkWriteContentData,
  BulkWriteContentResponse,
  BulkDeleteContentData,
  BulkDeleteContentResponse,
  DownloadContentData,
  DownloadContentResponse,

  // Auth
  AuthLoginData,
  AuthLoginResponse,
  AuthRefreshData,
  AuthRefreshResponse,
  AuthGetConfigData,
  AuthGetConfigResponse,
  AuthListWorkspacesData,
  AuthListWorkspacesResponse,

  // Session
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
  ListMissionSessionsData,
  ListMissionSessionsResponse,
  CreateMissionSessionData,
  CreateMissionSessionResponse,

  // Project
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
  RemoveProjectRepoData,
  RemoveProjectRepoResponse,
  SetProjectDefaultRepoData,
  SetProjectDefaultRepoResponse,
  GetProjectContextReposData,
  GetProjectContextReposResponse,
  AddProjectMissionData,
  AddProjectMissionResponse,
  RemoveProjectMissionData,
  RemoveProjectMissionResponse,

  // Repository
  DownloadRepositoryData,
  DownloadRepositoryResponse,
  GetRepoDownloadStatusData,
  GetRepoDownloadStatusResponse,
  ListDownloadedReposData,
  ListDownloadedReposResponse,
  DeleteRepositoryData,
  DeleteRepositoryResponse,
  CheckRepoExistsData,
  CheckRepoExistsResponse,

  // Knowledge Base
  QueryKnowledgeBaseData,
  QueryKnowledgeBaseResponse,
  RagKnowledgeBaseData,
  RagKnowledgeBaseResponse,

  // Documentation
  CreateDocsSnapshotData,
  CreateDocsSnapshotResponse,
  ListDocsSnapshotsData,
  ListDocsSnapshotsResponse,
  GetDocsSnapshotStatusData,
  GetDocsSnapshotStatusResponse,

  // GitHub
  GithubCheckAccessData,
  GithubCheckAccessResponse,
  GithubListBranchesData,
  GithubListBranchesResponse,
  GithubGetContentsData,
  GithubGetContentsResponse,

  // Tools
  CreateMissionData,
  CreateMissionResponse,
  UpdateMissionData,
  UpdateMissionResponse,
  GetMissionContextData,
  GetMissionContextResponse,
  LearnFromMissionData,
  LearnFromMissionResponse,
  DiscoverSimilarData,
  DiscoverSimilarResponse,
  FindByTicketData,
  FindByTicketResponse,

  // Utility
  LockContentData,
  LockContentResponse,
  UnlockContentData,
  UnlockContentResponse,
  CheckConflictsData,
  CheckConflictsResponse,
  MoveContentData,
  MoveContentResponse,

  // Index
  RefreshIndexData,
  RefreshIndexResponse,
} from './generated';

// Re-export client utilities for advanced use
export {
  createClient,
  createConfig,
  type Client,
  type ClientOptions,
  type Config,
} from './generated/client';

// WebSocket service for real-time updates
export {
  WebSocketService,
  createWebSocketService,
  type WebSocketServiceOptions,
  type WebSocketMessage,
  type WebSocketMessageType,
  type WebSocketEventHandler,
  type ConnectionState,
  type JobProgressMessage,
  type RepoStatusMessage,
  type NotificationMessage,
  type SyncEventMessage,
} from './websocket';
