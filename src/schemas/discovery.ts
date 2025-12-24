/**
 * Discovery & Knowledge Base Zod Schemas
 *
 * Schemas for discovery, search, and knowledge base operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * Search result item schema
 */
export const SearchResultItemSchema = z.object({
  id: z.string(),
  path: z.string().optional(),
  content: z.string().optional(),
  score: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  source: z.string().optional(),
  type: z.string().optional(),
});

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;

/**
 * Vector search response data schema
 */
export const VectorSearchDataSchema = z.object({
  results: z.array(SearchResultItemSchema),
  total: z.number().optional(),
  query: z.string().optional(),
  processingTimeMs: z.number().optional(),
});

export type VectorSearchData = z.infer<typeof VectorSearchDataSchema>;

/**
 * Vector search response schema
 */
export const VectorSearchResponseSchema = createResponseSchema(VectorSearchDataSchema);

export type VectorSearchResponse = z.infer<typeof VectorSearchResponseSchema>;

/**
 * KB document schema
 */
export const KBDocumentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string(),
  path: z.string().optional(),
  source: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  vectorId: z.string().optional(),
});

export type KBDocument = z.infer<typeof KBDocumentSchema>;

/**
 * KB list response data schema
 */
export const KBListDataSchema = z.object({
  documents: z.array(KBDocumentSchema),
  total: z.number().optional(),
  cursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional(),
});

export type KBListData = z.infer<typeof KBListDataSchema>;

/**
 * KB list response schema
 */
export const KBListResponseSchema = createResponseSchema(KBListDataSchema);

export type KBListResponse = z.infer<typeof KBListResponseSchema>;

/**
 * KB ingest response data schema
 */
export const KBIngestDataSchema = z.object({
  documentId: z.string(),
  vectorId: z.string().optional(),
  chunksCreated: z.number().optional(),
  status: z.enum(['pending', 'processing', 'complete', 'failed']).optional(),
});

export type KBIngestData = z.infer<typeof KBIngestDataSchema>;

/**
 * KB ingest response schema
 */
export const KBIngestResponseSchema = createResponseSchema(KBIngestDataSchema);

export type KBIngestResponse = z.infer<typeof KBIngestResponseSchema>;

/**
 * Discovery endpoint schema
 */
export const DiscoveryEndpointSchema = z.object({
  name: z.string(),
  path: z.string(),
  methods: z.array(z.string()),
  description: z.string().optional(),
  parameters: z.array(z.record(z.string(), z.unknown())).optional(),
});

export type DiscoveryEndpoint = z.infer<typeof DiscoveryEndpointSchema>;

/**
 * Discovery response data schema
 */
export const DiscoveryDataSchema = z.object({
  version: z.string().optional(),
  endpoints: z.array(DiscoveryEndpointSchema),
  contentTypes: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
});

export type DiscoveryData = z.infer<typeof DiscoveryDataSchema>;

/**
 * Discovery response schema
 */
export const DiscoveryResponseSchema = createResponseSchema(DiscoveryDataSchema);

export type DiscoveryResponse = z.infer<typeof DiscoveryResponseSchema>;

/**
 * Ingestion job schema
 */
export const IngestionJobSchema = z.object({
  jobId: z.string(),
  status: z.enum(['queued', 'processing', 'complete', 'failed']),
  progress: z.number().min(0).max(100).optional(),
  documentsProcessed: z.number().optional(),
  totalDocuments: z.number().optional(),
  error: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
});

export type IngestionJob = z.infer<typeof IngestionJobSchema>;

/**
 * Ingestion job response schema
 */
export const IngestionJobResponseSchema = createResponseSchema(IngestionJobSchema);

export type IngestionJobResponse = z.infer<typeof IngestionJobResponseSchema>;
