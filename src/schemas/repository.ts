/**
 * Repository Zod Schemas
 *
 * Schemas for repository management operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * Repository download status enum
 */
export const RepoStatusEnum = z.enum([
  'queued',
  'processing',
  'uploading',
  'vectorizing',
  'complete',
  'failed',
]);

export type RepoStatus = z.infer<typeof RepoStatusEnum>;

/**
 * Repository download request schema
 */
export const RepoDownloadRequestSchema = z.object({
  github_url: z.string(),
  repo_id: z.string(),
  branch: z.string().optional().default('main'),
  path: z.string().nullable().optional(),
  mode: z.enum(['full', 'docs_only']).optional().default('full'),
  include_extensions: z.array(z.string()).optional(),
  exclude_patterns: z.array(z.string()).optional(),
  max_file_size_kb: z.number().min(1).max(5000).optional().default(500),
  visibility: z.enum(['private', 'public']).optional().default('private'),
  trigger_vectorization: z.boolean().optional().default(true),
  generate_metadata: z.boolean().optional().default(true),
  is_private: z.boolean().optional().default(false),
});

export type RepoDownloadRequest = z.infer<typeof RepoDownloadRequestSchema>;

/**
 * Repository download response data schema
 */
export const RepoDownloadDataSchema = z.object({
  repo_id: z.string(),
  job_id: z.string(),
  s3_path: z.string().optional(),
  status: RepoStatusEnum,
  files_processed: z.number().optional(),
  metadata_files_created: z.number().optional(),
  ingestion_job_id: z.string().nullable().optional(),
});

export type RepoDownloadData = z.infer<typeof RepoDownloadDataSchema>;

/**
 * Repository download response schema
 */
export const RepoDownloadResponseSchema = createResponseSchema(RepoDownloadDataSchema);

export type RepoDownloadResponse = z.infer<typeof RepoDownloadResponseSchema>;

/**
 * Repository status response data schema
 */
export const RepoStatusDataSchema = z.object({
  job_id: z.string(),
  status: RepoStatusEnum,
  progress: z.number().min(0).max(100).optional(),
  files_processed: z.number().optional(),
  total_files: z.number().optional(),
  error: z.string().nullable().optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
});

export type RepoStatusData = z.infer<typeof RepoStatusDataSchema>;

/**
 * Repository status response schema
 */
export const RepoStatusResponseSchema = createResponseSchema(RepoStatusDataSchema);

export type RepoStatusResponse = z.infer<typeof RepoStatusResponseSchema>;

/**
 * Repository list item schema
 */
export const RepoListItemSchema = z.object({
  repo_id: z.string(),
  github_url: z.string().optional(),
  branch: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional(),
  mode: z.enum(['full', 'docs_only']).optional(),
  files_count: z.number().optional(),
  last_synced: z.string().optional(),
  s3_path: z.string().optional(),
});

export type RepoListItem = z.infer<typeof RepoListItemSchema>;

/**
 * Repository list response data schema
 */
export const RepoListDataSchema = z.object({
  repos: z.array(RepoListItemSchema),
  total: z.number().optional(),
});

export type RepoListData = z.infer<typeof RepoListDataSchema>;

/**
 * Repository list response schema
 */
export const RepoListResponseSchema = createResponseSchema(RepoListDataSchema);

export type RepoListResponse = z.infer<typeof RepoListResponseSchema>;

/**
 * Repository exists response data schema
 */
export const RepoExistsDataSchema = z.object({
  repo_id: z.string(),
  exists: z.boolean(),
  indexed_at: z.string().nullable().optional(),
  files_count: z.number().optional(),
});

export type RepoExistsData = z.infer<typeof RepoExistsDataSchema>;

/**
 * Repository exists response schema
 */
export const RepoExistsResponseSchema = createResponseSchema(RepoExistsDataSchema);

export type RepoExistsResponse = z.infer<typeof RepoExistsResponseSchema>;

/**
 * Repository delete response data schema
 */
export const RepoDeleteDataSchema = z.object({
  repo_id: z.string(),
  success: z.boolean(),
  s3_files_deleted: z.number().optional(),
  projects_updated: z.number().optional(),
  error: z.string().optional(),
});

export type RepoDeleteData = z.infer<typeof RepoDeleteDataSchema>;

/**
 * Repository delete response schema
 */
export const RepoDeleteResponseSchema = createResponseSchema(RepoDeleteDataSchema);

export type RepoDeleteResponse = z.infer<typeof RepoDeleteResponseSchema>;
