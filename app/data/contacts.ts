import * as orgs from "./organizations";
import type { Organization } from "./organizations";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  organizationId: string;
  createdAt: string;
};

export type ContactInput = Omit<Contact, "id" | "createdAt">;

export type ContactWithOrganization = Contact & {
  organization?: Organization;
};

const store = new Map<string, Contact>();

const allOrgs = orgs.list({ perPage: 100 }).items;
const orgByName = new Map(allOrgs.map((o) => [o.name, o]));

type SeedContact = Omit<ContactInput, "organizationId"> & { orgName: string };

const seed: SeedContact[] = [
  { firstName: "John", lastName: "Smith", email: "john@acme.example", phone: "03-1111-1001", city: "Tokyo", country: "Japan", orgName: "Acme Inc." },
  { firstName: "Jane", lastName: "Doe", email: "jane@acme.example", phone: "03-1111-1002", city: "Tokyo", country: "Japan", orgName: "Acme Inc." },
  { firstName: "Hank", lastName: "Scorpio", email: "hank@globex.example", phone: "03-3333-2001", city: "Yokohama", country: "Japan", orgName: "Globex Corp." },
  { firstName: "Peter", lastName: "Gibbons", email: "peter@initech.example", phone: "06-5555-3001", city: "Osaka", country: "Japan", orgName: "Initech" },
  { firstName: "Bill", lastName: "Lumbergh", email: "bill@initech.example", phone: "06-5555-3002", city: "Osaka", country: "Japan", orgName: "Initech" },
  { firstName: "Albert", lastName: "Wesker", email: "wesker@umbrella.example", phone: "+1-555-4001", city: "Raccoon City", country: "USA", orgName: "Umbrella Corporation" },
  { firstName: "Tony", lastName: "Stark", email: "tony@stark.example", phone: "+1-212-555-5001", city: "New York", country: "USA", orgName: "Stark Industries" },
  { firstName: "Pepper", lastName: "Potts", email: "pepper@stark.example", phone: "+1-212-555-5002", city: "New York", country: "USA", orgName: "Stark Industries" },
  { firstName: "Bruce", lastName: "Wayne", email: "bruce@wayne.example", phone: "+1-212-555-6001", city: "Gotham", country: "USA", orgName: "Wayne Enterprises" },
  { firstName: "Lucius", lastName: "Fox", email: "lucius@wayne.example", phone: "+1-212-555-6002", city: "Gotham", country: "USA", orgName: "Wayne Enterprises" },
  { firstName: "Miles", lastName: "Dyson", email: "miles@cyberdyne.example", phone: "+1-310-555-7001", city: "Sunnyvale", country: "USA", orgName: "Cyberdyne Systems" },
];

for (const { orgName, ...rest } of seed) {
  const org = orgByName.get(orgName);
  if (!org) continue;
  const id = crypto.randomUUID();
  store.set(id, {
    ...rest,
    organizationId: org.id,
    id,
    createdAt: new Date().toISOString(),
  });
}

type ListOptions = {
  search?: string;
  page?: number;
  perPage?: number;
};

export type ListResult = {
  items: ContactWithOrganization[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export function list({ search, page = 1, perPage = 10 }: ListOptions = {}): ListResult {
  const all = Array.from(store.values()).sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`),
  );
  const filtered = search
    ? all.filter((c) =>
        [c.firstName, c.lastName, c.email, c.city, c.country].some((field) =>
          field.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : all;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = filtered.slice(start, start + perPage).map((c) => ({
    ...c,
    organization: orgs.get(c.organizationId),
  }));
  return { items, total, page: safePage, perPage, totalPages };
}

export function get(id: string): ContactWithOrganization | undefined {
  const contact = store.get(id);
  if (!contact) return undefined;
  return { ...contact, organization: orgs.get(contact.organizationId) };
}

export function create(input: ContactInput): Contact {
  const id = crypto.randomUUID();
  const contact: Contact = { ...input, id, createdAt: new Date().toISOString() };
  store.set(id, contact);
  return contact;
}

export function update(id: string, input: Partial<ContactInput>): Contact | undefined {
  const current = store.get(id);
  if (!current) return undefined;
  const next = { ...current, ...input };
  store.set(id, next);
  return next;
}

export function remove(id: string): boolean {
  return store.delete(id);
}

export function count(): number {
  return store.size;
}

export function listByOrganization(organizationId: string): Contact[] {
  return Array.from(store.values())
    .filter((c) => c.organizationId === organizationId)
    .sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`),
    );
}
