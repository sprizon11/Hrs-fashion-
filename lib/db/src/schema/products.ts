import { pgTable, text, doublePrecision, boolean, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  category: text("category").notNull(),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  description: text("description").notNull(),
  details: jsonb("details").$type<string[]>().default([]),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  stock: integer("stock").default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
