import { createRoute } from "honox/factory";
import OrganizationsNewPage from "../../../features/organizations/OrganizationsNewPage";

export default createRoute((c) => {
  return c.render(OrganizationsNewPage, {});
});
