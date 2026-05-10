import { createRoute } from "honox/factory";
import * as contacts from "../../data/contacts";
import * as orgs from "../../data/organizations";
import DashboardPage from "../../features/dashboard/DashboardPage";

export default createRoute((c) => {
  return c.render(DashboardPage, {
    stats: {
      organizations: orgs.count(),
      contacts: contacts.count(),
    },
  });
});
