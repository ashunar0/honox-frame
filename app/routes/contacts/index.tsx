import { createRoute } from "honox/factory";
import * as contacts from "../../data/contacts";
import type { ContactInput } from "../../data/contacts";
import * as orgs from "../../data/organizations";
import ContactsListPage from "../../features/contacts/ContactsListPage";
import ContactsNewPage from "../../features/contacts/ContactsNewPage";

export const GET = createRoute((c) => {
  const search = c.req.query("search") ?? "";
  const page = Number(c.req.query("page") ?? 1) || 1;
  const result = contacts.list({ search: search || undefined, page });

  return c.render(ContactsListPage, { result, search });
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
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
    return c.render(ContactsNewPage, { organizations, values, errors });
  }

  contacts.create(values);
  return c.redirect("/contacts", 303);
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
