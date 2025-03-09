import { z } from "zod"
import { errorResponse } from "./response"

/**
 * Validates request data against a Zod schema
 */
export function validateRequest<T>(schema: z.ZodType<T>, data: unknown) {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        response: errorResponse("validation_error", {
          status: 400,
          message: "Invalid request data",
          details: error.errors,
        }),
      }
    }

    return {
      success: false,
      response: errorResponse("validation_error", {
        status: 400,
        message: "Invalid request data",
      }),
    }
  }
}

