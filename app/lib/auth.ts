import type { Context } from "hono";
import {
  deleteCookie,
  getSignedCookie,
  setSignedCookie,
} from "hono/cookie";
import { getDb } from "../data/db";
import * as users from "../data/users";
import type { User } from "../data/users";

const COOKIE_NAME = "__honox_session";
const FALLBACK_SECRET = "dev-secret-change-me";

function getSecret(c: Context): string {
  return c.env?.SESSION_SECRET ?? FALLBACK_SECRET;
}

export async function login(c: Context, userId: string): Promise<void> {
  await setSignedCookie(c, COOKIE_NAME, userId, getSecret(c), {
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
  const userId = await getSignedCookie(c, getSecret(c), COOKIE_NAME);
  if (!userId || typeof userId !== "string") return null;
  const db = getDb(c.env.DB);
  const user = await users.get(db, userId);
  return user ?? null;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string,
): Promise<boolean> {
  const data = new TextEncoder().encode(storedSalt + password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(hex, storedHash);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
