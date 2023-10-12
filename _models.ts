import { ObjectId } from "./_deps.ts";

export interface UserSchema {
    _id: ObjectId;
    username: string;
    password: string;
}

export interface ProfileSchema {
    _id: ObjectId;
    _userID: ObjectId;
    email: string;
    role: string;
}

export interface ClientSchema {
    _id: ObjectId;
    _userID: ObjectId;
    addresses: string[];
    fullname: string;
    phone: string;
}