import { ObjectId } from "../../deps.ts";
import db from "../db.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
}

const usersCollection = db.collection<UserSchema>("users");

export async function allUsers(): Promise<UserSchema[]> {
    return await usersCollection.find().toArray()
};

export async function insertUser(username: string, password: string): Promise<ObjectId> {
    return await usersCollection.insertOne({
        username,
        password
    })
};