import type { Context } from "hono";
import {
  deleteCookie,
  getSignedCookie,
  setSignedCookie,
} from "hono/cookie";
import * as users from "../data/users";
import type { User } from "../data/users";

const SECRET = "demo-secret-change-me";
const COOKIE_NAME = "__honox_session";

export async function login(c: Context, userId: string): Promise<void> {
  await setSignedCookie(c, COOKIE_NAME, userId, SECRET, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function logout(c: Context): void {
  deleteCookie(c, COOKIE_NAME, { path: "/" });
}

export async function getCurrentUser(c: Context): Promise<User | null> {
  const userId = await getSignedCookie(c, SECRET, COOKIE_NAME);
  if (!userId || typeof userId !== "string") return null;
  return users.get(userId) ?? null;
}
