import { Context, ObjectId, Router, Status } from "../../deps.ts";
import { AllUsers, CreateUser, ReadUser, UpdateUser, UserSchema } from "../models/users.ts";
import { HandleError } from "../utils/handlers.ts";

export function UserRoutes(router: Router) {
    router.get('/api/user/list', async (context: Context) => {
        try {
            const userList = await AllUsers();
            context.response.status = Status.OK;
            context.response.body = { data: userList };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.post('/api/user/create', async (context: Context) => {
        try {
            const body = context.request.body({ type: "json" });
            const { username, password } = await body.value;

            const user = await CreateUser(username, password);

            context.response.status = Status.Created;
            context.response.body = { message: "User created successfully", data: { user, username, password } };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.get('/api/user/read/:id', async (context: Context) => {
        try {
            const userId: ObjectId = context.params.id;

            const user = await ReadUser(userId);

            if (user) {
                context.response.status = Status.OK;
                context.response.body = { data: user };
            } else {
                context.response.status = Status.NotFound;
                context.response.body = { error: 'User not found' };
            }
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.patch('/api/user/update/:id', async (context: Context) => {
        try {
            const userId: ObjectId = context.params.id;

            const body = context.request.body({ type: "json" });
            const data = await body.value as Partial<UserSchema>

            const user = await UpdateUser(userId, data);

            if (user) {
                context.response.status = Status.OK;
                context.response.body = { message: 'Updated successfully', data: user };
            } else {
                context.response.status = Status.NotFound;
                context.response.body = { error: 'User not found' };
            }
        } catch (error) {
            HandleError(error, context);
        }
    });

}