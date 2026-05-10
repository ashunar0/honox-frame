import { createRoute } from "honox/factory";
import * as contacts from "../../../../../data/contacts";
import { getDb } from "../../../../../data/db";
import * as orgs from "../../../../../data/organizations";
import ContactsEditPage from "../../../../../features/contacts/ContactsEditPage";

export default createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();

  const db = getDb(c.env.DB);
  const contact = await contacts.get(db, id);
  if (!contact) return c.notFound();

  const { items: organizations } = await orgs.list(db, { perPage: 1000 });

  return c.render(ContactsEditPage, { contact, organizations });
});
