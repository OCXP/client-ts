/**
 * OCXP Error Types
 *
 * Typed error classes for the OCXP SDK providing structured error handling
 * with error codes, HTTP status codes, and detailed context.
 */

/**
 * Error codes for OCXP operations
 */
export enum OCXPErrorCode {
  /** Network-level error (connection failed, timeout, etc.) */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Request or response validation failed */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** Authentication or authorization failed */
  AUTH_ERROR = 'AUTH_ERROR',
  /** Resource not found */
  NOT_FOUND = 'NOT_FOUND',
  /** Rate limit exceeded */
  RATE_LIMITED = 'RATE_LIMITED',
  /** Conflict (e.g., etag mismatch) */
  CONFLICT = 'CONFLICT',
  /** Operation timed out */
  TIMEOUT = 'TIMEOUT',
  /** Server-side error */
  SERVER_ERROR = 'SERVER_ERROR',
  /** Unknown error */
  UNKNOWN = 'UNKNOWN',
}

/**
 * Base error class for all OCXP errors
 */
export class OCXPError extends Error {
  /** Error code for programmatic handling */
  public readonly code: OCXPErrorCode;
  /** HTTP status code if applicable */
  public readonly statusCode: number;
  /** Additional error details */
  public readonly details?: Record<string, unknown>;
  /** Request ID for debugging */
  public readonly requestId?: string;
  /** Original cause of the error */
  public override readonly cause?: Error;

  constructor(
    message: string,
    code: OCXPErrorCode = OCXPErrorCode.UNKNOWN,
    statusCode: number = 500,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'OCXPError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = options?.details;
    this.requestId = options?.requestId;
    this.cause = options?.cause;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack,
    };
  }
}

/**
 * Network-level error (connection failed, DNS resolution, etc.)
 */
export class OCXPNetworkError extends OCXPError {
  constructor(
    message: string,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.NETWORK_ERROR, 0, options);
    this.name = 'OCXPNetworkError';
  }
}

/**
 * Validation error (request or response validation failed)
 */
export class OCXPValidationError extends OCXPError {
  /** Field-level validation errors */
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    validationErrors?: Record<string, string[]>,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.VALIDATION_ERROR, 400, {
      ...options,
      details: { ...options?.details, validationErrors },
    });
    this.name = 'OCXPValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Authentication or authorization error
 */
export class OCXPAuthError extends OCXPError {
  constructor(
    message: string,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.AUTH_ERROR, 401, options);
    this.name = 'OCXPAuthError';
  }
}

/**
 * Resource not found error
 */
export class OCXPNotFoundError extends OCXPError {
  /** The resource path that was not found */
  public readonly path?: string;

  constructor(
    message: string,
    path?: string,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.NOT_FOUND, 404, {
      ...options,
      details: { ...options?.details, path },
    });
    this.name = 'OCXPNotFoundError';
    this.path = path;
  }
}

/**
 * Rate limit exceeded error
 */
export class OCXPRateLimitError extends OCXPError {
  /** Seconds until rate limit resets */
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.RATE_LIMITED, 429, {
      ...options,
      details: { ...options?.details, retryAfter },
    });
    this.name = 'OCXPRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Conflict error (e.g., etag mismatch, concurrent modification)
 */
export class OCXPConflictError extends OCXPError {
  /** Expected etag value */
  public readonly expectedEtag?: string;
  /** Actual etag value */
  public readonly actualEtag?: string;

  constructor(
    message: string,
    options?: {
      expectedEtag?: string;
      actualEtag?: string;
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.CONFLICT, 409, {
      details: {
        ...options?.details,
        expectedEtag: options?.expectedEtag,
        actualEtag: options?.actualEtag,
      },
      requestId: options?.requestId,
      cause: options?.cause,
    });
    this.name = 'OCXPConflictError';
    this.expectedEtag = options?.expectedEtag;
    this.actualEtag = options?.actualEtag;
  }
}

/**
 * Operation timeout error
 */
export class OCXPTimeoutError extends OCXPError {
  /** Timeout duration in milliseconds */
  public readonly timeoutMs?: number;

  constructor(
    message: string = 'Operation timed out',
    timeoutMs?: number,
    options?: {
      details?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, OCXPErrorCode.TIMEOUT, 408, {
      ...options,
      details: { ...options?.details, timeoutMs },
    });
    this.name = 'OCXPTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Type guard to check if an error is an OCXPError
 */
export function isOCXPError(error: unknown): error is OCXPError {
  return error instanceof OCXPError;
}

/**
 * Type guard for specific error types
 */
export function isOCXPNetworkError(error: unknown): error is OCXPNetworkError {
  return error instanceof OCXPNetworkError;
}

export function isOCXPValidationError(error: unknown): error is OCXPValidationError {
  return error instanceof OCXPValidationError;
}

export function isOCXPAuthError(error: unknown): error is OCXPAuthError {
  return error instanceof OCXPAuthError;
}

export function isOCXPNotFoundError(error: unknown): error is OCXPNotFoundError {
  return error instanceof OCXPNotFoundError;
}

export function isOCXPRateLimitError(error: unknown): error is OCXPRateLimitError {
  return error instanceof OCXPRateLimitError;
}

export function isOCXPConflictError(error: unknown): error is OCXPConflictError {
  return error instanceof OCXPConflictError;
}

export function isOCXPTimeoutError(error: unknown): error is OCXPTimeoutError {
  return error instanceof OCXPTimeoutError;
}

/**
 * Map HTTP status code to appropriate OCXP error
 */
export function mapHttpError(
  statusCode: number,
  message: string,
  options?: {
    details?: Record<string, unknown>;
    requestId?: string;
    path?: string;
    retryAfter?: number;
  }
): OCXPError {
  const baseOptions = {
    details: options?.details,
    requestId: options?.requestId,
  };

  switch (statusCode) {
    case 400:
      return new OCXPValidationError(message, undefined, baseOptions);
    case 401:
    case 403:
      return new OCXPAuthError(message, baseOptions);
    case 404:
      return new OCXPNotFoundError(message, options?.path, baseOptions);
    case 408:
      return new OCXPTimeoutError(message, undefined, baseOptions);
    case 409:
      return new OCXPConflictError(message, baseOptions);
    case 429:
      return new OCXPRateLimitError(message, options?.retryAfter, baseOptions);
    default:
      if (statusCode >= 500) {
        return new OCXPError(message, OCXPErrorCode.SERVER_ERROR, statusCode, baseOptions);
      }
      return new OCXPError(message, OCXPErrorCode.UNKNOWN, statusCode, baseOptions);
  }
}
