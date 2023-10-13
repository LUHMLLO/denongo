import { Payload, create, verify } from "../../deps.ts";

const keyPromise = crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
) as Promise<CryptoKey>;

export async function GenerateKey(): Promise<CryptoKey> {
    return await keyPromise;
}

export async function CreateJWT(payload: unknown): Promise<string> {
    const key = await GenerateKey();
    return await create({ alg: "HS512", typ: "JWT" }, { data: payload }, key);
}

export async function VerifyJWT(jwt: string): Promise<Payload> {
    const key = await GenerateKey();
    return await verify(jwt, key);
}
