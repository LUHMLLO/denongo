import { create, verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

(async () => {
    const key = await crypto.subtle.generateKey(
        { name: "HMAC", hash: "SHA-512" },
        true,
        ["sign", "verify"]
    );

    const jwt = create({ alg: "HS512", typ: "JWT" }, { data: "secret" }, key);
    const payload = await verify(await jwt, key);

    console.log(payload);
})();
