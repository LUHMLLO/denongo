import { Context, Status } from "@/deps.ts";

export function handleResponseSuccess(context: Context, status: number, message: string, data?: unknown): void {
  context.response.status = status;
  context.response.body = {
    message: message,
    status: status,
    payload: data,
  };
}

export function handleResponseError(context: Context, status: number, message: string): void {
  context.response.status = status;
  context.response.body = {
    message: message.replace("Error: ", "").trim(),
    status: status,
  };
}

export function handleTryCatchError(error: Error, context: Context): void {
  handleResponseError(context, Status.InternalServerError, error.message.replace("Error: ", "").trim());
}
