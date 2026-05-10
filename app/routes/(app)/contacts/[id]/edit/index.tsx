import { createRoute } from "honox/factory";
import * as contacts from "../../../../../data/contacts";
import * as orgs from "../../../../../data/organizations";
import ContactsEditPage from "../../../../../features/contacts/ContactsEditPage";

export default createRoute((c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const contact = contacts.get(id);
  if (!contact) return c.notFound();
  const organizations = orgs.list({ perPage: 1000 }).items;
  return c.render(ContactsEditPage, { contact, organizations });
});
