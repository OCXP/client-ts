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

  // Knowledge Base
  queryKnowledgeBase,
  ragKnowledgeBase,

  // GitHub
  githubCheckAccess,
  githubListBranches,
  githubGetContents,

  // Tools
  createMission,
  updateMission,
  getMissionContext,
  discoverSimilar,
  findByTicket,

  // Utility
  lockContent,
  unlockContent,

  type Options,
} from './generated';

// Re-export types - using new naming from openapi-ts
export type {
  // Request types
  WriteRequest,
  QueryRequest,
  QueryFilter,
  BulkReadRequest,
  BulkWriteRequest,
  BulkDeleteRequest,
  DownloadRequest,
  KbQueryRequest,
  DiscoverRequest,
  MissionCreateRequest,
  LockRequest,

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

  // Knowledge Base
  QueryKnowledgeBaseData,
  QueryKnowledgeBaseResponses,
  RagKnowledgeBaseData,
  RagKnowledgeBaseResponses,

  // GitHub
  GithubCheckAccessData,
  GithubCheckAccessResponses,
  GithubListBranchesData,
  GithubListBranchesResponses,
  GithubGetContentsData,
  GithubGetContentsResponses,

  // Tools
  CreateMissionData,
  CreateMissionResponses,
  UpdateMissionData,
  UpdateMissionResponses,
  GetMissionContextData,
  GetMissionContextResponses,
  DiscoverSimilarData,
  DiscoverSimilarResponses,
  FindByTicketData,
  FindByTicketResponses,

  // Utility
  LockContentData,
  LockContentResponses,
  UnlockContentData,
  UnlockContentResponses,
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
