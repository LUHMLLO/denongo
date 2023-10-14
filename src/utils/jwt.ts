import { Payload, create, load, verify } from "../../deps.ts";

const env = await load();
const SECRET_KEY = env["SECRET_KEY"];

if (!SECRET_KEY) {
    throw new Error("No Token Decoder Was Found");
}

const encoder = new TextEncoder();
const keyData = encoder.encode(SECRET_KEY);

const algorithm = { name: "HMAC", hash: "SHA-512" };
const key = await crypto.subtle.importKey("raw", keyData, algorithm, false, ["sign", "verify"]);

export async function CreateJWT(payload: unknown): Promise<string> {
    return await create({ alg: "HS512", typ: "JWT" }, { data: payload }, key);
}

export async function VerifyJWT(jwt: string): Promise<Payload | Error> {
    try {
        return await verify(jwt, key)
    } catch (error) {
        // console.error(error)
        return Error(error);
    }
}
