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
  // Pagination support
  type ListOptions,
  // Repo sync types
  type RepoSyncResponse,
  type RepoSyncAllResponse,
  type RepoCommitInfo,
  type RepoCommitStatusResponse,
  // Namespace classes for convenient API access
  MissionNamespace,
  ProjectNamespace,
  SessionNamespace,
  KBNamespace,
  PrototypeNamespace,
  // Document generation types
  DocumentType,
  DOCUMENT_TYPE_INFO,
  type DocumentTypeInfo,
  type OutputGenerationResponse,
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
  // Content CRUD
  getContentTypes,
  listContent,
  readContent,
  writeContent,
  deleteContent,
  queryContent,
  searchContent,
  getContentTree,
  getContentStats,

  // Bulk Operations
  bulkReadContent,
  bulkWriteContent,
  bulkDeleteContent,

  // Repository
  downloadRepository,
  getRepoDownloadStatus,
  listDownloadedRepos,
  deleteRepo,
  syncRepo,
  syncAllRepos,
  getRepoCommits,

  // Knowledge Base
  queryKnowledgeBase,
  ragKnowledgeBase,
  getKbStatus,
  triggerKbSync,

  // GitHub
  githubCheckAccess,
  githubListBranches,
  githubGetContents,

  // Projects
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addLinkedRepo,
  removeLinkedRepo,
  setDefaultRepo,
  getContextRepos,
  addMission,
  removeMission,
  addDatabase,
  removeDatabase,
  setDefaultDatabase,
  getProjectDatabases,

  // Database Management
  listDatabases,
  createDatabase,
  getDatabase,
  updateDatabase,
  deleteDatabase,
  testDatabaseConnection,

  // Database Context
  getSchema,
  getSample,
  listTables,
  listContextDatabases,

  // Sessions
  listSessions,
  getSessionMessages,
  updateSessionMetadata,
  forkSession,
  archiveSession,

  // Tools
  toolCreateMission,
  toolUpdateMission,
  getMissionContext,

  // Mission operations
  regenerateMission,

  // Memo operations
  listMemos,
  createMemo,
  getMemo,
  getMemoForSource,
  deleteMemo,
  resolveMemo,
  acknowledgeMemo,
  ignoreMemo,

  // Workflow operations
  listWorkflows,
  createWorkflow,
  getWorkflow,
  deleteWorkflow,
  startWorkflow,

  // Workflow task operations
  listTasks,
  addTask,
  getTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,

  // Prototype operations
  listPrototypeChats,
  previewPrototypeChat,
  linkPrototypeChat,
  syncPrototypeChat,
  getPrototypeChat,
  syncPrototypeChatAsync,
  getSyncStatus,
  getStoredVersions,

  // Auth
  loginForAccessToken,
  login,
  refreshTokens,
  getAuthConfig,
  getCurrentUser,
  listWorkspaces,

  // Utility
  lockContent,
  unlockContent,
  moveContent,
  type Options,
} from './generated';

// Re-export types - using new naming from openapi-ts
export type {
  // Request body types
  WriteRequest,
  QueryFilter,
  BulkReadRequest,
  BulkWriteRequest,
  DownloadRequest,
  KbQueryRequest,
  MissionCreateRequest,
  ProjectCreate,
  ProjectUpdate,
  AddRepoRequest,
  AddMissionRequest,
  SetDefaultRepoRequest,
  SessionMetadataUpdate,
  ForkRequest,
  CheckAccessRequest,
  ListBranchesRequest,
  GetContentsRequest,
  MoveRequest,
  LoginRequest,
  RefreshRequest,

  // Response types
  ProjectListResponse,
  ProjectResponse,
  LinkedRepoResponse,
  SessionListResponse,
  SessionResponse,
  SessionMessagesResponse,
  SessionForkResponse,
  MessageResponse,
  RepoListResponse,
  RepoInfo,
  RepoStatusResponse,
  RepoDownloadResponse,
  RepoDeleteResponse,
  AuthConfig,
  UserResponse,
  WorkspacesResponse,
  TokenResponse,
  RefreshResponse,

  // Data types for SDK functions - Content CRUD
  GetContentTypesData,
  GetContentTypesResponses,
  ListContentData,
  ListContentResponses,
  ReadContentData,
  ReadContentResponses,
  WriteContentData,
  WriteContentResponses,
  DeleteContentData,
  DeleteContentResponses,
  QueryContentData,
  QueryContentResponses,
  SearchContentData,
  SearchContentResponses,
  GetContentTreeData,
  GetContentTreeResponses,
  GetContentStatsData,
  GetContentStatsResponses,

  // Bulk operations
  BulkReadContentData,
  BulkReadContentResponses,
  BulkWriteContentData,
  BulkWriteContentResponses,
  BulkDeleteContentData,
  BulkDeleteContentResponses,

  // Repository
  DownloadRepositoryData,
  DownloadRepositoryResponses,
  GetRepoDownloadStatusData,
  GetRepoDownloadStatusResponses,
  ListDownloadedReposData,
  ListDownloadedReposResponses,
  DeleteRepoData,
  DeleteRepoResponses,
  SyncRepoData,
  SyncRepoResponses,
  SyncAllReposData,
  SyncAllReposResponses,
  GetRepoCommitsData,
  GetRepoCommitsResponses,

  // Knowledge Base
  QueryKnowledgeBaseData,
  QueryKnowledgeBaseResponses,
  RagKnowledgeBaseData,
  RagKnowledgeBaseResponses,
  GetKbStatusData,
  GetKbStatusResponses,
  TriggerKbSyncData,
  TriggerKbSyncResponses,
  KbStatusResponse,
  KbOverview,
  KbRepoStatus,
  KbIngestionJob,
  TriggerSyncRequest,
  TriggerSyncResponse,

  // GitHub
  GithubCheckAccessData,
  GithubCheckAccessResponses,
  GithubListBranchesData,
  GithubListBranchesResponses,
  GithubGetContentsData,
  GithubGetContentsResponses,

  // Projects
  ListProjectsData,
  ListProjectsResponses,
  CreateProjectData,
  CreateProjectResponses,
  GetProjectData,
  GetProjectResponses,
  UpdateProjectData,
  UpdateProjectResponses,
  DeleteProjectData,
  DeleteProjectResponses,
  AddLinkedRepoData,
  AddLinkedRepoResponses,
  RemoveLinkedRepoData,
  RemoveLinkedRepoResponses,
  SetDefaultRepoData,
  SetDefaultRepoResponses,
  GetContextReposData,
  GetContextReposResponses,
  AddMissionData,
  AddMissionResponses,
  RemoveMissionData,
  RemoveMissionResponses,
  AddDatabaseData,
  AddDatabaseResponses,
  RemoveDatabaseData,
  RemoveDatabaseResponses,
  SetDefaultDatabaseData,
  SetDefaultDatabaseResponses,
  GetProjectDatabasesData,
  GetProjectDatabasesResponses,

  // Database Management
  ListDatabasesData,
  ListDatabasesResponses,
  CreateDatabaseData,
  CreateDatabaseResponses,
  GetDatabaseData,
  GetDatabaseResponses,
  UpdateDatabaseData,
  UpdateDatabaseResponses,
  DeleteDatabaseData,
  DeleteDatabaseResponses,
  TestDatabaseConnectionData,
  TestDatabaseConnectionResponses,

  // Database Context
  GetSchemaData,
  GetSchemaResponses,
  GetSampleData,
  GetSampleResponses,
  ListTablesData,
  ListTablesResponses,

  // Database Types
  DatabaseCreate,
  DatabaseUpdate,
  DatabaseConfigResponse,
  DatabaseListResponse,
  DatabaseSchemaResponse,
  DatabaseSampleResponse,

  // Sessions
  ListSessionsData,
  ListSessionsResponses,
  GetSessionMessagesData,
  GetSessionMessagesResponses,
  UpdateSessionMetadataData,
  UpdateSessionMetadataResponses,
  ForkSessionData,
  ForkSessionResponses,
  ArchiveSessionData,
  ArchiveSessionResponses,

  // Tools
  ToolCreateMissionData,
  ToolCreateMissionResponses,
  ToolUpdateMissionData,
  ToolUpdateMissionResponses,
  GetMissionContextData,
  GetMissionContextResponses,

  // Mission operations
  RegenerateMissionRequest,
  RegenerateMissionResponse,
  RegenerateMissionData,
  RegenerateMissionResponses,

  // Memo operations
  Memo,
  MemoActionResponse,
  MemoCategory,
  MemoStatus,
  MemoSeverity,
  SourceType,
  CreateMemoRequest,
  CreateMemoData,
  CreateMemoResponse,
  CreateMemoResponses,
  ListMemosData,
  ListMemosResponse,
  ListMemosResponses,
  GetMemoData,
  GetMemoResponse,
  GetMemoResponses,
  GetMemoForSourceData,
  GetMemoForSourceResponse,
  GetMemoForSourceResponses,
  DeleteMemoData,
  DeleteMemoResponse,
  DeleteMemoResponses,
  ResolveMemoData,
  ResolveMemoResponses,
  AcknowledgeMemoData,
  AcknowledgeMemoResponses,
  IgnoreMemoData,
  IgnoreMemoResponses,

  // Workflow operations
  Workflow,
  WorkflowStatus,
  WorkflowCreate,
  WorkflowResponse,
  WorkflowListResponse,
  WorkflowActionResponse,
  WorkflowTaskCreate,
  ListWorkflowsData,
  ListWorkflowsResponses,
  CreateWorkflowData,
  CreateWorkflowResponses,
  GetWorkflowData,
  GetWorkflowResponses,
  DeleteWorkflowData,
  DeleteWorkflowResponses,
  StartWorkflowData,
  StartWorkflowResponses,

  // Workflow task operations
  TaskResponse,
  TaskStatus,
  ListTasksData,
  ListTasksResponses,
  AddTaskData,
  AddTaskResponses,
  GetTaskData,
  GetTaskResponses,
  UpdateTaskData,
  UpdateTaskResponses,
  DeleteTaskData,
  DeleteTaskResponses,
  BulkUpdateTasksData,
  BulkUpdateTasksResponses,

  // Prototype operations
  PrototypeChatListResponse,
  PrototypeChatListItem,
  PrototypeChatPreviewRequest,
  PrototypeChatPreviewResponse,
  PrototypeChatLinkRequest,
  PrototypeChatLinkResponse,
  PrototypeChatSyncRequest,
  PrototypeChatSyncResponse,
  PrototypeChatGetResponse,
  PrototypeChatSyncAsyncRequest,
  PrototypeChatSyncAsyncResponse,
  PrototypeSyncJobStatusResponse,
  PrototypeStoredVersionsResponse,
  PrototypeChatVersion,
  PrototypeChatMessage,
  PrototypePageInfo,
  ListPrototypeChatsData,
  ListPrototypeChatsResponses,
  PreviewPrototypeChatData,
  PreviewPrototypeChatResponses,
  LinkPrototypeChatData,
  LinkPrototypeChatResponses,
  SyncPrototypeChatData,
  SyncPrototypeChatResponses,
  GetPrototypeChatData,
  GetPrototypeChatResponses,
  SyncPrototypeChatAsyncData,
  SyncPrototypeChatAsyncResponses,
  GetSyncStatusData,
  GetSyncStatusResponses,
  GetStoredVersionsData,
  GetStoredVersionsResponses,

  // Auth
  LoginForAccessTokenData,
  LoginForAccessTokenResponses,
  GetAuthConfigData,
  GetAuthConfigResponses,
  GetCurrentUserData,
  GetCurrentUserResponses,
  ListWorkspacesData,
  ListWorkspacesResponses,

  // Utility
  LockContentData,
  LockContentResponses,
  UnlockContentData,
  UnlockContentResponses,
  MoveContentData,
  MoveContentResponses,
  LoginData,
  LoginResponses,
  RefreshTokensData,
  RefreshTokensResponses,
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
  type PrototypeSyncProgressMessage,
  type PrototypeSyncCompleteMessage,
  type KBIndexingStatusMessage,
} from './websocket';

// Error types
export {
  OCXPError,
  OCXPNetworkError,
  OCXPValidationError,
  OCXPAuthError,
  OCXPNotFoundError,
  OCXPRateLimitError,
  OCXPConflictError,
  OCXPTimeoutError,
  OCXPErrorCode,
  isOCXPError,
  isOCXPNetworkError,
  isOCXPValidationError,
  isOCXPAuthError,
  isOCXPNotFoundError,
  isOCXPRateLimitError,
  isOCXPConflictError,
  isOCXPTimeoutError,
  mapHttpError,
} from './types';

// Zod validation schemas
export * from './schemas';
