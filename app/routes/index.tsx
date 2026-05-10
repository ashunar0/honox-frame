import { createRoute } from "honox/factory";
import { getCurrentUser } from "../lib/auth";

export default createRoute(async (c) => {
  const user = await getCurrentUser(c);
  return c.redirect(user ? "/dashboard" : "/login", 302);
});
