/**
 * Session Zod Schemas
 *
 * Schemas for session management operations.
 */

import { z } from 'zod';
import { createResponseSchema } from './common';

/**
 * Session message schema
 */
export const SessionMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SessionMessage = z.infer<typeof SessionMessageSchema>;

/**
 * Session schema
 */
export const SessionSchema = z.object({
  id: z.string(),
  missionId: z.string().optional(),
  title: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  messageCount: z.number().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

/**
 * List sessions response data schema
 */
export const ListSessionsDataSchema = z.object({
  sessions: z.array(SessionSchema),
  total: z.number().optional(),
});

export type ListSessionsData = z.infer<typeof ListSessionsDataSchema>;

/**
 * List sessions response schema
 */
export const ListSessionsResponseSchema = createResponseSchema(ListSessionsDataSchema);

export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;

/**
 * Create session response data schema
 */
export const CreateSessionDataSchema = z.object({
  sessionId: z.string(),
  missionId: z.string().optional(),
});

export type CreateSessionData = z.infer<typeof CreateSessionDataSchema>;

/**
 * Create session response schema
 */
export const CreateSessionResponseSchema = createResponseSchema(CreateSessionDataSchema);

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

/**
 * Get session messages response data schema
 */
export const GetSessionMessagesDataSchema = z.object({
  messages: z.array(SessionMessageSchema),
  sessionId: z.string(),
});

export type GetSessionMessagesData = z.infer<typeof GetSessionMessagesDataSchema>;

/**
 * Get session messages response schema
 */
export const GetSessionMessagesResponseSchema = createResponseSchema(GetSessionMessagesDataSchema);

export type GetSessionMessagesResponse = z.infer<typeof GetSessionMessagesResponseSchema>;

/**
 * Update session metadata response data schema
 */
export const UpdateSessionMetadataDataSchema = z.object({
  sessionId: z.string(),
  metadata: z.record(z.string(), z.unknown()),
});

export type UpdateSessionMetadataData = z.infer<typeof UpdateSessionMetadataDataSchema>;

/**
 * Update session metadata response schema
 */
export const UpdateSessionMetadataResponseSchema = createResponseSchema(
  UpdateSessionMetadataDataSchema
);

export type UpdateSessionMetadataResponse = z.infer<typeof UpdateSessionMetadataResponseSchema>;

/**
 * Fork session response data schema
 */
export const ForkSessionDataSchema = z.object({
  sessionId: z.string(),
  forkedFromId: z.string(),
});

export type ForkSessionData = z.infer<typeof ForkSessionDataSchema>;

/**
 * Fork session response schema
 */
export const ForkSessionResponseSchema = createResponseSchema(ForkSessionDataSchema);

export type ForkSessionResponse = z.infer<typeof ForkSessionResponseSchema>;
