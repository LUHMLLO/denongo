import { Context, Status } from "../../deps.ts";
import { HandleError } from "./handlers.ts";
import { VerifyJWT } from "./jwt.ts";

export async function ProtectRoute(
    context: Context,
    next: () => Promise<unknown>
): Promise<void> {
    try {
        const headers = context.request.headers;
        const authHeader = headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            context.response.status = Status.Unauthorized;
            context.response.body = { message: "Invalid or missing Authorization Header" };
            return;
        }

        const token = authHeader.replace("Bearer ", "").trim();
        const payload = await VerifyJWT(token);

        if (payload instanceof Error) {
            context.response.status = Status.Unauthorized;
            context.response.body = { message: payload.message };
            return;
        }

        context.state.token = payload;
        await next()

    } catch (error) {
        HandleError(error, context);
    }
}
