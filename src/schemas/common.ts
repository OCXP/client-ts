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
 * Pagination schema for list responses
 */
export const PaginationSchema = z.object({
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean(),
  total: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

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
