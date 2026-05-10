import { createRoute } from "honox/factory";
import * as orgs from "../../../data/organizations";
import ContactsNewPage from "../../../features/contacts/ContactsNewPage";

export default createRoute((c) => {
  const organizations = orgs.list({ perPage: 1000 }).items;
  return c.render(ContactsNewPage, { organizations });
});
