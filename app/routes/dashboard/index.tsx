import { createRoute } from "honox/factory";
import DashboardPage from "../../features/dashboard/DashboardPage";

export default createRoute((c) => {
  return c.render(DashboardPage, {
    stats: {
      organizations: 0,
      contacts: 0,
    },
  });
});
