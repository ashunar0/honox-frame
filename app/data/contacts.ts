import { asc, eq, like, or, sql } from "drizzle-orm";
import { contacts, organizations } from "../../db/schema";
import type { Db } from "./db";
import type { Contact } from "../../db/schema";
import type { Organization } from "../../db/schema";

export type { Contact } from "../../db/schema";

export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  organizationId: string;
};

export type ContactWithOrganization = Contact & {
  organization?: Organization;
};

export type ListResult = {
  items: ContactWithOrganization[];
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
    like(contacts.firstName, term),
    like(contacts.lastName, term),
    like(contacts.email, term),
    like(contacts.city, term),
    like(contacts.country, term),
  );
}

export async function list(
  db: Db,
  { search, page = 1, perPage = 10 }: ListOptions = {},
): Promise<ListResult> {
  const where = searchWhere(search);
  const totalRows = await db
    .select({ c: sql<number>`count(*)` })
    .from(contacts)
    .where(where);
  const total = Number(totalRows[0]?.c ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const rows = await db
    .select({ contact: contacts, organization: organizations })
    .from(contacts)
    .leftJoin(organizations, eq(contacts.organizationId, organizations.id))
    .where(where)
    .orderBy(asc(contacts.lastName), asc(contacts.firstName))
    .limit(perPage)
    .offset((safePage - 1) * perPage);

  const items: ContactWithOrganization[] = rows.map((row) => ({
    ...row.contact,
    organization: row.organization ?? undefined,
  }));

  return { items, total, page: safePage, perPage, totalPages };
}

export async function get(
  db: Db,
  id: string,
): Promise<ContactWithOrganization | undefined> {
  const [row] = await db
    .select({ contact: contacts, organization: organizations })
    .from(contacts)
    .leftJoin(organizations, eq(contacts.organizationId, organizations.id))
    .where(eq(contacts.id, id))
    .limit(1);
  if (!row) return undefined;
  return { ...row.contact, organization: row.organization ?? undefined };
}

export async function create(db: Db, input: ContactInput): Promise<Contact> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await db.insert(contacts).values({ ...input, id, createdAt });
  return { ...input, id, createdAt };
}

export async function update(
  db: Db,
  id: string,
  input: Partial<ContactInput>,
): Promise<Contact | undefined> {
  const [updated] = await db
    .update(contacts)
    .set(input)
    .where(eq(contacts.id, id))
    .returning();
  return updated;
}

export async function remove(db: Db, id: string): Promise<boolean> {
  const result = await db.delete(contacts).where(eq(contacts.id, id));
  return (result.meta?.changes ?? 0) > 0;
}

export async function count(db: Db): Promise<number> {
  const rows = await db.select({ c: sql<number>`count(*)` }).from(contacts);
  return Number(rows[0]?.c ?? 0);
}

export async function listByOrganization(
  db: Db,
  organizationId: string,
): Promise<Contact[]> {
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.organizationId, organizationId))
    .orderBy(asc(contacts.lastName), asc(contacts.firstName));
}
