import { VerifyPassword } from "../utils/encrypt.ts";
import { UserSchema, usersCollection } from "./users.ts";

export async function Login(username: string, password: string): Promise<UserSchema | undefined> {
    const user = await usersCollection.findOne({ username: username });

    if (await VerifyPassword(password, user!.password)) {
        return user
    }
    else {
        return undefined
    }

};