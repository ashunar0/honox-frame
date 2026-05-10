import { createRoute } from "honox/factory";
import { getDb } from "../../../../../data/db";
import * as orgs from "../../../../../data/organizations";
import OrganizationsEditPage from "../../../../../features/organizations/OrganizationsEditPage";

export default createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const db = getDb(c.env.DB);
  const organization = await orgs.get(db, id);
  if (!organization) return c.notFound();
  return c.render(OrganizationsEditPage, { organization });
});
