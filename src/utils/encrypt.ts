import { bcrypt } from "@/deps.ts";

export async function Salt() {
  return await bcrypt.genSalt(8);
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
  return await bcrypt.compare(plain, previouslyHashed);
}
