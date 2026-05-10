import type { Context } from "hono";
import { createRoute } from "honox/factory";
import * as contacts from "../../../../data/contacts";
import { getDb, type Db } from "../../../../data/db";
import * as orgs from "../../../../data/organizations";
import type {
  Organization,
  OrganizationInput,
} from "../../../../data/organizations";
import OrganizationsDetailPage from "../../../../features/organizations/OrganizationsDetailPage";
import OrganizationsEditPage from "../../../../features/organizations/OrganizationsEditPage";

export const GET = createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const db = getDb(c.env.DB);
  const organization = await orgs.get(db, id);
  if (!organization) return c.notFound();
  const orgContacts = await contacts.listByOrganization(db, id);
  return c.render(OrganizationsDetailPage, {
    organization,
    contacts: orgContacts,
  });
});

export const POST = createRoute(async (c) => {
  const id = c.req.param("id");
  if (!id) return c.notFound();
  const db = getDb(c.env.DB);
  const organization = await orgs.get(db, id);
  if (!organization) return c.notFound();

  const body = await c.req.parseBody();
  if (stringValue(body._method).toUpperCase() === "DELETE") {
    return handleDelete(c, db, organization);
  }
  return handleUpdate(c, db, organization, body);
});

async function handleDelete(c: Context, db: Db, organization: Organization) {
  await orgs.remove(db, organization.id);
  return c.forward("/organizations", {
    flash: { success: `Organization "${organization.name}" deleted` },
  });
}

async function handleUpdate(
  c: Context,
  db: Db,
  organization: Organization,
  body: Record<string, unknown>,
) {
  const values = parseInput(body);
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    c.status(422);
    return c.render(OrganizationsEditPage, { organization, values, errors });
  }
  await orgs.update(db, organization.id, values);
  return c.forward(`/organizations/${organization.id}`, {
    flash: { success: "Organization updated" },
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
