import { Context, Router, Status } from "./_deps.ts";
import { allUsers, insertUser } from "./db.ts";

const router = new Router();

router.get('/api/user/list', async (context: Context) => {
    try {
        const userList = await allUsers();

        context.response.status = Status.Created;
        context.response.body = { data: userList };

    } catch (error) {
        console.error(error);
        context.response.status = Status.InternalServerError;
        context.response.body = { error: 'Internal Server Error' };
    }
});

router.post('/api/user/create', async (context: Context) => {
    try {
        const body = context.request.body({ type: "json" });
        const { username, password } = await body.value;

        const insertedUser = await insertUser(username, password);

        context.response.status = Status.Created;
        context.response.body = { message: "User created successfully", data: {insertedUser,username,password} };

    } catch (error) {
        console.error(error);
        context.response.status = Status.InternalServerError;
        context.response.body = { error: 'Internal Server Error' };
    }
});

export default router;
