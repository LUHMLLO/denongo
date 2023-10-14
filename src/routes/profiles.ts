import { Context, ObjectId, Router, Status } from "../../deps.ts";
import { AllProfiles, CreateProfile, DeleteProfile, ReadProfile, UpdateProfile, ProfileSchema } from "../models/profiles.ts";
import { HandleError } from "../utils/handlers.ts";
import { ProtectRoute } from "../utils/jwt.middleware.ts";

export function ProfileRoutes(router: Router) {
    router.get('/api/profile/list', ProtectRoute, async (context: Context) => {
        try {
            const profileList = await AllProfiles();
            context.response.status = Status.OK;
            context.response.body = { data: profileList };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.post('/api/profile/create', ProtectRoute, async (context: Context) => {
        try {
            const data = await context.request.body({ type: "json" }).value;
            const profile = await CreateProfile(data);

            console.log(profile)
            if(!profile){
                context.response.status = Status.Created;
                context.response.body = { message: "Failed to create profile"};
                return;
            }

            context.response.status = Status.Created;
            context.response.body = { message: "Profile created successfully", data: profile };
        } catch (error) {
            HandleError(error, context);
        }
    });

    router.get('/api/profile/read/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = new ObjectId(context.params.id);

            const user = await ReadProfile(userId);

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

    router.patch('/api/profile/update/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = new ObjectId(context.params.id);

            const body = context.request.body({ type: "json" });
            const data = await body.value as Partial<ProfileSchema>

            const user = await UpdateProfile(userId, data);

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

    router.delete('/api/profile/delete/:id', ProtectRoute, async (context: Context) => {
        try {
            const userId: ObjectId = new ObjectId(context.params.id);
            await DeleteProfile(userId);
            context.response.status = Status.NoContent;
            context.response.body = { message: `Deleted user ${userId}` };
        } catch (error) {
            HandleError(error, context);
        }
    });

}