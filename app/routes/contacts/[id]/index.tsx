import { createRoute } from "honox/factory";
import * as contacts from "../../../data/contacts";
import type { ContactInput } from "../../../data/contacts";
import * as orgs from "../../../data/organizations";
import ContactsDetailPage from "../../../features/contacts/ContactsDetailPage";
import ContactsEditPage from "../../../features/contacts/ContactsEditPage";

export const GET = createRoute((c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const contact = contacts.get(id);
  if (!contact) return c.notFound();
  return c.render(ContactsDetailPage, { contact });
});

export const POST = createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const contact = contacts.get(id);
  if (!contact) return c.notFound();

  const body = await c.req.parseBody();
  const method = stringValue(body._method).toUpperCase();

  if (method === "DELETE") {
    contacts.remove(id);
    return c.redirect("/contacts", 303);
  }

  const values: ContactInput = {
    firstName: stringValue(body.firstName).trim(),
    lastName: stringValue(body.lastName).trim(),
    email: stringValue(body.email).trim(),
    phone: stringValue(body.phone).trim(),
    city: stringValue(body.city).trim(),
    country: stringValue(body.country).trim(),
    organizationId: stringValue(body.organizationId).trim(),
  };

  const errors: Partial<Record<keyof ContactInput, string>> = {};
  if (!values.firstName) errors.firstName = "First name is required";
  if (!values.lastName) errors.lastName = "Last name is required";
  if (!values.organizationId) errors.organizationId = "Organization is required";
  else if (!orgs.get(values.organizationId)) errors.organizationId = "Organization not found";

  if (Object.keys(errors).length > 0) {
    c.status(422);
    const organizations = orgs.list({ perPage: 1000 }).items;
    return c.render(ContactsEditPage, {
      contact,
      organizations,
      values,
      errors,
    });
  }

  contacts.update(id, values);
  return c.redirect(`/contacts/${id}`, 303);
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
