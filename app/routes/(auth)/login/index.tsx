import { createRoute } from "honox/factory";
import * as users from "../../../data/users";
import LoginPage from "../../../features/auth/LoginPage";
import { login } from "../../../lib/auth";

export const GET = createRoute((c) => {
  return c.render(LoginPage, {});
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const email = stringValue(body.email).trim();
  const password = stringValue(body.password);

  const user = users.findByEmail(email);
  if (!user || user.password !== password) {
    c.status(422);
    return c.render(LoginPage, {
      values: { email },
      error: "Email または password が違うのだ",
    });
  }

  await login(c, user.id);
  return c.redirect("/dashboard", 303);
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
