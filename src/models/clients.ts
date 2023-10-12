import { ObjectId } from "../../deps.ts";

export interface ClientSchema {
    _id: ObjectId;
    _userID: ObjectId;
    addresses: string[];
    fullname: string;
    phone: string;
}