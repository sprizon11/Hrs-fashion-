import { defineConfig } from "drizzle-kit";

const dbUrl = process.env["DATABASE_URL"] ?? `file:hrs-fashion.db`;

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: dbUrl,
  },
});
