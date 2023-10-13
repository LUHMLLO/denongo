import { ObjectId } from "../../deps.ts";
import db from "../db.ts";
import { ReadUser } from "./users.ts";

export interface ProfileSchema {
    _id: ObjectId;
    _userID: ObjectId;
    email: string;
    fullname: string;
    phone: string;
    role: string;
}

export const profilesCollection = db.collection<ProfileSchema>("profiles");

export async function AllProfiles(): Promise<ProfileSchema[]> {
    return await profilesCollection.find().toArray()
};

export async function CreateProfile(data: ProfileSchema): Promise<ObjectId | undefined> {
    const user = await ReadUser(data._userID)

    if (!user) {
        console.log('user not found')
        return undefined;
    } else {
        const profile = await ReadProfile(user._id)

        if (profile) {
            console.log('user already has a profile')
            return undefined;
        } else {
            return await profilesCollection.insertOne(data)
        }
    }
};

export async function ReadProfile(id: ObjectId): Promise<ProfileSchema | undefined> {
    return await profilesCollection.findOne({ _userID: new ObjectId(id) });
};

export async function UpdateProfile(id: ObjectId, data: Partial<ProfileSchema>): Promise<unknown | undefined> {
    const result = await profilesCollection.updateOne(
        { _userID: new ObjectId(id) },
        { $set: data as Partial<ProfileSchema> }
    );

    if (result.modifiedCount === 1) {
        return ReadProfile(id);
    } else {
        return undefined;
    }
}

export async function DeleteProfile(id: ObjectId): Promise<number> {
    return await profilesCollection.deleteOne({ _userID: new ObjectId(id) });
};
