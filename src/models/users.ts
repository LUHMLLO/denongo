import { ObjectId } from "../../deps.ts";
import db from "../db.ts";
import { HashPassword } from "../utils/encrypt.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
}

export const usersCollection = db.collection<UserSchema>("users");


export async function AllUsers(): Promise<UserSchema[]> {
    return await usersCollection.find().toArray()
};

export async function CreateUser(username: string, password: string): Promise<ObjectId> {
    return await usersCollection.insertOne({
        username,
        password: await HashPassword(password)
    })
};

export async function ReadUser(id: ObjectId): Promise<UserSchema | undefined> {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
};

export async function UpdateUser(id: ObjectId, data: Partial<UserSchema>): Promise<unknown | undefined> {
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data as Partial<UserSchema> }
    );

    if (result.modifiedCount === 1) {
        return ReadUser(id);
    } else {
        return undefined;
    }
}

export async function DeleteUser(id: ObjectId): Promise<number> {
    return await usersCollection.deleteOne({ _id: new ObjectId(id) });
};


