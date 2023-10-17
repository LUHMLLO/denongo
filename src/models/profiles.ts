import { ObjectId } from "@/deps.ts";
import db from "@/db.ts";

export interface ProfileSchema {
  _id: ObjectId;
  _userID: ObjectId;
  avatar: string;
  fullname: string;
  email: string;
  phone: string;
  addressess: string[];
}

export const ProfilesCollection = db.collection<ProfileSchema>("profiles");

export async function AllProfiles(): Promise<ProfileSchema[]> {
  return await ProfilesCollection.find().toArray();
}

export async function CreateProfile(data: ProfileSchema): Promise<ObjectId | Error> {
  const record = await ProfilesCollection.findOne({ _userID: data._userID });

  if (!record) {
    return await ProfilesCollection.insertOne(data);
  }

  return Error("User already has a profile");
}

export async function ReadProfile(id: ObjectId): Promise<ProfileSchema | Error> {
  const record = await ProfilesCollection.findOne({ _id: new ObjectId(id) });

  return record ? record : Error("Invalid reference");
}

export async function UpdateProfile(data: ProfileSchema): Promise<ProfileSchema | Error> {
  const record = await ReadProfile(data._id)

  if (record instanceof Error) {
    return Error("Invalid reference");
  }

  const result = await ProfilesCollection.updateOne(
    { _id: new ObjectId(record._id) },
    { $set: data },
  );

  return result.modifiedCount !== 0 ? await ReadProfile(record._id) : Error("No change was detected");
}

export async function DeleteProfile(id: ObjectId): Promise<number> {
  return await ProfilesCollection.deleteOne({ _id: new ObjectId(id) });
}
