import { create, load, Payload, verify } from "@/deps.ts";

const SECRET_KEY = (await load())["SECRET_KEY"];

if (!SECRET_KEY) {
  throw new Error("No Token Decoder Was Found");
}

const algorithm = { name: "HMAC", hash: "SHA-512" };
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET_KEY), algorithm, false, ["sign", "verify"]);

export async function CreateJWT(payload: unknown): Promise<string> {
  return await create({ alg: "HS512", typ: "JWT" }, { data: payload }, key);
}

export async function VerifyJWT(jwt: string): Promise<Payload | Error> {
  try {
    return await verify(jwt, key);
  } catch (error) {
    return Error(error);
  }
}
