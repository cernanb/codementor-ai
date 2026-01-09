/**
 * Centralized error handling utilities
 * Demonstrates error handling best practices for production applications
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  
  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // Resources
  NOT_FOUND = "NOT_FOUND",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
  
  // External Services
  OPENAI_ERROR = "OPENAI_ERROR",
  PISTON_ERROR = "PISTON_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  
  // Generic
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
  isOperational: boolean;
}

export class ApplicationError extends Error implements AppError {
  code: ErrorCode;
  statusCode: number;
  details?: unknown;
  isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes for better error handling
export class ValidationError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, ErrorCode.NOT_FOUND, 404);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = "Unauthorized") {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message: string = "Rate limit exceeded", retryAfter?: number) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, { retryAfter });
  }
}

export class ExternalServiceError extends ApplicationError {
  constructor(
    service: string,
    message: string,
    originalError?: unknown
  ) {
    super(
      `${service} error: ${message}`,
      service === "OpenAI" ? ErrorCode.OPENAI_ERROR : ErrorCode.PISTON_ERROR,
      502,
      { originalError }
    );
  }
}

/**
 * Formats error for API response
 * Never exposes internal error details to clients
 */
export function formatErrorResponse(error: unknown): {
  error: string;
  code: string;
  statusCode: number;
  details?: unknown;
} {
  // Handle known application errors
  if (error instanceof ApplicationError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      // Only include details in development
      details: process.env.NODE_ENV === "development" ? error.details : undefined,
    };
  }

  // Handle unexpected errors
  const message = error instanceof Error 
    ? error.message 
    : "An unexpected error occurred";
  
  return {
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : message,
    code: ErrorCode.INTERNAL_ERROR,
    statusCode: 500,
    details: process.env.NODE_ENV === "development" ? { error } : undefined,
  };
}

/**
 * Logs error with appropriate level
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  if (error instanceof ApplicationError && error.isOperational) {
    // Operational errors (expected) - log as warning
    console.warn(`[${error.code}] ${error.message}`, {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      context,
    });
  } else {
    // Programmer errors (unexpected) - log as error
    console.error("Unexpected error:", {
      error,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
