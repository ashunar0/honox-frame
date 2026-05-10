import { eq } from "drizzle-orm";
import { users } from "../../db/schema";
import type { Db } from "./db";

export type { User } from "../../db/schema";
import type { User } from "../../db/schema";

export async function get(db: Db, id: string): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row;
}

export async function findByEmail(
  db: Db,
  email: string,
): Promise<User | undefined> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return row;
}
