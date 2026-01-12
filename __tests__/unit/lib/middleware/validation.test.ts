/**
 * Unit tests for validation middleware
 */

import { describe, it, expect } from "vitest";
import { validateRequest, schemas } from "@/lib/middleware/validation";
import { ValidationError } from "@/lib/errors";

describe("validateRequest", () => {
  it("should validate correct request body", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        challengeId: "123e4567-e89b-12d3-a456-426614174000",
        code: "function test() { return 1; }",
        attemptId: "8aa094a6-297e-4f27-b3c6-9f74c33681c1",
      }),
    });

    const result = await validateRequest(request, schemas.submitCode);

    expect(result).toEqual({
      attemptId: "8aa094a6-297e-4f27-b3c6-9f74c33681c1",
      challengeId: "123e4567-e89b-12d3-a456-426614174000",
      code: "function test() { return 1; }",
    });
  });

  it("should throw ValidationError for invalid UUID", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        challengeId: "invalid-uuid",
        code: "function test() { return 1; }",
      }),
    });

    await expect(validateRequest(request, schemas.submitCode)).rejects.toThrow(
      ValidationError
    );
  });

  it("should throw ValidationError for empty code", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        challengeId: "123e4567-e89b-12d3-a456-426614174000",
        code: "",
      }),
    });

    await expect(validateRequest(request, schemas.submitCode)).rejects.toThrow(
      ValidationError
    );
  });

  it("should throw ValidationError for code that is too large", async () => {
    const largeCode = "a".repeat(100001);
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        challengeId: "123e4567-e89b-12d3-a456-426614174000",
        code: largeCode,
      }),
    });

    await expect(validateRequest(request, schemas.submitCode)).rejects.toThrow(
      ValidationError
    );
  });

  it("should throw ValidationError for invalid JSON", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: "invalid json",
    });

    await expect(validateRequest(request, schemas.submitCode)).rejects.toThrow(
      ValidationError
    );
  });
});

describe("schemas", () => {
  describe("submitCode", () => {
    it("should validate correct submit code schema", () => {
      const valid = schemas.submitCode.parse({
        challengeId: "123e4567-e89b-12d3-a456-426614174000",
        code: "function test() { return 1; }",
        attemptId: "27c6b0ab-c69d-49f0-9886-13c88a0c513c",
      });

      expect(valid.challengeId).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(valid.code).toBe("function test() { return 1; }");
    });
  });

  describe("requestHint", () => {
    it("should validate correct hint request schema", () => {
      const valid = schemas.requestHint.parse({
        challengeId: "123e4567-e89b-12d3-a456-426614174000",
        code: "function test() { return 1; }",
      });

      expect(valid.challengeId).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(valid.code).toBe("function test() { return 1; }");
    });
  });
});
