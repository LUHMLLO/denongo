import { ObjectId } from "../../deps.ts";

export interface ProfileSchema {
    _id: ObjectId;
    _userID: ObjectId;
    email: string;
    role: string;
}