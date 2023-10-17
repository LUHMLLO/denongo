import { ObjectId } from "@/deps.ts";
import db from "@/db.ts";
import { HashPassword } from "@utils/encrypt.ts";

export interface UserSchema {
  _id: ObjectId;
  username: string;
  password: string;
}

export const UsersCollection = db.collection<UserSchema>("users");

export async function AllUsers(): Promise<UserSchema[]> {
  return await UsersCollection.find({}, { projection: { password: 0 } }).toArray();
}

export async function CreateUser(username: string, password: string): Promise<ObjectId | Error> {
  const record = await UsersCollection.findOne({ username: username });

  if (!record) {
    return await UsersCollection.insertOne({
      username,
      password: await HashPassword(password),
    });
  }

  return Error("Username not available");
}

export async function ReadUser(id: ObjectId): Promise<UserSchema | Error> {
  const record = await UsersCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

  return record ? record : Error("Invalid reference");
}

export async function UpdateUser(data: UserSchema): Promise<UserSchema | Error> {
  const record = await ReadUser(data._id)

  if (record instanceof Error) {
    return Error("Invalid reference");
  }

  const result = await UsersCollection.updateOne(
    { _id: new ObjectId(record._id) },
    { $set: data },
  );

  return result.modifiedCount !== 0 ? await ReadUser(record._id) : Error("No change was detected");
}

export async function DeleteUser(id: ObjectId): Promise<number> {
  return await UsersCollection.deleteOne({ _id: new ObjectId(id) });
}
