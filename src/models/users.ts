import { ObjectId } from "../../deps.ts";
import db from "../db.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
}

const usersCollection = db.collection<UserSchema>("users");

export async function AllUsers(): Promise<UserSchema[]> {
    return await usersCollection.find().toArray()
};

export async function CreateUser(username: string, password: string): Promise<ObjectId> {
    return await usersCollection.insertOne({
        username,
        password
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


