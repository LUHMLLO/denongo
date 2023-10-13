import { Context, Router, Status } from "../../deps.ts";
import { Login } from "../models/auth.ts";
import { CreateUser, ReadUser } from "../models/users.ts";
import { HandleError } from "../utils/handlers.ts";
import { ProtectRoute } from "../utils/jwt.middleware.ts";
import { CreateJWT } from "../utils/jwt.ts";

export function AuthRoutes(router: Router) {

    router.post('/api/signup', async (context: Context) => {
        try {
            const { username, password } = await context.request.body({ type: "json" }).value;

            const data = await CreateUser(username, password.trim());

            if (data instanceof Error) {
                context.response.status = Status.BadRequest;
                context.response.body = { message: data.message };
                return;
            }

            context.response.status = Status.Created;
            context.response.body = { message: "User created successfully" };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.post('/api/login', async (context: Context) => {
        try {
            const { username, password } = await context.request.body({ type: "json" }).value;

            const data = await Login(username, password.trim());

            if (data instanceof Error) {
                context.response.status = Status.BadRequest;
                context.response.body = { message: data.message };
                return;
            }

            context.response.status = Status.Created;
            context.response.body = { message: "User logged in", token: await CreateJWT(data!._id) };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.get('/api/profile', ProtectRoute, async (context: Context) => {
        try {
            const user = await ReadUser(context.state.token.data)

            if (user instanceof Error) {
                context.response.status = Status.BadRequest;
                context.response.body = { message: user.message };
                return;
            }

            context.response.status = Status.OK;
            context.response.body = { data: user };
        } catch (error) {
            HandleError(error, context);
        }
    });
}
