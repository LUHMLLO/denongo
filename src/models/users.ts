import { ObjectId } from "@/deps.ts";
import db from "@/db.ts";
import { HashPassword } from "@/utils/encrypt.ts";

export interface UserSchema {
  _id: ObjectId;
  username: string;
  password: string;
}

export const usersCollection = db.collection<UserSchema>("users");

export async function AllUsers(): Promise<UserSchema[]> {
  return await usersCollection.find().toArray();
}

export async function CreateUser(username: string, password: string): Promise<ObjectId | Error> {
  const record = await usersCollection.findOne({ username: username });

  if (!record) {
    return await usersCollection.insertOne({
      username,
      password: await HashPassword(password),
    });
  }

  return Error("Username not available");
}

export async function ReadUser(id: ObjectId): Promise<UserSchema | Error> {
  const record = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (!record) {
    return Error("Invalid reference");
  }

  return record;
}

export async function UpdateUser(data: UserSchema): Promise<UserSchema | Error> {

  const record = await ReadUser(data._id)

  if (record instanceof Error) {
    return Error("Invalid reference");
  }

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(record._id) },
    { $set: data },
  );

  if (result.modifiedCount != 0) {
    return await ReadUser(record._id);
  }

  return Error("No change was detected");
}

export async function DeleteUser(id: ObjectId): Promise<number> {
  return await usersCollection.deleteOne({ _id: new ObjectId(id) });
}
