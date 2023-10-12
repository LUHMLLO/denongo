import { Context, Router, Status } from "../../deps.ts";
import { Login } from "../models/auth.ts";
import { HandleError } from "../utils/handlers.ts";

export function AuthRoutes(router: Router) {

    router.post('/api/login', async (context: Context) => {
        try {
            const body = context.request.body({ type: "json" });
            const { username, password } = await body.value;

            const data = await Login(username, password.trim());

            context.response.status = Status.OK;
            context.response.body = { message: "User logged in", data: data };
        } catch (error) {
            HandleError(error, context);
        }
    });

}