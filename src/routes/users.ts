import { Context, ObjectId, Router, Status } from "../../deps.ts";
import { AllUsers, CreateUser, DeleteUser, ReadUser, UpdateUser } from "../models/users.ts";
import { HandleError } from "../utils/handlers.ts";
import { ProtectRoute } from "../utils/jwt.middleware.ts";

export function UserRoutes(router: Router) {
    router.get('/api/user/list', ProtectRoute, async (context: Context) => {
        try {
            const userList = await AllUsers();

            if (userList instanceof Error) {
                context.response.status = Status.NoContent;
                context.response.body = { data: userList.message };
                return;
            }

            context.response.status = Status.OK;
            context.response.body = { data: userList };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.post('/api/user/create', ProtectRoute, async (context: Context) => {
        try {
            const { username, password } = await context.request.body({ type: "json" }).value;
            const data = await CreateUser(username, password.trim());

            if (data instanceof Error) {
                context.response.status = Status.BadRequest;
                context.response.body = { message: data.message };
                return;
            }

            context.response.status = Status.Created;
            context.response.body = { message: "User created successfully", data: data };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.get('/api/user/read/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = context.params.id;
            const user = await ReadUser(userId);

            if (user instanceof Error) {
                context.response.status = Status.NotFound;
                context.response.body = { error: 'User not found' };
                return;
            }

            context.response.status = Status.OK;
            context.response.body = { data: user };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.patch('/api/user/update/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = context.params.id;
            const data = await context.request.body({ type: "json" }).value
            const user = await UpdateUser({ ...data, _id: userId });

            if (user instanceof Error) {
                context.response.status = Status.NotFound;
                context.response.body = { error: user.message };
            }

            context.response.status = Status.OK;
            context.response.body = { message: 'Updated successfully', data: user };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.delete('/api/user/delete/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = context.params.id;
            const result = await DeleteUser(userId);

            if (result instanceof Error) {
                context.response.status = Status.NoContent;
                context.response.body = { message: result.message };
                return;
            }

            context.response.status = Status.NoContent;
            context.response.body = { message: `Deleted user ${userId}` };
        } catch (error) {
            HandleError(error, context);
        }
    });

}