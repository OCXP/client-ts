/**
 * Common Zod Schemas for OCXP API
 *
 * Shared schemas used across all API responses.
 */

import { z } from 'zod';

/**
 * Response metadata schema
 */
export const MetaSchema = z.object({
  requestId: z.string(),
  timestamp: z.string(),
  durationMs: z.number(),
  operation: z.string(),
});

export type Meta = z.infer<typeof MetaSchema>;

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Base OCXP Response wrapper schema
 * All API responses follow this structure
 */
export const OCXPResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: ErrorResponseSchema.nullable().optional(),
  notifications: z.array(z.unknown()).optional(),
  meta: MetaSchema.optional(),
});

export type OCXPResponse = z.infer<typeof OCXPResponseSchema>;

/**
 * Pagination schema for list responses (cursor-based)
 */
export const PaginationSchema = z.object({
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean(),
  total: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Standard pagination query parameters for all list endpoints
 * Supports both cursor-based AND offset-based pagination
 */
export const PaginationParamsSchema = z.object({
  /** Items per page (default: 50, max: 100) */
  limit: z.number().min(1).max(100).default(50),
  /** Skip first N items (for offset pagination) */
  offset: z.number().min(0).default(0),
  /** Cursor token (for cursor pagination, alternative to offset) */
  cursor: z.string().nullable().optional(),
  /** Sort field */
  orderBy: z.string().optional(),
  /** Sort direction: asc | desc */
  orderDir: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

/**
 * Standard paginated response structure for all list endpoints
 * Used to create typed paginated responses
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    cursor: z.string().nullable().optional(),
    hasMore: z.boolean(),
  });
}

/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  cursor?: string | null;
  hasMore: boolean;
}

/**
 * Content type enum - the 8 valid content types
 */
export const ContentTypeSchema = z.enum([
  'mission',
  'project',
  'context',
  'sop',
  'repo',
  'artifact',
  'kb',
  'docs',
]);

export type ContentType = z.infer<typeof ContentTypeSchema>;

/**
 * Helper to create typed OCXP response schema
 */
export function createResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ErrorResponseSchema.nullable().optional(),
    notifications: z.array(z.unknown()).optional(),
    meta: MetaSchema.optional(),
  });
}
