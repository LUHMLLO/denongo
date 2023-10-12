import { Context, Status } from "../../deps.ts";

export function HandleError(error: unknown, context: Context) {
    console.error(error);
    context.response.status = Status.InternalServerError;
    context.response.body = { error: 'Internal Server Error' };
}