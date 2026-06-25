export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  EMAIL_EXISTS = "EMAIL_EXISTS",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static validation(message: string, details?: Record<string, unknown>) {
    return new AppError(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }

  static notFound(message: string = "Resource not found") {
    return new AppError(ErrorCode.NOT_FOUND, message, 404);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(ErrorCode.UNAUTHORIZED, message, 401);
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(ErrorCode.FORBIDDEN, message, 403);
  }

  static emailExists(message: string = "Email already registered") {
    return new AppError(ErrorCode.EMAIL_EXISTS, message, 409);
  }

  static internal(message: string = "Internal server error") {
    return new AppError(ErrorCode.INTERNAL_ERROR, message, 500);
  }
}

export function withErrorHandler(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return Response.json(
          {
            error: {
              code: error.code,
              message: error.message,
              ...(error.details && { details: error.details }),
            },
          },
          { status: error.statusCode }
        );
      }

      console.error("Unhandled error:", error);
      return Response.json(
        {
          error: {
            code: ErrorCode.INTERNAL_ERROR,
            message: "An unexpected error occurred",
          },
        },
        { status: 500 }
      );
    }
  };
}
