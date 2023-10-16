import { Context, Router, Status } from "@/deps.ts";
import { Login } from "@/models/auth.ts";
import { CreateUser, ReadUser } from "@/models/users.ts";
import { handleTryCatchError } from "@/utils/handlers.ts";
import { ProtectRoute } from "@/utils/jwt.middleware.ts";
import { CreateJWT } from "@/utils/jwt.ts";

export function AuthRoutes(router: Router) {
  router.post("/api/signup", async (context: Context) => {
    try {
      const { username, password } = await context.request.body({ type: "json" }).value;

      const record = await CreateUser(username, password.trim());

      if (record instanceof Error) {
        context.response.status = Status.BadRequest;
        context.response.body = { message: record.message };
        return;
      }

      context.response.status = Status.Created;
      context.response.body = { message: "User created successfully" };
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });

  router.post("/api/login", async (context: Context) => {
    try {
      const { username, password } = await context.request.body({ type: "json" }).value;

      const record = await Login(username, password.trim());

      if (record instanceof Error) {
        context.response.status = Status.BadRequest;
        context.response.body = { message: record.message };
        return;
      }

      context.response.status = Status.Created;
      context.response.body = {
        message: "User logged in",
        token: await CreateJWT(record!._id),
      };
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });

  router.get("/api/profile", ProtectRoute, async (context: Context) => {
    try {
      const record = await ReadUser(context.state.token.data);

      if (record instanceof Error) {
        context.response.status = Status.BadRequest;
        context.response.body = { message: record.message };
        return;
      }

      context.response.status = Status.OK;
      context.response.body = { data: record };
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });
}
