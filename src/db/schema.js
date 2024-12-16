import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  is_staff: boolean("is_staff").notNull().default(false),
  google_access_token: text("google_access_token"),
  google_refresh_token: text("google_refresh_token"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const eventsTable = pgTable("events", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: text("location"),
  img: text("img"),
  created_by: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").unique().notNull(),
});

export const tagsTable = pgTable("tags", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").unique().notNull(),
});

export const eventCategoriesTable = pgTable("event_categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  event_id: uuid("event_id")
    .references(() => eventsTable.id)
    .notNull(),
  category_id: uuid("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const eventTagsTable = pgTable("event_tags", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  event_id: uuid("event_id")
    .references(() => eventsTable.id)
    .notNull(),
  tag_id: uuid("tag_id")
    .references(() => tagsTable.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const favoritesTable = pgTable("favorites", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  event_id: uuid("event_id")
    .references(() => eventsTable.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const eventSignupsTable = pgTable("event_signups", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  event_id: uuid("event_id")
    .references(() => eventsTable.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});