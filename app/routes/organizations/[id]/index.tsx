import { createRoute } from "honox/factory";
import * as contacts from "../../../data/contacts";
import * as orgs from "../../../data/organizations";
import type { OrganizationInput } from "../../../data/organizations";
import OrganizationsDetailPage from "../../../features/organizations/OrganizationsDetailPage";
import OrganizationsEditPage from "../../../features/organizations/OrganizationsEditPage";

export const GET = createRoute((c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const organization = orgs.get(id);
  if (!organization) return c.notFound();
  const orgContacts = contacts.listByOrganization(id);
  return c.render(OrganizationsDetailPage, {
    organization,
    contacts: orgContacts,
  });
});

export const POST = createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const organization = orgs.get(id);
  if (!organization) return c.notFound();

  const body = await c.req.parseBody();
  const method = stringValue(body._method).toUpperCase();

  if (method === "DELETE") {
    orgs.remove(id);
    return c.redirect("/organizations", 303);
  }

  const values: OrganizationInput = {
    name: stringValue(body.name).trim(),
    email: stringValue(body.email).trim(),
    phone: stringValue(body.phone).trim(),
    city: stringValue(body.city).trim(),
    country: stringValue(body.country).trim(),
  };

  const errors: Partial<Record<keyof OrganizationInput, string>> = {};
  if (!values.name) errors.name = "Name is required";

  if (Object.keys(errors).length > 0) {
    c.status(422);
    return c.render(OrganizationsEditPage, { organization, values, errors });
  }

  orgs.update(id, values);
  return c.redirect(`/organizations/${id}`, 303);
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
