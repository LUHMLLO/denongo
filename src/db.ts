import { MongoClient } from "@/deps.ts";

const client = new MongoClient();

await client.connect(
  "mongodb+srv://luhmllo06:Uicg2Q2T2f8lnx6I@lab001.1nxvejt.mongodb.net/denongo?authMechanism=SCRAM-SHA-1",
);

const db = client.database("deno_lab");

export default db;
