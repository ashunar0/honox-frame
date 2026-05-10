import { createRoute } from "honox/factory";
import * as orgs from "../../../data/organizations";
import type { OrganizationInput } from "../../../data/organizations";
import OrganizationsListPage from "../../../features/organizations/OrganizationsListPage";
import OrganizationsNewPage from "../../../features/organizations/OrganizationsNewPage";

export const GET = createRoute((c) => {
  const search = c.req.query("search") ?? "";
  const page = Number(c.req.query("page") ?? 1) || 1;
  const result = orgs.list({ search: search || undefined, page });

  return c.render(OrganizationsListPage, { result, search });
});

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
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
    return c.render(OrganizationsNewPage, { values, errors });
  }

  const created = orgs.create(values);
  return c.forward("/organizations", {
    flash: { success: `Organization 「${created.name}」 を作成したのだ` },
  });
});

function stringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}
