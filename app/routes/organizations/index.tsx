import { createRoute } from "honox/factory";
import * as orgs from "../../data/organizations";
import OrganizationsListPage from "../../features/organizations/OrganizationsListPage";

export const GET = createRoute((c) => {
  const search = c.req.query("search") ?? "";
  const page = Number(c.req.query("page") ?? 1) || 1;
  const result = orgs.list({ search: search || undefined, page });

  return c.render(OrganizationsListPage, { result, search });
});
