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
  getContentTypes,
  listContent,
  readContent,
  writeContent,
  deleteContent,
  queryContent,
  searchContent,
  getContentTree,
  getContentStats,
  bulkReadContent,
  bulkWriteContent,
  bulkDeleteContent,
  queryKnowledgeBase,
  ragKnowledgeBase,
  createMission,
  updateMission,
  getMissionContext,
  discoverSimilar,
  findByTicket,
  lockContent,
  unlockContent,
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

  // Data types for SDK functions
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
  GetContentTreeData,
  GetContentTreeResponse,
  GetContentStatsData,
  GetContentStatsResponse,
  BulkReadContentData,
  BulkReadContentResponse,
  BulkWriteContentData,
  BulkWriteContentResponse,
  BulkDeleteContentData,
  BulkDeleteContentResponse,
  QueryKnowledgeBaseData,
  QueryKnowledgeBaseResponse,
  RagKnowledgeBaseData,
  RagKnowledgeBaseResponse,
  CreateMissionData,
  CreateMissionResponse,
  UpdateMissionData,
  UpdateMissionResponse,
  GetMissionContextData,
  GetMissionContextResponse,
  DiscoverSimilarData,
  DiscoverSimilarResponse,
  FindByTicketData,
  FindByTicketResponse,
  LockContentData,
  LockContentResponse,
  UnlockContentData,
  UnlockContentResponse,
} from './generated';

// Re-export client utilities for advanced use
export {
  createClient,
  createConfig,
  type Client,
  type ClientOptions,
  type Config,
} from './generated/client';
