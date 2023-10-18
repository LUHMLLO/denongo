import { Context, ObjectId, Router, Status } from "@/deps.ts";
import { AllProfiles, CreateProfile, DeleteProfile, ReadProfile, UpdateProfile, ProfileSchema } from "@models/profiles.ts";
import { handleResponseError, handleResponseSuccess, handleTryCatchError } from "@utils/handlers.ts";
import { ProtectRoute } from "@utils/jwt.middleware.ts";

export function ProfileRoutes(router: Router) {
    router.get("/api/profile/list", ProtectRoute, async (context: Context) => {
        try {
            const mongoResponse = await AllProfiles();

            if (mongoResponse.length <= 0) {
                return handleResponseSuccess(context, Status.OK, "Records list is empty", mongoResponse);
            }

            handleResponseSuccess(context, Status.OK, `Obtained records list`, mongoResponse);
        } catch (error) {
            handleTryCatchError(error, context);
        }
    });

    router.post("/api/profile/create", ProtectRoute, async (context: Context) => {
        try {
            const data: ProfileSchema = await context.request.body({ type: "json" }).value;

            const mongoResponse = await CreateProfile(data);

            if (mongoResponse instanceof Error) {
                return handleResponseError(context, Status.BadRequest, mongoResponse.message);
            }

            handleResponseSuccess(context, Status.Created, `Created record`, mongoResponse);
        } catch (error) {
            handleTryCatchError(error, context);
        }
    });

    router.get("/api/profile/read/:id", ProtectRoute, async (context: Context) => {
        try {
            // deno-lint-ignore no-explicit-any
            const paramId: ObjectId = new ObjectId(await (context as any).params.id);

            const mongoResponse = await ReadProfile(paramId);

            if (mongoResponse instanceof Error) {
                return handleResponseError(context, Status.NotFound, mongoResponse.message);
            }

            handleResponseSuccess(context, Status.OK, `Obtained record`, mongoResponse);
        } catch (error) {
            handleTryCatchError(error, context);
        }
    });

    router.patch("/api/profile/update/:id", ProtectRoute, async (context: Context) => {
        try {
            // deno-lint-ignore no-explicit-any
            const paramId: ObjectId = new ObjectId(await (context as any).params.id);

            const data: ProfileSchema = await context.request.body({ type: "json" }).value;

            const mongoResponse = await UpdateProfile({ ...data, _id: paramId });

            if (mongoResponse instanceof Error) {
                return handleResponseError(context, Status.BadRequest, mongoResponse.message);
            }

            handleResponseSuccess(context, Status.OK, "Updated record", mongoResponse);
        } catch (error) {
            handleTryCatchError(error, context);
        }
    });

    router.delete("/api/profile/delete/:id", ProtectRoute, async (context: Context) => {
        try {
            // deno-lint-ignore no-explicit-any
            const paramId: ObjectId = new ObjectId(await (context as any).params.id);

            const mongoResponse = await DeleteProfile(paramId);

            if (mongoResponse === 0) {
                return handleResponseError(context, Status.NotFound, "Cannot delete record");
            }

            handleResponseSuccess(context, Status.Accepted, `Deleted record ${paramId}`);
        } catch (error) {
            handleTryCatchError(error, context);
        }
    });
}