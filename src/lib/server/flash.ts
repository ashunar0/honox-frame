import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const COOKIE_NAME = "__honox_flash";

export type FlashPayload = Record<string, unknown>;

export function setFlash(c: Context, payload: FlashPayload): void {
  setCookie(c, COOKIE_NAME, JSON.stringify(payload), {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 30,
  });
}

export function consumeFlash(c: Context): FlashPayload | null {
  const raw = getCookie(c, COOKIE_NAME);
  if (!raw) return null;
  deleteCookie(c, COOKIE_NAME, { path: "/" });
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as FlashPayload;
    return null;
  } catch {
    return null;
  }
}
