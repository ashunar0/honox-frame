export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
};

const store = new Map<string, User>();

const seed: User[] = [
  {
    id: "user-1",
    email: "admin@acme.example",
    name: "Admin",
    password: "password",
  },
];

for (const user of seed) {
  store.set(user.id, user);
}

export function get(id: string): User | undefined {
  return store.get(id);
}

export function findByEmail(email: string): User | undefined {
  return Array.from(store.values()).find((u) => u.email === email);
}
