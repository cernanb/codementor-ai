/**
 * Unit tests for error handling utilities
 * Demonstrates testing best practices
 */

import { describe, it, expect } from "vitest";
import {
  ApplicationError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
  ExternalServiceError,
  formatErrorResponse,
  ErrorCode,
} from "@/lib/errors";

describe("Error Classes", () => {
  describe("ApplicationError", () => {
    it("should create an error with all properties", () => {
      const error = new ApplicationError(
        "Test error",
        ErrorCode.INTERNAL_ERROR,
        500,
        { detail: "test" }
      );

      expect(error.message).toBe("Test error");
      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(error.statusCode).toBe(500);
      expect(error.details).toEqual({ detail: "test" });
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ValidationError", () => {
    it("should create a validation error with 400 status", () => {
      const error = new ValidationError("Invalid input", { field: "email" });

      expect(error.message).toBe("Invalid input");
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ field: "email" });
    });
  });

  describe("NotFoundError", () => {
    it("should create a not found error with resource and id", () => {
      const error = new NotFoundError("Challenge", "123");

      expect(error.message).toBe("Challenge with id 123 not found");
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });

    it("should create a not found error without id", () => {
      const error = new NotFoundError("Challenge");

      expect(error.message).toBe("Challenge not found");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("UnauthorizedError", () => {
    it("should create an unauthorized error with default message", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("Unauthorized");
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
    });

    it("should create an unauthorized error with custom message", () => {
      const error = new UnauthorizedError("Please log in");

      expect(error.message).toBe("Please log in");
      expect(error.statusCode).toBe(401);
    });
  });

  describe("RateLimitError", () => {
    it("should create a rate limit error with retry after", () => {
      const error = new RateLimitError("Too many requests", 60);

      expect(error.message).toBe("Too many requests");
      expect(error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
      expect(error.statusCode).toBe(429);
      expect(error.details).toEqual({ retryAfter: 60 });
    });
  });

  describe("ExternalServiceError", () => {
    it("should create an OpenAI error", () => {
      const originalError = new Error("API timeout");
      const error = new ExternalServiceError("OpenAI", "Failed to generate", originalError);

      expect(error.message).toBe("OpenAI error: Failed to generate");
      expect(error.code).toBe(ErrorCode.OPENAI_ERROR);
      expect(error.statusCode).toBe(502);
      expect(error.details).toEqual({ originalError });
    });

    it("should create a Piston error", () => {
      const error = new ExternalServiceError("Piston", "Execution failed");

      expect(error.message).toBe("Piston error: Execution failed");
      expect(error.code).toBe(ErrorCode.PISTON_ERROR);
      expect(error.statusCode).toBe(502);
    });
  });
});

describe("formatErrorResponse", () => {
  it("should format ApplicationError correctly", () => {
    const error = new ValidationError("Invalid input");
    const response = formatErrorResponse(error);

    expect(response).toEqual({
      error: "Invalid input",
      code: ErrorCode.VALIDATION_ERROR,
      statusCode: 400,
      details: process.env.NODE_ENV === "development" ? undefined : undefined,
    });
  });

  it("should format generic Error correctly", () => {
    const error = new Error("Something went wrong");
    const response = formatErrorResponse(error);

    expect(response.statusCode).toBe(500);
    expect(response.code).toBe(ErrorCode.INTERNAL_ERROR);
    
    if (process.env.NODE_ENV === "production") {
      expect(response.error).toBe("Internal server error");
    } else {
      expect(response.error).toBe("Something went wrong");
    }
  });

  it("should format unknown error correctly", () => {
    const error = "String error";
    const response = formatErrorResponse(error);

    expect(response.statusCode).toBe(500);
    expect(response.code).toBe(ErrorCode.INTERNAL_ERROR);
  });

  it("should hide details in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const error = new ValidationError("Invalid input", { sensitive: "data" });
    const response = formatErrorResponse(error);

    expect(response.details).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});
