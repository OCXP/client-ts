/**
 * Content CRUD Zod Schemas
 *
 * Schemas for content operations: list, read, write, delete, query, search, etc.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * List entry schema - represents a file or directory in a list response
 */
export const ListEntrySchema = z.object({
  name: z.string(),
  type: z.enum(['file', 'directory']),
  path: z.string(),
  size: z.number().optional(),
  mtime: z.string().optional(),
});

export type ListEntry = z.infer<typeof ListEntrySchema>;

/**
 * List response data schema
 */
export const ListDataSchema = z.object({
  entries: z.array(ListEntrySchema),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional().default(false),
  total: z.number().optional().default(0),
});

export type ListData = z.infer<typeof ListDataSchema>;

/**
 * List response schema
 */
export const ListResponseSchema = createResponseSchema(ListDataSchema);

export type ListResponse = z.infer<typeof ListResponseSchema>;

/**
 * Read response data schema
 */
export const ReadDataSchema = z.object({
  content: z.string(),
  size: z.number().optional(),
  mtime: z.string().optional(),
  encoding: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  etag: z.string().optional(),
});

export type ReadData = z.infer<typeof ReadDataSchema>;

/**
 * Read response schema
 */
export const ReadResponseSchema = createResponseSchema(ReadDataSchema);

export type ReadResponse = z.infer<typeof ReadResponseSchema>;

/**
 * Write response data schema
 */
export const WriteDataSchema = z.object({
  path: z.string(),
  etag: z.string().optional(),
  size: z.number().optional(),
});

export type WriteData = z.infer<typeof WriteDataSchema>;

/**
 * Write response schema
 */
export const WriteResponseSchema = createResponseSchema(WriteDataSchema);

export type WriteResponse = z.infer<typeof WriteResponseSchema>;

/**
 * Delete response data schema
 */
export const DeleteDataSchema = z.object({
  path: z.string(),
  deleted: z.boolean().optional().default(true),
});

export type DeleteData = z.infer<typeof DeleteDataSchema>;

/**
 * Delete response schema
 */
export const DeleteResponseSchema = createResponseSchema(DeleteDataSchema);

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

/**
 * Query filter schema
 */
export const QueryFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'contains', 'startsWith']),
  value: z.unknown(),
});

export type QueryFilter = z.infer<typeof QueryFilterSchema>;

/**
 * Query response data schema
 */
export const QueryDataSchema = z.object({
  items: z.array(z.record(z.string(), z.unknown())),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional().default(false),
  total: z.number().optional().default(0),
});

export type QueryData = z.infer<typeof QueryDataSchema>;

/**
 * Query response schema
 */
export const QueryResponseSchema = createResponseSchema(QueryDataSchema);

export type QueryResponse = z.infer<typeof QueryResponseSchema>;

/**
 * Search response data schema
 */
export const SearchDataSchema = z.object({
  results: z.array(
    z.object({
      path: z.string(),
      score: z.number().optional(),
      highlights: z.array(z.string()).optional(),
      content: z.string().optional(),
    })
  ),
  total: z.number().optional().default(0),
});

export type SearchData = z.infer<typeof SearchDataSchema>;

/**
 * Search response schema
 */
export const SearchResponseSchema = createResponseSchema(SearchDataSchema);

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

/**
 * Tree node schema
 */
export const TreeNodeSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z.object({
    name: z.string(),
    path: z.string(),
    type: z.enum(['file', 'directory']),
    size: z.number().optional(),
    version_id: z.string().optional(),
    children: z.array(TreeNodeSchema).optional(),
  })
);

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  version_id?: string;  // S3 version ID for files
  children?: TreeNode[];
}

/**
 * Tree response data schema
 */
export const TreeDataSchema = z.object({
  root: TreeNodeSchema,
  depth: z.number().optional(),
});

export type TreeData = z.infer<typeof TreeDataSchema>;

/**
 * Tree response schema
 */
export const TreeResponseSchema = createResponseSchema(TreeDataSchema);

export type TreeResponse = z.infer<typeof TreeResponseSchema>;

/**
 * Stats response data schema
 */
export const StatsDataSchema = z.object({
  totalFiles: z.number(),
  totalSize: z.number(),
  lastModified: z.string().optional(),
  fileTypes: z.record(z.string(), z.number()).optional(),
});

export type StatsData = z.infer<typeof StatsDataSchema>;

/**
 * Stats response schema
 */
export const StatsResponseSchema = createResponseSchema(StatsDataSchema);

export type StatsResponse = z.infer<typeof StatsResponseSchema>;

/**
 * Content type info schema
 */
export const ContentTypeInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  prefix: z.string().nullable().optional(),
  isVirtual: z.boolean().optional(),
  isGlobal: z.boolean().optional(),
  count: z.number().nullable().optional(),
  endpoints: z.record(z.string(), z.string()).optional(),
});

export type ContentTypeInfo = z.infer<typeof ContentTypeInfoSchema>;

/**
 * Get content types response data schema
 */
export const ContentTypesDataSchema = z.object({
  types: z.array(ContentTypeInfoSchema),
});

export type ContentTypesData = z.infer<typeof ContentTypesDataSchema>;

/**
 * Content types response schema
 */
export const ContentTypesResponseSchema = createResponseSchema(ContentTypesDataSchema);

export type ContentTypesResponse = z.infer<typeof ContentTypesResponseSchema>;

/**
 * Presigned URL response data schema
 */
export const PresignedUrlDataSchema = z.object({
  url: z.string(),
  expiresAt: z.string().optional(),
  method: z.enum(['GET', 'PUT']).optional(),
});

export type PresignedUrlData = z.infer<typeof PresignedUrlDataSchema>;

/**
 * Presigned URL response schema
 */
export const PresignedUrlResponseSchema = createResponseSchema(PresignedUrlDataSchema);

export type PresignedUrlResponse = z.infer<typeof PresignedUrlResponseSchema>;
