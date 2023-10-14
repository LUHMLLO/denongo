import { ObjectId } from "../../deps.ts";
import db from "../db.ts";
import { HashPassword } from "../utils/encrypt.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
}

export const usersCollection = db.collection<UserSchema>("users");

export async function AllUsers(): Promise<UserSchema[] | Error> {
    const list = await usersCollection.find().toArray()

    if (list.length <= 0) {
        return Error('No Users Where Found')
    }

    return list;
};

export async function CreateUser(username: string, password: string): Promise<ObjectId | Error> {
    const user = await usersCollection.findOne({ username: username });

    if (!user) {
        return await usersCollection.insertOne({
            username,
            password: await HashPassword(password)
        })
    }

    return Error('User already exists')
};

export async function ReadUser(id: ObjectId): Promise<UserSchema | Error> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })

    if (!user) {
        return Error('User not found')
    }

    return user;
};

export async function UpdateUser(data: UserSchema): Promise<UserSchema | Error> {
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(data._id) },
        { $set: data }
    );

    if (result.modifiedCount != 0) {
        return await ReadUser(data._id);
    }

    return Error('User was not updated');
}

export async function DeleteUser(id: ObjectId): Promise<number | Error> {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (!result) {
        return Error('Cannot delete user');
    }

    return result;
};
