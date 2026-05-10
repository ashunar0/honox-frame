import { createRoute } from "honox/factory";
import * as contacts from "../../../data/contacts";
import * as orgs from "../../../data/organizations";
import DashboardPage, {
  type Stats,
} from "../../../features/dashboard/DashboardPage";

const fetchStats = (): Stats => ({
  organizations: orgs.count(),
  contacts: contacts.count(),
  fetchedAt: new Date().toISOString(),
});

export default createRoute((c) => {
  return c.render(DashboardPage, { stats: fetchStats });
});
