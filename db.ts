import { MongoClient, ObjectId } from "./_deps.ts";
import { UserSchema } from "./_models.ts";

const client = new MongoClient();

await client.connect(
    "mongodb+srv://luhmllo06:wbJxjL5FLuPgxvbC@lab001.1nxvejt.mongodb.net/denolabs?authMechanism=SCRAM-SHA-1"
);

const db = client.database("deno_lab");
const usersCollection = db.collection<UserSchema>("users");

export async function allUsers(): Promise<UserSchema[]> {
    return await usersCollection.find().toArray()
};

export async function insertUser(username: string, password: string): Promise<ObjectId> {
    return await usersCollection.insertOne({
        username,
        password
    })
};