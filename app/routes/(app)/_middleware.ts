import { createMiddleware } from "hono/factory";
import { getCurrentUser } from "../../lib/auth";

const auth = createMiddleware(async (c, next) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.redirect("/login", 303);
  }
  c.set("user", user);
  await next();
});

export default [auth];
