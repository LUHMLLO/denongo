// auth.ts
import { Context, Router, Status } from "../../deps.ts";
import { Login } from "../models/auth.ts";
import { HandleError } from "../utils/handlers.ts";
import { CreateJWT, VerifyJWT } from "../utils/jwt.ts";

export function AuthRoutes(router: Router) {

    router.post('/api/login', async (context: Context) => {
        try {
            const body = context.request.body({ type: "json" });
            const { username, password } = await body.value;

            const data = await Login(username, password.trim());

            if (data) {
                context.response.status = Status.OK;
                context.response.body = { message: "User logged in", data: data._id, token: await CreateJWT(data._id) };
            }
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.get('/api/verify', async (context: Context) => {
        try {
            const headers = context.request.headers;
            const authHeader = headers.get("Authorization");

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                context.response.status = Status.Unauthorized;
                context.response.body = { message: "Invalid or missing Authorization header" };
                return;
            }

            const token = authHeader.replace("Bearer ", "").trim();

            const payload = await VerifyJWT(token);

            context.response.status = Status.OK;
            context.response.body = { message: "Token verified", payload: payload };

        } catch (error) {
            HandleError(error, context);
        }
    });
}
