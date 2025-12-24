/**
 * Error Types Unit Tests
 *
 * Tests for OCXP error classes and utilities.
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../../src/types';

describe('OCXPError', () => {
  it('should create error with required fields', () => {
    const error = new OCXPError('Test error', OCXPErrorCode.UNKNOWN);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(OCXPErrorCode.UNKNOWN);
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('OCXPError');
  });

  it('should create error with all options', () => {
    const cause = new Error('Original error');
    const error = new OCXPError('Test error', OCXPErrorCode.VALIDATION_ERROR, 400, {
      details: { field: 'email' },
      requestId: 'req-123',
      cause,
    });

    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
    expect(error.requestId).toBe('req-123');
    expect(error.cause).toBe(cause);
  });

  it('should serialize to JSON including stack', () => {
    const error = new OCXPError('Test error', OCXPErrorCode.UNKNOWN, 500, {
      details: { key: 'value' },
      requestId: 'req-456',
    });

    const json = error.toJSON();
    expect(json.name).toBe('OCXPError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe(OCXPErrorCode.UNKNOWN);
    expect(json.statusCode).toBe(500);
    expect(json.details).toEqual({ key: 'value' });
    expect(json.requestId).toBe('req-456');
    expect(json.stack).toBeDefined();
  });
});

describe('Specialized Error Classes', () => {
  describe('OCXPNetworkError', () => {
    it('should create network error', () => {
      const error = new OCXPNetworkError('Connection failed');
      expect(error.code).toBe(OCXPErrorCode.NETWORK_ERROR);
      expect(error.statusCode).toBe(0);
      expect(error.name).toBe('OCXPNetworkError');
    });
  });

  describe('OCXPValidationError', () => {
    it('should create validation error with validation errors', () => {
      const validationErrors = { email: ['Invalid format'], name: ['Required'] };
      const error = new OCXPValidationError('Invalid input', validationErrors);
      expect(error.code).toBe(OCXPErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.validationErrors).toEqual(validationErrors);
      expect(error.name).toBe('OCXPValidationError');
    });

    it('should include validationErrors in details', () => {
      const validationErrors = { email: ['Invalid'] };
      const error = new OCXPValidationError('Invalid input', validationErrors);
      expect(error.details?.validationErrors).toEqual(validationErrors);
    });
  });

  describe('OCXPAuthError', () => {
    it('should create auth error', () => {
      const error = new OCXPAuthError('Token expired');
      expect(error.code).toBe(OCXPErrorCode.AUTH_ERROR);
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('OCXPAuthError');
    });
  });

  describe('OCXPNotFoundError', () => {
    it('should create not found error with path', () => {
      const error = new OCXPNotFoundError('Resource not found', 'mission/test.md');
      expect(error.code).toBe(OCXPErrorCode.NOT_FOUND);
      expect(error.statusCode).toBe(404);
      expect(error.path).toBe('mission/test.md');
      expect(error.message).toBe('Resource not found');
      expect(error.name).toBe('OCXPNotFoundError');
    });

    it('should include path in details', () => {
      const error = new OCXPNotFoundError('Not found', '/api/projects/123');
      expect(error.details?.path).toBe('/api/projects/123');
    });
  });

  describe('OCXPRateLimitError', () => {
    it('should create rate limit error with retry after', () => {
      const error = new OCXPRateLimitError('Rate limited', 60);
      expect(error.code).toBe(OCXPErrorCode.RATE_LIMITED);
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
      expect(error.name).toBe('OCXPRateLimitError');
    });

    it('should include retryAfter in details', () => {
      const error = new OCXPRateLimitError('Too many requests', 30);
      expect(error.details?.retryAfter).toBe(30);
    });
  });

  describe('OCXPConflictError', () => {
    it('should create conflict error', () => {
      const error = new OCXPConflictError('Resource already exists');
      expect(error.code).toBe(OCXPErrorCode.CONFLICT);
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe('OCXPConflictError');
    });

    it('should store etag information', () => {
      const error = new OCXPConflictError('ETag mismatch', {
        expectedEtag: 'etag-1',
        actualEtag: 'etag-2',
      });
      expect(error.expectedEtag).toBe('etag-1');
      expect(error.actualEtag).toBe('etag-2');
    });
  });

  describe('OCXPTimeoutError', () => {
    it('should create timeout error with duration', () => {
      const error = new OCXPTimeoutError('Request timed out', 30000);
      expect(error.code).toBe(OCXPErrorCode.TIMEOUT);
      expect(error.statusCode).toBe(408);
      expect(error.timeoutMs).toBe(30000);
      expect(error.name).toBe('OCXPTimeoutError');
    });

    it('should include timeoutMs in details', () => {
      const error = new OCXPTimeoutError('Timeout', 5000);
      expect(error.details?.timeoutMs).toBe(5000);
    });
  });
});

describe('Type Guards', () => {
  it('isOCXPError should identify OCXP errors', () => {
    const ocxpError = new OCXPError('Test', OCXPErrorCode.UNKNOWN);
    const regularError = new Error('Test');

    expect(isOCXPError(ocxpError)).toBe(true);
    expect(isOCXPError(regularError)).toBe(false);
    expect(isOCXPError(null)).toBe(false);
    expect(isOCXPError('string')).toBe(false);
  });

  it('isOCXPNetworkError should identify network errors', () => {
    const networkError = new OCXPNetworkError('Failed');
    const otherError = new OCXPAuthError('Denied');

    expect(isOCXPNetworkError(networkError)).toBe(true);
    expect(isOCXPNetworkError(otherError)).toBe(false);
  });

  it('isOCXPValidationError should identify validation errors', () => {
    const validationError = new OCXPValidationError('Invalid', { field: ['error'] });
    const otherError = new OCXPError('Test', OCXPErrorCode.UNKNOWN);

    expect(isOCXPValidationError(validationError)).toBe(true);
    expect(isOCXPValidationError(otherError)).toBe(false);
  });

  it('isOCXPAuthError should identify auth errors', () => {
    const authError = new OCXPAuthError('Unauthorized');
    const otherError = new OCXPNotFoundError('Not found', '/path');

    expect(isOCXPAuthError(authError)).toBe(true);
    expect(isOCXPAuthError(otherError)).toBe(false);
  });

  it('isOCXPNotFoundError should identify not found errors', () => {
    const notFoundError = new OCXPNotFoundError('Not found', '/resource');
    const otherError = new OCXPConflictError('Exists');

    expect(isOCXPNotFoundError(notFoundError)).toBe(true);
    expect(isOCXPNotFoundError(otherError)).toBe(false);
  });

  it('isOCXPRateLimitError should identify rate limit errors', () => {
    const rateLimitError = new OCXPRateLimitError('Rate limited', 60);
    const otherError = new OCXPTimeoutError('Timeout', 1000);

    expect(isOCXPRateLimitError(rateLimitError)).toBe(true);
    expect(isOCXPRateLimitError(otherError)).toBe(false);
  });

  it('isOCXPConflictError should identify conflict errors', () => {
    const conflictError = new OCXPConflictError('Conflict');
    const otherError = new OCXPNetworkError('Network');

    expect(isOCXPConflictError(conflictError)).toBe(true);
    expect(isOCXPConflictError(otherError)).toBe(false);
  });

  it('isOCXPTimeoutError should identify timeout errors', () => {
    const timeoutError = new OCXPTimeoutError('Timeout', 5000);
    const otherError = new OCXPValidationError('Invalid', {});

    expect(isOCXPTimeoutError(timeoutError)).toBe(true);
    expect(isOCXPTimeoutError(otherError)).toBe(false);
  });
});

describe('mapHttpError', () => {
  it('should map 400 to validation error', () => {
    const error = mapHttpError(400, 'Bad request', { requestId: 'req-123' });
    expect(error).toBeInstanceOf(OCXPValidationError);
    expect(error.statusCode).toBe(400);
    expect(error.requestId).toBe('req-123');
  });

  it('should map 401 to auth error', () => {
    const error = mapHttpError(401, 'Unauthorized');
    expect(error).toBeInstanceOf(OCXPAuthError);
    expect(error.statusCode).toBe(401);
  });

  it('should map 403 to auth error (same as 401)', () => {
    const error = mapHttpError(403, 'Forbidden');
    expect(error).toBeInstanceOf(OCXPAuthError);
    expect(error.code).toBe(OCXPErrorCode.AUTH_ERROR);
    // Note: statusCode will be 401 due to class constructor
  });

  it('should map 404 to not found error', () => {
    const error = mapHttpError(404, 'Not found', { path: '/missing' });
    expect(error).toBeInstanceOf(OCXPNotFoundError);
    expect(error.statusCode).toBe(404);
  });

  it('should map 408 to timeout error', () => {
    const error = mapHttpError(408, 'Timeout');
    expect(error).toBeInstanceOf(OCXPTimeoutError);
    expect(error.statusCode).toBe(408);
  });

  it('should map 409 to conflict error', () => {
    const error = mapHttpError(409, 'Conflict');
    expect(error).toBeInstanceOf(OCXPConflictError);
    expect(error.statusCode).toBe(409);
  });

  it('should map 429 to rate limit error', () => {
    const error = mapHttpError(429, 'Rate limited', { retryAfter: 60 });
    expect(error).toBeInstanceOf(OCXPRateLimitError);
    expect(error.statusCode).toBe(429);
  });

  it('should map 5xx to server error', () => {
    const error500 = mapHttpError(500, 'Internal error');
    const error502 = mapHttpError(502, 'Bad gateway');
    const error503 = mapHttpError(503, 'Service unavailable');

    expect(error500.code).toBe(OCXPErrorCode.SERVER_ERROR);
    expect(error502.code).toBe(OCXPErrorCode.SERVER_ERROR);
    expect(error503.code).toBe(OCXPErrorCode.SERVER_ERROR);
  });

  it('should map unknown status to generic error', () => {
    const error = mapHttpError(418, "I'm a teapot");
    expect(error).toBeInstanceOf(OCXPError);
    expect(error.code).toBe(OCXPErrorCode.UNKNOWN);
  });
});
