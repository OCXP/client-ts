/**
 * WebSocket Message Zod Schemas
 *
 * Schemas for WebSocket communication messages.
 */

import { z } from 'zod';

/**
 * WebSocket message types
 */
export const WSMessageTypeSchema = z.enum([
  'chat',
  'chat_response',
  'stream_start',
  'stream_chunk',
  'stream_end',
  'error',
  'ping',
  'pong',
  'connected',
  'disconnected',
  'session_start',
  'session_end',
  'typing',
  'status',
]);

export type WSMessageType = z.infer<typeof WSMessageTypeSchema>;

/**
 * Base WebSocket message schema
 */
export const WSBaseMessageSchema = z.object({
  type: WSMessageTypeSchema,
  id: z.string().optional(),
  timestamp: z.string().optional(),
  sessionId: z.string().optional(),
});

export type WSBaseMessage = z.infer<typeof WSBaseMessageSchema>;

/**
 * Chat message schema (user -> server)
 */
export const WSChatMessageSchema = WSBaseMessageSchema.extend({
  type: z.literal('chat'),
  content: z.string(),
  missionId: z.string().optional(),
  projectId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type WSChatMessage = z.infer<typeof WSChatMessageSchema>;

/**
 * Chat response schema (server -> client)
 */
export const WSChatResponseSchema = WSBaseMessageSchema.extend({
  type: z.literal('chat_response'),
  content: z.string(),
  role: z.enum(['assistant', 'system']).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  usage: z
    .object({
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      totalTokens: z.number().optional(),
    })
    .optional(),
});

export type WSChatResponse = z.infer<typeof WSChatResponseSchema>;

/**
 * Stream start message schema
 */
export const WSStreamStartSchema = WSBaseMessageSchema.extend({
  type: z.literal('stream_start'),
  streamId: z.string(),
});

export type WSStreamStart = z.infer<typeof WSStreamStartSchema>;

/**
 * Stream chunk message schema
 */
export const WSStreamChunkSchema = WSBaseMessageSchema.extend({
  type: z.literal('stream_chunk'),
  streamId: z.string(),
  content: z.string(),
  index: z.number().optional(),
});

export type WSStreamChunk = z.infer<typeof WSStreamChunkSchema>;

/**
 * Stream end message schema
 */
export const WSStreamEndSchema = WSBaseMessageSchema.extend({
  type: z.literal('stream_end'),
  streamId: z.string(),
  usage: z
    .object({
      promptTokens: z.number().optional(),
      completionTokens: z.number().optional(),
      totalTokens: z.number().optional(),
    })
    .optional(),
});

export type WSStreamEnd = z.infer<typeof WSStreamEndSchema>;

/**
 * Error message schema
 */
export const WSErrorMessageSchema = WSBaseMessageSchema.extend({
  type: z.literal('error'),
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type WSErrorMessage = z.infer<typeof WSErrorMessageSchema>;

/**
 * Ping/Pong message schema
 */
export const WSPingPongSchema = WSBaseMessageSchema.extend({
  type: z.enum(['ping', 'pong']),
});

export type WSPingPong = z.infer<typeof WSPingPongSchema>;

/**
 * Connected message schema
 */
export const WSConnectedSchema = WSBaseMessageSchema.extend({
  type: z.literal('connected'),
  connectionId: z.string().optional(),
  serverVersion: z.string().optional(),
});

export type WSConnected = z.infer<typeof WSConnectedSchema>;

/**
 * Status message schema
 */
export const WSStatusSchema = WSBaseMessageSchema.extend({
  type: z.literal('status'),
  status: z.enum(['ready', 'busy', 'processing', 'idle']),
  message: z.string().optional(),
});

export type WSStatus = z.infer<typeof WSStatusSchema>;

/**
 * Union of all WebSocket message types
 */
export const WSMessageSchema = z.discriminatedUnion('type', [
  WSChatMessageSchema,
  WSChatResponseSchema,
  WSStreamStartSchema,
  WSStreamChunkSchema,
  WSStreamEndSchema,
  WSErrorMessageSchema,
  WSPingPongSchema.extend({ type: z.literal('ping') }),
  WSPingPongSchema.extend({ type: z.literal('pong') }),
  WSConnectedSchema,
  WSStatusSchema,
]);

export type WSMessage = z.infer<typeof WSMessageSchema>;

/**
 * Safe parse result type
 */
export type WSParseResult =
  | { success: true; data: WSMessage }
  | { success: false; error: z.ZodError };

/**
 * Parse and validate a WebSocket message
 */
export function parseWSMessage(data: string): WSMessage {
  const parsed: unknown = JSON.parse(data);
  return WSMessageSchema.parse(parsed);
}

/**
 * Safe parse for WebSocket messages (returns result object)
 */
export function safeParseWSMessage(data: string): WSParseResult {
  try {
    const parsed: unknown = JSON.parse(data);
    const result = WSMessageSchema.safeParse(parsed);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Invalid JSON',
          path: [],
        },
      ]),
    };
  }
}
