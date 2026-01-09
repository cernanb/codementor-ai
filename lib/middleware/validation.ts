import { z } from "zod";
import { ValidationError } from "@/lib/errors";

export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid request body", {
        errors: error.errors,
      });
    }
    throw new ValidationError("Invalid JSON in request body");
  }
}

export const schemas = {
  submitCode: z.object({
    challengeId: z.string().uuid("Invalid challenge ID"),
    code: z
      .string()
      .min(1, "Code cannot be empty")
      .max(100000, "Code too large"),
  }),

  requestHint: z.object({
    challengeId: z.string().uuid("Invalid challenge ID"),
    code: z.string().min(1, "Code cannot be empty"),
  }),
};
