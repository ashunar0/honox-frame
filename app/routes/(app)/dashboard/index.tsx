import { createRoute } from "honox/factory";
import * as contacts from "../../../data/contacts";
import { getDb, type Db } from "../../../data/db";
import * as orgs from "../../../data/organizations";
import DashboardPage, {
  type Stats,
} from "../../../features/dashboard/DashboardPage";

const fetchStats = async (db: Db): Promise<Stats> => ({
  organizations: await orgs.count(db),
  contacts: await contacts.count(db),
  fetchedAt: new Date().toISOString(),
});

export default createRoute((c) => {
  const db = getDb(c.env.DB);
  return c.render(DashboardPage, { stats: () => fetchStats(db) });
});
