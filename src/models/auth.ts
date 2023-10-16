import { VerifyPassword } from "@/utils/encrypt.ts";
import { UserSchema, usersCollection } from "@/models/users.ts";

export async function Login(username: string, password: string): Promise<UserSchema | Error> {
  const record = await usersCollection.findOne({ username: username });

  if (!record) {
    return Error("username not valid");
  }

  const isValid = await VerifyPassword(password, record.password);

  if (!isValid) {
    return Error("password not valid");
  }

  return record;
}
