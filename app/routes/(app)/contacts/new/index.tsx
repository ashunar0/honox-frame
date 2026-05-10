import { createRoute } from "honox/factory";
import { getDb } from "../../../../data/db";
import * as orgs from "../../../../data/organizations";
import ContactsNewPage from "../../../../features/contacts/ContactsNewPage";

export default createRoute(async (c) => {
  const db = getDb(c.env.DB);
  const { items: organizations } = await orgs.list(db, { perPage: 1000 });
  return c.render(ContactsNewPage, { organizations });
});
