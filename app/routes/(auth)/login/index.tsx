import { createRoute } from "honox/factory";
import { getDb } from "../../../data/db";
import * as users from "../../../data/users";
import LoginPage from "../../../features/auth/LoginPage";
import { login, verifyPassword } from "../../../lib/auth";

export const GET = createRoute((c) => {
  return c.render(LoginPage, {});
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const email = stringValue(body.email).trim();
  const password = stringValue(body.password);

  const db = getDb(c.env.DB);
  const user = await users.findByEmail(db, email);
  if (!user || !(await verifyPassword(password, user.passwordHash, user.passwordSalt))) {
    c.status(422);
    return c.render(LoginPage, {
      values: { email },
      error: "Invalid email or password",
    });
  }

  await login(c, user.id);
  return c.forward("/dashboard", {
    flash: { success: `Welcome back, ${user.name}` },
  });
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
