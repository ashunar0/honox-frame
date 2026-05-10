import { createRoute } from "honox/factory";
import * as orgs from "../../../../data/organizations";
import OrganizationsEditPage from "../../../../features/organizations/OrganizationsEditPage";

export default createRoute((c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const organization = orgs.get(id);
  if (!organization) return c.notFound();
  return c.render(OrganizationsEditPage, { organization });
});
