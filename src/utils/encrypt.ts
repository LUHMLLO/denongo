import { bcrypt } from "../../deps.ts";

// const secret = 'the secret key must remain a secret'

export async function Salt() {
    return await bcrypt.genSalt(16);
}

export async function HashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, await Salt());
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

export async function VerifyPassword(plain: string, previouslyHashed: string): Promise<boolean> {
    try {
        return await bcrypt.compare(plain, previouslyHashed);
    } catch (error) {
        console.error("Error verifying password:", error);
        throw error;
    }
}
