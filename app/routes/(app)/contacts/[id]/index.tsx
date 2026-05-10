import type { Context } from "hono";
import { createRoute } from "honox/factory";
import * as contacts from "../../../../data/contacts";
import type { Contact, ContactInput } from "../../../../data/contacts";
import * as orgs from "../../../../data/organizations";
import ContactsDetailPage from "../../../../features/contacts/ContactsDetailPage";
import ContactsEditPage from "../../../../features/contacts/ContactsEditPage";

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
  if (stringValue(body._method).toUpperCase() === "DELETE") {
    return handleDelete(c, contact);
  }
  return handleUpdate(c, contact, body);
});

function handleDelete(c: Context, contact: Contact) {
  contacts.remove(contact.id);
  return c.forward("/contacts", {
    flash: {
      success: `Contact 「${contact.firstName} ${contact.lastName}」 を削除したのだ`,
    },
  });
}

function handleUpdate(
  c: Context,
  contact: Contact,
  body: Record<string, unknown>,
) {
  const values = parseInput(body);
  const errors = validate(values);
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
  contacts.update(contact.id, values);
  return c.forward(`/contacts/${contact.id}`, {
    flash: { success: "Contact を更新したのだ" },
  });
}

function parseInput(body: Record<string, unknown>): ContactInput {
  return {
    firstName: stringValue(body.firstName).trim(),
    lastName: stringValue(body.lastName).trim(),
    email: stringValue(body.email).trim(),
    phone: stringValue(body.phone).trim(),
    city: stringValue(body.city).trim(),
    country: stringValue(body.country).trim(),
    organizationId: stringValue(body.organizationId).trim(),
  };
}

function validate(values: ContactInput) {
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  if (!values.firstName) errors.firstName = "First name is required";
  if (!values.lastName) errors.lastName = "Last name is required";
  if (!values.organizationId) errors.organizationId = "Organization is required";
  else if (!orgs.get(values.organizationId)) errors.organizationId = "Organization not found";
  return errors;
}

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
