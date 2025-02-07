import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  jsonb,
  serial,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    degree: varchar("degree", { length: 200 }).notNull(),
    specialties: jsonb("specialties").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.firstName, table.lastName),
    cityIdx: index("city_idx").on(table.city),
    nameSearchIdx: index("name_search_idx").on(
      sql`to_tsvector('english', first_name || ' ' || last_name)`
    ),
  })
);

export { advocates };
