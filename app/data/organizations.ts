import { asc, eq, like, or, sql } from "drizzle-orm";
import { organizations } from "../../db/schema";
import type { Db } from "./db";

export type { Organization } from "../../db/schema";
import type { Organization } from "../../db/schema";

export type OrganizationInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
};

export type ListResult = {
  items: Organization[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

type ListOptions = {
  search?: string;
  page?: number;
  perPage?: number;
};

function searchWhere(search: string | undefined) {
  if (!search) return undefined;
  const term = `%${search}%`;
  return or(
    like(organizations.name, term),
    like(organizations.email, term),
    like(organizations.city, term),
    like(organizations.country, term),
  );
}

export async function list(
  db: Db,
  { search, page = 1, perPage = 10 }: ListOptions = {},
): Promise<ListResult> {
  const where = searchWhere(search);
  const totalRows = await db
    .select({ c: sql<number>`count(*)` })
    .from(organizations)
    .where(where);
  const total = Number(totalRows[0]?.c ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const items = await db
    .select()
    .from(organizations)
    .where(where)
    .orderBy(asc(organizations.name))
    .limit(perPage)
    .offset((safePage - 1) * perPage);

  return { items, total, page: safePage, perPage, totalPages };
}

export async function get(db: Db, id: string): Promise<Organization | undefined> {
  const [row] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);
  return row;
}

export async function create(
  db: Db,
  input: OrganizationInput,
): Promise<Organization> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await db.insert(organizations).values({ ...input, id, createdAt });
  return { ...input, id, createdAt };
}

export async function update(
  db: Db,
  id: string,
  input: Partial<OrganizationInput>,
): Promise<Organization | undefined> {
  const [updated] = await db
    .update(organizations)
    .set(input)
    .where(eq(organizations.id, id))
    .returning();
  return updated;
}

export async function remove(db: Db, id: string): Promise<boolean> {
  const result = await db
    .delete(organizations)
    .where(eq(organizations.id, id));
  return (result.meta?.changes ?? 0) > 0;
}

export async function count(db: Db): Promise<number> {
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(organizations);
  return Number(rows[0]?.c ?? 0);
}
