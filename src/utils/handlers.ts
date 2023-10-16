import { Context, Status } from "@/deps.ts";

export function handleTryCatchError(error: Error, context: Context): void {
  context.response.status = Status.InternalServerError;
  context.response.body = {
    error: {
      message: error.message,
      status: Status.InternalServerError,
    },
  };
}

export function handleResponseError(context: Context, status: number, message: string, errors: string | string[]): void {
  context.response.status = status;
  context.response.body = {
    error: {
      message: message,
      status: status,
      errors: errors,
    },
  };
}

export function handleResponseSuccess(context: Context, status: number, message: string, data?: unknown): void {
  context.response.status = status;
  context.response.body = {
    success: {
      message: message,
      status: status,
      data: data,
    },
  };
}
