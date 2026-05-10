import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default(""),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type OrganizationInsert = typeof organizations.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type ContactInsert = typeof contacts.$inferInsert;
export type User = typeof users.$inferSelect;
