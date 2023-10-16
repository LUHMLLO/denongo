import { MongoClient } from "@/deps.ts";

const client = new MongoClient();

await client.connect(
  "mongodb+srv://luhmllo06:wbJxjL5FLuPgxvbC@lab001.1nxvejt.mongodb.net/denolabs?authMechanism=SCRAM-SHA-1",
);

const db = client.database("deno_lab");

export default db;
