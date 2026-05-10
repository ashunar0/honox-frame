import type { Context } from "hono";
import { createRoute } from "honox/factory";
import * as contacts from "../../../../data/contacts";
import * as orgs from "../../../../data/organizations";
import type {
  Organization,
  OrganizationInput,
} from "../../../../data/organizations";
import OrganizationsDetailPage from "../../../../features/organizations/OrganizationsDetailPage";
import OrganizationsEditPage from "../../../../features/organizations/OrganizationsEditPage";

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
  if (stringValue(body._method).toUpperCase() === "DELETE") {
    return handleDelete(c, organization);
  }
  return handleUpdate(c, organization, body);
});

function handleDelete(c: Context, organization: Organization) {
  orgs.remove(organization.id);
  return c.forward("/organizations", {
    flash: { success: `Organization 「${organization.name}」 を削除したのだ` },
  });
}

function handleUpdate(
  c: Context,
  organization: Organization,
  body: Record<string, unknown>,
) {
  const values = parseInput(body);
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    c.status(422);
    return c.render(OrganizationsEditPage, { organization, values, errors });
  }
  orgs.update(organization.id, values);
  return c.forward(`/organizations/${organization.id}`, {
    flash: { success: "Organization を更新したのだ" },
  });
}

function parseInput(body: Record<string, unknown>): OrganizationInput {
  return {
    name: stringValue(body.name).trim(),
    email: stringValue(body.email).trim(),
    phone: stringValue(body.phone).trim(),
    city: stringValue(body.city).trim(),
    country: stringValue(body.country).trim(),
  };
}

function validate(values: OrganizationInput) {
  const errors: Partial<Record<keyof OrganizationInput, string>> = {};
  if (!values.name) errors.name = "Name is required";
  return errors;
}

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
