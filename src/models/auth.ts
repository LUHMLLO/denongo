import { VerifyPassword } from "../utils/encrypt.ts";
import { UserSchema, usersCollection } from "./users.ts";

export async function Login(username: string, password: string): Promise<UserSchema | Error> {
    const user = await usersCollection.findOne({ username: username });

    if (!user) {
        return Error('username not valid')
    }

    const isValid = await VerifyPassword(password, user.password)

    if (!isValid) {
        return Error('password not valid')
    }

    return user
};