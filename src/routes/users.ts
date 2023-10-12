import { Context, Router, Status } from "../../deps.ts";
import { allUsers, insertUser } from "../models/users.ts";
import { HandleError } from "../utils/handlers.ts";

export function userRoutes(router: Router) {
    router.get('/api/user/list', async (context: Context) => {
        try {
            const userList = await allUsers();
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

            const insertedUser = await insertUser(username, password);

            context.response.status = Status.Created;
            context.response.body = { message: "User created successfully", data: { insertedUser, username, password } };

        } catch (error) {
            HandleError(error, context);
        }
    });
}