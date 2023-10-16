import { Context, Status } from "@/deps.ts";
import { handleResponseError, handleTryCatchError } from "@/utils/handlers.ts";
import { VerifyJWT } from "@/utils/jwt.ts";

export async function ProtectRoute(context: Context, next: () => Promise<unknown>): Promise<void> {
  try {
    const authHeader = context.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return handleResponseError(context, Status.Unauthorized, 'Invalid or missing Authorization Header');
    }

    const payload = await VerifyJWT(authHeader.replace("Bearer ", "").trim());

    if (payload instanceof Error) {
      return handleResponseError(context, Status.Unauthorized, payload.message);
    }

    context.state.token = payload;
    await next();
  } catch (error) {
    return handleTryCatchError(error, context);
  }
}
