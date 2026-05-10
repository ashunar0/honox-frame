import { createRoute } from "honox/factory";
import { logout } from "../../../lib/auth";

export const POST = createRoute((c) => {
  logout(c);
  return c.redirect("/login", 303);
});
