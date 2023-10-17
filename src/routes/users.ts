import { Context, ObjectId, Router, Status } from "@/deps.ts";
import { AllUsers, CreateUser, DeleteUser, ReadUser, UpdateUser, UserSchema } from "@/models/users.ts";
import { handleResponseError, handleResponseSuccess, handleTryCatchError } from "@/utils/handlers.ts";
import { ProtectRoute } from "@/utils/jwt.middleware.ts";

export function UserRoutes(router: Router) {
  router.get("/api/user/list", ProtectRoute, async (context: Context) => {
    try {
      const mongoResponse = await AllUsers();

      if (mongoResponse.length <= 0) {
        return handleResponseSuccess(context, Status.OK, "Records list is empty", mongoResponse);
      }

      handleResponseSuccess(context, Status.OK, `Obtained records list`, mongoResponse);
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });

  router.post("/api/user/create", ProtectRoute, async (context: Context) => {
    try {
      const data: UserSchema = await context.request.body({ type: "json" }).value;

      const mongoResponse = await CreateUser(data.username, data.password.trim());

      if (mongoResponse instanceof Error) {
        return handleResponseError(context, Status.BadRequest, mongoResponse.message);
      }

      handleResponseSuccess(context, Status.Created, `Created record`, mongoResponse);
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });

  router.get("/api/user/read/:id", ProtectRoute, async (context: Context) => {
    try {
      // deno-lint-ignore no-explicit-any
      const paramId: ObjectId = new ObjectId(await (context as any).params.id);

      const mongoResponse = await ReadUser(paramId);

      if (mongoResponse instanceof Error) {
        return handleResponseError(context, Status.NotFound, mongoResponse.message);
      }

      handleResponseSuccess(context, Status.OK, `Obtained record`, mongoResponse);
    } catch (error) {
      handleTryCatchError(error, context);
    }
  });

  router.patch("/api/user/update/:id", ProtectRoute, async (context: Context) => {
    try {
      // deno-lint-ignore no-explicit-any
      const paramId: ObjectId = new ObjectId(await (context as any).params.id);

      const data: UserSchema = await context.request.body({ type: "json" }).value;

      const mongoResponse = await UpdateUser({ ...data, _id: paramId });

      if (mongoResponse instanceof Error) {
        return handleResponseError(context, Status.BadRequest, mongoResponse.message);
      }

      handleResponseSuccess(context, Status.OK, "Updated record", mongoResponse);
    } catch (error) {
      handleTryCatchError(error, context);
    }
  },
  );

  router.delete("/api/user/delete/:id", ProtectRoute, async (context: Context) => {
    try {
      // deno-lint-ignore no-explicit-any
      const paramId: ObjectId = new ObjectId(await (context as any).params.id);

      const mongoResponse = await DeleteUser(paramId);

      if (mongoResponse === 0) {
        return handleResponseError(context, Status.NotFound, "Cannot delete record");
      }

      handleResponseSuccess(context, Status.Accepted, `Deleted record ${paramId}`);
    } catch (error) {
      handleTryCatchError(error, context);
    }
  },
  );
}
