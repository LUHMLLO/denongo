import { Context, Status } from "@/deps.ts";
import { handleResponseError, handleTryCatchError } from "@/utils/handlers.ts";
import { VerifyJWT } from "@/utils/jwt.ts";

export async function ProtectRoute(context: Context, next: () => Promise<unknown>): Promise<void> {
  try {
    const headers = context.request.headers;
    const authHeader = headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      handleResponseError(context, Status.Unauthorized, 'Invalid or missing Authorization Header')
      return;
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = await VerifyJWT(token);

    if (payload instanceof Error) {
      handleResponseError(context, Status.Unauthorized, payload.message.replace("Error: ", "").trim())
      return;
    }

    context.state.token = payload;
    await next();
  } catch (error) {
    handleTryCatchError(error, context);
  }
}
