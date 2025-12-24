/**
 * Zod Schema Unit Tests
 *
 * Tests for API response validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  OCXPResponseSchema,
  MetaSchema,
  ErrorResponseSchema,
  ContentTypeSchema,
  ListEntrySchema,
  ListDataSchema,
  ReadDataSchema,
  WriteDataSchema,
  SessionSchema,
  ProjectSchema,
  RepoStatusEnum,
  WSChatMessageSchema,
  WSChatResponseSchema,
  parseWSMessage,
  safeParseWSMessage,
} from '../../src/schemas';

describe('Common Schemas', () => {
  describe('MetaSchema', () => {
    it('should validate valid meta object', () => {
      const meta = {
        requestId: 'req-123',
        timestamp: '2024-01-15T12:00:00Z',
        durationMs: 42,
        operation: 'listContent',
      };
      expect(MetaSchema.parse(meta)).toEqual(meta);
    });

    it('should reject invalid meta object', () => {
      const invalidMeta = {
        requestId: 123, // should be string
        timestamp: '2024-01-15T12:00:00Z',
      };
      expect(() => MetaSchema.parse(invalidMeta)).toThrow();
    });
  });

  describe('ErrorResponseSchema', () => {
    it('should validate error with details', () => {
      const error = {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        details: { path: '/mission/test.md' },
      };
      expect(ErrorResponseSchema.parse(error)).toEqual(error);
    });

    it('should validate error without details', () => {
      const error = {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      };
      expect(ErrorResponseSchema.parse(error)).toEqual(error);
    });
  });

  describe('OCXPResponseSchema', () => {
    it('should validate successful response', () => {
      const response = {
        success: true,
        data: { items: [] },
        meta: {
          requestId: 'req-123',
          timestamp: '2024-01-15T12:00:00Z',
          durationMs: 42,
          operation: 'test',
        },
      };
      expect(OCXPResponseSchema.parse(response)).toEqual(response);
    });

    it('should validate error response', () => {
      const response = {
        success: false,
        error: {
          code: 'ERROR',
          message: 'Something went wrong',
        },
      };
      expect(OCXPResponseSchema.parse(response)).toEqual(response);
    });
  });

  describe('ContentTypeSchema', () => {
    it('should validate valid content types', () => {
      const validTypes = ['mission', 'project', 'context', 'sop', 'repo', 'artifact', 'kb', 'docs'];
      validTypes.forEach((type) => {
        expect(ContentTypeSchema.parse(type)).toBe(type);
      });
    });

    it('should reject invalid content type', () => {
      expect(() => ContentTypeSchema.parse('invalid')).toThrow();
    });
  });
});

describe('Content Schemas', () => {
  describe('ListEntrySchema', () => {
    it('should validate file entry', () => {
      const entry = {
        name: 'test.md',
        type: 'file',
        path: 'mission/test.md',
        size: 1024,
        mtime: '2024-01-15T12:00:00Z',
      };
      expect(ListEntrySchema.parse(entry)).toEqual(entry);
    });

    it('should validate directory entry', () => {
      const entry = {
        name: 'subdir',
        type: 'directory',
        path: 'mission/subdir',
      };
      expect(ListEntrySchema.parse(entry)).toEqual(entry);
    });
  });

  describe('ListDataSchema', () => {
    it('should validate list response with pagination', () => {
      const data = {
        entries: [{ name: 'test.md', type: 'file', path: 'mission/test.md' }],
        cursor: 'cursor-abc',
        hasMore: true,
        total: 100,
      };
      expect(ListDataSchema.parse(data)).toEqual(data);
    });

    it('should apply defaults for missing optional fields', () => {
      const data = {
        entries: [],
      };
      const parsed = ListDataSchema.parse(data);
      expect(parsed.hasMore).toBe(false);
      expect(parsed.total).toBe(0);
    });
  });

  describe('ReadDataSchema', () => {
    it('should validate read response', () => {
      const data = {
        content: '# Test Content',
        size: 14,
        mtime: '2024-01-15T12:00:00Z',
        encoding: 'utf-8',
        etag: 'etag-123',
      };
      expect(ReadDataSchema.parse(data)).toEqual(data);
    });
  });

  describe('WriteDataSchema', () => {
    it('should validate write response', () => {
      const data = {
        path: 'mission/test.md',
        etag: 'etag-456',
        size: 100,
      };
      expect(WriteDataSchema.parse(data)).toEqual(data);
    });
  });
});

describe('Session Schemas', () => {
  describe('SessionSchema', () => {
    it('should validate session with all fields', () => {
      const session = {
        id: 'sess-123',
        missionId: 'mission-456',
        title: 'Test Session',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T14:00:00Z',
        metadata: { key: 'value' },
        messageCount: 10,
      };
      expect(SessionSchema.parse(session)).toEqual(session);
    });

    it('should validate minimal session', () => {
      const session = {
        id: 'sess-123',
        createdAt: '2024-01-15T12:00:00Z',
      };
      expect(SessionSchema.parse(session)).toEqual(session);
    });
  });
});

describe('Project Schemas', () => {
  describe('ProjectSchema', () => {
    it('should validate project with repos and missions', () => {
      const project = {
        id: 'proj-123',
        name: 'Test Project',
        description: 'A test project',
        createdAt: '2024-01-15T12:00:00Z',
        repos: [{ repoId: 'repo-1', isDefault: true }],
        missions: [{ missionId: 'mission-1' }],
        defaultRepoId: 'repo-1',
      };
      expect(ProjectSchema.parse(project)).toEqual(project);
    });
  });
});

describe('Repository Schemas', () => {
  describe('RepoStatusEnum', () => {
    it('should validate all status values', () => {
      const validStatuses = ['queued', 'processing', 'uploading', 'vectorizing', 'complete', 'failed'];
      validStatuses.forEach((status) => {
        expect(RepoStatusEnum.parse(status)).toBe(status);
      });
    });
  });
});

describe('WebSocket Schemas', () => {
  describe('WSChatMessageSchema', () => {
    it('should validate chat message', () => {
      const message = {
        type: 'chat',
        id: 'msg-123',
        content: 'Hello, world!',
        sessionId: 'sess-456',
        missionId: 'mission-789',
      };
      expect(WSChatMessageSchema.parse(message)).toEqual(message);
    });
  });

  describe('WSChatResponseSchema', () => {
    it('should validate chat response with usage', () => {
      const response = {
        type: 'chat_response',
        content: 'Hello back!',
        role: 'assistant',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
        },
      };
      expect(WSChatResponseSchema.parse(response)).toEqual(response);
    });
  });

  describe('parseWSMessage', () => {
    it('should parse valid chat message', () => {
      const json = JSON.stringify({
        type: 'chat',
        content: 'Test message',
      });
      const parsed = parseWSMessage(json);
      expect(parsed.type).toBe('chat');
    });

    it('should throw on invalid JSON', () => {
      expect(() => parseWSMessage('invalid json')).toThrow();
    });
  });

  describe('safeParseWSMessage', () => {
    it('should return success for valid message', () => {
      const json = JSON.stringify({
        type: 'chat_response',
        content: 'Response',
      });
      const result = safeParseWSMessage(json);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('chat_response');
      }
    });

    it('should return error for invalid JSON', () => {
      const result = safeParseWSMessage('not json');
      expect(result.success).toBe(false);
    });

    it('should return error for invalid message type', () => {
      const json = JSON.stringify({
        type: 'invalid_type',
        content: 'Test',
      });
      const result = safeParseWSMessage(json);
      expect(result.success).toBe(false);
    });
  });
});
