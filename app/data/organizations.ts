export type Organization = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  createdAt: string;
};

export type OrganizationInput = Omit<Organization, "id" | "createdAt">;

const store = new Map<string, Organization>();

const seed: OrganizationInput[] = [
  { name: "Acme Inc.", email: "info@acme.example", phone: "03-1111-2222", city: "Tokyo", country: "Japan" },
  { name: "Globex Corp.", email: "hello@globex.example", phone: "03-3333-4444", city: "Yokohama", country: "Japan" },
  { name: "Initech", email: "contact@initech.example", phone: "06-5555-6666", city: "Osaka", country: "Japan" },
  { name: "Umbrella Corporation", email: "info@umbrella.example", phone: "+1-555-0100", city: "Raccoon City", country: "USA" },
  { name: "Stark Industries", email: "press@stark.example", phone: "+1-212-555-0199", city: "New York", country: "USA" },
  { name: "Wayne Enterprises", email: "ir@wayne.example", phone: "+1-212-555-0182", city: "Gotham", country: "USA" },
  { name: "Cyberdyne Systems", email: "info@cyberdyne.example", phone: "+1-310-555-0123", city: "Sunnyvale", country: "USA" },
];

for (const input of seed) {
  const id = crypto.randomUUID();
  store.set(id, { ...input, id, createdAt: new Date().toISOString() });
}

type ListOptions = {
  search?: string;
  page?: number;
  perPage?: number;
};

export type ListResult = {
  items: Organization[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export function list({ search, page = 1, perPage = 10 }: ListOptions = {}): ListResult {
  const all = Array.from(store.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const filtered = search
    ? all.filter((o) =>
        [o.name, o.email, o.city, o.country].some((field) =>
          field.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : all;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = filtered.slice(start, start + perPage);
  return { items, total, page: safePage, perPage, totalPages };
}

export function get(id: string): Organization | undefined {
  return store.get(id);
}

export function create(input: OrganizationInput): Organization {
  const id = crypto.randomUUID();
  const org: Organization = { ...input, id, createdAt: new Date().toISOString() };
  store.set(id, org);
  return org;
}

export function update(id: string, input: Partial<OrganizationInput>): Organization | undefined {
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
