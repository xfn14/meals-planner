// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `meals-planner_${name}`);

export const meals = createTable(
  "meals",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).unique().notNull(),
    orgId: d.varchar({ length: 36 }).notNull(),
    authorId: d.varchar({ length: 36 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const likes = createTable(
  "likes",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    mealId: d
      .integer()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    userId: d.varchar({ length: 36 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("meal_id_idx").on(t.mealId),
    index("user_id_idx").on(t.userId),
    index("meal_user_idx").on(t.mealId, t.userId),
  ],
);

export const mealHistory = createTable(
  "meal_history",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    mealId: d
      .integer()
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("meal_history_meal_id_idx").on(t.mealId),
    index("meal_history_created_at_idx").on(t.createdAt),
  ],
);

export const mealEatenBy = createTable(
  "meal_eaten_by",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    mealHistoryId: d
      .integer()
      .notNull()
      .references(() => mealHistory.id, { onDelete: "cascade" }),
    userId: d.varchar({ length: 36 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("meal_eaten_by_history_id_idx").on(t.mealHistoryId),
    index("meal_eaten_by_user_id_idx").on(t.userId),
    index("meal_eaten_by_history_user_idx").on(t.mealHistoryId, t.userId),
  ],
);
