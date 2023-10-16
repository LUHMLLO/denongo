import { VerifyPassword } from "@/utils/encrypt.ts";
import { UserSchema, usersCollection } from "@/models/users.ts";

export async function Login(username: string, password: string): Promise<UserSchema | Error> {
  const record = await usersCollection.findOne({ username: username });

  return !record
    ? Error("username not valid")
    : (await VerifyPassword(password, record.password))
      ? record
      : Error("password not valid");
}
